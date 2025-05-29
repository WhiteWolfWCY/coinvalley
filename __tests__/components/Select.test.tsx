import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Select } from '@/components/Select';

jest.mock('@/components/ui/dialog', () => ({
  Dialog: ({ children, open }: { children: React.ReactNode, open: boolean }) => (
    <div data-testid="mock-dialog" data-open={open}>
      {children}
    </div>
  ),
  DialogContent: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="mock-dialog-content">{children}</div>
  ),
  DialogHeader: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="mock-dialog-header">{children}</div>
  ),
  DialogTitle: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="mock-dialog-title">{children}</div>
  ),
  DialogDescription: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="mock-dialog-description">{children}</div>
  ),
  DialogFooter: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="mock-dialog-footer">{children}</div>
  ),
}));

jest.mock('@/components/ui/button', () => ({
  Button: ({ children, onClick, disabled, variant }: any) => (
    <button 
      data-testid="mock-button" 
      onClick={onClick} 
      disabled={disabled}
      data-variant={variant}
    >
      {children}
    </button>
  ),
}));

jest.mock('@/components/ui/input', () => ({
  Input: (props: any) => (
    <input 
      data-testid="mock-input" 
      {...props}
    />
  ),
}));

describe('Select', () => {
  const options = [
    { label: 'Option 1', value: 'option1' },
    { label: 'Option 2', value: 'option2' },
    { label: 'Option 3', value: 'option3' },
  ];

  const mockOnChange = jest.fn();
  const mockOnCreate = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders with placeholder', () => {
    render(
      <Select 
        placeholder="Select an option" 
        options={options} 
        onChange={mockOnChange}
      />
    );

    expect(screen.getByText('Select an option')).toBeInTheDocument();
  });

  it('displays selected option when value is provided', () => {
    render(
      <Select 
        placeholder="Select an option" 
        options={options} 
        value="option3"
        onChange={mockOnChange}
      />
    );

    expect(screen.getByText('Option 3')).toBeInTheDocument();
  });

  it('contains a disabled input element when disabled prop is true', () => {
    const { container } = render(
      <Select 
        placeholder="Select an option" 
        options={options} 
        onChange={mockOnChange}
        disabled={true}
      />
    );

    const disabledInput = container.querySelector('input[disabled]');
    expect(disabledInput).toBeInTheDocument();
  });
}); 