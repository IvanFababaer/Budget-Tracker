'use client';

import { useState, useEffect, useMemo } from 'react';
// 1. ADDED deleteDoc and doc to the imports
import { collection, addDoc, onSnapshot, query, orderBy, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import TransactionForm from '../components/TransactionForm';
import { PieChart, Pie, Tooltip, ResponsiveContainer, Cell, Legend } from 'recharts';

export default function Dashboard() {
  const [transactions, setTransactions] = useState<any[]>([]);
  const [selectedMonth, setSelectedMonth] = useState<string>('All Time');

  useEffect(() => {
    const q = query(collection(db, 'transactions'), orderBy('createdAt', 'desc'));
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const transArray: any[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        const transactionDate = data.date?.toDate ? data.date.toDate() : new Date(data.date || Date.now());
        transArray.push({ id: doc.id, ...data, date: transactionDate });
      });
      setTransactions(transArray);
    });
    return () => unsubscribe();
  }, []);

  const monthOptions = useMemo(() => {
    const months = transactions.map(t => 
      t.date.toLocaleString('default', { month: 'long', year: 'numeric' })
    );
    return ['All Time', ...Array.from(new Set(months))];
  }, [transactions]);

  const filteredData = useMemo(() => {
    if (selectedMonth === 'All Time') return transactions;
    return transactions.filter(t => 
      t.date.toLocaleString('default', { month: 'long', year: 'numeric' }) === selectedMonth
    );
  }, [transactions, selectedMonth]);

  const stats = useMemo(() => {
    let income = 0;
    let expense = 0;
    filteredData.forEach(t => {
      if (t.type === 'income') income += t.amount;
      else expense += t.amount;
    });
    return { income, expense, balance: income - expense };
  }, [filteredData]);

  const chartData = useMemo(() => {
    return filteredData
      .filter(t => t.type === 'expense')
      .reduce((acc: any[], current) => {
        const existing = acc.find(item => item.name === current.category);
        if (existing) existing.value += current.amount;
        else acc.push({ name: current.category, value: current.amount });
        return acc;
      }, []);
  }, [filteredData]);

  const handleAddTransaction = async (data: any) => {
    try {
      await addDoc(collection(db, 'transactions'), {
        ...data,
        date: new Date(),
        createdAt: new Date()
      });
    } catch (e) { console.error(e); }
  };

  // 2. THE NEW DELETE FUNCTION
  const handleDeleteTransaction = async (id: string) => {
    // Optional: Add a confirmation dialog so users don't delete by accident
    const isConfirmed = window.confirm("Are you sure you want to delete this transaction?");
    if (!isConfirmed) return;

    try {
      // Deletes the document from Firestore. 
      // The onSnapshot listener will automatically update the UI!
      await deleteDoc(doc(db, 'transactions', id));
    } catch (error) {
      console.error("Error deleting transaction: ", error);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-4 sm:p-8 transition-colors duration-500">
      <div className="max-w-6xl mx-auto space-y-10">
        
        <header className="flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h1 className="text-4xl font-black text-slate-900 dark:text-white tracking-tight">
              Finance <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-violet-500">Pulse</span>
            </h1>
            <p className="text-slate-500 font-medium">Viewing: <span className="text-indigo-500">{selectedMonth}</span></p>
          </div>

          <div className="relative inline-block w-full md:w-64">
            <select 
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-3 rounded-2xl shadow-sm font-bold text-slate-700 dark:text-slate-300 outline-none focus:ring-2 focus:ring-indigo-500 appearance-none"
            >
              {monthOptions.map(m => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>
        </header>
        
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-4 space-y-6">
            <div className="bg-gradient-to-br from-indigo-600 to-violet-700 p-8 rounded-[2.5rem] shadow-2xl shadow-indigo-500/20 text-white">
               <h2 className="text-indigo-100 text-[10px] font-black uppercase tracking-[0.2em] opacity-80">Net Position</h2>
               <p className="text-4xl sm:text-5xl font-black mt-2 tracking-tighter">
                 ₱{stats.balance.toLocaleString(undefined, { minimumFractionDigits: 2 })}
               </p>
               <div className="flex gap-4 mt-10 pt-6 border-t border-white/10">
                 <div>
                   <p className="text-indigo-200 text-[9px] font-black uppercase tracking-widest">Income</p>
                   <p className="text-lg font-bold text-emerald-300">₱{stats.income.toLocaleString()}</p>
                 </div>
                 <div className="border-l border-white/10 pl-4">
                   <p className="text-indigo-200 text-[9px] font-black uppercase tracking-widest">Expenses</p>
                   <p className="text-lg font-bold text-rose-300">₱{stats.expense.toLocaleString()}</p>
                 </div>
               </div>
            </div>

            <div className="bg-white dark:bg-slate-900 p-8 rounded-[2.5rem] border border-slate-200 dark:border-slate-800 h-[380px] shadow-sm">
              <h3 className="text-slate-900 dark:text-white font-black text-sm uppercase tracking-widest mb-6 text-center">Spending Mix</h3>
              {chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="90%">
                  <PieChart>
                    <Pie
                      data={chartData}
                      cx="50%" cy="45%"
                      innerRadius={65} outerRadius={85}
                      paddingAngle={8} dataKey="value" stroke="none"
                      animationBegin={0} animationDuration={800}
                    >
                      {chartData.map((_, i) => (
                        <Cell key={`cell-${i}`} fill={['#6366f1', '#8b5cf6', '#a855f7', '#d946ef', '#ec4899'][i % 5]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{borderRadius: '16px', border: 'none', backgroundColor: '#0f172a', color: '#fff'}} />
                    <Legend verticalAlign="bottom" iconType="circle" formatter={(v) => <span className="text-[10px] font-bold text-slate-400 uppercase">{v}</span>} />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="h-full flex items-center justify-center text-slate-400 italic text-sm">No expense data</div>
              )}
            </div>
          </div>
          
          <div className="lg:col-span-8 flex flex-col h-full">
            <TransactionForm onSubmit={handleAddTransaction} />
            
            {/* Scrollable Single-Page Activity Stream */}
            <div className="mt-8 flex-1">
              <div className="flex items-center justify-between mb-6 px-2">
                <h2 className="text-2xl font-black text-slate-900 dark:text-white">Activity Stream</h2>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest bg-slate-200 dark:bg-slate-800 px-3 py-1 rounded-full">
                  {filteredData.length} Entries
                </span>
              </div>
              
              {/* Scrollable Container */}
              <div className="grid grid-cols-1 gap-4 max-h-[600px] overflow-y-auto pr-2 pb-10" style={{ scrollbarWidth: 'thin' }}>
                {filteredData.length === 0 ? (
                  <div className="bg-slate-100 dark:bg-slate-900/50 border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-3xl p-16 text-center">
                    <p className="text-slate-400 font-medium">No movement in this period.</p>
                  </div>
                ) : (
                  filteredData.map((t) => (
                    <div key={t.id} className="group bg-white dark:bg-slate-900 p-5 rounded-3xl border border-slate-200 dark:border-slate-800 flex items-center justify-between hover:scale-[1.01] transition-all shadow-sm">
                      <div className="flex items-center gap-5 min-w-0">
                        <div className={`w-12 h-12 flex-shrink-0 rounded-2xl flex items-center justify-center font-black text-lg ${
                          t.type === 'income' ? 'bg-emerald-50 text-emerald-600 dark:bg-emerald-500/10' : 'bg-rose-50 text-rose-600 dark:bg-rose-500/10'
                        }`}>
                          {t.type === 'income' ? '↑' : '↓'}
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-slate-900 dark:text-white truncate">{t.description || 'General Entry'}</p>
                          <div className="flex flex-wrap items-center gap-2 mt-0.5">
                            <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest truncate">{t.category}</span>
                            <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                            <span className="text-[10px] font-medium text-slate-400 whitespace-nowrap">{t.date.toLocaleDateString()}</span>
                          </div>
                        </div>
                      </div>
                      
                      {/* 3. ADDED THE DELETE BUTTON SECTION */}
                      <div className="flex items-center gap-4">
                        <p className={`text-xl font-black ml-4 whitespace-nowrap ${t.type === 'income' ? 'text-emerald-500' : 'text-slate-900 dark:text-white'}`}>
                          ₱{t.amount.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                        </p>
                        
                        <button 
                          onClick={() => handleDeleteTransaction(t.id)}
                          className="p-2.5 text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-500/10 rounded-xl transition-all"
                          title="Delete transaction"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path d="M3 6h18"></path>
                            <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path>
                            <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path>
                            <line x1="10" y1="11" x2="10" y2="17"></line>
                            <line x1="14" y1="11" x2="14" y2="17"></line>
                          </svg>
                        </button>
                      </div>

                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}