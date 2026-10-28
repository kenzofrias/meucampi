import React from 'react';
import { Plus, UploadCloud } from 'lucide-react';

interface FloatingActionButtonProps {
  onClick: () => void;
}

export const FloatingActionButton: React.FC<FloatingActionButtonProps> = ({ onClick }) => {
  return (
    <div className="fixed bottom-6 right-6 z-40 flex items-center gap-2">
      <button
        onClick={onClick}
        aria-label="Upload rápido de documento"
        className="group flex items-center gap-2.5 px-4 py-3.5 bg-slate-900 hover:bg-slate-800 text-white rounded-full shadow-lg hover:shadow-xl active:scale-95 transition-all duration-200 border border-slate-700/60"
      >
        <Plus className="w-5 h-5 text-indigo-400 group-hover:rotate-90 transition-transform duration-200" />
        <span className="text-xs font-bold tracking-wide pr-1">
          Upload Rápido
        </span>
      </button>
    </div>
  );
};
