import React from 'react';
import { render, screen } from '@testing-library/react';
import Home from '@/app/page';

// Mock the components to avoid complex 3D rendering in tests
jest.mock('@/components/SplineScene', () => {
  return function MockSplineScene({ onFormOpen }: { onFormOpen: () => void }) {
    return (
      <div data-testid="spline-scene">
        <button onClick={onFormOpen}>Open Form</button>
      </div>
    );
  };
});

jest.mock('@/components/FormModal', () => {
  return function MockFormModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
    return isOpen ? <div data-testid="form-modal">Modal Content</div> : null;
  };
});

describe('Home Page', () => {
  it('renders the main heading', () => {
    render(<Home />);
    const heading = screen.getByText(/AI-Powered Digital Marketing Automation/i);
    expect(heading).toBeInTheDocument();
  });

  it('renders the subheading', () => {
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