import React from 'react';
import { NavLink } from 'react-router-dom';
import { LogoIcon, PlusIcon, ScannerIcon, ListIcon, ChartIcon, HistoryIcon, InstallIcon } from './icons/Icons';

interface HeaderProps {
  onAddTransaction: () => void;
  onInstall: () => void;
  installPrompt: any;
}

export const Header: React.FC<HeaderProps> = ({ onAddTransaction, onInstall, installPrompt }) => {
  const navLinkClasses = ({ isActive }: { isActive: boolean }) =>
    `flex items-center gap-2 px-3 py-2 rounded-md text-sm font-medium transition-colors ${
      isActive
        ? 'bg-blue-600 text-white'
        : 'text-gray-300 hover:bg-gray-700 hover:text-white'
    }`;

  return (
    <header className="bg-gray-800 text-white shadow-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0 flex items-center gap-2">
              <LogoIcon />
              <span className="font-bold text-xl">FinanScan</span>
            </div>
            {/* Desktop Navigation */}
            <nav className="hidden md:block ml-10">
              <div className="flex items-baseline space-x-4">
                <NavLink to="/scanner" className={navLinkClasses}><ScannerIcon className="h-5 w-5"/> Scanner</NavLink>
                <NavLink to="/transactions" className={navLinkClasses}><ListIcon className="h-5 w-5"/> Transações</NavLink>
                <NavLink to="/reports" className={navLinkClasses}><ChartIcon className="h-5 w-5"/> Relatórios</NavLink>
                <NavLink to="/history" className={navLinkClasses}><HistoryIcon className="h-5 w-5"/> Histórico</NavLink>
              </div>
            </nav>
          </div>
          <div className="hidden md:flex items-center gap-4">
            {installPrompt && (
              <button
                onClick={onInstall}
                className="bg-purple-500 hover:bg-purple-600 text-white font-bold py-2 px-4 rounded-full flex items-center transition-transform duration-200 ease-in-out hover:scale-105"
                title="Instalar o aplicativo"
              >
                <InstallIcon />
                <span className="ml-2">Instalar App</span>
              </button>
            )}
            <button
              onClick={onAddTransaction}
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded-full flex items-center transition-transform duration-200 ease-in-out hover:scale-105"
            >
              <PlusIcon />
              <span className="ml-2">Adicionar Transação</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
