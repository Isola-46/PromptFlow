import React, { useState } from 'react';
import { Copy, Check, Sparkles, Layers, ArrowRight, ExternalLink } from 'lucide-react';
import { WorkflowPrompt } from '../types';
import { copyToClipboard } from '../utils/clipboard';

interface FeaturedHeroProps {
  workflow: WorkflowPrompt;
  onOpenDetails: (workflow: WorkflowPrompt) => void;
  onShowToast: (msg: string) => void;
}

export const FeaturedHero: React.FC<FeaturedHeroProps> = ({
  workflow,
  onOpenDetails,
  onShowToast
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const success = await copyToClipboard(workflow.rawCopyableText);
    if (success) {
      setCopied(true);
      onShowToast('Master UGC Creative Director prompt copied! Paste into ChatGPT, Claude, or Gemini.');
      setTimeout(() => setCopied(false), 2200);
    }
  };

  return (
    <section className="relative overflow-hidden rounded-2xl bg-gradient-to-b from-[#131b2e] to-[#0d121f] border border-neutral-800 p-6 sm:p-8 shadow-xl">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-8">
        {/* Left Side: Editorial Pitch & Details */}
        <div className="max-w-2xl space-y-4">
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-400">
            <Sparkles className="w-4 h-4" />
            <span>FEATURED MASTER WORKFLOW</span>
            <span aria-hidden="true" className="text-neutral-600">·</span>
            <span className="text-neutral-400 font-normal">Ready for Omni Flash & Social Ads</span>
          </div>

          <h1 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-white tracking-tight leading-tight">
            UGC AD CREATIVE DIRECTOR
          </h1>

          <p className="text-sm sm:text-base text-neutral-300 leading-relaxed">
            Directs, designs, scripts, and splits your entire UGC ad into ~10-second Omni Flash video prompts across 6 structured stages. Includes 16:9 Character, Product & Location turnaround sheets plus 10 viral hooks.
          </p>

          {/* Quick Stage Progression Preview */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-2 text-xs">
            <div className="p-2.5 rounded-lg bg-[#0a0e17]/80 border border-neutral-800">
              <span className="text-emerald-400 font-mono font-bold">Stage 1-3</span>
              <p className="text-neutral-300 font-medium mt-0.5">Character, Product & Location 16:9 Sheets</p>
            </div>
            <div className="p-2.5 rounded-lg bg-[#0a0e17]/80 border border-neutral-800">
              <span className="text-emerald-400 font-mono font-bold">Stage 4-5</span>
              <p className="text-neutral-300 font-medium mt-0.5">10 Ad Concepts + Custom Video Duration</p>
            </div>
            <div className="p-2.5 rounded-lg bg-[#0a0e17]/80 border border-neutral-800 col-span-2 sm:col-span-1">
              <span className="text-emerald-400 font-mono font-bold">Stage 6</span>
              <p className="text-neutral-300 font-medium mt-0.5">Omni Flash ~10s Video Prompts + Continuity</p>
            </div>
          </div>

          {/* Primary Action Row */}
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
              <span>Inspect All 6 Stages & Prompt Box</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
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
