import React from 'react';
import { RecordItem } from '../types';

interface NoteCardProps {
  item: RecordItem;
  onDelete: (id: string) => void;
}

export const NoteCard: React.FC<NoteCardProps> = ({ item, onDelete }) => {
  // Use saved color or fallback to a default
  const bgColor = item.bgColor || '#FFF9C4';
  
  return (
    <div 
      className="relative p-5 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 break-inside-avoid mb-4 group min-h-[140px] flex flex-col justify-between"
      style={{ backgroundColor: bgColor }}
    >
      {/* Delete Button - Top Right */}
      <button 
        onClick={(e) => {
            e.stopPropagation();
            onDelete(item.id);
        }}
        className="absolute top-2 right-2 w-8 h-8 bg-white/60 hover:bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-[#8D6E63] hover:text-red-500 shadow-sm transition-all z-30 cursor-pointer pointer-events-auto"
      >
        <i className="fas fa-trash-alt text-xs"></i>
      </button>

      {/* Content with padding for button */}
      <p className="text-[#5D4037] text-sm leading-relaxed font-medium whitespace-pre-wrap pt-2 pr-8">
        {item.content}
      </p>

      <div className="flex justify-between items-end mt-4 pt-2 border-t border-black/5">
        <span className="text-[10px] font-bold text-[#8D6E63] opacity-60">
          {new Date(item.date).toLocaleDateString()} {new Date(item.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
        </span>
      </div>

      {/* Sticker - Bottom Right */}
      {item.sticker && (
        <div className="absolute -bottom-2 -right-2 text-4xl filter drop-shadow-sm transform group-hover:scale-110 transition-transform duration-300 rotate-[-12deg] z-10">
          {item.sticker}
        </div>
      )}
    </div>
  );
};