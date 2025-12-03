export interface Message {
  id: string;
  content: string;
  sender: 'user' | 'agent';
  timestamp: Date;
}

export interface Ticket {
  id: string;
  customerName: string;
  customerPhone: string;
  subject: string;
  status: 'open' | 'pending' | 'resolved';
  priority: 'low' | 'medium' | 'high';
  messages: Message[];
  createdAt: Date;
  updatedAt: Date;
}

export interface WebhookConfig {
  url: string;
  enabled: boolean;
}
