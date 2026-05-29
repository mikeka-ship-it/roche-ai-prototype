import { useState } from 'react';
import { createPortal } from 'react-dom';
import { 
  Filter, Layers, Search, ChevronDown, Plus,
  Maximize2, Edit2, SlidersHorizontal, Activity, ArrowRight,
  Database, AlertCircle, PlaySquare, X, Box, Clock
} from 'lucide-react';
import { ContextMenu } from './ContextMenu';
import { 
  BarChart, Bar, LineChart, Line, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer 
} from 'recharts';

// Dummy data for charts
const BAR_DATA = [
  { day: 'Wed 10', total: 0, other: 0, llm: 0, tool: 0 },
  { day: 'Thu 11', total: 5, other: 1, llm: 4, tool: 0 },
  { day: 'Fri 12', total: 61, other: 34, llm: 27, tool: 0 },
  { day: 'Sat 13', total: 2, other: 1, llm: 1, tool: 0 }
];

const LATENCY_DATA = [
  { day: 'Wed 10', p95: 0, p50: 0 },
  { day: 'Thu 11', p95: 0, p50: 0 },
  { day: 'Fri 12', p95: 3.8, p50: 0.7 },
  { day: 'Sat 13', p95: 1.2, p50: 0.9 }
];

const COST_DATA = [
  { day: 'Wed 10', total: 0, prompt: 0, completion: 0 },
  { day: 'Thu 11', total: 0.12, prompt: 0.1, completion: 0.02 },
  { day: 'Fri 12', total: 0.85, prompt: 0.7, completion: 0.15 },
  { day: 'Sat 13', total: 0.05, prompt: 0.04, completion: 0.01 }
];

const TOKENS_DATA = [
  { day: 'Wed 10', total: 0, prompt: 0, completion: 0 },
  { day: 'Thu 11', total: 350, prompt: 300, completion: 50 },
  { day: 'Fri 12', total: 2827, prompt: 2701, completion: 126 },
  { day: 'Sat 13', total: 120, prompt: 100, completion: 20 }
];

// Reusable Chart Card
function ChartCard({ 
  title, icon: Icon, type, data, keys, colors, empty 
}: { 
  title: string, icon: any, type: 'bar' | 'line', data?: any[], keys?: string[], colors?: string[], empty?: boolean 
}) {
  return (
    <div className="bg-white border border-slate-100 rounded-2xl shadow-[0_2px_10px_rgb(0,0,0,0.02)] flex flex-col hover:border-slate-200 transition-colors group">
      {/* Card Header */}
      <div className="px-5 py-3.5 border-b border-slate-100 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Icon className="w-4 h-4 text-slate-500" />
          <h3 className="text-sm font-semibold text-slate-800">{title}</h3>
        </div>
        <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <button className="p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded transition-colors"><Maximize2 className="w-3.5 h-3.5" /></button>
          <button className="p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded transition-colors"><Edit2 className="w-3.5 h-3.5" /></button>
          <button className="p-1 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded transition-colors"><SlidersHorizontal className="w-3.5 h-3.5" /></button>
        </div>
      </div>
      
      {/* Chart Area */}
      <div className="flex-1 p-5 h-[220px] relative">
        {empty ? (
          <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400">
            <AlertCircle className="w-6 h-6 mb-2 opacity-50" />
            <span className="text-sm font-medium">No data</span>
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            {type === 'bar' ? (
              <BarChart data={data} margin={{ top: 0, right: 0, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} />
                <Tooltip cursor={{ fill: '#f1f5f9' }} contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontSize: '12px' }} />
                {keys?.map((k, i) => (
                  <Bar key={k} dataKey={k} stackId="a" fill={colors?.[i]} radius={i === keys.length - 1 ? [2, 2, 0, 0] : [0, 0, 0, 0]} barSize={8} />
                ))}
              </BarChart>
            ) : (
              <LineChart data={data} margin={{ top: 0, right: 0, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} dy={10} />
                <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 10, fill: '#94a3b8' }} />
                <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontSize: '12px' }} />
                {keys?.map((k, i) => (
                  <Line key={k} type="monotone" dataKey={k} stroke={colors?.[i]} strokeWidth={2} dot={false} activeDot={{ r: 4 }} />
                ))}
              </LineChart>
            )}
          </ResponsiveContainer>
        )}
      </div>

      {/* Footer / Legend */}
      {!empty && keys && colors && (
        <div className="px-5 pb-5 pt-2 grid grid-cols-2 gap-y-2">
          {keys.map((k, i) => (
            <div key={k} className="flex items-center justify-between pr-4">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-sm" style={{ backgroundColor: colors[i] }} />
                <span className="text-xs text-slate-600 font-medium capitalize">{k.replace(/_/g, ' ')}</span>
              </div>
              <span className="text-xs font-bold text-slate-800 tabular-nums">
                {data?.[data.length - 2]?.[k]}
              </span>
            </div>
          ))}
          <div className="col-span-2 mt-1">
            <span className="text-[10px] font-semibold text-slate-400 hover:text-[var(--color-roche-blue)] cursor-pointer">2 more</span>
          </div>
        </div>
      )}
    </div>
  );
}

// ============================================================
// CREATE CHART MODAL
// ============================================================
function CreateChartModal({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  if (!isOpen) return null;

  return createPortal(
    <div className="fixed inset-0 z-[100] flex items-center justify-center animate-fadeIn">
      <div className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-2xl shadow-2xl w-[900px] h-[600px] flex flex-col overflow-hidden animate-slideUp">
        
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-slate-200 flex items-center justify-between bg-slate-50/50">
          <h2 className="text-lg font-bold text-slate-900">Create chart</h2>
          <button onClick={onClose} className="p-1.5 text-slate-400 hover:bg-slate-200 hover:text-slate-700 rounded-md transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 flex overflow-hidden">
          {/* Left: Preview */}
          <div className="flex-1 p-8 border-r border-slate-200 bg-[#FAF9F7] flex flex-col">
            <div className="flex-1 bg-white rounded-xl border border-slate-200 shadow-sm p-6 relative">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={LATENCY_DATA} margin={{ top: 20, right: 20, left: -20, bottom: 20 }}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" />
                  <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8' }} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{ fontSize: 11, fill: '#94a3b8' }} />
                  <Tooltip />
                  <Line type="monotone" dataKey="p95" stroke="#3b82f6" strokeWidth={2} dot={false} />
                  <Line type="monotone" dataKey="p50" stroke="#f97316" strokeWidth={2} dot={false} />
                </LineChart>
              </ResponsiveContainer>
              <div className="absolute bottom-6 right-6 flex flex-col items-end gap-2 text-xs">
                <div className="flex items-center gap-2 font-bold text-slate-800"><div className="w-2 h-2 rounded-full bg-blue-500"/> Metrics B <span className="w-10 text-right">116.2</span></div>
                <div className="flex items-center gap-2 font-bold text-slate-800"><div className="w-2 h-2 rounded-full bg-orange-500"/> Metrics A <span className="w-10 text-right">18.7</span></div>
              </div>
            </div>
          </div>

          {/* Right: Settings */}
          <div className="w-[400px] bg-white overflow-y-auto p-6 flex flex-col gap-6">
            
            <div>
              <label className="flex items-center justify-between text-xs font-bold uppercase tracking-widest text-slate-500 mb-2">
                <span className="flex items-center gap-1.5"><Layers className="w-3.5 h-3.5" /> Presets</span>
                <span className="text-[var(--color-roche-blue)] flex items-center">Custom <ArrowRight className="w-3 h-3 ml-1" /></span>
              </label>
            </div>

            <div>
              <label className="text-xs font-bold text-slate-700 mb-2 block">Chart title</label>
              <input type="text" defaultValue="Simple chart" className="w-full border border-slate-200 rounded-md px-3 py-2 text-sm focus:outline-none focus:border-[var(--color-roche-blue)] focus:ring-1 focus:ring-[var(--color-roche-blue)]" />
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-bold text-slate-700 flex items-center gap-1.5"><Activity className="w-3.5 h-3.5" /> Measures</label>
                <span className="text-xs font-semibold text-slate-400 bg-slate-100 px-1.5 rounded">2 <ChevronDown className="w-3 h-3 inline" /></span>
              </div>
              
              <div className="flex flex-col gap-3">
                <div className="border border-slate-200 rounded-lg p-3 bg-slate-50/50">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-slate-800">Metrics A</span>
                    <button className="text-slate-400 hover:text-rose-500 transition-colors"><X className="w-3.5 h-3.5" /></button>
                  </div>
                  <div className="flex items-center gap-2">
                    <select className="border border-slate-200 rounded px-2 py-1.5 text-xs bg-white w-20">
                      <option>avg</option>
                    </select>
                    <select className="flex-1 border border-slate-200 rounded px-2 py-1.5 text-xs bg-white">
                      <option>metrics.completion_tokens</option>
                    </select>
                  </div>
                </div>

                <div className="border border-slate-200 rounded-lg p-3 bg-slate-50/50">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-slate-800">Metrics B</span>
                    <button className="text-slate-400 hover:text-rose-500 transition-colors"><X className="w-3.5 h-3.5" /></button>
                  </div>
                  <div className="flex items-center gap-2">
                    <select className="border border-slate-200 rounded px-2 py-1.5 text-xs bg-white w-20">
                      <option>avg</option>
                    </select>
                    <select className="flex-1 border border-slate-200 rounded px-2 py-1.5 text-xs bg-white">
                      <option>metrics.prompt_tokens</option>
                    </select>
                  </div>
                </div>

                <button className="text-xs font-bold text-slate-500 hover:text-[var(--color-roche-blue)] flex items-center justify-center gap-1 py-2 border border-dashed border-slate-300 rounded-lg transition-colors">
                  <Plus className="w-3.5 h-3.5" /> Measure
                </button>
              </div>
            </div>

            <hr className="border-slate-100" />

            <div>
               <label className="flex items-center justify-between text-xs font-bold text-slate-700 mb-2">
                <span className="flex items-center gap-1.5"><Filter className="w-3.5 h-3.5" /> Filters</span>
                <span className="text-slate-400 font-normal">None <ChevronDown className="w-3 h-3 inline" /></span>
              </label>
            </div>

            <hr className="border-slate-100" />

            <div>
               <label className="flex items-center justify-between text-xs font-bold text-slate-700 mb-2">
                <span className="flex items-center gap-1.5"><Layers className="w-3.5 h-3.5" /> Group by</span>
                <span className="text-slate-400 font-normal">None <ChevronDown className="w-3 h-3 inline" /></span>
              </label>
            </div>

            <hr className="border-slate-100" />

            <div>
               <label className="flex items-center justify-between text-xs font-bold text-slate-700 mb-3">
                <span className="flex items-center gap-1.5"><SlidersHorizontal className="w-3.5 h-3.5" /> Viz options</span>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </label>
              
              <div className="flex flex-col gap-4">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2 block">Visualization</span>
                  <div className="flex bg-slate-100 p-1 rounded-lg">
                    <button className="flex-1 bg-white shadow-sm rounded-md py-1.5 text-xs font-bold text-slate-800 flex items-center justify-center gap-1.5"><Activity className="w-3.5 h-3.5 text-[var(--color-roche-blue)]" /> Lines</button>
                    <button className="flex-1 rounded-md py-1.5 text-xs font-semibold text-slate-500 flex items-center justify-center gap-1.5"><Database className="w-3.5 h-3.5" /> Bars</button>
                  </div>
                </div>
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-slate-500 mb-2 block">Unit</span>
                  <div className="flex gap-2">
                    <button className="border border-slate-200 bg-white rounded-md px-3 py-1 text-xs font-semibold text-slate-600">Duration</button>
                    <button className="border border-slate-200 bg-white rounded-md px-3 py-1 text-xs font-semibold text-slate-600">Percent</button>
                    <button className="border border-slate-200 bg-white rounded-md px-3 py-1 text-xs font-semibold text-slate-600">Count</button>
                    <button className="border border-slate-200 bg-white rounded-md px-3 py-1 text-xs font-semibold text-slate-600">Cost</button>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Modal Footer */}
        <div className="px-6 py-4 border-t border-slate-200 flex justify-end bg-slate-50/50">
          <button onClick={onClose} className="border border-slate-200 bg-white px-4 py-2 rounded-lg text-sm font-bold text-slate-700 hover:bg-slate-50 transition-colors shadow-sm">
            Save as new
          </button>
        </div>

      </div>
    </div>,
    document.body
  );
}

// ============================================================
// MAIN VIEW
// ============================================================
export function MonitorView() {
  const [isChartModalOpen, setIsChartModalOpen] = useState(false);

  return (
    <div className="flex-1 flex flex-col bg-[#FAF9F7] overflow-hidden animate-fadeIn">
      {/* STANDARD GLOBAL HEADER */}
      <div className="h-16 px-8 border-b border-slate-200 bg-white flex items-center justify-between shrink-0 z-10">
        <h1 className="text-xl font-bold text-slate-900 tracking-tight">Monitor</h1>
        <div className="flex items-center gap-3 shrink-0">
          <span className="bg-blue-50 text-[var(--color-roche-blue)] px-2.5 py-1 rounded-md text-[10px] font-bold tracking-widest uppercase flex items-center gap-1.5 border border-blue-100">
            <span className="w-1.5 h-1.5 rounded-full bg-[var(--color-roche-blue)] animate-pulse" /> LIVE
          </span>
          <button className="text-slate-600 hover:bg-slate-100 px-3 py-1.5 rounded-md text-sm font-medium transition-colors border border-slate-200 bg-white shadow-sm flex items-center gap-1.5">
            Past 3 days <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
          </button>
          <button 
            onClick={() => setIsChartModalOpen(true)}
            className="bg-[var(--color-roche-blue)] text-white px-4 py-2 rounded-full text-[13px] font-bold shadow-sm hover:bg-[var(--color-roche-blue-hover)] transition-colors flex items-center gap-1.5"
          >
            <Plus className="w-4 h-4" /> Chart
          </button>
        </div>
      </div>

      {/* TOOLBAR */}
      <div className="h-14 px-4 border-b border-slate-200 bg-white flex items-center shrink-0">
        <div className="flex items-center gap-1">
          <ContextMenu
            align="left"
            trigger={
              <button className="text-slate-700 hover:bg-slate-100 px-3 py-1.5 rounded-md text-sm font-semibold flex items-center gap-1.5 transition-colors mr-2">
                Logs <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>
            }
            sections={[
              { id: '1', items: [{ id: 'logs', label: 'Logs' }, { id: 'metrics', label: 'Metrics' }] }
            ]}
          />
          <ContextMenu
            align="left"
            trigger={
              <button className="bg-white border border-slate-200 text-slate-700 px-3 py-1.5 rounded-md text-sm font-medium flex items-center gap-1.5 hover:bg-slate-50 transition-colors shadow-sm mr-2">
                <Layers className="w-3.5 h-3.5 text-slate-400" /> All data <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
              </button>
            }
            sections={[
              { id: '1', items: [{ id: 'all', label: 'All data' }] }
            ]}
          />
          
          <button className="text-slate-600 hover:bg-slate-100 px-3 py-1.5 rounded-md text-sm font-medium flex items-center gap-1.5 transition-colors">
            <Filter className="w-3.5 h-3.5" /> Filter
          </button>
          <button className="text-slate-600 hover:bg-slate-100 px-3 py-1.5 rounded-md text-sm font-medium flex items-center gap-1.5 transition-colors">
            <Layers className="w-3.5 h-3.5" /> Group
          </button>
          
          <div className="relative ml-2">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search logs" 
              className="pl-9 pr-4 py-1.5 border border-slate-200 rounded-md text-sm focus:outline-none focus:border-[var(--color-roche-blue)] focus:ring-1 focus:ring-[var(--color-roche-blue)] w-64 shadow-sm"
            />
          </div>
        </div>
      </div>

      {/* CHARTS GRID */}
      <div className="flex-1 overflow-y-auto p-6 bg-[#FAF9F7]">
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6 max-w-[1600px] mx-auto">
          
          <ChartCard 
            title="Spans" 
            icon={PlaySquare} 
            type="bar" 
            data={BAR_DATA} 
            keys={['other', 'llm', 'tool']} 
            colors={['#3b82f6', '#93c5fd', '#f97316']} 
          />
          <ChartCard 
            title="Latency" 
            icon={Activity} 
            type="line" 
            data={LATENCY_DATA} 
            keys={['p95', 'p50']} 
            colors={['#3b82f6', '#f97316']} 
          />
          <ChartCard 
            title="Total LLM cost" 
            icon={Database} 
            type="bar" 
            data={COST_DATA} 
            keys={['prompt', 'completion']} 
            colors={['#3b82f6', '#93c5fd']} 
          />
          <ChartCard 
            title="Token count" 
            icon={Box} 
            type="bar" 
            data={TOKENS_DATA} 
            keys={['prompt', 'completion']} 
            colors={['#3b82f6', '#93c5fd']} 
          />
          <ChartCard 
            title="Time to first token" 
            icon={Clock} 
            type="line" 
            data={LATENCY_DATA} 
            keys={['p95', 'p50']} 
            colors={['#3b82f6', '#f97316']} 
          />
          <ChartCard 
            title="Scores" 
            icon={AlertCircle} 
            type="line" 
            empty={true} 
          />
          <ChartCard 
            title="Tool executions" 
            icon={SlidersHorizontal} 
            type="bar" 
            empty={true} 
          />
          <ChartCard 
            title="Tool error rate" 
            icon={AlertCircle} 
            type="line" 
            empty={true} 
          />
          <ChartCard 
            title="Tool duration (p50)" 
            icon={Clock} 
            type="line" 
            empty={true} 
          />

        </div>
        <div className="h-10" />
      </div>

      <CreateChartModal isOpen={isChartModalOpen} onClose={() => setIsChartModalOpen(false)} />

      {/* SlideUp Animation for Modal */}
      <style>{`
        @keyframes slideUp {
          from { opacity: 0; transform: scale(0.95) translateY(20px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        .animate-slideUp {
          animation: slideUp 0.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>
    </div>
  );
}
