import { Search, Filter, Plus } from "lucide-react";
import { Ticket } from "@/types/ticket";
import { TicketCard } from "./TicketCard";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface TicketListProps {
  tickets: Ticket[];
  selectedTicketId: string | null;
  onSelectTicket: (id: string) => void;
}

export function TicketList({ tickets, selectedTicketId, onSelectTicket }: TicketListProps) {
  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-foreground">Tickets</h2>
          <Button size="sm" className="bg-cs-primary hover:bg-cs-primary/90">
            <Plus className="w-4 h-4 mr-1" />
            Novo
          </Button>
        </div>
        
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
            <Input 
              placeholder="Buscar tickets..." 
              className="pl-9 bg-muted/50 border-0"
            />
          </div>
          <Button variant="outline" size="icon">
            <Filter className="w-4 h-4" />
          </Button>
        </div>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-3 scrollbar-thin">
        {tickets.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center p-8">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
              <Search className="w-8 h-8 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground">
              Nenhum ticket ainda. Inicie uma conversa no chat para criar tickets automaticamente.
            </p>
          </div>
        ) : (
          tickets.map((ticket) => (
            <TicketCard
              key={ticket.id}
              ticket={ticket}
              isSelected={selectedTicketId === ticket.id}
              onClick={() => onSelectTicket(ticket.id)}
            />
          ))
        )}
      </div>
    </div>
  );
}
