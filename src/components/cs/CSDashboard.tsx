import { useState } from "react";
import { CSSidebar } from "./CSSidebar";
import { TicketList } from "./TicketList";
import { TicketDetail } from "./TicketDetail";
import { Ticket } from "@/types/ticket";

interface CSDashboardProps {
  tickets: Ticket[];
  selectedTicketId: string | null;
  onSelectTicket: (id: string) => void;
}

export function CSDashboard({ tickets, selectedTicketId, onSelectTicket }: CSDashboardProps) {
  const [activeTab, setActiveTab] = useState('tickets');
  const selectedTicket = tickets.find(t => t.id === selectedTicketId) || null;

  return (
    <div className="flex h-full bg-background">
      <CSSidebar activeTab={activeTab} onTabChange={setActiveTab} />
      
      <div className="flex-1 flex">
        <div className="w-80 lg:w-96 border-r border-border bg-card">
          <TicketList
            tickets={tickets}
            selectedTicketId={selectedTicketId}
            onSelectTicket={onSelectTicket}
          />
        </div>
        
        <div className="flex-1 bg-background">
          <TicketDetail ticket={selectedTicket} />
        </div>
      </div>
    </div>
  );
}
