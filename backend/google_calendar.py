"""
Google Calendar integration for appointment booking functionality.
Handles authentication and calendar operations for scheduling appointments.
"""
import os
import datetime
from typing import List, Optional, Dict, Any
from google.oauth2.credentials import Credentials
from google.auth.transport.requests import Request
from google.auth.exceptions import RefreshError
from googleapiclient.discovery import build
from googleapiclient.errors import HttpError
import logging
from backend.config import settings

logger = logging.getLogger(__name__)

class GoogleCalendarClient:
    """Client for interacting with Google Calendar API."""
    
    def __init__(self):
        self.credentials = None
        self.service = None
        self.calendar_id = settings.GOOGLE_CALENDAR_ID if hasattr(settings, 'GOOGLE_CALENDAR_ID') else 'primary'
    
    async def authenticate(self) -> bool:
        """Authenticate with Google Calendar API using service account credentials."""
        try:
            # Check if we have service account credentials
            if not hasattr(settings, 'GOOGLE_SERVICE_ACCOUNT_FILE') or not settings.GOOGLE_SERVICE_ACCOUNT_FILE:
                logger.warning("Google Service Account credentials not configured")
                return False
            
            # Load service account credentials
            creds = Credentials.from_service_account_file(
                settings.GOOGLE_SERVICE_ACCOUNT_FILE,
                scopes=['https://www.googleapis.com/auth/calendar']
            )
            
            self.credentials = creds
            self.service = build('calendar', 'v3', credentials=creds)
            return True
            
        except Exception as e:
            logger.error(f"Google Calendar authentication failed: {str(e)}")
            return False
    
    async def create_appointment(
        self,
        summary: str,
        start_time: datetime.datetime,
        end_time: datetime.datetime,
        attendee_emails: Optional[List[str]] = None,
        description: Optional[str] = None,
        location: Optional[str] = None
    ) -> Optional[Dict[str, Any]]:
        """Create a new calendar event (appointment)."""
        try:
            if not self.service:
                if not await self.authenticate():
                    return None
            
            event = {
                'summary': summary,
                'description': description,
                'start': {
                    'dateTime': start_time.isoformat(),
                    'timeZone': 'UTC',
                },
                'end': {
                    'dateTime': end_time.isoformat(),
                    'timeZone': 'UTC',
                },
                'attendees': [{'email': email} for email in (attendee_emails or [])],
                'location': location,
                'reminders': {
                    'useDefault': False,
                    'overrides': [
                        {'method': 'email', 'minutes': 24 * 60},
                        {'method': 'popup', 'minutes': 30},
                    ],
                },
            }
            
            event = self.service.events().insert(
                calendarId=self.calendar_id,
                body=event,
                sendUpdates='all'
            ).execute()
            
            logger.info(f"Appointment created: {event.get('htmlLink')}")
            return event
            
        except HttpError as e:
            logger.error(f"Google Calendar API error: {str(e)}")
            return None
        except Exception as e:
            logger.error(f"Error creating appointment: {str(e)}")
            return None
    
    async def get_available_time_slots(
        self,
        date: datetime.date,
        duration_minutes: int = 30,
        business_hours_start: int = 9,  # 9 AM
        business_hours_end: int = 17    # 5 PM
    ) -> List[Dict[str, Any]]:
        """Get available time slots for a given date."""
        try:
            if not self.service:
                if not await self.authenticate():
                    return []
            
            # Calculate time range for the day
            start_of_day = datetime.datetime.combine(date, datetime.time(business_hours_start))
            end_of_day = datetime.datetime.combine(date, datetime.time(business_hours_end))
            
            # Get existing events for the day
            events_result = self.service.events().list(
                calendarId=self.calendar_id,
                timeMin=start_of_day.isoformat() + 'Z',
                timeMax=end_of_day.isoformat() + 'Z',
                singleEvents=True,
                orderBy='startTime'
            ).execute()
            
            events = events_result.get('items', [])
            
            # Generate available time slots
            available_slots = []
            current_time = start_of_day
            
            while current_time + datetime.timedelta(minutes=duration_minutes) <= end_of_day:
                slot_end = current_time + datetime.timedelta(minutes=duration_minutes)
                
                # Check if this slot overlaps with any existing event
                slot_available = True
                for event in events:
                    event_start = datetime.datetime.fromisoformat(event['start']['dateTime'].replace('Z', ''))
                    event_end = datetime.datetime.fromisoformat(event['end']['dateTime'].replace('Z', ''))
                    
                    if (current_time < event_end and slot_end > event_start):
                        slot_available = False
                        break
                
                if slot_available:
                    available_slots.append({
                        'start': current_time,
                        'end': slot_end,
                        'formatted': current_time.strftime('%I:%M %p') + ' - ' + slot_end.strftime('%I:%M %p')
                    })
                
                current_time += datetime.timedelta(minutes=30)  # Check every 30 minutes
            
            return available_slots
            
        except Exception as e:
            logger.error(f"Error getting available time slots: {str(e)}")
            return []

# Global instance
google_calendar_client = GoogleCalendarClient()

async def get_google_calendar_client():
    """Get the global Google Calendar client instance."""
    return google_calendar_client