export interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface HealthTopic {
  id: string;
  title: string;
  icon: string;
  description: string;
  prompt: string;
}

export interface KnowledgeEntry {
  topic: string;
  keywords: string[];
  overview: string;
  symptoms?: string[];
  prevention?: string[];
  treatment?: string[];
  whenToSeek?: string;
  facts?: string[];
}
