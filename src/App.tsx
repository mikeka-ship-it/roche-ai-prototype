import { useState, useEffect } from 'react';
import { ContextMenu } from './components/ContextMenu';
import { CompoundDetailModal, type CompoundData } from './components/CompoundDetailModal';
import { LearnView } from './components/LearnView';
import { CopilotPanel } from './components/CopilotPanel';
import { NotificationsPanel } from './components/NotificationsPanel';
import { HomeView } from './components/HomeView';
import { DataView } from './components/DataView';
import { MonitorView } from './components/MonitorView';
import { SettingsView } from './components/SettingsView';
import { NetworkView } from './components/NetworkView';
import { GlobalSearchModal } from './components/GlobalSearchModal';
import { AuthView } from './components/AuthView';
import { 
  Home, 
  BarChart2, 
  ActivitySquare, 
  Settings, 
  Users, 
  Search, 
  Bell, 
  Plus,
  ChevronDown,
  LayoutDashboard,
  Filter,
  MoreVertical,
  Calendar,
  Share2,
  Activity,
  FlaskConical,
  Database,
  Info,
  Sliders,
  Rocket,
  Check,
  Target,
  Edit2, Copy, Trash2, FileDown, PenLine, FilePlus2, Trash, EyeOff, Settings2,
  Clock, Play, Pause, ArrowUpRight, Zap, BarChart3, History, RefreshCw, ExternalLink, ChevronRight,
  BookOpen, Sparkles, CheckCircle2, AlertCircle
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip as RechartsTooltip, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from 'recharts';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// --- DATA ---

const CHART_DATA = [
  { date: 'Nov 17', converted: 3000 },
  { date: 'Nov 18', converted: 3250 },
  { date: 'Nov 19', converted: 3625 },
  { date: 'Nov 20', converted: 3125 },
  { date: 'Nov 21', converted: 3750 },
  { date: 'Nov 22', converted: 4000 },
  { date: 'Nov 23', converted: 3500 },
  { date: 'Nov 24', converted: 3500, predicted: 3500 },
  { date: 'Nov 25', converted: null, predicted: 3600 },
  { date: 'Nov 26', converted: null, predicted: 3900 },
  { date: 'Nov 27', converted: null, predicted: 4200 },
];

const GAUGE_DATA = [
  { name: 'Active', value: 85 },
  { name: 'Remaining', value: 15 },
];

const TABLE_DATA = [
  { target: 'Compound RH-402', group: 'Control Group', conversions: 120, avgTime: '2m 14s' },
  { target: 'Compound RH-319', group: 'Test Group A', conversions: 215, avgTime: '1m 45s' },
  { target: 'Compound RH-505', group: 'Test Group B', conversions: 89, avgTime: '3m 10s' },
  { target: 'Compound RH-112', group: 'Control Group', conversions: 104, avgTime: '2m 30s' },
];

const COMPOUND_LIBRARIES = ['Internal Rohe DB', 'ChEMBL', 'Enamine'];

// ============================================================
// SUB-COMPONENTS
// ============================================================

const CustomChartTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-[#0B1121] shadow-2xl rounded-xl p-4 min-w-[200px] border border-slate-800/60 z-50">
        <p className="text-[11px] font-bold tracking-[0.15em] text-slate-400 uppercase mb-3 font-sans border-b border-slate-800 pb-2">
          {label}
        </p>
        <div className="flex flex-col gap-2.5">
          {payload.map((entry: any, index: number) => (
            <div key={index} className="flex items-center justify-between gap-6">
              <div className="flex items-center gap-2">
                <div 
                  className="w-2 h-2 rounded-full shadow-[0_0_8px_rgba(0,102,204,0.5)]" 
                  style={{ backgroundColor: entry.color || '#38bdf8' }} 
                />
                <span className="text-slate-300 font-medium text-[13px] capitalize tracking-tight">
                  {entry.dataKey}
                </span>
              </div>
              <span className="text-white font-bold text-[14px]">
                {entry.value.toLocaleString()}
              </span>
            </div>
          ))}
          
          {/* Contextual Metric */}
          <div className="mt-1 pt-3 border-t border-slate-800/80 flex items-center justify-between gap-4">
             <span className="text-slate-500 font-semibold text-[11px] uppercase tracking-widest">Est. Drop-off</span>
             <span className="text-rose-400 font-bold text-[12px] bg-rose-500/10 px-1.5 py-0.5 rounded">
               ~{(Math.random() * 5 + 15).toFixed(1)}%
             </span>
          </div>
        </div>
      </div>
    );
  }
  return null;
};

function AnalyticsView({ onCompoundClick }: { onCompoundClick: (compound: CompoundData) => void }) {
  const [showChartTooltip, setShowChartTooltip] = useState(false);

  return (
    <div className="flex-1 flex flex-col bg-[#FAF9F7] overflow-hidden animate-fadeIn">
      {/* STANDARD GLOBAL HEADER */}
      <div className="h-16 px-8 border-b border-slate-200 bg-white flex items-center justify-between shrink-0 z-10">
        <h1 className="text-xl font-bold text-slate-900 tracking-tight">Compound Funnel Analysis</h1>
      </div>

      <div className="flex-1 flex overflow-hidden">
        {/* SECONDARY LEFT PANEL */}
        <aside className="w-[280px] bg-white border-r border-slate-200 flex flex-col overflow-y-auto hidden md:flex shrink-0">
        <div className="p-4 border-b border-slate-100 flex items-center justify-between group hover:bg-slate-50 transition-colors duration-200 cursor-pointer">
          <ContextMenu 
            align="left"
            trigger={<h2 className="font-semibold text-slate-800 flex items-center gap-1 group-hover:text-[var(--color-roche-blue)] transition-colors cursor-pointer">default <ChevronDown className="w-4 h-4" /></h2>}
            sections={[
              { id: 'v1', items: [{ id: 'default', label: 'Default View', icon: LayoutDashboard }, { id: 'custom', label: 'Custom Filters', icon: Filter }] }
            ]}
          />
          <div className="flex gap-2">
            <button className="text-slate-400 hover:text-slate-600 transition-colors"><Filter className="w-4 h-4" /></button>
            <ContextMenu 
              align="right"
              trigger={<button className="text-slate-400 hover:text-slate-600 transition-colors hover:bg-slate-100 p-1 rounded-md"><MoreVertical className="w-4 h-4" /></button>}
              sections={[
                {
                  id: 's1',
                  items: [
                    { id: 'edit', label: 'Edit view', icon: Edit2 },
                    { id: 'dup', label: 'Duplicate', icon: Copy },
                    { id: 'options', label: 'Settings2', icon: Settings2 },
                  ]
                },
                {
                  id: 's2',
                  items: [
                    { id: 'hide', label: 'Hide from sidebar', icon: EyeOff },
                    { id: 'del', label: 'Delete view', icon: Trash2, danger: true },
                  ]
                }
              ]}
            />
          </div>
        </div>

        <div className="flex px-5 pt-3 border-b border-slate-200 bg-white justify-between">
          {['Conversion', 'Funnel', 'Table', 'Retention'].map((tab, i) => (
            <button key={tab} className={cn(
              "pb-2.5 px-1 relative transition-colors duration-200",
              i === 0 
                ? "text-[var(--color-roche-blue)]" 
                : "text-slate-500 hover:text-slate-800"
            )}>
              <span className={cn(
                "text-[10px] font-bold uppercase tracking-wider",
              )}>{tab}</span>
              {i === 0 && (
                <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-[var(--color-roche-blue)] rounded-t-full" />
              )}
            </button>
          ))}
        </div>

        <div className="p-4 flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between text-sm font-semibold text-slate-800">
              <div className="flex items-center gap-1.5 text-slate-800 font-bold">
                Events <span className="text-[10px] font-bold tracking-widest text-slate-400 uppercase ml-1">in this order</span>
              </div>
              <button className="text-[var(--color-roche-blue)] text-xs font-semibold hover:underline">Explorer</button>
            </div>
            
            <div className="pl-2 mt-4 relative">
              {/* Connecting line */}
              <div className="absolute top-3 bottom-6 left-[15px] border-l-2 border-slate-100" />
              
              <div className="relative pl-10 mb-7 group cursor-pointer">
                {/* Node dot */}
                <div className="absolute left-[7px] top-1.5 w-4 h-4 bg-white border-[3px] border-slate-300 rounded-full group-hover:border-[var(--color-roche-blue)] group-hover:scale-125 transition-all duration-300" />
                <div className="flex items-center justify-between mb-1">
                  <span className="text-sm font-extrabold text-slate-800 group-hover:text-[var(--color-roche-blue)] transition-colors">Trial Initialized</span>
                  <ContextMenu 
                    align="right"
                    trigger={<button className="text-slate-400 hover:text-slate-600 transition-colors hover:bg-slate-100 p-1 rounded-md opacity-0 group-hover:opacity-100"><MoreVertical className="w-4 h-4" /></button>}
                    sections={[
                      { id: 's1', items: [{ id: 'edit', label: 'Edit condition', icon: PenLine }, { id: 'add', label: 'Add sub-event', icon: FilePlus2, hasSubmenu: true }] },
                      { id: 's2', items: [{ id: 'del', label: 'Remove event', icon: Trash, danger: true }] }
                    ]}
                  />
                </div>
                <div className="flex gap-3 text-[11px] font-bold tracking-widest uppercase text-slate-400">
                  <span className="hover:text-slate-700 transition-colors">+ Filter</span>
                  <span className="hover:text-slate-700 transition-colors">+ Group</span>
                </div>
              </div>

              <div className="relative pl-10 mb-7 group cursor-pointer">
                <div className="absolute left-[7px] top-1.5 w-4 h-4 bg-white border-[3px] border-[var(--color-roche-blue)] rounded-full group-hover:scale-125 transition-all duration-300 shadow-[0_0_8px_rgba(0,102,204,0.3)]" />
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-sm font-extrabold text-slate-800 group-hover:text-[var(--color-roche-blue)] transition-colors">Compound Assessed</span>
                  <ContextMenu 
                    align="right"
                    trigger={<button className="text-slate-400 hover:text-slate-600 transition-colors hover:bg-slate-100 p-1 rounded-md opacity-0 group-hover:opacity-100"><MoreVertical className="w-4 h-4" /></button>}
                    sections={[
                      { id: 's1', items: [{ id: 'edit', label: 'Edit condition', icon: PenLine }, { id: 'add', label: 'Add sub-event', icon: FilePlus2, hasSubmenu: true }] },
                      { id: 's2', items: [{ id: 'del', label: 'Remove event', icon: Trash, danger: true }] }
                    ]}
                  />
                </div>
                <div className="bg-slate-50 rounded-md py-1.5 px-2.5 flex items-center gap-2 mb-2.5 w-fit border border-slate-200 shadow-sm">
                   <span className="text-[10px] uppercase tracking-widest font-bold text-slate-500">Compound Tag</span>
                   <span className="text-xs font-mono font-bold text-[var(--color-roche-blue)] bg-blue-50 px-1.5 rounded">= RH-402</span>
                </div>
                <div className="flex gap-3 text-[11px] font-bold tracking-widest uppercase text-slate-400">
                  <span className="hover:text-slate-700 transition-colors">+ Filter</span>
                  <span className="hover:text-slate-700 transition-colors">+ Group</span>
                </div>
              </div>

              <div className="relative pl-10">
                 <button className="text-[11px] font-extrabold tracking-widest uppercase text-[var(--color-roche-blue)] hover:text-[var(--color-roche-blue-hover)] transition-colors flex items-center gap-1.5">
                   <Plus className="w-3.5 h-3.5" /> Add Event
                 </button>
              </div>
            </div>
          </div>

          <hr className="border-slate-200 my-2" />

          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between text-sm font-semibold text-slate-800">
              <div className="flex items-center gap-1.5 text-slate-800 font-bold">
                Measured as
              </div>
              <ContextMenu 
                align="right"
                trigger={<button className="text-[var(--color-roche-blue)] text-xs font-semibold hover:underline flex items-center gap-1">Advanced <ChevronDown className="w-3 h-3"/></button>}
                sections={[
                  { id: 'adv1', items: [{ id: 'metrics', label: 'Custom Metrics' }, { id: 'config', label: 'Configuration' }] }
                ]}
              />
            </div>
            
            <div className="pl-6 grid grid-cols-2 gap-2 mt-2">
              <button className="bg-blue-50 text-[var(--color-roche-blue)] border border-[var(--color-roche-blue)]/30 py-2 rounded-md text-[10px] tracking-widest uppercase font-bold shadow-sm transition-colors hover:bg-blue-100">Conversion</button>
              <button className="bg-white text-slate-500 border border-slate-200 hover:bg-slate-50 hover:text-slate-800 py-2 rounded-md text-[10px] tracking-widest uppercase font-bold shadow-sm transition-colors">Over Time</button>
              <button className="bg-white text-slate-500 border border-slate-200 hover:bg-slate-50 hover:text-slate-800 py-2 rounded-md text-[10px] tracking-widest uppercase font-bold shadow-sm transition-colors">Frequency</button>
              <button className="bg-white text-slate-500 border border-slate-200 hover:bg-slate-50 hover:text-slate-800 py-2 rounded-md text-[10px] tracking-widest uppercase font-bold shadow-sm transition-colors">Significance</button>
            </div>
          </div>
        </div>
      </aside>

        {/* MAIN CONTENT AREA */}
        <div className="flex-1 flex flex-col bg-[#FAF9F7] overflow-y-auto relative">
          
          {/* Dashboard Main Content Grid */}
          <main className="flex-1 p-6 flex flex-col gap-6">
            
            {/* Dashboard Header */}
            <div className="flex flex-col gap-5">
              <div className="flex items-start justify-between">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="text-[10px] font-bold tracking-widest text-[var(--color-roche-blue)] uppercase bg-blue-100 px-2 py-0.5 rounded">Draft</span>
                    <span className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">Target Compound Conversion</span>
                  </div>
                  <h1 className="text-2xl font-extrabold tracking-tight text-slate-900 mb-2">In-Silico to In-Vitro Transition Funnel</h1>
              <p className="text-sm leading-relaxed text-slate-600">
                Monitoring compound drop-off rates from computational screening to physical lab validation.
              </p>
            </div>
            
            <div className="flex items-center gap-2 mt-1 shrink-0">
              <button className="bg-white border border-slate-200 text-slate-700 px-3 py-1.5 rounded-md text-sm font-medium hover:bg-slate-50 shadow-sm flex items-center gap-1 transition-colors duration-200">
                More <ChevronDown className="w-4 h-4" />
              </button>
              <button className="bg-white border border-slate-200 text-slate-700 px-3 py-1.5 rounded-md text-sm font-medium hover:bg-slate-50 shadow-sm transition-colors duration-200">
                Save
              </button>
              <button className="bg-[var(--color-roche-blue)] text-white px-3 py-1.5 rounded-md text-sm font-medium hover:bg-[var(--color-roche-blue-hover)] shadow-sm flex items-center gap-1.5 transition-colors duration-200">
                <Share2 className="w-4 h-4" /> Share
              </button>
            </div>
          </div>

          {/* Chart Controls Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 py-2 border-y border-slate-200 bg-[#F8F9FA] px-2 rounded-lg">
            <div className="flex gap-2">
              <button className="bg-white border border-slate-200 text-slate-700 px-3 py-1.5 rounded text-xs font-semibold hover:bg-slate-50 shadow-sm flex items-center gap-1.5 transition-colors duration-200">
                <Activity className="w-3.5 h-3.5" /> Anomaly + Forecast
              </button>
              <ContextMenu
                align="right"
                trigger={
                  <button className="bg-white border border-slate-200 text-slate-700 px-3 py-1.5 rounded text-xs font-semibold hover:bg-slate-50 shadow-sm flex items-center gap-1.5 transition-colors duration-200">
                    Compare <ChevronDown className="w-3 h-3" />
                  </button>
                }
                sections={[
                  { id: 'c1', items: [{ id: 'prev', label: 'Previous Period' }, { id: 'year', label: 'Previous Year' }] }
                ]}
              />
              <span className="text-[10px] font-bold tracking-widest text-slate-400 uppercase flex items-center ml-3">Data from &lt;1 min ago <Database className="w-3 h-3 ml-1 text-slate-400" /></span>
            </div>
            <div className="flex items-center gap-1 bg-white border border-slate-200 rounded p-1 shadow-sm">
              <ContextMenu
                align="right"
                trigger={
                  <button className="px-3 py-1.5 rounded bg-slate-100 text-slate-800 text-xs font-semibold transition-colors hover:bg-slate-200">
                    Daily <ChevronDown className="w-3 h-3 inline" />
                  </button>
                }
                sections={[
                  { id: 't1', items: [{ id: 'hourly', label: 'Hourly' }, { id: 'daily', label: 'Daily' }, { id: 'weekly', label: 'Weekly' }] }
                ]}
              />
              <div className="w-px h-4 bg-slate-200 mx-1" />
              <button className="px-2.5 py-1.5 text-slate-500 text-xs font-semibold hover:bg-slate-50 rounded transition-colors duration-200">7d</button>
              <button className="px-2.5 py-1.5 bg-blue-50 text-[var(--color-roche-blue)] rounded text-xs font-semibold">30d</button>
              <button className="px-2.5 py-1.5 text-slate-500 text-xs font-semibold hover:bg-slate-50 rounded transition-colors duration-200">60d</button>
              <button className="px-2.5 py-1.5 text-slate-500 text-xs font-semibold hover:bg-slate-50 rounded transition-colors duration-200">90d</button>
              <div className="w-px h-4 bg-slate-200 mx-1" />
              <button className="px-2.5 py-1.5 text-slate-500 text-xs font-semibold hover:bg-slate-50 rounded transition-colors duration-200"><Calendar className="w-3.5 h-3.5" /></button>
            </div>
          </div>
        </div>

        {/* Dashboard Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          
          {/* Large Chart Card */}
          <div className="lg:col-span-2 xl:col-span-3 bg-white border border-slate-200 rounded-xl shadow-sm p-6 flex flex-col min-h-[450px]">
            <div className="flex flex-col mb-8">
              <ContextMenu 
                align="left"
                trigger={
                  <div className="flex items-center gap-1 text-[10px] font-bold tracking-widest text-slate-400 uppercase mb-2 cursor-pointer hover:text-slate-600 transition-colors">
                    Total Conversion <ChevronDown className="w-4 h-4 ml-1" />
                  </div>
                }
                sections={[
                  { id: 'mc', items: [{ id: 'total', label: 'Total Conversion' }, { id: 'rel', label: 'Relative Conversion' }, { id: 'drop', label: 'Drop-off Rate' }] }
                ]}
              />
              <div className="flex items-baseline gap-3">
                <span className="text-5xl font-extrabold tracking-tighter text-slate-900">25.0%</span>
                <span className="text-sm text-emerald-600 font-bold flex items-center bg-emerald-50 px-2 py-0.5 rounded">
                  ▲ 1.2%
                </span>
              </div>
              <p className="text-sm leading-relaxed text-slate-500 mt-3">Since Nov 17. From <span className="font-semibold text-slate-800">[Trial Initialized]</span> to <span className="font-semibold text-slate-800">[Compound Assessed]</span> within the last 30 days.</p>
            </div>

            <div className="flex-1 w-full relative cursor-pointer" onClick={() => setShowChartTooltip(!showChartTooltip)}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={CHART_DATA} margin={{ top: 20, right: 20, left: 0, bottom: 10 }}>
                  <defs>
                    <linearGradient id="colorBlue" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#0066CC" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#0066CC" stopOpacity={0.1}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="date" stroke="#94a3b8" tick={{fill: '#64748b', fontSize: 11, fontWeight: 600}} tickLine={false} axisLine={false} dy={12} />
                  <YAxis stroke="#94a3b8" tick={{fill: '#64748b', fontSize: 11, fontWeight: 600}} tickLine={false} axisLine={false} tickFormatter={(val) => `${val / 1000}k`} />
                  <RechartsTooltip 
                    content={<CustomChartTooltip />}
                    cursor={{ stroke: '#cbd5e1', strokeWidth: 1 }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="converted" 
                    stroke="#0066CC" 
                    strokeWidth={3} 
                    fillOpacity={1} 
                    fill="url(#colorBlue)" 
                    isAnimationActive={false} 
                    activeDot={{ r: 4, strokeWidth: 2, stroke: '#fff', fill: '#0066CC' }}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="predicted" 
                    stroke="#0066CC" 
                    strokeWidth={2} 
                    strokeDasharray="6 6" 
                    fillOpacity={0} 
                    isAnimationActive={false} 
                  />
                </AreaChart>
              </ResponsiveContainer>
              
              {/* Chart Tooltip Overlay — shown on chart click */}
              {showChartTooltip && (
                <div
                  className="absolute top-1/4 left-1/3 bg-slate-900 border border-slate-700 shadow-xl backdrop-blur-md rounded-lg p-4 w-52 text-xs md:block z-10 text-white animate-fadeIn"
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    onClick={(e) => { e.stopPropagation(); setShowChartTooltip(false); }}
                    className="absolute top-2 right-2 text-slate-500 hover:text-white transition-colors p-0.5 rounded hover:bg-slate-700"
                  >
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}><path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
                  <p className="text-[10px] font-bold tracking-widest text-slate-400 uppercase mb-2">All Trials</p>
                  <p className="text-slate-300 mb-3 font-medium">[Compound Assessed]</p>
                  <p className="font-extrabold text-2xl tracking-tighter mb-2 text-white">25.0% <span className="text-[10px] font-bold tracking-widest text-slate-400 uppercase align-middle ml-1">converted</span></p>
                  <div className="space-y-1.5 text-slate-400 mt-3 font-medium">
                    <p>1/4 unique conversion</p>
                    <p>2m 9s avg time to complete</p>
                  </div>
                  <button
                   onClick={(e) => { e.stopPropagation(); onCompoundClick({ id: '#RH-402', name: 'Compound RH-402', group: 'Control Group', conversions: 120, avgTime: '2m 14s' }); setShowChartTooltip(false); }}
                   className="mt-4 w-full bg-[var(--color-roche-blue)] text-white py-2 rounded-md font-bold text-[10px] tracking-widest uppercase hover:bg-[var(--color-roche-blue-hover)] transition-colors shadow-md">Click for Actions</button>
                </div>
              )}
            </div>
          </div>

          {/* Side Column Cards */}
          <div className="flex flex-col gap-6">
            
            {/* Live Gauge Card */}
            <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6 flex flex-col h-64 relative overflow-hidden">
              <div className="flex items-center gap-2 mb-4 relative z-10">
                <div className="w-2.5 h-2.5 rounded-full bg-[var(--color-roche-blue)] animate-pulse shadow-[0_0_12px_rgba(0,102,204,0.8)]" />
                <h3 className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">Current live inferences</h3>
                <Info className="w-4 h-4 text-slate-300 ml-auto cursor-pointer hover:text-slate-500 transition-colors" />
              </div>
              
              <div className="flex-1 relative flex flex-col items-center justify-end pb-4">
                <div className="w-full h-36 absolute -top-4 filter drop-shadow-[0_4px_12px_rgba(0,102,204,0.25)]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={GAUGE_DATA}
                        cx="50%"
                        cy="100%"
                        startAngle={180}
                        endAngle={0}
                        innerRadius={65}
                        outerRadius={85}
                        paddingAngle={2}
                        dataKey="value"
                        stroke="none"
                        isAnimationActive={false}
                      >
                        <Cell fill="#0066CC" />
                        <Cell fill="#F1F5F9" />
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="text-center mt-16 z-10">
                  <span className="text-5xl font-extrabold tracking-tighter text-slate-900">42</span>
                  <p className="text-[10px] font-bold tracking-widest text-slate-400 uppercase mt-1">Realtime</p>
                </div>
              </div>
              
              <div className="grid grid-cols-2 gap-4 border-t border-slate-100 pt-4 mt-auto relative z-10">
                <div>
                  <p className="text-[10px] font-bold tracking-widest text-slate-400 uppercase mb-1">New Trials</p>
                  <p className="text-xl font-bold text-slate-800">14</p>
                </div>
                <div>
                  <p className="text-[10px] font-bold tracking-widest text-slate-400 uppercase mb-1">Avg execution</p>
                  <p className="text-xl font-bold text-slate-800">1m 36s</p>
                </div>
              </div>
            </div>

            {/* Info Card */}
            <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-6 flex-1 flex flex-col group hover:border-slate-300 transition-colors duration-300">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">Notebook Context</h3>
                <ContextMenu 
                  align="right"
                  trigger={<button className="text-slate-300 hover:text-slate-600 transition-colors hover:bg-slate-100 p-1 rounded-md"><MoreVertical className="w-4 h-4" /></button>}
                  sections={[
                    {
                      id: 's1',
                      items: [
                        { id: 'copy', label: 'Copy to clipboard', icon: Copy, shortcut: '⌘C' },
                        { id: 'export', label: 'Export as PDF', icon: FileDown },
                      ]
                    },
                    {
                      id: 's2',
                      items: [
                        { id: 'remove', label: 'Remove from context', icon: Trash2, danger: true },
                      ]
                    }
                  ]}
                />
              </div>
              <p className="leading-relaxed text-slate-600 text-sm flex-1">
                This analysis tracks the primary transition funnel for Target Protein Alpha. Note the steep attrition rate at Stage 2 for Compound RH-505 due to predicted liver toxicity markers identified by the AI.
              </p>
              <button className="mt-5 text-[var(--color-roche-blue)] text-sm font-semibold hover:underline flex items-center gap-1.5 bg-blue-50 w-fit px-3 py-1.5 rounded transition-colors group-hover:bg-blue-100">
                <Plus className="w-4 h-4" /> Add to notebook
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Section - Data Table Breakdown */}
        <div className="bg-white border border-slate-200 rounded-xl shadow-sm flex flex-col overflow-hidden mt-2">
          <div className="p-4 border-b border-slate-100 bg-slate-50/50 flex items-center justify-between">
            <div className="flex items-center gap-4">
              <span className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">Breakdown by:</span>
              <ContextMenu
                align="left"
                trigger={
                  <button className="bg-white border border-slate-200 text-slate-700 px-3 py-1.5 rounded-md text-sm font-semibold hover:bg-slate-50 shadow-sm flex items-center gap-1.5 transition-colors">
                    Top 5 (Default) <ChevronDown className="w-4 h-4" />
                  </button>
                }
                sections={[
                  { id: 'top', items: [{ id: 't5', label: 'Top 5' }, { id: 't10', label: 'Top 10' }, { id: 't20', label: 'Top 20' }, { id: 'all', label: 'All Items' }] }
                ]}
              />
              <div className="relative ml-2 hidden md:block">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input type="text" placeholder="Search parameters..." className="border border-slate-200 rounded-md py-1.5 pl-9 pr-3 text-sm focus:outline-none focus:border-[var(--color-roche-blue)] focus:ring-1 focus:ring-[var(--color-roche-blue)] shadow-sm font-medium w-64" />
              </div>
            </div>
            <ContextMenu
              align="left"
              trigger={
                <button className="bg-white border border-slate-200 text-slate-700 px-3 py-1.5 rounded-md text-sm font-semibold hover:bg-slate-50 shadow-sm flex items-center gap-1.5 transition-colors">
                  <Share2 className="w-4 h-4" /> More <ChevronDown className="w-4 h-4" />
                </button>
              }
              sections={[
                { id: 'm1', items: [{ id: 'export', label: 'Export Data', icon: FileDown }, { id: 'share', label: 'Share Report', icon: Share2 }] }
              ]}
            />
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm whitespace-nowrap">
              <thead className="bg-white border-b border-slate-100">
                <tr>
                  <th className="px-6 py-4 text-[10px] font-bold tracking-widest text-slate-400 uppercase">
                    <span className="flex items-center gap-3">
                      <input type="checkbox" className="rounded border-slate-300 text-[var(--color-roche-blue)] focus:ring-[var(--color-roche-blue)] w-4 h-4 cursor-pointer" defaultChecked /> Segment
                    </span>
                  </th>
                  <th className="px-6 py-4 text-[10px] font-bold tracking-widest text-slate-400 uppercase">Control Variable</th>
                  <th className="px-6 py-4 text-[10px] font-bold tracking-widest text-slate-400 uppercase">Conversions</th>
                  <th className="px-6 py-4 text-[10px] font-bold tracking-widest text-slate-400 uppercase text-right">Avg Completion Time</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-50 text-slate-700">
                {TABLE_DATA.map((row, i) => (
                  <tr
                    key={i}
                    className="hover:bg-slate-50/80 transition-colors group cursor-pointer"
                    onClick={() => onCompoundClick({ id: `#RH-${row.target.split('RH-')[1]}`, name: row.target, group: row.group, conversions: row.conversions, avgTime: row.avgTime })}
                  >
                    <td className="px-6 py-4">
                      <span className="flex items-center gap-3 font-semibold text-slate-800">
                        <input type="checkbox" className="rounded border-slate-300 text-[var(--color-roche-blue)] focus:ring-[var(--color-roche-blue)] w-4 h-4 cursor-pointer" defaultChecked />
                        <div className="w-3 h-3 rounded bg-[var(--color-roche-blue)] shadow-sm" />
                        {row.target}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-500 font-medium">{row.group}</td>
                    <td className="px-6 py-4 font-mono font-bold text-slate-800">{row.conversions}</td>
                    <td className="px-6 py-4 text-right font-mono font-medium text-slate-500">{row.avgTime}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </main>
    </div>
  </div>
</div>
  );
}

// ============================================================

function ExperimentsView() {
  const [selectedProtein, setSelectedProtein] = useState('Kinase-Alpha-7');
  const [proteinDropdownOpen, setProteinDropdownOpen] = useState(false);
  const [selectedLibraries, setSelectedLibraries] = useState<string[]>(['Internal Rohe DB']);
  const [confidenceThreshold, setConfidenceThreshold] = useState(75);

  const proteins = ['Kinase-Alpha-7', 'EGFR-Beta-2', 'HER2-Gamma-1', 'PD-L1-Delta-4', 'BRAF-V600E'];

  const recentCampaigns = [
    { id: 1, name: 'EGFR-Beta-2 Screen #47', status: 'running', progress: 68, time: '2h 14m', hits: 34 },
    { id: 2, name: 'HER2-Gamma-1 Screen #46', status: 'completed', progress: 100, time: '3h 58m', hits: 12 },
    { id: 3, name: 'PD-L1-Delta-4 Screen #45', status: 'completed', progress: 100, time: '5h 02m', hits: 27 },
    { id: 4, name: 'BRAF-V600E Screen #44', status: 'paused', progress: 31, time: '1h 05m', hits: 8 },
  ];

  const activityLog = [
    { id: 1, action: 'Campaign #47 found 3 new hit compounds', time: '12m ago', type: 'success' as const },
    { id: 2, action: 'Confidence threshold adjusted to 80% on #46', time: '1h ago', type: 'info' as const },
    { id: 3, action: 'Campaign #45 completed — 27 hits identified', time: '3h ago', type: 'success' as const },
    { id: 4, action: 'Campaign #44 paused by Dr. Mueller', time: '5h ago', type: 'warning' as const },
  ];

  const toggleLibrary = (lib: string) => {
    setSelectedLibraries(prev =>
      prev.includes(lib) ? prev.filter(l => l !== lib) : [...prev, lib]
    );
  };

  return (
    <div className="flex-1 flex flex-col bg-[#FAF9F7] overflow-hidden animate-fadeIn">
      
      {/* STANDARD GLOBAL HEADER */}
      <div className="h-16 px-8 border-b border-slate-200 bg-white flex items-center justify-between shrink-0 z-10">
        <h1 className="text-xl font-bold text-slate-900 tracking-tight">Molecular Screening Workspace</h1>
        <div className="flex items-center gap-2 shrink-0">
          <button className="bg-white border border-slate-200 text-slate-700 px-3 py-1.5 rounded-md text-sm font-medium hover:bg-slate-50 shadow-sm flex items-center gap-1.5 transition-colors">
            <History className="w-4 h-4" /> History
          </button>
          <button className="bg-white border border-slate-200 text-slate-700 px-3 py-1.5 rounded-md text-sm font-medium hover:bg-slate-50 shadow-sm flex items-center gap-1.5 transition-colors">
            <RefreshCw className="w-4 h-4" /> Refresh
          </button>
          <ContextMenu
            align="right"
            trigger={<button className="bg-white border border-slate-200 text-slate-400 hover:text-slate-600 p-1.5 rounded-md shadow-sm hover:bg-slate-50 transition-colors"><MoreVertical className="w-4 h-4" /></button>}
            sections={[
              {
                id: 's1',
                items: [
                  { id: 'settings', label: 'Workspace settings', icon: Settings2 },
                  { id: 'export', label: 'Export all results', icon: FileDown },
                  { id: 'share', label: 'Share workspace', icon: ExternalLink },
                ]
              },
              {
                id: 's2',
                items: [
                  { id: 'archive', label: 'Archive workspace', icon: EyeOff },
                ]
              }
            ]}
          />
        </div>
      </div>

      {/* Main Two-Column Grid */}
      <div className="flex-1 overflow-y-auto p-6">
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">

        {/* LEFT COLUMN — Campaign Setup */}
        <div className="xl:col-span-2 flex flex-col gap-6">

          {/* Stats Row */}
          <div className="grid grid-cols-4 gap-4">
            {[
              { label: 'Avg screen duration', value: '4h 12m', sub: 'Last 30 runs', icon: Clock, trend: '-12m' },
              { label: 'Success rate', value: '94.2%', sub: 'Hit-to-lead ratio', icon: Target, trend: '+2.1%' },
              { label: 'Queue depth', value: '3', sub: 'Campaigns pending', icon: BarChart3, trend: null },
              { label: 'Active screens', value: '2', sub: 'Running now', icon: Zap, trend: null },
            ].map((card) => (
              <div key={card.label} className="bg-white border border-slate-200 rounded-xl shadow-sm p-4 hover:border-slate-300 transition-colors duration-200 group relative">
                <div className="flex items-start justify-between mb-3">
                  <div className="p-1.5 bg-slate-50 rounded-lg border border-slate-100 group-hover:bg-blue-50 group-hover:border-blue-100 transition-colors">
                    <card.icon className="w-3.5 h-3.5 text-slate-400 group-hover:text-[var(--color-roche-blue)] transition-colors" />
                  </div>
                  <ContextMenu
                    align="right"
                    trigger={<button className="text-slate-300 hover:text-slate-500 transition-colors p-0.5 rounded hover:bg-slate-100"><MoreVertical className="w-3.5 h-3.5" /></button>}
                    sections={[
                      {
                        id: 's1',
                        items: [
                          { id: 'details', label: 'View details', icon: ArrowUpRight },
                          { id: 'export', label: 'Export metric', icon: FileDown },
                        ]
                      }
                    ]}
                  />
                </div>
                <p className="text-[10px] font-bold tracking-widest text-slate-400 uppercase mb-1">{card.label}</p>
                <div className="flex items-baseline gap-2">
                  <p className="text-xl font-extrabold tracking-tighter text-slate-900">{card.value}</p>
                  {card.trend && (
                    <span className={cn(
                      "text-xs font-bold px-1.5 py-0.5 rounded",
                      card.trend.startsWith('+') ? "text-emerald-600 bg-emerald-50" : "text-blue-600 bg-blue-50"
                    )}>
                      {card.trend}
                    </span>
                  )}
                </div>
                <p className="text-xs text-slate-500 font-medium mt-0.5">{card.sub}</p>
              </div>
            ))}
          </div>

          {/* Campaign Form Card */}
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
            
            {/* Card Header */}
            <div className="px-6 py-4 border-b border-slate-100 bg-slate-50/60 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-1.5 bg-blue-100 rounded-md">
                  <Rocket className="w-4 h-4 text-[var(--color-roche-blue)]" />
                </div>
                <div>
                  <h2 className="font-bold text-slate-800 text-base tracking-tight">New AI Screening Campaign</h2>
                  <p className="text-[10px] font-bold tracking-widest text-slate-400 uppercase mt-0.5">Configure parameters below</p>
                </div>
              </div>
              <ContextMenu
                align="right"
                trigger={<button className="text-slate-400 hover:text-slate-600 transition-colors hover:bg-slate-100 p-1.5 rounded-md"><MoreVertical className="w-4 h-4" /></button>}
                sections={[
                  {
                    id: 's1',
                    items: [
                      { id: 'template', label: 'Save as template', icon: Copy },
                      { id: 'load', label: 'Load from template', icon: FilePlus2, hasSubmenu: true },
                      { id: 'defaults', label: 'Reset to defaults', icon: RefreshCw },
                    ]
                  }
                ]}
              />
            </div>

            {/* Form Body — 2-column grid inside */}
            <div className="px-6 py-6 flex flex-col gap-6">

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Target Protein */}
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] font-bold tracking-widest text-slate-400 uppercase flex items-center gap-2">
                    <Target className="w-3.5 h-3.5" /> Target Protein
                  </label>
                  <div className="relative">
                    <button
                      onClick={() => setProteinDropdownOpen(!proteinDropdownOpen)}
                      className="w-full flex items-center justify-between bg-white border border-slate-200 rounded-lg px-4 py-2.5 text-sm font-semibold text-slate-800 hover:border-slate-300 focus:border-[var(--color-roche-blue)] focus:ring-1 focus:ring-[var(--color-roche-blue)] focus:outline-none transition-all shadow-sm"
                    >
                      <span className="flex items-center gap-2.5">
                        <span className="w-2 h-2 rounded-full bg-emerald-500 shadow-sm" />
                        {selectedProtein}
                      </span>
                      <ChevronDown className={cn("w-4 h-4 text-slate-400 transition-transform duration-200", proteinDropdownOpen && "rotate-180")} />
                    </button>
                    {proteinDropdownOpen && (
                      <div className="absolute top-full left-0 right-0 mt-1.5 bg-white border border-slate-200 rounded-lg shadow-xl z-20 py-1.5 animate-fadeIn">
                        {proteins.map((protein) => (
                          <button
                            key={protein}
                            onClick={() => { setSelectedProtein(protein); setProteinDropdownOpen(false); }}
                            className={cn(
                              "w-full text-left px-4 py-2.5 text-sm font-medium transition-colors duration-150 flex items-center justify-between",
                              protein === selectedProtein
                                ? "bg-blue-50 text-[var(--color-roche-blue)] font-semibold"
                                : "text-slate-700 hover:bg-slate-50"
                            )}
                          >
                            <span className="flex items-center gap-2.5">
                              <span className={cn("w-2 h-2 rounded-full", protein === selectedProtein ? "bg-[var(--color-roche-blue)]" : "bg-slate-300")} />
                              {protein}
                            </span>
                            {protein === selectedProtein && <Check className="w-4 h-4 text-[var(--color-roche-blue)]" />}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                {/* AI Confidence Threshold */}
                <div className="flex flex-col gap-2">
                  <div className="flex items-center justify-between">
                    <label className="text-[10px] font-bold tracking-widest text-slate-400 uppercase flex items-center gap-2">
                      <Sliders className="w-3.5 h-3.5" /> AI Confidence
                    </label>
                    <span className="text-lg font-extrabold tracking-tighter text-slate-900">{confidenceThreshold}%</span>
                  </div>
                  <div className="relative pt-1">
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={confidenceThreshold}
                      onChange={(e) => setConfidenceThreshold(Number(e.target.value))}
                      className="w-full h-2 bg-slate-100 rounded-lg appearance-none cursor-pointer accent-[var(--color-roche-blue)] [&::-webkit-slider-thumb]:appearance-none [&::-webkit-slider-thumb]:h-5 [&::-webkit-slider-thumb]:w-5 [&::-webkit-slider-thumb]:rounded-full [&::-webkit-slider-thumb]:bg-[var(--color-roche-blue)] [&::-webkit-slider-thumb]:shadow-lg [&::-webkit-slider-thumb]:shadow-blue-200 [&::-webkit-slider-thumb]:border-2 [&::-webkit-slider-thumb]:border-white [&::-webkit-slider-thumb]:cursor-pointer"
                    />
                    <div className="flex justify-between mt-1.5 px-0.5">
                      <span className="text-[10px] font-bold tracking-widest text-slate-300 uppercase">0%</span>
                      <span className="text-[10px] font-bold tracking-widest text-slate-300 uppercase">50%</span>
                      <span className="text-[10px] font-bold tracking-widest text-slate-300 uppercase">100%</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Compound Libraries */}
              <div className="flex flex-col gap-2.5">
                <label className="text-[10px] font-bold tracking-widest text-slate-400 uppercase flex items-center gap-2">
                  <Database className="w-3.5 h-3.5" /> Compound Libraries
                </label>
                <div className="flex gap-3">
                  {COMPOUND_LIBRARIES.map((lib) => {
                    const isActive = selectedLibraries.includes(lib);
                    return (
                      <button
                        key={lib}
                        onClick={() => toggleLibrary(lib)}
                        className={cn(
                          "flex-1 relative flex items-center justify-center gap-2 py-3 px-4 rounded-lg text-sm font-semibold border-2 transition-all duration-200 shadow-sm",
                          isActive
                            ? "bg-blue-50 border-[var(--color-roche-blue)] text-[var(--color-roche-blue)] shadow-blue-100"
                            : "bg-white border-slate-200 text-slate-600 hover:border-slate-300 hover:bg-slate-50"
                        )}
                      >
                        {isActive && (
                          <div className="absolute top-1.5 right-1.5 w-4 h-4 bg-[var(--color-roche-blue)] rounded-full flex items-center justify-center">
                            <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />
                          </div>
                        )}
                        {lib}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Card Footer */}
            <div className="px-6 py-4 border-t border-slate-100 bg-slate-50/40 flex items-center justify-between">
              <p className="text-xs text-slate-400 font-medium">
                Estimated screening time: <span className="font-bold text-slate-700">~4h 32m</span> for {selectedProtein}
              </p>
              <button className="bg-[var(--color-roche-blue)] hover:bg-[var(--color-roche-blue-hover)] text-white px-5 py-2 rounded-lg text-sm font-bold transition-all duration-200 shadow-md shadow-blue-200 hover:shadow-lg hover:shadow-blue-300 hover:-translate-y-0.5 active:translate-y-0 flex items-center gap-2">
                <Rocket className="w-4 h-4" />
                Launch AI In-Silico Screen
              </button>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN — Recent + Activity */}
        <div className="flex flex-col gap-6">

          {/* Recent Campaigns Card */}
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
            <div className="px-5 py-3.5 border-b border-slate-100 bg-slate-50/60 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <History className="w-4 h-4 text-slate-400" />
                <h3 className="text-sm font-bold text-slate-800">Recent Campaigns</h3>
              </div>
              <button className="text-xs font-semibold text-[var(--color-roche-blue)] hover:underline flex items-center gap-1">
                View all <ChevronRight className="w-3 h-3" />
              </button>
            </div>
            <div className="divide-y divide-slate-50">
              {recentCampaigns.map((campaign) => (
                <div key={campaign.id} className="px-5 py-3.5 hover:bg-slate-50/80 transition-colors group cursor-pointer">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div className={cn(
                        "w-2 h-2 rounded-full shrink-0 mt-1",
                        campaign.status === 'running' && "bg-emerald-500 animate-pulse shadow-[0_0_6px_rgba(16,185,129,0.6)]",
                        campaign.status === 'completed' && "bg-slate-300",
                        campaign.status === 'paused' && "bg-amber-400"
                      )} />
                      <div className="min-w-0">
                        <p className="text-sm font-semibold text-slate-800 truncate">{campaign.name}</p>
                        <div className="flex items-center gap-2 mt-0.5">
                          <span className={cn(
                            "text-[10px] font-bold tracking-widest uppercase px-1.5 py-0.5 rounded",
                            campaign.status === 'running' && "text-emerald-700 bg-emerald-50",
                            campaign.status === 'completed' && "text-slate-500 bg-slate-100",
                            campaign.status === 'paused' && "text-amber-700 bg-amber-50"
                          )}>
                            {campaign.status}
                          </span>
                          <span className="text-[10px] font-medium text-slate-400">{campaign.time}</span>
                        </div>
                      </div>
                    </div>
                    <ContextMenu
                      align="right"
                      trigger={<button className="text-slate-300 hover:text-slate-500 transition-colors p-0.5 rounded hover:bg-slate-100 opacity-0 group-hover:opacity-100"><MoreVertical className="w-3.5 h-3.5" /></button>}
                      sections={[
                        {
                          id: 's1',
                          items: [
                            { id: 'view', label: 'View results', icon: ArrowUpRight },
                            { id: 'dup', label: 'Duplicate campaign', icon: Copy },
                            ...(campaign.status === 'running' ? [{ id: 'pause', label: 'Pause campaign', icon: Pause }] : []),
                            ...(campaign.status === 'paused' ? [{ id: 'resume', label: 'Resume campaign', icon: Play }] : []),
                          ]
                        },
                        {
                          id: 's2',
                          items: [
                            { id: 'del', label: 'Delete campaign', icon: Trash, danger: true },
                          ]
                        }
                      ]}
                    />
                  </div>
                  {/* Progress bar */}
                  <div className="flex items-center gap-2 mt-1">
                    <div className="flex-1 h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div
                        className={cn(
                          "h-full rounded-full transition-all duration-500",
                          campaign.status === 'running' && "bg-[var(--color-roche-blue)]",
                          campaign.status === 'completed' && "bg-slate-300",
                          campaign.status === 'paused' && "bg-amber-400"
                        )}
                        style={{ width: `${campaign.progress}%` }}
                      />
                    </div>
                    <span className="text-[10px] font-bold text-slate-400 tabular-nums w-8 text-right">{campaign.progress}%</span>
                  </div>
                  <div className="flex items-center gap-1 mt-1.5">
                    <FlaskConical className="w-3 h-3 text-slate-300" />
                    <span className="text-xs text-slate-500 font-medium">{campaign.hits} hits found</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Activity Feed */}
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
            <div className="px-5 py-3.5 border-b border-slate-100 bg-slate-50/60 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-slate-400" />
                <h3 className="text-sm font-bold text-slate-800">Activity</h3>
              </div>
              <ContextMenu
                align="right"
                trigger={<button className="text-slate-300 hover:text-slate-500 transition-colors p-0.5 rounded hover:bg-slate-100"><MoreVertical className="w-3.5 h-3.5" /></button>}
                sections={[
                  {
                    id: 's1',
                    items: [
                      { id: 'mark', label: 'Mark all as read', icon: Check },
                      { id: 'filter', label: 'Filter activity', icon: Filter, hasSubmenu: true },
                    ]
                  },
                  {
                    id: 's2',
                    items: [
                      { id: 'clear', label: 'Clear activity log', icon: Trash, danger: true },
                    ]
                  }
                ]}
              />
            </div>
            <div className="divide-y divide-slate-50">
              {activityLog.map((entry) => (
                <div key={entry.id} className="px-5 py-3 flex items-start gap-3 hover:bg-slate-50/50 transition-colors">
                  <div className={cn(
                    "w-1.5 h-1.5 rounded-full mt-1.5 shrink-0",
                    entry.type === 'success' && "bg-emerald-500",
                    entry.type === 'info' && "bg-[var(--color-roche-blue)]",
                    entry.type === 'warning' && "bg-amber-400"
                  )} />
                  <div className="min-w-0">
                    <p className="text-sm text-slate-700 leading-snug">{entry.action}</p>
                    <p className="text-[10px] font-medium text-slate-400 mt-0.5">{entry.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-white border border-slate-200 rounded-xl shadow-sm p-5">
            <h3 className="text-[10px] font-bold tracking-widest text-slate-400 uppercase mb-3">Quick Actions</h3>
            <div className="grid grid-cols-2 gap-2">
              <button className="flex items-center gap-2 px-3 py-2.5 text-sm font-medium text-slate-700 bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors border border-slate-100 hover:border-slate-200">
                <Plus className="w-4 h-4 text-[var(--color-roche-blue)]" /> New target
              </button>
              <button className="flex items-center gap-2 px-3 py-2.5 text-sm font-medium text-slate-700 bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors border border-slate-100 hover:border-slate-200">
                <Database className="w-4 h-4 text-[var(--color-roche-blue)]" /> Add library
              </button>
              <button className="flex items-center gap-2 px-3 py-2.5 text-sm font-medium text-slate-700 bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors border border-slate-100 hover:border-slate-200">
                <Share2 className="w-4 h-4 text-[var(--color-roche-blue)]" /> Export data
              </button>
              <button className="flex items-center gap-2 px-3 py-2.5 text-sm font-medium text-slate-700 bg-slate-50 hover:bg-slate-100 rounded-lg transition-colors border border-slate-100 hover:border-slate-200">
                <Settings2 className="w-4 h-4 text-[var(--color-roche-blue)]" /> Settings
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
  );
}

// ============================================================
// ROOT APP
// ============================================================

export default function App() {
  const [activeNav, setActiveNav] = useState('Analytics');
  const [selectedCompound, setSelectedCompound] = useState<CompoundData | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isCopilotOpen, setIsCopilotOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  
  const [authState, setAuthState] = useState<'APP' | 'LOCKED_PASSWORD' | 'LOCKED_MFA'>('APP');

  // Global Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        setIsCopilotOpen(prev => {
          if (!prev) setIsNotificationsOpen(false); // Close other panel
          return !prev;
        });
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);
  
  // Global Toast State
  const [toastMessage, setToastMessage] = useState<{title: string; message: string; type: 'success'|'error'|'info'} | null>(null);

  const showToast = (title: string, message: string, type: 'success'|'error'|'info' = 'success') => {
    setToastMessage({ title, message, type });
    setTimeout(() => setToastMessage(null), 3000);
  };

  const handleAuthenticationSuccess = () => {
    setAuthState('APP');
    setActiveNav('Home');
    showToast('Authentication Successful', 'Secure session restored.', 'success');
  };

  if (authState !== 'APP') {
    return <AuthView initialState={authState} onComplete={handleAuthenticationSuccess} />;
  }

  return (
    <div className="flex h-screen bg-[#F3F4F6] text-slate-800 font-sans tracking-tight overflow-hidden">
      <GlobalSearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
      
      {/* Global Toast */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-5 py-3 rounded-xl shadow-2xl flex items-center gap-3 animate-slideUp">
          <div className={cn("w-6 h-6 rounded-full flex items-center justify-center shrink-0", 
            toastMessage.type === 'success' ? "bg-emerald-500" : 
            toastMessage.type === 'error' ? "bg-rose-500" : "bg-blue-500"
          )}>
            {toastMessage.type === 'success' && <CheckCircle2 className="w-4 h-4 text-white" />}
            {toastMessage.type === 'error' && <AlertCircle className="w-4 h-4 text-white" />}
            {toastMessage.type === 'info' && <Info className="w-4 h-4 text-white" />}
          </div>
          <div>
            <p className="text-sm font-bold tracking-tight">{toastMessage.title}</p>
            <p className="text-xs text-slate-400">{toastMessage.message}</p>
          </div>
        </div>
      )}
      
      {/* THIN LEFT APP BAR */}
      <aside className="w-14 bg-white border-r border-slate-200 flex flex-col items-center py-4 z-30 shrink-0">
        <div className="flex items-center justify-center mb-6 mt-1 shrink-0 cursor-pointer group">
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="group-hover:rotate-180 transition-transform duration-700 ease-in-out drop-shadow-sm">
            <path d="M6 3C6 10 18 14 18 21" stroke="var(--color-roche-blue)" strokeWidth="3" strokeLinecap="round" />
            <path d="M18 3C18 10 6 14 6 21" stroke="#06B6D4" strokeWidth="3" strokeLinecap="round" />
            <circle cx="12" cy="12" r="5" fill="white" />
            <circle cx="12" cy="12" r="2.5" fill="var(--color-roche-blue)" />
            <circle cx="6" cy="3" r="1.5" fill="var(--color-roche-blue)" />
            <circle cx="18" cy="21" r="1.5" fill="var(--color-roche-blue)" />
            <circle cx="18" cy="3" r="1.5" fill="#06B6D4" />
            <circle cx="6" cy="21" r="1.5" fill="#06B6D4" />
          </svg>
        </div>
        
        <nav className="flex flex-col gap-2 w-full px-2">
          {[
            { id: 'Home', icon: Home },
            { id: 'Analytics', icon: BarChart2 },
            { id: 'Experiments', icon: FlaskConical },
            { id: 'Data', icon: Database },
            { id: 'Learn', icon: BookOpen },
            { id: 'Activity', icon: ActivitySquare },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setActiveNav(item.id)}
              className={cn(
                "relative flex items-center justify-center w-full h-10 rounded-lg transition-all duration-200 group",
                activeNav === item.id
                  ? "bg-slate-100 text-[var(--color-roche-blue)] shadow-sm" 
                  : "text-slate-400 hover:text-slate-700 hover:bg-slate-50"
              )}
            >
              <item.icon className="w-[18px] h-[18px]" strokeWidth={2} />
              <span className="absolute left-14 bg-slate-800 text-white text-[11px] font-bold px-2.5 py-1.5 rounded-md opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200 z-50 shadow-lg whitespace-nowrap">
                {item.id}
              </span>
            </button>
          ))}
          <div className="w-10 h-[1px] bg-slate-200/50 mx-auto my-1"></div>
          
          <button 
            onClick={() => setActiveNav('Network')}
            className={cn(
              "relative flex items-center justify-center w-full h-10 rounded-lg transition-all duration-200 group",
              activeNav === 'Network' 
                ? "bg-slate-100 text-slate-900 shadow-sm" 
                : "text-slate-400 hover:text-slate-700 hover:bg-slate-50"
            )}
          >
            <Share2 className="w-[18px] h-[18px]" strokeWidth={2} />
            <span className="absolute left-14 bg-slate-800 text-white text-[11px] font-bold px-2.5 py-1.5 rounded-md opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200 z-50 shadow-lg whitespace-nowrap">
              Network
            </span>
          </button>
        </nav>
        
        <div className="mt-auto flex flex-col gap-2 w-full px-2">
          <button className="relative flex items-center justify-center w-full h-10 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all duration-200 group">
            <Users className="w-[18px] h-[18px]" />
            <span className="absolute left-14 bg-slate-800 text-white text-[11px] font-bold px-2.5 py-1.5 rounded-md opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200 z-50 shadow-lg whitespace-nowrap">
              Users
            </span>
          </button>
          <button 
            onClick={() => setActiveNav('Settings')}
            className={cn(
              "relative flex items-center justify-center w-full h-10 rounded-lg transition-all duration-200 group",
              activeNav === 'Settings'
                ? "bg-slate-100 text-slate-900 shadow-sm"
                : "text-slate-400 hover:text-slate-700 hover:bg-slate-50"
            )}
          >
            <Settings className="w-[18px] h-[18px]" />
            <span className="absolute left-14 bg-slate-800 text-white text-[11px] font-bold px-2.5 py-1.5 rounded-md opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity duration-200 z-50 shadow-lg whitespace-nowrap">
              Settings
            </span>
          </button>
        </div>
      </aside>

      <div className="flex flex-col flex-1 min-w-0">
        {/* TOP HEADER */}
        <header className="h-14 bg-white border-b border-slate-200 flex items-center justify-between px-6 shrink-0 z-20">
          <div className="flex items-center gap-3">
            <span className="text-[13px] font-bold text-slate-800 tracking-tight">Roche AI Workspace</span>
            <span className="text-slate-300">/</span>
            <span className="text-[13px] font-medium text-slate-500">
              {activeNav === 'Dashboards' ? 'Global Overview' :
               activeNav === 'Activity' ? 'Activity Monitor' :
               activeNav === 'Data' ? 'Data Logs' :
               activeNav === 'Network' ? 'Knowledge Graph' :
               activeNav === 'Settings' ? 'Settings' :
               activeNav}
            </span>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              <input 
                type="text" 
                readOnly
                onClick={() => setIsSearchOpen(true)}
                placeholder="Search compounds, models..." 
                className="w-64 bg-slate-50 border border-slate-200 text-slate-700 text-[13px] rounded-md pl-8 pr-3 py-1.5 focus:outline-none focus:ring-1 focus:ring-[var(--color-roche-blue)] focus:border-[var(--color-roche-blue)] transition-all placeholder:text-slate-400 cursor-pointer"
              />
            </div>
            
            <button 
              onClick={() => {
                setIsCopilotOpen(!isCopilotOpen);
                if (!isCopilotOpen) setIsNotificationsOpen(false);
              }}
              className={cn(
                "flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[13px] font-bold transition-all shadow-sm border",
                isCopilotOpen 
                  ? "bg-blue-50 text-[var(--color-roche-blue)] border-blue-200" 
                  : "bg-white text-slate-700 hover:bg-slate-50 border-slate-200"
              )}
            >
              <Sparkles className="w-4 h-4" />
              <span className="ml-0.5 px-1.5 py-0.5 rounded text-[10px] font-bold tracking-widest text-slate-400 bg-white border border-slate-200">⌘K</span>
            </button>

            <div className="w-px h-4 bg-slate-200 mx-1"></div>
            <button 
              onClick={() => {
                setIsNotificationsOpen(!isNotificationsOpen);
                if (!isNotificationsOpen) setIsCopilotOpen(false);
              }}
              className="w-8 h-8 rounded-md flex items-center justify-center text-slate-400 hover:text-slate-600 hover:bg-slate-50 transition-colors relative"
            >
              <Bell className="w-[18px] h-[18px]" />
              <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-rose-500 rounded-full border-2 border-white"></span>
            </button>
            <ContextMenu 
              align="right"
              trigger={
                <div className="w-8 h-8 rounded-md bg-gradient-to-tr from-[var(--color-roche-blue)] to-cyan-500 text-white flex items-center justify-center text-[11px] font-bold shadow-sm ml-1 cursor-pointer hover:shadow hover:scale-105 transition-all">
                  MK
                </div>
              }
              sections={[
                {
                  id: 'auth',
                  items: [
                    { id: 'profile', label: 'Dr. Mueller Profile' },
                    { id: 'lock', label: 'Lock Session', onClick: () => setAuthState('LOCKED_PASSWORD') },
                  ]
                }
              ]}
            />
          </div>
        </header>

        {/* MAIN CONTENT AREA */}
        <div className="flex flex-1 overflow-auto bg-white relative">
          {activeNav === 'Home' && <HomeView />}
          {activeNav === 'Dashboards' && <AnalyticsView onCompoundClick={setSelectedCompound} />}
          {activeNav === 'Analytics' && <AnalyticsView onCompoundClick={setSelectedCompound} />}
          {activeNav === 'Data' && <DataView showToast={showToast} />}
          {activeNav === 'Monitor' && <MonitorView />}
          {activeNav === 'Experiments' && <ExperimentsView />}
          {activeNav === 'Learn' && <LearnView />}
          {activeNav === 'Activity' && <MonitorView />}
          {activeNav === 'Settings' && <SettingsView />}
          {activeNav === 'Network' && <NetworkView />}
        </div>
      </div>
      
      {/* RIGHT SIDEBARS (Mutually Exclusive) */}
      {isCopilotOpen && (
        <CopilotPanel onClose={() => setIsCopilotOpen(false)} />
      )}
      {isNotificationsOpen && (
        <NotificationsPanel onClose={() => setIsNotificationsOpen(false)} />
      )}

      {/* Global CSS for fadeIn animation */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(6px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out both;
        }
      `}</style>

      {/* Compound Detail Modal */}
      {selectedCompound && (
        <CompoundDetailModal
          compound={selectedCompound}
          onClose={() => setSelectedCompound(null)}
        />
      )}
    </div>
  );
}
