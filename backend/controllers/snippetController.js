// =========================================================================
// [POS 2] CONTROLLER (OTAK & LOGIKA)
// Lokasi: backend/controllers/SnippetController.js
// Tugas:
// 1. Nerima Request dari Frontend (POS 1).
// 2. Cek izin (Security).
// 3. Suruh Model (POS 3) ambil/simpan/hapus data.
// =========================================================================

// Panggil Model (POS 3) 
// Kita butuh "Buku Aturan" ini buat ngomong sama Database.
const Snippet = require('../models/Snippet'); 

// ==========================================
// 1. LOGIC: AMBIL DATA (READ)
// ==========================================
const getSnippets = async (req, res) => {
    try {
        // [POS 2] STEP 1: Terima Teriakan dari Frontend
        // Frontend bilang: "Woi, minta data dong!"

        // [POS 2] STEP 2: Suruh Model (POS 3) Nyari
        // "Eh Model, tolong cariin data (findAll)..."
        const snippets = await Snippet.findAll({
            
            // [SECURITY LEVEL 1]
            // "Tapi CUMA data milik user yang lagi login ini aja ya."
            // req.user.userId = Didapat otomatis dari Token Login (Middleware).
            where: { 
                userId: req.user.userId 
            }, 

            // [SORTING]
            // "Urutin dari yang paling baru dibuat (DESC)."
            order: [['createdAt', 'DESC']]
        });

        // [POS 2] STEP 3: Lapor Balik ke Frontend
        // "Nih Frontend (POS 1), barangnya udah ketemu."
        res.json(snippets);

    } catch (error) {
        // [PLAN B] Kalau Database Error
        res.status(500).json({ msg: error.message });
    }
}

// ==========================================
// 2. LOGIC: SIMPAN DATA (CREATE)
// ==========================================
const createSnippet = async (req, res) => {
    try {
        // [POS 2] STEP 1: Buka Paket dari Frontend
        // Frontend ngirim data form dalam bungkusan 'req.body'
        const { title, language, code } = req.body; 

        // [POS 2] STEP 2: Suruh Model (POS 3) Simpan
        // "Eh Model, tolong simpen data ini ke Gudang!"
        await Snippet.create({
            title,      // Judul dari form
            language,   // Bahasa dari form
            code,       // Kode dari form
            
            // [SECURITY LEVEL 2]
            // "Tempelin label pemiliknya biar gak ketuker."
            // Kita paksa isi userId pake ID orang yang lagi login.
            userId: req.user.userId 
        });

        // [POS 2] STEP 3: Kasih Kabar Sukses
        // Status 201 = Created (Berhasil Dibuat)
        res.status(201).json({ msg: "Snippet Saved!" });

    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
}


// ==========================================
// 3. LOGIC: HAPUS DATA (DELETE)
// ==========================================
const deleteSnippet = async (req, res) => {
    try {
        // [POS 2] STEP 1: Terima Perintah Hancurkan
        // Frontend bilang: "Hapus dong!"

        // [POS 2] STEP 2: Suruh Model (POS 3) Eksekusi
        await Snippet.destroy({
            where: { 
                // [SYARAT 1] Targetnya Siapa?
                // req.params.id = Angka ID di ujung URL (misal: /snippets/5)
                id: req.params.id, 
                
                // [SYARAT 2 - SECURITY LEVEL DEWA]
                // "Pastiin yang mau dihapus itu PUNYA DIA SENDIRI."
                // Kalau user iseng mau hapus punya orang lain, Database bakal nolak.
                userId: req.user.userId 
            }
        });

        // [POS 2] STEP 3: Lapor Selesai
        res.json({ msg: "Snippet Deleted" });

    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
}

// ==========================================
// 4. LOGIC: EDIT DATA (EDIT)
// ==========================================


const updateSnippet = async (req, res) => {
    try{
        const idSnippet = req.params.id;
        const dataBaru = req.body;
        const idUserYangLogin = req.user.userId; // Dari Token

        // 1. CARI BARANG (READ)
        const snippetLama = await Snippet.findByPk(idSnippet);

        // 2. CEK BARANG ADA NGGAK?
        if (!snippetLama) {
            return res.status(404).json({ msg: "Barang Ghaib/Nggak Ketemu"});
        }

        // 3. SECURITY CHECK (WAJIB)
        if (snippetLama.userId !== idUserYangLogin) {
            return res.status(403).json({ msg: "HEH! MAU NGAPAIN? INI BUKAN PUNYA LO"});
        }

        // 4. UPDATE (ACTION)
        await snippetLama.update(dataBaru);

        // 5. LAPOR SUKSES
        res.json({ msg: "Data Update Successfully", data: snippetLama});
    } catch (error){ // Ketika ada error, Tidak langsung di tampilkan di layar
        res.status(500).json({ msg: error.message });
    }
}

// Bungkus semua fungsi biar bisa dipanggil di Router (Jalan Raya)
module.exports = { getSnippets, createSnippet, deleteSnippet, updateSnippet };