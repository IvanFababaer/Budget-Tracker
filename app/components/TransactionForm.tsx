'use client';

import { useState } from 'react';

interface TransactionData {
  type: string;
  amount: number;
  category: string;
  description: string;
}

export default function TransactionForm({ onSubmit }: { onSubmit: (data: TransactionData) => void }) {
  const [type, setType] = useState('expense');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const transactionData = {
      type,
      amount: parseFloat(amount),
      category,
      description,
    };

    onSubmit(transactionData);

    // Reset fields
    setAmount('');
    setCategory('');
    setDescription('');
  };

  return (
    <form 
      onSubmit={handleSubmit} 
      className="p-8 bg-white dark:bg-slate-900 rounded-[2rem] border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-none transition-all duration-300"
    >
      <div className="flex items-center justify-between mb-8">
        <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
          New <span className="text-indigo-500">Entry</span>
        </h2>
        
        {/* Modern Toggle Switch for Type */}
        <div className="flex bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
          <button
            type="button"
            onClick={() => setType('expense')}
            className={`px-4 py-1.5 rounded-lg text-xs font-black transition-all ${
              type === 'expense' 
                ? 'bg-white dark:bg-slate-700 text-rose-500 shadow-sm' 
                : 'text-slate-400 dark:text-slate-500'
            }`}
          >
            EXPENSE
          </button>
          <button
            type="button"
            onClick={() => setType('income')}
            className={`px-4 py-1.5 rounded-lg text-xs font-black transition-all ${
              type === 'income' 
                ? 'bg-white dark:bg-slate-700 text-emerald-500 shadow-sm' 
                : 'text-slate-400 dark:text-slate-500'
            }`}
          >
            INCOME
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <label className="block text-[10px] font-black uppercase tracking-[0.15em] mb-2 text-slate-400 dark:text-slate-500 px-1">
            Amount (₱)
          </label>
          <input 
            type="number" 
            step="0.01"
            required 
            value={amount} 
            onChange={(e) => setAmount(e.target.value)}
            className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 p-4 rounded-2xl text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all font-bold placeholder:font-normal"
            placeholder="0.00"
          />
        </div>
        
        <div>
          <label className="block text-[10px] font-black uppercase tracking-[0.15em] mb-2 text-slate-400 dark:text-slate-500 px-1">
            Category
          </label>
          <select 
            required
            value={category} 
            onChange={(e) => setCategory(e.target.value)}
            className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 p-4 rounded-2xl text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all font-bold cursor-pointer appearance-none"
          >
            <option value="" disabled>Select category</option>
            {type === 'expense' ? (
              <>
                <option value="Housing">Housing</option>
                <option value="Food">Food</option>
                <option value="Utilities">Utilities</option>
                <option value="Transportation">Transportation</option>
                <option value="Entertainment">Entertainment</option>
              </>
            ) : (
              <>
                <option value="Salary">Salary</option>
                <option value="Freelance">Freelance</option>
                <option value="Investments">Investments</option>
                <option value="Other">Other</option>
              </>
            )}
          </select>
        </div>
      </div>

      <div className="mb-8">
        <label className="block text-[10px] font-black uppercase tracking-[0.15em] mb-2 text-slate-400 dark:text-slate-500 px-1">
          Reference / Description
        </label>
        <input 
          type="text" 
          value={description} 
          onChange={(e) => setDescription(e.target.value)}
          className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 p-4 rounded-2xl text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none transition-all font-medium"
          placeholder="e.g. Monthly Rent, SM Groceries"
        />
      </div>

      <button 
        type="submit" 
        className="w-full bg-gradient-to-r from-indigo-600 to-violet-600 hover:from-indigo-500 hover:to-violet-500 text-white font-black py-4 rounded-2xl shadow-xl shadow-indigo-500/20 transition-all active:scale-[0.98] uppercase tracking-widest text-xs"
      >
        Post Transaction
      </button>
    </form>
  );
}