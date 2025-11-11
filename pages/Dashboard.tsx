import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { type Transaction, type TransactionType } from '../types';
import { SummaryCard } from '../components/SummaryCard';
import { CategoryChart } from '../components/CategoryChart';
import { TransactionList } from '../components/TransactionList';
import { FloatingActionButton } from '../components/FloatingActionButton';
import { IncomeIcon, ExpenseIcon, BalanceIcon } from '../components/icons/Icons';
import { EvolutionChart } from '../components/EvolutionChart';

interface DashboardProps {
  transactions: Transaction[];
  onAddTransaction: (type: TransactionType) => void;
  onEditTransaction: (transaction: Transaction) => void;
  onDeleteTransaction: (id: string) => void;
}

export const Dashboard: React.FC<DashboardProps> = ({ transactions, onAddTransaction, onEditTransaction, onDeleteTransaction }) => {
  const navigate = useNavigate();

  const currentMonthTransactions = useMemo(() => {
    const now = new Date();
    return transactions.filter(t => {
      const transactionDate = new Date(t.date);
      return transactionDate.getMonth() === now.getMonth() && transactionDate.getFullYear() === now.getFullYear();
    });
  }, [transactions]);

  const { totalIncome, totalExpenses } = useMemo(() => {
    return currentMonthTransactions.reduce(
        (acc, transaction) => {
          if (transaction.type === 'income') acc.totalIncome += transaction.amount;
          else acc.totalExpenses += transaction.amount;
          return acc;
        },
        { totalIncome: 0, totalExpenses: 0 }
      );
  }, [currentMonthTransactions]);

  const calculatedBalance = totalIncome - totalExpenses;
  
  const recentTransactions = useMemo(() => {
    return [...transactions]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5);
  }, [transactions]);


  return (
    <div className="space-y-6">
      <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
      
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <SummaryCard title="Receitas do Mês" amount={totalIncome} icon={<IncomeIcon />} color="text-green-500" />
        <SummaryCard title="Despesas do Mês" amount={totalExpenses} icon={<ExpenseIcon />} color="text-red-500" />
        <SummaryCard title="Saldo do Mês" amount={calculatedBalance} icon={<BalanceIcon />} color={calculatedBalance >= 0 ? "text-blue-500" : "text-red-500"} />
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Despesas do Mês</h2>
          <CategoryChart transactions={currentMonthTransactions} />
        </div>
        <div className="lg:col-span-3 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Evolução (Últimos 6 Meses)</h2>
          <EvolutionChart transactions={transactions} />
        </div>
      </div>

      {/* Recent Transactions */}
       <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Transações Recentes</h2>
            <button 
              onClick={() => navigate('/transactions')}
              className="text-sm font-medium text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
            >
              Ver Todas
            </button>
          </div>
          <TransactionList 
            transactions={recentTransactions} 
            onEdit={onEditTransaction}
            onDelete={onDeleteTransaction}
          />
        </div>
      
      <FloatingActionButton 
        onAddIncome={() => onAddTransaction('income')}
        onAddExpense={() => onAddTransaction('expense')}
      />
    </div>
  );
};
