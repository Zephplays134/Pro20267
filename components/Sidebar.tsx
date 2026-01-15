
import React from 'react';
import { GeneratedShip } from '../types';

interface SidebarProps {
  ships: GeneratedShip[];
  onImageClick: (url: string) => void;
  onToggle: () => void;
}

const Sidebar: React.FC<SidebarProps> = ({ ships, onImageClick }) => {
  return (
    <div className="flex flex-col h-full">
      <div className="p-6 border-b border-slate-800">
        <h2 className="text-lg font-bold text-white mb-1">Your Fleet</h2>
        <p className="text-xs text-slate-400 italic">Generated Roblox designs</p>
      </div>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {ships.length === 0 ? (
          <div className="h-40 flex flex-col items-center justify-center text-center p-4 bg-slate-800/30 rounded-xl border border-dashed border-slate-700">
            <svg className="w-8 h-8 text-slate-600 mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
            <p className="text-sm text-slate-500">Ask the Captain to build a ship to see it here!</p>
          </div>
        ) : (
          ships.map(ship => (
            <div 
              key={ship.id}
              onClick={() => onImageClick(ship.imageUrl)}
              className="group relative aspect-video rounded-xl overflow-hidden bg-slate-800 cursor-pointer border border-slate-700 hover:border-blue-500 transition-all shadow-lg hover:shadow-blue-900/20"
            >
              <img src={ship.imageUrl} alt={ship.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900 via-transparent to-transparent opacity-60"></div>
              <div className="absolute bottom-2 left-2 right-2">
                <p className="text-[10px] font-bold text-white truncate drop-shadow-md uppercase tracking-wider">{ship.name}</p>
                <p className="text-[8px] text-slate-300">{new Date(ship.createdAt).toLocaleDateString()}</p>
              </div>
            </div>
          ))
        )}
      </div>

      <div className="p-4 bg-slate-900/80 border-t border-slate-800">
        <div className="bg-gradient-to-r from-blue-600 to-cyan-500 p-3 rounded-xl shadow-lg shadow-blue-900/20">
          <p className="text-[10px] font-bold text-white uppercase tracking-widest mb-1">Status</p>
          <p className="text-xs text-white/90 font-medium">Simulation Ready</p>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
