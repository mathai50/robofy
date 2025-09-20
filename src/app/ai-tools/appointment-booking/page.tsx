'use client';

import ModernChatDashboard from '@/components/ModernChatDashboard';
import { Calendar, Clock, UserCheck, Video, Phone, MessageCircle } from 'lucide-react';

const appointmentAgents = [
  {
    id: 'schedule-call',
    name: 'Scheduling Assistant',
    description: 'Book consultation calls',
    icon: <Calendar className="w-5 h-5" />,
    color: 'text-blue-500'
  },
  {
    id: 'availability-checker',
    name: 'Availability Checker',
    description: 'Check available time slots',
    icon: <Clock className="w-5 h-5" />,
    color: 'text-purple-500'
  },
  {
    id: 'meeting-details',
    name: 'Meeting Details',
    description: 'Get meeting information',
    icon: <Video className="w-5 h-5" />,
    color: 'text-green-500'
  },
  {
    id: 'reschedule-assistant',
    name: 'Reschedule Assistant',
    description: 'Change appointment times',
    icon: <UserCheck className="w-5 h-5" />,
    color: 'text-orange-500'
  },
  {
    id: 'appointment-agent',
    name: 'Appointment Agent',
    description: 'AI-powered booking assistant',
    icon: <Phone className="w-5 h-5" />,
    color: 'text-teal-500'
  }
];

export default function AppointmentBookingPage() {
  return (
    <ModernChatDashboard
      toolName="Appointment Booking"
      toolDescription="Schedule consultations, check availability, and manage appointments"
      apiEndpoint="/api/ai/message"
      agents={appointmentAgents}
      defaultAgent="schedule-call"
      placeholder="Ask about scheduling, availability, or appointment details..."
      welcomeMessage="Hi! I'm your appointment booking assistant. How can I help you schedule your appointment today?"
    />
  );
}