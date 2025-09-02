import React from 'react';
import { render, screen } from '@testing-library/react';
import Layout from '@/components/Layout';

describe('Layout Component', () => {
  it('renders children correctly', () => {
    render(
      <Layout>
        <div>Test Content</div>
      </Layout>
    );
    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('renders the Robofy logo', () => {
    render(
      <Layout>
        <div>Test</div>
      </Layout>
    );
    const robofyElements = screen.getAllByText('Robofy');
    expect(robofyElements.length).toBeGreaterThan(0);
    expect(robofyElements[0]).toBeInTheDocument();
  });

  it('includes navigation links', () => {
    render(
      <Layout>
        <div>Test</div>
      </Layout>
    );
    expect(screen.getByText('Home')).toBeInTheDocument();
    expect(screen.getByText('Industries')).toBeInTheDocument();
    const contactElements = screen.getAllByText('Contact');
    expect(contactElements.length).toBeGreaterThan(0);
    expect(contactElements[0]).toBeInTheDocument();
  });

  it('renders footer content', () => {
    render(
      <Layout>
        <div>Test</div>
      </Layout>
    );
    expect(screen.getByText(/AI-powered digital marketing solutions/i)).toBeInTheDocument();
    expect(screen.getByText(/© 2025 Robofy/i)).toBeInTheDocument();
  });
});