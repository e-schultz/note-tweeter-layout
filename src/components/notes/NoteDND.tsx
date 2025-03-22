
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";
import { Plus, Trash2, Pencil, Save, X, MessageSquare, ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";
import { format } from "date-fns";

export interface NoteItem {
  id: string;
  text: string;
  timestamp: Date;
  replies?: NoteItem[];
  threadId?: string;
}

interface NoteDNDProps {
  notes: NoteItem[];
  onNotesChange: (notes: NoteItem[]) => void;
  className?: string;
}

export const NoteDND = ({ notes, onNotesChange, className }: NoteDNDProps) => {
  const [newNoteText, setNewNoteText] = useState("");
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [replyingToId, setReplyingToId] = useState<string | null>(null);
  const [replyText, setReplyText] = useState("");
  const [editingText, setEditingText] = useState("");
  const [expandedThreads, setExpandedThreads] = useState<Record<string, boolean>>({});

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
      replies: []
    };
    
    onNotesChange([...notes, newNote]);
    setNewNoteText("");
  };

  const handleDeleteNote = (id: string) => {
    // Find if it's a top-level note or a reply
    const isTopLevel = notes.some(note => note.id === id);
    
    if (isTopLevel) {
      onNotesChange(notes.filter(note => note.id !== id));
    } else {
      // It's a reply, need to find parent and remove the reply
      const updatedNotes = notes.map(note => {
        if (note.replies && note.replies.some(reply => reply.id === id)) {
          return {
            ...note,
            replies: note.replies.filter(reply => reply.id !== id)
          };
        }
        return note;
      });
      onNotesChange(updatedNotes);
    }
  };

  const startEditing = (note: NoteItem) => {
    setEditingNoteId(note.id);
    setEditingText(note.text);
  };

  const saveEdit = () => {
    if (!editingNoteId) return;
    
    // Find if we're editing a top-level note or a reply
    const isTopLevel = notes.some(note => note.id === editingNoteId);
    
    if (isTopLevel) {
      onNotesChange(
        notes.map(note => 
          note.id === editingNoteId 
            ? { ...note, text: editingText, timestamp: new Date() } 
            : note
        )
      );
    } else {
      // It's a reply, need to find parent and update the reply
      const updatedNotes = notes.map(note => {
        if (note.replies && note.replies.some(reply => reply.id === editingNoteId)) {
          return {
            ...note,
            replies: note.replies.map(reply => 
              reply.id === editingNoteId
                ? { ...reply, text: editingText, timestamp: new Date() }
                : reply
            )
          };
        }
        return note;
      });
      onNotesChange(updatedNotes);
    }
    
    setEditingNoteId(null);
  };

  const cancelEdit = () => {
    setEditingNoteId(null);
  };

  const startReply = (noteId: string) => {
    setReplyingToId(noteId);
    setReplyText("");
  };

  const saveReply = () => {
    if (!replyingToId || !replyText.trim()) return;
    
    const newReply: NoteItem = {
      id: crypto.randomUUID(),
      text: replyText,
      timestamp: new Date(),
      threadId: replyingToId
    };
    
    const updatedNotes = notes.map(note => {
      if (note.id === replyingToId) {
        // Ensure replies array exists
        const currentReplies = note.replies || [];
        return {
          ...note,
          replies: [...currentReplies, newReply]
        };
      }
      return note;
    });
    
    onNotesChange(updatedNotes);
    setReplyingToId(null);
    setReplyText("");
    
    // Automatically expand the thread
    setExpandedThreads(prev => ({
      ...prev,
      [replyingToId]: true
    }));
  };

  const cancelReply = () => {
    setReplyingToId(null);
    setReplyText("");
  };

  const toggleThread = (noteId: string) => {
    setExpandedThreads(prev => ({
      ...prev,
      [noteId]: !prev[noteId]
    }));
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
                                  onClick={() => startReply(note.id)}
                                  title="Reply to this note"
                                >
                                  <MessageSquare size={15} />
                                </Button>
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
                              
                              {/* Reply section */}
                              {replyingToId === note.id && (
                                <div className="mt-4 space-y-2 border-t border-border pt-3">
                                  <p className="text-sm font-medium">Reply to this note:</p>
                                  <Textarea
                                    value={replyText}
                                    onChange={(e) => setReplyText(e.target.value)}
                                    className="min-h-[60px] resize-none"
                                    autoFocus
                                    placeholder="Write your reply..."
                                  />
                                  <div className="flex gap-2 justify-end">
                                    <Button 
                                      size="sm" 
                                      variant="outline" 
                                      onClick={cancelReply}
                                    >
                                      <X size={14} className="mr-1" />
                                      Cancel
                                    </Button>
                                    <Button 
                                      size="sm" 
                                      onClick={saveReply}
                                      disabled={!replyText.trim()}
                                    >
                                      <Save size={14} className="mr-1" />
                                      Add Reply
                                    </Button>
                                  </div>
                                </div>
                              )}
                              
                              {/* Show replies if they exist */}
                              {note.replies && note.replies.length > 0 && (
                                <div className="mt-3 pt-2 border-t border-border">
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="px-2 py-1 h-7 text-xs"
                                    onClick={() => toggleThread(note.id)}
                                  >
                                    {expandedThreads[note.id] ? (
                                      <ChevronUp size={14} className="mr-1" />
                                    ) : (
                                      <ChevronDown size={14} className="mr-1" />
                                    )}
                                    {note.replies.length} {note.replies.length === 1 ? 'reply' : 'replies'}
                                  </Button>
                                  
                                  {expandedThreads[note.id] && (
                                    <div className="space-y-3 mt-2 pl-3 border-l-2 border-border">
                                      {note.replies.map((reply) => (
                                        <Card key={reply.id} className="bg-muted/30">
                                          <CardContent className="p-3 relative group">
                                            {editingNoteId === reply.id ? (
                                              <div className="space-y-2">
                                                <Textarea
                                                  value={editingText}
                                                  onChange={(e) => setEditingText(e.target.value)}
                                                  className="min-h-[60px] resize-none"
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
                                              <>
                                                <div className="whitespace-pre-wrap mb-1">{reply.text}</div>
                                                <div className="text-xs text-muted-foreground">
                                                  {format(reply.timestamp, "MMM d, yyyy 'at' h:mm a")}
                                                </div>
                                                <div className="absolute right-2 top-2 opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                                                  <Button
                                                    size="icon"
                                                    variant="ghost"
                                                    className="h-7 w-7"
                                                    onClick={() => startEditing(reply)}
                                                  >
                                                    <Pencil size={14} />
                                                  </Button>
                                                  <Button
                                                    size="icon"
                                                    variant="ghost"
                                                    className="h-7 w-7 text-destructive hover:text-destructive"
                                                    onClick={() => handleDeleteNote(reply.id)}
                                                  >
                                                    <Trash2 size={14} />
                                                  </Button>
                                                </div>
                                              </>
                                            )}
                                          </CardContent>
                                        </Card>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              )}
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
