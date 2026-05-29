import { 
  Activity, Database, AlertTriangle, 
  ArrowRight, FileText, CheckCircle2, ChevronRight 
} from 'lucide-react';

export function HomeView() {
  return (
    <div className="flex-1 flex overflow-hidden bg-[#FAF9F7] animate-fadeIn">
      
      {/* MAIN COLUMN: Data Overview */}
      <div className="flex-1 flex flex-col overflow-y-auto">
        <div className="p-8 flex flex-col gap-8 max-w-4xl mx-auto w-full">
          
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Good morning, Dr. Mueller</h1>
            <p className="text-slate-500 mt-1">Here is the status of your molecular discovery pipeline.</p>
          </div>

          {/* Top Status Cards */}
          <div className="grid grid-cols-3 gap-4">
            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-bold tracking-widest text-emerald-500 uppercase">System Health</span>
              </div>
              <span className="text-2xl font-bold text-slate-900">Optimal</span>
              <span className="text-sm text-slate-500 mt-1">All clusters operating normally</span>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                  <Activity className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-bold tracking-widest text-blue-500 uppercase">Active Models</span>
              </div>
              <span className="text-2xl font-bold text-slate-900">3 Training</span>
              <span className="text-sm text-slate-500 mt-1">Estimated completion: 2h 15m</span>
            </div>

            <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <div className="w-8 h-8 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center">
                  <AlertTriangle className="w-4 h-4" />
                </div>
                <span className="text-[10px] font-bold tracking-widest text-rose-500 uppercase">Attention</span>
              </div>
              <span className="text-2xl font-bold text-slate-900">12 Alerts</span>
              <span className="text-sm text-slate-500 mt-1">Toxicity threshold exceeded</span>
            </div>
          </div>

          {/* Recent Activity List */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-[11px] font-bold tracking-widest text-slate-400 uppercase">Recent Activity</h3>
              <button className="text-sm text-[var(--color-roche-blue)] hover:text-blue-700 font-semibold flex items-center gap-1">
                View all <ArrowRight className="w-3 h-3" />
              </button>
            </div>
            
            <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="flex flex-col divide-y divide-slate-100">
                {[
                  { title: "Campaign Alpha: Docking Completed", time: "10 mins ago", icon: Database, color: "text-blue-500", bg: "bg-blue-50" },
                  { title: "Report Generated: Q3 Targets", time: "1 hour ago", icon: FileText, color: "text-emerald-500", bg: "bg-emerald-50" },
                  { title: "Toxicity Model Evaluation Failed", time: "2 hours ago", icon: AlertTriangle, color: "text-rose-500", bg: "bg-rose-50" },
                  { title: "New Dataset Imported: PubChem 2024", time: "Yesterday", icon: Database, color: "text-slate-500", bg: "bg-slate-100" }
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-4 p-4 hover:bg-slate-50 transition-colors cursor-pointer group">
                    <div className={`w-10 h-10 rounded-lg ${item.bg} ${item.color} flex items-center justify-center shrink-0`}>
                      <item.icon className="w-5 h-5" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-slate-800 truncate group-hover:text-[var(--color-roche-blue)] transition-colors">{item.title}</p>
                      <p className="text-[13px] text-slate-500">{item.time}</p>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-[var(--color-roche-blue)] transition-colors" />
                  </div>
                ))}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
