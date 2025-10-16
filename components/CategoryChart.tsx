import React, { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { type Transaction } from '../types';

interface CategoryChartProps {
  transactions: Transaction[];
}

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#ff4d4d', '#4ddbff'];
const RADIAN = Math.PI / 180;

const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index, payload }: any) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  if (percent < 0.05) {
    return null; // Don't render label for very small slices
  }

  return (
    <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" className="text-xs font-bold">
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  );
};


export const CategoryChart: React.FC<CategoryChartProps> = ({ transactions }) => {
  const data = useMemo(() => {
    const expenseByCategory = transactions
      .filter(t => t.type === 'expense')
      .reduce((acc, transaction) => {
        acc[transaction.category] = (acc[transaction.category] || 0) + transaction.amount;
        return acc;
      }, {} as { [key: string]: number });

    return Object.entries(expenseByCategory).map(([name, value]) => ({ name, value }));
  }, [transactions]);

  if (data.length === 0) {
    return <div className="flex items-center justify-center h-full text-gray-500 dark:text-gray-400">Nenhuma despesa registrada.</div>;
  }

  return (
    <div style={{ width: '100%', height: 300 }}>
      <ResponsiveContainer>
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={renderCustomizedLabel}
            outerRadius={100}
            fill="#8884d8"
            dataKey="value"
            nameKey="name"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip formatter={(value: number) => value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })} />
          <Legend wrapperStyle={{fontSize: '14px'}}/>
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};