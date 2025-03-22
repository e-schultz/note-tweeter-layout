
import { useState } from "react";
import { 
  BookOpen, 
  Home, 
  Plus, 
  Search, 
  Settings, 
  Tag, 
  Menu,
  X
} from "lucide-react";
import { AnimatedLink } from "../ui/AnimatedLink";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface SidebarProps {
  className?: string;
}

export const Sidebar = ({ className }: SidebarProps) => {
  const [collapsed, setCollapsed] = useState(false);
  const [activeLink, setActiveLink] = useState("home");

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  const menuItems = [
    { id: "home", label: "Home", icon: Home, href: "/" },
    { id: "notes", label: "All Notes", icon: BookOpen, href: "#" },
    { id: "tags", label: "Tags", icon: Tag, href: "#" },
    { id: "search", label: "Search", icon: Search, href: "#" },
    { id: "settings", label: "Settings", icon: Settings, href: "#" },
  ];

  return (
    <aside
      className={cn(
        "h-screen bg-sidebar sticky top-0 flex-shrink-0 border-r border-border transition-all duration-300",
        collapsed ? "w-16" : "w-64",
        className
      )}
    >
      <div className="flex flex-col h-full p-3">
        <div className="flex items-center justify-between mb-6">
          {!collapsed && (
            <h1 className="text-xl font-semibold animate-fade-in">Notes</h1>
          )}
          <Button
            variant="ghost"
            size="icon"
            className="text-muted-foreground"
            onClick={toggleSidebar}
          >
            {collapsed ? <Menu size={20} /> : <X size={20} />}
          </Button>
        </div>

        <div className="mb-4">
          <Button
            className={cn(
              "w-full gap-2 justify-start bg-primary/90 hover:bg-primary transition-all",
              collapsed && "justify-center px-0"
            )}
          >
            <Plus size={20} />
            {!collapsed && <span>New Note</span>}
          </Button>
        </div>

        <nav className="space-y-1 flex-1">
          {menuItems.map((item) => (
            <AnimatedLink
              key={item.id}
              href={item.href}
              isActive={activeLink === item.id}
              onClick={() => setActiveLink(item.id)}
              className={cn(
                "text-muted-foreground hover:text-foreground transition-colors",
                collapsed && "justify-center px-2"
              )}
              activeClassName="text-foreground font-medium"
            >
              <item.icon size={20} />
              {!collapsed && <span>{item.label}</span>}
            </AnimatedLink>
          ))}
        </nav>

        <div className="mt-auto pt-4 border-t border-border">
          <div className={cn(
            "flex items-center gap-3 p-2 rounded-lg",
            collapsed && "justify-center"
          )}>
            <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
              U
            </div>
            {!collapsed && (
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">User</p>
                <p className="text-xs text-muted-foreground truncate">user@example.com</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </aside>
  );
};
