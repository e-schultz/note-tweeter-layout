
import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { NoteDND, NoteItem } from "@/components/notes/NoteDND";

const Index = () => {
  const [notes, setNotes] = useState<NoteItem[]>([
    {
      id: "1",
      text: "This is an example note. You can drag it to reorder, edit, or delete it.",
      timestamp: new Date(),
    },
  ]);

  return (
    <MainLayout>
      <div className="max-w-3xl mx-auto p-4">
        <h1 className="text-2xl font-bold mb-6">My Notes</h1>
        <NoteDND notes={notes} onNotesChange={setNotes} />
      </div>
    </MainLayout>
  );
};

export default Index;
