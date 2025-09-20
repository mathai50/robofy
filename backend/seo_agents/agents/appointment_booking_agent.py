"""
Appointment Booking Agent for handling dental appointment scheduling with Google Calendar and Gmail integration.
This module provides functions for availability checking, appointment creation, and patient details logging.
"""
import logging
from typing import Dict, Any, List
from datetime import datetime, timedelta, timezone, time
import os
import base64
from email.message import EmailMessage
import pytz  # For proper timezone handling

# --- Google API Imports ---
# You will need to install these libraries:
# pip install --upgrade google-api-python-client google-auth-httplib2 google-auth-oauthlib
from google.auth.transport.requests import Request
from google.oauth2.credentials import Credentials
from google_auth_oauthlib.flow import InstalledAppFlow
from googleapiclient.discovery import build, Resource
from googleapiclient.errors import HttpError

logger = logging.getLogger(__name__)

# --- Google API Configuration ---
# If modifying these scopes, delete the file token.json.
SCOPES = ["https://www.googleapis.com/auth/calendar", "https://www.googleapis.com/auth/gmail.send"]
# Configurable file paths with environment variable fallbacks
CREDENTIALS_FILE = os.environ.get('GOOGLE_CREDENTIALS_FILE', 'credentials.json')  # Download this from your Google Cloud project
TOKEN_FILE = os.environ.get('GOOGLE_TOKEN_FILE', 'token.json')  # This will be generated on the first run

# Simulated appointment database (fallback if Google Calendar is unavailable)
appointments_db = {}
patient_details_db = {}

def validate_configuration() -> None:
    """
    Validate Google API configuration at startup.
    Raises exceptions for missing or invalid configuration in production.
    """
    environment = os.environ.get('ENVIRONMENT', 'development')
    service_account_file = os.environ.get('GOOGLE_SERVICE_ACCOUNT_FILE')
    credentials_file = os.environ.get('GOOGLE_CREDENTIALS_FILE', CREDENTIALS_FILE)
    
    # Production environment requires service account
    if environment == 'production':
        if not service_account_file:
            raise Exception("GOOGLE_SERVICE_ACCOUNT_FILE environment variable is required for production")
        if not os.path.exists(service_account_file):
            raise FileNotFoundError(f"Service account file not found: {service_account_file}")
        
        # Validate service account file is a valid JSON
        try:
            import json
            with open(service_account_file, 'r') as f:
                json.load(f)
        except Exception as e:
            raise Exception(f"Invalid service account file format: {e}")
    
    # Development environment should have either service account or OAuth credentials
    else:
        if not service_account_file and not os.path.exists(credentials_file):
            logger.warning(
                "Google API not configured. "
                "Set GOOGLE_SERVICE_ACCOUNT_FILE or ensure credentials.json exists. "
                "Appointment booking will use simulated mode."
            )

def get_google_service(api_name: str, api_version: str, scopes: List[str]) -> Resource:
    """
    Handles Google API authentication and returns a service object.
    Prioritizes Service Account authentication for production, falls back to OAuth for development.
    For production non-interactive servers, use Google Cloud Service Account with domain-wide delegation.
    """
    creds = None
    
    # Get configurable file paths from environment variables with fallbacks
    credentials_file = os.environ.get('GOOGLE_CREDENTIALS_FILE', CREDENTIALS_FILE)
    token_file = os.environ.get('GOOGLE_TOKEN_FILE', TOKEN_FILE)
    service_account_file = os.environ.get('GOOGLE_SERVICE_ACCOUNT_FILE')
    
    # Validate configuration
    if not service_account_file and not os.path.exists(credentials_file):
        error_msg = (
            "Google API authentication not configured. "
            "Set GOOGLE_SERVICE_ACCOUNT_FILE for production or ensure credentials.json exists for development."
        )
        logger.error(error_msg)
        raise Exception(error_msg)
    
    # --- Service Account Authentication (Production First Choice) ---
    # In production, service account is required for non-interactive operation
    if service_account_file:
        if os.path.exists(service_account_file):
            try:
                from google.oauth2 import service_account
                creds = service_account.Credentials.from_service_account_file(
                    service_account_file, scopes=scopes
                )
                logger.info("Using Google Service Account for authentication (production-ready)")
                
                # For production environments, validate service account is properly configured
                if os.environ.get('ENVIRONMENT') == 'production':
                    # Check if service account has necessary permissions
                    try:
                        # Test authentication by building a minimal service
                        test_service = build(api_name, api_version, credentials=creds)
                        logger.debug("Service account authentication validated successfully")
                    except Exception as test_error:
                        logger.error(f"Service account validation failed: {test_error}")
                        raise Exception(f"Service account configuration error: {test_error}")
                
                return build(api_name, api_version, credentials=creds)
            except Exception as e:
                logger.error(f"Service account authentication failed: {e}", exc_info=True)
                # In production, don't fall back - require proper service account setup
                if os.environ.get('ENVIRONMENT') == 'production':
                    raise Exception(f"Service account authentication failed in production: {e}. "
                                  "For production non-interactive servers, use Google Cloud Service Account "
                                  "with domain-wide delegation instead of OAuth flow.")
                logger.warning("Falling back to OAuth authentication for development")
        else:
            logger.warning(f"Service account file not found: {service_account_file}")
            if os.environ.get('ENVIRONMENT') == 'production':
                raise FileNotFoundError(f"Service account file not found: {service_account_file}. "
                                      "Required for production environment.")
    
    # --- OAuth 2.0 Authentication (Development Fallback) ---
    # Note: This requires a one-time manual authentication step in the console
    # where you run the server for the first time. For production, non-interactive
    # servers, you should use a Google Cloud Service Account with domain-wide delegation
    # instead of this OAuth flow.
    
    # Check for existing token first
    if os.path.exists(token_file):
        try:
            creds = Credentials.from_authorized_user_file(token_file, scopes)
            logger.debug("Loaded existing OAuth token from cache")
        except Exception as e:
            logger.warning(f"Error loading existing token: {e}", exc_info=True)
    
    # Handle token validation and refresh
    if creds and creds.valid:
        logger.debug("Using valid existing credentials")
        return build(api_name, api_version, credentials=creds)
    
    if creds and creds.expired and creds.refresh_token:
        try:
            creds.refresh(Request())
            logger.info("Refreshed expired OAuth token")
            # Save the refreshed token
            try:
                with open(token_file, 'w') as token:
                    token.write(creds.to_json())
                logger.debug("Saved refreshed token to persistent storage")
            except Exception as e:
                logger.warning(f"Failed to save refreshed token: {e}")
            return build(api_name, api_version, credentials=creds)
        except Exception as e:
            logger.warning(f"Token refresh failed: {e}", exc_info=True)
            creds = None
    
    # New authentication required
    if not os.path.exists(credentials_file):
        error_msg = (
            f"OAuth credentials file '{credentials_file}' not found. "
            "Please download it from Google Cloud Console or set GOOGLE_SERVICE_ACCOUNT_FILE "
            "for service account authentication."
        )
        logger.error(error_msg)
        raise FileNotFoundError(error_msg)
    
    # For non-interactive environments, don't attempt OAuth flow
    if os.environ.get('NON_INTERACTIVE') or not os.isatty(0):
        error_msg = (
            "Cannot perform OAuth authentication in non-interactive environment. "
            "Use service account authentication or run in interactive mode first to generate token."
        )
        logger.error(error_msg)
        raise Exception(error_msg)
    
    try:
        flow = InstalledAppFlow.from_client_secrets_file(credentials_file, scopes)
        logger.info("Starting OAuth authentication flow (interactive mode required)")
        creds = flow.run_local_server(port=0)
        
        # Save the credentials for the next run
        try:
            with open(token_file, 'w') as token:
                token.write(creds.to_json())
            logger.info("OAuth authentication successful, token saved for future use")
        except Exception as e:
            logger.warning(f"Failed to save token: {e}. Authentication will be required on next run.")
        
        return build(api_name, api_version, credentials=creds)
        
    except Exception as e:
        logger.error(f"OAuth authentication failed: {e}", exc_info=True)
        raise Exception(f"Google API authentication failed: {e}. "
                      "For production servers, use service account authentication instead.")

async def get_availability(data: Dict[str, Any]) -> Dict[str, Any]:
    """
    Checks for available appointment slots with robust timezone handling.
    This function integrates with Google Calendar API with proper Daylight Saving Time support.
    """
    # Handle different date keys from different prompts
    requested_date_str = data.get("date") or data.get("appointmentDateTime")
    if not requested_date_str:
        # Default to today if no date provided
        requested_date_str = datetime.now().isoformat()
    
    logger.info(f"Checking availability for date: {requested_date_str}")
    
    # Validate configuration before proceeding
    try:
        validate_configuration()
    except Exception as e:
        logger.warning(f"Configuration validation failed, using simulated mode: {e}")
        return await _get_simulated_availability(datetime.now().date())

    try:
        # Parse the date with proper timezone handling
        try:
            # Handle both date-only and datetime strings
            if 'T' in requested_date_str:
                # It's a datetime string
                parsed_dt = datetime.fromisoformat(requested_date_str.replace('Z', '+00:00'))
                target_date = parsed_dt.date()
            else:
                # It's a date string (YYYY-MM-DD)
                target_date = datetime.strptime(requested_date_str, '%Y-%m-%d').date()
        except (ValueError, AttributeError) as e:
            logger.warning(f"Invalid date format '{requested_date_str}': {e}", exc_info=True)
            return {"error": "Invalid date format. Use YYYY-MM-DD or ISO datetime format", "available_slots": []}
        
        # Try to use Google Calendar API for real availability checking
        try:
            service = get_google_service('calendar', 'v3', SCOPES)
            
            # Define the time range for the requested day (9 AM to 5 PM CST)
            # Using pytz for proper timezone handling with Daylight Saving Time support
            # IMPORTANT: Using a proper timezone name like 'America/Chicago' is crucial to handle
            # Daylight Saving Time correctly. Hardcoding a UTC offset will fail.
            chicago_tz = pytz.timezone("America/Chicago")
            
            # Create timezone-aware datetime objects for the entire day
            start_of_day_naive = datetime.combine(target_date, time(9, 0))  # 9 AM
            end_of_day_naive = datetime.combine(target_date, time(17, 0))   # 5 PM
            
            # Localize to Chicago timezone (handles DST automatically)
            start_of_day = chicago_tz.localize(start_of_day_naive)
            end_of_day = chicago_tz.localize(end_of_day_naive)
            
            events_result = service.events().list(
                calendarId='primary',
                timeMin=start_of_day.isoformat(),
                timeMax=end_of_day.isoformat(),
                singleEvents=True,
                orderBy='startTime'
            ).execute()
            
            busy_slots = events_result.get('items', [])
            
            # --- More Efficient Availability Calculation ---
            # This logic finds free blocks of time instead of checking every possible slot.
            available_slots = []
            last_event_end = start_of_day
            
            for event in busy_slots:
                event_start_str = event['start'].get('dateTime')
                if not event_start_str:
                    continue  # Skip all-day events
                
                try:
                    event_start = datetime.fromisoformat(event_start_str).astimezone(chicago_tz)
                except (ValueError, AttributeError) as e:
                    logger.warning(f"Invalid event start time format: {event_start_str}. Error: {e}", exc_info=True)
                    continue
                
                # Check for a gap between the last event and the current one
                if event_start > last_event_end:
                    # Add available slots in this free block
                    potential_slot = last_event_end
                    while potential_slot < event_start:
                        available_slots.append(potential_slot.isoformat())
                        potential_slot += timedelta(minutes=30)
                
                event_end_str = event['end'].get('dateTime')
                if event_end_str:
                    try:
                        last_event_end = datetime.fromisoformat(event_end_str).astimezone(chicago_tz)
                    except (ValueError, AttributeError) as e:
                        logger.warning(f"Invalid event end time format: {event_end_str}. Error: {e}", exc_info=True)
                        # Fall back to event start + 1 hour if end time is invalid
                        last_event_end = event_start + timedelta(hours=1)
            
            # Check for remaining time after last event
            if last_event_end < end_of_day:
                potential_slot = last_event_end
                while potential_slot < end_of_day:
                    available_slots.append(potential_slot.isoformat())
                    potential_slot += timedelta(minutes=30)
            
            # Return up to 2 available slots as specified in the prompt
            return {
                "available_slots": available_slots[:2],
                "date": requested_date_str,
                "timezone": "America/Chicago"
            }
            
        except Exception as e:
            # Catch any exception from Google API calls (authentication, network, etc.)
            logger.warning(f"Google Calendar API unavailable, using simulated availability: {e}")
            # Fall back to simulated availability if Google API is not available
            return await _get_simulated_availability(target_date)
        
    except Exception as e:
        logger.error(f"Error in get_availability: {str(e)}", exc_info=True)
        return {"error": "Could not check calendar availability at this time.", "available_slots": []}

async def _get_simulated_availability(target_date: datetime.date) -> Dict[str, Any]:
    """
    Fallback simulated availability function when Google Calendar is not available.
    Uses timezone-aware datetimes for consistency.
    """
    # Simulate available times (9 AM to 5 PM CST with 30-minute slots)
    available_slots = []
    chicago_tz = pytz.timezone("America/Chicago")
    
    # Create timezone-aware datetime objects
    start_time_naive = datetime.combine(target_date, time(9, 0))  # 9 AM
    end_time_naive = datetime.combine(target_date, time(17, 0))   # 5 PM
    
    start_time = chicago_tz.localize(start_time_naive)
    end_time = chicago_tz.localize(end_time_naive)
    
    current_time = start_time
    
    while current_time < end_time:
        slot_time_iso = current_time.isoformat()
        
        # Check if slot is already booked in our simulated DB
        is_available = True
        for appointment in appointments_db.values():
            if appointment['start_time'] == slot_time_iso:
                is_available = False
                break
        
        if is_available:
            available_slots.append(slot_time_iso)
        
        current_time += timedelta(minutes=30)
    
    # Return up to 3 available slots for flexibility
    return {
        "available_slots": available_slots[:3],
        "date": target_date.isoformat(),
        "timezone": "America/Chicago",
        "simulated": True  # Indicate this is simulated data
    }

async def create_appointment(data: Dict[str, Any]) -> Dict[str, Any]:
    """
    Creates an appointment in the calendar system with robust timezone handling.
    """
    start_timestamp = data.get("start_timestamp")
    # Handle different name keys from various prompts
    name = data.get('patient_name') or data.get('user_name') or data.get('client_name')
    service_type = data.get('service_type', 'Appointment')  # Get service type or default
    
    if not start_timestamp or not name:
        return {"success": False, "error": "A start_timestamp and a name (e.g., patient_name, user_name) are required."}

    logger.info(f"Creating {service_type} for {name} at {start_timestamp}")
    
    # Validate configuration before proceeding
    try:
        validate_configuration()
    except Exception as e:
        logger.warning(f"Configuration validation failed, using simulated mode: {e}")
        return await _create_simulated_appointment(start_timestamp, name, service_type)

    try:
        # Validate timestamp format and ensure proper timezone handling
        try:
            # Parse the timestamp and ensure it's timezone-aware
            appointment_time = datetime.fromisoformat(start_timestamp.replace('Z', '+00:00'))
            
            # If the parsed datetime is naive (no timezone), localize it to Chicago timezone
            if appointment_time.tzinfo is None:
                chicago_tz = pytz.timezone("America/Chicago")
                appointment_time = chicago_tz.localize(appointment_time)
                logger.warning(f"Naive datetime provided, localized to Chicago timezone: {appointment_time}")
        except ValueError as e:
            logger.error(f"Invalid timestamp format '{start_timestamp}': {e}", exc_info=True)
            return {"success": False, "error": "Invalid timestamp format. Use ISO format with timezone information"}
        
        # Try to use Google Calendar API for real appointment creation
        try:
            service = get_google_service('calendar', 'v3', SCOPES)
            
            # Set appointment duration to 1 hour
            end_time = appointment_time + timedelta(hours=1)
            
            event = {
                'summary': f'{service_type}: {name}',
                'description': f'Booked via Robofy AI Assistant. Details: {data}',
                'start': {
                    'dateTime': appointment_time.isoformat(),
                    'timeZone': 'America/Chicago'  # CST timezone
                },
                'end': {
                    'dateTime': end_time.isoformat(),
                    'timeZone': 'America/Chicago'
                },
                'attendees': [],  # Optionally add patient email here if collected
                'reminders': {
                    'useDefault': False,
                    'overrides': [
                        {'method': 'email', 'minutes': 24 * 60},  # 1 day before
                        {'method': 'popup', 'minutes': 30},  # 30 minutes before
                    ],
                },
            }

            created_event = service.events().insert(calendarId='primary', body=event).execute()
            logger.info(f"Google Calendar event created: {created_event.get('htmlLink')}")
            
            return {
                "success": True,
                "appointment_id": created_event['id'],
                "name": name,
                "start_time": start_timestamp,
                "calendar_link": created_event.get('htmlLink'),
                "message": f"{service_type} confirmed for {name}.",
                "timezone": "America/Chicago"
            }
            
        except (HttpError, FileNotFoundError) as e:
            logger.warning(f"Google Calendar API unavailable, using simulated booking: {e}")
            # Fall back to simulated booking if Google API is not configured
            return await _create_simulated_appointment(start_timestamp, name, service_type)
        
    except Exception as e:
        logger.error(f"Error in create_appointment: {str(e)}", exc_info=True)
        return {"success": False, "error": "Could not create the appointment."}

async def _create_simulated_appointment(start_timestamp: str, name: str, service_type: str = "Appointment") -> Dict[str, Any]:
    """
    Fallback simulated appointment creation when Google Calendar is not available.
    Uses timezone-aware datetimes for consistency.
    """
    # Check if slot is still available in our simulated DB
    for appointment in appointments_db.values():
        if appointment['start_time'] == start_timestamp:
            return {"success": False, "error": "Time slot is no longer available"}
    
    # Validate the timestamp format for consistency
    try:
        # Try to parse the timestamp to ensure it's valid
        test_time = datetime.fromisoformat(start_timestamp.replace('Z', '+00:00'))
        if test_time.tzinfo is None:
            # If naive, localize to Chicago timezone for consistency
            chicago_tz = pytz.timezone("America/Chicago")
            test_time = chicago_tz.localize(test_time)
            start_timestamp = test_time.isoformat()  # Update to timezone-aware format
    except ValueError:
        # If invalid format, still proceed but log a warning
        logger.warning(f"Invalid timestamp format in simulated appointment: {start_timestamp}", exc_info=True)
    
    # Create appointment in simulated DB
    appointment_id = len(appointments_db) + 1
    appointments_db[appointment_id] = {
        "id": appointment_id,
        "name": name,
        "service_type": service_type,
        "start_time": start_timestamp,
        "created_at": datetime.now().astimezone().isoformat(),  # Timezone-aware
        "status": "confirmed",
        "timezone": "America/Chicago"
    }
    
    logger.info(f"Simulated appointment created: {appointment_id} for {name} ({service_type}) at {start_timestamp}")
    
    return {
        "success": True,
        "appointment_id": appointment_id,
        "name": name,
        "service_type": service_type,
        "start_time": start_timestamp,
        "message": f"{service_type} successfully booked (simulated mode)",
        "simulated": True  # Indicate this is simulated data
    }

async def log_booking_details(data: Dict[str, Any]) -> Dict[str, Any]:
    """
    Logs the patient and appointment details to a CRM or spreadsheet.
    """
    try:
        # Extract data with flexible key names
        name = data.get('patient_name') or data.get('user_name') or data.get('client_name')
        contact = data.get('user_email') or data.get('client_contact') or data.get('insurance_provider')
        notes = data.get('patient_question_concern') or data.get('notes') or data.get('interests')
        start_timestamp = data.get('start_timestamp')
        service_type = data.get('service_type', 'Appointment')
        
        if not name or not start_timestamp:
            return {"error": "Name and start_timestamp are required"}
        
        # Create record in simulated DB
        booking_id = len(patient_details_db) + 1
        patient_details_db[booking_id] = {
            "id": booking_id,
            "name": name,
            "contact": contact,
            "notes": notes,
            "service_type": service_type,
            "appointment_time": start_timestamp,
            "logged_at": datetime.now().isoformat() + "Z"
        }
        
        logger.info(f"Booking details logged: {name} for {service_type} at {start_timestamp}")
        
        # Try to send confirmation email via Gmail API only if configured
        try:
            validate_configuration()
            # Generate dynamic email body based on service type
            email_body = (
                f"Hello {name},\n\n"
                f"This is a confirmation for your {service_type} scheduled for {start_timestamp}.\n\n"
            )
            
            if notes:
                email_body += f"Notes: {notes}\n\n"
                
            email_body += (
                "We look forward to speaking with you!\n\n"
                "Best regards,\n"
                "The Team"
            )
            
            await send_confirmation_email(data, email_body)
        except Exception as e:
            logger.warning(f"Email configuration invalid or failed to send: {e}. Booking details were still logged.")
            # Don't fail the whole call if email fails, just log the error
        
        return {
            "success": True,
            "booking_id": booking_id,
            "message": "Booking details successfully logged",
            "logged_at": patient_details_db[booking_id]['logged_at']
        }
        
    except Exception as e:
        logger.error(f"Error in log_booking_details: {str(e)}", exc_info=True)
        return {"error": f"Internal server error: {str(e)}"}

async def send_confirmation_email(data: Dict[str, Any], email_body: str):
    """
    Sends a confirmation email using the Gmail API with a dynamic body.
    """
    try:
        service = get_google_service('gmail', 'v1', SCOPES)
        
        message = EmailMessage()
        message.set_content(email_body)

        # Replace with the patient's email if collected, or an internal address.
        recipient = data.get('user_email') or data.get('client_contact') or data.get('patient_email') or 'your-internal-office-email@example.com'
        if '@' not in recipient:  # Basic check if it's not an email
            recipient = 'your-internal-office-email@example.com'
        
        message['To'] = recipient
        message['From'] = 'your-gmail-address@gmail.com'
        name = data.get('patient_name') or data.get('user_name') or data.get('client_name', 'New Appointment')
        message['Subject'] = f"Appointment Confirmation: {name}"

        encoded_message = base64.urlsafe_b64encode(message.as_bytes()).decode()
        create_message = {'raw': encoded_message}
        service.users().messages().send(userId="me", body=create_message).execute()
        logger.info(f"Confirmation email sent successfully to {recipient}.")
    except (HttpError, FileNotFoundError) as e:
        logger.error(f"Failed to send confirmation email via Gmail: {e}", exc_info=True)
        # This error should be handled gracefully.
        raise Exception(f"Gmail API error: {e}")
    except Exception as e:
        logger.error(f"Unexpected error sending confirmation email: {e}", exc_info=True)
        raise