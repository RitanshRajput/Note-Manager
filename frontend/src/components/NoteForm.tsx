import React, { useEffect, useState } from "react";

interface Note {
  _id?: string; // optional for new notes
  title: string;
  content: string;
  image?: string;
}

interface NoteFormProps {
  addNote: (title: string, content: string, image: File | null) => void;
  editingNote: Note | null;
  updateNote: (id: string, title: string, content: string, image: File | null) => void;
  closeForm: () => void; // New prop to close the form
}

const NoteForm: React.FC<NoteFormProps> = ({ addNote, editingNote, updateNote, closeForm }) => {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  useEffect(() => {
    if (editingNote) {
      setTitle(editingNote.title);
      setContent(editingNote.content);
      setImage(null);
      setImagePreview(editingNote.image || null);
    } else {
      setTitle("");
      setContent("");
      setImage(null);
      setImagePreview(null);
    }
  }, [editingNote]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (editingNote) {
      updateNote(editingNote._id!, title, content, image);
    } else {
      addNote(title, content, image);
    }
    // Reset form
    setTitle("");
    setContent("");
    setImage(null);
    setImagePreview(null);
    closeForm(); // Close the form after submission
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedImage = e.target.files[0];
      setImage(selectedImage);
      const previewUrl = URL.createObjectURL(selectedImage);
      setImagePreview(previewUrl);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 backdrop-blur-sm bg-black">
      <div
        className="bg-opacity-80 p-4 rounded border border-white mb-6 w-[90%] max-w-md relative shadow shadow-fuchsia-200 shadow-md" // Changed width to be responsive
        onClick={(e) => e.stopPropagation()} // Prevent closing when clicking inside the form
      >
        {/* Close button */}
        <button onClick={closeForm} className="absolute top-2 right-2 text-3xl text-white">
          &times; {/* Close icon */}
        </button>
        <h2 className="text-3xl font-bold text-white mb-4 text-center capitalize">
          {editingNote ? "Edit Note" : "Create a New Note"}
        </h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="title" className="block mb-2 text-pitchBlack capitalize text-xl ">
              Title (max 33 characters):
            </label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2 border rounded text-black"
              required
              maxLength={33}
              placeholder="Update the Note code!"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="content" className="block mb-2 text-whiteSmoke capitalize text-xl">
              Content:
            </label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full p-2 border rounded text-black"
              placeholder="Change the color for the note manager form background..."
              required
            />
          </div>

          <div className="mb-4">
            <button
              type="button"
              onClick={() => document.getElementById("imageInput")?.click()}
              className="bg-neonOceanBlue text-smokeWhite py-2 px-4 rounded"
            >
              Upload an Image
            </button>
            <input type="file" id="imageInput" onChange={handleImageChange} className="hidden" />
          </div>
          {imagePreview && (
            <div className="mb-4">
              <img src={imagePreview} alt="preview" className="w-24 h-24 border rounded" />
            </div>
          )}

          <div className="flex justify-center">
            <button type="submit" className="bg-red-500 text-smokeWhite py-2 px-4 rounded">
              {editingNote ? "Update Note" : "Add Note"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NoteForm;
