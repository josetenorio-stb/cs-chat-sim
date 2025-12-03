import { useState, useRef, useEffect } from "react";
import { X, Send, Phone, Video, MoreVertical, Smile, Paperclip, Mic } from "lucide-react";
import { Message } from "@/types/ticket";
import { ChatMessage } from "./ChatMessage";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

interface PhoneModalProps {
  isOpen: boolean;
  onClose: () => void;
  messages: Message[];
  onSendMessage: (content: string) => void;
  isLoading: boolean;
}

export function PhoneModal({
  isOpen,
  onClose,
  messages,
  onSendMessage,
  isLoading,
}: PhoneModalProps) {
  const [inputValue, setInputValue] = useState("");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (inputValue.trim() && !isLoading) {
      onSendMessage(inputValue.trim());
      setInputValue("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-end p-4 bg-foreground/20 backdrop-blur-sm">
      <div className="relative animate-bounce-in">
        {/* Phone Frame */}
        <div className="w-[375px] h-[750px] bg-foreground rounded-[3rem] p-3 shadow-2xl">
          <div className="w-full h-full bg-whatsapp-bg rounded-[2.5rem] overflow-hidden flex flex-col">
            {/* Status Bar */}
            <div className="h-8 bg-whatsapp-header flex items-center justify-between px-6 text-primary-foreground text-xs">
              <span>9:41</span>
              <div className="flex gap-1">
                <span>📶</span>
                <span>🔋</span>
              </div>
            </div>
            
            {/* WhatsApp Header */}
            <div className="bg-whatsapp-header px-4 py-3 flex items-center gap-3">
              <button 
                onClick={onClose}
                className="text-primary-foreground hover:bg-primary-foreground/10 p-1 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
              
              <div className="w-10 h-10 rounded-full bg-primary-foreground/20 flex items-center justify-center">
                <span className="text-primary-foreground font-medium">AI</span>
              </div>
              
              <div className="flex-1">
                <p className="text-primary-foreground font-medium text-sm">Assistente IA</p>
                <p className="text-primary-foreground/70 text-xs">online</p>
              </div>
              
              <div className="flex items-center gap-4">
                <Video className="w-5 h-5 text-primary-foreground" />
                <Phone className="w-5 h-5 text-primary-foreground" />
                <MoreVertical className="w-5 h-5 text-primary-foreground" />
              </div>
            </div>
            
            {/* Chat Background */}
            <div 
              className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-thin"
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
              }}
            >
              {messages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <div className="w-16 h-16 rounded-full bg-whatsapp-green/10 flex items-center justify-center mb-4">
                    <Send className="w-8 h-8 text-whatsapp-green" />
                  </div>
                  <p className="text-muted-foreground text-sm">
                    Envie uma mensagem para iniciar a conversa
                  </p>
                </div>
              ) : (
                <>
                  {messages.map((message) => (
                    <ChatMessage
                      key={message.id}
                      content={message.content}
                      sender={message.sender}
                      timestamp={message.timestamp}
                    />
                  ))}
                  {isLoading && (
                    <ChatMessage
                      content=""
                      sender="agent"
                      timestamp={new Date()}
                      isLoading
                    />
                  )}
                </>
              )}
              <div ref={messagesEndRef} />
            </div>
            
            {/* Input Area */}
            <div className="bg-whatsapp-bg border-t border-border p-2">
              <div className="flex items-center gap-2">
                <button className="p-2 text-muted-foreground hover:text-foreground transition-colors">
                  <Smile className="w-6 h-6" />
                </button>
                <button className="p-2 text-muted-foreground hover:text-foreground transition-colors">
                  <Paperclip className="w-6 h-6" />
                </button>
                
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="Digite uma mensagem"
                  className="flex-1 bg-card border-0 rounded-full"
                  disabled={isLoading}
                />
                
                {inputValue.trim() ? (
                  <button
                    onClick={handleSend}
                    disabled={isLoading}
                    className="w-10 h-10 rounded-full bg-whatsapp-green flex items-center justify-center text-primary-foreground hover:bg-whatsapp-green/90 transition-colors disabled:opacity-50"
                  >
                    <Send className="w-5 h-5" />
                  </button>
                ) : (
                  <button className="w-10 h-10 rounded-full bg-whatsapp-green flex items-center justify-center text-primary-foreground hover:bg-whatsapp-green/90 transition-colors">
                    <Mic className="w-5 h-5" />
                  </button>
                )}
              </div>
            </div>
            
            {/* Home Indicator */}
            <div className="h-8 bg-whatsapp-bg flex items-center justify-center">
              <div className="w-32 h-1 bg-foreground/20 rounded-full" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
