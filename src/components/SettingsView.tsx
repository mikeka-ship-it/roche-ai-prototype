import { useState } from 'react';
import { 
  User, Sliders, Bot, Keyboard, BookOpen, Download, Upload, 
  HelpCircle, Link, UserPlus, Key, FlaskConical, LogOut, ChevronDown
} from 'lucide-react';
import { cn } from '../utils/cn';

export function SettingsView() {
  const [activeTab, setActiveTab] = useState('customize-ai');
  const [activeSubTab, setActiveSubTab] = useState('prompts');

  const navGroups = [
    {
      title: 'Personal settings for this workspace',
      items: [
        { id: 'account', icon: User, label: 'Account' },
        { id: 'preferences', icon: Sliders, label: 'Preferences' },
        { id: 'customize-ai', icon: Bot, label: 'Customize your AI' },
        { id: 'shortcuts', icon: Keyboard, label: 'Keyboard shortcuts' },
        { id: 'recap', icon: BookOpen, label: 'Recap' },
      ]
    },
    {
      title: 'Apps & data',
      items: [
        { id: 'import', icon: Upload, label: 'Import to Roche AI' },
        { id: 'export', icon: Download, label: 'Export from Roche AI' },
      ]
    },
    {
      title: 'Help & info',
      items: [
        { id: 'help', icon: HelpCircle, label: 'How to use Roche AI', external: true },
      ]
    },
    {
      title: 'Other',
      items: [
        { id: 'affiliates', icon: Link, label: 'Affiliates', external: true },
        { id: 'invite', icon: UserPlus, label: 'Invite a friend' },
        { id: 'api', icon: Key, label: 'API keys' },
        { id: 'labs', icon: FlaskConical, label: 'Roche AI Labs' },
        { id: 'logout', icon: LogOut, label: 'Logout', danger: true },
      ]
    }
  ];

  return (
    <div className="flex-1 flex flex-col bg-[#FAF9F7] overflow-hidden animate-fadeIn">
      
      {/* STANDARD GLOBAL HEADER */}
      <div className="h-16 px-8 border-b border-slate-200 bg-white flex items-center justify-between shrink-0 z-10">
        <h1 className="text-xl font-bold text-slate-900 tracking-tight flex items-center gap-2">
          <span className="text-slate-400 font-semibold">Settings</span> <span className="text-slate-300 font-normal">/</span> Customize your AI
        </h1>
      </div>

      {/* TWO COLUMN LAYOUT */}
      <div className="flex-1 flex overflow-hidden">
        
        {/* LEFT SETTINGS NAV */}
        <aside className="w-[280px] bg-white border-r border-slate-200 flex flex-col overflow-y-auto shrink-0 py-6">
          <div className="flex flex-col gap-8 px-4">
            {navGroups.map((group, i) => (
              <div key={i}>
                <h3 className="text-[10px] font-bold tracking-widest text-slate-400 uppercase mb-3 px-3">
                  {group.title}
                </h3>
                <nav className="flex flex-col gap-0.5">
                  {group.items.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => !item.external && !item.danger && setActiveTab(item.id)}
                      className={cn(
                        "w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-all duration-200 group text-left",
                        activeTab === item.id 
                          ? "bg-slate-100 text-slate-900 font-bold shadow-sm" 
                          : item.danger
                            ? "text-rose-600 hover:bg-rose-50 font-semibold"
                            : "text-slate-600 hover:bg-slate-50 font-semibold"
                      )}
                    >
                      <item.icon className={cn(
                        "w-[18px] h-[18px]",
                        activeTab === item.id ? "text-slate-900" : item.danger ? "text-rose-600" : "text-slate-400 group-hover:text-slate-600"
                      )} />
                      <span className="flex-1">{item.label}</span>
                      {item.external && <span className="text-[14px] leading-none text-slate-400">↗</span>}
                    </button>
                  ))}
                </nav>
              </div>
            ))}
          </div>
        </aside>

        {/* RIGHT MAIN CONTENT */}
        <main className="flex-1 overflow-y-auto">
          <div className="max-w-3xl mx-auto px-10 py-10 flex flex-col gap-8">
            
            {/* Pill Tabs */}
            <div className="flex items-center gap-1 bg-slate-200/50 p-1 rounded-xl w-fit border border-slate-200/60 shadow-inner">
              <button 
                onClick={() => setActiveSubTab('prompts')}
                className={cn(
                  "px-4 py-1.5 rounded-lg text-sm font-bold transition-all duration-200",
                  activeSubTab === 'prompts' ? "bg-white text-slate-800 shadow-sm ring-1 ring-slate-900/5" : "text-slate-500 hover:text-slate-700"
                )}
              >
                AI prompts and templates
              </button>
              <button 
                onClick={() => setActiveSubTab('profile')}
                className={cn(
                  "px-4 py-1.5 rounded-lg text-sm font-bold transition-all duration-200",
                  activeSubTab === 'profile' ? "bg-white text-slate-800 shadow-sm ring-1 ring-slate-900/5" : "text-slate-500 hover:text-slate-700"
                )}
              >
                Your AI profile
              </button>
            </div>

            {/* Settings Card 1 */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
              <div className="p-8 flex flex-col gap-6">
                <div>
                  <h2 className="text-xl font-bold text-slate-900 tracking-tight mb-2">Automatic renaming</h2>
                  <p className="text-sm text-slate-600 font-medium">
                    Choose when Roche AI automatically renames compounds and docking runs.
                  </p>
                  <p className="text-sm text-slate-400 mt-3 leading-relaxed">
                    By default, the AI automatically renames things that either don't have a name or have a generic name (e.g. an import called 'dataset_final_v2.csv').<br/><br/>
                    Renaming uses 0.1 compute credits.
                  </p>
                </div>

                <div className="relative w-72">
                  <select className="w-full appearance-none bg-white border border-slate-200 text-slate-700 text-sm font-semibold rounded-lg px-4 py-2.5 outline-none focus:border-[var(--color-roche-blue)] focus:ring-1 focus:ring-[var(--color-roche-blue)] transition-all shadow-sm">
                    <option>Rename untitled items (default)</option>
                    <option>Always rename all items</option>
                    <option>Never rename items</option>
                  </select>
                  <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
                </div>

                <div className="pt-2">
                  <label className="text-sm font-bold text-slate-800 block mb-3">
                    What personal preferences should Roche AI consider when automatically renaming items?
                  </label>
                  <textarea 
                    placeholder="Example:&#10;Always put the saved date at the start of the title, in the format: DD-MM-YY"
                    className="w-full h-32 bg-white border border-slate-200 rounded-xl p-4 text-sm text-slate-700 placeholder:text-slate-300 focus:outline-none focus:border-[var(--color-roche-blue)] focus:ring-1 focus:ring-[var(--color-roche-blue)] transition-all shadow-sm resize-none"
                  />
                </div>
              </div>
            </div>

            {/* Settings Card 2 */}
            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden mb-12">
              <div className="p-8 flex flex-col gap-6">
                <div>
                  <h2 className="text-xl font-bold text-slate-900 tracking-tight mb-2">AI assistant prompt</h2>
                </div>

                <div>
                  <label className="text-sm font-bold text-slate-800 block mb-3">
                    What personal preferences should the AI Copilot consider in responses?
                  </label>
                  <textarea 
                    placeholder="Example:&#10;Respond with a strictly scientific tone. Do not use small talk, provide direct interpretations of molecular binding affinities."
                    className="w-full h-32 bg-white border border-slate-200 rounded-xl p-4 text-sm text-slate-700 placeholder:text-slate-300 focus:outline-none focus:border-[var(--color-roche-blue)] focus:ring-1 focus:ring-[var(--color-roche-blue)] transition-all shadow-sm resize-none"
                  />
                </div>
              </div>
            </div>

          </div>
        </main>
      </div>
    </div>
  );
}
