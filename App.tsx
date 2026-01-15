
import React, { useState, useRef, useEffect } from 'react';
import { geminiService, ShipGenerationResult } from './services/geminiService';
import { Message, GeneratedShip, GenerationStatus } from './types';
import Sidebar from './components/Sidebar';
import ChatWindow from './components/ChatWindow';
import ImageModal from './components/ImageModal';

const App: React.FC = () => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      role: 'assistant',
      content: "Ahoy there, matey! I'm Captain Block. Ready to design the ultimate vessel? I can do Roblox-style builds or show you realistic ships from real life! What are we launching today?",
      timestamp: new Date()
    }
  ]);
  const [ships, setShips] = useState<GeneratedShip[]>([]);
  const [status, setStatus] = useState<GenerationStatus>(GenerationStatus.IDLE);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  const handleSendMessage = async (text: string) => {
    if (!text.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: text,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setStatus(GenerationStatus.THINKING);

    try {
      // 1. Get Chat Response
      const history = messages.map(m => ({
        role: m.role === 'assistant' ? 'model' : 'user',
        parts: [{ text: m.content }]
      }));
      
      const chatResponse = await geminiService.chat(text, history);

      // 2. Check if we should generate an image
      const triggerWords = ['generate', 'create', 'build', 'see', 'show', 'make', 'image', 'picture', 'photo', 'draw'];
      const shouldGenerateImage = triggerWords.some(word => text.toLowerCase().includes(word));

      let shipResult: ShipGenerationResult | undefined;
      if (shouldGenerateImage) {
        setStatus(GenerationStatus.GENERATING_IMAGE);
        shipResult = await geminiService.generateShipImage(text);
        
        if (shipResult) {
          const newShip: GeneratedShip = {
            id: Date.now().toString() + "-ship",
            name: shipResult.name,
            description: chatResponse || `A custom ship concept named ${shipResult.name}.`,
            imageUrl: shipResult.imageUrl,
            createdAt: new Date()
          };
          setShips(prev => [newShip, ...prev]);
        }
      }

      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: chatResponse || "I've processed your request, Captain!",
        imageUrl: shipResult?.imageUrl,
        shipName: shipResult?.name,
        timestamp: new Date()
      };

      setMessages(prev => [...prev, assistantMessage]);
      setStatus(GenerationStatus.IDLE);
    } catch (error) {
      console.error(error);
      setStatus(GenerationStatus.ERROR);
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: 'assistant',
        content: "Stormy seas! I encountered an error processing your request. Please try again.",
        timestamp: new Date()
      }]);
    }
  };

  return (
    <div className="flex h-screen w-full bg-slate-950 overflow-hidden font-sans">
      {/* Sidebar - Desktop */}
      <div className={`${isSidebarOpen ? 'w-80' : 'w-0'} transition-all duration-300 border-r border-slate-800 bg-slate-900 hidden md:block overflow-hidden`}>
        <Sidebar 
          ships={ships} 
          onImageClick={setSelectedImage} 
          onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
        />
      </div>

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col relative h-full">
        <header className="h-16 flex items-center justify-between px-6 bg-slate-900/50 backdrop-blur-md border-b border-slate-800 z-10">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="md:hidden text-slate-400 hover:text-white"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" /></svg>
            </button>
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center shadow-lg shadow-blue-900/20">
                <svg className="w-6 h-6 text-white" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M20,11V15H17V17H15V19H13V21H2L4,11H2L3,9H22L21,11H20M14,3H10V5H14V3M11,13V15H13V13H11Z" />
                </svg>
              </div>
              <div>
                <h1 className="text-xl font-bold roblox-font text-white leading-none">Cruise Simulator</h1>
                <p className="text-xs text-blue-400 font-medium">Roblox & Real-Life Generator</p>
              </div>
            </div>
          </div>
          <div className="hidden sm:flex items-center gap-4">
            <div className="flex items-center gap-2 bg-slate-800/50 px-3 py-1.5 rounded-full border border-slate-700">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
              <span className="text-xs font-semibold text-slate-300">Harbor Online</span>
            </div>
          </div>
        </header>

        <ChatWindow 
          messages={messages} 
          status={status} 
          onSendMessage={handleSendMessage} 
          onImageClick={setSelectedImage}
        />
      </div>

      {/* Image Modal */}
      {selectedImage && (
        <ImageModal 
          imageUrl={selectedImage} 
          onClose={() => setSelectedImage(null)} 
        />
      )}
    </div>
  );
};

export default App;
