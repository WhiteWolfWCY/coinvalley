import { accounts, categories, transactions } from '@/db/schema';

export const mockAccounts = [
  {
    id: 'acc_1',
    plaidId: 'plaid_acc_1',
    name: 'Checking Account',
    userId: 'user_1',
  },
  {
    id: 'acc_2',
    plaidId: 'plaid_acc_2',
    name: 'Savings Account',
    userId: 'user_1',
  },
];

export const mockCategories = [
  {
    id: 'cat_1',
    plaidId: 'plaid_cat_1',
    name: 'Food & Dining',
    userId: 'user_1',
  },
  {
    id: 'cat_2',
    plaidId: 'plaid_cat_2',
    name: 'Shopping',
    userId: 'user_1',
  },
];

export const mockTransactions = [
  {
    id: 'txn_1',
    amount: 2500,
    payee: 'Supermarket',
    notes: 'Groceries',
    date: new Date('2023-10-15'),
    accountId: 'acc_1',
    categoryId: 'cat_1',
  },
  {
    id: 'txn_2',
    amount: 5000,
    payee: 'Department Store',
    notes: 'Clothes',
    date: new Date('2023-10-16'),
    accountId: 'acc_1',
    categoryId: 'cat_2',
  },
];

export const mockDb = {
  select: jest.fn().mockImplementation(() => ({
    from: jest.fn().mockImplementation((table: any) => {
      if (table === accounts) return mockAccounts;
      if (table === categories) return mockCategories;
      if (table === transactions) return mockTransactions;
      return [];
    }),
  })),
  insert: jest.fn().mockReturnValue({
    values: jest.fn().mockReturnValue({
      returning: jest.fn().mockReturnValue({
        get: jest.fn().mockImplementation((table: any) => {
          if (table === accounts) return mockAccounts[0];
          if (table === categories) return mockCategories[0];
          if (table === transactions) return mockTransactions[0];
          return null;
        }),
      }),
    }),
  }),
  update: jest.fn().mockReturnValue({
    set: jest.fn().mockReturnValue({
      where: jest.fn().mockReturnValue({
        returning: jest.fn().mockReturnValue({
          get: jest.fn().mockImplementation(() => true),
        }),
      }),
    }),
  }),
  delete: jest.fn().mockReturnValue({
    where: jest.fn().mockReturnValue({
      returning: jest.fn().mockReturnValue({
        get: jest.fn().mockImplementation(() => true),
      }),
    }),
  }),
  query: jest.fn(),
  execute: jest.fn(),
  transaction: jest.fn().mockImplementation((callback: (db: any) => any) => callback(mockDb)),
};

export const mockSql = jest.fn().mockReturnValue({});

describe('db-mocks', () => {
  it('should have mock data defined', () => {
    expect(mockAccounts).toBeDefined();
    expect(mockCategories).toBeDefined();
    expect(mockTransactions).toBeDefined();
    expect(mockDb).toBeDefined();
  });
}); 