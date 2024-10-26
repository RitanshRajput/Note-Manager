import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import NoteForm from "../components/NoteForm";
import { FaTrash } from "react-icons/fa";
import { FiEdit } from "react-icons/fi";
import { CiMenuKebab } from "react-icons/ci";
import { AiOutlinePlus } from "react-icons/ai";

interface Note {
  _id: string;
  title: string;
  content: string;
  image?: string;
}

const Notes: React.FC = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [editingNote, setEditingNote] = useState<Note | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showForm, setShowForm] = useState(false);
  const [showEditDelete, setShowEditDelete] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchNotes = async () => {
      try {
        const token = localStorage.getItem("token");
         const response = await fetch(`http://127.0.0.1:5000/api/notes?page=${page}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.status === 401) {
          navigate("/login");
        } else {
          const data = await response.json();
          if (Array.isArray(data.notes)) {
            setNotes(data.notes);
            setTotalPages(data.totalPages);
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
  }, [navigate, page, showForm]);

  const addNote = async (title: string, content: string, image: File | null) => {
    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("title", title);
      formData.append("content", content);
      if (image) {
        formData.append("image", image);
      }

      const response = await fetch("http://127.0.0.1:5000/api/notes/create", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });
      if (response.ok) {
        const newNote = await response.json();
        setNotes([...notes, newNote]);
      }
    } catch (error) {
      console.error("Error adding notes: ", error);
    }
  };

  const deleteNote = async (id: string) => {
    try {
      const token = localStorage.getItem("token");
      await fetch(`http://127.0.0.1:5000/api/notes/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setNotes(notes.filter((note) => note._id !== id));
      handleCloseForm();
    } catch (error) {
      console.error("Error deleting note:", error);
    }
  };

  const updateNote = async (
    id: string,
    updatedTitle: string,
    updatedContent: string,
    image: File | null
  ) => {
    try {
      const token = localStorage.getItem("token");
      const formData = new FormData();
      formData.append("title", updatedTitle);
      formData.append("content", updatedContent);
      if (image) {
        formData.append("image", image);
      }

      const response = await fetch(`http://127.0.0.1:5000/api/notes/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });
      if (response.ok) {
        const updatedNote = await response.json();
        setNotes(notes.map((note) => (note._id === id ? updatedNote : note)));
        setEditingNote(null);
        handleCloseForm();
      }
    } catch (error) {
      console.error("Error updating note:", error);
    }
  };

  const handleEdit = (note: Note) => {
    setEditingNote(note);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  const handleMenuToggle = (noteId: string) => {
    setShowEditDelete(showEditDelete === noteId ? null : noteId);
  };

  return (
    <div className="p-8 bg-gray-900">
      <div className="flex justify-between items-center mb-6">
        <h1 className=" mt-[-20px] text-4xl text-white font-bold">Note Manager</h1>
        <div className="flex">
          <button onClick={handleLogout} className="bg-red-500  text-black py-2 px-4 rounded mr-2">
            Logout
          </button>
          <button
            onClick={() => {
              setEditingNote(null);
              setShowForm(true);
            }}
            className="bg-neonOceanBlue text-black py-2 px-4 rounded flex items-center border border-white"
          >
            <AiOutlinePlus className="mr-2" />
            New Note
          </button>
        </div>
      </div>

      {showForm && (
        <>
          <div className="fixed inset-0 bg-black opacity-50 z-40" onClick={handleCloseForm} />
          <NoteForm
            addNote={addNote}
            editingNote={editingNote}
            updateNote={updateNote}
            closeForm={handleCloseForm}
          />
        </>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-1 mx-4 my-12 font-mono">
        {notes.map((note) => {
          return (
            <div
              key={note._id}
              className={`rounded-sm shadow-sm bg-gray-500 p-4 relative border border-white`}
            >
              {showEditDelete === note._id && (
                <div className="absolute inset-0 bg-black bg-opacity-30 z-10 flex items-center justify-center">
                  <button
                    onClick={() => setShowEditDelete(null)} // Close the menu
                    className="text-smokeWhite absolute top-1 right-2 text-sm "
                  >
                    Close
                  </button>
                  <div className="flex justify-center space-x-2 z-20">
                    <button
                      onClick={() => handleEdit(note)}
                      className="text-yellow-500 mb-1 py-1 rounded bg-gray-700 hover:bg-gray-600 transition flex items-center w-[35px] h-[35px]"
                    >
                      <FiEdit className="inline-block ml-2" />
                    </button>
                    <button
                      onClick={() => deleteNote(note._id)}
                      className="text-red-500 py-1 px-2 rounded bg-gray-700 hover:bg-gray-600 transition flex items-center w-[35px] h-[35px]"
                    >
                      <FaTrash className="inline-block" />
                    </button>
                  </div>
                </div>
              )}
              <div className="flex justify-between items-center">
                <h2
                  className="text-black text-xl font-bold mb-2 capitalize"
                  style={{
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {note.title}
                </h2>
                <button onClick={() => handleMenuToggle(note._id)}>
                  <CiMenuKebab className="text-white text-xl" />
                </button>
              </div>
              <div>
                <p className="text-black text-md">{note.content}</p>
              </div>
              {note.image && (
                <div className="mb-1">
                  <img src={note.image} alt="note" className="w-32 h-32 border rounded" />
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="flex justify-center mt-4">
        <button
          onClick={() => handlePageChange(page - 1)}
          disabled={page === 1}
          className={`mr-2 bg-blue-500 text-smokeWhite py-2 px-4 rounded border border-white  ${
            page === 1 ? "opacity-35 cursor-not-allowed" : ""
          }`}
        >
          Previous
        </button>
        <span className="text-white mt-2">
          Page {page} of {totalPages}
        </span>
        <button
          onClick={() => handlePageChange(page + 1)}
          disabled={page === totalPages}
          className={`ml-2 bg-blue-500 text-smokeWhite py-2 px-4 rounded border border-white ${
            page === totalPages ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Notes;
