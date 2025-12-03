import { useState } from "react";
import { CSDashboard } from "@/components/cs/CSDashboard";
import { PhoneModal } from "@/components/chat/PhoneModal";
import { ChatButton } from "@/components/chat/ChatButton";
import { useChat } from "@/hooks/useChat";
import { Helmet } from "react-helmet";

const Index = () => {
  const [isChatOpen, setIsChatOpen] = useState(false);
  const {
    messages,
    tickets,
    isLoading,
    webhookUrl,
    setWebhookUrl,
    sendMessage,
    selectedTicketId,
    setSelectedTicketId,
  } = useChat();

  return (
    <>
      <Helmet>
        <title>CS Platform - Customer Success Management</title>
        <meta name="description" content="Plataforma de Customer Success com integração de chat WhatsApp e agente IA" />
      </Helmet>
      
      <div className="h-screen w-full flex overflow-hidden">
        {/* CS Dashboard - Left Side */}
        <div className="flex-1 h-full">
          <CSDashboard
            tickets={tickets}
            selectedTicketId={selectedTicketId}
            onSelectTicket={setSelectedTicketId}
          />
        </div>
        
        {/* Chat Button */}
        <ChatButton 
          onClick={() => setIsChatOpen(true)}
          hasUnread={messages.length > 0 && !isChatOpen}
        />
        
        {/* Phone Modal - Right Side */}
        <PhoneModal
          isOpen={isChatOpen}
          onClose={() => setIsChatOpen(false)}
          messages={messages}
          onSendMessage={sendMessage}
          isLoading={isLoading}
          webhookUrl={webhookUrl}
          onWebhookChange={setWebhookUrl}
        />
      </div>
    </>
  );
};

export default Index;
