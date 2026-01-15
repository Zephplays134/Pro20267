
import React from 'react';

interface ImageModalProps {
  imageUrl: string;
  onClose: () => void;
}

const ImageModal: React.FC<ImageModalProps> = ({ imageUrl, onClose }) => {
  return (
    <div 
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm"
      onClick={onClose}
    >
      <div className="relative max-w-5xl w-full" onClick={e => e.stopPropagation()}>
        <button 
          onClick={onClose}
          className="absolute -top-12 right-0 text-white hover:text-blue-400 transition-colors flex items-center gap-2 font-bold uppercase text-sm tracking-widest"
        >
          Close
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
        </button>
        <img 
          src={imageUrl} 
          alt="Full size ship" 
          className="w-full h-auto rounded-2xl shadow-2xl border-2 border-slate-700" 
        />
        <div className="mt-6 flex justify-center">
          <a 
            href={imageUrl} 
            download="roblox-ship-design.png"
            className="bg-blue-600 hover:bg-blue-500 text-white font-bold py-3 px-8 rounded-xl transition-all shadow-xl shadow-blue-900/40 roblox-font text-lg"
          >
            Save Design
          </a>
        </div>
      </div>
    </div>
  );
};

export default ImageModal;
