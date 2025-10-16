
import React from 'react';

interface SummaryCardProps {
  title: string;
  amount: number;
  icon: React.ReactNode;
  color: string;
}

export const SummaryCard: React.FC<SummaryCardProps> = ({ title, amount, icon, color }) => {
  return (
    <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md flex items-center justify-between">
      <div>
        <p className="text-sm font-medium text-gray-500 dark:text-gray-400">{title}</p>
        <p className={`text-2xl font-bold ${color}`}>
          {amount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
        </p>
      </div>
      <div className={`p-3 rounded-full bg-gray-100 dark:bg-gray-700 ${color}`}>
        {icon}
      </div>
    </div>
  );
};
