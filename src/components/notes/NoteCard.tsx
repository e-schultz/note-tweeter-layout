
import { Note } from "@/data/notes";
import { cn } from "@/lib/utils";
import { formatDistanceToNow } from "date-fns";

interface NoteCardProps {
  note: Note;
  isSelected: boolean;
  onClick: () => void;
}

export const NoteCard = ({ note, isSelected, onClick }: NoteCardProps) => {
  return (
    <div
      className={cn(
        "p-4 rounded-lg border cursor-pointer transition-all duration-300 animate-fade-in",
        isSelected 
          ? "bg-primary/5 border-primary/20" 
          : "bg-card border-border hover:border-primary/20 hover:bg-primary/5"
      )}
      onClick={onClick}
    >
      <h3 className="font-medium line-clamp-1">{note.title}</h3>
      <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
        {note.content}
      </p>
      <div className="flex items-center gap-2 mt-2">
        <span className="text-xs text-muted-foreground">
          {formatDistanceToNow(note.updatedAt, { addSuffix: true })}
        </span>
        {note.tags.length > 0 && (
          <div className="flex items-center gap-1">
            <span className="text-xs text-muted-foreground">•</span>
            <span className="text-xs text-muted-foreground">
              {note.tags[0]}
              {note.tags.length > 1 && ` +${note.tags.length - 1}`}
            </span>
          </div>
        )}
      </div>
    </div>
  );
};
