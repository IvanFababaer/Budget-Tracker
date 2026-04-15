'use client';

import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';

export default function SpendingChart({ data }: { data: any[] }) {
  // Group transactions by category for the chart
  const chartData = data
    .filter(t => t.type === 'expense')
    .reduce((acc: any[], current) => {
      const existing = acc.find(item => item.name === current.category);
      if (existing) {
        existing.value += current.amount;
      } else {
        acc.push({ name: current.category, value: current.amount });
      }
      return acc;
    }, []);

  // Modern Color Palette
  const COLORS = ['#6366f1', '#8b5cf6', '#a855f7', '#d946ef', '#ec4899'];

  return (
    <div className="bg-white dark:bg-slate-900 p-6 sm:p-8 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 shadow-sm h-[380px] w-full transition-all duration-300">
      <h3 className="text-slate-900 dark:text-white font-black text-sm uppercase tracking-widest mb-6 text-center">
        Spending <span className="text-indigo-500">Mix</span>
      </h3>
      
      {chartData.length > 0 ? (
        <ResponsiveContainer width="100%" height="90%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="45%"
              innerRadius={65}
              outerRadius={85}
              paddingAngle={8}
              dataKey="value"
              stroke="none"
              animationBegin={0}
              animationDuration={800}
            >
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip 
              contentStyle={{ 
                borderRadius: '16px', 
                backgroundColor: '#0f172a', 
                border: 'none', 
                color: '#fff',
                padding: '12px'
              }}
              itemStyle={{ color: '#fff' }}
              // BULLETPROOF TYPE FIX:
              formatter={(value: any) => {
                const numericValue = Number(value) || 0;
                return [`₱${numericValue.toLocaleString()}`, 'Total'] as any;
              }}
            />
            <Legend 
              verticalAlign="bottom" 
              iconType="circle"
              formatter={(value) => (
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">
                  {value}
                </span>
              )}
            />
          </PieChart>
        </ResponsiveContainer>
      ) : (
        <div className="h-full pb-10 flex items-center justify-center text-slate-400 italic text-sm">
          No expense data available.
        </div>
      )}
    </div>
  );
}