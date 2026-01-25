import React, { useState, useEffect } from "react";

// 🔥 GANTI IMPORT LAMA DENGAN INI:
import ReactQuill from "react-quill-new"; 
import "react-quill-new/dist/quill.snow.css"; 

import { getNote, updateNote } from "../services/api";
import { FaSave } from "react-icons/fa";

const NotePad = () => {
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("My Notes");
  const [isSaving, setIsSaving] = useState(false);

  // Load Note saat pertama buka
  useEffect(() => {
    const fetchNote = async () => {
      try {
        const data = await getNote();
        setTitle(data.title);
        setContent(data.content || "");
      } catch (error) {
        console.error("Gagal load note", error);
      }
    };
    fetchNote();
  }, []);

  // Fungsi Simpan Manual
  const handleSave = async () => {
    setIsSaving(true);
    try {
      await updateNote({ title, content });
      setTimeout(() => setIsSaving(false), 1000); // Efek loading bentar
    } catch (error) {
      console.error("Gagal simpan", error);
      setIsSaving(false);
    }
  };

  // Konfigurasi Toolbar (Mirip Notion/Word)
  const modules = {
    toolbar: [
      [{ 'header': [1, 2, false] }],
      ['bold', 'italic', 'underline', 'strike'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      ['blockquote', 'code-block'],
      ['clean']
    ],
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 h-full flex flex-col overflow-hidden">
      {/* Header Note */}
      <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
        <input 
            type="text" 
            value={title} 
            onChange={(e) => setTitle(e.target.value)}
            className="bg-transparent font-bold text-xl text-gray-800 outline-none w-full"
            placeholder="Untitled Page"
        />
        <button 
            onClick={handleSave}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all
                ${isSaving ? "bg-green-100 text-green-700" : "bg-indigo-600 text-white hover:bg-indigo-700"}`}
        >
            <FaSave /> {isSaving ? "Saved!" : "Save"}
        </button>
      </div>

      {/* Editor Area */}
      <div className="flex-1 overflow-y-auto">
        <ReactQuill 
            theme="snow" 
            value={content} 
            onChange={setContent} 
            modules={modules}
            className="h-full border-none"
            placeholder="Write something awesome..."
        />
      </div>
    </div>
  );
};

export default NotePad;