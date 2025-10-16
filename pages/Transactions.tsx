import React from 'react';
import { type Transaction, type TransactionType } from '../types';
import { TransactionList } from '../components/TransactionList';
import { IncomeIcon, ExpenseIcon } from '../components/icons/Icons';

interface TransactionsPageProps {
  transactions: Transaction[];
  onAddTransaction: (type: TransactionType) => void;
  onEditTransaction: (transaction: Transaction) => void;
  onDeleteTransaction: (id: string) => void;
}

export const TransactionsPage: React.FC<TransactionsPageProps> = ({ transactions, onAddTransaction, onEditTransaction, onDeleteTransaction }) => {
    const sortedTransactions = [...transactions].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Últimas Transações</h1>
        <div className="flex gap-4">
            <button
                onClick={() => onAddTransaction('income')}
                className="bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded-full flex items-center transition-transform duration-200 ease-in-out hover:scale-105"
            >
                <IncomeIcon />
                <span className="hidden sm:inline ml-2">Nova Receita</span>
            </button>
            <button
                onClick={() => onAddTransaction('expense')}
                className="bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded-full flex items-center transition-transform duration-200 ease-in-out hover:scale-105"
            >
                <ExpenseIcon />
                <span className="hidden sm:inline ml-2">Nova Despesa</span>
            </button>
        </div>
      </div>

      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
        <TransactionList 
            transactions={sortedTransactions} 
            onEdit={onEditTransaction}
            onDelete={onDeleteTransaction}
        />
      </div>
    </div>
  );
};