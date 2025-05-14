
import { useState } from "react";
import { Note } from "@/data/notes";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { layers, Link } from "lucide-react";

interface ThreadConnectionProps {
  note: Note;
  connectedNotes: Note[];
  onSelectNote: (note: Note) => void;
  className?: string;
}

export const ThreadConnection = ({
  note,
  connectedNotes,
  onSelectNote,
  className
}: ThreadConnectionProps) => {
  const [isExpanded, setIsExpanded] = useState(false);

  if (!connectedNotes || connectedNotes.length === 0) return null;

  return (
    <div className={cn("mt-4 pt-3 border-t border-border", className)}>
      <div 
        className="flex items-center gap-2 text-sm font-medium text-muted-foreground cursor-pointer hover:text-foreground transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <layers size={16} />
        <span>Connected Threads ({connectedNotes.length})</span>
      </div>
      
      {isExpanded && (
        <div className="mt-2 space-y-2">
          {connectedNotes.map((connectedNote) => (
            <Card 
              key={connectedNote.id}
              className="bg-muted/30 hover:bg-muted/50 cursor-pointer transition-colors"
              onClick={() => onSelectNote(connectedNote)}
            >
              <CardContent className="p-3">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-sm">{connectedNote.title}</h4>
                  <Link size={14} className="text-muted-foreground" />
                </div>
                <p className="text-xs text-muted-foreground line-clamp-1 mt-1">
                  {connectedNote.content}
                </p>
                {connectedNote.tags && connectedNote.tags.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1">
                    {connectedNote.tags.slice(0, 2).map(tag => (
                      <Badge key={tag} variant="outline" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                    {connectedNote.tags.length > 2 && (
                      <span className="text-xs text-muted-foreground">
                        +{connectedNote.tags.length - 2}
                      </span>
                    )}
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};
