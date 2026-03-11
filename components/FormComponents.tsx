
import React from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';

export const Label = ({ children, required, sub }: { children?: React.ReactNode, required?: boolean, sub?: string }) => (
  <div className="mb-2">
    <label className="block text-xs font-black text-slate-700 uppercase tracking-tight">
      {children} {required && <span className="text-rose-500">*</span>}
    </label>
    {sub && <p className="text-[10px] text-slate-400 font-medium leading-tight mt-0.5">{sub}</p>}
  </div>
);

export const Input = (props: React.InputHTMLAttributes<HTMLInputElement>) => (
  <input 
    {...props}
    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all placeholder:text-slate-400 disabled:opacity-60 disabled:cursor-not-allowed"
  />
);

export const Select = ({ children, ...props }: React.SelectHTMLAttributes<HTMLSelectElement>) => (
  <select 
    {...props}
    className="w-full px-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all appearance-none cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
  >
    {children}
  </select>
);

export const TextArea = (props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) => (
  <textarea 
    {...props}
    className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-sm outline-none focus:ring-2 focus:ring-blue-100 focus:border-blue-400 transition-all placeholder:text-slate-400 min-h-[100px]"
  />
);

export const Section = ({ id, title, children, isOpen, onToggle, visible = true }: { id: string, title: string, children: React.ReactNode, isOpen: boolean, onToggle: (id: any) => void, visible?: boolean }) => {
  if (!visible) return null;
  return (
    <div className="bg-white rounded-3xl border border-slate-200 shadow-sm overflow-hidden">
      <div 
        onClick={() => onToggle(id)}
        className="p-6 flex justify-between items-center cursor-pointer hover:bg-slate-50/50 transition-colors border-b border-slate-50"
      >
        <div className="flex items-center gap-4">
          <h3 className="text-sm font-black text-slate-800 uppercase tracking-widest">{title}</h3>
        </div>
        <div className="text-slate-300">
          {isOpen ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
        </div>
      </div>
      {isOpen && (
        <div className="p-6 space-y-6 animate-in slide-in-from-top-2 duration-300">
          {children}
        </div>
      )}
    </div>
  );
};
