import React, { useMemo, useState } from 'react';
import { type Transaction } from '../types';
import { SummaryCard } from '../components/SummaryCard';
import { CategoryChart } from '../components/CategoryChart';
import { EvolutionChart } from '../components/EvolutionChart';
import { IncomeIcon, ExpenseIcon, BalanceIcon, AISparkleIcon } from '../components/icons/Icons';

interface ReportsProps {
  transactions: Transaction[];
  onGenerateTestData: () => void;
}

export const Reports: React.FC<ReportsProps> = ({ transactions, onGenerateTestData }) => {
  const [period, setPeriod] = useState('month');

  const filteredTransactions = useMemo(() => {
    const now = new Date();
    if (period === 'year') {
      return transactions.filter(t => new Date(t.date).getFullYear() === now.getFullYear());
    }
    if (period === '3months') {
      const threeMonthsAgo = new Date(now.getFullYear(), now.getMonth() - 2, 1);
      return transactions.filter(t => new Date(t.date) >= threeMonthsAgo);
    }
    // Default to 'month'
    return transactions.filter(t => {
      const transactionDate = new Date(t.date);
      return transactionDate.getMonth() === now.getMonth() && transactionDate.getFullYear() === now.getFullYear();
    });
  }, [transactions, period]);

  const { totalIncome, totalExpenses, balance } = useMemo(() => {
    return filteredTransactions.reduce(
        (acc, transaction) => {
          if (transaction.type === 'income') acc.totalIncome += transaction.amount;
          else acc.totalExpenses += transaction.amount;
          return acc;
        },
        { totalIncome: 0, totalExpenses: 0, balance: 0 }
      );
  }, [filteredTransactions]);
  
  const calculatedBalance = totalIncome - totalExpenses;

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white">Relatórios</h1>
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 w-full sm:w-auto">
          <select 
              value={period} 
              onChange={e => setPeriod(e.target.value)}
              className="w-full sm:w-auto pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
            >
              <option value="month">Este Mês</option>
              <option value="3months">Últimos 3 Meses</option>
              <option value="year">Este Ano</option>
          </select>
          <button
            onClick={onGenerateTestData}
            className="bg-gray-500 hover:bg-gray-600 text-white font-bold py-2 px-4 rounded-md flex items-center justify-center transition-colors text-sm"
            title="Gerar dados de teste para popular o aplicativo"
          >
            <AISparkleIcon />
            <span className="ml-2">Gerar Dados de Teste</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <SummaryCard title="Receitas" amount={totalIncome} icon={<IncomeIcon />} color="text-green-500" />
        <SummaryCard title="Despesas" amount={totalExpenses} icon={<ExpenseIcon />} color="text-red-500" />
        <SummaryCard title="Saldo" amount={calculatedBalance} icon={<BalanceIcon />} color={calculatedBalance >= 0 ? "text-blue-500" : "text-red-500"} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Despesas por Categoria</h2>
          <CategoryChart transactions={filteredTransactions} />
        </div>
        <div className="lg:col-span-3 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">Evolução Mensal</h2>
          <EvolutionChart transactions={transactions} />
        </div>
      </div>
    </div>
  );
};