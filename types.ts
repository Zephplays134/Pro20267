
export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  imageUrl?: string;
  shipName?: string;
  timestamp: Date;
}

export interface GeneratedShip {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  createdAt: Date;
}

export enum GenerationStatus {
  IDLE = 'IDLE',
  THINKING = 'THINKING',
  GENERATING_IMAGE = 'GENERATING_IMAGE',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}
