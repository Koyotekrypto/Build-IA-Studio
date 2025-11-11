import React, { useState, useMemo } from 'react';
import { type Transaction, type TransactionType } from '../types';
import { CATEGORIES } from '../constants';
import { TransactionList } from '../components/TransactionList';
import { IncomeIcon, ExpenseIcon } from '../components/icons/Icons';

interface TransactionsPageProps {
  transactions: Transaction[];
  onAddTransaction: (type: TransactionType) => void;
  onEditTransaction: (transaction: Transaction) => void;
  onDeleteTransaction: (id: string) => void;
}

export const TransactionsPage: React.FC<TransactionsPageProps> = ({ transactions, onAddTransaction, onEditTransaction, onDeleteTransaction }) => {
  const [filterCategory, setFilterCategory] = useState<string>('all');
  const [filterMonth, setFilterMonth] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');


  const availableMonths = useMemo(() => {
    const months = new Set<string>();
    transactions.forEach(t => {
      const monthYear = new Date(t.date).toLocaleString('pt-BR', {timeZone: 'UTC', month: 'long', year: 'numeric' });
      const monthYearKey = t.date.substring(0, 7); // YYYY-MM
      months.add(JSON.stringify({label: monthYear, key: monthYearKey}));
    });
    return Array.from(months).map(m => JSON.parse(m)).sort((a,b) => b.key.localeCompare(a.key));
  }, [transactions]);

  const filteredTransactions = useMemo(() => {
    return transactions.filter(transaction => {
      const categoryMatch = filterCategory === 'all' || transaction.category === filterCategory;
      const monthMatch = filterMonth === 'all' || transaction.date.startsWith(filterMonth);
      const searchMatch = searchTerm === '' || transaction.description.toLowerCase().includes(searchTerm.toLowerCase());
      return categoryMatch && monthMatch && searchMatch;
    }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [transactions, filterCategory, filterMonth, searchTerm]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Histórico de Transações</h1>
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
      
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="search-filter" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Buscar por Descrição</label>
            <input 
              type="text"
              id="search-filter"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Ex: Supermercado"
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            />
          </div>
          <div>
            <label htmlFor="month-filter" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Filtrar por Mês</label>
            <select 
              id="month-filter" 
              value={filterMonth} 
              onChange={e => setFilterMonth(e.target.value)}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              <option value="all">Todos os Meses</option>
              {availableMonths.map(month => <option key={month.key} value={month.key}>{month.label}</option>)}
            </select>
          </div>
          <div>
            <label htmlFor="category-filter" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Filtrar por Categoria</label>
            <select 
              id="category-filter" 
              value={filterCategory} 
              onChange={e => setFilterCategory(e.target.value)}
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              <option value="all">Todas as Categorias</option>
              {CATEGORIES.map(cat => <option key={cat} value={cat}>{cat}</option>)}
            </select>
          </div>
        </div>

        <div>
          <TransactionList 
              transactions={filteredTransactions} 
              onEdit={onEditTransaction}
              onDelete={onDeleteTransaction}
          />
        </div>
      </div>
    </div>
  );
};
