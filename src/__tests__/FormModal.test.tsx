import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import FormModal from '@/components/FormModal';

// Mock the API module
jest.mock('@/lib/api', () => ({
  createLead: jest.fn(),
}));

// Mock window.alert
const mockAlert = jest.fn();
window.alert = mockAlert;

const mockCreateLead = require('@/lib/api').createLead;

describe('FormModal Component', () => {
  const mockOnClose = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
    mockAlert.mockClear();
  });

  it('renders null when not open', () => {
    const { container } = render(<FormModal isOpen={false} onClose={mockOnClose} />);
    expect(container.firstChild).toBeNull();
  });

  it('renders form when open', () => {
    render(<FormModal isOpen={true} onClose={mockOnClose} />);
    
    expect(screen.getByText('Get Started with Robofy')).toBeInTheDocument();
    expect(screen.getByLabelText('Full Name')).toBeInTheDocument();
    expect(screen.getByLabelText('Email Address')).toBeInTheDocument();
    expect(screen.getByLabelText('Industry')).toBeInTheDocument();
    expect(screen.getByLabelText('Message (Optional)')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Submit' })).toBeInTheDocument();
  });

  it('submits form successfully', async () => {
    mockCreateLead.mockResolvedValueOnce({ status: 200, data: {} });

    render(<FormModal isOpen={true} onClose={mockOnClose} />);

    // Fill out the form
    fireEvent.change(screen.getByLabelText('Full Name'), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByLabelText('Email Address'), { target: { value: 'john@example.com' } });
    fireEvent.change(screen.getByLabelText('Industry'), { target: { value: 'healthcare' } });
    fireEvent.change(screen.getByLabelText('Message (Optional)'), { target: { value: 'Test message' } });

    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: 'Submit' }));

    // Verify API was called with correct data
    await waitFor(() => {
      expect(mockCreateLead).toHaveBeenCalledWith({
        name: 'John Doe',
        email: 'john@example.com',
        industry: 'healthcare',
        source: 'website'
      });
    });

    // Verify success behavior (alert and modal close)
    await waitFor(() => {
      expect(mockAlert).toHaveBeenCalledWith('Form submitted successfully! We will contact you soon.');
      expect(mockOnClose).toHaveBeenCalled();
    });
  });

  it('handles API errors gracefully', async () => {
    const apiError = {
      error: {
        code: 'LEAD_EMAIL_CONFLICT',
        message: 'Lead with this email already exists',
        details: { email: 'john@example.com' }
      },
      status: 409
    };
    mockCreateLead.mockResolvedValueOnce(apiError);

    render(<FormModal isOpen={true} onClose={mockOnClose} />);

    // Fill out the form
    fireEvent.change(screen.getByLabelText('Full Name'), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByLabelText('Email Address'), { target: { value: 'john@example.com' } });
    fireEvent.change(screen.getByLabelText('Industry'), { target: { value: 'healthcare' } });

    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: 'Submit' }));

    // Verify error message is displayed
    await waitFor(() => {
      expect(screen.getByText('Lead with this email already exists')).toBeInTheDocument();
    });

    // Verify modal doesn't close on error
    expect(mockOnClose).not.toHaveBeenCalled();
  });

  it('handles network errors gracefully', async () => {
    mockCreateLead.mockRejectedValueOnce(new Error('Network error'));

    render(<FormModal isOpen={true} onClose={mockOnClose} />);

    // Fill out the form
    fireEvent.change(screen.getByLabelText('Full Name'), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByLabelText('Email Address'), { target: { value: 'john@example.com' } });

    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: 'Submit' }));

    // Verify generic error message is displayed
    await waitFor(() => {
      expect(screen.getByText('An unexpected error occurred. Please try again.')).toBeInTheDocument();
    });

    // Verify modal doesn't close on error
    expect(mockOnClose).not.toHaveBeenCalled();
  });

  it('shows loading state during submission', async () => {
    // Create a promise that doesn't resolve immediately to test loading state
    let resolvePromise: (value: any) => void;
    const pendingPromise = new Promise((resolve) => {
      resolvePromise = resolve;
    });
    mockCreateLead.mockReturnValueOnce(pendingPromise);

    render(<FormModal isOpen={true} onClose={mockOnClose} />);

    // Fill out the form
    fireEvent.change(screen.getByLabelText('Full Name'), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByLabelText('Email Address'), { target: { value: 'john@example.com' } });

    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: 'Submit' }));

    // Verify loading state
    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Submitting...' })).toBeDisabled();
    });

    // Resolve the promise
    resolvePromise!({ status: 200, data: {} });
    await waitFor(() => {
      expect(screen.getByRole('button', { name: 'Submit' })).toBeInTheDocument();
    });
  });

  it('disables form fields during submission', async () => {
    mockCreateLead.mockImplementationOnce(() => new Promise(resolve => setTimeout(() => resolve({ status: 200, data: {} }), 100)));

    render(<FormModal isOpen={true} onClose={mockOnClose} />);

    // Fill out the form
    fireEvent.change(screen.getByLabelText('Full Name'), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByLabelText('Email Address'), { target: { value: 'john@example.com' } });

    // Submit the form
    fireEvent.click(screen.getByRole('button', { name: 'Submit' }));

    // Verify fields are disabled during submission
    await waitFor(() => {
      expect(screen.getByLabelText('Full Name')).toBeDisabled();
      expect(screen.getByLabelText('Email Address')).toBeDisabled();
      expect(screen.getByLabelText('Industry')).toBeDisabled();
      expect(screen.getByLabelText('Message (Optional)')).toBeDisabled();
    });

    // Wait for submission to complete
    await waitFor(() => {
      expect(screen.getByLabelText('Full Name')).not.toBeDisabled();
    }, { timeout: 200 });
  });

  it('clears error message when form is re-submitted', async () => {
    // First submission fails
    mockCreateLead.mockResolvedValueOnce({
      error: {
        code: 'LEAD_EMAIL_CONFLICT',
        message: 'Lead with this email already exists'
      },
      status: 409
    });

    render(<FormModal isOpen={true} onClose={mockOnClose} />);

    // Fill out and submit form (fails)
    fireEvent.change(screen.getByLabelText('Full Name'), { target: { value: 'John Doe' } });
    fireEvent.change(screen.getByLabelText('Email Address'), { target: { value: 'john@example.com' } });
    fireEvent.click(screen.getByRole('button', { name: 'Submit' }));

    // Verify error is displayed
    await waitFor(() => {
      expect(screen.getByText('Lead with this email already exists')).toBeInTheDocument();
    });

    // Second submission succeeds
    mockCreateLead.mockResolvedValueOnce({ status: 200, data: {} });
    fireEvent.click(screen.getByRole('button', { name: 'Submit' }));

    // Verify error is cleared
    await waitFor(() => {
      expect(screen.queryByText('Lead with this email already exists')).not.toBeInTheDocument();
    });
  });
});