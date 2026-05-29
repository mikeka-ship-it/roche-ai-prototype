import { useEffect } from 'react';
import { X, FileText, FileBadge } from 'lucide-react';

interface CreateReportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateReportModal({ isOpen, onClose }: CreateReportModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-fadeIn">
      {/* Frosted Glass Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-md transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal Container */}
      <div className="relative w-full max-w-[700px] bg-white rounded-3xl shadow-2xl overflow-hidden border border-slate-200 animate-slideUp">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 rounded-full text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Content */}
        <div className="p-10">
          <h2 className="text-2xl font-semibold text-slate-900 text-center mb-10 font-serif tracking-tight">
            What type of report would you like to create?
          </h2>

          <div className="grid grid-cols-2 gap-5 mb-8">
            {/* Card 1 */}
            <button className="group flex flex-col items-center justify-center p-8 border-2 border-slate-200 rounded-3xl hover:border-[var(--color-roche-blue)] hover:bg-blue-50/30 hover:shadow-md transition-all text-center">
              <div className="w-16 h-16 rounded-2xl bg-rose-50 text-rose-300 flex items-center justify-center mb-4 group-hover:scale-105 group-hover:text-rose-400 transition-all">
                <FileText className="w-10 h-10" strokeWidth={1.5} />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Note or document</h3>
              <p className="text-sm text-slate-500 leading-relaxed px-4">
                Create a free form template using text instructions and formatting
              </p>
            </button>

            {/* Card 2 */}
            <button className="group flex flex-col items-center justify-center p-8 border-2 border-slate-200 rounded-3xl hover:border-[var(--color-roche-blue)] hover:bg-blue-50/30 hover:shadow-md transition-all text-center">
              <div className="w-16 h-16 rounded-2xl bg-rose-50 text-rose-300 flex items-center justify-center mb-4 group-hover:scale-105 group-hover:text-rose-400 transition-all">
                <FileBadge className="w-10 h-10" strokeWidth={1.5} />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">Fill a PDF form</h3>
              <p className="text-sm text-slate-500 leading-relaxed px-4">
                Create a template using a PDF form that auto-fills form fields
              </p>
            </button>
          </div>

          {/* Footer Actions */}
          <div className="flex items-center justify-end gap-3 mt-4">
            <button 
              onClick={onClose}
              className="px-6 py-2.5 rounded-full border border-slate-200 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors shadow-sm"
            >
              Cancel
            </button>
            <button 
              onClick={onClose}
              className="px-6 py-2.5 rounded-full bg-[#3B2943] text-white text-sm font-semibold hover:bg-[#2c1f32] transition-colors shadow-md"
            >
              Continue
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes slideUp {
          from { opacity: 0; transform: translateY(20px) scale(0.95); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.2s ease-out forwards;
        }
        .animate-slideUp {
          animation: slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>
    </div>
  );
}
