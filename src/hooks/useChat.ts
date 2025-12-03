import { useState, useCallback } from "react";
import { Message, Ticket } from "@/types/ticket";

const generateId = () => Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);

export function useChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [webhookUrl, setWebhookUrl] = useState("https://flow.starbem.dev/webhook-test/0ff69ca2-9863-45a1-a0aa-aa9f8dde078c");
  const [selectedTicketId, setSelectedTicketId] = useState<string | null>(null);

  const createOrUpdateTicket = useCallback((userMessage: Message, agentMessage?: Message) => {
    setTickets(prevTickets => {
      const existingTicket = prevTickets[0]; // Simplificado: sempre usa o primeiro ticket ativo
      
      if (existingTicket && existingTicket.status !== 'resolved') {
        // Atualiza ticket existente
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
        // Cria novo ticket
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
      let agentResponse = "Obrigado pela sua mensagem! Estou aqui para ajudar. Como posso auxiliá-lo?";
      
      if (webhookUrl) {
        try {
          const response = await fetch(webhookUrl, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              message: content,
              timestamp: new Date().toISOString(),
              sender: 'user',
            }),
          });

          if (response.ok) {
            const data = await response.json();
            agentResponse = data.response || data.message || data.output || agentResponse;
          }
        } catch (webhookError) {
          console.error('Webhook error:', webhookError);
          agentResponse = "Desculpe, houve um problema ao processar sua mensagem. Por favor, tente novamente.";
        }
      }

      // Simula delay da resposta
      await new Promise(resolve => setTimeout(resolve, 1000));

      const agentMessage: Message = {
        id: generateId(),
        content: agentResponse,
        sender: 'agent',
        timestamp: new Date(),
      };

      setMessages(prev => [...prev, agentMessage]);
      createOrUpdateTicket(userMessage, agentMessage);
      
      // Seleciona o ticket mais recente
      setTickets(prev => {
        if (prev.length > 0) {
          setSelectedTicketId(prev[0].id);
        }
        return prev;
      });

    } catch (error) {
      console.error('Error sending message:', error);
    } finally {
      setIsLoading(false);
    }
  }, [webhookUrl, createOrUpdateTicket]);

  return {
    messages,
    tickets,
    isLoading,
    webhookUrl,
    setWebhookUrl,
    sendMessage,
    selectedTicketId,
    setSelectedTicketId,
  };
}
