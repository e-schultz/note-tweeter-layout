
import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { NoteBoard } from "@/components/notes/NoteBoard";
import { NoteDetail } from "@/components/notes/NoteDetail";
import { NoteList } from "@/components/notes/NoteList";
import { sampleNotes, Note } from "@/data/notes";

const Index = () => {
  const [selectedNote, setSelectedNote] = useState<Note | undefined>(undefined);

  const handleSelectNote = (note: Note) => {
    setSelectedNote(note);
  };

  return (
    <MainLayout>
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 h-screen">
        <div className="hidden md:block md:col-span-1">
          <NoteList 
            onSelectNote={handleSelectNote}
            selectedNoteId={selectedNote?.id}
          />
        </div>
        <div className="col-span-1 md:col-span-2 lg:col-span-3 overflow-hidden">
          {selectedNote ? (
            <NoteDetail 
              note={selectedNote} 
              onBack={() => setSelectedNote(undefined)} 
              isMobile={true} 
              onSelectNote={handleSelectNote}
            />
          ) : (
            <div className="max-w-5xl mx-auto p-4">
              <h1 className="text-2xl font-bold mb-6">My Notes</h1>
              <NoteBoard initialNotes={sampleNotes} onSelectNote={handleSelectNote} />
            </div>
          )}
        </div>
      </div>
    </MainLayout>
  );
};

export default Index;
