import { useState, useCallback } from "react";
import { Message, Ticket } from "@/types/ticket";
import { supabase } from "@/integrations/supabase/client";

const generateId = () => Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

export function useChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [threadId] = useState(() => generateId());
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);

  const createOrUpdateTicket = useCallback((userMessage: Message, agentMessage?: Message) => {
    setTickets(prevTickets => {
      const existingTicket = prevTickets[0];
      
      if (existingTicket && existingTicket.status !== 'resolved') {
        const updatedMessages = agentMessage 
          ? [...existingTicket.messages, userMessage, agentMessage]
          : [...existingTicket.messages, userMessage];
          
        return [
          {
            ...existingTicket,
            messages: updatedMessages,
            updatedAt: new Date(),
            status: 'pending' as const,
          },
          ...prevTickets.slice(1)
        ];
      } else {
        const newTicket: Ticket = {
          id: generateId(),
          customerName: "Cliente WhatsApp",
          customerPhone: "+55 (11) 99999-9999",
          subject: userMessage.content.slice(0, 50) + (userMessage.content.length > 50 ? "..." : ""),
          status: 'open',
          priority: 'medium',
          messages: agentMessage ? [userMessage, agentMessage] : [userMessage],
          createdAt: new Date(),
          updatedAt: new Date(),
        };
        
        return [newTicket, ...prevTickets];
      }
    });
  }, []);

  const sendMessage = useCallback(async (content: string) => {
    const userMessage: Message = {
      id: generateId(),
      content,
      sender: 'user',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setIsLoading(true);

    try {
      let agentResponse = "Obrigado pela sua mensagem! Estou aqui para ajudar.";
      
      try {
        console.log('Sending via edge function with thread_id:', threadId);
        
        const { data, error } = await supabase.functions.invoke('webhook-proxy', {
          body: {
            thread_id: threadId,
            message: content,
          },
        });

        if (error) {
          console.error('Edge function error:', error);
          agentResponse = "Erro ao conectar com o serviço.";
        } else {
          console.log('Response data:', data);
          agentResponse = data.output || data.response || data.message || data.text || data.reply || data.answer || JSON.stringify(data);
        }
      } catch (fetchError) {
        console.error('Request error:', fetchError);
        agentResponse = "Erro de conexão.";
      }

      const agentMessage: Message = {
        id: generateId(),
        content: agentResponse,
        sender: 'agent',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, agentMessage]);
      createOrUpdateTicket(userMessage, agentMessage);
      
      setTickets(prev => {
        if (prev.length > 0) {
          setSelectedTicketId(prev[0].id);
        }
        return prev;
      });

    } catch (error) {
      console.error('Error:', error);
    } finally {
      setIsLoading(false);
    }
  }, [threadId, createOrUpdateTicket]);

  return {
    messages,
    tickets,
    isLoading,
    sendMessage,
    selectedTicketId,
    setSelectedTicketId,
  };
}
