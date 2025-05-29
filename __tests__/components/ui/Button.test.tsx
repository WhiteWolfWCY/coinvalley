import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Button } from '@/components/ui/button';

describe('Button', () => {
  it('renders the button with default props', () => {
    render(<Button>Click me</Button>);
    
    const button = screen.getByRole('button', { name: /click me/i });
    expect(button).toBeInTheDocument();
    expect(button).toHaveClass('bg-primary');
  });

  it('renders a disabled button when disabled prop is true', () => {
    render(<Button disabled>Disabled Button</Button>);
    
    const button = screen.getByRole('button', { name: /disabled button/i });
    expect(button).toBeDisabled();
    expect(button).toHaveClass('disabled:opacity-50');
  });

  it('applies variant classes correctly', () => {
    render(<Button variant="destructive">Destructive Button</Button>);
    
    const button = screen.getByRole('button', { name: /destructive button/i });
    expect(button).toHaveClass('bg-destructive');
  });

  it('applies size classes correctly', () => {
    render(<Button size="lg">Large Button</Button>);
    
    const button = screen.getByRole('button', { name: /large button/i });
    expect(button).toHaveClass('h-11');
  });

  it('calls onClick handler when clicked', async () => {
    const handleClick = jest.fn();
    const user = userEvent.setup();
    
    render(<Button onClick={handleClick}>Clickable Button</Button>);
    
    const button = screen.getByRole('button', { name: /clickable button/i });
    await user.click(button);
    
    expect(handleClick).toHaveBeenCalledTimes(1);
  });
}); 