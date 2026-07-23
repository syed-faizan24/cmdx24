import { create } from 'zustand';

interface AppState {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  
  selectedPlatform: string;
  setSelectedPlatform: (platform: string) => void;
  
  selectedModule: string;
  setSelectedModule: (moduleId: string) => void;
  
  selectedTags: string[];
  toggleTag: (tag: string) => void;

  favorites: string[];
  toggleFavorite: (id: string) => void;
  setFavorites: (favorites: string[]) => void;

  notes: Record<string, string>;
  setNote: (id: string, note: string) => void;
  setNotes: (notes: Record<string, string>) => void;
}

export const useStore = create<AppState>((set) => ({
  searchQuery: '',
  setSearchQuery: (query) => set({ searchQuery: query }),
  
  selectedPlatform: 'all',
  setSelectedPlatform: (platform) => set({ selectedPlatform: platform }),
  
  selectedModule: 'all',
  setSelectedModule: (moduleId) => set({ selectedModule: moduleId }),
  
  selectedTags: [],
  toggleTag: (tag) => set((state) => ({
    selectedTags: state.selectedTags.includes(tag)
      ? state.selectedTags.filter(t => t !== tag)
      : [...state.selectedTags, tag]
  })),

  favorites: [],
  toggleFavorite: (id) => set((state) => ({
    favorites: state.favorites.includes(id)
      ? state.favorites.filter(f => f !== id)
      : [...state.favorites, id]
  })),
  setFavorites: (favorites) => set({ favorites }),

  notes: {},
  setNote: (id, note) => set((state) => ({
    notes: { ...state.notes, [id]: note }
  })),
  setNotes: (notes) => set({ notes })
}));
