import { readTextFile, BaseDirectory, exists } from '@tauri-apps/plugin-fs';
import type { CommandEntry, ModuleEntry } from '../types';

declare global {
  interface Window {
    __TAURI_INTERNALS__?: unknown;
  }
}
const isTauri = typeof window !== 'undefined' && window.__TAURI_INTERNALS__ !== undefined;

export async function loadAppData(): Promise<{ modules: ModuleEntry[], commands: CommandEntry[] }> {
  // 1. Check for OTA downloaded bundle in AppLocalData (only if running inside Tauri)
  if (isTauri) {
    try {
      const hasUpdate = await exists('bundle.json', { baseDir: BaseDirectory.AppLocalData });
      if (hasUpdate) {
        const bundleData = await readTextFile('bundle.json', { baseDir: BaseDirectory.AppLocalData });
        const parsed = JSON.parse(bundleData);
        if (parsed.modules && parsed.commands) {
          console.log('Loaded OTA update bundle.');
          return { modules: parsed.modules, commands: parsed.commands };
        }
      }
    } catch (e) {
      console.error('Failed to parse updated bundle, falling back to static resources.', e);
    }
  }

  // 2. Fall back to statically bundled Vite resources (Works flawlessly in Browser & Tauri Prod)
  try {
    const modulesData = (await import('../../content/modules.json')).default as ModuleEntry[];
    const commandModules = import.meta.glob('../../content/commands/*.json', { eager: true });
    
    const commandsData: CommandEntry[] = [];
    Object.values(commandModules).forEach((mod: any) => {
      if (Array.isArray(mod.default)) {
        commandsData.push(...mod.default);
      } else {
        commandsData.push(mod.default);
      }
    });
    
    return { modules: modulesData, commands: commandsData };
  } catch (e) {
    console.error('Failed to load local static data:', e);
    return { modules: [], commands: [] };
  }
}
