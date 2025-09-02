import React from 'react';
import { render, screen } from '@testing-library/react';
import Placeholder from '@/components/Placeholder';

describe('Placeholder Component', () => {
  it('renders the static placeholder text', () => {
    render(<Placeholder />);
    expect(screen.getByText('Component placeholder - To be implemented')).toBeInTheDocument();
  });

  it('applies the correct CSS classes', () => {
    const { container } = render(<Placeholder />);
    const element = container.firstChild;
    expect(element).toHaveClass('p-4');
    expect(element).toHaveClass('border');
    expect(element).toHaveClass('border-dashed');
    expect(element).toHaveClass('border-gray-300');
    expect(element).toHaveClass('rounded-lg');
    expect(element).toHaveClass('text-center');
  });
});