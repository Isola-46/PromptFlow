import React from 'react';
import { Check, Info } from 'lucide-react';

interface ToastProps {
  message: string | null;
  type?: 'success' | 'info';
  onClose?: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, type = 'success' }) => {
  if (!message) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="fixed bottom-6 right-6 z-50 flex items-center gap-3 px-4 py-3 bg-neutral-900 border border-neutral-700 text-white rounded-lg shadow-xl shadow-black/40 text-sm animate-in fade-in slide-in-from-bottom-2 duration-150"
    >
      <div className={`p-1 rounded ${type === 'success' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-blue-500/20 text-blue-400'}`}>
        {type === 'success' ? <Check className="w-4 h-4" /> : <Info className="w-4 h-4" />}
      </div>
      <span className="font-medium">{message}</span>
    </div>
  );
};
