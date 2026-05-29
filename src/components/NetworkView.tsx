import { useState, useMemo, useEffect, useRef, useCallback } from 'react';
import ForceGraph2D from 'react-force-graph-2d';
import ForceGraph3D from 'react-force-graph-3d';
import { 
  Download, Tag, Link2, ChevronDown, Network, 
  FlaskConical, Database, Maximize2, X, Activity, Share2, Info, Grid3X3
} from 'lucide-react';
import { cn } from '../utils/cn';

type ViewMode = '3d' | '2d' | 'matrix';

export function NetworkView() {
  const [viewMode, setViewMode] = useState<ViewMode>('3d');
  const [dimensions, setDimensions] = useState({ width: 800, height: 600 });
  const [selectedNode, setSelectedNode] = useState<any>(null);
  
  const fg3Ref = useRef<any>(null);
  const fg2Ref = useRef<any>(null);

  // Dynamically update dimensions based on the container
  useEffect(() => {
    const container = document.getElementById('graph-container');
    if (!container) return;
    
    const updateDimensions = () => {
      setDimensions({
        width: container.clientWidth,
        height: container.clientHeight
      });
    };
    
    updateDimensions();
    window.addEventListener('resize', updateDimensions);
    return () => window.removeEventListener('resize', updateDimensions);
  }, []);

  // Generate a realistic interactome graph with pharma-grade naming
  const graphData = useMemo(() => {
    const nodes: any[] = [];
    const links: any[] = [];
    
    // Seeded pseudo-random for deterministic data
    let seed = 42;
    const seededRandom = () => { seed = (seed * 16807 + 0) % 2147483647; return seed / 2147483647; };
    
    const hubMeta: Record<string, { fullName: string; desc: string; pathway: string; pdb: string }> = {
      'GLP-1R': { fullName: 'Glucagon-Like Peptide-1 Receptor', desc: 'Class B GPCR crucial for glucose homeostasis and appetite regulation. Blockbuster target for obesity, Type 2 diabetes, and emerging cardiovascular/NASH indications (e.g. semaglutide, tirzepatide).', pathway: 'cAMP/PKA', pdb: '6X18' },
      'APP':    { fullName: 'Amyloid Beta Precursor Protein', desc: 'Precursor to amyloid-beta peptides. Cleavage by BACE1 and γ-secretase leads to Aβ plaque formation in Alzheimer’s Disease. Targeted by groundbreaking mAbs like lecanemab and donanemab.', pathway: 'Amyloidogenic', pdb: '3DXC' },
      'PD-1':   { fullName: 'Programmed Cell Death Protein 1', desc: 'Immune checkpoint receptor on T-cells. Blocking PD-1/PD-L1 interaction unleashes anti-tumor immunity. The absolute backbone of modern immuno-oncology (e.g. pembrolizumab, nivolumab).', pathway: 'T-Cell Receptor', pdb: '4ZQK' },
      'KRAS':   { fullName: 'Kirsten Rat Sarcoma Viral Oncogene', desc: 'Small GTPase historically considered "undruggable". Recent breakthroughs in G12C and pan-KRAS inhibitors have revolutionized targeted therapy in NSCLC and colorectal cancer.', pathway: 'RAS/MAPK', pdb: '6OIM' },
      'TREM2':  { fullName: 'Triggering Receptor Expressed on Myeloid Cells 2', desc: 'Key microglial immune receptor. Rare variants significantly increase Alzheimer’s risk. Next-generation neuroimmunology target aimed at clearing toxic protein aggregates.', pathway: 'SYK/PI3K', pdb: '5ELI' },
    };
    
    const hubs = Object.keys(hubMeta);
    hubs.forEach((id) => {
      const meta = hubMeta[id];
      nodes.push({ id, group: 'hub', val: 35, name: id, fullName: meta.fullName, description: meta.desc, pathway: meta.pathway, pdb: meta.pdb });
    });

    // Realistic compound names (Roche RO-xxxx convention)
    const compoundPrefixes = ['RO', 'RG', 'GDC', 'MPDL', 'BI'];
    const assayTypes = [
      { name: 'HTRF Binding', desc: 'Homogeneous time-resolved fluorescence assay measuring compound-target binding affinity.' },
      { name: 'SPR Kinetics', desc: 'Surface plasmon resonance assay for real-time binding kinetics (ka, kd, KD).' },
      { name: 'Cell Viability (CTG)', desc: 'CellTiter-Glo luminescent cell viability assay measuring ATP as a proxy for metabolically active cells.' },
      { name: 'Kinase Activity', desc: 'In-vitro kinase inhibition assay using ADP-Glo or LanthaScreen technology.' },
      { name: 'ADMET Panel', desc: 'Absorption, Distribution, Metabolism, Excretion, and Toxicity screening panel.' },
      { name: 'Caspase-3/7 Apoptosis', desc: 'Caspase-Glo assay measuring apoptotic response to compound treatment.' },
      { name: 'Reporter Gene (Luc)', desc: 'Luciferase reporter gene assay for pathway activation measurement.' },
      { name: 'Western Blot pERK', desc: 'Phospho-ERK1/2 Western blot assay for MAPK pathway inhibition confirmation.' },
    ];
    const diseases = [
      { name: 'Obesity (BMI ≥30)', desc: 'Global epidemic driving cardiometabolic disease. Currently revolutionized by incretin mimetics (GLP-1/GIP/Glucagon tri-agonists).' },
      { name: 'Alzheimer’s Disease', desc: 'Most common neurodegenerative disease. Early-stage intervention via amyloid clearance is the current paradigm.' },
      { name: 'Type 2 Diabetes', desc: 'Chronic metabolic disorder characterized by insulin resistance. Huge overlap with NASH/MASH and obesity pipelines.' },
      { name: 'MASH / NASH', desc: 'Metabolic dysfunction-associated steatohepatitis. Massive unmet need with emerging thyroid hormone and GLP-1 targeted therapies.' },
      { name: 'NSCLC', desc: 'Non-Small Cell Lung Cancer. Highly segmented by molecular drivers (KRAS, EGFR, ALK) and PD-L1 expression.' },
      { name: 'Melanoma', desc: 'Advanced cutaneous melanoma. Poster child for PD-1/CTLA-4 combination immunotherapy.' },
      { name: 'Colorectal Cancer (CRC)', desc: 'Third most common cancer. KRAS mutated in ~40% of cases, driving resistance to EGFR inhibitors.' },
      { name: 'Parkinson’s Disease', desc: 'Second most common neurodegenerative disorder. LRRK2 and alpha-synuclein are major emerging therapeutic nodes.' },
      { name: 'Triple-Negative Breast Cancer', desc: 'Aggressive subtype lacking HR/HER2 expression. Major focus for Antibody-Drug Conjugates (ADCs) like Trop-2.' },
    ];

    for (let i = 0; i < 350; i++) {
      const id = `Node_${i}`;
      const groupType = i % 5 === 0 ? 'assay' : i % 4 === 0 ? 'disease' : 'compound';
      
      let name: string, description: string, extra: Record<string, any> = {};
      
      if (groupType === 'compound') {
        const prefix = compoundPrefixes[i % compoundPrefixes.length];
        const num = 4000 + Math.floor(seededRandom() * 6000);
        name = `${prefix}-${num}`;
        const mw = (250 + seededRandom() * 350).toFixed(1);
        const logP = (0.5 + seededRandom() * 4.5).toFixed(2);
        const ic50 = (seededRandom() * 500 + 1).toFixed(0);
        description = `Small-molecule inhibitor. MW ${mw} Da, cLogP ${logP}. IC₅₀ = ${ic50} nM in enzymatic assay.`;
        extra = { mw, logP, ic50: `${ic50} nM`, phase: seededRandom() > 0.7 ? 'Phase II' : seededRandom() > 0.4 ? 'Phase I' : 'Preclinical', source: seededRandom() > 0.5 ? 'Internal' : 'ChEMBL' };
      } else if (groupType === 'assay') {
        const assay = assayTypes[i % assayTypes.length];
        name = assay.name;
        description = assay.desc;
        extra = { throughput: seededRandom() > 0.5 ? 'HTS' : 'Medium', readout: seededRandom() > 0.5 ? 'Fluorescence' : 'Luminescence' };
      } else {
        const disease = diseases[i % diseases.length];
        name = disease.name;
        description = disease.desc;
        extra = { prevalence: `${(seededRandom() * 15 + 1).toFixed(1)}%`, stage: seededRandom() > 0.5 ? 'Metastatic' : 'Locally Advanced' };
      }

      nodes.push({
        id, group: groupType,
        val: seededRandom() * 5 + 2,
        name, description, ...extra
      });

      links.push({ source: id, target: hubs[i % hubs.length] });

      if (seededRandom() > 0.4) {
        links.push({ source: id, target: `Node_${Math.floor(seededRandom() * Math.max(i, 1))}` });
      }
    }

    return { nodes, links };
  }, []);

  // Pre-compute matrix data from graph
  // Dataset summary — same numbers shown on every view tab
  const datasetSummary = useMemo(() => {
    const hubCount = graphData.nodes.filter((n: any) => n.group === 'hub').length;
    const compoundCount = graphData.nodes.filter((n: any) => n.group === 'compound').length;
    const assayCount = graphData.nodes.filter((n: any) => n.group === 'assay').length;
    const diseaseCount = graphData.nodes.filter((n: any) => n.group === 'disease').length;
    return {
      totalNodes: graphData.nodes.length,
      totalLinks: graphData.links.length,
      hubCount, compoundCount, assayCount, diseaseCount
    };
  }, [graphData]);

  const matrixData = useMemo(() => {
    const hubs = ['EGFR', 'HER2', 'BRAF', 'KRAS', 'ALK'];
    
    // Build adjacency: which non-hub nodes connect to which hubs
    const hubNeighbors: Record<string, Set<string>> = {};
    hubs.forEach(h => hubNeighbors[h] = new Set());
    
    graphData.links.forEach((link: any) => {
      const src = typeof link.source === 'object' ? link.source.id : link.source;
      const tgt = typeof link.target === 'object' ? link.target.id : link.target;
      if (hubs.includes(tgt)) hubNeighbors[tgt].add(src);
      if (hubs.includes(src)) hubNeighbors[src].add(tgt);
    });
    
    // Hub-to-hub shared nodes matrix
    const matrix: number[][] = hubs.map((h1) =>
      hubs.map((h2) => {
        if (h1 === h2) return hubNeighbors[h1].size;
        let shared = 0;
        hubNeighbors[h1].forEach(n => { if (hubNeighbors[h2].has(n)) shared++; });
        return shared;
      })
    );
    
    // Per-hub category counts
    const hubCategories = hubs.map(h => {
      const neighbors = Array.from(hubNeighbors[h]);
      const nodeMap = new Map(graphData.nodes.map((n: any) => [n.id, n]));
      let compounds = 0, assays = 0, diseases = 0;
      neighbors.forEach(nId => {
        const node = nodeMap.get(nId);
        if (node?.group === 'compound') compounds++;
        else if (node?.group === 'assay') assays++;
        else if (node?.group === 'disease') diseases++;
      });
      return { hub: h, total: neighbors.length, compounds, assays, diseases };
    });
    
    const maxVal = Math.max(...matrix.flat().filter((_, i) => Math.floor(i / hubs.length) !== i % hubs.length));
    
    return { hubs, matrix, maxVal, hubCategories };
  }, [graphData]);

  const getColor = (node: any) => {
    if (selectedNode && selectedNode.id === node.id) return '#fbbf24';
    if (node.group === 'hub') return '#0f172a';
    if (node.group === 'compound') return '#3b82f6';
    if (node.group === 'assay') return '#06b6d4';
    if (node.group === 'disease') return '#f43f5e';
    return '#94a3b8';
  };

  const handleNodeClick = useCallback((node: any) => {
    setSelectedNode(node);
    
    if (viewMode === '3d' && fg3Ref.current) {
      const distance = 80;
      const distRatio = 1 + distance/Math.hypot(node.x, node.y, node.z);
      const newPos = node.x || node.y || node.z
        ? { x: node.x * distRatio, y: node.y * distRatio, z: node.z * distRatio }
        : { x: 0, y: 0, z: distance };
      fg3Ref.current.cameraPosition(newPos, node, 1500);
    } else if (viewMode === '2d' && fg2Ref.current) {
      fg2Ref.current.centerAt(node.x, node.y, 1000);
      fg2Ref.current.zoom(4, 1000);
    }
  }, [viewMode]);

  return (
    <div className="flex-1 flex flex-col bg-white overflow-hidden animate-fadeIn relative">
      
      {/* STANDARD GLOBAL HEADER - Consistent with DataView.tsx */}
      <div className="h-16 px-8 border-b border-slate-200 bg-white flex items-center justify-between shrink-0 z-10">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">Knowledge Graph</h1>
          <span className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-2 py-0.5 rounded text-[10px] font-bold tracking-widest uppercase shadow-sm">Live Interactome</span>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <button className="text-slate-600 hover:text-slate-900 text-sm font-semibold flex items-center gap-2 px-3 py-1.5 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors shadow-sm">
            <Download className="w-4 h-4" /> Export Network
          </button>
        </div>
      </div>

      {/* SECONDARY TOOLBAR */}
      <div className="h-14 px-8 border-b border-slate-200 bg-white flex items-center justify-between shrink-0 z-10">
         <div className="flex items-center gap-2">
            <button className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-md text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-100 transition-colors">
              Last 7 Days <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>
            <button className="flex items-center gap-2 bg-slate-50 border border-slate-200 px-3 py-1.5 rounded-md text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-100 transition-colors">
              Daily <ChevronDown className="w-3.5 h-3.5 text-slate-400" />
            </button>
            <div className="w-px h-5 bg-slate-200 mx-2" />
            <button className="text-slate-600 hover:bg-slate-100 px-3 py-1.5 rounded-md text-sm font-medium flex items-center gap-1.5 transition-colors">
              <Tag className="w-3.5 h-3.5" /> Tags
            </button>
            <button className="text-slate-600 hover:bg-slate-100 px-3 py-1.5 rounded-md text-sm font-medium flex items-center gap-1.5 transition-colors">
              <Link2 className="w-3.5 h-3.5" /> Targets
            </button>
         </div>

         <div className="flex items-center gap-4">
            {/* 3D / 2D Toggle Switch */}
             <div className="flex items-center bg-slate-100 p-1 rounded-lg border border-slate-200 shrink-0">
               {[
                 { id: '3d' as ViewMode, label: '3D', icon: Network },
                 { id: '2d' as ViewMode, label: '2D', icon: Maximize2 },
                 { id: 'matrix' as ViewMode, label: 'Matrix', icon: Grid3X3 },
               ].map(tab => (
                 <button 
                   key={tab.id}
                   onClick={() => { setViewMode(tab.id); if (tab.id === 'matrix') setSelectedNode(null); }}
                   className={cn(
                     "px-3 py-1 rounded-md text-[11px] font-bold tracking-widest transition-all flex items-center gap-1.5",
                     viewMode === tab.id ? "bg-white text-slate-800 shadow-sm ring-1 ring-slate-200" : "text-slate-500 hover:text-slate-700"
                   )}
                 >
                   <tab.icon className="w-3 h-3" /> {tab.label}
                 </button>
               ))}
             </div>
         </div>
      </div>

      {/* DATASET SUMMARY BAR — always visible, proves data consistency */}
      <div className="h-9 px-8 border-b border-slate-100 bg-slate-50/80 flex items-center gap-5 shrink-0 z-10">
        <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Dataset</span>
        <div className="flex items-center gap-4">
          <span className="text-[12px] text-slate-600 font-medium flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-slate-900 inline-block" />
            {datasetSummary.hubCount} Hubs
          </span>
          <span className="text-[12px] text-slate-600 font-medium flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[var(--color-roche-blue)] inline-block" />
            {datasetSummary.compoundCount} Compounds
          </span>
          <span className="text-[12px] text-slate-600 font-medium flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-cyan-500 inline-block" />
            {datasetSummary.assayCount} Assays
          </span>
          <span className="text-[12px] text-slate-600 font-medium flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-rose-500 inline-block" />
            {datasetSummary.diseaseCount} Diseases
          </span>
        </div>
        <div className="w-px h-4 bg-slate-200" />
        <span className="text-[12px] text-slate-500 font-medium tabular-nums">
          {datasetSummary.totalNodes} nodes · {datasetSummary.totalLinks} edges
        </span>
      </div>

      {/* MAIN CONTENT */}
      <div className="flex-1 flex overflow-hidden relative">
        
        {/* GRAPH RENDER AREA */}
        <div className="flex-1 relative bg-slate-50" id="graph-container">
          
          {viewMode !== 'matrix' && (
            <>
              {/* Enhanced Glassmorphism Legend */}
              <div className="absolute top-6 left-6 z-10 bg-white/70 backdrop-blur-xl border border-white/40 rounded-2xl p-5 shadow-xl pointer-events-none">
                <h3 className="text-[10px] font-bold text-slate-400 mb-4 uppercase tracking-widest flex items-center gap-2">
                  <Network className="w-3.5 h-3.5" /> Network Nodes
                </h3>
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-3.5 h-3.5 rounded-full bg-slate-900 shadow-sm ring-2 ring-white" />
                    <span className="text-sm font-semibold text-slate-700">Major Target Hub</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-3.5 h-3.5 rounded-full bg-[var(--color-roche-blue)] shadow-sm ring-2 ring-white" />
                    <span className="text-sm font-semibold text-slate-700">Compound</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-3.5 h-3.5 rounded-full bg-cyan-500 shadow-sm ring-2 ring-white" />
                    <span className="text-sm font-semibold text-slate-700">Assay Protocol</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-3.5 h-3.5 rounded-full bg-rose-500 shadow-sm ring-2 ring-white" />
                    <span className="text-sm font-semibold text-slate-700">Disease / Phenotype</span>
                  </div>
                </div>
              </div>

              {/* WebGL Canvas */}
              {viewMode === '3d' ? (
                <ForceGraph3D
                  ref={fg3Ref}
                  graphData={graphData}
                  width={dimensions.width - (selectedNode ? 320 : 0)}
                  height={dimensions.height}
                  nodeColor={getColor}
                  nodeRelSize={6}
                  linkWidth={1}
                  linkColor={() => 'rgba(203, 213, 225, 0.25)'}
                  backgroundColor="#f8fafc"
                  showNavInfo={false}
                  onNodeClick={handleNodeClick}
                />
              ) : (
                <ForceGraph2D
                  ref={fg2Ref}
                  graphData={graphData}
                  width={dimensions.width - (selectedNode ? 320 : 0)}
                  height={dimensions.height}
                  nodeColor={getColor}
                  nodeRelSize={6}
                  linkWidth={1}
                  linkColor={() => 'rgba(203, 213, 225, 0.4)'}
                  backgroundColor="#f8fafc"
                  onNodeClick={handleNodeClick}
                />
              )}
            </>
          )}

          {/* MATRIX HEATMAP VIEW */}
          {viewMode === 'matrix' && (
            <div className="absolute inset-0 overflow-y-auto p-8 animate-fadeIn">
              <div className="max-w-5xl mx-auto flex flex-col gap-8">
                
                {/* Hub-to-Hub Adjacency Heatmap */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                  <div className="px-6 py-5 border-b border-slate-100 flex items-center justify-between">
                    <div>
                      <h3 className="text-[15px] font-bold text-slate-900 tracking-tight">Target Adjacency Matrix</h3>
                      <p className="text-[13px] text-slate-500 mt-0.5">Shared compounds between hub targets — darker cells indicate stronger co-targeting</p>
                    </div>
                    <span className="bg-slate-100 text-slate-500 px-2.5 py-1 rounded-md text-[10px] font-bold tracking-widest uppercase">5 × 5</span>
                  </div>
                  <div className="p-6">
                    <div className="overflow-x-auto">
                      <table className="w-full">
                        <thead>
                          <tr>
                            <th className="w-20"></th>
                            {matrixData.hubs.map(h => (
                              <th key={h} className="text-center px-2 pb-3">
                                <span className="text-[11px] font-bold text-slate-500 tracking-widest uppercase">{h}</span>
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {matrixData.hubs.map((rowHub, ri) => (
                            <tr key={rowHub}>
                              <td className="pr-4 py-1">
                                <span className="text-[11px] font-bold text-slate-500 tracking-widest uppercase">{rowHub}</span>
                              </td>
                              {matrixData.matrix[ri].map((val, ci) => {
                                const isDiag = ri === ci;
                                const intensity = isDiag ? 1 : Math.min(val / (matrixData.maxVal || 1), 1);
                                return (
                                  <td key={ci} className="p-1">
                                    <div 
                                      className={cn(
                                        "rounded-lg h-16 flex items-center justify-center transition-all cursor-default group relative",
                                        isDiag ? "ring-2 ring-inset ring-slate-200" : "hover:ring-2 hover:ring-[var(--color-roche-blue)]/40"
                                      )}
                                      style={{
                                        backgroundColor: isDiag 
                                          ? '#f1f5f9'
                                          : `rgba(0, 102, 204, ${intensity * 0.7 + 0.05})`,
                                      }}
                                    >
                                      <span className={cn(
                                        "text-sm font-bold tabular-nums",
                                        isDiag ? "text-slate-600" : 
                                        intensity > 0.45 ? "text-white" : "text-slate-700"
                                      )}>
                                        {val}
                                      </span>
                                      {/* Hover tooltip */}
                                      {!isDiag && (
                                        <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-[#0B1121] text-white text-[11px] font-semibold px-3 py-1.5 rounded-lg whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20 shadow-xl">
                                          {matrixData.hubs[ri]} ↔ {matrixData.hubs[ci]}: {val} shared
                                        </div>
                                      )}
                                    </div>
                                  </td>
                                );
                              })}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                    {/* Scale legend */}
                    <div className="flex items-center gap-3 mt-5 pt-4 border-t border-slate-100">
                      <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Density</span>
                      <div className="flex items-center gap-0.5">
                        {[0.05, 0.15, 0.25, 0.4, 0.55, 0.7].map((op, i) => (
                          <div key={i} className="w-6 h-3 rounded-sm" style={{ backgroundColor: `rgba(0, 102, 204, ${op})` }} />
                        ))}
                      </div>
                      <span className="text-[10px] text-slate-400">Low → High</span>
                    </div>
                  </div>
                </div>

                {/* Per-Hub Category Breakdown */}
                <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                  <div className="px-6 py-5 border-b border-slate-100">
                    <h3 className="text-[15px] font-bold text-slate-900 tracking-tight">Hub Category Breakdown</h3>
                    <p className="text-[13px] text-slate-500 mt-0.5">Entity distribution per target — compounds, assays, and disease associations</p>
                  </div>
                  <div className="divide-y divide-slate-100">
                    {matrixData.hubCategories.map(hub => {
                      const maxBarVal = Math.max(...matrixData.hubCategories.map(h => h.total)) || 1;
                      return (
                        <div key={hub.hub} className="px-6 py-4 flex items-center gap-6 hover:bg-slate-50/50 transition-colors group">
                          {/* Hub name */}
                          <div className="w-16 shrink-0">
                            <span className="text-sm font-bold text-slate-900 group-hover:text-[var(--color-roche-blue)] transition-colors">{hub.hub}</span>
                          </div>
                          {/* Stacked Bar */}
                          <div className="flex-1 flex items-center gap-1 h-7">
                            <div 
                              className="h-full bg-[var(--color-roche-blue)] rounded-l-md transition-all flex items-center justify-center min-w-[2px]"
                              style={{ width: `${(hub.compounds / maxBarVal) * 100}%` }}
                            >
                              {hub.compounds > 8 && <span className="text-[10px] font-bold text-white/90">{hub.compounds}</span>}
                            </div>
                            <div 
                              className="h-full bg-cyan-500 transition-all flex items-center justify-center min-w-[2px]"
                              style={{ width: `${(hub.assays / maxBarVal) * 100}%` }}
                            >
                              {hub.assays > 5 && <span className="text-[10px] font-bold text-white/90">{hub.assays}</span>}
                            </div>
                            <div 
                              className="h-full bg-rose-500 rounded-r-md transition-all flex items-center justify-center min-w-[2px]"
                              style={{ width: `${(hub.diseases / maxBarVal) * 100}%` }}
                            >
                              {hub.diseases > 5 && <span className="text-[10px] font-bold text-white/90">{hub.diseases}</span>}
                            </div>
                          </div>
                          {/* Total */}
                          <div className="w-16 text-right shrink-0">
                            <span className="text-sm font-bold text-slate-800 tabular-nums">{hub.total}</span>
                            <span className="text-[11px] text-slate-400 ml-1">total</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                  {/* Bar legend */}
                  <div className="px-6 py-4 border-t border-slate-100 flex items-center gap-5">
                    <div className="flex items-center gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-sm bg-[var(--color-roche-blue)]" />
                      <span className="text-[11px] font-semibold text-slate-500">Compounds</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-sm bg-cyan-500" />
                      <span className="text-[11px] font-semibold text-slate-500">Assays</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <div className="w-2.5 h-2.5 rounded-sm bg-rose-500" />
                      <span className="text-[11px] font-semibold text-slate-500">Diseases</span>
                    </div>
                  </div>
                </div>

              </div>
            </div>
          )}
        </div>

        {/* SIDE PANEL (Progressive Disclosure) */}
        {selectedNode && (
          <div className="w-80 bg-white border-l border-slate-200 shadow-[-10px_0_30px_-15px_rgba(0,0,0,0.1)] flex flex-col shrink-0 animate-fadeIn z-20">
            <div className="h-14 px-4 border-b border-slate-100 flex items-center justify-between bg-slate-50/50">
              <span className="text-xs font-bold uppercase tracking-widest text-slate-400 flex items-center gap-2">
                <Info className="w-3.5 h-3.5" /> Node Details
              </span>
              <button 
                onClick={() => setSelectedNode(null)}
                className="p-1 rounded-md text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
            
            <div className="p-6 flex-1 overflow-y-auto">
               <div className="mb-5">
                 <div className={cn(
                   "w-12 h-12 rounded-xl flex items-center justify-center mb-4 text-white shadow-md",
                   selectedNode.group === 'hub' ? "bg-slate-900" :
                   selectedNode.group === 'compound' ? "bg-[var(--color-roche-blue)]" :
                   selectedNode.group === 'assay' ? "bg-cyan-500" : "bg-rose-500"
                 )}>
                   {selectedNode.group === 'hub' ? <Database className="w-6 h-6" /> :
                    selectedNode.group === 'compound' ? <Share2 className="w-6 h-6" /> :
                    selectedNode.group === 'assay' ? <FlaskConical className="w-6 h-6" /> :
                    <Activity className="w-6 h-6" />}
                 </div>
                 <h2 className="text-xl font-bold text-slate-900 mb-0.5">{selectedNode.name}</h2>
                 {selectedNode.fullName && (
                   <p className="text-[13px] text-slate-500 font-medium mb-1">{selectedNode.fullName}</p>
                 )}
                 <span className={cn(
                   "inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold tracking-widest uppercase",
                   selectedNode.group === 'hub' ? "bg-slate-100 text-slate-600" :
                   selectedNode.group === 'compound' ? "bg-blue-50 text-blue-600" :
                   selectedNode.group === 'assay' ? "bg-cyan-50 text-cyan-600" : "bg-rose-50 text-rose-600"
                 )}>
                   {selectedNode.group}
                 </span>
               </div>

               <div className="mb-5">
                 <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-2">Description</h3>
                 <p className="text-[13px] text-slate-600 leading-relaxed">
                   {selectedNode.description}
                 </p>
               </div>

               {/* Hub-specific: pathway + PDB */}
               {selectedNode.group === 'hub' && (
                 <div className="grid grid-cols-2 gap-3 mb-5">
                   <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                     <span className="text-[11px] text-slate-400 font-medium block mb-1">Pathway</span>
                     <span className="text-sm font-bold text-slate-800">{selectedNode.pathway}</span>
                   </div>
                   <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                     <span className="text-[11px] text-slate-400 font-medium block mb-1">PDB ID</span>
                     <span className="text-sm font-bold text-[var(--color-roche-blue)]">{selectedNode.pdb}</span>
                   </div>
                 </div>
               )}

               {/* Compound-specific properties */}
               {selectedNode.group === 'compound' && (
                 <>
                   <div className="grid grid-cols-2 gap-3 mb-3">
                     <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                       <span className="text-[11px] text-slate-400 font-medium block mb-1">IC₅₀</span>
                       <span className="text-sm font-bold text-slate-800">{selectedNode.ic50}</span>
                     </div>
                     <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                       <span className="text-[11px] text-slate-400 font-medium block mb-1">MW</span>
                       <span className="text-sm font-bold text-slate-800">{selectedNode.mw} Da</span>
                     </div>
                   </div>
                   <div className="grid grid-cols-2 gap-3 mb-5">
                     <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                       <span className="text-[11px] text-slate-400 font-medium block mb-1">cLogP</span>
                       <span className="text-sm font-bold text-slate-800">{selectedNode.logP}</span>
                     </div>
                     <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                       <span className="text-[11px] text-slate-400 font-medium block mb-1">Phase</span>
                       <span className={cn(
                         "text-sm font-bold",
                         selectedNode.phase === 'Phase II' ? "text-emerald-600" :
                         selectedNode.phase === 'Phase I' ? "text-amber-600" : "text-slate-600"
                       )}>{selectedNode.phase}</span>
                     </div>
                   </div>
                   <div className="mb-5 flex items-center gap-2">
                     <span className="text-[11px] text-slate-400 font-medium">Source:</span>
                     <span className={cn(
                       "text-[11px] font-bold px-2 py-0.5 rounded",
                       selectedNode.source === 'Internal' ? "bg-blue-50 text-blue-600" : "bg-amber-50 text-amber-600"
                     )}>{selectedNode.source}</span>
                   </div>
                 </>
               )}

               {/* Assay-specific properties */}
               {selectedNode.group === 'assay' && (
                 <div className="grid grid-cols-2 gap-3 mb-5">
                   <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                     <span className="text-[11px] text-slate-400 font-medium block mb-1">Throughput</span>
                     <span className="text-sm font-bold text-slate-800">{selectedNode.throughput}</span>
                   </div>
                   <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                     <span className="text-[11px] text-slate-400 font-medium block mb-1">Readout</span>
                     <span className="text-sm font-bold text-slate-800">{selectedNode.readout}</span>
                   </div>
                 </div>
               )}

               {/* Disease-specific properties */}
               {selectedNode.group === 'disease' && (
                 <div className="grid grid-cols-2 gap-3 mb-5">
                   <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                     <span className="text-[11px] text-slate-400 font-medium block mb-1">Prevalence</span>
                     <span className="text-sm font-bold text-slate-800">{selectedNode.prevalence}</span>
                   </div>
                   <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                     <span className="text-[11px] text-slate-400 font-medium block mb-1">Stage</span>
                     <span className="text-sm font-bold text-slate-800">{selectedNode.stage}</span>
                   </div>
                 </div>
               )}

               {/* Universal stats */}
               <div className="grid grid-cols-2 gap-3 mb-6">
                 <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                   <span className="text-[11px] text-slate-400 font-medium block mb-1">Connections</span>
                   <span className="text-lg font-bold text-slate-800">{selectedNode.val ? Math.ceil(selectedNode.val * 3) : 1}</span>
                 </div>
                 <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                   <span className="text-[11px] text-slate-400 font-medium block mb-1">Confidence</span>
                   <span className="text-lg font-bold text-slate-800">{selectedNode.val ? (selectedNode.val / 7 * 100).toFixed(0) : 50}%</span>
                 </div>
               </div>

               <button className="w-full bg-[var(--color-roche-blue)] text-white font-semibold rounded-xl py-3 hover:bg-blue-700 transition-colors shadow-md flex items-center justify-center gap-2">
                 <Activity className="w-4 h-4" /> Run Deep Analysis
               </button>
            </div>
          </div>
        )}
        
      </div>
    </div>
  );
}
