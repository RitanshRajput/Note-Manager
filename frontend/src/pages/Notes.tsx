import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import NoteForm from "../components/NoteForm";
import { FaTrash } from "react-icons/fa";
import { FiEdit } from "react-icons/fi";

interface Note {
  _id: string;
  title: string;
  content: string;
}

const Notes: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const token = localStorage.getItem("token"); // Retrieve the token
        const response = await fetch("http://127.0.0.1:5000/api/notes", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.status === 401) {
          navigate("/login"); // Redirect to login if unauthorized
        } else {
          const data = await response.json();
          console.log("Fetched notes data:", data);
          if (Array.isArray(data.notes)) {
            setNotes(data.notes);
          } else {
            console.error("Unexpected data format:", data);
            setNotes([]);
          }
        }
      } catch (error) {
        console.error("Error fetching notes:", error);
      }
    };
    fetchNotes();
  }, [navigate]);

  const addNote = async (title: string, content: string) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("http://127.0.0.1:5000/api/notes/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title, content }),
      });
      if (response.ok) {
        const newNote = await response.json();
        setNotes([...notes, newNote]); // add the new note to the list
      }
    } catch (error) {
      console.error("Error adding notes: ", error);
    }
  };

  const deleteNote = async (id: string) => {
    try {
      const token = localStorage.getItem("token");
      await fetch(`http://127.0.01:5000/api/notes/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setNotes(notes.filter((note) => note._id !== id));
    } catch (error) {
      console.error("Error deleting note:", error);
    }
  };

  const updateNote = async (
    id: string,
    updatedTitle: string,
    updatedContent: string
  ) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`http://127.0.0.1:5000/api/notes/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ title: updatedTitle, content: updatedContent }),
      });
      if (response.ok) {
        const updatedNote = await response.json();
        setNotes(notes.map((note) => (note._id == id ? updatedNote : note)));
        setEditingNote(null);
      }
    } catch (error) {
      console.error("Error updating note:", error);
    }
  };

  const handleEdit = (note: Note) => {
    setEditingNote(note);
  };

  const handleLogout = () => {
    localStorage.removeItem("token"); //remove token on logout
    navigate("/");
  };

  return (
    <div className="p-8 ">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl text-neonOceanBlue">Your Notes</h1>
        <button
          onClick={handleLogout}
          className="bg-neonOceanBlue text-smokeWhite py-2 px-4 rounded"
        >
          Logout
        </button>
      </div>
      <NoteForm
        addNote={addNote}
        editingNote={editingNote}
        updateNote={updateNote}
      />{" "}
      {/* Note creation form */}
      <div className="p-4 flex flex-col items-center gap-6">
        {notes.map((note) => (
          <div
            key={note._id}
            className="bg-pitchBlack p-4 border border-red-700 rounded shadow-md"
          >
            <h2 className="text-2xl text-pink-700 mb-2 capitalize">
              {note.title}
            </h2>
            <p className="text-lg text-whiteSmoke capitalize">{note.content}</p>
            <div className="flex justify-end mt-4">
              <button
                onClick={() => handleEdit(note)}
                className="text-yellow-500 mr-2"
              >
                <FiEdit />
              </button>
              <button
                onClick={() => deleteNote(note._id)}
                className="text-red-500"
              >
                <FaTrash />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Notes;
