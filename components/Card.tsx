import React from 'react';
import { RecordItem } from '../types';

interface CardProps {
  item: RecordItem;
  onClick: (item: RecordItem) => void;
  onDelete: (e: React.MouseEvent, id: string) => void;
}

export const Card: React.FC<CardProps> = ({ item, onClick, onDelete }) => {
  return (
    <div 
      className="bg-white rounded-3xl shadow-[0_4px_20px_-4px_rgba(252,211,77,0.15)] border border-[#FEF3C7] overflow-hidden break-inside-avoid mb-4 cursor-pointer hover:shadow-lg hover:-translate-y-1 transition-all duration-300 relative group"
      onClick={() => onClick(item)}
    >
      {item.image && (
        <div className="relative aspect-auto">
          <img src={item.image} alt={item.title} className="w-full h-auto object-cover" loading="lazy" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
        </div>
      )}
      <div className="p-4">
        <div className="flex justify-between items-start gap-2 mb-2">
          {/* Tag: Pajama Blue style */}
          <span className="bg-blue-50 text-blue-500 border border-blue-100 text-[10px] px-2 py-1 rounded-full font-bold tracking-wide">
            {item.category}
          </span>
          <span className="text-amber-800/40 text-[10px] font-medium bg-amber-50 px-2 py-0.5 rounded-md">
            {new Date(item.date).toLocaleDateString()}
          </span>
        </div>
        <h3 className="font-bold text-[#78350F] text-base mb-1 line-clamp-2">{item.title}</h3>
        <p className="text-gray-500 text-xs line-clamp-3 leading-relaxed">{item.content}</p>
      </div>
      
      <button 
        onClick={(e) => {
            e.stopPropagation();
            onDelete(e, item.id);
        }}
        className="absolute top-2 right-2 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center text-gray-400 hover:text-red-500 shadow-sm opacity-100 sm:opacity-0 sm:group-hover:opacity-100 transition-all z-30 cursor-pointer pointer-events-auto"
      >
        <i className="fas fa-trash-alt text-sm"></i>
      </button>
    </div>
  );
};