/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { Header } from './components/Header';
import { FilterBar } from './components/FilterBar';
import { FeaturedHero } from './components/FeaturedHero';
import { WorkflowCard } from './components/WorkflowCard';
import { WorkflowDetailModal } from './components/WorkflowDetailModal';
import { AddWorkflowModal } from './components/AddWorkflowModal';
import { Toast } from './components/Toast';
import { INITIAL_WORKFLOWS } from './data/workflows';
import { WorkflowCategory, WorkflowPrompt } from './types';
import { Sparkles, FolderOpen } from 'lucide-react';

const FAVORITES_STORAGE_KEY = 'promptflow_favorites_v1';
const CUSTOM_WORKFLOWS_STORAGE_KEY = 'promptflow_custom_workflows_v1';

export default function App() {
  const [workflows, setWorkflows] = useState<WorkflowPrompt[]>(() => {
    try {
      const stored = localStorage.getItem(CUSTOM_WORKFLOWS_STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        const customOnly = parsed.filter((w: WorkflowPrompt) => w.id && w.id.startsWith('custom-'));
        return [...INITIAL_WORKFLOWS, ...customOnly];
      }
    } catch {
      // fallback to initial
    }
    return INITIAL_WORKFLOWS;
  });

  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem(FAVORITES_STORAGE_KEY);
      if (stored) return JSON.parse(stored);
    } catch {
      // fallback
    }
    return ['ultimate-stickman-animation-master', 'motion-graphic-creation-engine', 'ugc-creative-director'];
  });

  const [selectedCategory, setSelectedCategory] = useState<WorkflowCategory | 'favorites'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedWorkflow, setSelectedWorkflow] = useState<WorkflowPrompt | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync favorites to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(FAVORITES_STORAGE_KEY, JSON.stringify(favorites));
    } catch (e) {
      console.error(e);
    }
  }, [favorites]);

  const toggleFavorite = (id: string) => {
    setFavorites((prev) => {
      const exists = prev.includes(id);
      const next = exists ? prev.filter((item) => item !== id) : [...prev, id];
      showToast(exists ? 'Removed from favorites' : 'Saved to favorites');
      return next;
    });
  };

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => {
      setToastMessage((cur) => (cur === message ? null : cur));
    }, 2800);
  };

  const handleAddWorkflow = (newWorkflow: WorkflowPrompt) => {
    setWorkflows((prev) => {
      const updated = [newWorkflow, ...prev];
      try {
        const customOnly = updated.filter((w) => w.id.startsWith('custom-'));
        localStorage.setItem(CUSTOM_WORKFLOWS_STORAGE_KEY, JSON.stringify(customOnly));
      } catch (e) {
        console.error(e);
      }
      return updated;
    });
    showToast(`Added "${newWorkflow.title}" to your library!`);
    setSelectedWorkflow(newWorkflow);
  };

  const filteredWorkflows = useMemo(() => {
    return workflows.filter((w) => {
      // Category filter
      if (selectedCategory === 'favorites') {
        if (!favorites.includes(w.id)) return false;
      } else if (selectedCategory !== 'all') {
        if (w.category !== selectedCategory) return false;
      }

      // Search query filter
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = w.title.toLowerCase().includes(q);
        const matchesSubtitle = w.subtitle.toLowerCase().includes(q);
        const matchesDesc = w.description.toLowerCase().includes(q);
        const matchesTool = w.targetTools.some((t) => t.toLowerCase().includes(q));
        const matchesCategory = w.categoryLabel.toLowerCase().includes(q);
        return matchesTitle || matchesSubtitle || matchesDesc || matchesTool || matchesCategory;
      }

      return true;
    });
  }, [workflows, selectedCategory, searchQuery, favorites]);

  const [featuredWorkflowId, setFeaturedWorkflowId] = useState<string>('ultimate-stickman-animation-master');

  const featuredList = useMemo(() => {
    return workflows.filter((w) => w.isFeatured);
  }, [workflows]);

  const activeFeaturedWorkflow = useMemo(() => {
    return workflows.find((w) => w.id === featuredWorkflowId) || workflows[0];
  }, [workflows, featuredWorkflowId]);

  return (
    <div className="min-h-screen bg-[#0b0f19] text-neutral-100 flex flex-col font-sans selection:bg-emerald-500/30 selection:text-emerald-200">
      {/* 3-Zone Compliant Top Navigation Bar */}
      <Header
        activeTab={selectedCategory}
        onSelectTab={(tab) => setSelectedCategory(tab as WorkflowCategory | 'favorites')}
        onOpenAddModal={() => setIsAddModalOpen(true)}
      />

      {/* Main Viewport Content */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-8">
        {/* Spotlight Featured Master Workflow */}
        {selectedCategory === 'all' && !searchQuery && (
          <FeaturedHero
            workflow={activeFeaturedWorkflow}
            featuredList={featuredList}
            activeWorkflowId={featuredWorkflowId}
            onSelectWorkflowId={setFeaturedWorkflowId}
            onOpenDetails={(w) => setSelectedWorkflow(w)}
            onShowToast={showToast}
          />
        )}

        {/* Filter and Search Bar */}
        <FilterBar
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
          favoritesCount={favorites.length}
          totalCount={filteredWorkflows.length}
        />

        {/* Grid of Workflow Cards */}
        {filteredWorkflows.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredWorkflows.map((workflow) => (
              <WorkflowCard
                key={workflow.id}
                workflow={workflow}
                isFavorite={favorites.includes(workflow.id)}
                onToggleFavorite={toggleFavorite}
                onSelect={(w) => setSelectedWorkflow(w)}
                onShowToast={showToast}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 px-4 bg-[#111726]/50 border border-neutral-800 rounded-2xl max-w-lg mx-auto space-y-3">
            <div className="flex justify-center text-neutral-500">
              <FolderOpen className="w-10 h-10" />
            </div>
            <h3 className="text-base font-bold text-white">No workflows matched</h3>
            <p className="text-xs sm:text-sm text-neutral-400">
              Try adjusting your search keywords or clear filters to see all available prompt packages.
            </p>
            <button
              onClick={() => {
                setSearchQuery('');
                setSelectedCategory('all');
              }}
              className="inline-flex items-center gap-2 px-4 py-2 mt-2 text-xs font-semibold text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20 rounded-lg transition-colors cursor-pointer"
            >
              <span>Reset Filters</span>
            </button>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="mt-16 border-t border-neutral-800 bg-[#090d16] text-xs text-neutral-500 py-6 px-6">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
            <span className="font-semibold text-neutral-400">PromptFlow</span>
            <span>· One-Click AI Master Prompts & Workflows</span>
          </div>
          <div>Compatible with ChatGPT, Claude, Gemini & Omni Flash</div>
        </div>
      </footer>

      {/* Detailed Modal Viewer */}
      <WorkflowDetailModal
        workflow={selectedWorkflow}
        onClose={() => setSelectedWorkflow(null)}
        isFavorite={selectedWorkflow ? favorites.includes(selectedWorkflow.id) : false}
        onToggleFavorite={toggleFavorite}
        onShowToast={showToast}
      />

      {/* Add Custom Workflow Modal */}
      <AddWorkflowModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddWorkflow={handleAddWorkflow}
      />

      {/* Floating Status Notification Toast */}
      <Toast message={toastMessage} />
    </div>
  );
}
