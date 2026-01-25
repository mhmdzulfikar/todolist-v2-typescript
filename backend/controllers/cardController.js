const Card = require("../models/Card");

// 1. Get All Cards
const getCards = async (req, res) => {
  try {
    let cards = await Card.findAll();

    // Auto-seed if empty
    if (cards.length === 0) {
      const defaults = [
        {
          title: "Progress Project",
          desc: "Integrasi TodoChat",
          color: "bg-blue-500",
          status: "progress",
        },
        {
          title: "Bug Fixing",
          desc: "Fix login issue",
          color: "bg-red-500",
          status: "progress",
        },
        {
          title: "Finance Tracking",
          desc: "Keuangan module",
          color: "bg-orange-500",
          status: "future",
        },
        {
          title: "AI Assistant",
          desc: "Chatbot integration",
          color: "bg-purple-500",
          status: "future",
        },
      ];
      await Card.bulkCreate(defaults);
      cards = await Card.findAll();
    }

    res.json(cards);
  } catch (error) {
    console.error("Error fetching cards:", error); // Log error to terminal
    res.status(500).json({ msg: error.message });
  }
};

// 2. Create Card
const createCard = async (req, res) => {
  try {
    const { title, desc, status } = req.body;
    const colors = [
      "bg-blue-500",
      "bg-red-500",
      "bg-green-500",
      "bg-yellow-500",
      "bg-purple-500",
      "bg-pink-500",
    ];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];

    const newCard = await Card.create({
      title,
      desc,
      status: status || "progress",
      color: randomColor,
    });

    res.status(201).json(newCard);
  } catch (error) {
    console.error("Error creating card:", error); // Log error to terminal
    res.status(500).json({ msg: error.message });
  }
};

// 3. Update Card Status
const updateCardStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    await Card.update({ status }, { where: { id } });
    res.json({ msg: "Card Moved!" });
  } catch (error) {
    console.error("Error updating card:", error); // Log error to terminal
    res.status(500).json({ msg: error.message });
  }
};

const deleteCard = async (req, res) => {
    try {
        await Card.destroy({
            where: { id: req.params.id }
        });
        res.json({ msg: "Card Deleted" });
    } catch (error) {
        res.status(500).json({ msg: error.message });
    }
}

// 🔥 IMPORTANT: Export as an object
module.exports = { getCards, createCard, updateCardStatus, deleteCard };
