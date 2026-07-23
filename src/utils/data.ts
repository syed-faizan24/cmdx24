import { readDir, readTextFile, BaseDirectory, exists } from '@tauri-apps/plugin-fs';
import { resolveResource } from '@tauri-apps/api/path';
import type { CommandEntry, ModuleEntry } from '../types';

declare global {
  interface Window {
    __TAURI_INTERNALS__?: unknown;
  }
}
const isTauri = typeof window !== 'undefined' && window.__TAURI_INTERNALS__ !== undefined;

export async function loadAppData(): Promise<{ modules: ModuleEntry[], commands: CommandEntry[] }> {
  if (isTauri) {
    try {
      // 1. Check for OTA downloaded bundle in AppLocalData
      const hasUpdate = await exists('bundle.json', { baseDir: BaseDirectory.AppLocalData });
      if (hasUpdate) {
        try {
          const bundleData = await readTextFile('bundle.json', { baseDir: BaseDirectory.AppLocalData });
          const parsed = JSON.parse(bundleData);
          if (parsed.modules && parsed.commands) {
            console.log('Loaded OTA update bundle.');
            return { modules: parsed.modules, commands: parsed.commands };
          }
        } catch (e) {
          console.error('Failed to parse updated bundle, falling back to bundled resources.', e);
        }
      }

      // 2. Fall back to bundled resources
      const modulesPath = await resolveResource('content/modules.json');
      const modulesRaw = await readTextFile(modulesPath);
      const modules = JSON.parse(modulesRaw) as ModuleEntry[];

      const commandsDir = await resolveResource('content/commands');
      const dirEntries = await readDir(commandsDir);
      
      const commands: CommandEntry[] = [];
      for (const entry of dirEntries) {
        if (entry.isFile && entry.name?.endsWith('.json')) {
          const filePath = await resolveResource(`content/commands/${entry.name}`);
          const content = await readTextFile(filePath);
          const parsed = JSON.parse(content);
          if (Array.isArray(parsed)) {
            commands.push(...parsed);
          } else {
            commands.push(parsed as CommandEntry);
          }
        }
      }

      return { modules, commands };
    } catch (e) {
      console.error('Failed to load data via Tauri FS:', e);
      return { modules: [], commands: [] };
    }
  } else {
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
      console.error('Failed to load local dev data:', e);
      return { modules: [], commands: [] };
    }
  }
}
