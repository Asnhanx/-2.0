import React from 'react';
import { Mascot } from './Mascot';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  anniversaryDate?: string; // YYYY-MM-DD
}

export const Sidebar: React.FC<SidebarProps> = ({ isOpen, onClose, title, children }) => {
  return (
    <>
      {/* Backdrop */}
      <div 
        className={`fixed inset-0 bg-[#5D4037]/20 backdrop-blur-sm z-40 transition-opacity duration-300 ${isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}`}
        onClick={onClose}
      />
      
      {/* Sidebar Panel */}
      <div className={`fixed top-0 right-0 h-full w-full sm:w-[480px] bg-[#FFFBEB] shadow-2xl z-50 transform transition-transform duration-300 ease-in-out flex flex-col rounded-l-[2rem] overflow-hidden ${isOpen ? 'translate-x-0' : 'translate-x-full'}`}>
        
        {/* Header */}
        <div className="bg-gradient-to-br from-[#FFECB3] to-[#FFE082] p-6 pt-12 relative overflow-hidden shrink-0 min-h-[160px] flex items-center justify-center">
            {/* Decoration Circles */}
            <div className="absolute top-[-20%] right-[-10%] w-48 h-48 bg-white/20 rounded-full blur-2xl"></div>
            <div className="absolute bottom-[-10%] left-[-10%] w-32 h-32 bg-[#FFD54F]/30 rounded-full blur-xl"></div>
            
            <div className="relative z-10 flex flex-col items-center">
                <Mascot className="w-24 h-24 mb-2 drop-shadow-md" expressionId={25} />
                <p className="text-[#8D6E63] font-bold text-lg">记录美好瞬间</p>
            </div>
            
            <button 
                onClick={onClose}
                className="absolute top-4 left-4 w-10 h-10 bg-white/60 backdrop-blur rounded-full flex items-center justify-center text-[#8D6E63] hover:bg-white transition-all shadow-sm"
            >
                <i className="fas fa-arrow-right"></i>
            </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 bg-[#FFF8E1]">
            <h2 className="text-xl font-bold text-[#5D4037] mb-6 flex items-center gap-2">
                <span className="w-2 h-6 bg-[#FFCA28] rounded-full inline-block"></span>
                {title}
            </h2>
            {children}
        </div>
      </div>
    </>
  );
};