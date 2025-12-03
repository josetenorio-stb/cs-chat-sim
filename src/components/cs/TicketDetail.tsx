import { User, Phone, Clock, Tag, MoreHorizontal } from "lucide-react";
import { Ticket } from "@/types/ticket";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface TicketDetailProps {
  ticket: Ticket | null;
}

const statusConfig = {
  open: { label: 'Aberto', className: 'bg-status-open/10 text-status-open border-status-open/20' },
  pending: { label: 'Pendente', className: 'bg-status-pending/10 text-status-pending border-status-pending/20' },
  resolved: { label: 'Resolvido', className: 'bg-status-resolved/10 text-status-resolved border-status-resolved/20' },
};

export function TicketDetail({ ticket }: TicketDetailProps) {
  if (!ticket) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-8">
        <div className="w-20 h-20 rounded-full bg-muted flex items-center justify-center mb-4">
          <Tag className="w-10 h-10 text-muted-foreground" />
        </div>
        <h3 className="text-lg font-medium text-foreground mb-2">Nenhum ticket selecionado</h3>
        <p className="text-muted-foreground text-sm">
          Selecione um ticket na lista ou inicie uma conversa no chat
        </p>
      </div>
    );
  }

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('pt-BR', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    }).format(date);
  };

  const status = statusConfig[ticket.status];

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-foreground">Detalhes do Ticket</h2>
          <Button variant="ghost" size="icon">
            <MoreHorizontal className="w-5 h-5" />
          </Button>
        </div>
        
        <Badge variant="outline" className={cn("mb-4", status.className)}>
          {status.label}
        </Badge>
        
        <h3 className="font-medium text-foreground mb-2">{ticket.subject}</h3>
        <p className="text-sm text-muted-foreground">ID: #{ticket.id.slice(0, 8)}</p>
      </div>
      
      <div className="p-4 border-b border-border">
        <h4 className="text-sm font-medium text-foreground mb-3">Informações do Cliente</h4>
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
              <User className="w-4 h-4 text-muted-foreground" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">{ticket.customerName}</p>
              <p className="text-xs text-muted-foreground">Cliente</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-muted flex items-center justify-center">
              <Phone className="w-4 h-4 text-muted-foreground" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">{ticket.customerPhone}</p>
              <p className="text-xs text-muted-foreground">WhatsApp</p>
            </div>
          </div>
        </div>
      </div>
      
      <div className="p-4 flex-1 overflow-y-auto scrollbar-thin">
        <h4 className="text-sm font-medium text-foreground mb-3">Histórico de Mensagens</h4>
        <div className="space-y-3">
          {ticket.messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                "p-3 rounded-lg text-sm animate-fade-in",
                message.sender === 'user'
                  ? "bg-muted ml-4"
                  : "bg-cs-primary-light mr-4"
              )}
            >
              <p className="text-foreground">{message.content}</p>
              <p className="text-xs text-muted-foreground mt-1">
                {formatDate(message.timestamp)}
              </p>
            </div>
          ))}
        </div>
      </div>
      
      <div className="p-4 border-t border-border">
        <div className="flex items-center gap-2 text-xs text-muted-foreground">
          <Clock className="w-3 h-3" />
          <span>Criado em {formatDate(ticket.createdAt)}</span>
        </div>
      </div>
    </div>
  );
}
