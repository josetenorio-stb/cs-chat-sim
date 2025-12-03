import { Home, Ticket, Users, Settings, BarChart3, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";

interface CSSidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const menuItems = [
  { id: 'home', icon: Home, label: 'Dashboard' },
  { id: 'tickets', icon: Ticket, label: 'Tickets' },
  { id: 'conversations', icon: MessageSquare, label: 'Conversas' },
  { id: 'customers', icon: Users, label: 'Clientes' },
  { id: 'analytics', icon: BarChart3, label: 'Relatórios' },
  { id: 'settings', icon: Settings, label: 'Configurações' },
];

export function CSSidebar({ activeTab, onTabChange }: CSSidebarProps) {
  return (
    <aside className="w-16 lg:w-64 bg-cs-sidebar h-full flex flex-col">
      <div className="p-4 border-b border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-cs-primary flex items-center justify-center">
            <span className="text-primary-foreground font-bold text-sm">CS</span>
          </div>
          <span className="hidden lg:block text-cs-sidebar-foreground font-semibold">
            CS Platform
          </span>
        </div>
      </div>
      
      <nav className="flex-1 p-2 space-y-1">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => onTabChange(item.id)}
            className={cn(
              "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200",
              "hover:bg-sidebar-accent",
              activeTab === item.id 
                ? "bg-sidebar-accent text-sidebar-primary" 
                : "text-sidebar-foreground/70"
            )}
          >
            <item.icon className="w-5 h-5 flex-shrink-0" />
            <span className="hidden lg:block text-sm font-medium">{item.label}</span>
          </button>
        ))}
      </nav>
      
      <div className="p-4 border-t border-sidebar-border">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-full bg-sidebar-accent flex items-center justify-center">
            <span className="text-sidebar-foreground text-xs font-medium">AG</span>
          </div>
          <div className="hidden lg:block">
            <p className="text-cs-sidebar-foreground text-sm font-medium">Agente</p>
            <p className="text-sidebar-foreground/50 text-xs">Online</p>
          </div>
        </div>
      </div>
    </aside>
  );
}
