import React, { useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { type Transaction } from '../types';

export const EvolutionChart: React.FC<{ transactions: Transaction[] }> = ({ transactions }) => {
    const data = useMemo(() => {
        const monthlyData: { [key: string]: { name: string, Receitas: number, Despesas: number } } = {};
        const sortedTransactions = [...transactions].sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

        sortedTransactions.forEach(t => {
            const month = new Date(t.date).toLocaleString('default', { timeZone: 'UTC', month: 'short', year: '2-digit' });
            if (!monthlyData[month]) {
                monthlyData[month] = { name: month, Receitas: 0, Despesas: 0 };
            }
            if (t.type === 'income') {
                monthlyData[month].Receitas += t.amount;
            } else {
                monthlyData[month].Despesas += t.amount;
            }
        });

        // Get last 6 months of data
        return Object.values(monthlyData).slice(-6);
    }, [transactions]);

    if (data.length === 0) {
        return <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">Dados insuficientes para o gráfico.</div>;
    }

    return (
        <div style={{ width: '100%', height: 300 }}>
            <ResponsiveContainer>
                <BarChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(128, 128, 128, 0.3)" />
                    <XAxis dataKey="name" />
                    <YAxis tickFormatter={(value: number) => `R$${(value/1000).toFixed(0)}k`} />
                    <Tooltip 
                        formatter={(value: number) => value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                        contentStyle={{
                            backgroundColor: 'rgba(31, 41, 55, 0.8)', // bg-gray-800 with opacity
                            border: '1px solid #4B5563', // border-gray-600
                            borderRadius: '0.5rem' // rounded-lg
                        }}
                        labelStyle={{ color: '#F9FAFB' }} // text-gray-50
                    />
                    <Legend />
                    <Bar dataKey="Receitas" fill="#10B981" />
                    <Bar dataKey="Despesas" fill="#EF4444" />
                </BarChart>
            </ResponsiveContainer>
        </div>
    );
};