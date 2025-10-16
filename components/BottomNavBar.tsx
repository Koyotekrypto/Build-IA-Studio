import React from 'react';
import { NavLink } from 'react-router-dom';
import { ScannerIcon, ListIcon, ChartIcon, HistoryIcon } from './icons/Icons';

interface NavItemProps {
  to: string;
  icon: React.ReactNode;
  label: string;
}

const NavItem: React.FC<NavItemProps> = ({ to, icon, label }) => {
  const navLinkClasses = ({ isActive }: { isActive: boolean }) =>
    `flex flex-col items-center justify-center w-full pt-2 pb-1 text-xs transition-colors duration-200 ${
      isActive ? 'text-blue-500' : 'text-gray-500 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400'
    }`;

  return (
    <NavLink to={to} className={navLinkClasses}>
      {icon}
      <span className="mt-1">{label}</span>
    </NavLink>
  );
};

export const BottomNavBar: React.FC = () => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 h-16 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 shadow-lg md:hidden z-30">
      <div className="max-w-7xl mx-auto h-full flex justify-around items-center">
        <NavItem to="/scanner" icon={<ScannerIcon />} label="Scanner" />
        <NavItem to="/transactions" icon={<ListIcon />} label="Transações" />
        <NavItem to="/reports" icon={<ChartIcon />} label="Relatórios" />
        <NavItem to="/history" icon={<HistoryIcon />} label="Histórico" />
      </div>
    </nav>
  );
};