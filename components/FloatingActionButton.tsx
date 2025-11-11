import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PlusIcon, CloseIcon, IncomeIcon, ExpenseIcon, ScannerIcon } from './icons/Icons';

interface FloatingActionButtonProps {
  onAddIncome: () => void;
  onAddExpense: () => void;
}

export const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({ onAddIncome, onAddExpense }) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();

  const handleScan = () => {
    navigate('/scanner');
    setIsOpen(false);
  };

  const handleAddIncome = () => {
    onAddIncome();
    setIsOpen(false);
  };
  
  const handleAddExpense = () => {
    onAddExpense();
    setIsOpen(false);
  };

  const actions = [
    { label: 'Escanear Recibo', icon: <ScannerIcon className="w-6 h-6" />, action: handleScan, bg: 'bg-blue-500' },
    { label: 'Adicionar Despesa', icon: <ExpenseIcon className="w-6 h-6" />, action: handleAddExpense, bg: 'bg-red-500' },
    { label: 'Adicionar Receita', icon: <IncomeIcon className="w-6 h-6" />, action: handleAddIncome, bg: 'bg-green-500' },
  ];

  return (
    <div className="fixed bottom-20 right-4 z-40 md:bottom-6">
      <div className="relative flex flex-col items-center gap-4">
        {isOpen && (
          <div className="flex flex-col items-center gap-4 transition-all duration-300">
            {actions.map((item, index) => (
              <button
                key={index}
                onClick={item.action}
                className={`w-14 h-14 rounded-full text-white ${item.bg} hover:opacity-90 flex items-center justify-center shadow-lg transition-transform transform hover:scale-110`}
                title={item.label}
                aria-label={item.label}
              >
                {item.icon}
              </button>
            ))}
          </div>
        )}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="w-16 h-16 rounded-full bg-blue-600 hover:bg-blue-700 text-white flex items-center justify-center shadow-xl transition-all duration-300 ease-in-out transform hover:rotate-180"
          aria-expanded={isOpen}
          aria-label={isOpen ? "Fechar ações" : "Abrir ações"}
        >
          <div className={`transform transition-transform duration-300 ${isOpen ? 'rotate-45' : 'rotate-0'}`}>
            <PlusIcon />
          </div>
        </button>
      </div>
    </div>
  );
};
