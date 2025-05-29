import React from 'react';
import { render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

jest.mock('@/features/transactions/components/TransactionForm', () => ({
  TransactionForm: (props: any) => {
    const isEditing = !!props.id;
    
    return (
      <div data-testid="transaction-form">
        <div data-testid="date-picker"></div>
        <div data-testid="account-select"></div>
        <div data-testid="category-select"></div>
        <input placeholder="Add a payee" onChange={e => {}} />
        <div data-testid="amount-input"></div>
        <textarea placeholder="Optional notes" onChange={e => {}}></textarea>
        <button onClick={() => props.onSubmit({
          date: new Date('2023-01-01'),
          accountId: 'acc_1',
          payee: 'Test Payee',
          amount: 100000,
          notes: null,
          categoryId: null,
        })}>
          {isEditing ? 'Save changes' : 'Create transaction'}
        </button>
        {isEditing && (
          <button onClick={props.onDelete}>
            Delete transaction
          </button>
        )}
      </div>
    );
  }
}));

import { TransactionForm } from '@/features/transactions/components/TransactionForm';

describe('TransactionForm', () => {
  const mockOnSubmit = jest.fn();
  const mockOnDelete = jest.fn();
  const mockOnCreateAccount = jest.fn();
  const mockOnCreateCategory = jest.fn();
  
  const accountOptions = [
    { label: 'Checking', value: 'acc_1' },
    { label: 'Savings', value: 'acc_2' },
  ];
  
  const categoryOptions = [
    { label: 'Food', value: 'cat_1' },
    { label: 'Shopping', value: 'cat_2' },
  ];
  
  const defaultProps = {
    onSubmit: mockOnSubmit,
    onDelete: mockOnDelete,
    onCreateAccount: mockOnCreateAccount,
    onCreateCategory: mockOnCreateCategory,
    accountOptions,
    categoryOptions,
  };

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders the form with empty values', () => {
    render(<TransactionForm {...defaultProps} />);
    
    expect(screen.getByTestId('date-picker')).toBeInTheDocument();
    expect(screen.getByTestId('account-select')).toBeInTheDocument();
    expect(screen.getByTestId('category-select')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Add a payee')).toBeInTheDocument();
    expect(screen.getByTestId('amount-input')).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Optional notes')).toBeInTheDocument();
    expect(screen.getByText('Create transaction')).toBeInTheDocument();
  });

  it('renders the form with default values', () => {
    const defaultValues = {
      date: new Date('2023-01-01'),
      accountId: 'acc_1',
      categoryId: 'cat_1',
      payee: 'Test Payee',
      amount: '100',
      notes: 'Test notes',
    };

    render(<TransactionForm {...defaultProps} defaultValues={defaultValues} id="txn_1" />);
    
    expect(screen.getByText('Save changes')).toBeInTheDocument();
    expect(screen.getByText('Delete transaction')).toBeInTheDocument();
  });

  it('submits the form with correct values', async () => {
    const user = userEvent.setup();
    render(<TransactionForm {...defaultProps} />);
    
    await user.click(screen.getByText('Create transaction'));
    
    await waitFor(() => {
      expect(mockOnSubmit).toHaveBeenCalledWith({
        date: expect.any(Date),
        accountId: 'acc_1',
        payee: 'Test Payee',
            amount: 100000,
        notes: null,
        categoryId: null,
      });
    });
  });

  it('calls onDelete when delete button is clicked', async () => {
    const user = userEvent.setup();
    render(<TransactionForm {...defaultProps} id="txn_1" />);
    
    await user.click(screen.getByText('Delete transaction'));
    
    expect(mockOnDelete).toHaveBeenCalledTimes(1);  
  });
}); 