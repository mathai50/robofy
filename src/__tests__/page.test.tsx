import React from 'react';
import { render, screen } from '@testing-library/react';
import Home from '@/app/page';

// Mock the FormModal to avoid complex modal rendering in tests
jest.mock('@/components/FormModal', () => {
  return function MockFormModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
    return isOpen ? <div data-testid="form-modal">Modal Content</div> : null;
  };
});

describe('Home Page', () => {
  it('renders the main hero heading', () => {
    render(<Home />);
    const heading = screen.getByText(/Robofy/i);
    expect(heading).toBeInTheDocument();
  });

  it('renders the hero subheading', () => {
    render(<Home />);
    const subheading = screen.getByText(/AI-Powered Digital Marketing Automation/i);
    expect(subheading).toBeInTheDocument();
  });

  it('renders the Get Started button in hero', () => {
    render(<Home />);
    const getStartedButton = screen.getByText(/Get Started/i);
    expect(getStartedButton).toBeInTheDocument();
  });

  it('renders the content section heading', () => {
    render(<Home />);
    const heading = screen.getByText(/AI-Powered Digital Marketing Automation/i);
    expect(heading).toBeInTheDocument();
  });

  it('renders the content subheading', () => {
    render(<Home />);
    const subheading = screen.getByText(/Transform your business with AI-driven digital marketing solutions/i);
    expect(subheading).toBeInTheDocument();
  });

  it('renders the CTA buttons', () => {
    render(<Home />);
    const getStartedButton = screen.getByText(/Get Started Free/i);
    const viewServicesButton = screen.getByText(/View Our Services/i);
    expect(getStartedButton).toBeInTheDocument();
    expect(viewServicesButton).toBeInTheDocument();
  });

  it('renders the stats section', () => {
    render(<Home />);
    const happyClients = screen.getByText(/500\+/i);
    const successRate = screen.getByText(/99%/i);
    const aiSupport = screen.getByText(/24\/7/i);
    expect(happyClients).toBeInTheDocument();
    expect(successRate).toBeInTheDocument();
    expect(aiSupport).toBeInTheDocument();
  });
});