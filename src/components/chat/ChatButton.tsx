import { MessageCircle } from "lucide-react";
import { cn } from "@/lib/utils";

interface ChatButtonProps {
  onClick: () => void;
  hasUnread?: boolean;
}

export function ChatButton({ onClick, hasUnread }: ChatButtonProps) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "fixed bottom-6 right-6 w-14 h-14 rounded-full",
        "bg-whatsapp-green text-primary-foreground shadow-lg",
        "hover:bg-whatsapp-green/90 hover:scale-105",
        "transition-all duration-200",
        "flex items-center justify-center",
        "z-40"
      )}
    >
      <MessageCircle className="w-6 h-6" />
      {hasUnread && (
        <span className="absolute -top-1 -right-1 w-5 h-5 bg-destructive rounded-full flex items-center justify-center text-xs text-destructive-foreground font-medium">
          !
        </span>
      )}
    </button>
  );
}
