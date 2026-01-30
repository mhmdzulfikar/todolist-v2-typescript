// =========================================================================
// [POS 1] FRONTEND (LAYAR UTAMA)
// Lokasi: src/components/SnippetLibrary.jsx
// =========================================================================

import React, { useState, useEffect } from "react";
// Tambahin FaPencilAlt buat icon edit
import { FaPlus, FaTrash, FaCopy, FaCode, FaSearch, FaPencilAlt } from "react-icons/fa";
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'; 

// 🔥 PERBAIKAN 1: Hapus import ganda. Cukup satu baris ini aja & pastikan ada 'updateSnippet'
import { getSnippets, createSnippet, deleteSnippet, updateSnippet } from "../services/api";

const SnippetLibrary = () => {
  const [snippets, setSnippets] = useState([]); 
  const [searchTerm, setSearchTerm] = useState(""); 
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [formData, setFormData] = useState({ title: "", language: "javascript", code: "" });
  const [refreshKey, setRefreshKey] = useState(0);

  // Helper warna badge bahasa
  const getLangColor = (lang) => {
    switch(lang) {
        case 'javascript': return 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300 border-yellow-200 dark:border-yellow-700';
        case 'css': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300 border-blue-200 dark:border-blue-700';
        case 'html': return 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300 border-orange-200 dark:border-orange-700';
        case 'python': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300 border-green-200 dark:border-green-700';
        case 'jsx': return 'bg-cyan-100 text-cyan-700 dark:bg-cyan-900/30 dark:text-cyan-300 border-cyan-200 dark:border-cyan-700';
        case 'sql': return 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300 border-purple-200 dark:border-purple-700';
        default: return 'bg-gray-100 text-gray-700 dark:bg-gray-700 dark:text-gray-300 border-gray-200 dark:border-gray-600';
    }
  };

  // 1. FETCH DATA (READ)
  useEffect(() => {
    const fetchData = async () => { 
      try { 
        const data = await getSnippets();
        setSnippets(data); 
      } catch (error) { 
        console.error("Gagal ambil data", error);
        // Data dummy kalo backend mati
        setSnippets([
             { id: 1, title: 'Format Rupiah', language: 'javascript', code: 'const idr = (n) => `Rp ${n}`' },
             { id: 2, title: 'Flex Center', language: 'css', code: '.center { display: flex; justify-content: center; }' }
        ]);
      }
    };
    fetchData(); 
  }, [refreshKey]); 

  // 2. HANDLE SUBMIT (CREATE & UPDATE)
  const handleSubmit = async (e) => {
    e.preventDefault(); 
    try {
        // 🔥 PERBAIKAN 2: Logika Cerdas (Update vs Create)
        if (formData.id) {
            // Kalau ada ID -> UPDATE
            await updateSnippet(formData.id, formData);
            alert("Berhasil di-update! 🚀");
        } else {
            // Kalau gak ada ID -> CREATE BARU
            await createSnippet(formData);
            alert("Berhasil disimpan! 🎉");
        }

        // Reset & Refresh
        setIsModalOpen(false);
        setFormData({ title: "", language: "javascript", code: "" }); 
        setRefreshKey(oldKey => oldKey + 1); 
    } catch (error) { 
        console.error(error);
        alert("Gagal menyimpan data.");
    }
  };

  // 3. HANDLE DELETE
  const handleDelete = async (id) => {
    if(confirm("Hapus kode ini?")) {
        await deleteSnippet(id);
        setRefreshKey(oldKey => oldKey + 1);
    }
  };

  // 4. HANDLE COPY
  const handleCopy = (code) => {
    navigator.clipboard.writeText(code);
    alert("Code copied successfully!");
  };

  // 5. HANDLE EDIT CLICK (Persiapan Form)
  const handleEditClick = (snippet) => {
      // Isi form dengan data lama
      setFormData({
          id: snippet.id, // PENTING: ID Disimpan biar tau mau update yang mana
          title: snippet.title,
          language: snippet.language,
          code: snippet.code
      });
      setIsModalOpen(true);
  };

  // Logic Search Filter
  const filteredSnippets = snippets.filter((snip) => {
    if (!snip) return false;
    const term = searchTerm.toLowerCase();
    const title = snip.title ? snip.title.toLowerCase() : "";
    const lang = snip.language ? snip.language.toLowerCase() : "";
    return title.includes(term) || lang.includes(term);
  });

  return (
    <div className="w-full max-w-7xl mx-auto">

        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
            <div>
                <h1 className=" text-4xl font-extrabold tracking-tight text-gray-900 dark:text-blue flex items-center gap-3">
                    <span className="bg-linear-to-r bg-clip-text text-transparent from-indigo-500 to-purple-600">
                        Code Library
                    </span>
                </h1>
                <p className="text-gray-500 dark:text-gray-400 mt-2 text-lg">
                    A collection of secret snippets to speed up your coding.
                </p>
            </div>
            
            {/* Search Bar & Add Button */}
            <div className="flex items-center gap-4">
                <div className="relative group">
                    <FaSearch className="absolute left-3 top-3 text-gray-400 group-focus-within:text-indigo-500 transition-colors"/>
                    <input 
                        type="text"
                        placeholder="Search snippet..."
                        className="pl-10 pr-4 py-3 rounded-full bg-white dark:bg-[#1e1e1e] border border-gray-200 dark:border-gray-700 focus:ring-2 focus:ring-indigo-500 outline-none shadow-sm w-64 transition-all"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                {/* Tombol NEW SNIPPET (Utama) */}
                <button 
                    onClick={() => {
                        // 🔥 PERBAIKAN 3: Reset form dulu sebelum buka modal (biar ID sisa edit hilang)
                        setFormData({ title: "", language: "javascript", code: "" });
                        setIsModalOpen(true);
                    }}
                    className="group relative inline-flex items-center justify-center px-8 py-3 font-semibold text-white transition-all duration-200 bg-indigo-600 font-lg rounded-full hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600 shadow-lg shadow-indigo-500/30 hover:-translate-y-0.5"
                >
                    <FaPlus className="mr-2 group-hover:rotate-90 transition-transform duration-300" /> 
                    New Snippet
                </button>
            </div>
        </div>

        {/* Grid Layout (Daftar Kartu) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pb-10">
            {filteredSnippets.map((snip) => (
                <div key={snip.id} className="group flex flex-col bg-white dark:bg-[#1e1e1e] rounded-2xl shadow-sm border border-gray-200 dark:border-gray-800 hover:shadow-xl hover:border-indigo-500 transition-all duration-300 hover:-translate-y-1">
                    
                    {/* Card Header */}
                    <div className="px-5 py-4 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center bg-gray-50/50 dark:bg-[#252526]">
                        <div className="flex items-center gap-3">
                            <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getLangColor(snip.language)} uppercase tracking-wider`}>
                                {snip.language}
                            </span>
                            <h3 className="font-semibold text-gray-800 dark:text-gray-100 truncate max-w-[200px]" title={snip.title}>
                                {snip.title}
                            </h3>
                        </div>
                        
                        <div className="flex gap-1 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                            
                            {/* Tombol EDIT */}
                            <button onClick={() => handleEditClick(snip)} className="p-2 text-gray-400 hover:text-yellow-500 hover:bg-yellow-50 dark:hover:bg-yellow-900/20 rounded-lg transition-colors" title="Edit">
                                <FaPencilAlt /> 
                            </button>

                            {/* 🗑️ HAPUS: Tombol New Snippet yang nyasar di sini sudah dibuang */}

                            {/* Tombol COPY */}
                            <button onClick={() => handleCopy(snip.code)} className="p-2 text-gray-400 hover:text-indigo-500 hover:bg-indigo-50 dark:hover:bg-indigo-900/20 rounded-lg transition-colors" title="Copy">
                                <FaCopy />
                            </button>

                            {/* Tombol DELETE */}
                            <button onClick={() => handleDelete(snip.id)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors" title="Delete">
                                <FaTrash />
                            </button>
                        </div>
                    </div>

                    {/* Code Area */}
                    <div className="flex-1 relative group-hover:bg-[#1e1e1e] transition-colors">
                        <SyntaxHighlighter 
                            language={snip.language} 
                            style={vscDarkPlus} 
                            customStyle={{ 
                                margin: 0, 
                                padding: '1.5rem', 
                                height: '100%', 
                                fontSize: '0.9rem',
                                background: 'transparent' 
                            }}
                            wrapLongLines={true}
                        >
                            {snip.code || ""}
                        </SyntaxHighlighter>
                    </div>
                </div>
            ))}
        </div>

        {/* Empty State */}
        {filteredSnippets.length === 0 && searchTerm !== "" && (
             <div className="text-center py-10 text-gray-500">
                 No snippets found for "{searchTerm}" 😢
             </div>
        )}

      {/* MODAL FORM */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-900/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-all">
             <div className="bg-white dark:bg-[#1e1e1e] w-full max-w-2xl rounded-2xl shadow-2xl border border-gray-200 dark:border-gray-700 overflow-hidden transform transition-all scale-100">
                <div className="px-6 py-4 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center bg-gray-50 dark:bg-[#252526]">
                    {/* Judul Modal Berubah Dinamis */}
                    <h2 className="text-lg font-bold text-gray-800 dark:text-white">
                        {formData.id ? "Edit Snippet" : "Create New Snippet"}
                    </h2>
                    <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-red-500 transition-colors">
                        <FaPlus className="rotate-45 text-xl" />
                    </button>
                </div>
                
                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                        <div className="md:col-span-2 space-y-2">
                            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Snippet Title</label>
                            <input type="text" required 
                                className="w-full px-4 py-2.5 rounded-lg bg-gray-50 dark:bg-[#2d2d2d] border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none transition-all" 
                                placeholder="Example: Navbar Responsive" 
                                value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Language</label>
                            <select 
                                className="w-full px-4 py-2.5 rounded-lg bg-gray-50 dark:bg-[#2d2d2d] border border-gray-200 dark:border-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-indigo-500 outline-none" 
                                value={formData.language} onChange={e => setFormData({...formData, language: e.target.value})}>
                                <option value="javascript">JavaScript</option>
                                <option value="css">CSS</option>
                                <option value="html">HTML</option>
                                <option value="python">Python</option>
                                <option value="jsx">React JSX</option>
                                <option value="sql">SQL</option>
                            </select>
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-semibold text-gray-700 dark:text-gray-300">Code</label>
                        <div className="relative">
                            <textarea required 
                                className="w-full h-60 px-4 py-4 rounded-lg bg-[#2d2d2d] text-gray-100 font-mono text-sm focus:ring-2 focus:ring-indigo-500 outline-none resize-none border border-gray-700" 
                                placeholder="// Paste your magic code here..." 
                                value={formData.code} onChange={e => setFormData({...formData, code: e.target.value})}></textarea>
                            <FaCode className="absolute bottom-4 right-4 text-gray-600 text-xl" />
                        </div>
                    </div>
                    <div className="flex justify-end pt-2">
                        <button type="submit" className="from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-8 py-2.5 rounded-lg font-bold shadow-lg transform transition-transform active:scale-95">
                            {formData.id ? "Update Changes" : "Save to Library"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
      )}
    </div>
  );
};

export default SnippetLibrary;