import { BaseDirectory, readTextFile, writeTextFile, exists } from '@tauri-apps/plugin-fs';

export const GITHUB_BUNDLE_URL = 'https://raw.githubusercontent.com/YOUR_GITHUB_USERNAME/cmdx24/main/content/bundle.json';

const isTauri = typeof window !== 'undefined' && window.__TAURI_INTERNALS__ !== undefined;

export async function checkForUpdates(): Promise<boolean> {
  if (!isTauri) return false;

  try {
    const response = await fetch(GITHUB_BUNDLE_URL);
    if (!response.ok) {
      throw new Error(`Failed to fetch updates: ${response.status}`);
    }

    const remoteBundle = await response.json();
    
    // Check if we already have a bundle locally
    let localVersion = 0;
    const hasLocal = await exists('bundle.json', { baseDir: BaseDirectory.AppLocalData });
    if (hasLocal) {
      const localData = await readTextFile('bundle.json', { baseDir: BaseDirectory.AppLocalData });
      try {
        const parsed = JSON.parse(localData);
        localVersion = parsed.version || 0;
      } catch (e) {
        // Corrupt file, assume version 0
      }
    }

    if (remoteBundle.version && remoteBundle.version > localVersion) {
      // Save new bundle
      await writeTextFile('bundle.json', JSON.stringify(remoteBundle), { baseDir: BaseDirectory.AppLocalData });
      return true;
    }

    return false;
  } catch (error) {
    console.error('Update check failed (possibly offline):', error);
    return false;
  }
}
