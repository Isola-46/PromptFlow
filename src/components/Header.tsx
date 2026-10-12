import React from 'react';
import { Plus, Sparkles } from 'lucide-react';

interface HeaderProps {
  activeTab: string;
  onSelectTab: (tab: string) => void;
  onOpenAddModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  onSelectTab,
  onOpenAddModal
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#0b0f19]/90 backdrop-blur-md border-b border-neutral-800">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-8 px-6 py-4">
        {/* Zone 1: Single text element wordmark */}
        <button
          onClick={() => onSelectTab('all')}
          className="text-lg font-bold tracking-tight text-white whitespace-nowrap shrink-0 flex items-center gap-2 text-left cursor-pointer hover:opacity-90 transition-opacity"
        >
          <span className="p-1 rounded bg-emerald-500/10 text-emerald-400">
            <Sparkles className="w-4 h-4" />
          </span>
          <span>PromptFlow</span>
        </button>

        {/* Zone 2: 4–5 clean single-line text navigation links */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-neutral-400">
          <button
            onClick={() => onSelectTab('all')}
            className={`whitespace-nowrap shrink-0 transition-colors hover:text-white cursor-pointer ${
              activeTab === 'all' ? 'text-white' : ''
            }`}
          >
            All Workflows
          </button>
          <button
            onClick={() => onSelectTab('ugc-ads')}
            className={`whitespace-nowrap shrink-0 transition-colors hover:text-white cursor-pointer ${
              activeTab === 'ugc-ads' ? 'text-white' : ''
            }`}
          >
            UGC Director
          </button>
          <button
            onClick={() => onSelectTab('motion-3d')}
            className={`whitespace-nowrap shrink-0 transition-colors hover:text-white cursor-pointer ${
              activeTab === 'motion-3d' ? 'text-white' : ''
            }`}
          >
            3D Motion
          </button>
          <button
            onClick={() => onSelectTab('image-generation')}
            className={`whitespace-nowrap shrink-0 transition-colors hover:text-white cursor-pointer ${
              activeTab === 'image-generation' ? 'text-white' : ''
            }`}
          >
            Image Prompts
          </button>
          <button
            onClick={() => onSelectTab('favorites')}
            className={`whitespace-nowrap shrink-0 transition-colors hover:text-white cursor-pointer ${
              activeTab === 'favorites' ? 'text-white' : ''
            }`}
          >
            Favorites
          </button>
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={onOpenAddModal}
            className="flex items-center gap-2 px-3.5 py-2 text-xs font-semibold text-neutral-950 bg-emerald-400 rounded-lg hover:bg-emerald-300 transition-colors whitespace-nowrap shrink-0 cursor-pointer shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Workflow</span>
          </button>
        </div>
      </div>
    </header>
  );
};
