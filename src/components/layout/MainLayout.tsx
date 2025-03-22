
import { useState, ReactNode } from "react";
import { Sidebar } from "../sidebar/Sidebar";
import { NoteList } from "../notes/NoteList";
import { NoteDetail } from "../notes/NoteDetail";
import { Note, sampleNotes } from "@/data/notes";
import { useIsMobile } from "@/hooks/use-mobile";

interface MainLayoutProps {
  children?: ReactNode;
}

export const MainLayout = ({ children }: MainLayoutProps) => {
  const [selectedNote, setSelectedNote] = useState<Note | undefined>(sampleNotes[0]);
  const [showNoteDetail, setShowNoteDetail] = useState(false);
  const isMobile = useIsMobile();

  const handleSelectNote = (note: Note) => {
    setSelectedNote(note);
    if (isMobile) {
      setShowNoteDetail(true);
    }
  };

  const handleBack = () => {
    setShowNoteDetail(false);
  };

  return (
    <div className="flex min-h-screen">
      <Sidebar />
      
      {children ? (
        <div className="flex-1 overflow-auto">
          {children}
        </div>
      ) : (
        <>
          {isMobile ? (
            <>
              {showNoteDetail ? (
                <NoteDetail 
                  note={selectedNote} 
                  onBack={handleBack}
                  isMobile={true}
                  className="w-full"
                />
              ) : (
                <NoteList 
                  onSelectNote={handleSelectNote} 
                  selectedNoteId={selectedNote?.id}
                  className="w-full"
                />
              )}
            </>
          ) : (
            <>
              <NoteList 
                onSelectNote={handleSelectNote} 
                selectedNoteId={selectedNote?.id}
                className="w-80"
              />
              <NoteDetail 
                note={selectedNote}
                className="flex-1"
              />
            </>
          )}
        </>
      )}
    </div>
  );
};
