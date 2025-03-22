
import { useState, useEffect } from "react";
import { Note } from "@/data/notes";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Tag, Clock, Share2, MoreHorizontal, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface NoteDetailProps {
  note?: Note;
  onBack?: () => void;
  className?: string;
  isMobile?: boolean;
}

export const NoteDetail = ({ 
  note, 
  onBack,
  className,
  isMobile = false
}: NoteDetailProps) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    return () => setMounted(false);
  }, []);

  if (!note) {
    return (
      <div className={cn("h-screen flex items-center justify-center", className)}>
        <div className="text-center">
          <p className="text-muted-foreground">Select a note to view</p>
        </div>
      </div>
    );
  }

  return (
    <div 
      className={cn(
        "h-screen flex flex-col",
        mounted ? "animate-fade-in" : "opacity-0",
        className
      )}
    >
      <div className="p-4 border-b border-border flex items-center justify-between">
        {isMobile && (
          <Button variant="ghost" size="icon" onClick={onBack} className="mr-2">
            <ArrowLeft size={20} />
          </Button>
        )}
        <h2 className="text-lg font-semibold">{note.title}</h2>
        <div className="flex items-center gap-1">
          <Button variant="ghost" size="icon">
            <Share2 size={18} />
          </Button>
          <Button variant="ghost" size="icon">
            <MoreHorizontal size={18} />
          </Button>
        </div>
      </div>
      
      <div className="flex-1 overflow-auto p-6">
        <div className="max-w-3xl mx-auto">
          <div className="flex items-center gap-4 text-sm text-muted-foreground mb-6">
            <div className="flex items-center gap-1.5">
              <Clock size={14} />
              <span>
                {format(note.updatedAt, "MMM d, yyyy")}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <Tag size={14} />
              <div className="flex items-center gap-1">
                {note.tags.map((tag) => (
                  <Badge key={tag} variant="secondary" className="capitalize">
                    {tag}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
          
          <div className="prose prose-sm max-w-none">
            <p className="text-foreground leading-relaxed whitespace-pre-line">
              {note.content}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
