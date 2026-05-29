import { useState } from 'react';
import { 
  Filter, Columns, Layers, Search, ChevronDown, Clock, AlertCircle, 
  Box, Zap, CalendarDays, MoreVertical
} from 'lucide-react';
import { ContextMenu } from './ContextMenu';
import { CreateReportModal } from './CreateReportModal';

const LOG_DATA = [
  { id: 1, name: 'Docking sim #42', input: '{"smiles": "CC1=CC=C(C=C1)..."}', output: '{"score": -8.4, "rmsd": 1.2}', expected: '-', tags: ['success'], duration: '14.2s', compute: '12.0s', time: '10:27:14 AM' },
  { id: 2, name: 'Toxicity check', input: '{"target": "hERG", "mol": "..."}', output: '{"risk": "High"}', expected: '{"risk": "Low"}', tags: ['warning'], duration: '2.1s', compute: '1.8s', time: '10:27:52 AM' },
  { id: 3, name: 'PDB Download', input: '{"id": "6M0J"}', output: '{"status": 200, "bytes": 45012}', expected: '-', tags: ['success'], duration: '0.8s', compute: '-', time: '10:28:10 AM' },
  { id: 4, name: 'LLM Analysis', input: '{"prompt": "Summarize binding..."}', output: '{"error": "timeout"}', expected: '-', tags: ['error'], duration: '30.0s', compute: '30.0s', time: '10:31:05 AM' },
  { id: 5, name: 'Docking sim #43', input: '{"smiles": "O=C(O)C1=CC=CC=C1"}', output: '{"score": -6.1, "rmsd": 0.8}', expected: '-', tags: ['success'], duration: '11.5s', compute: '9.2s', time: '10:35:22 AM' },
  { id: 6, name: 'Docking sim #44', input: '{"smiles": "NC1=CC=NC=C1"}', output: '{"score": -7.2, "rmsd": 1.5}', expected: '-', tags: ['success'], duration: '13.0s', compute: '11.1s', time: '10:38:40 AM' },
  { id: 7, name: 'LLM Generation', input: '{"prompt": "Propose analogs..."}', output: '{"error": "rate_limit"}', expected: '-', tags: ['error'], duration: '0.4s', compute: '0.4s', time: '10:42:15 AM' },
  { id: 8, name: 'Toxicity check', input: '{"target": "Ames", "mol": "..."}', output: '{"risk": "Low"}', expected: '{"risk": "Low"}', tags: ['success'], duration: '1.9s', compute: '1.6s', time: '10:45:00 AM' },
  { id: 9, name: 'Toxicity check', input: '{"target": "CYP450", "mol": "..."}', output: '{"error": "invalid_mol"}', expected: '-', tags: ['error'], duration: '0.2s', compute: '0.1s', time: '10:46:12 AM' },
  { id: 10, name: 'Docking sim #45', input: '{"smiles": "CC(=O)OC1=CC=CC=C1C(=O)O"}', output: '{"score": -9.0, "rmsd": 0.5}', expected: '-', tags: ['success'], duration: '15.4s', compute: '14.2s', time: '10:50:33 AM' },
];

export function DataView({ showToast }: { showToast?: (title: string, msg: string, type: 'success'|'error') => void }) {
  const [tableData, setTableData] = useState(LOG_DATA);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRows, setSelectedRows] = useState<number[]>([]);
  const [isReportModalOpen, setIsReportModalOpen] = useState(false);

  const toggleRow = (id: number) => {
    setSelectedRows(prev => prev.includes(id) ? prev.filter(r => r !== id) : [...prev, id]);
  };

  const toggleAll = () => {
    if (selectedRows.length === filteredData.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(filteredData.map(r => r.id));
    }
  };

  const handleBulkDelete = () => {
    const deletedCount = selectedRows.length;
    setTableData(prev => prev.filter(row => !selectedRows.includes(row.id)));
    setSelectedRows([]);
    if (showToast) {
      showToast('Records Deleted', `Successfully deleted ${deletedCount} trace(s).`, 'success');
    }
  };

  const filteredData = tableData.filter(row => 
    row.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
    row.input.toLowerCase().includes(searchQuery.toLowerCase()) ||
    row.output.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="flex-1 flex flex-col bg-white overflow-hidden animate-fadeIn">
      <CreateReportModal isOpen={isReportModalOpen} onClose={() => setIsReportModalOpen(false)} />
      
      {/* STANDARD GLOBAL HEADER */}
      <div className="h-16 px-8 border-b border-slate-200 bg-white flex items-center justify-between shrink-0 z-10">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Logs</h1>
          <span className="bg-slate-100 text-slate-500 px-2 py-0.5 rounded text-[10px] font-bold tracking-widest uppercase">33 traces</span>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <button 
            onClick={() => setIsReportModalOpen(true)}
            className="bg-[var(--color-roche-blue)] hover:bg-blue-700 text-white text-[13px] font-semibold flex items-center gap-1.5 px-5 py-2 rounded-full transition-colors shadow-sm"
          >
            Create New Report
          </button>
          <ContextMenu 
            align="right"
            trigger={
              <button className="text-slate-400 hover:text-slate-600 transition-colors p-1.5 hover:bg-slate-100 rounded-md">
                <MoreVertical className="w-5 h-5" />
              </button>
            }
            sections={[
              { id: '1', items: [{ id: 'rules', label: 'Scoring rules', icon: Zap }, { id: 'loop', label: 'Loop Config' }] }
            ]}
          />
        </div>
      </div>

      {/* TOOLBAR */}
      <div className="h-14 px-4 border-b border-slate-200 bg-white flex items-center justify-between shrink-0">
        <div className="flex items-center gap-1">
          <ContextMenu
            align="left"
            trigger={
              <button className="bg-blue-50 text-[var(--color-roche-blue)] border border-blue-200 px-3 py-1.5 rounded-md text-sm font-semibold flex items-center gap-1.5 hover:bg-blue-100 transition-colors mr-2">
                <Box className="w-4 h-4" /> All rows <ChevronDown className="w-3.5 h-3.5" />
              </button>
            }
            sections={[
              { id: '1', items: [{ id: 'all', label: 'All rows' }, { id: 'errors', label: 'Errors only' }] }
            ]}
          />
          <button className="text-slate-600 hover:bg-slate-100 px-3 py-1.5 rounded-md text-sm font-medium flex items-center gap-1.5 transition-colors">
            Height
          </button>
          <button className="text-slate-600 hover:bg-slate-100 px-3 py-1.5 rounded-md text-sm font-medium flex items-center gap-1.5 transition-colors">
            <Filter className="w-3.5 h-3.5" /> Filter
          </button>
          <button className="text-slate-600 hover:bg-slate-100 px-3 py-1.5 rounded-md text-sm font-medium flex items-center gap-1.5 transition-colors">
            <Columns className="w-3.5 h-3.5" /> Columns
          </button>
          <button className="text-slate-600 hover:bg-slate-100 px-3 py-1.5 rounded-md text-sm font-medium flex items-center gap-1.5 transition-colors">
            <Layers className="w-3.5 h-3.5" /> Group
          </button>
          
          <div className="relative ml-2">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input 
              type="text" 
              placeholder="Search traces..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9 pr-4 py-1.5 border border-slate-200 rounded-md text-sm focus:outline-none focus:border-[var(--color-roche-blue)] focus:ring-1 focus:ring-[var(--color-roche-blue)] w-64 shadow-sm transition-all"
            />
          </div>
        </div>

        <ContextMenu
          align="right"
          trigger={
            <button className="bg-white border border-slate-200 text-slate-700 px-3 py-1.5 rounded-md text-sm font-medium hover:bg-slate-50 shadow-sm flex items-center gap-1.5 transition-colors">
              <CalendarDays className="w-4 h-4 text-slate-400" /> 
              Sep 11 10:27 AM - Sep 12 3:22 AM 
              <ChevronDown className="w-4 h-4 text-slate-400 ml-1" />
            </button>
          }
          sections={[
            {
              id: 'presets',
              items: [
                { id: '1h', label: 'Past 1 hour', icon: Clock },
                { id: '6h', label: 'Past 6 hours' },
                { id: '1d', label: 'Past 1 day' },
                { id: '7d', label: 'Past 7 days' },
              ]
            }
          ]}
        />
      </div>

      {/* DATA TABLE */}
      <div className="flex-1 overflow-auto bg-white relative">
        {/* BULK ACTION BAR */}
        {selectedRows.length > 0 && (
          <div className="absolute bottom-10 left-1/2 -translate-x-1/2 bg-slate-900 text-white px-5 py-3 rounded-full shadow-2xl flex items-center gap-4 z-50 animate-slideUp">
            <div className="flex items-center gap-2">
              <div className="w-5 h-5 rounded bg-blue-500/20 text-blue-400 flex items-center justify-center text-xs font-bold">
                {selectedRows.length}
              </div>
              <span className="text-sm font-medium">selected</span>
            </div>
            <div className="w-px h-4 bg-slate-700 mx-2"></div>
            <button className="text-sm font-semibold hover:text-blue-400 transition-colors">Export</button>
            <button className="text-sm font-semibold hover:text-blue-400 transition-colors">Assign Label</button>
            <button 
              onClick={handleBulkDelete}
              className="text-sm font-semibold text-rose-400 hover:text-rose-300 transition-colors ml-2"
            >
              Delete
            </button>
          </div>
        )}

        <table className="w-full text-left text-sm whitespace-nowrap min-w-max border-collapse relative">
          <thead className="bg-white border-b border-slate-200 sticky top-0 z-10 shadow-sm">
            <tr>
              <th className="w-12 px-4 py-3">
                <input 
                  type="checkbox" 
                  checked={selectedRows.length > 0 && selectedRows.length === filteredData.length}
                  onChange={toggleAll}
                  className="rounded border-slate-300 text-[var(--color-roche-blue)] focus:ring-[var(--color-roche-blue)] cursor-pointer" 
                />
              </th>
              <th className="px-4 py-3 text-slate-500 font-semibold text-[11px] tracking-widest uppercase">Name</th>
              <th className="px-4 py-3 text-slate-500 font-semibold text-[11px] tracking-widest uppercase">Input</th>
              <th className="px-4 py-3 text-slate-500 font-semibold text-[11px] tracking-widest uppercase">Output</th>
              <th className="px-4 py-3 text-slate-500 font-semibold text-[11px] tracking-widest uppercase">Expected</th>
              <th className="px-4 py-3 text-slate-500 font-semibold text-[11px] tracking-widest uppercase">Tags</th>
              <th className="px-4 py-3 text-slate-500 font-semibold text-[11px] tracking-widest uppercase text-right">Duration</th>
              <th className="px-4 py-3 text-slate-500 font-semibold text-[11px] tracking-widest uppercase text-right">Compute</th>
              <th className="px-4 py-3 text-slate-500 font-semibold text-[11px] tracking-widest uppercase text-right">Time</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-slate-700">
            {filteredData.length === 0 ? (
              <tr>
                <td colSpan={9} className="py-24 text-center">
                  <div className="flex flex-col items-center justify-center">
                    <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                      <Search className="w-8 h-8 text-slate-300" />
                    </div>
                    <h3 className="text-base font-semibold text-slate-800 mb-1">No traces found</h3>
                    <p className="text-sm text-slate-500 mb-4">We couldn't find any data matching your current filters.</p>
                    <button 
                      onClick={() => setSearchQuery('')}
                      className="px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium hover:bg-slate-50 transition-colors shadow-sm"
                    >
                      Clear filters
                    </button>
                  </div>
                </td>
              </tr>
            ) : (
              filteredData.map((row, idx) => {
                const isError = row.tags.includes('error');
                
                return (
                  <tr key={row.id} className="hover:bg-slate-50/80 transition-colors group">
                    <td className="w-12 px-5 py-4">
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-slate-400 w-4 text-right tabular-nums">{idx + 1}</span>
                        <input 
                          type="checkbox" 
                          checked={selectedRows.includes(row.id)}
                          onChange={() => toggleRow(row.id)}
                          className="rounded border-slate-300 text-[var(--color-roche-blue)] focus:ring-[var(--color-roche-blue)] cursor-pointer" 
                        />
                      </div>
                    </td>
                    <td className="px-5 py-4 font-medium text-[13px]">
                      <span className="cursor-pointer hover:text-[var(--color-roche-blue)]">{row.name}</span>
                    </td>
                    <td className="px-5 py-4 font-mono text-[12px] text-slate-500">
                      <div className="truncate w-48">{row.input}</div>
                    </td>
                    <td className="px-5 py-4 font-mono text-[12px] text-slate-500">
                      <div className="truncate w-48">{row.output}</div>
                    </td>
                    <td className="px-5 py-4 font-mono text-[12px] text-slate-400">
                      {row.expected}
                    </td>
                    <td className="px-5 py-4">
                      {isError ? (
                        <div className="flex items-center gap-1.5 text-rose-600 bg-rose-50 px-2 py-1 rounded border border-rose-100 font-mono text-xs w-fit">
                          <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                          Error
                        </div>
                      ) : (
                        <span className="text-slate-300">—</span>
                      )}
                    </td>
                    <td className="px-5 py-4 text-right text-[13px] text-slate-600 tabular-nums">{row.duration}</td>
                    <td className="px-5 py-4 text-right text-[13px] text-slate-500 tabular-nums">{row.compute}</td>
                    <td className="px-5 py-4 text-right text-[13px] text-slate-400 tabular-nums">{row.time}</td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
        
        <div className="p-4 border-t border-slate-200 text-center text-sm text-slate-500">
          Data retention is limited to 14 days for organizations on the Free plan.
        </div>
      </div>
    </div>
  );
}
