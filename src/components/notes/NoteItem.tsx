import { useState } from "react";
import { Note } from "@/data/notes";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { format } from "date-fns";
import { Trash2, Pencil, Save, X, MessageSquare, ChevronDown, ChevronUp, Link } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { NoteReply } from "./NoteReply";

interface NoteItemProps {
  note: Note;
  onDelete: (id: string) => void;
  onUpdate: (note: Note) => void;
  onCreateReply: (parentId: string, reply: Note) => void;
  onDeleteReply: (parentId: string, replyId: string) => void;
  onUpdateReply: (parentId: string, reply: Note) => void;
  onSelect?: () => void;
}

export const NoteItem = ({ 
  note, 
  onDelete, 
  onUpdate, 
  onCreateReply,
  onDeleteReply,
  onUpdateReply,
  onSelect
}: NoteItemProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editTitle, setEditTitle] = useState(note.title);
  const [editContent, setEditContent] = useState(note.content);
  const [isReplying, setIsReplying] = useState(false);
  const [replyTitle, setReplyTitle] = useState("");
  const [replyContent, setReplyContent] = useState("");
  const [showReplies, setShowReplies] = useState(true);

  const handleSaveEdit = () => {
    if (!editTitle.trim() || !editContent.trim()) return;
    
    const updatedNote: Note = {
      ...note,
      title: editTitle,
      content: editContent,
      updatedAt: new Date()
    };
    
    onUpdate(updatedNote);
    setIsEditing(false);
  };

  const handleSaveReply = () => {
    if (!replyTitle.trim() || !replyContent.trim()) return;
    
    const newReply: Note = {
      id: crypto.randomUUID(),
      title: replyTitle,
      content: replyContent,
      tags: [],
      createdAt: new Date(),
      updatedAt: new Date(),
      threadId: note.id
    };
    
    onCreateReply(note.id, newReply);
    setIsReplying(false);
    setReplyTitle("");
    setReplyContent("");
    setShowReplies(true);
  };

  const handleDeleteReply = (replyId: string) => {
    onDeleteReply(note.id, replyId);
  };

  const handleUpdateReply = (updatedReply: Note) => {
    onUpdateReply(note.id, updatedReply);
  };

  const handleCardClick = (e: React.MouseEvent) => {
    const target = e.target as HTMLElement;
    // Only select if clicking on the card itself, not on buttons or inputs
    if (
      target.tagName !== 'BUTTON' && 
      !target.closest('button') && 
      target.tagName !== 'INPUT' && 
      target.tagName !== 'TEXTAREA' &&
      !isEditing &&
      !isReplying &&
      onSelect
    ) {
      onSelect();
    }
  };

  return (
    <Card 
      className="group relative animate-fade-in hover:shadow-md transition-all"
      onClick={handleCardClick}
    >
      <CardContent className="p-4">
        {isEditing ? (
          <div className="space-y-3">
            <input
              type="text"
              value={editTitle}
              onChange={(e) => setEditTitle(e.target.value)}
              className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
              autoFocus
            />
            <Textarea
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
              className="min-h-[80px] resize-none"
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
          <div>
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-medium">{note.title}</h3>
              <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-1">
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-8 w-8"
                  onClick={() => setIsReplying(true)}
                  title="Reply to this note"
                >
                  <MessageSquare size={15} />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-8 w-8"
                  onClick={() => {
                    setEditTitle(note.title);
                    setEditContent(note.content);
                    setIsEditing(true);
                  }}
                >
                  <Pencil size={15} />
                </Button>
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-8 w-8 text-destructive hover:text-destructive"
                  onClick={() => onDelete(note.id)}
                >
                  <Trash2 size={15} />
                </Button>
              </div>
            </div>
            
            <p className="mt-2 whitespace-pre-wrap">{note.content}</p>
            
            <div className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
              <span>
                {format(note.updatedAt, "MMM d, yyyy 'at' h:mm a")}
              </span>
              
              {note.tags && note.tags.length > 0 && (
                <div className="flex items-center gap-1">
                  <span>•</span>
                  <div className="flex flex-wrap gap-1">
                    {note.tags.map(tag => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
              
              {note.connectedThreadIds && note.connectedThreadIds.length > 0 && (
                <div className="flex items-center gap-1">
                  <span>•</span>
                  <div className="flex items-center">
                    <Link size={13} className="mr-1" />
                    <span>{note.connectedThreadIds.length}</span>
                  </div>
                </div>
              )}
            </div>
            
            {isReplying && (
              <div className="mt-4 space-y-3 border-t border-border pt-3">
                <p className="text-sm font-medium">Reply to this note:</p>
                <input
                  type="text"
                  placeholder="Reply title..."
                  value={replyTitle}
                  onChange={(e) => setReplyTitle(e.target.value)}
                  className="w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
                  autoFocus
                />
                <Textarea
                  value={replyContent}
                  onChange={(e) => setReplyContent(e.target.value)}
                  className="min-h-[60px] resize-none"
                  placeholder="Write your reply..."
                />
                <div className="flex gap-2 justify-end">
                  <Button 
                    size="sm" 
                    variant="outline" 
                    onClick={() => setIsReplying(false)}
                  >
                    <X size={14} className="mr-1" />
                    Cancel
                  </Button>
                  <Button 
                    size="sm" 
                    onClick={handleSaveReply}
                    disabled={!replyTitle.trim() || !replyContent.trim()}
                  >
                    <Save size={14} className="mr-1" />
                    Add Reply
                  </Button>
                </div>
              </div>
            )}
            
            {note.replies && note.replies.length > 0 && (
              <div className="mt-3 pt-2 border-t border-border">
                <Button
                  variant="ghost"
                  size="sm"
                  className="px-2 py-1 h-7 text-xs"
                  onClick={() => setShowReplies(!showReplies)}
                >
                  {showReplies ? (
                    <ChevronUp size={14} className="mr-1" />
                  ) : (
                    <ChevronDown size={14} className="mr-1" />
                  )}
                  {note.replies.length} {note.replies.length === 1 ? 'reply' : 'replies'}
                </Button>
                
                {showReplies && (
                  <div className="space-y-3 mt-2 pl-3 border-l-2 border-border">
                    {note.replies.map((reply) => (
                      <NoteReply
                        key={reply.id}
                        reply={reply}
                        onDelete={handleDeleteReply}
                        onUpdate={handleUpdateReply}
                      />
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
