import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type TransactionType = 'sale' | 'payment' | 'expense';

export type Transaction = {
  id: string;
  date: string; // Store as ISO string
  type: TransactionType;
  description: string;
  customer: {
    id: string;
    name: string;
    taxNumber: string;
    address: string;
    phone: string;
  };
  amount: number;
  items?: Array<{
    productId: string;
    name: string;
    quantity: number;
    price: number;
    note?: string;
  }>;
  paymentMethod?: string;
  note?: string;
  discount?: number;
};

type TransactionsState = {
  transactions: Transaction[];
  addTransaction: (transaction: Omit<Transaction, 'id' | 'date'>) => void;
  getTransactionsByDate: (date: string) => Transaction[];
};

export const useTransactions = create<TransactionsState>()(
  persist(
    (set, get) => ({
      transactions: [],
      
      addTransaction: (transaction) => {
        set((state) => ({
          transactions: [...state.transactions, {
            ...transaction,
            id: `TRX${Math.random().toString(36).substr(2, 9).toUpperCase()}`,
            date: new Date().toISOString(), // Store as ISO string
          }],
        }));
      },

      getTransactionsByDate: (date) => {
        return get().transactions.filter(
          (transaction) => transaction.date.split('T')[0] === date
        );
      },
    }),
    {
      name: 'transactions-storage',
    }
  )
);