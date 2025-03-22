
import { useState } from "react";
import { Note } from "@/data/notes";
import { NoteCreator } from "./NoteCreator";
import { NoteItem } from "./NoteItem";
import { DragDropContext, Droppable, Draggable } from "@hello-pangea/dnd";

interface NoteBoardProps {
  initialNotes: Note[];
}

export const NoteBoard = ({ initialNotes }: NoteBoardProps) => {
  const [notes, setNotes] = useState<Note[]>(initialNotes);

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;
    
    const items = Array.from(notes);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    
    setNotes(items);
  };

  const handleCreateNote = (newNote: Note) => {
    setNotes(prev => [newNote, ...prev]);
  };

  const handleDeleteNote = (id: string) => {
    // Delete the note and any replies if it's a thread parent
    setNotes(prev => 
      prev.filter(note => 
        note.id !== id && note.threadId !== id
      )
    );
  };

  const handleUpdateNote = (updatedNote: Note) => {
    setNotes(prev => 
      prev.map(note => 
        note.id === updatedNote.id ? updatedNote : note
      )
    );
  };

  const handleCreateReply = (parentId: string, reply: Note) => {
    // Add reply to the parent note's replies array
    setNotes(prev => 
      prev.map(note => {
        if (note.id === parentId) {
          return {
            ...note,
            replies: [...(note.replies || []), reply]
          };
        }
        return note;
      })
    );
  };

  const handleDeleteReply = (parentId: string, replyId: string) => {
    // Remove the reply from the parent note's replies array
    setNotes(prev => 
      prev.map(note => {
        if (note.id === parentId && note.replies) {
          return {
            ...note,
            replies: note.replies.filter(reply => reply.id !== replyId)
          };
        }
        return note;
      })
    );
  };

  const handleUpdateReply = (parentId: string, updatedReply: Note) => {
    // Update the specific reply in the parent note's replies array
    setNotes(prev => 
      prev.map(note => {
        if (note.id === parentId && note.replies) {
          return {
            ...note,
            replies: note.replies.map(reply => 
              reply.id === updatedReply.id ? updatedReply : reply
            )
          };
        }
        return note;
      })
    );
  };

  return (
    <div className="space-y-6">
      <NoteCreator onCreateNote={handleCreateNote} />
      
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="notes">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="space-y-4"
            >
              {notes.filter(note => !note.threadId).map((note, index) => (
                <Draggable key={note.id} draggableId={note.id} index={index}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                    >
                      <NoteItem 
                        note={note} 
                        onDelete={handleDeleteNote}
                        onUpdate={handleUpdateNote}
                        onCreateReply={handleCreateReply}
                        onDeleteReply={handleDeleteReply}
                        onUpdateReply={handleUpdateReply}
                      />
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
