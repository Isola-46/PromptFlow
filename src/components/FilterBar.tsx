import React from 'react';
import { Search, X, Sparkles, Video, Box, Image, Film, Star } from 'lucide-react';
import { WorkflowCategory } from '../types';

interface FilterBarProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedCategory: WorkflowCategory | 'favorites';
  onCategoryChange: (category: WorkflowCategory | 'favorites') => void;
  favoritesCount: number;
  totalCount: number;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onCategoryChange,
  favoritesCount,
  totalCount
}) => {
  const categories: { id: WorkflowCategory | 'favorites'; label: string; icon: React.ReactNode }[] = [
    { id: 'all', label: 'All Workflows', icon: <Sparkles className="w-3.5 h-3.5" /> },
    { id: 'ugc-ads', label: 'AI UGC Ads', icon: <Video className="w-3.5 h-3.5" /> },
    { id: 'motion-3d', label: 'AI 3D Motion Graphics', icon: <Box className="w-3.5 h-3.5" /> },
    { id: 'image-generation', label: 'Image Generation', icon: <Image className="w-3.5 h-3.5" /> },
    { id: 'video-ai', label: 'Video & Omni Flash', icon: <Film className="w-3.5 h-3.5" /> },
    {
      id: 'favorites',
      label: `Favorites (${favoritesCount})`,
      icon: <Star className="w-3.5 h-3.5" />
    }
  ];

  return (
    <div className="space-y-4">
      {/* Search & Count Bar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-lg">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search prompts by keyword, stage, or tool (e.g. Omni Flash, 3D, Character)..."
            className="w-full pl-10 pr-9 py-2.5 bg-[#111726] border border-neutral-800 rounded-xl text-xs sm:text-sm text-white placeholder-neutral-500 focus:outline-none focus:border-neutral-700 transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-neutral-500 hover:text-white"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        <div className="text-xs text-neutral-400 self-end sm:self-center font-mono tabular-nums">
          Showing <span className="text-white font-semibold">{totalCount}</span> workflows
        </div>
      </div>

      {/* Segmented Category Buttons */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
        {categories.map((cat) => {
          const isActive = selectedCategory === cat.id;
          return (
            <button
              key={cat.id}
              onClick={() => onCategoryChange(cat.id)}
              className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap shrink-0 cursor-pointer ${
                isActive
                  ? 'bg-neutral-100 text-neutral-900 shadow-sm'
                  : 'bg-[#111726] text-neutral-400 hover:text-white hover:bg-neutral-800/80 border border-neutral-800/80'
              }`}
            >
              <span className={isActive ? 'text-neutral-900' : 'text-neutral-400'}>
                {cat.icon}
              </span>
              <span>{cat.label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
