import { Clock, User, MessageSquare } from "lucide-react";
import { Ticket } from "@/types/ticket";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";

interface TicketCardProps {
  ticket: Ticket;
  isSelected: boolean;
  onClick: () => void;
}

const statusConfig = {
  open: { label: 'Aberto', className: 'bg-status-open/10 text-status-open border-status-open/20' },
  pending: { label: 'Pendente', className: 'bg-status-pending/10 text-status-pending border-status-pending/20' },
  resolved: { label: 'Resolvido', className: 'bg-status-resolved/10 text-status-resolved border-status-resolved/20' },
};

const priorityConfig = {
  low: { label: 'Baixa', className: 'bg-muted text-muted-foreground' },
  medium: { label: 'Média', className: 'bg-status-open/10 text-status-open' },
  high: { label: 'Alta', className: 'bg-destructive/10 text-destructive' },
};

export function TicketCard({ ticket, isSelected, onClick }: TicketCardProps) {
  const status = statusConfig[ticket.status];
  const priority = priorityConfig[ticket.priority];
  const lastMessage = ticket.messages[ticket.messages.length - 1];
  
  const formatTime = (date: Date) => {
    return new Intl.DateTimeFormat('pt-BR', {
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  return (
    <div
      onClick={onClick}
      className={cn(
        "p-4 rounded-xl cursor-pointer transition-all duration-200 animate-slide-in",
        "border hover:shadow-md",
        isSelected 
          ? "bg-cs-primary-light border-cs-primary shadow-sm" 
          : "bg-card border-border hover:border-cs-primary/30"
      )}
    >
      <div className="flex items-start justify-between gap-3 mb-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
            <User className="w-4 h-4 text-muted-foreground" />
          </div>
          <div>
            <p className="font-medium text-sm text-foreground">{ticket.customerName}</p>
            <p className="text-xs text-muted-foreground">{ticket.customerPhone}</p>
          </div>
        </div>
        <Badge variant="outline" className={cn("text-xs", status.className)}>
          {status.label}
        </Badge>
      </div>
      
      <p className="font-medium text-sm text-foreground mb-2 line-clamp-1">
        {ticket.subject}
      </p>
      
      {lastMessage && (
        <p className="text-xs text-muted-foreground line-clamp-2 mb-3">
          {lastMessage.content}
        </p>
      )}
      
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Badge variant="secondary" className={cn("text-xs", priority.className)}>
            {priority.label}
          </Badge>
          <span className="flex items-center gap-1 text-xs text-muted-foreground">
            <MessageSquare className="w-3 h-3" />
            {ticket.messages.length}
          </span>
        </div>
        <span className="flex items-center gap-1 text-xs text-muted-foreground">
          <Clock className="w-3 h-3" />
          {formatTime(ticket.updatedAt)}
        </span>
      </div>
    </div>
  );
}
