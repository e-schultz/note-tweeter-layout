
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { Plus, Trash2, Pencil, Save, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

export interface NoteItem {
  id: string;
  text: string;
  timestamp: Date;
}

interface NoteDNDProps {
  notes: NoteItem[];
  onNotesChange: (notes: NoteItem[]) => void;
  className?: string;
}

export const NoteDND = ({ notes, onNotesChange, className }: NoteDNDProps) => {
  const [newNoteText, setNewNoteText] = useState("");
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [editingText, setEditingText] = useState("");

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;
    
    const items = Array.from(notes);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    
    onNotesChange(items);
  };

  const handleCreateNote = () => {
    if (!newNoteText.trim()) return;
    
    const newNote: NoteItem = {
      id: crypto.randomUUID(),
      text: newNoteText,
      timestamp: new Date(),
    };
    
    onNotesChange([...notes, newNote]);
    setNewNoteText("");
  };

  const handleDeleteNote = (id: string) => {
    onNotesChange(notes.filter(note => note.id !== id));
  };

  const startEditing = (note: NoteItem) => {
    setEditingNoteId(note.id);
    setEditingText(note.text);
  };

  const saveEdit = () => {
    if (!editingNoteId) return;
    
    onNotesChange(
      notes.map(note => 
        note.id === editingNoteId 
          ? { ...note, text: editingText, timestamp: new Date() } 
          : note
      )
    );
    
    setEditingNoteId(null);
  };

  const cancelEdit = () => {
    setEditingNoteId(null);
  };

  return (
    <div className={cn("space-y-4", className)}>
      {/* New note input */}
      <Card>
        <CardContent className="p-4">
          <div className="space-y-2">
            <Textarea
              placeholder="Write a new note..."
              value={newNoteText}
              onChange={(e) => setNewNoteText(e.target.value)}
              className="min-h-[80px] resize-none"
            />
            <Button 
              onClick={handleCreateNote}
              className="w-full"
              disabled={!newNoteText.trim()}
            >
              <Plus size={16} className="mr-2" />
              Add Note
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Note list with drag and drop */}
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="notes">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="space-y-3"
            >
              {notes.map((note, index) => (
                <Draggable key={note.id} draggableId={note.id} index={index}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className="animate-fade-in"
                    >
                      <Card className="group relative hover:shadow-md transition-all">
                        <CardContent className="p-4">
                          {editingNoteId === note.id ? (
                            <div className="space-y-2">
                              <Textarea
                                value={editingText}
                                onChange={(e) => setEditingText(e.target.value)}
                                className="min-h-[80px] resize-none"
                                autoFocus
                              />
                              <div className="flex gap-2 justify-end">
                                <Button 
                                  size="sm" 
                                  variant="outline" 
                                  onClick={cancelEdit}
                                >
                                  <X size={14} className="mr-1" />
                                  Cancel
                                </Button>
                                <Button 
                                  size="sm" 
                                  onClick={saveEdit}
                                  disabled={!editingText.trim()}
                                >
                                  <Save size={14} className="mr-1" />
                                  Save
                                </Button>
                              </div>
                            </div>
                          ) : (
                            <div>
                              <div className="whitespace-pre-wrap mb-2">{note.text}</div>
                              <div className="text-xs text-muted-foreground">
                                {format(note.timestamp, "MMM d, yyyy 'at' h:mm a")}
                              </div>
                              <div className="absolute right-3 top-3 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  className="h-8 w-8"
                                  onClick={() => startEditing(note)}
                                >
                                  <Pencil size={15} />
                                </Button>
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  className="h-8 w-8 text-destructive hover:text-destructive"
                                  onClick={() => handleDeleteNote(note.id)}
                                >
                                  <Trash2 size={15} />
                                </Button>
                              </div>
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>

      {notes.length === 0 && (
        <div className="text-center py-10 text-muted-foreground">
          No notes yet. Create your first note!
        </div>
      )}
    </div>
  );
};
