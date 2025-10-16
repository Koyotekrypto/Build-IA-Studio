import React from 'react';
import { type Transaction } from '../types';
import { IncomeIcon, ExpenseIcon, EditIcon, TrashIcon } from './icons/Icons';

interface TransactionListProps {
  transactions: Transaction[];
  onEdit?: (transaction: Transaction) => void;
  onDelete?: (id: string) => void;
}

const TransactionItem: React.FC<{ transaction: Transaction; onEdit?: (t: Transaction) => void; onDelete?: (id: string) => void; }> = ({ transaction, onEdit, onDelete }) => {
  const isIncome = transaction.type === 'income';
  const amountColor = isIncome ? 'text-green-500' : 'text-red-500';
  const Icon = isIncome ? IncomeIcon : ExpenseIcon;
  const sign = isIncome ? '+' : '-';

  return (
    <li className="flex items-center justify-between py-3 border-b border-gray-200 dark:border-gray-700">
      <div className="flex items-center">
        <div className={`p-2 rounded-full mr-4 ${isIncome ? 'bg-green-100 dark:bg-green-900' : 'bg-red-100 dark:bg-red-900'}`}>
          <Icon className={amountColor} />
        </div>
        <div>
          <p className="font-semibold text-gray-800 dark:text-gray-200">{transaction.description}</p>
          <p className="text-sm text-gray-500 dark:text-gray-400">{transaction.category} &middot; {new Date(transaction.date).toLocaleDateString('pt-BR', {timeZone: 'UTC'})}</p>
        </div>
      </div>
      <div className="flex items-center gap-4">
        <p className={`font-bold ${amountColor}`}>
          {sign} {transaction.amount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
        </p>
        {(onEdit || onDelete) && (
          <div className="flex items-center gap-2">
            {onEdit && (
              <button onClick={() => onEdit(transaction)} className="text-gray-400 hover:text-blue-500 transition-colors" title="Editar">
                <EditIcon />
              </button>
            )}
            {onDelete && (
              <button onClick={() => onDelete(transaction.id)} className="text-gray-400 hover:text-red-500 transition-colors" title="Excluir">
                <TrashIcon />
              </button>
            )}
          </div>
        )}
      </div>
    </li>
  );
};

export const TransactionList: React.FC<TransactionListProps> = ({ transactions, onEdit, onDelete }) => {
    if (transactions.length === 0) {
        return <p className="text-center text-gray-500 dark:text-gray-400">Nenhuma transação encontrada.</p>;
    }

  return (
    <ul className="space-y-2">
      {transactions.map(transaction => (
        <TransactionItem key={transaction.id} transaction={transaction} onEdit={onEdit} onDelete={onDelete} />
      ))}
    </ul>
  );
};