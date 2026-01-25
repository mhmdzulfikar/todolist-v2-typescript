// =========================================================================
// [POS 3] MODEL (GUDANG & ATURAN)
// Lokasi: backend/models/SnippetModel.js
// Tugas:
// 1. Menentukan "Bentuk Data" (Schema).
// 2. Validasi terakhir. Kalau Controller (POS 2) lolosin data jelek, 
//    POS 3 ini yang bakal nolak (Error).
// =========================================================================

// 1. Ambil "DataTypes" dari Sequelize
// Ibarat ngambil meteran/timbangan. Kita butuh ini buat nentuin
// apakah data itu Huruf (STRING), Angka (INTEGER), atau Paragraf Panjang (TEXT).
const { DataTypes } = require('sequelize');

// 2. Ambil Koneksi Database
// Ini kabel yang nyambungin kodingan lu ke Database postgres.
const db = require('../config/database');

// 3. Definisi Tabel 'Snippet'
// [POS 3] Inilah "Buku Peraturan"-nya. 
// Setiap kali Controller (POS 2) mau simpan data, Sequelize baca aturan ini dulu.
const Snippet = db.define('Snippet', {
    
    // KOLOM 1: JUDUL
    title: { 
        type: DataTypes.STRING, // Tipe data teks pendek (maks 255 karakter)
        // [POS 3 VALIDASI] 
        // Kalau Frontend & Controller lupa ngecek, Model bakal teriak: "Gak boleh Null!"
        allowNull: false        
    },

    // KOLOM 2: BAHASA PEMROGRAMAN
    language: { 
        type: DataTypes.STRING, 
        // [POS 3 AUTO-FILL]
        // Kalau data masuk tanpa bahasa, otomatis diisi 'javascript'
        defaultValue: 'javascript' 
    }, 

    // KOLOM 3: KODE PROGRAM
    code: { 
        type: DataTypes.TEXT,   // [PENTING] Pake TEXT, bukan STRING.
                                // Karena kodingan itu bisa panjang banget (ribuan baris).
                                // STRING cuma muat dikit (varchar 255).
        allowNull: false        // Wajib ada kodenya dong
    }, 

    // KOLOM 4: PEMILIK (Foreign Key)
    userId: { 
        type: DataTypes.INTEGER, // ID itu pasti Angka Bulat (1, 2, 3...)
        // [POS 3 SECURITY]
        // Data yatim piatu (nggak ada pemiliknya) bakal DITOLAK masuk database.
        allowNull: false         
    }
}, {
    // OPSI TAMBAHAN
    // freezeTableName: true -> "JANGAN UBAH! Tetep pake nama 'Snippet' aja."
    freezeTableName: true
});

// Export biar bisa dipake di Controller (POS 2)
module.exports = Snippet;