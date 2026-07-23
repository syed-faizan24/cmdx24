import React, { useState } from 'react';
import { Copy, Check, Info } from 'lucide-react';
import { writeText } from '@tauri-apps/plugin-clipboard-manager';
import { useStore } from '../store/useStore';
import type { CommandEntry } from '../types';

declare global {
  interface Window {
    __TAURI_INTERNALS__?: unknown;
  }
}
const isTauri = typeof window !== 'undefined' && window.__TAURI_INTERNALS__ !== undefined;

interface CommandBuilderProps {
  entry: CommandEntry;
}

export const CommandBuilder: React.FC<CommandBuilderProps> = ({ entry }) => {
  const [values, setValues] = useState<Record<string, string>>({});
  const [activeFlags, setActiveFlags] = useState<Set<string>>(new Set());
  const [copied, setCopied] = useState(false);
  const { addToast } = useStore();

  // Extract placeholders like <target>, <wordlist>, etc.
  const placeholders = Array.from(new Set(
    Array.from(entry.command.matchAll(/<([^>]+)>/g)).map(m => m[1])
  ));

  const toggleFlag = (flag: string) => {
    setActiveFlags(prev => {
      const next = new Set(prev);
      if (next.has(flag)) next.delete(flag);
      else next.add(flag);
      return next;
    });
  };

  const getFinalCommand = () => {
    let finalCommand = entry.command;
    
    // Inject optional flags
    if (entry.optional_flags && activeFlags.size > 0) {
      const flagsStr = Array.from(activeFlags).join(' ');
      if (finalCommand.includes('[FLAGS]')) {
        finalCommand = finalCommand.replace('[FLAGS]', flagsStr);
      } else {
        if (finalCommand.includes('<')) {
          finalCommand = finalCommand.replace('<', flagsStr + ' <');
        } else {
          finalCommand += ' ' + flagsStr;
        }
      }
    } else {
      finalCommand = finalCommand.replace('[FLAGS] ', '').replace(' [FLAGS]', '').replace('[FLAGS]', '');
    }

    placeholders.forEach(p => {
      const val = values[p];
      if (val) {
        finalCommand = finalCommand.replace(new RegExp(`<${p}>`, 'g'), val);
      }
    });

    return finalCommand.trim();
  };

  const handleCopy = async () => {
    const finalCommand = getFinalCommand();
    try {
      if (isTauri) {
        await writeText(finalCommand);
      } else {
        await navigator.clipboard.writeText(finalCommand);
      }
      setCopied(true);
      addToast('Command copied to clipboard!', 'success');
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.error('Failed to copy', e);
      addToast('Failed to copy command.', 'error');
    }
  };

  const renderPreview = () => {
    const finalCommand = getFinalCommand();
    const tokens = finalCommand.split(' ');
    
    return tokens.map((token, idx) => {
      const match = token.match(/<([^>]+)>/);
      if (match) {
        const p = match[1];
        const val = values[p];
        return (
          <span key={idx} className={val ? 'text-brand-primary font-bold' : 'text-gray-500 bg-bg-active/50 px-1 rounded-none border border-bg-active/50'}>
            {token}
            {idx < tokens.length - 1 ? ' ' : ''}
          </span>
        );
      }

      let desc = '';
      if (entry.flag_descriptions && entry.flag_descriptions[token]) {
        desc = entry.flag_descriptions[token];
      } else if (entry.optional_flags) {
        const opt = entry.optional_flags.find(o => o.flag === token);
        if (opt) desc = opt.description;
      }

      if (desc) {
        return (
          <span key={idx} className="relative group cursor-help text-brand-secondary border-b border-dashed border-brand-secondary/50">
            {token}
            <div className="absolute bottom-full mb-2 left-1/2 -translate-x-1/2 hidden group-hover:block w-48 p-2 bg-bg-surface border border-bg-active text-gray-200 text-xs shadow-xl z-20 font-sans pointer-events-none text-center">
              {desc}
            </div>
            {idx < tokens.length - 1 ? ' ' : ''}
          </span>
        );
      }

      return <span key={idx} className="text-gray-200">{token}{idx < tokens.length - 1 ? ' ' : ''}</span>;
    });
  };

  return (
    <div className="bg-bg-surface border border-bg-active rounded-none overflow-visible relative">
      <div className="bg-bg-base p-5 border-b border-bg-active flex justify-between items-start gap-4">
        <code className="font-mono text-sm break-all leading-relaxed flex-1 whitespace-pre-wrap">
          {renderPreview()}
        </code>
        <button
          onClick={handleCopy}
          className={`flex-shrink-0 flex items-center gap-2 px-4 py-2 text-xs font-mono font-bold uppercase tracking-wider rounded-none transition-colors border ${
            copied 
              ? 'bg-brand-success/10 border-brand-success text-brand-success' 
              : 'bg-bg-active border-transparent text-gray-300 hover:border-gray-500'
          }`}
        >
          {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          {copied ? 'Copied' : 'Copy'}
        </button>
      </div>

      {(placeholders.length > 0 || (entry.optional_flags && entry.optional_flags.length > 0)) && (
        <div className="p-5 bg-bg-surface flex flex-col gap-6">
          {entry.optional_flags && entry.optional_flags.length > 0 && (
             <div>
               <h5 className="text-[11px] font-mono font-bold text-gray-500 uppercase tracking-[0.05em] mb-3 flex items-center gap-2">
                 <Info className="w-3.5 h-3.5" /> Optional Flags
               </h5>
               <div className="flex flex-wrap gap-3">
                 {entry.optional_flags.map(opt => (
                   <label key={opt.flag} className={`flex items-center gap-2 px-3 py-1.5 border rounded-none cursor-pointer transition-colors text-sm font-mono ${activeFlags.has(opt.flag) ? 'bg-brand-secondary/10 border-brand-secondary text-brand-secondary' : 'bg-bg-base border-bg-active text-gray-400 hover:border-gray-500'}`}>
                     <input type="checkbox" className="hidden" checked={activeFlags.has(opt.flag)} onChange={() => toggleFlag(opt.flag)} />
                     {opt.flag}
                   </label>
                 ))}
               </div>
             </div>
          )}

          {placeholders.length > 0 && (
            <div className="flex flex-wrap gap-5">
              {placeholders.map(p => (
                <div key={p} className="flex flex-col gap-2 flex-1 min-w-[240px]">
                  <label className="text-[11px] font-mono font-bold text-brand-primary uppercase tracking-[0.05em] flex items-center gap-2">
                    <span className="text-gray-500">&gt;</span> {p}
                  </label>
                  <input
                    type="text"
                    placeholder={`<${p}>`}
                    value={values[p] || ''}
                    onChange={(e) => setValues(prev => ({ ...prev, [p]: e.target.value }))}
                    className="bg-bg-base border border-bg-active rounded-none px-4 py-2 text-sm font-mono text-gray-200 placeholder-gray-600 focus:outline-none focus:border-brand-primary focus:shadow-[0_0_8px_rgba(0,209,255,0.2)] transition-all"
                  />
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
