import { useState } from 'react';
import { Send, ArrowRight, Bot, X } from 'lucide-react';
import { cn } from '../utils/cn';

const SUGGESTED_PROMPTS = [
  "Summarize yesterday's docking runs",
  "Analyze toxicity for Compound X",
  "List models currently training",
  "Generate weekly target report"
];

interface CopilotPanelProps {
  onClose?: () => void;
}

export function CopilotPanel({ onClose }: CopilotPanelProps) {
  const [inputValue, setInputValue] = useState('');

  return (
    <>
      {/* Optional backdrop for closing */}
      {onClose && <div className="fixed inset-0 z-40 bg-slate-900/10 backdrop-blur-[1px] transition-opacity" onClick={onClose} />}
      
      <div className="fixed top-0 right-0 h-screen flex flex-col w-[400px] bg-white border-l border-slate-200 shadow-2xl z-50 animate-slideLeft">
        {/* Header */}
      <div className="h-16 px-6 border-b border-slate-100 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2.5">
          <div className="w-7 h-7 rounded-lg bg-[var(--color-roche-blue)] flex items-center justify-center shadow-sm">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M6 3C6 10 18 14 18 21" stroke="white" strokeWidth="3" strokeLinecap="round" />
              <path d="M18 3C18 10 6 14 6 21" stroke="white" strokeWidth="3" strokeLinecap="round" />
            </svg>
          </div>
          <span className="font-bold text-slate-900 text-sm tracking-tight">Roche AI Copilot</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full border border-emerald-200 bg-emerald-50 text-emerald-600 text-[9px] font-bold tracking-widest uppercase">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
            Online
          </div>
          {onClose && (
            <button onClick={onClose} className="text-slate-400 hover:text-slate-600 transition-colors">
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Main Content Area (Scrollable) */}
      <div className="flex-1 overflow-y-auto p-6 flex flex-col justify-center items-center">
        <div className="w-full max-w-[320px] flex flex-col items-center text-center">
          {/* Bot Icon */}
          <div className="w-16 h-16 rounded-3xl bg-slate-50 flex items-center justify-center mb-6 border border-slate-100 shadow-sm">
            <Bot className="w-8 h-8 text-[var(--color-roche-blue)]" />
          </div>
          
          <h2 className="text-xl font-bold text-slate-900 mb-2">How can I help you?</h2>
          <p className="text-sm text-slate-500 mb-10 leading-relaxed">
            I can analyze docking runs, summarize reports, or query your connected compound libraries.
          </p>

          <div className="w-full flex flex-col gap-3">
            {SUGGESTED_PROMPTS.map((prompt, i) => (
              <button 
                key={i}
                onClick={() => setInputValue(prompt)}
                className="w-full text-left px-5 py-4 rounded-2xl border border-slate-100 bg-white hover:border-slate-200 hover:shadow-sm hover:bg-slate-50 transition-all flex items-center justify-between group"
              >
                <span className="text-[13px] font-medium text-slate-600 group-hover:text-slate-900">{prompt}</span>
                <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-[var(--color-roche-blue)] transition-colors" />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Input Area */}
      <div className="p-6 shrink-0 bg-white">
        <div className="relative mb-3">
          <input 
            type="text" 
            placeholder="Ask Roche AI anything..."
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-5 pr-12 py-3.5 text-sm focus:outline-none focus:bg-white focus:border-[var(--color-roche-blue)] focus:ring-1 focus:ring-[var(--color-roche-blue)] transition-all"
          />
          <button 
            className={cn(
              "absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-xl transition-all",
              inputValue.length > 0 
                ? "bg-[var(--color-roche-blue)] text-white shadow-sm hover:bg-[var(--color-roche-blue-hover)]" 
                : "text-slate-300"
            )}
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
        <p className="text-center text-[10px] font-medium text-slate-400">
          Roche AI can make mistakes. Consider verifying important molecular data.
        </p>
      </div>

      <style>{`
        @keyframes slideLeft {
          from { opacity: 0; transform: translateX(20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        .animate-slideLeft {
          animation: slideLeft 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>
      </div>
    </>
  );
}
