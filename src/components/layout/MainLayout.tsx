
import { useState } from "react";
import { Sidebar } from "../sidebar/Sidebar";
import { NoteList } from "../notes/NoteList";
import { NoteDetail } from "../notes/NoteDetail";
import { Note, sampleNotes } from "@/data/notes";
import { useIsMobile } from "@/hooks/use-mobile";

export const MainLayout = () => {
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
    </div>
  );
};
