export type WorkflowCategory = 
  | 'all'
  | 'ugc-ads'
  | 'image-generation'
  | 'motion-3d'
  | 'video-ai';

export interface WorkflowStage {
  stageNumber: number | string;
  name: string;
  aiAsks: string;
  userGets: string;
  description?: string;
}

export interface PromptVariable {
  key: string;
  label: string;
  placeholder: string;
  defaultValue?: string;
  description?: string;
}

export interface WorkflowPrompt {
  id: string;
  title: string;
  subtitle: string;
  category: WorkflowCategory;
  categoryLabel: string;
  description: string;
  targetTools: string[]; // e.g. ['ChatGPT', 'Gemini', 'Claude', 'Omni Flash']
  isFeatured?: boolean;
  howToUseSteps: string[];
  stages?: WorkflowStage[];
  startCopyMarker: string;
  stopCopyMarker: string;
  masterPromptText: string;
  rawCopyableText: string;
  fullDocumentText?: string;
  subPrompts?: {
    title: string;
    description: string;
    content: string;
  }[];
  customizableVariables?: PromptVariable[];
  estimatedOutput: string;
  bestFor: string[];
}
