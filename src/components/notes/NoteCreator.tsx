
import { useState } from "react";
import { Note } from "@/data/notes";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Plus } from "lucide-react";

interface NoteCreatorProps {
  onCreateNote: (note: Note) => void;
}

export const NoteCreator = ({ onCreateNote }: NoteCreatorProps) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  const handleCreateNote = () => {
    if (!title.trim() || !content.trim()) return;
    
    const newNote: Note = {
      id: crypto.randomUUID(),
      title: title,
      content: content,
      tags: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      replies: []
    };
    
    onCreateNote(newNote);
    setTitle("");
    setContent("");
  };

  return (
    <Card>
      <CardContent className="p-4">
        <div className="space-y-3">
          <input
            type="text"
            placeholder="Note title..."
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
          />
          <Textarea
            placeholder="Write your note..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="min-h-[80px] resize-none"
          />
          <Button 
            onClick={handleCreateNote}
            className="w-full"
            disabled={!title.trim() || !content.trim()}
          >
            <Plus size={16} className="mr-2" />
            Add Note
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
