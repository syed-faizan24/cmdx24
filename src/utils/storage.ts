import { Store, load } from '@tauri-apps/plugin-store';

declare global {
  interface Window {
    __TAURI_INTERNALS__?: unknown;
  }
}

let tauriStore: Store | null = null;
const isTauri = typeof window !== 'undefined' && window.__TAURI_INTERNALS__ !== undefined;

export async function initStorage() {
  if (isTauri) {
    try {
      tauriStore = await load('store.json', { autoSave: false, defaults: {} } as any);
    } catch (e) {
      console.error('Failed to init Tauri store:', e);
    }
  }
}

export async function saveFavorites(favorites: string[]) {
  if (isTauri && tauriStore) {
    await tauriStore.set('favorites', favorites);
    await tauriStore.save();
  } else {
    localStorage.setItem('favorites', JSON.stringify(favorites));
  }
}

export async function loadFavorites(): Promise<string[]> {
  if (isTauri && tauriStore) {
    const val = await tauriStore.get<string[]>('favorites');
    return val || [];
  } else {
    const val = localStorage.getItem('favorites');
    return val ? JSON.parse(val) : [];
  }
}

export async function saveNotes(notes: Record<string, string>) {
  if (isTauri && tauriStore) {
    await tauriStore.set('notes', notes);
    await tauriStore.save();
  } else {
    localStorage.setItem('notes', JSON.stringify(notes));
  }
}

export async function loadNotes(): Promise<Record<string, string>> {
  if (isTauri && tauriStore) {
    const val = await tauriStore.get<Record<string, string>>('notes');
    return val || {};
  } else {
    const val = localStorage.getItem('notes');
    return val ? JSON.parse(val) : {};
  }
}
