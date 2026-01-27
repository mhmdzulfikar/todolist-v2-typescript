import React from 'react';

// 1. KONTRAK KERJA (Interface)
// Ini aturan main: Siapapun yang mau pake komponen ini, WAJIB setor data ini.
interface TodoInputProps {
  value: string;                            // Teks yang lagi diketik
  onChange: (val: string) => void;          // Function buat update state di induk
  onAdd: () => void;                        // Function buat nambah task pas tombol dipencet
  loading?: boolean;                        // (Opsional) Buat disable input kalau lagi loading
}

const TodoInput = ({ value, onChange, onAdd, loading = false }: TodoInputProps) => {

  // 2. EVENT HANDLING STRICT TYPE
  // "e" itu apa? TypeScript harus tau ini event perubahan di elemen Input HTML.
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value); // Kirim value-nya aja ke induk
  };

  // Biar bisa tekan "Enter" buat submit
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && value.trim() !== "") {
      onAdd();
    }
  };

  return (
    <div className="flex gap-2 mb-6">
      {/* INPUT */}
      <input
        type="text"
        className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
        placeholder="Mau ngapain hari ini?"
        value={value}
        onChange={handleChange}     // Panggil handler di atas
        onKeyDown={handleKeyDown}   // Panggil handler enter
        disabled={loading}
      />

      {/* BUTTON ADD */}
      <button
        onClick={onAdd}
        disabled={loading || value.trim() === ""}
        className="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 disabled:opacity-50 transition-colors font-bold"
      >
        {loading ? '...' : '+ Add'}
      </button>
    </div>
  );
};

export default TodoInput;