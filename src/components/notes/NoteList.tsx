
import { useState } from "react";
import { Note, sampleNotes } from "@/data/notes";
import { Search, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { NoteCard } from "./NoteCard";
import { cn } from "@/lib/utils";

interface NoteListProps {
  onSelectNote: (note: Note) => void;
  selectedNoteId?: string;
  className?: string;
}

export const NoteList = ({ 
  onSelectNote, 
  selectedNoteId,
  className 
}: NoteListProps) => {
  const [searchQuery, setSearchQuery] = useState("");
  
  const filteredNotes = sampleNotes.filter((note) => 
    note.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
    note.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className={cn("h-screen flex flex-col border-r border-border", className)}>
      <div className="p-4 border-b border-border">
        <h2 className="text-lg font-semibold mb-4">All Notes</h2>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" size={16} />
          <Input
            placeholder="Search notes..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 bg-muted/40"
          />
        </div>
        <div className="flex items-center justify-between mt-4">
          <p className="text-sm text-muted-foreground">
            {filteredNotes.length} note{filteredNotes.length !== 1 ? 's' : ''}
          </p>
          <button className="text-sm text-muted-foreground hover:text-foreground flex items-center gap-1">
            <Filter size={14} />
            <span>Filter</span>
          </button>
        </div>
      </div>
      
      <div className="flex-1 overflow-auto">
        <div className="p-3 space-y-3">
          {filteredNotes.map((note) => (
            <NoteCard
              key={note.id}
              note={note}
              isSelected={note.id === selectedNoteId}
              onClick={() => onSelectNote(note)}
            />
          ))}
          
          {filteredNotes.length === 0 && (
            <div className="py-10 text-center">
              <p className="text-muted-foreground">No notes found.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
