import { useState } from 'react';
import { CheckCircle2, Circle, ArrowUpRight } from 'lucide-react';
import { cn } from '../utils/cn';

const SETUP_STEPS = [
  { id: 'project', title: 'Create a new campaign', completed: false },
  { id: 'share', title: 'Share your work', completed: false },
  { id: 'essentials', title: 'Learn the Essentials', completed: false },
];

const MiniBarChart = () => (
  <div className="flex items-end gap-1.5 h-16 mt-auto w-full px-4">
    <div className="w-6 bg-blue-400 rounded-t-sm" style={{ height: '40%' }} />
    <div className="w-6 bg-emerald-400 rounded-t-sm" style={{ height: '20%' }} />
    <div className="w-6 bg-amber-400 rounded-t-sm" style={{ height: '80%' }} />
    <div className="w-6 bg-rose-400 rounded-t-sm" style={{ height: '60%' }} />
  </div>
);

const MiniBoxPlot = () => (
  <div className="flex flex-col justify-center gap-3 h-16 mt-auto w-full px-4">
    <div className="relative h-5 w-full flex items-center">
       <div className="absolute left-2 right-6 h-px bg-slate-300" />
       <div className="absolute left-2 w-px h-3 bg-slate-400" />
       <div className="absolute right-6 w-px h-3 bg-slate-400" />
       <div className="absolute left-8 w-14 h-5 bg-blue-500 rounded-sm" />
    </div>
    <div className="relative h-5 w-full flex items-center">
       <div className="absolute left-4 right-10 h-px bg-slate-300" />
       <div className="absolute left-4 w-px h-3 bg-slate-400" />
       <div className="absolute right-10 w-px h-3 bg-slate-400" />
       <div className="absolute left-6 w-20 h-5 bg-amber-500 rounded-sm" />
    </div>
    <div className="relative h-5 w-full flex items-center">
       <div className="absolute left-6 right-2 h-px bg-slate-300" />
       <div className="absolute left-6 w-px h-3 bg-slate-400" />
       <div className="absolute right-2 w-px h-3 bg-slate-400" />
       <div className="absolute left-10 w-12 h-5 bg-emerald-500 rounded-sm" />
    </div>
  </div>
);

const MiniComplexChart = () => (
  <div className="flex items-end gap-[2px] h-16 mt-auto w-full px-2">
    {[3,4,2,5,7,6,4,8,9,6,4,5,7,8,6,7,9,10,8,7,9,10].map((h, i) => (
      <div key={i} className="flex-1 bg-blue-500 flex flex-col justify-end" style={{ height: `${h * 10}%` }}>
         <div className="w-full bg-emerald-400" style={{ height: '20%' }} />
         <div className="w-full bg-rose-400" style={{ height: '30%' }} />
      </div>
    ))}
  </div>
);



const TUTORIALS = [
  {
    category: 'Connect to data',
    categoryColor: 'bg-emerald-50 text-emerald-700',
    title: 'Querying ChEMBL securely',
    description: 'Connect your workspace to public databases so you can access, read & write structure data safely.',
  },
  {
    category: 'Connect to data',
    categoryColor: 'bg-emerald-50 text-emerald-700',
    title: 'Get your internal data',
    description: 'Learn simple methods to get your proprietary data into the workspace by uploading SDF files and setting up DB connections.',
  },
  {
    category: 'Connect to data',
    categoryColor: 'bg-emerald-50 text-emerald-700',
    title: 'Merging compound sources',
    description: 'Combine and work with multiple structural data sources across CSVs, SDFs, and enterprise databases.',
  },
  {
    category: 'Connect to data',
    categoryColor: 'bg-emerald-50 text-emerald-700',
    title: 'Parameterize AI queries',
    description: 'Make your predictive models dynamically respond to user input without writing complex Python scripts.',
  },
  {
    category: 'Run pipelines',
    categoryColor: 'bg-blue-50 text-blue-700',
    title: 'Read and write to LIMS',
    description: 'Use the visual pipeline builder to write results directly back to the Laboratory Information Management System.',
  },
  {
    category: 'Run pipelines',
    categoryColor: 'bg-blue-50 text-blue-700',
    title: 'Toxicity Pre-filter package',
    description: 'Learn how to use the built-in toxicity screening package and run quick viability queries with it.',
  },
  {
    category: 'Analytics',
    categoryColor: 'bg-purple-50 text-purple-700',
    title: 'Create scatter plots',
    description: 'Learn how to create comprehensive chemical space plots using the built-in charting tools.',
  },
  {
    category: 'Analytics',
    categoryColor: 'bg-purple-50 text-purple-700',
    title: 'Flowing between 2D and 3D',
    description: 'How to flow back and forth between 2D structure representations and 3D docking simulations smoothly.',
  },
];

export function LearnView() {
  const [activeStep, setActiveStep] = useState('project');
  const completedCount = SETUP_STEPS.filter(s => s.completed).length;

  return (
    <div className="flex-1 flex flex-col bg-[#FAF9F7] overflow-hidden animate-fadeIn">
      {/* STANDARD GLOBAL HEADER */}
      <div className="h-16 px-8 border-b border-slate-200 bg-white flex items-center justify-between shrink-0 z-10">
        <h1 className="text-xl font-bold text-slate-900 tracking-tight">Knowledge Base</h1>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="max-w-6xl mx-auto px-8 py-10 flex flex-col gap-12">
        
        {/* HERO SECTION: Set up your workspace */}
        <div className="relative rounded-2xl border border-slate-200 bg-white overflow-hidden shadow-sm">
          {/* Subtle background decoration */}
          <div className="absolute inset-0 pointer-events-none opacity-[0.03]">
            <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                  <path d="M 40 0 L 0 0 0 40" fill="none" stroke="currentColor" strokeWidth="1"/>
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#grid)" />
            </svg>
          </div>
          
          <div className="relative p-8 md:p-10 flex flex-col md:flex-row gap-10">
            {/* Left Column: Progress */}
            <div className="w-full md:w-[260px] shrink-0 flex flex-col">
              <h1 className="text-[22px] font-extrabold text-slate-900 tracking-tight mb-1">Get started</h1>
              <p className="text-[13px] text-slate-500 font-medium mb-8">
                {completedCount} of {SETUP_STEPS.length} complete
              </p>
              
              <div className="flex flex-col gap-1 relative">
                {/* Connecting line behind steps */}
                <div className="absolute left-[11px] top-4 bottom-4 w-px bg-slate-100 z-0" />
                
                {SETUP_STEPS.map((step) => (
                  <button
                    key={step.id}
                    onClick={() => setActiveStep(step.id)}
                    className={cn(
                      "relative z-10 flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200 text-left group",
                      activeStep === step.id ? "bg-white shadow-sm border border-slate-200" : "hover:bg-slate-50/50 border border-transparent"
                    )}
                  >
                    <div className="bg-white shrink-0">
                      {step.completed ? (
                        <CheckCircle2 className="w-[22px] h-[22px] text-emerald-500" />
                      ) : (
                        <Circle className={cn(
                          "w-[22px] h-[22px] stroke-[1.5]",
                          activeStep === step.id ? "text-blue-500" : "text-slate-200 group-hover:text-slate-300"
                        )} />
                      )}
                    </div>
                    <span className={cn(
                      "text-[13px] font-bold transition-colors",
                      activeStep === step.id ? "text-slate-900" : "text-slate-600 group-hover:text-slate-900"
                    )}>
                      {step.title}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Right Column: Dynamic Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
              {activeStep === 'project' && (
                <div className="animate-fadeIn h-full flex flex-col">
                  <h2 className="text-lg font-bold text-slate-900 mb-1">Create a new campaign</h2>
                  <p className="text-sm text-slate-500 mb-6">
                    Start building from scratch, or see what's possible with a tutorial or demo.
                  </p>
                  
                  <div className="flex gap-4 overflow-x-auto pb-4 hide-scrollbar">
                    
                    {/* Blank Project Card */}
                    <button className="flex flex-col items-center justify-center shrink-0 w-[180px] h-[220px] bg-white border border-slate-200 rounded-lg hover:shadow-md hover:border-slate-300 transition-all group">
                      <div className="w-8 h-8 rounded-full border border-slate-200 flex items-center justify-center text-slate-400 group-hover:text-blue-500 group-hover:border-blue-500 transition-colors mb-4">
                        <span className="text-xl leading-none font-light">+</span>
                      </div>
                      <h3 className="text-sm font-bold text-slate-900 mb-1">Start something new</h3>
                      <p className="text-[11px] text-slate-500">So fresh, so clean</p>
                    </button>

                    {/* Template Card 1 */}
                    <button className="flex flex-col shrink-0 w-[200px] h-[220px] bg-white border border-slate-200 rounded-lg hover:shadow-md hover:border-slate-300 transition-all group overflow-hidden text-left">
                      <div className="p-4 flex-1 flex flex-col">
                        <h3 className="text-[13px] font-bold text-slate-900 mb-1">Target Binding Tutorial</h3>
                        <p className="text-[11px] text-slate-500">Learn the basics</p>
                        <MiniBarChart />
                      </div>
                    </button>

                    {/* Template Card 2 */}
                    <button className="flex flex-col shrink-0 w-[200px] h-[220px] bg-white border border-slate-200 rounded-lg hover:shadow-md hover:border-slate-300 transition-all group overflow-hidden text-left">
                      <div className="p-4 flex-1 flex flex-col">
                        <h3 className="text-[13px] font-bold text-slate-900 mb-1">Exploratory data analysis</h3>
                        <p className="text-[11px] text-slate-500">What affects hit rates?</p>
                        <MiniBoxPlot />
                      </div>
                    </button>

                    {/* Template Card 3 */}
                    <button className="flex flex-col shrink-0 w-[200px] h-[220px] bg-white border border-slate-200 rounded-lg hover:shadow-md hover:border-slate-300 transition-all group overflow-hidden text-left">
                      <div className="p-4 flex-1 flex flex-col">
                        <h3 className="text-[13px] font-bold text-slate-900 mb-1">Lead optimization</h3>
                        <p className="text-[11px] text-slate-500">Toxicity Forecast</p>
                        <MiniComplexChart />
                      </div>
                    </button>

                  </div>
                </div>
              )}
              
              {activeStep !== 'project' && (
                <div className="animate-fadeIn h-full flex flex-col items-center justify-center text-center py-10">
                  <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mb-4">
                     <Circle className="w-8 h-8 text-slate-300 stroke-[1.5]" />
                  </div>
                  <h2 className="text-lg font-bold text-slate-900 mb-2">
                    {SETUP_STEPS.find(s => s.id === activeStep)?.title}
                  </h2>
                  <p className="text-sm text-slate-500 max-w-sm">
                    This step is currently marked as pending. 
                    Select 'Create a new campaign' to see the detailed view.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* TUTORIALS SECTION */}
        <div>
          <div className="mb-6">
            <h2 className="text-2xl font-extrabold text-slate-900 tracking-tight mb-1">Tutorials</h2>
            <p className="text-sm text-slate-500 font-medium">Discover ways to supercharge your screening projects.</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {TUTORIALS.map((tut, i) => (
              <a 
                key={i} 
                href="#"
                className="group flex flex-col p-5 bg-white border border-slate-200 rounded-xl hover:shadow-md hover:border-slate-300 transition-all duration-200 h-[180px]"
              >
                <div className="flex items-start justify-between mb-3">
                  <span className={cn("px-2 py-1 rounded text-[10px] font-bold tracking-widest uppercase", tut.categoryColor)}>
                    {tut.category}
                  </span>
                  <ArrowUpRight className="w-4 h-4 text-slate-300 group-hover:text-slate-500 transition-colors" />
                </div>
                <h3 className="text-sm font-extrabold text-slate-900 leading-tight mb-2 group-hover:text-[var(--color-roche-blue)] transition-colors line-clamp-2">
                  {tut.title}
                </h3>
                <p className="text-xs text-slate-500 leading-relaxed line-clamp-3">
                  {tut.description}
                </p>
              </a>
            ))}
          </div>
        </div>
        
        {/* Extra spacing at bottom */}
        <div className="h-8" />
      </div>
    </div>
  </div>
  );
}
