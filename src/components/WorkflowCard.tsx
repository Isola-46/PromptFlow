import React, { useState } from 'react';
import { Copy, Check, Star, ExternalLink, ArrowRight, Layers } from 'lucide-react';
import { WorkflowPrompt } from '../types';
import { copyToClipboard } from '../utils/clipboard';

interface WorkflowCardProps {
  workflow: WorkflowPrompt;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  onSelect: (workflow: WorkflowPrompt) => void;
  onShowToast: (msg: string) => void;
}

export const WorkflowCard: React.FC<WorkflowCardProps> = ({
  workflow,
  isFavorite,
  onToggleFavorite,
  onSelect,
  onShowToast
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async (e: React.MouseEvent) => {
    e.stopPropagation();
    const success = await copyToClipboard(workflow.rawCopyableText);
    if (success) {
      setCopied(true);
      onShowToast(`Copied "${workflow.title}" master prompt!`);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div
      onClick={() => onSelect(workflow)}
      className="group relative flex flex-col justify-between p-6 bg-[#111726] border border-neutral-800 hover:border-neutral-700 rounded-xl transition-all duration-150 cursor-pointer text-left"
    >
      <div>
        {/* Unboxed metadata line with typographic separators */}
        <div className="flex items-center justify-between gap-3 text-xs text-neutral-400 mb-3">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-emerald-400">{workflow.categoryLabel}</span>
            <span aria-hidden="true" className="text-neutral-600">·</span>
            <span>{workflow.targetTools.slice(0, 3).join(', ')}</span>
            {workflow.stages && (
              <>
                <span aria-hidden="true" className="text-neutral-600">·</span>
                <span className="flex items-center gap-1">
                  <Layers className="w-3 h-3 text-neutral-500" />
                  {workflow.stages.length} Stages
                </span>
              </>
            )}
          </div>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite(workflow.id);
            }}
            title={isFavorite ? 'Remove from favorites' : 'Save to favorites'}
            className="p-1.5 text-neutral-500 hover:text-amber-400 transition-colors rounded hover:bg-neutral-800/60"
            aria-label={isFavorite ? 'Remove favorite' : 'Add favorite'}
          >
            <Star
              className={`w-4 h-4 ${isFavorite ? 'text-amber-400 fill-amber-400' : ''}`}
            />
          </button>
        </div>

        {/* Title & Subtitle */}
        <h3 className="text-base font-bold text-white tracking-tight group-hover:text-emerald-300 transition-colors line-clamp-1 mb-1">
          {workflow.title}
        </h3>
        <p className="text-xs text-neutral-400 line-clamp-1 mb-3">
          {workflow.subtitle}
        </p>

        {/* Description */}
        <p className="text-sm text-neutral-300 line-clamp-3 leading-relaxed mb-4">
          {workflow.description}
        </p>

        {/* Multi-Part Indicator with Hard Divider Lines */}
        {workflow.part1Prompt && workflow.part2Prompt && (
          <div className="mb-4 rounded-lg border border-neutral-700/80 bg-[#090e18] overflow-hidden text-[11px]">
            <div className="px-2.5 py-1 bg-neutral-900 border-b border-neutral-800 flex items-center justify-between text-[10px] font-bold text-neutral-400 uppercase">
              <span>{workflow.part3Prompt ? '3-Part Master Pipeline' : '2-Part Master Pipeline'}</span>
              <span className="text-emerald-400 font-mono">Hard-Delimited</span>
            </div>
            <div className={`grid ${workflow.part3Prompt ? 'grid-cols-3' : 'grid-cols-2'} text-center py-1.5 px-1 bg-neutral-950/60`}>
              <div className="px-1 text-emerald-400 font-medium truncate">
                <span className="font-bold">P1:</span> Script
              </div>
              <div className="px-1 text-cyan-400 font-medium truncate border-l border-neutral-700">
                <span className="font-bold">P2:</span> Sheets
              </div>
              {workflow.part3Prompt && (
                <div className="px-1 text-purple-400 font-medium truncate border-l border-neutral-700">
                  <span className="font-bold">P3:</span> {workflow.id.includes('stickman') ? 'Video' : 'Shots'}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      <div>
        {/* Best For Tags (plain text list) */}
        {workflow.bestFor && workflow.bestFor.length > 0 && (
          <div className="text-xs text-neutral-500 mb-4 truncate">
            <span className="text-neutral-400 font-medium">Use for:</span> {workflow.bestFor.join(', ')}
          </div>
        )}

        {/* Action Controls */}
        <div className="pt-4 border-t border-neutral-800/80 flex items-center justify-between gap-3">
          <button
            onClick={handleCopy}
            className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg transition-all duration-150 cursor-pointer ${
              copied
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                : 'bg-emerald-500 text-neutral-950 hover:bg-emerald-400'
            }`}
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>Copied!</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>Copy Master Prompt</span>
              </>
            )}
          </button>

          <button
            onClick={() => onSelect(workflow)}
            className="flex items-center gap-1.5 text-xs font-medium text-neutral-400 hover:text-white transition-colors py-2 px-2"
          >
            <span>View Workflow</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
};
