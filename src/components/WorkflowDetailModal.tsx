import React, { useState } from 'react';
import {
  X,
  Copy,
  Check,
  ExternalLink,
  Layers,
  Sparkles,
  Sliders,
  FileText,
  HelpCircle,
  Star,
  Terminal,
  ArrowUpRight
} from 'lucide-react';
import { WorkflowPrompt } from '../types';
import { copyToClipboard } from '../utils/clipboard';

interface WorkflowDetailModalProps {
  workflow: WorkflowPrompt | null;
  onClose: () => void;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  onShowToast: (msg: string) => void;
}

export const WorkflowDetailModal: React.FC<WorkflowDetailModalProps> = ({
  workflow,
  onClose,
  isFavorite,
  onToggleFavorite,
  onShowToast
}) => {
  if (!workflow) return null;

  const [activeTab, setActiveTab] = useState<'prompt' | 'workflow' | 'document' | 'customize' | 'subprompts'>('prompt');
  const [copiedMaster, setCopiedMaster] = useState(false);
  const [copiedFull, setCopiedFull] = useState(false);
  const [copiedSub, setCopiedSub] = useState<number | null>(null);

  // Variable customizer state
  const [variables, setVariables] = useState<Record<string, string>>(() => {
    const init: Record<string, string> = {};
    workflow.customizableVariables?.forEach((v) => {
      init[v.key] = v.defaultValue || '';
    });
    return init;
  });

  const getCustomizedPrompt = () => {
    let text = workflow.masterPromptText;
    Object.entries(variables).forEach(([key, val]) => {
      if (val.trim()) {
        text = text.replaceAll(`[${key}]`, val.trim());
      }
    });
    return text;
  };

  const handleCopyMaster = async () => {
    const textToCopy = workflow.rawCopyableText;
    const success = await copyToClipboard(textToCopy);
    if (success) {
      setCopiedMaster(true);
      onShowToast('Master prompt copied to clipboard! Paste directly into ChatGPT, Claude, or Gemini.');
      setTimeout(() => setCopiedMaster(false), 2200);
    }
  };

  const handleCopyFullDocument = async () => {
    const textToCopy = workflow.fullDocumentText || workflow.rawCopyableText;
    const success = await copyToClipboard(textToCopy);
    if (success) {
      setCopiedFull(true);
      onShowToast('Complete workflow document copied to clipboard!');
      setTimeout(() => setCopiedFull(false), 2200);
    }
  };

  const handleCopyCustomized = async () => {
    const textToCopy = getCustomizedPrompt();
    const success = await copyToClipboard(textToCopy);
    if (success) {
      setCopiedMaster(true);
      onShowToast('Customized prompt copied to clipboard!');
      setTimeout(() => setCopiedMaster(false), 2200);
    }
  };

  const handleCopySubPrompt = async (content: string, index: number, title: string) => {
    const success = await copyToClipboard(content);
    if (success) {
      setCopiedSub(index);
      onShowToast(`Copied "${title}" to clipboard!`);
      setTimeout(() => setCopiedSub(null), 2000);
    }
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150"
    >
      <div
        className="relative flex flex-col w-full max-w-5xl max-h-[92vh] bg-[#0d121f] border border-neutral-800 rounded-2xl shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Top Header of Modal */}
        <div className="flex items-start justify-between gap-4 p-5 sm:p-6 border-b border-neutral-800 bg-[#111726]">
          <div className="min-w-0">
            <div className="flex items-center gap-2 text-xs text-neutral-400 mb-1">
              <span className="font-semibold text-emerald-400">{workflow.categoryLabel}</span>
              <span aria-hidden="true" className="text-neutral-600">·</span>
              <span>{workflow.targetTools.join(', ')}</span>
              {workflow.stages && (
                <>
                  <span aria-hidden="true" className="text-neutral-600">·</span>
                  <span>{workflow.stages.length} Stages</span>
                </>
              )}
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight truncate">
              {workflow.title}
            </h2>
            <p className="text-xs sm:text-sm text-neutral-400 mt-1 line-clamp-1">
              {workflow.subtitle}
            </p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => onToggleFavorite(workflow.id)}
              className="p-2 text-neutral-400 hover:text-amber-400 rounded-lg hover:bg-neutral-800 transition-colors"
              title="Save to favorites"
              aria-label="Save to favorites"
            >
              <Star className={`w-5 h-5 ${isFavorite ? 'text-amber-400 fill-amber-400' : ''}`} />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800 transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Quick Launch & Action Strip */}
        <div className="flex flex-wrap items-center justify-between gap-3 px-5 sm:px-6 py-3 bg-[#0a0e17] border-b border-neutral-800/80">
          <div className="flex flex-wrap items-center gap-2">
            <button
              onClick={handleCopyMaster}
              className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-lg transition-all shadow-sm cursor-pointer ${
                copiedMaster
                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                  : 'bg-emerald-400 text-neutral-950 hover:bg-emerald-300'
              }`}
            >
              {copiedMaster ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>Master Prompt Copied!</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Copy Master Prompt (Inside Green/Red Bars)</span>
                </>
              )}
            </button>

            {workflow.fullDocumentText && (
              <button
                onClick={handleCopyFullDocument}
                className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-lg transition-all border cursor-pointer ${
                  copiedFull
                    ? 'bg-blue-500/20 text-blue-300 border-blue-500/40'
                    : 'bg-neutral-800 hover:bg-neutral-700 text-neutral-200 border-neutral-700'
                }`}
              >
                {copiedFull ? (
                  <>
                    <Check className="w-3.5 h-3.5 text-blue-400" />
                    <span>Entire Document Copied!</span>
                  </>
                ) : (
                  <>
                    <Copy className="w-3.5 h-3.5" />
                    <span>Copy Complete Document (With How-To & Stages)</span>
                  </>
                )}
              </button>
            )}
          </div>

          {/* Quick External Launch Links */}
          <div className="flex items-center gap-2 text-xs text-neutral-400">
            <span className="hidden sm:inline text-neutral-500 font-medium">Use in:</span>
            <a
              href="https://chatgpt.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 px-2.5 py-1.5 rounded bg-neutral-800/80 hover:bg-neutral-700 text-neutral-200 transition-colors"
            >
              <span>ChatGPT</span>
              <ArrowUpRight className="w-3 h-3 text-neutral-400" />
            </a>
            <a
              href="https://claude.ai/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 px-2.5 py-1.5 rounded bg-neutral-800/80 hover:bg-neutral-700 text-neutral-200 transition-colors"
            >
              <span>Claude</span>
              <ArrowUpRight className="w-3 h-3 text-neutral-400" />
            </a>
            <a
              href="https://gemini.google.com/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 px-2.5 py-1.5 rounded bg-neutral-800/80 hover:bg-neutral-700 text-neutral-200 transition-colors"
            >
              <span>Gemini</span>
              <ArrowUpRight className="w-3 h-3 text-neutral-400" />
            </a>
          </div>
        </div>

        {/* Modal Navigation Tabs */}
        <div className="flex items-center gap-1 px-5 sm:px-6 pt-3 border-b border-neutral-800 bg-[#0d121f]">
          <button
            onClick={() => setActiveTab('prompt')}
            className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold border-b-2 transition-colors cursor-pointer ${
              activeTab === 'prompt'
                ? 'border-emerald-400 text-emerald-400'
                : 'border-transparent text-neutral-400 hover:text-neutral-200'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            <span>Master Prompt Box</span>
          </button>

          {workflow.fullDocumentText && (
            <button
              onClick={() => setActiveTab('document')}
              className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold border-b-2 transition-colors cursor-pointer ${
                activeTab === 'document'
                  ? 'border-emerald-400 text-emerald-400'
                  : 'border-transparent text-neutral-400 hover:text-neutral-200'
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Full Document View</span>
            </button>
          )}

          {workflow.stages && workflow.stages.length > 0 && (
            <button
              onClick={() => setActiveTab('workflow')}
              className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold border-b-2 transition-colors cursor-pointer ${
                activeTab === 'workflow'
                  ? 'border-emerald-400 text-emerald-400'
                  : 'border-transparent text-neutral-400 hover:text-neutral-200'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Workflow at a Glance</span>
            </button>
          )}

          {workflow.customizableVariables && workflow.customizableVariables.length > 0 && (
            <button
              onClick={() => setActiveTab('customize')}
              className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold border-b-2 transition-colors cursor-pointer ${
                activeTab === 'customize'
                  ? 'border-emerald-400 text-emerald-400'
                  : 'border-transparent text-neutral-400 hover:text-neutral-200'
              }`}
            >
              <Sliders className="w-3.5 h-3.5" />
              <span>Customize Variables</span>
            </button>
          )}

          {workflow.subPrompts && workflow.subPrompts.length > 0 && (
            <button
              onClick={() => setActiveTab('subprompts')}
              className={`flex items-center gap-2 px-3.5 py-2 text-xs font-semibold border-b-2 transition-colors cursor-pointer ${
                activeTab === 'subprompts'
                  ? 'border-emerald-400 text-emerald-400'
                  : 'border-transparent text-neutral-400 hover:text-neutral-200'
              }`}
            >
              <Terminal className="w-3.5 h-3.5" />
              <span>Sub-Prompts & Templates</span>
            </button>
          )}
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
          {/* TAB 1: MASTER PROMPT BOX WITH EXACT GREEN/RED BARS */}
          {activeTab === 'prompt' && (
            <div className="space-y-6">
              {/* HOW TO USE GUIDE */}
              <div className="p-4 rounded-xl bg-neutral-900/60 border border-neutral-800">
                <div className="flex items-center gap-2 text-xs font-bold text-neutral-300 uppercase tracking-wider mb-2">
                  <HelpCircle className="w-4 h-4 text-emerald-400" />
                  <span>How to Use This Workflow</span>
                </div>
                <ol className="list-decimal list-inside space-y-1.5 text-xs sm:text-sm text-neutral-300">
                  {workflow.howToUseSteps.map((step, idx) => (
                    <li key={idx} className="leading-relaxed">
                      {step}
                    </li>
                  ))}
                </ol>
              </div>

              {/* BOUNDED COPY CONTAINER WITH GREEN TOP BAR AND RED BOTTOM BAR */}
              <div className="relative rounded-xl overflow-hidden border border-neutral-700/80 shadow-lg">
                {/* GREEN START COPYING BAR */}
                <div className="flex items-center justify-between px-4 py-2.5 bg-emerald-700 text-emerald-50 text-xs sm:text-sm font-bold tracking-wider uppercase select-none">
                  <div className="flex items-center gap-2">
                    <span className="text-base font-black">▶</span>
                    <span>{workflow.startCopyMarker}</span>
                  </div>
                  <button
                    onClick={handleCopyMaster}
                    className="flex items-center gap-1.5 px-3 py-1 bg-white text-emerald-950 rounded hover:bg-emerald-100 transition-colors text-xs font-bold shadow-sm cursor-pointer"
                  >
                    {copiedMaster ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedMaster ? 'COPIED!' : 'COPY MASTER PROMPT'}</span>
                  </button>
                </div>

                {/* THE MASTER PROMPT TEXT BOX */}
                <div className="relative bg-[#090d16] p-4 sm:p-6 max-h-[500px] overflow-y-auto font-mono text-xs sm:text-[13px] leading-relaxed text-neutral-200 select-all border-x border-neutral-800">
                  <pre className="whitespace-pre-wrap font-mono break-words">
                    {workflow.masterPromptText}
                  </pre>
                </div>

                {/* RED STOP COPYING BAR */}
                <div className="flex items-center justify-between px-4 py-2.5 bg-rose-800 text-rose-50 text-xs sm:text-sm font-bold tracking-wider uppercase select-none">
                  <div className="flex items-center gap-2">
                    <span className="text-base font-black">■</span>
                    <span>{workflow.stopCopyMarker}</span>
                  </div>
                  <span className="text-[11px] font-semibold text-rose-200 tracking-normal normal-case">
                    Stop copying here — paste everything above into your AI chat
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* TAB: FULL DOCUMENT VIEW */}
          {activeTab === 'document' && workflow.fullDocumentText && (
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 rounded-lg bg-neutral-900 border border-neutral-800 text-xs">
                <span className="text-neutral-300">
                  Entire raw workflow document exactly as specified (including How to Use, Overview, and Delimited Master Prompt).
                </span>
                <button
                  onClick={handleCopyFullDocument}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-500 hover:bg-blue-400 text-neutral-950 font-bold rounded text-xs transition-colors cursor-pointer shrink-0"
                >
                  {copiedFull ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copiedFull ? 'Copied Document!' : 'Copy Full Document'}</span>
                </button>
              </div>

              <div className="p-5 rounded-xl bg-[#090d16] border border-neutral-800 font-mono text-xs sm:text-[13px] leading-relaxed text-neutral-200 overflow-y-auto max-h-[550px] select-all">
                <pre className="whitespace-pre-wrap font-mono break-words">
                  {workflow.fullDocumentText}
                </pre>
              </div>
            </div>
          )}

          {/* TAB 2: WORKFLOW AT A GLANCE (STAGES) */}
          {activeTab === 'workflow' && workflow.stages && (
            <div className="space-y-4">
              <div className="text-xs text-neutral-400 mb-2">
                This workflow guides you through {workflow.stages.length} distinct stages. The AI asks one question at a time and creates locked assets.
              </div>

              <div className="border border-neutral-800 rounded-xl overflow-hidden divide-y divide-neutral-800">
                {/* Table Header */}
                <div className="grid grid-cols-12 gap-4 px-4 py-3 bg-[#111726] text-xs font-bold text-neutral-300">
                  <div className="col-span-2 sm:col-span-1">Stage</div>
                  <div className="col-span-5 sm:col-span-4">What the AI asks you</div>
                  <div className="col-span-5 sm:col-span-7">What you get</div>
                </div>

                {/* Stages List */}
                {workflow.stages.map((stage) => (
                  <div
                    key={stage.stageNumber}
                    className="grid grid-cols-12 gap-4 px-4 py-3.5 text-xs sm:text-sm hover:bg-[#111726]/40 transition-colors items-start"
                  >
                    <div className="col-span-2 sm:col-span-1 font-mono font-bold text-emerald-400">
                      {stage.stageNumber}
                    </div>
                    <div className="col-span-5 sm:col-span-4 font-medium text-white">
                      {stage.aiAsks}
                    </div>
                    <div className="col-span-5 sm:col-span-7 text-neutral-300 leading-relaxed">
                      {stage.userGets}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 3: CUSTOMIZE VARIABLES */}
          {activeTab === 'customize' && workflow.customizableVariables && (
            <div className="space-y-6">
              <div className="p-4 rounded-xl bg-neutral-900/60 border border-neutral-800">
                <h4 className="text-sm font-bold text-white mb-1">Pre-Fill Variables</h4>
                <p className="text-xs text-neutral-400 mb-4">
                  Optionally replace placeholders with your own brand and product specifications before copying.
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {workflow.customizableVariables.map((v) => (
                    <div key={v.key} className="space-y-1.5">
                      <label className="text-xs font-semibold text-neutral-300">
                        {v.label}
                      </label>
                      <input
                        type="text"
                        value={variables[v.key] || ''}
                        onChange={(e) =>
                          setVariables({ ...variables, [v.key]: e.target.value })
                        }
                        placeholder={v.placeholder}
                        className="w-full px-3 py-2 bg-neutral-950 border border-neutral-700 rounded-lg text-xs sm:text-sm text-white focus:outline-none focus:border-emerald-400"
                      />
                    </div>
                  ))}
                </div>

                <div className="mt-4 pt-4 border-t border-neutral-800 flex justify-end">
                  <button
                    onClick={handleCopyCustomized}
                    className="flex items-center gap-2 px-4 py-2 bg-emerald-400 text-neutral-950 rounded-lg hover:bg-emerald-300 transition-colors text-xs font-bold cursor-pointer"
                  >
                    {copiedMaster ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>Copy Pre-Filled Master Prompt</span>
                  </button>
                </div>
              </div>

              {/* Live Preview */}
              <div className="border border-neutral-800 rounded-xl overflow-hidden">
                <div className="px-4 py-2 bg-neutral-900 text-xs font-semibold text-neutral-400">
                  Live Preview with Injected Values
                </div>
                <div className="p-4 bg-[#090d16] font-mono text-xs text-neutral-300 max-h-72 overflow-y-auto">
                  <pre className="whitespace-pre-wrap">{getCustomizedPrompt()}</pre>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: SUB-PROMPTS & TEMPLATES */}
          {activeTab === 'subprompts' && workflow.subPrompts && (
            <div className="space-y-4">
              <p className="text-xs text-neutral-400">
                Directly copy individual image sheet prompts or video format blocks without running the full chat director.
              </p>

              {workflow.subPrompts.map((sub, idx) => (
                <div
                  key={idx}
                  className="p-4 bg-[#111726] border border-neutral-800 rounded-xl space-y-3"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <h4 className="text-sm font-bold text-white">{sub.title}</h4>
                      <p className="text-xs text-neutral-400">{sub.description}</p>
                    </div>
                    <button
                      onClick={() => handleCopySubPrompt(sub.content, idx, sub.title)}
                      className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                        copiedSub === idx
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                          : 'bg-neutral-800 hover:bg-neutral-700 text-neutral-200'
                      }`}
                    >
                      {copiedSub === idx ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Copied!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5" />
                          <span>Copy Snippet</span>
                        </>
                      )}
                    </button>
                  </div>

                  <div className="bg-[#090d16] p-3 rounded-lg font-mono text-xs text-neutral-300 overflow-x-auto border border-neutral-800/80">
                    <pre className="whitespace-pre-wrap font-mono">{sub.content}</pre>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
