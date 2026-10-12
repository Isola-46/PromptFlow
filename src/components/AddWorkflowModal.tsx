import React, { useState } from 'react';
import { X, Plus, Sparkles } from 'lucide-react';
import { WorkflowCategory, WorkflowPrompt } from '../types';

interface AddWorkflowModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddWorkflow: (workflow: WorkflowPrompt) => void;
}

export const AddWorkflowModal: React.FC<AddWorkflowModalProps> = ({
  isOpen,
  onClose,
  onAddWorkflow
}) => {
  const [title, setTitle] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [category, setCategory] = useState<WorkflowCategory>('ugc-ads');
  const [description, setDescription] = useState('');
  const [targetTools, setTargetTools] = useState('ChatGPT, Gemini, Claude');
  const [estimatedOutput, setEstimatedOutput] = useState('Custom Prompt Package');
  const [masterPromptText, setMasterPromptText] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !masterPromptText.trim()) return;

    const categoryLabels: Record<WorkflowCategory, string> = {
      all: 'General',
      'ugc-ads': 'AI UGC Ads',
      'image-generation': 'Image Generation',
      'motion-3d': 'AI 3D Motion Graphics',
      'video-ai': 'Video & Omni Flash'
    };

    const newWorkflow: WorkflowPrompt = {
      id: `custom-${Date.now()}`,
      title: title.trim(),
      subtitle: subtitle.trim() || 'Custom User Workflow',
      category,
      categoryLabel: categoryLabels[category] || 'Custom',
      description: description.trim() || 'Custom prompt workflow saved in PromptFlow.',
      targetTools: targetTools
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean),
      estimatedOutput: estimatedOutput.trim() || 'Generated Assets',
      bestFor: ['Custom Use Case'],
      howToUseSteps: [
        'Open a new chat in ChatGPT, Claude, or Gemini.',
        'Copy the text inside the prompt container.',
        'Paste and follow the workflow questions.'
      ],
      startCopyMarker: '▶  START COPYING HERE  ▶',
      stopCopyMarker: '■  STOP COPYING HERE  ■',
      masterPromptText: masterPromptText.trim(),
      rawCopyableText: masterPromptText.trim()
    };

    onAddWorkflow(newWorkflow);
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150"
    >
      <div
        className="relative w-full max-w-2xl bg-[#0d121f] border border-neutral-800 rounded-2xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-5 border-b border-neutral-800 bg-[#111726]">
          <div className="flex items-center gap-2">
            <span className="p-1 rounded bg-emerald-500/20 text-emerald-400">
              <Sparkles className="w-4 h-4" />
            </span>
            <h3 className="text-base font-bold text-white">Add New Workflow Prompt</h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 space-y-4 max-h-[80vh] overflow-y-auto">
          <div>
            <label className="block text-xs font-semibold text-neutral-300 mb-1">
              Workflow Title *
            </label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. 3D KINETIC TYPOGRAPHY DIRECTOR"
              className="w-full px-3 py-2 bg-neutral-950 border border-neutral-700 rounded-lg text-sm text-white focus:outline-none focus:border-emerald-400"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1">
                Category
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as WorkflowCategory)}
                className="w-full px-3 py-2 bg-neutral-950 border border-neutral-700 rounded-lg text-sm text-white focus:outline-none focus:border-emerald-400"
              >
                <option value="ugc-ads">AI UGC Ads</option>
                <option value="motion-3d">AI 3D Motion Graphics</option>
                <option value="image-generation">Image Generation</option>
                <option value="video-ai">Video & Omni Flash</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-neutral-300 mb-1">
                Target AI Platforms
              </label>
              <input
                type="text"
                value={targetTools}
                onChange={(e) => setTargetTools(e.target.value)}
                placeholder="ChatGPT, Gemini, Claude"
                className="w-full px-3 py-2 bg-neutral-950 border border-neutral-700 rounded-lg text-sm text-white focus:outline-none focus:border-emerald-400"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-300 mb-1">
              Short Subtitle / Hook
            </label>
            <input
              type="text"
              value={subtitle}
              onChange={(e) => setSubtitle(e.target.value)}
              placeholder="e.g. Cinema 4D Abstract Motion Loop Director"
              className="w-full px-3 py-2 bg-neutral-950 border border-neutral-700 rounded-lg text-sm text-white focus:outline-none focus:border-emerald-400"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-300 mb-1">
              Description
            </label>
            <textarea
              rows={2}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe what this workflow accomplishes and how it behaves..."
              className="w-full px-3 py-2 bg-neutral-950 border border-neutral-700 rounded-lg text-sm text-white focus:outline-none focus:border-emerald-400"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-neutral-300 mb-1">
              Master Prompt Text *
            </label>
            <textarea
              required
              rows={8}
              value={masterPromptText}
              onChange={(e) => setMasterPromptText(e.target.value)}
              placeholder="Paste the full master prompt instructions here..."
              className="w-full px-3 py-2 bg-neutral-950 border border-neutral-700 rounded-lg text-xs font-mono text-neutral-200 focus:outline-none focus:border-emerald-400"
            />
          </div>

          <div className="pt-3 border-t border-neutral-800 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-neutral-400 hover:text-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center gap-1.5 px-4 py-2 bg-emerald-400 text-neutral-950 rounded-lg hover:bg-emerald-300 font-bold text-xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Save Workflow</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
