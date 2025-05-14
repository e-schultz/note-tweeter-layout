
export interface Note {
  id: string;
  title: string;
  content: string;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
  threadId?: string;
  replies?: Note[];
  connectedThreadIds?: string[]; // New property for connecting threads
}

export const sampleNotes: Note[] = [
  {
    id: "1",
    title: "Design Thinking Process",
    content: "Design thinking is a non-linear, iterative process that teams use to understand users, challenge assumptions, redefine problems and create innovative solutions to prototype and test. Involving five phases—Empathize, Define, Ideate, Prototype and Test—it is most useful to tackle problems that are ill-defined or unknown.",
    tags: ["design", "process", "creativity"],
    createdAt: new Date("2023-10-15"),
    updatedAt: new Date("2023-10-15"),
    connectedThreadIds: ["2", "3"], // Connecting to Atomic Design and Dieter Rams' Principles
    replies: [
      {
        id: "1-1",
        title: "Reply to Design Thinking",
        content: "I find the Empathize phase particularly important. Without truly understanding user needs, the solutions we design might miss the mark completely.",
        tags: ["design", "empathy"],
        createdAt: new Date("2023-10-16"),
        updatedAt: new Date("2023-10-16"),
        threadId: "1"
      },
      {
        id: "1-2",
        title: "Another thought on Design Thinking",
        content: "The iteration aspect is what makes design thinking so powerful. It's not a linear process - you can always go back and refine based on new insights.",
        tags: ["design", "iteration"],
        createdAt: new Date("2023-10-17"),
        updatedAt: new Date("2023-10-17"),
        threadId: "1"
      }
    ]
  },
  {
    id: "2",
    title: "Atomic Design Methodology",
    content: "Atomic design is a methodology for creating design systems. There are five distinct levels in atomic design: Atoms, Molecules, Organisms, Templates, Pages. These help to create interface design systems in a more deliberate and hierarchical manner.",
    tags: ["design", "methodology", "systems"],
    createdAt: new Date("2023-10-18"),
    updatedAt: new Date("2023-10-20"),
    connectedThreadIds: ["1", "5"] // Connecting to Design Thinking and Whitespace
  },
  {
    id: "3",
    title: "Dieter Rams' 10 Principles",
    content: "Good design is innovative. Good design makes a product useful. Good design is aesthetic. Good design makes a product understandable. Good design is unobtrusive. Good design is honest. Good design is long-lasting. Good design is thorough down to the last detail. Good design is environmentally-friendly. Good design is as little design as possible.",
    tags: ["design", "principles", "minimalism"],
    createdAt: new Date("2023-10-22"),
    updatedAt: new Date("2023-10-22"),
    connectedThreadIds: ["1", "4"] // Connecting to Design Thinking and Jony Ive
  },
  {
    id: "4",
    title: "Jony Ive on Simplicity",
    content: "Simplicity is not the absence of clutter; that's a consequence of simplicity. Simplicity is somehow essentially describing the purpose and place of an object and product. The absence of clutter is just a clutter-free product. That's not simple.",
    tags: ["design", "simplicity", "apple"],
    createdAt: new Date("2023-10-25"),
    updatedAt: new Date("2023-10-27"),
    connectedThreadIds: ["3", "6"] // Connecting to Dieter Rams and Typography
  },
  {
    id: "5",
    title: "The Power of Whitespace",
    content: "Whitespace is the empty space between elements in a design composition. Despite its name, whitespace doesn't need to be white. It's found in the margins, padding, and spaces between columns, lines of text, graphics, and other elements. Whitespace creates balance, helps with visual hierarchy, improves readability, and creates a feeling of sophistication.",
    tags: ["design", "whitespace", "composition"],
    createdAt: new Date("2023-11-01"),
    updatedAt: new Date("2023-11-02"),
    connectedThreadIds: ["2", "7"] // Connecting to Atomic Design and Color Theory
  },
  {
    id: "6",
    title: "Typography in UI Design",
    content: "Typography is a critical component of user interface design. It's not just about making the text readable, but also about conveying the right emotion and personality. The choice of typeface, font size, line height, letter spacing, and color all contribute to the overall user experience.",
    tags: ["design", "typography", "UI"],
    createdAt: new Date("2023-11-05"),
    updatedAt: new Date("2023-11-05"),
    connectedThreadIds: ["4", "7"] // Connecting to Jony Ive and Color Theory
  },
  {
    id: "7",
    title: "Color Theory Basics",
    content: "Color theory is both the science and art of using color. It explains how humans perceive color, and the visual effects of how colors mix, match or contrast with each other. Color theory also involves the messages colors communicate and the methods used to replicate color.",
    tags: ["design", "color", "theory"],
    createdAt: new Date("2023-11-10"),
    updatedAt: new Date("2023-11-12"),
    connectedThreadIds: ["5", "6"] // Connecting to Whitespace and Typography
  }
];

export const findNoteById = (id: string, notes: Note[] = sampleNotes): Note | undefined => {
  const topLevelNote = notes.find(note => note.id === id);
  if (topLevelNote) return topLevelNote;
  
  for (const note of notes) {
    if (note.replies && note.replies.length > 0) {
      const foundInReplies = findNoteById(id, note.replies);
      if (foundInReplies) return foundInReplies;
    }
  }
  
  return undefined;
};

// New function to find connected threads
export const findConnectedThreads = (noteId: string, notes: Note[] = sampleNotes): Note[] => {
  const note = findNoteById(noteId, notes);
  if (!note || !note.connectedThreadIds || note.connectedThreadIds.length === 0) {
    return [];
  }
  
  return notes.filter(n => note.connectedThreadIds?.includes(n.id));
};

