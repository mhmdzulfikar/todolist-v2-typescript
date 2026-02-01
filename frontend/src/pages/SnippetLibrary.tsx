import { useSnippets } from "../hooks/useSnippets"; 
import { useState } from "react";
import { FaSearch, FaPlus, FaTrash, FaCopy, FaPencilAlt, FaCode } from "react-icons/fa";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { vscDarkPlus } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Snippet } from "../types/snippet"; // Import 'Snippet'

// Definisi State Form (ID kita bikin number biasa aja, default 0 kalo create)
interface SnippetFormState {
    id: number;
    title: string;
    language: string;
    code: string;
}

const SnippetLibrary: React.FC = () => {
  // 🔥 PANGGIL OTAKNYA
  const { snippets, loading, createSnippet, deleteSnippet, updateSnippet } = useSnippets();

  const [searchTerm, setSearchTerm] = useState(""); 
  const [isModalOpen, setIsModalOpen] = useState(false);
  
  // Default ID 0 artinya "Mode Create"
  const [formData, setFormData] = useState<SnippetFormState>({ 
      id: 0, 
      title: "", 
      language: "javascript", 
      code: "" 
  });

  // Helper Warna (Tadi kode lu ilang bagian ini)
  const getLangColor = (lang: string) => {
    switch(lang) {
        case 'javascript': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
        case 'css': return 'bg-blue-100 text-blue-700 border-blue-200';
        case 'html': return 'bg-orange-100 text-orange-700 border-orange-200';
        case 'python': return 'bg-green-100 text-green-700 border-green-200';
        case 'jsx': return 'bg-cyan-100 text-cyan-700 border-cyan-200';
        case 'sql': return 'bg-purple-100 text-purple-700 border-purple-200';
        default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let success = false;

    // Cek ID: Kalau 0 berarti Create, kalau ada angka berarti Update
    if (formData.id !== 0) {
        success = await updateSnippet(formData.id, formData);
    } else {
        // Pas create, kita buang ID-nya karena service minta 'SnippetInput' (tanpa ID)
        const { id, ...dataToCreate } = formData;
        success = await createSnippet(dataToCreate);
    }

    if (success) {
        setIsModalOpen(false);
        setFormData({ id: 0, title: "", language: "javascript", code: "" });
        alert("Berhasil bos! 🎉");
    } else {
        alert("Gagal bos 😢");
    }
  };

  const handleDelete = (id: number) => {
      if(confirm("Yakin hapus?")) {
          deleteSnippet(id);
      }
  };

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    alert("Code copied successfully!");
  };

  // Fix Typo: parameternya 'snippet' tipe datanya 'Snippet'
  const handleEditClick = (snippet: Snippet) => {
      setFormData({
          id: snippet.id,
          title: snippet.title,
          language: snippet.language,
          code: snippet.code
      });
      setIsModalOpen(true);
  };

  const filteredSnippets = snippets.filter((snip) => {
    if (!snip) return false;
    const term = searchTerm.toLowerCase();
    const title = snip.title ? snip.title.toLowerCase() : "";
    const lang = snip.language ? snip.language.toLowerCase() : "";
    return title.includes(term) || lang.includes(term);
  });

  if (loading) return <p className="text-center mt-10">Loading data...</p>;

  return (
    <div className="w-full max-w-7xl mx-auto p-4">

        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
            <div>
                <h1 className=" text-4xl font-extrabold tracking-tight text-gray-900 flex items-center gap-3">
                    {/* Fix Tailwind Class: bg-gradient-to-r */}
                    <span className="bg-clip-text text-transparent bg-blue-to-r from-indigo-500 to-purple-600">
                        Code Library
                    </span>
                </h1>
                <p className="text-gray-500 mt-2 text-lg">
                    A collection of secret snippets to speed up your coding.
                </p>
            </div>
            
            <div className="flex items-center gap-4">
                <div className="relative group">
                    <FaSearch className="absolute left-3 top-3 text-gray-400 group-focus-within:text-indigo-500 transition-colors"/>
                    <input 
                        type="text"
                        placeholder="Search snippet..."
                        className="pl-10 pr-4 py-3 rounded-full bg-white border border-gray-200 focus:ring-2 focus:ring-indigo-500 outline-none shadow-sm w-64 transition-all"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>

                <button 
                    onClick={() => {
                        setFormData({ id: 0, title: "", language: "javascript", code: "" });
                        setIsModalOpen(true);
                    }}
                    className="group relative inline-flex items-center justify-center px-8 py-3 font-semibold text-white transition-all duration-200 bg-indigo-600 font-lg rounded-full hover:bg-indigo-700 shadow-lg hover:-translate-y-0.5"
                >
                    <FaPlus className="mr-2 group-hover:rotate-90 transition-transform duration-300" /> 
                    New Snippet
                </button>
            </div>
        </div>

        {/* Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pb-10">
            {filteredSnippets.map((snip) => (
                <div key={snip.id} className="group flex flex-col bg-white rounded-2xl shadow-sm border border-gray-200 hover:shadow-xl hover:border-indigo-500 transition-all duration-300 hover:-translate-y-1">
                    
                    <div className="px-5 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50/50">
                        <div className="flex items-center gap-3">
                            <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getLangColor(snip.language)} uppercase tracking-wider`}>
                                {snip.language}
                            </span>
                            <h3 className="font-semibold text-gray-800 truncate max-w-[200px]" title={snip.title}>
                                {snip.title}
                            </h3>
                        </div>
                        
                        <div className="flex gap-1 opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                            <button onClick={() => handleEditClick(snip)} className="p-2 text-gray-400 hover:text-yellow-500 hover:bg-yellow-50 rounded-lg transition-colors" title="Edit">
                                <FaPencilAlt /> 
                            </button>
                            <button onClick={() => handleCopy(snip.code)} className="p-2 text-gray-400 hover:text-indigo-500 hover:bg-indigo-50 rounded-lg transition-colors" title="Copy">
                                <FaCopy />
                            </button>
                            <button onClick={() => handleDelete(snip.id)} className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors" title="Delete">
                                <FaTrash />
                            </button>
                        </div>
                    </div>

                    <div className="flex-1 relative group-hover:bg-[#1e1e1e] transition-colors bg-[#2d2d2d] rounded-b-2xl overflow-hidden">
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

      {/* MODAL FORM */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-900/70 backdrop-blur-sm flex items-center justify-center z-50 p-4 transition-all">
             <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-gray-200 overflow-hidden transform transition-all scale-100">
                <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                    <h2 className="text-lg font-bold text-gray-800">
                        {formData.id !== 0 ? "Edit Snippet" : "Create New Snippet"}
                    </h2>
                    <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-red-500 transition-colors">
                        <FaPlus className="rotate-45 text-xl" />
                    </button>
                </div>
                
                <form onSubmit={handleSubmit} className="p-6 space-y-5">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                        <div className="md:col-span-2 space-y-2">
                            <label className="text-sm font-semibold text-gray-700">Snippet Title</label>
                            <input type="text" required 
                                className="w-full px-4 py-2.5 rounded-lg bg-gray-50 border border-gray-200 text-gray-900 focus:ring-2 focus:ring-indigo-500 outline-none transition-all" 
                                placeholder="Example: Navbar Responsive" 
                                value={formData.title} onChange={e => setFormData({...formData, title: e.target.value})} />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-semibold text-gray-700">Language</label>
                            <select 
                                className="w-full px-4 py-2.5 rounded-lg bg-gray-50 border border-gray-200 text-gray-900 focus:ring-2 focus:ring-indigo-500 outline-none" 
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
                        <label className="text-sm font-semibold text-gray-700">Code</label>
                        <div className="relative">
                            <textarea required 
                                className="w-full h-60 px-4 py-4 rounded-lg bg-[#2d2d2d] text-gray-100 font-mono text-sm focus:ring-2 focus:ring-indigo-500 outline-none resize-none border border-gray-700" 
                                placeholder="// Paste your magic code here..." 
                                value={formData.code} onChange={e => setFormData({...formData, code: e.target.value})}></textarea>
                            <FaCode className="absolute bottom-4 right-4 text-gray-600 text-xl" />
                        </div>
                    </div>
                    <div className="flex justify-end pt-2">
                        <button type="submit" className="bg-blue-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-8 py-2.5 rounded-lg font-bold shadow-lg transform transition-transform active:scale-95">
                            {formData.id !== 0 ? "Update Changes" : "Save to Library"}
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