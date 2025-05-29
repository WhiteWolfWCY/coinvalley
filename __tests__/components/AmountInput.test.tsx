import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { AmountInput } from '@/components/AmountInput';

jest.mock('@/components/ui/input', () => {
  return {
    Input: ({ className, ...props }: any) => (
      <input 
        data-testid="mock-input" 
        className={className || ''}
        {...props} 
      />
    ),
  };
});

describe('AmountInput', () => {
  it('renders with placeholder', () => {
    render(<AmountInput placeholder="Enter amount" onChange={() => {}} value="" />);
    
    expect(screen.getByPlaceholderText('Enter amount')).toBeInTheDocument();
  });

  it('displays value with currency formatting', () => {
    render(<AmountInput value="100.50" onChange={() => {}} />);
    
    const input = screen.getByDisplayValue('$100.50');
    expect(input).toBeInTheDocument();
  });

  it('handles input change correctly', async () => {
    const handleChange = jest.fn();
    const user = userEvent.setup();
    
    render(<AmountInput value="" onChange={handleChange} />);
    
    const input = screen.getByRole('textbox');
    
    await user.type(input, '123');
    
    expect(handleChange).toHaveBeenCalled();
  });

  it('allows valid numeric input', () => {
    const handleChange = jest.fn();
    
    render(<AmountInput value="" onChange={handleChange} />);
    
    const input = screen.getByRole('textbox');
    
    fireEvent.change(input, { target: { value: '123.45' } });
    
    expect(handleChange).toHaveBeenCalled();
  });

  it('disables the input when disabled prop is true', () => {
    render(<AmountInput value="100" onChange={() => {}} disabled />);
    
    const input = screen.getByRole('textbox');
    expect(input).toBeDisabled();
  });
}); 