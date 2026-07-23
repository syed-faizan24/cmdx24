import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';
import { writeText } from '@tauri-apps/plugin-clipboard-manager';

declare global {
  interface Window {
    __TAURI_INTERNALS__?: unknown;
  }
}
const isTauri = typeof window !== 'undefined' && window.__TAURI_INTERNALS__ !== undefined;

interface CommandBuilderProps {
  commandTemplate: string;
}

export const CommandBuilder: React.FC<CommandBuilderProps> = ({ commandTemplate }) => {
  const [values, setValues] = useState<Record<string, string>>({});
  const [copied, setCopied] = useState(false);

  // Extract placeholders like <target>, <wordlist>, etc.
  const placeholders = Array.from(new Set(
    Array.from(commandTemplate.matchAll(/<([^>]+)>/g)).map(m => m[1])
  ));

  const handleCopy = async () => {
    let finalCommand = commandTemplate;
    placeholders.forEach(p => {
      const val = values[p];
      if (val) {
        finalCommand = finalCommand.replace(new RegExp(`<${p}>`, 'g'), val);
      }
    });

    try {
      if (isTauri) {
        await writeText(finalCommand);
      } else {
        await navigator.clipboard.writeText(finalCommand);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.error('Failed to copy', e);
    }
  };

  // Render the command with interactive highlights
  const renderPreview = () => {
    const parts = commandTemplate.split(/(<[^>]+>)/g);
    return parts.map((part, idx) => {
      const match = part.match(/<([^>]+)>/);
      if (match) {
        const p = match[1];
        const val = values[p];
        return (
          <span key={idx} className={val ? 'text-brand-primary font-bold' : 'text-gray-500 bg-bg-active/50 px-1 rounded-none border border-bg-active/50'}>
            {val || part}
          </span>
        );
      }
      return <span key={idx} className="text-gray-200">{part}</span>;
    });
  };

  return (
    <div className="bg-bg-surface border border-bg-active rounded-none overflow-hidden">
      <div className="bg-bg-base p-5 border-b border-bg-active flex justify-between items-start gap-4">
        <code className="font-mono text-sm break-all leading-relaxed flex-1">
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

      {placeholders.length > 0 && (
        <div className="p-5 bg-bg-surface">
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
        </div>
      )}
    </div>
  );
};
