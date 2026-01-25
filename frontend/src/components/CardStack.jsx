import React, { useState } from "react";

const CardStack = () => {
  const [open, setOpen] = useState(false);

  // posisi initial sama seperti UI asli kamu
  const [cards, setCards] = useState([
    {
      id: 1,
      color: "#897085",
      rotate: "10deg",
      label: "Card 1",
      startIndex: 1, // paling belakang
    },
    {
      id: 2,
      color: "#d18e9f",
      rotate: "-30deg",
      label: "Card 2",
      startIndex: 2, // tengah
    },
    {
      id: 3,
      color: "#ffffff",
      rotate: "40deg",
      label: "Card 3",
      startIndex: 3, // paling depan
    },
  ]);

  // klik kartu → pindah ke paling depan
  const bringToFront = (index) => {
    const newCards = [...cards];
    const selected = newCards.splice(index, 1)[0];
    newCards.push(selected); // pindah ke belakang array = paling depan secara visual
    setCards(newCards);
  };

  return (
    <>
      <div className="flex justify-center items-center h-screen w-full">
        <div className="relative w-[180px] h-[280px]">

          {cards.map((card, i) => (
            <div
              key={card.id}
              onClick={() => open && bringToFront(i)}
              className={`
                absolute w-full h-full rounded-2xl flex justify-center items-center
                shadow-[0_7px_29px_0_rgba(100,100,111,0.2)]
                cursor-pointer select-none
                transition-all duration-300 origin-bottom
                ${open ? "text-[#897085] hover:-translate-y-5" : "text-transparent"}
              `}
              style={{
                backgroundColor: card.color,
                zIndex: i + 1,                         // UI fix: card putih tetap paling depan
                transform: open
                  ? `rotate(${card.rotate})`
                  : "rotate(0deg)",
              }}
            >
              {card.label}
            </div>
          ))}

        </div>
      </div>

      {/* NAV CIRCLE */}
      <button
        onClick={() => setOpen(!open)}
        className={`
          w-[100px] h-[100px] bg-[#897085]
          fixed bottom-20 left-1/2 -translate-x-1/2
          rounded-full shadow-[0_0_29px_rgba(100,100,111,0.28)]
          transition-transform duration-300
          ${open ? "rotate-180" : ""}
        `}
      >
        <span className="text-white text-4xl">
          {open ? "✖" : "☰"}
        </span>
      </button>
    </>
  );
};

export default CardStack;
