import { useState, useEffect, useRef } from 'react';
import { 
  Search, X, Sparkles, FileText, Database, FlaskConical, 
  ArrowUpRight, Pin, SlidersHorizontal, User
} from 'lucide-react';

interface GlobalSearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function GlobalSearchModal({ isOpen, onClose }: GlobalSearchModalProps) {
  const [query, setQuery] = useState('');
  const inputRef = useRef<HTMLInputElement>(null);

  // Focus input when modal opens
  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    } else {
      setQuery('');
    }
  }, [isOpen]);

  // Handle escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-start justify-center pt-24 animate-fadeIn">
      {/* Blurred Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal Container */}
      <div className="relative w-full max-w-2xl bg-white rounded-2xl shadow-2xl overflow-hidden border border-slate-200 animate-slideDown flex flex-col max-h-[80vh]">
        
        {/* Search Header */}
        <div className="flex items-center px-4 py-3 border-b border-slate-100 shrink-0">
          <Search className="w-5 h-5 text-slate-400 shrink-0" />
          <input 
            ref={inputRef}
            type="text" 
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search compounds, targets, or ask AI to generate..." 
            className="flex-1 bg-transparent border-none focus:outline-none focus:ring-0 text-slate-800 text-base placeholder:text-slate-400 px-3"
          />
          <button 
            onClick={onClose}
            className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Quick Filters */}
        <div className="px-4 py-3 border-b border-slate-100 flex items-center justify-between bg-slate-50/50 shrink-0">
          <div className="flex items-center gap-2">
            <button className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-600 hover:bg-slate-50 transition-colors shadow-sm">
              <SlidersHorizontal className="w-3.5 h-3.5" /> Sort
            </button>
            <button className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-600 hover:bg-slate-50 transition-colors shadow-sm">
              <Database className="w-3.5 h-3.5" /> Type
            </button>
            <button className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 rounded-lg text-xs font-medium text-slate-600 hover:bg-slate-50 transition-colors shadow-sm">
              <User className="w-3.5 h-3.5" /> Creator
            </button>
          </div>
          
          <div className="flex items-center gap-2">
             <span className="text-xs font-medium text-slate-500">Only mine</span>
             <button className="w-8 h-4 bg-slate-200 rounded-full relative transition-colors shadow-inner">
               <div className="w-3 h-3 bg-white rounded-full absolute left-0.5 top-0.5 shadow-sm"></div>
             </button>
          </div>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto p-2">
          
          {/* AI Actions */}
          <div className="mb-4">
            <div className="px-3 py-2">
              <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Generate with AI</h3>
            </div>
            <div className="flex flex-col gap-1">
              <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-50 transition-colors group text-left">
                <div className="w-8 h-8 rounded-lg bg-[var(--color-roche-blue)]/10 text-[var(--color-roche-blue)] flex items-center justify-center shrink-0">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-800">Generate a toxicity summary report.</p>
                </div>
                <ArrowUpRight className="w-4 h-4 text-slate-300 group-hover:text-[var(--color-roche-blue)] transition-colors" />
              </button>
              
              <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-50 transition-colors group text-left">
                <div className="w-8 h-8 rounded-lg bg-[var(--color-roche-blue)]/10 text-[var(--color-roche-blue)] flex items-center justify-center shrink-0">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-slate-800">Find analogs for recent hits.</p>
                </div>
                <ArrowUpRight className="w-4 h-4 text-slate-300 group-hover:text-[var(--color-roche-blue)] transition-colors" />
              </button>
            </div>
          </div>

          {/* Pinned Items */}
          <div>
            <div className="px-3 py-2 flex items-center justify-between">
              <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Pinned Entities</h3>
            </div>
            <div className="flex flex-col gap-1">
              <button className="w-full flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-slate-50 transition-colors group text-left">
                <Pin className="w-4 h-4 text-slate-400 shrink-0" />
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                  <Database className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-800">Compound Library Alpha-9</p>
                </div>
              </button>

              <button className="w-full flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-slate-50 transition-colors group text-left">
                <Pin className="w-4 h-4 text-slate-400 shrink-0" />
                <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center shrink-0">
                  <FlaskConical className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-800">EGFR Binding Assay Protocol</p>
                </div>
              </button>
              
              <button className="w-full flex items-center gap-3 px-3 py-2 rounded-xl hover:bg-slate-50 transition-colors group text-left">
                <Pin className="w-4 h-4 text-slate-400 shrink-0" />
                <div className="w-8 h-8 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                  <FileText className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-800">Q3 Screening Results</p>
                </div>
              </button>
            </div>
          </div>
          
        </div>
        
        {/* Footer */}
        <div className="px-4 py-3 bg-slate-50 border-t border-slate-100 shrink-0 flex items-center justify-between">
           <button className="text-sm font-semibold text-[var(--color-roche-blue)] hover:text-blue-700 transition-colors flex items-center gap-1.5">
             + Create new query template
           </button>
           <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold tracking-widest uppercase text-slate-400">Save as default</span>
              <button className="w-8 h-4 bg-[var(--color-roche-blue)] rounded-full relative transition-colors shadow-inner">
                <div className="w-3 h-3 bg-white rounded-full absolute right-0.5 top-0.5 shadow-sm"></div>
              </button>
           </div>
        </div>
      </div>
      
      {/* Embedded Animations */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideDown {
          from { opacity: 0; transform: translateY(-10px) scale(0.98); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out forwards;
        }
        .animate-slideDown {
          animation: slideDown 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>
    </div>
  );
}
