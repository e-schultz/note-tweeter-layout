
import { useState } from "react";
import { Note } from "@/data/notes";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { format } from "date-fns";
import { Trash2, Pencil, Save, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface NoteReplyProps {
  reply: Note;
  onDelete: (replyId: string) => void;
  onUpdate: (updatedReply: Note) => void;
}

export const NoteReply = ({ reply, onDelete, onUpdate }: NoteReplyProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(reply.title);
  const [editContent, setEditContent] = useState(reply.content);

  const handleSaveEdit = () => {
    if (!editTitle.trim() || !editContent.trim()) return;
    
    const updatedReply: Note = {
      ...reply,
      title: editTitle,
      content: editContent,
      updatedAt: new Date()
    };
    
    onUpdate(updatedReply);
    setIsEditing(false);
  };

  return (
    <Card className="bg-muted/30 group relative">
      <CardContent className="p-3">
        {isEditing ? (
          <div className="space-y-2">
            <input
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring text-sm"
              autoFocus
            />
            <Textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              className="min-h-[60px] resize-none text-sm"
            />
            <div className="flex gap-2 justify-end">
              <Button 
                size="sm" 
                variant="outline" 
                onClick={() => setIsEditing(false)}
              >
                <X size={14} className="mr-1" />
                Cancel
              </Button>
              <Button 
                size="sm" 
                onClick={handleSaveEdit}
                disabled={!editTitle.trim() || !editContent.trim()}
              >
                <Save size={14} className="mr-1" />
                Save
              </Button>
            </div>
          </div>
        ) : (
          <>
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-sm">{reply.title}</h4>
              <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-7 w-7"
                  onClick={() => {
                    setEditTitle(reply.title);
                    setEditContent(reply.content);
                    setIsEditing(true);
                  }}
                >
                  <Pencil size={14} />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-7 w-7 text-destructive hover:text-destructive"
                  onClick={() => onDelete(reply.id)}
                >
                  <Trash2 size={14} />
                </Button>
              </div>
            </div>
            
            <p className="mt-1 text-sm whitespace-pre-wrap">{reply.content}</p>
            
            <div className="mt-2 flex items-center gap-2 text-xs text-muted-foreground">
              <span>
                {format(reply.updatedAt, "MMM d, yyyy 'at' h:mm a")}
              </span>
              
              {reply.tags && reply.tags.length > 0 && (
                <div className="flex items-center gap-1">
                  <span>•</span>
                  <div className="flex flex-wrap gap-1">
                    {reply.tags.map(tag => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
};
