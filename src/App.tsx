import { useEffect, useMemo, useState } from 'react';
import Fuse from 'fuse.js';
import { Search, Star, FileText, ChevronRight, Download, Upload } from 'lucide-react';
import { useStore } from './store/useStore';
import { saveFavorites, saveNotes, initStorage, loadFavorites, loadNotes } from './utils/storage';
import { loadAppData as fetchData } from './utils/data';
import { checkForUpdates } from './utils/updater';
import type { CommandEntry, ModuleEntry } from './types';
import { CommandBuilder } from './components/CommandBuilder';
import { ToastContainer } from './components/Toast';
import { writeText, readText } from '@tauri-apps/plugin-clipboard-manager';

function App() {
  const [isDataLoaded, setIsDataLoaded] = useState(false);
  const [modules, setModules] = useState<ModuleEntry[]>([]);
  const [commands, setCommands] = useState<CommandEntry[]>([]);
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  const {
    searchQuery, setSearchQuery,
    selectedPlatform, setSelectedPlatform,
    selectedModule, setSelectedModule,
    selectedTags, toggleTag,
    favorites, setFavorites, toggleFavorite,
    notes, setNotes, setNote,
    addToast
  } = useStore();

  useEffect(() => {
    async function init() {
      await initStorage();
      const favs = await loadFavorites();
      const nts = await loadNotes();
      setFavorites(favs);
      setNotes(nts);

      const data = await fetchData();
      setModules(data.modules.sort((a, b) => a.order - b.order));
      setCommands(data.commands);
      setIsDataLoaded(true);
    }
    init();
  }, []);

  // Sync favorites/notes to local storage on change
  useEffect(() => { if (isDataLoaded) saveFavorites(favorites); }, [favorites, isDataLoaded]);
  useEffect(() => { if (isDataLoaded) saveNotes(notes); }, [notes, isDataLoaded]);

  const handleUpdate = async () => {
    setIsUpdating(true);
    const updated = await checkForUpdates();
    if (updated) {
      // Reload data
      const data = await fetchData();
      setModules(data.modules.sort((a, b) => a.order - b.order));
      setCommands(data.commands);
      addToast('Content updated successfully from remote repository.', 'success');
    } else {
      addToast('You are already on the latest version or offline.', 'info');
    }
    setIsUpdating(false);
  };

  const handleExportData = async () => {
    const data = JSON.stringify({ favorites, notes });
    try {
      if (typeof window !== 'undefined' && (window as any).__TAURI_INTERNALS__) {
        await writeText(data);
      } else {
        await navigator.clipboard.writeText(data);
      }
      addToast('Data exported to clipboard!', 'success');
    } catch (e) {
      addToast('Failed to export data to clipboard.', 'error');
    }
  };

  const handleImportData = async () => {
    try {
      let clipboardText = '';
      if (typeof window !== 'undefined' && (window as any).__TAURI_INTERNALS__) {
        clipboardText = await readText() || '';
      } else {
        clipboardText = await navigator.clipboard.readText();
      }
      
      const parsed = JSON.parse(clipboardText);
      if (parsed.favorites && Array.isArray(parsed.favorites)) {
        setFavorites([...new Set([...favorites, ...parsed.favorites])]);
      }
      if (parsed.notes) {
        setNotes({ ...notes, ...parsed.notes });
      }
      addToast('Data imported successfully!', 'success');
    } catch (e) {
      addToast('Invalid data format in clipboard.', 'error');
    }
  };

  // Extract all unique scenario tags
  const allTags = useMemo(() => {
    const tags = new Set<string>();
    commands.forEach(cmd => cmd.scenario_tags.forEach(t => tags.add(t)));
    return Array.from(tags).sort();
  }, [commands]);

  // Configure Fuse
  const fuse = useMemo(() => new Fuse(commands, {
    keys: ['title', 'tool', 'command', 'scenario_tags', 'description'],
    threshold: 0.3,
    ignoreLocation: true,
  }), [commands]);

  const filteredCommands = useMemo(() => {
    let result = commands;

    // Search
    if (searchQuery.trim()) {
      result = fuse.search(searchQuery).map(res => res.item);
    }

    // Platform Filter
    if (selectedPlatform !== 'all') {
      result = result.filter(cmd => cmd.platform === selectedPlatform || cmd.platform === 'cross-platform');
    }

    if (selectedModule !== 'all') {
      if (selectedModule === 'favorites') {
        result = result.filter(cmd => favorites.includes(cmd.id));
      } else {
        result = result.filter(cmd => cmd.module_ids?.includes(selectedModule));
      }
    }

    // Tags Filter (AND logic)
    if (selectedTags.length > 0) {
      result = result.filter(cmd => selectedTags.every(tag => cmd.scenario_tags.includes(tag)));
    }

    return result;
  }, [commands, fuse, searchQuery, selectedPlatform, selectedModule, selectedTags, favorites, modules]);

  if (!isDataLoaded) {
    return <div className="min-h-screen bg-bg-base flex items-center justify-center text-gray-500 font-sans">Initializing systems...</div>;
  }

  return (
    <div className="min-h-screen w-full bg-bg-base text-gray-200 flex overflow-hidden font-sans">
      <ToastContainer />
      {/* Sidebar */}
      <aside className="w-72 bg-bg-surface border-r border-bg-active flex flex-col z-10 shrink-0">
        <div className="p-5 border-b border-bg-active">
          <h1 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <span className="w-3 h-3 bg-brand-primary"></span>
            Cmdx24
          </h1>
        </div>
        <nav className="flex-1 overflow-y-auto py-4 space-y-1">
          <div className="px-3">
            <button
              onClick={() => setSelectedModule('all')}
              className={`w-full text-left px-4 py-2 text-sm font-medium transition-colors rounded-none ${selectedModule === 'all' ? 'border-l-2 border-brand-primary bg-bg-active text-white' : 'border-l-2 border-transparent text-gray-400 hover:bg-bg-active hover:text-gray-200'}`}
            >
              All Commands
            </button>
            <button
              onClick={() => setSelectedModule('favorites')}
              className={`w-full text-left px-4 py-2 mt-1 text-sm font-medium transition-colors flex items-center justify-between rounded-none ${selectedModule === 'favorites' ? 'border-l-2 border-brand-primary bg-bg-active text-white' : 'border-l-2 border-transparent text-gray-400 hover:bg-bg-active hover:text-gray-200'}`}
            >
              <span>Favorites</span>
              <Star className={`w-4 h-4 ${selectedModule === 'favorites' ? 'fill-white' : ''}`} />
            </button>
          </div>
          
          <div className="pt-6 pb-2">
            <p className="text-[11px] font-mono font-bold text-gray-500 uppercase tracking-[0.05em] px-7">Modules</p>
          </div>
          <div className="px-3 space-y-1">
            {modules.map(mod => (
              <button
                key={mod.id}
                onClick={() => setSelectedModule(mod.id)}
                className={`w-full text-left px-4 py-2 text-sm font-medium transition-colors rounded-none ${selectedModule === mod.id ? 'border-l-2 border-brand-primary bg-bg-active text-white' : 'border-l-2 border-transparent text-gray-400 hover:bg-bg-active hover:text-gray-200'}`}
              >
                {mod.name}
              </button>
            ))}
          </div>
        </nav>
        
        {/* Actions Footer */}
        <div className="p-4 border-t border-bg-active flex flex-col gap-2">
          <div className="flex gap-2">
            <button
              onClick={handleExportData}
              title="Export favorites & notes to clipboard"
              className="flex-1 px-2 py-2 flex items-center justify-center gap-1.5 text-[10px] font-mono font-bold uppercase tracking-wider transition-colors border bg-bg-surface border-bg-active text-gray-400 hover:text-brand-primary hover:border-brand-primary"
            >
              <Upload className="w-3.5 h-3.5" /> Export
            </button>
            <button
              onClick={handleImportData}
              title="Import favorites & notes from clipboard"
              className="flex-1 px-2 py-2 flex items-center justify-center gap-1.5 text-[10px] font-mono font-bold uppercase tracking-wider transition-colors border bg-bg-surface border-bg-active text-gray-400 hover:text-brand-primary hover:border-brand-primary"
            >
              <Download className="w-3.5 h-3.5" /> Import
            </button>
          </div>
          <button
            onClick={handleUpdate}
            disabled={isUpdating}
            className="w-full px-4 py-2 mt-1 text-xs font-mono font-bold uppercase tracking-wider transition-colors border bg-bg-surface border-brand-primary/20 text-brand-primary hover:bg-brand-primary/10 disabled:opacity-50"
          >
            {isUpdating ? 'Checking...' : 'Check for Updates'}
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden bg-bg-base relative">
        {/* Topbar */}
        <header className="bg-bg-surface border-b border-bg-active p-4 shrink-0 flex gap-4 items-center z-10">
          <div className="relative flex-1 group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500 group-focus-within:text-brand-primary transition-colors" />
            <input
              type="text"
              placeholder="Search commands, tools, descriptions..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-bg-base border border-bg-active rounded-none pl-12 pr-4 py-2.5 text-sm font-mono text-gray-200 placeholder-gray-500 focus:outline-none focus:border-b-2 focus:border-b-brand-primary focus:border-t-transparent focus:border-l-transparent focus:border-r-transparent transition-all"
            />
          </div>
          <select
            value={selectedPlatform}
            onChange={(e) => setSelectedPlatform(e.target.value)}
            className="bg-bg-base border border-bg-active rounded-none px-4 py-2.5 text-sm font-mono text-gray-300 focus:outline-none focus:border-brand-primary transition-colors cursor-pointer"
          >
            <option value="all">ALL PLATFORMS</option>
            <option value="linux">LINUX</option>
            <option value="windows">WINDOWS</option>
          </select>
        </header>

        {/* Filters & Tags */}
        {allTags.length > 0 && (
          <div className="bg-bg-base border-b border-bg-active px-6 py-3 shrink-0 flex flex-wrap gap-2">
            {allTags.map(tag => {
              const isSelected = selectedTags.includes(tag);
              return (
                <button
                  key={tag}
                  onClick={() => toggleTag(tag)}
                  className={`px-3 py-1 rounded-none text-[11px] font-mono font-bold tracking-[0.05em] uppercase transition-colors border ${
                    isSelected
                      ? 'bg-brand-primary/10 border-brand-primary text-brand-primary' 
                      : 'bg-bg-surface border-bg-active text-gray-400 hover:border-gray-500'
                  }`}
                >
                  {tag}
                </button>
              );
            })}
          </div>
        )}

        {/* List */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {filteredCommands.length === 0 ? (
            <div className="text-center py-20">
              <div className="font-mono text-gray-500">NO_RESULTS_FOUND</div>
              <p className="text-sm text-gray-600 mt-2">Adjust your filters or search query.</p>
            </div>
          ) : (
            Object.entries(
              filteredCommands.reduce((acc, cmd) => {
                const cat = cmd.category || 'Uncategorized';
                if (!acc[cat]) acc[cat] = [];
                acc[cat].push(cmd);
                return acc;
              }, {} as Record<string, CommandEntry[]>)
            ).map(([category, cmds]) => (
              <div key={category} className="mb-10">
                <div className="flex items-center gap-3 mb-6 mt-4">
                  <div className="w-1.5 h-1.5 bg-brand-primary rounded-none shadow-[0_0_8px_rgba(0,209,255,0.8)]"></div>
                  <h2 className="text-xl font-mono font-bold text-gray-100 uppercase tracking-[0.1em]">{category}</h2>
                  <div className="h-px bg-bg-active flex-1"></div>
                </div>
                <div className="flex flex-col gap-6">
                  {cmds.map(cmd => {
                    const isExpanded = expandedId === cmd.id;
                    const isFav = favorites.includes(cmd.id);

                    return (
                <div key={cmd.id} className="bg-bg-surface border border-bg-active rounded-none overflow-hidden hover:border-gray-600 transition-colors">
                  {/* Header Row */}
                  <div 
                    className="p-5 flex items-center gap-4 cursor-pointer hover:bg-bg-active/30 transition-colors"
                    onClick={() => setExpandedId(isExpanded ? null : cmd.id)}
                  >
                    <button 
                      onClick={(e) => { e.stopPropagation(); toggleFavorite(cmd.id); }}
                      className="shrink-0 p-1.5 hover:bg-bg-active rounded-none text-gray-500 hover:text-brand-alert transition-colors"
                    >
                      <Star className={`w-5 h-5 ${isFav ? 'fill-brand-alert text-brand-alert' : ''}`} />
                    </button>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-3 mb-1.5">
                        <h3 className="text-base font-bold text-white truncate tracking-tight">{cmd.title}</h3>
                        <span className="px-2 py-0.5 rounded-none bg-bg-active border border-bg-active text-gray-300 font-mono text-[11px] font-bold uppercase tracking-wider shrink-0">
                          {cmd.tool}
                        </span>
                      </div>
                      <p className="text-sm text-gray-400 truncate">{cmd.description}</p>
                    </div>

                    <ChevronRight className={`w-5 h-5 text-gray-500 shrink-0 transition-transform ${isExpanded ? 'rotate-90 text-brand-primary' : ''}`} />
                  </div>

                  {/* Detail View */}
                  {isExpanded && (
                    <div className="p-6 border-t border-bg-active bg-bg-base space-y-8">
                      
                      {/* Command Builder */}
                      <section>
                        <h4 className="font-mono text-[11px] font-bold text-gray-500 uppercase tracking-[0.05em] mb-3">Execute Command</h4>
                        <CommandBuilder entry={cmd} />
                      </section>

                      {/* Details */}
                      <section className="grid lg:grid-cols-2 gap-8">
                        <div>
                          <h4 className="font-mono text-[11px] font-bold text-gray-500 uppercase tracking-[0.05em] mb-3">Scenario / Context</h4>
                          <p className="text-sm text-gray-300 leading-relaxed">{cmd.when_to_use}</p>
                        </div>
                        {cmd.common_pitfalls && (
                          <div>
                            <h4 className="font-mono text-[11px] font-bold text-brand-alert uppercase tracking-[0.05em] mb-3 flex items-center gap-2">
                              <span className="w-1.5 h-1.5 bg-brand-alert rounded-none"></span>
                              Risk / Pitfalls
                            </h4>
                            <p className="text-sm text-brand-alert/90 leading-relaxed border-l-2 border-brand-alert pl-3">{cmd.common_pitfalls}</p>
                          </div>
                        )}
                      </section>

                      {/* Notes & Links Grid */}
                      <section className="grid lg:grid-cols-2 gap-8">
                        <div>
                          <h4 className="font-mono text-[11px] font-bold text-gray-500 uppercase tracking-[0.05em] mb-3 flex items-center gap-2">
                            <FileText className="w-3.5 h-3.5" /> Field Notes
                          </h4>
                          <textarea
                            value={notes[cmd.id] || ''}
                            onChange={(e) => setNote(cmd.id, e.target.value)}
                            placeholder="// Local scratchpad for flags, targets, or context..."
                            className="w-full h-24 bg-bg-surface border border-bg-active rounded-none p-3 text-sm font-mono text-gray-300 placeholder-gray-600 focus:outline-none focus:border-brand-primary focus:shadow-[0_0_8px_rgba(0,209,255,0.2)] resize-y transition-all"
                          />
                        </div>

                        {cmd.further_reading && cmd.further_reading.length > 0 && (
                          <div>
                            <h4 className="font-mono text-[11px] font-bold text-gray-500 uppercase tracking-[0.05em] mb-3">External Intel</h4>
                            <ul className="space-y-2">
                              {cmd.further_reading.map((ref, idx) => (
                                <li key={idx}>
                                  <a href={ref.url} target="_blank" rel="noreferrer" className="text-sm font-mono text-brand-primary hover:text-brand-primary/80 hover:underline flex items-center gap-2">
                                    <span className="text-gray-600">&gt;</span> {ref.label}
                                  </a>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </section>
                    </div>
                  )}
                </div>
              );
            })}
                </div>
              </div>
            ))
          )}
        </div>
      </main>
    </div>
  );
}

export default App;
