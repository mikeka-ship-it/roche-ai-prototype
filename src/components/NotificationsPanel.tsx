import { X, CheckCircle2, AlertTriangle, Database, FileText } from 'lucide-react';

export function NotificationsPanel({ onClose }: { onClose: () => void }) {
  const notifications = [
    { id: 1, title: "Campaign Alpha: Docking Completed", time: "10 mins ago", icon: Database, color: "text-blue-500", bg: "bg-blue-50", read: false },
    { id: 2, title: "Report Generated: Q3 Targets", time: "1 hour ago", icon: FileText, color: "text-emerald-500", bg: "bg-emerald-50", read: false },
    { id: 3, title: "Toxicity Model Evaluation Failed", time: "2 hours ago", icon: AlertTriangle, color: "text-rose-500", bg: "bg-rose-50", read: true },
    { id: 4, title: "System Update Complete", time: "Yesterday", icon: CheckCircle2, color: "text-slate-500", bg: "bg-slate-100", read: true },
  ];

  return (
    <>
      {/* Optional backdrop for closing, though currently managed in App.tsx */}
      <div className="fixed inset-0 z-40 bg-slate-900/10 backdrop-blur-[1px] transition-opacity" onClick={onClose} />
      
      <div className="fixed top-0 right-0 h-screen w-[320px] bg-white border-l border-slate-200 flex flex-col shadow-2xl z-50 animate-slideLeft">
        {/* Header */}
      <div className="h-16 px-6 border-b border-slate-100 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-2">
          <h2 className="text-[15px] font-bold text-slate-900 tracking-tight">Notifications</h2>
          <span className="bg-slate-100 text-slate-500 px-2 py-0.5 rounded-full text-[10px] font-bold tracking-widest">2 NEW</span>
        </div>
        <button 
          onClick={onClose}
          className="w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-2">
        {notifications.map((item) => (
          <div 
            key={item.id} 
            className={`p-3 rounded-xl border transition-all cursor-pointer group ${
              item.read ? 'bg-white border-slate-100 hover:border-slate-200' : 'bg-blue-50/30 border-blue-100 hover:border-blue-200'
            }`}
          >
            <div className="flex items-start gap-3">
              <div className={`w-8 h-8 rounded-lg ${item.bg} ${item.color} flex items-center justify-center shrink-0 mt-0.5`}>
                <item.icon className="w-4 h-4" />
              </div>
              <div className="flex-1 min-w-0">
                <p className={`text-sm tracking-tight mb-1 truncate group-hover:text-[var(--color-roche-blue)] transition-colors ${
                  item.read ? 'text-slate-700 font-medium' : 'text-slate-900 font-bold'
                }`}>
                  {item.title}
                </p>
                <p className="text-xs text-slate-500">{item.time}</p>
              </div>
              {!item.read && (
                <div className="w-2 h-2 rounded-full bg-[var(--color-roche-blue)] shrink-0 mt-1.5" />
              )}
            </div>
          </div>
        ))}
      </div>
      
      {/* Footer */}
      <div className="p-4 border-t border-slate-100 text-center shrink-0">
        <button className="text-[13px] font-semibold text-slate-500 hover:text-slate-800 transition-colors">
          Mark all as read
        </button>
      </div>
    </div>
    </>
  );
}
