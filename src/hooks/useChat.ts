import { useState, useCallback } from "react";
import { Message, Ticket } from "@/types/ticket";

const generateId = () => Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

const WEBHOOK_URL = "https://flow.starbem.dev/webhook/0ff69ca2-9863-45a1-a0aa-aa9f8dde078c";

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
        console.log('Sending to webhook:', WEBHOOK_URL);
        console.log('Body:', { thread_id: threadId, message: content });
        
        const response = await fetch(WEBHOOK_URL, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            thread_id: threadId,
            message: content,
          }),
        });

        console.log('Response status:', response.status);
        
        if (response.ok) {
          const data = await response.json();
          console.log('Response data:', data);
          agentResponse = data.output || data.response || data.message || data.text || data.reply || data.answer || JSON.stringify(data);
        } else {
          console.error('Response error:', response.status);
          agentResponse = "Erro na resposta do servidor: " + response.status;
        }
      } catch (fetchError) {
        console.error('Fetch error:', fetchError);
        agentResponse = "Erro de conexão. Verifique o console.";
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
