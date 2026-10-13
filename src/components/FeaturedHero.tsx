import React, { useState } from 'react';
import { Copy, Check, Sparkles, Layers, ArrowRight } from 'lucide-react';
import { WorkflowPrompt } from '../types';
import { copyToClipboard } from '../utils/clipboard';

interface FeaturedHeroProps {
  workflow: WorkflowPrompt;
  featuredList?: WorkflowPrompt[];
  activeWorkflowId?: string;
  onSelectWorkflowId?: (id: string) => void;
  onOpenDetails: (workflow: WorkflowPrompt) => void;
  onShowToast: (msg: string) => void;
}

export const FeaturedHero: React.FC<FeaturedHeroProps> = ({
  workflow,
  featuredList,
  activeWorkflowId,
  onSelectWorkflowId,
  onOpenDetails,
  onShowToast
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const textToCopy = workflow.rawCopyableText || workflow.masterPromptText;
    const success = await copyToClipboard(textToCopy);
    if (success) {
      setCopied(true);
      onShowToast(`Master prompt for "${workflow.title}" copied! Paste into ChatGPT, Claude, or Gemini.`);
      setTimeout(() => setCopied(false), 2200);
    }
  };

  return (
    <section className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-[#131b2e] to-[#0d121f] border border-neutral-800 p-6 sm:p-8 shadow-xl">
      {/* Featured Workflow Switcher Tabs */}
      {featuredList && featuredList.length > 1 && onSelectWorkflowId && (
        <div className="flex flex-wrap items-center gap-2 mb-6 pb-4 border-b border-neutral-800/80">
          <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mr-1">
            Featured Master Prompts:
          </span>
          {featuredList.map((item) => {
            const isActive = (activeWorkflowId || workflow.id) === item.id;
            return (
              <button
                key={item.id}
                onClick={() => onSelectWorkflowId(item.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                  isActive
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-sm'
                    : 'bg-neutral-800/60 text-neutral-400 hover:text-neutral-200 hover:bg-neutral-800 border border-transparent'
                }`}
              >
                {item.title}
              </button>
            );
          })}
        </div>
      )}

      <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-8">
        {/* Left Side: Editorial Pitch & Details */}
        <div className="max-w-2xl space-y-4">
          <div className="flex flex-wrap items-center gap-2 text-xs font-semibold text-emerald-400">
            <Sparkles className="w-4 h-4" />
            <span>FEATURED MASTER WORKFLOW</span>
            <span aria-hidden="true" className="text-neutral-600">·</span>
            <span className="text-neutral-400 font-normal">{workflow.categoryLabel}</span>
            <span aria-hidden="true" className="text-neutral-600">·</span>
            <span className="text-neutral-400 font-normal">Ready for {workflow.targetTools.join(', ')}</span>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight leading-tight">
            {workflow.title}
          </h1>

          <p className="text-sm sm:text-base text-neutral-300 leading-relaxed">
            {workflow.description}
          </p>

          {/* Quick Stage Progression Preview */}
          {workflow.stages && workflow.stages.length > 0 && (
            <div className={`grid grid-cols-1 ${workflow.stages.length >= 3 ? 'sm:grid-cols-3' : 'sm:grid-cols-2'} gap-2.5 pt-2 text-xs`}>
              {workflow.stages.slice(0, 3).map((stage) => (
                <div key={stage.stageNumber} className="p-2.5 rounded-lg bg-[#0a0e17]/80 border border-neutral-800">
                  <span className="text-emerald-400 font-mono font-bold">Stage {stage.stageNumber}: {stage.name}</span>
                  <p className="text-neutral-300 font-medium mt-0.5 line-clamp-2">{stage.userGets || stage.aiAsks}</p>
                </div>
              ))}
            </div>
          )}

          {/* Multi-Part Pipeline Preview with Hard Divider Lines */}
          {workflow.part1Prompt && workflow.part2Prompt && (
            <div className="rounded-xl border border-neutral-700/80 bg-[#070b14] overflow-hidden">
              <div className="px-3.5 py-1.5 bg-neutral-900 border-b border-neutral-800 flex items-center justify-between text-xs font-semibold text-neutral-300">
                <span className="uppercase tracking-wider text-[11px] text-neutral-400">
                  {workflow.part3Prompt ? '3-Part Pipeline Flow' : '2-Part Pipeline Flow'}
                </span>
                <span className="text-emerald-400 font-mono text-[11px]">Hard-Delimited Stages</span>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3">
                <div className="p-3 bg-neutral-950/40 space-y-0.5">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase text-emerald-400 tracking-wider">Part 1</span>
                    <span className="text-[9px] text-neutral-500 uppercase">Input: Topic</span>
                  </div>
                  <p className="text-xs font-bold text-white">Story Scriptwriter</p>
                  <p className="text-[11px] text-neutral-400 line-clamp-1">Viral retention narration</p>
                </div>

                <div className="p-3 bg-neutral-950/40 space-y-0.5 border-t md:border-t-0 md:border-l-2 border-neutral-700">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black uppercase text-cyan-400 tracking-wider">Part 2</span>
                    <span className="text-[9px] text-neutral-500 uppercase">Input: Story</span>
                  </div>
                  <p className="text-xs font-bold text-white">5 Character Sheets</p>
                  <p className="text-[11px] text-neutral-400 line-clamp-1">Turnaround views & expressions</p>
                </div>

                {workflow.part3Prompt && (
                  <div className="p-3 bg-neutral-950/40 space-y-0.5 border-t md:border-t-0 md:border-l-2 border-neutral-700">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-black uppercase text-purple-400 tracking-wider">Part 3</span>
                      <span className="text-[9px] text-neutral-500 uppercase">Input: Script</span>
                    </div>
                    <p className="text-xs font-bold text-white">10s Video Prompts</p>
                    <p className="text-[11px] text-neutral-400 line-clamp-1">Omni Flesh shot-by-shot</p>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Primary Action Row */}
          {workflow.part1Prompt && workflow.part2Prompt ? (
            <div className="flex flex-wrap items-center gap-2.5 pt-4">
              <button
                onClick={async () => {
                  if (workflow.part1Prompt) {
                    await copyToClipboard(workflow.part1Prompt);
                    onShowToast('Part 1 (Story Scriptwriter) copied! Paste into ChatGPT or Claude.');
                  }
                }}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-neutral-850 hover:bg-neutral-700 text-emerald-300 border border-emerald-500/40 shadow-sm transition-all cursor-pointer"
              >
                <Copy className="w-4 h-4 text-emerald-400" />
                <span>Copy Part 1: Story Script</span>
              </button>

              <button
                onClick={async () => {
                  if (workflow.part2Prompt) {
                    await copyToClipboard(workflow.part2Prompt);
                    onShowToast('Part 2 (5 Stickman Character Sheets) copied! Paste story to generate sheets.');
                  }
                }}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-neutral-850 hover:bg-neutral-700 text-cyan-300 border border-cyan-500/40 shadow-sm transition-all cursor-pointer"
              >
                <Copy className="w-4 h-4 text-cyan-400" />
                <span>Copy Part 2: Character Sheets</span>
              </button>

              {workflow.part3Prompt && (
                <button
                  onClick={async () => {
                    if (workflow.part3Prompt) {
                      await copyToClipboard(workflow.part3Prompt);
                      onShowToast('Part 3 (Omni Flesh 10-Second Video Prompts) copied! Paste into ChatGPT or Claude.');
                    }
                  }}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold bg-neutral-850 hover:bg-neutral-700 text-purple-300 border border-purple-500/40 shadow-sm transition-all cursor-pointer"
                >
                  <Copy className="w-4 h-4 text-purple-400" />
                  <span>Copy Part 3: Video Prompts</span>
                </button>
              )}

              <button
                onClick={handleCopy}
                className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all shadow-md cursor-pointer ${
                  copied
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    : 'bg-emerald-400 text-neutral-950 hover:bg-emerald-300'
                }`}
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span>{workflow.part3Prompt ? 'All 3 Parts Copied!' : 'Both Parts Copied!'}</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>Copy Complete Suite</span>
                  </>
                )}
              </button>

              <button
                onClick={() => onOpenDetails(workflow)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-neutral-200 bg-neutral-800/80 hover:bg-neutral-700 transition-colors border border-neutral-700/80 cursor-pointer"
              >
                <Layers className="w-4 h-4" />
                <span>Inspect Stages & Prompts</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ) : (
            <div className="flex flex-wrap items-center gap-3 pt-4">
              <button
                onClick={handleCopy}
                className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all shadow-md cursor-pointer ${
                  copied
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                    : 'bg-emerald-400 text-neutral-950 hover:bg-emerald-300'
                }`}
              >
                {copied ? (
                  <>
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span>Master Prompt Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-4 h-4" />
                    <span>Copy Master Prompt (1-Click)</span>
                  </>
                )}
              </button>

              <button
                onClick={() => onOpenDetails(workflow)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs sm:text-sm font-semibold text-neutral-200 bg-neutral-800/80 hover:bg-neutral-700 transition-colors border border-neutral-700/80 cursor-pointer"
              >
                <Layers className="w-4 h-4" />
                <span>
                  {workflow.stages && workflow.stages.length > 0
                    ? `Inspect All ${workflow.stages.length} Stages & Prompt Box`
                    : 'Inspect Full Prompt & Details'}
                </span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}
        </div>

        {/* Right Side: Quick Instruction Card & Quick Launch */}
        <div className="lg:max-w-sm w-full p-5 rounded-xl bg-[#090d16] border border-neutral-800 space-y-4">
          <div className="text-xs font-bold uppercase tracking-wider text-neutral-400 flex items-center justify-between">
            <span>Fast 3-Step Handoff</span>
            <span className="text-emerald-400 font-mono">01 → 02 → 03</span>
          </div>

          <div className="space-y-3 text-xs text-neutral-300">
            <div className="flex items-start gap-2.5">
              <span className="flex items-center justify-center w-5 h-5 rounded bg-emerald-500/10 text-emerald-400 font-mono font-bold text-[11px] shrink-0">
                1
              </span>
              <span>Click green button to copy the prompt between green & red bars.</span>
            </div>
            <div className="flex items-start gap-2.5">
              <span className="flex items-center justify-center w-5 h-5 rounded bg-emerald-500/10 text-emerald-400 font-mono font-bold text-[11px] shrink-0">
                2
              </span>
              <span>Open a new chat in ChatGPT, Claude, or Gemini.</span>
            </div>
            <div className="flex items-start gap-2.5">
              <span className="flex items-center justify-center w-5 h-5 rounded bg-emerald-500/10 text-emerald-400 font-mono font-bold text-[11px] shrink-0">
                3
              </span>
              <span>Paste & send. The AI will ask Stage 1 first question immediately.</span>
            </div>
          </div>

          <div className="pt-3 border-t border-neutral-800/80">
            <div className="text-[11px] text-neutral-500 font-medium mb-2">Direct Open Links:</div>
            <div className="grid grid-cols-3 gap-2 text-xs">
              <a
                href="https://chatgpt.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-1 py-1.5 px-2 bg-neutral-800/80 hover:bg-neutral-700 text-neutral-300 rounded text-center transition-colors"
              >
                ChatGPT
              </a>
              <a
                href="https://claude.ai/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-1 py-1.5 px-2 bg-neutral-800/80 hover:bg-neutral-700 text-neutral-300 rounded text-center transition-colors"
              >
                Claude
              </a>
              <a
                href="https://gemini.google.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-1 py-1.5 px-2 bg-neutral-800/80 hover:bg-neutral-700 text-neutral-300 rounded text-center transition-colors"
              >
                Gemini
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

