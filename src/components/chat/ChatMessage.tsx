import { cn } from "@/lib/utils";
import { Check, CheckCheck } from "lucide-react";

interface ChatMessageProps {
  content: string;
  sender: 'user' | 'agent';
  timestamp: Date;
  isLoading?: boolean;
}

export function ChatMessage({ content, sender, timestamp, isLoading }: ChatMessageProps) {
  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  return (
    <div
      className={cn(
        "flex animate-bounce-in",
        sender === 'user' ? "justify-end" : "justify-start"
      )}
    >
      <div
        className={cn(
          "max-w-[80%] px-3 py-2 rounded-lg shadow-sm",
          sender === 'user'
            ? "bg-whatsapp-bubble-out rounded-tr-none"
            : "bg-whatsapp-bubble-in rounded-tl-none"
        )}
      >
        {isLoading ? (
          <div className="flex gap-1 py-2 px-1">
            <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
            <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
            <span className="w-2 h-2 bg-muted-foreground/50 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
          </div>
        ) : (
          <>
            <p className="text-sm text-foreground whitespace-pre-wrap">{content}</p>
            <div className={cn(
              "flex items-center gap-1 mt-1",
              sender === 'user' ? "justify-end" : "justify-start"
            )}>
              <span className="text-[10px] text-muted-foreground">{formatTime(timestamp)}</span>
              {sender === 'user' && (
                <CheckCheck className="w-3 h-3 text-cs-primary" />
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
