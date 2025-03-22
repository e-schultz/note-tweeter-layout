
import { useState } from "react";
import { MainLayout } from "@/components/layout/MainLayout";
import { NoteBoard } from "@/components/notes/NoteBoard";
import { sampleNotes } from "@/data/notes";

const Index = () => {
  return (
    <MainLayout>
      <div className="max-w-5xl mx-auto p-4">
        <h1 className="text-2xl font-bold mb-6">My Notes</h1>
        <NoteBoard initialNotes={sampleNotes} />
      </div>
    </MainLayout>
  );
};

export default Index;
