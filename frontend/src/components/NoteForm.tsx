import React, { useEffect, useState } from "react";

interface Note {
  _id?: string; // optional for new notes
  title: string;
  content: string;
}

interface NoteFormProps {
  addNote: (title: string, content: string) => void;
  editingNote: Note | null; //new prop for editing
  updateNote: (id: string, title: string, content: string) => void; // new prop for updating
}

const NoteForm: React.FC<NoteFormProps> = ({
  addNote,
  editingNote,
  updateNote,
}) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");

  useEffect(() => {
    if (editingNote) {
      setTitle(editingNote.title);
      setContent(editingNote.content);
    } else {
      setTitle("");
      setContent("");
    }
  }, [editingNote]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingNote) {
      updateNote(editingNote._id!, title, content); // use non-null assertion
    } else {
      addNote(title, content);
    }
    setTitle("");
    setContent("");
  };

  return (
    <div className="flex justify-center items-center">
      <form
        onSubmit={handleSubmit}
        className="bg-grey p-4 rounded border border-yellow-500 shadow-md mb-6 w-[40%]"
      >
        <h2 className="text-3xl text-neonOceanBlue mb-4 text-center capitalize">
          Create a New Note
        </h2>
        <div className="mb-4">
          <label htmlFor="title" className="block mb-2 text-whiteSmoke">
            Title:
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full p-2 border rounded text-black"
            required
            placeholder="Character limit 33"
          />
        </div>
        <div className="mb-4">
          <label htmlFor="content" className="block mb-2 text-whiteSmoke">
            Content:
          </label>
          <textarea
            id="content"
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full p-2 border rounded text-black"
            required
          />
        </div>
        <button
          type="submit"
          className="bg-neonOceanBlue text-smokeWhite py-2 px-4 rounded"
        >
          {editingNote ? "Update Note" : "Add Note"}
        </button>
      </form>
    </div>
  );
};

export default NoteForm;
