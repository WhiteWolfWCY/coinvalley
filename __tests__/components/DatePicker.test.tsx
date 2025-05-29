import React from 'react';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { format } from 'date-fns';
import { DatePicker } from '@/components/DatePicker';

jest.mock('@/components/ui/popover', () => ({
  Popover: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="mock-popover">{children}</div>
  ),
  PopoverTrigger: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="mock-popover-trigger">{children}</div>
  ),
  PopoverContent: ({ children }: { children: React.ReactNode }) => (
    <div data-testid="mock-popover-content">{children}</div>
  ),
}));

jest.mock('react-day-picker', () => ({
  DayPicker: ({ onSelect, mode, selected }: any) => (
    <div data-testid="mock-day-picker">
      <button
        data-testid="mock-day-selector"
        onClick={() => {
          const newDate = new Date('2023-05-15');
          onSelect(newDate);
        }}
      >
        Select May 15, 2023
      </button>
      <div>Mode: {mode}</div>
      <div>Selected: {selected ? format(selected, 'PPP') : 'None'}</div>
    </div>
  ),
}));

describe('DatePicker', () => {
  it('renders with the correct date format', () => {
    const date = new Date('2023-04-10');
    render(<DatePicker value={date} onChange={() => {}} />);
    
    const formattedDate = format(date, 'PPP');
    expect(screen.getByText(formattedDate)).toBeInTheDocument();
  });

  it('handles date changes correctly', async () => {
    const user = userEvent.setup();
    const mockOnChange = jest.fn();
    const initialDate = new Date('2023-04-10');
    
    render(<DatePicker value={initialDate} onChange={mockOnChange} />);
    
    await user.click(screen.getByTestId('mock-popover-trigger'));
    
    await user.click(screen.getByTestId('mock-day-selector'));
    
    expect(mockOnChange).toHaveBeenCalled();
    
    const newDate = mockOnChange.mock.calls[0][0];
    expect(newDate.getFullYear()).toBe(2023);
    expect(newDate.getMonth()).toBe(4);
    expect(newDate.getDate()).toBe(15);
  });

  it('shows placeholder when no date is provided', () => {
    render(<DatePicker onChange={() => {}} />);
    
    expect(screen.getByText('Pick a date')).toBeInTheDocument();
  });

  it('is disabled when disabled prop is true', () => {
    const date = new Date('2023-04-10');
    render(<DatePicker value={date} onChange={() => {}} disabled={true} />);
    
    const datePickerButton = screen.getByText('April 10th, 2023').closest('button');
    expect(datePickerButton).toBeDisabled();
  });
}); 