const Note = require('../models/Note');

// Ambil Catatan User
const getNote = async (req, res) => {
    try {
        // Cari note punya user ini
        let note = await Note.findOne({ where: { userId: req.user.userId } });

        // Kalau belum punya, buatin satu yang kosong
        if (!note) {
            note = await Note.create({ 
                title: "My Notes", 
                content: "", 
                userId: req.user.userId 
            });
        }
        res.json(note);
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
}

// Update Catatan
const updateNote = async (req, res) => {
    try {
        const { title, content } = req.body;
        // Cari punya dia, lalu update
        const note = await Note.findOne({ where: { userId: req.user.userId } });
        
        if(note) {
            note.title = title;
            note.content = content;
            await note.save();
        }
        
        res.json({ msg: "Note saved!" });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
}

module.exports = { getNote, updateNote };