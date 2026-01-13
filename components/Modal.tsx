import React from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ isOpen, onClose, title, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 backdrop-blur-sm p-4 sm:p-0">
      <div 
        className="bg-white w-full max-w-lg rounded-t-3xl sm:rounded-2xl p-6 shadow-2xl animate-in slide-in-from-bottom-10 fade-in duration-300 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-4 border-b border-gray-100 pb-2">
          <h2 className="text-xl font-bold text-gray-800">{title}</h2>
          <button 
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center text-gray-500 hover:bg-gray-200"
          >
            <i className="fas fa-times"></i>
          </button>
        </div>
        {children}
      </div>
    </div>
  );
};