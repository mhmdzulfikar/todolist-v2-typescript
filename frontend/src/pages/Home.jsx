import React, { useState, useEffect, useCallback } from "react";
import {
  DndContext,
  closestCorners,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragOverlay,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
// Import Icon
import { FaPlus, FaTimes, FaTrash } from "react-icons/fa"; // 🔥 Tambah FaTrash
// Import API
import { getCards, updateCardStatus, createCard, deleteCard } from "../services/api";

// --- KOMPONEN KARTU (ITEM) ---
const SortableItem = ({ id, title, desc, color, disabled, onDelete }) => { // 🔥 Tambah props onDelete
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({ id, disabled });
  
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    cursor: disabled ? "default" : "grab",
  };

  return (
    <div ref={setNodeRef} style={style} {...attributes} {...listeners}
      className={`bg-white p-5 rounded-xl shadow-sm hover:shadow-md transition-all border border-transparent h-full relative group
        ${!disabled && "hover:border-indigo-100"} 
        ${isDragging ? "ring-2 ring-indigo-500 z-50" : ""}`}
    >
      <div className={`w-2 h-2 rounded-full mb-3 ${color}`}></div>
      <h3 className="font-bold text-gray-800 mb-1 pr-6">{title}</h3>
      <p className="text-gray-500 text-xs leading-relaxed">{desc}</p>
      
      {disabled && <span className="text-[10px] text-gray-300 mt-2 block italic">🔒 Admin only</span>}

      {/* 🔥 TOMBOL HAPUS (Hanya muncul saat hover & kalau Admin) */}
      {!disabled && (
        <button 
            // onPointerDown stopPropagation biar gak dikira mau nge-drag pas diklik
            onPointerDown={(e) => {
                e.stopPropagation(); 
                if(window.confirm("Hapus kartu ini?")) onDelete(id);
            }}
            className="absolute top-3 right-3 text-gray-300 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer p-1"
            title="Delete Card"
        >
            <FaTrash size={12} />
        </button>
      )}
    </div>
  );
};

// --- HALAMAN HOME UTAMA ---
const Home = () => {
  const [isAdmin] = useState(() => localStorage.getItem("role") === "admin");
  const [items, setItems] = useState({ progress: [], future: [] });
  const [activeId, setActiveId] = useState(null);
  
  // State Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newCardData, setNewCardData] = useState({ title: "", desc: "", status: "progress" });
  
  // Pemicu Refresh
  const [refreshKey, setRefreshKey] = useState(0);

  // 1. LOAD DATA
  useEffect(() => {
    const fetchCards = async () => {
      try {
        const data = await getCards();
        setItems({
          progress: data.filter(i => i.status === 'progress'),
          future: data.filter(i => i.status === 'future')
        });
      } catch (error) { 
          console.error("Gagal load cards:", error); 
      }
    };
    fetchCards();
  }, [refreshKey]);

  // 2. HANDLE TAMBAH DATA
  const handleAddCard = async (e) => {
      e.preventDefault();
      if(!newCardData.title) return;

      try {
          await createCard(newCardData);
          setIsModalOpen(false);
          setNewCardData({ title: "", desc: "", status: "progress" });
          setRefreshKey(prev => prev + 1); // Refresh data
      } catch (error) {
          alert("Gagal menambah kartu");
      }
  };

  // 🔥 3. HANDLE HAPUS DATA (INI YANG DITAMBAHKAN)
  const handleDeleteCard = async (id) => {
      try {
          await deleteCard(id); // Panggil API backend
          setRefreshKey(prev => prev + 1); // Refresh data biar ilang dari layar
      } catch (error) {
          console.error("Gagal menghapus kartu:", error);
          alert("Gagal menghapus kartu");
      }
  };

  // --- DND LOGIC ---
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates })
  );
  
  const findContainer = (id) => {
    if (id in items) return id;
    return Object.keys(items).find((key) => items[key].find((item) => item.id == id)); 
  };

  const handleDragOver = (event) => {
    const { active, over } = event;
    const overId = over?.id;
    if (!overId || active.id === overId) return;
    const activeContainer = findContainer(active.id);
    const overContainer = findContainer(overId);
    if (!activeContainer || !overContainer || activeContainer === overContainer) return;

    setItems((prev) => {
      const activeItems = prev[activeContainer];
      const overItems = prev[overContainer];
      const activeIndex = activeItems.findIndex((i) => i.id == active.id);
      const overIndex = overItems.findIndex((i) => i.id == overId);
      let newIndex;
      if (overId in prev) newIndex = overItems.length + 1;
      else {
        const isBelowOverItem = over && active.rect.current.translated && active.rect.current.translated.top > over.rect.top + over.rect.height;
        const modifier = isBelowOverItem ? 1 : 0;
        newIndex = overIndex >= 0 ? overIndex + modifier : overItems.length + 1;
      }
      return {
        ...prev,
        [activeContainer]: [...prev[activeContainer].filter((item) => item.id != active.id)],
        [overContainer]: [...prev[overContainer].slice(0, newIndex), activeItems[activeIndex], ...prev[overContainer].slice(newIndex, overItems.length)],
      };
    });
  };

  const handleDragEnd = async (event) => {
    const { active, over } = event;
    const activeContainer = findContainer(active.id);
    const overContainer = findContainer(over?.id);

    if (activeContainer && overContainer) {
        const newStatus = overContainer;
        try { await updateCardStatus(active.id, newStatus); } 
        catch (error) { console.error("Gagal update:", error); }

        if (activeContainer === overContainer) {
            const activeIndex = items[activeContainer].findIndex((i) => i.id == active.id);
            const overIndex = items[overContainer].findIndex((i) => i.id == over.id);
            if (activeIndex !== overIndex) {
                setItems((prev) => ({
                ...prev,
                [activeContainer]: arrayMove(prev[activeContainer], activeIndex, overIndex),
                }));
            }
        }
    }
    setActiveId(null);
  };

  const getActiveItem = () => {
    for (const key in items) {
        const found = items[key].find(i => i.id == activeId);
        if(found) return found;
    }
    return null;
  };
  const activeItemData = getActiveItem();

  return (
    <div className="flex min-h-screen bg-gray-100 relative">
      <main className="flex-1 p-8">
        
        <div className="flex justify-between items-center mb-8">
            <div>
                <h1 className="text-2xl font-bold text-gray-800">Progress Board</h1>
                <p className="text-gray-500 text-sm mt-1">Manage project roadmap & ideas</p>
            </div>
            
            {isAdmin ? (
                <button 
                    onClick={() => setIsModalOpen(true)}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow-md transition-all active:scale-95"
                >
                    <FaPlus /> Add Card
                </button>
            ) : (
                <span className="bg-gray-200 text-gray-500 px-3 py-1 rounded text-sm font-medium">View Only</span>
            )}
        </div>

        <DndContext sensors={sensors} collisionDetection={closestCorners} onDragStart={(event) => setActiveId(event.active.id)} onDragOver={handleDragOver} onDragEnd={handleDragEnd}>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
            
            {/* KOLOM PROGRESS */}
            <div className="bg-gray-50 p-4 rounded-2xl border border-gray-200">
                <h2 className="font-bold text-gray-700 mb-4 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-blue-500"></span> On Progress
                    <span className="bg-gray-200 text-gray-600 text-xs px-2 py-0.5 rounded-full">{items.progress.length}</span>
                </h2>
                <SortableContext id="progress" items={items.progress.map(i => i.id)} strategy={rectSortingStrategy}>
                    <div className="space-y-3 min-h-[100px] bg-indigo-50/30 p-4 rounded-xl border border-dashed border-indigo-200">
                        {items.progress.map((item) => (
                            // 🔥 PASS FUNGSI DELETE KE ITEM
                            <SortableItem 
                                key={item.id} 
                                {...item} 
                                disabled={!isAdmin} 
                                onDelete={handleDeleteCard} 
                            />
                        ))}
                    </div>
                </SortableContext>
            </div>

            {/* KOLOM FUTURE */}
            <div className="bg-gray-50 p-4 rounded-2xl border border-gray-200">
                <h2 className="font-bold text-gray-700 mb-4 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-purple-500"></span> Future Features
                    <span className="bg-gray-200 text-gray-600 text-xs px-2 py-0.5 rounded-full">{items.future.length}</span>
                </h2>
                <SortableContext id="future" items={items.future.map(i => i.id)} strategy={rectSortingStrategy}>
                    <div className="space-y-3 min-h-[100px] bg-purple-50/30 p-4 rounded-xl border border-dashed border-purple-200">
                        {items.future.map((item) => (
                            // 🔥 PASS FUNGSI DELETE KE ITEM
                            <SortableItem 
                                key={item.id} 
                                {...item} 
                                disabled={!isAdmin} 
                                onDelete={handleDeleteCard}
                            />
                        ))}
                    </div>
                </SortableContext>
            </div>

          </div>
          
          <DragOverlay>
            {activeId && activeItemData ? (
               <div className="bg-white p-5 rounded-xl shadow-2xl border-2 border-indigo-500 opacity-90 rotate-3 scale-105">
                  <h3 className="font-bold text-gray-800">{activeItemData.title}</h3>
               </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      </main>

      {/* MODAL POPUP (Sama) */}
      {isModalOpen && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 backdrop-blur-sm p-4">
              <div className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden animate-in fade-in zoom-in duration-200">
                  <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                      <h3 className="font-bold text-gray-800">Add New Card</h3>
                      <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-red-500"><FaTimes /></button>
                  </div>
                  <form onSubmit={handleAddCard} className="p-6 space-y-4">
                      {/* ... isi form sama ... */}
                      <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Title</label>
                          <input type="text" className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none"
                              placeholder="e.g. Redesign UI" value={newCardData.title} onChange={(e) => setNewCardData({...newCardData, title: e.target.value})} required />
                      </div>
                      <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                          <textarea className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 focus:outline-none h-24 resize-none"
                              placeholder="Details about this feature..." value={newCardData.desc} onChange={(e) => setNewCardData({...newCardData, desc: e.target.value})}></textarea>
                      </div>
                      <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                          <select className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-indigo-500 outline-none bg-white"
                              value={newCardData.status} onChange={(e) => setNewCardData({...newCardData, status: e.target.value})}>
                              <option value="progress">🚀 On Progress</option>
                              <option value="future">🔮 Future Feature</option>
                          </select>
                      </div>
                      <div className="pt-4 flex justify-end gap-3">
                          <button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">Cancel</button>
                          <button type="submit" className="px-6 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium shadow-md">Create</button>
                      </div>
                  </form>
              </div>
          </div>
      )}
    </div>
  );
};

export default Home;