import { useState } from 'react';
import {
  X,
  ChevronUp,
  ChevronDown,
  MoreVertical,
  FlaskConical,
  Activity,
  Calendar,
  Clock,
  Target,
  AlertTriangle,
  CheckCircle2,
  Bookmark,
  Share2,
  Copy,
  FileDown,
  Link,
  Send,
  Plus,
  Tag,
  Shield,
  TrendingUp,
  ArrowRight,
} from 'lucide-react';
import { ContextMenu } from './ContextMenu';
import { cn } from '../utils/cn';

// ── Types ─────────────────────────────────────────────────────

export interface CompoundData {
  id: string;
  name: string;
  group: string;
  conversions: number;
  avgTime: string;
}

interface CompoundDetailModalProps {
  compound: CompoundData;
  onClose: () => void;
}

// ── Static Data ───────────────────────────────────────────────

const PIPELINE_STAGES = [
  { label: 'In-Silico Screening', status: 'completed' as const, date: 'Nov 14', assignee: 'AI Pipeline' },
  { label: 'Toxicity Pre-filter', status: 'completed' as const, date: 'Nov 16', assignee: 'AI Pipeline' },
  { label: 'Docking Simulation', status: 'in-progress' as const, date: 'Nov 18', assignee: 'Dr. Weber' },
  { label: 'In-Vitro Validation', status: 'pending' as const, date: '—', assignee: 'Unassigned' },
  { label: 'Lead Optimization', status: 'pending' as const, date: '—', assignee: 'Unassigned' },
];

const ACTIVITY_LOG = [
  { id: 1, user: 'AI Pipeline', avatar: 'AI', action: 'completed toxicity pre-filter — passed with score', highlight: '0.92', time: '2h ago', type: 'success' as const },
  { id: 2, user: 'Dr. Weber', avatar: 'LW', action: 'started docking simulation for target protein', highlight: 'Kinase-Alpha-7', time: '4h ago', type: 'info' as const },
  { id: 3, user: 'System', avatar: 'SY', action: 'auto-assigned to', highlight: 'Test Group A', time: '1d ago', type: 'info' as const },
  { id: 4, user: 'Dr. Mueller', avatar: 'MK', action: 'added label', highlight: 'high-priority', time: '1d ago', type: 'info' as const },
  { id: 5, user: 'AI Pipeline', avatar: 'AI', action: 'flagged potential hepatotoxicity marker —', highlight: 'Low risk', time: '2d ago', type: 'warning' as const },
];

const PROPERTIES = {
  status: 'In Progress' as const,
  confidence: 87,
  targetProtein: 'Kinase-Alpha-7',
  library: 'Internal Rohe DB',
  toxicityRisk: 'Low',
  assignee: { name: 'Dr. Weber', initials: 'LW' },
  creator: { name: 'Dr. Mueller', initials: 'MK' },
  dueDate: 'Dec 15, 2025',
  priority: 'High',
  labels: ['high-priority', 'kinase-target'],
};

// ── Component ─────────────────────────────────────────────────

export function CompoundDetailModal({ compound, onClose }: CompoundDetailModalProps) {
  const [commentText, setCommentText] = useState('');
  const [isBookmarked, setIsBookmarked] = useState(false);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm animate-fadeIn"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      {/* Modal Shell */}
      <div
        className="relative bg-white rounded-3xl shadow-[0_8px_30px_rgb(0,0,0,0.08)] w-[960px] max-w-[92vw] max-h-[88vh] flex overflow-hidden border border-slate-200/50"
        style={{ animation: 'modalSlideUp 0.25s ease-out both' }}
      >
        {/* ───── LEFT: Main Content ───── */}
        <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">

          {/* Top bar */}
          <div className="flex items-center justify-between px-6 pt-5 pb-3 sticky top-0 bg-white/95 backdrop-blur-sm z-10 border-b border-slate-100">
            <div className="flex items-center gap-2 text-sm">
              <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-[var(--color-roche-blue)] to-cyan-500 flex items-center justify-center text-white text-[10px] font-bold">
                {PROPERTIES.creator.initials}
              </div>
              <span className="font-semibold text-slate-700">{PROPERTIES.creator.name}</span>
              <ChevronUp className="w-3.5 h-3.5 text-slate-400 cursor-pointer hover:text-slate-600" />
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 cursor-pointer hover:text-slate-600" />
            </div>
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setIsBookmarked(!isBookmarked)}
                className={cn(
                  "p-1.5 rounded-md transition-colors",
                  isBookmarked ? "text-amber-500 bg-amber-50" : "text-slate-400 hover:text-slate-600 hover:bg-slate-100"
                )}
              >
                <Bookmark className="w-4 h-4" fill={isBookmarked ? 'currentColor' : 'none'} />
              </button>
              <ContextMenu
                align="right"
                trigger={<button className="p-1.5 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors"><MoreVertical className="w-4 h-4" /></button>}
                sections={[
                  {
                    id: 's1',
                    items: [
                      { id: 'copy', label: 'Copy link', icon: Link },
                      { id: 'share', label: 'Share compound', icon: Share2 },
                      { id: 'dup', label: 'Duplicate entry', icon: Copy },
                      { id: 'export', label: 'Export as PDF', icon: FileDown },
                    ]
                  }
                ]}
              />
            </div>
          </div>

          {/* Title + Description */}
          <div className="px-6 pt-5 pb-4">
            <h1 className="text-[22px] font-extrabold tracking-tight text-slate-900 leading-tight mb-2">
              {compound.name}
            </h1>
            <p className="text-sm leading-relaxed text-slate-500">
              Candidate molecule under evaluation for binding affinity to {PROPERTIES.targetProtein}.
              Currently in docking simulation phase with {PROPERTIES.confidence}% AI confidence score.
              Flagged as <span className="font-semibold text-slate-700">{PROPERTIES.toxicityRisk.toLowerCase()} toxicity risk</span> during pre-screening.
            </p>
          </div>

          {/* Key Metrics Ribbon */}
          <div className="mx-6 mb-5 grid grid-cols-3 gap-3">
            <div className="bg-slate-50 border border-slate-100 rounded-lg p-3 flex items-center gap-3">
              <div className="p-1.5 bg-blue-100 rounded-md">
                <Target className="w-3.5 h-3.5 text-[var(--color-roche-blue)]" />
              </div>
              <div>
                <p className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">Binding Affinity</p>
                <p className="text-sm font-extrabold text-slate-900 tracking-tight">IC₅₀ 42 nM</p>
              </div>
            </div>
            <div className="bg-slate-50 border border-slate-100 rounded-lg p-3 flex items-center gap-3">
              <div className="p-1.5 bg-emerald-100 rounded-md">
                <TrendingUp className="w-3.5 h-3.5 text-emerald-600" />
              </div>
              <div>
                <p className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">Selectivity</p>
                <p className="text-sm font-extrabold text-slate-900 tracking-tight">12x over off-target</p>
              </div>
            </div>
            <div className="bg-slate-50 border border-slate-100 rounded-lg p-3 flex items-center gap-3">
              <div className="p-1.5 bg-amber-100 rounded-md">
                <Shield className="w-3.5 h-3.5 text-amber-600" />
              </div>
              <div>
                <p className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">ADMET Score</p>
                <p className="text-sm font-extrabold text-slate-900 tracking-tight">0.84 / 1.00</p>
              </div>
            </div>
          </div>

          {/* Pipeline Stages (subtask-like) */}
          <div className="px-6 mb-5">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-bold text-slate-800 flex items-center gap-2">
                <FlaskConical className="w-4 h-4 text-slate-400" /> Pipeline Stages
              </h2>
              <span className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">
                {PIPELINE_STAGES.filter(s => s.status === 'completed').length}/{PIPELINE_STAGES.length} completed
              </span>
            </div>

            {/* Progress bar */}
            <div className="h-1.5 bg-slate-100 rounded-full mb-4 overflow-hidden">
              <div
                className="h-full bg-[var(--color-roche-blue)] rounded-full transition-all"
                style={{ width: `${(PIPELINE_STAGES.filter(s => s.status === 'completed').length / PIPELINE_STAGES.length) * 100}%` }}
              />
            </div>

            <div className="space-y-1">
              {PIPELINE_STAGES.map((stage, i) => (
                <div
                  key={i}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors text-sm",
                    stage.status === 'in-progress' && "bg-blue-50/80 border border-blue-100",
                    stage.status !== 'in-progress' && "hover:bg-slate-50"
                  )}
                >
                  {stage.status === 'completed' && (
                    <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0" />
                  )}
                  {stage.status === 'in-progress' && (
                    <div className="w-4 h-4 rounded-full border-2 border-[var(--color-roche-blue)] border-t-transparent animate-spin shrink-0" />
                  )}
                  {stage.status === 'pending' && (
                    <div className="w-4 h-4 rounded-full border-2 border-slate-200 shrink-0" />
                  )}

                  <span className={cn(
                    "flex-1 font-medium",
                    stage.status === 'completed' && "text-slate-500",
                    stage.status === 'in-progress' && "text-[var(--color-roche-blue)] font-semibold",
                    stage.status === 'pending' && "text-slate-400"
                  )}>
                    {stage.label}
                  </span>

                  <span className="text-[10px] font-bold tracking-widest text-slate-400 uppercase w-16 text-right">{stage.date}</span>
                  <span className="text-xs text-slate-400 font-medium w-24 text-right truncate">{stage.assignee}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Comments */}
          <div className="px-6 mb-5">
            <h2 className="text-sm font-bold text-slate-800 mb-3">Comments</h2>
            <div className="flex items-start gap-3">
              <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-[var(--color-roche-blue)] to-cyan-500 flex items-center justify-center text-white text-[10px] font-bold shrink-0 mt-0.5">
                MK
              </div>
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  placeholder="Add a comment..."
                  className="w-full border border-slate-200 rounded-lg px-3.5 py-2.5 text-sm focus:outline-none focus:border-[var(--color-roche-blue)] focus:ring-1 focus:ring-[var(--color-roche-blue)] transition-all pr-10"
                />
                {commentText && (
                  <button className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-[var(--color-roche-blue)] hover:bg-blue-50 rounded transition-colors">
                    <Send className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Activity */}
          <div className="px-6 pb-6">
            <h2 className="text-sm font-bold text-slate-800 mb-3 flex items-center gap-2">
              <Activity className="w-4 h-4 text-slate-400" /> Activity
            </h2>
            <div className="space-y-0">
              {ACTIVITY_LOG.map((entry) => (
                <div key={entry.id} className="flex items-start gap-3 py-2.5 group">
                  <div className="flex items-center gap-2 shrink-0">
                    <div className={cn(
                      "w-6 h-6 rounded-full flex items-center justify-center text-[9px] font-bold shrink-0",
                      entry.avatar === 'AI' && "bg-violet-100 text-violet-700",
                      entry.avatar === 'SY' && "bg-slate-100 text-slate-500",
                      entry.avatar !== 'AI' && entry.avatar !== 'SY' && "bg-gradient-to-tr from-[var(--color-roche-blue)] to-cyan-500 text-white"
                    )}>
                      {entry.avatar}
                    </div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-slate-600 leading-snug">
                      <span className="font-semibold text-slate-800">{entry.user}</span>{' '}
                      {entry.action}{' '}
                      <span className={cn(
                        "font-semibold",
                        entry.type === 'success' && "text-emerald-600",
                        entry.type === 'warning' && "text-amber-600",
                        entry.type === 'info' && "text-[var(--color-roche-blue)]"
                      )}>
                        {entry.highlight}
                      </span>
                    </p>
                  </div>
                  <span className="text-[10px] text-slate-400 font-medium shrink-0 mt-0.5">{entry.time}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ───── RIGHT: Properties Sidebar ───── */}
        <div className="w-[280px] border-l border-slate-200 bg-slate-50/50 flex flex-col shrink-0 overflow-y-auto">

          {/* Header */}
          <div className="flex items-center justify-between px-5 pt-5 pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold tracking-widest text-slate-400 uppercase">ID</span>
              <span className="text-sm font-mono font-bold text-slate-800">{compound.id}</span>
            </div>
            <button
              onClick={onClose}
              className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Property Rows */}
          <div className="flex-1 px-5 py-4 space-y-4">

            {/* Status */}
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-500 font-medium">Status</span>
              <span className="inline-flex items-center gap-1.5 text-xs font-bold bg-blue-100 text-[var(--color-roche-blue)] px-2.5 py-1 rounded-full">
                <div className="w-1.5 h-1.5 rounded-full bg-[var(--color-roche-blue)] animate-pulse" />
                {PROPERTIES.status}
              </span>
            </div>

            {/* AI Confidence */}
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-500 font-medium">AI Confidence</span>
              <div className="flex items-center gap-2">
                <div className="w-16 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${PROPERTIES.confidence}%` }} />
                </div>
                <span className="text-sm font-bold text-slate-800 tabular-nums">{PROPERTIES.confidence}%</span>
              </div>
            </div>

            {/* Assignee */}
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-500 font-medium">Assignee</span>
              <div className="flex items-center gap-1.5 cursor-pointer hover:bg-slate-100 px-1.5 py-0.5 rounded transition-colors -mr-1.5">
                <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-[var(--color-roche-blue)] to-cyan-500 flex items-center justify-center text-white text-[8px] font-bold">
                  {PROPERTIES.assignee.initials}
                </div>
                <span className="text-sm font-semibold text-slate-800">{PROPERTIES.assignee.name}</span>
              </div>
            </div>

            {/* Target Protein */}
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-500 font-medium">Target Protein</span>
              <span className="text-sm font-semibold text-slate-800 flex items-center gap-1">
                <Target className="w-3 h-3 text-slate-400" />
                {PROPERTIES.targetProtein}
              </span>
            </div>

            {/* Due Date */}
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-500 font-medium">Due date</span>
              <span className="text-sm font-semibold text-slate-800 flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                {PROPERTIES.dueDate}
              </span>
            </div>

            <div className="h-px bg-slate-200 !my-3" />

            {/* Library */}
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-500 font-medium">Library</span>
              <span className="text-xs font-semibold text-slate-700 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">{PROPERTIES.library}</span>
            </div>

            {/* Creator */}
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-500 font-medium">Creator</span>
              <div className="flex items-center gap-1.5">
                <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-[var(--color-roche-blue)] to-cyan-500 flex items-center justify-center text-white text-[8px] font-bold">
                  {PROPERTIES.creator.initials}
                </div>
                <span className="text-sm font-semibold text-slate-800">{PROPERTIES.creator.name}</span>
              </div>
            </div>

            {/* Group */}
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-500 font-medium">Control Variable</span>
              <span className="text-sm font-semibold text-slate-800">{compound.group}</span>
            </div>

            {/* Priority */}
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-500 font-medium">Priority</span>
              <span className="inline-flex items-center gap-1 text-sm font-semibold text-red-600">
                <ArrowRight className="w-3.5 h-3.5 rotate-[-90deg]" />
                {PROPERTIES.priority}
              </span>
            </div>

            {/* Toxicity Risk */}
            <div className="flex items-center justify-between">
              <span className="text-sm text-slate-500 font-medium">Toxicity Risk</span>
              <span className={cn(
                "inline-flex items-center gap-1 text-xs font-bold px-2 py-0.5 rounded",
                PROPERTIES.toxicityRisk === 'Low' && "bg-emerald-50 text-emerald-700",
                PROPERTIES.toxicityRisk === 'Medium' && "bg-amber-50 text-amber-700",
                PROPERTIES.toxicityRisk === 'High' && "bg-red-50 text-red-700"
              )}>
                <AlertTriangle className="w-3 h-3" />
                {PROPERTIES.toxicityRisk}
              </span>
            </div>

            <div className="h-px bg-slate-200 !my-3" />

            {/* Labels */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-slate-500 font-medium">Labels</span>
                <button className="text-slate-400 hover:text-slate-600 transition-colors">
                  <Plus className="w-3.5 h-3.5" />
                </button>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {PROPERTIES.labels.map((label) => (
                  <span
                    key={label}
                    className="inline-flex items-center gap-1 text-[10px] font-bold tracking-wider uppercase text-slate-600 bg-slate-100 border border-slate-200 px-2 py-1 rounded-md hover:bg-slate-200 transition-colors cursor-pointer"
                  >
                    <Tag className="w-2.5 h-2.5" />
                    {label}
                  </span>
                ))}
              </div>
            </div>

            {/* Conversions Data */}
            <div className="bg-white border border-slate-200 rounded-lg p-3 mt-1">
              <p className="text-[10px] font-bold tracking-widest text-slate-400 uppercase mb-1.5">Conversion Data</p>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <p className="text-lg font-extrabold tracking-tighter text-slate-900">{compound.conversions}</p>
                  <p className="text-[10px] text-slate-400 font-medium">Total conversions</p>
                </div>
                <div>
                  <p className="text-lg font-extrabold tracking-tighter text-slate-900">{compound.avgTime}</p>
                  <p className="text-[10px] text-slate-400 font-medium">Avg completion</p>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar Footer */}
          <div className="px-5 py-3 border-t border-slate-100 bg-white/80">
            <p className="text-[10px] text-slate-400 font-medium flex items-center gap-1">
              <Clock className="w-3 h-3" /> Last updated 2h ago
            </p>
          </div>
        </div>
      </div>

      {/* Modal Animation Keyframes */}
      <style>{`
        @keyframes modalSlideUp {
          from { opacity: 0; transform: translateY(12px) scale(0.98); }
          to { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </div>
  );
}
