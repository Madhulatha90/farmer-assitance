
import React, { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import ChatWindow from './components/ChatWindow';
import InputBar from './components/InputBar';
import { Message, ChatState } from './types';
import { geminiService } from './services/geminiService';

const App: React.FC = () => {
  const [state, setState] = useState<ChatState>({
    messages: [],
    isLoading: false,
    error: null,
  });

  // Load history from local storage
  useEffect(() => {
    const saved = localStorage.getItem('kisan_sahay_chat');
    if (saved) {
      try {
        setState(prev => ({ ...prev, messages: JSON.parse(saved) }));
      } catch (e) {
        console.error("Failed to load chat history", e);
      }
    }
  }, []);

  // Save history to local storage
  useEffect(() => {
    localStorage.setItem('kisan_sahay_chat', JSON.stringify(state.messages));
  }, [state.messages]);

  const handleSendMessage = useCallback(async (text: string, image?: string) => {
    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      text,
      image,
      timestamp: Date.now(),
    };

    setState(prev => ({
      ...prev,
      messages: [...prev.messages, userMessage],
      isLoading: true,
      error: null,
    }));

    try {
      const responseText = await geminiService.getAdvisory(text, image);
      
      const aiMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: responseText,
        timestamp: Date.now(),
      };

      setState(prev => ({
        ...prev,
        messages: [...prev.messages, aiMessage],
        isLoading: false,
      }));
    } catch (err: any) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: `Error: ${err.message || 'Something went wrong. Please try again.'}`,
        timestamp: Date.now(),
      };

      setState(prev => ({
        ...prev,
        messages: [...prev.messages, errorMessage],
        isLoading: false,
        error: err.message,
      }));
    }
  }, []);

  const clearChat = () => {
    if (window.confirm("Do you want to clear all messages?")) {
      setState({ messages: [], isLoading: false, error: null });
    }
  };

  return (
    <div className="flex flex-col h-screen max-h-screen overflow-hidden bg-white">
      <Header />
      
      <main className="flex-1 flex flex-col max-w-5xl mx-auto w-full relative overflow-hidden">
        <div className="absolute top-4 right-4 z-10">
          <button 
            onClick={clearChat}
            className="text-xs font-semibold text-gray-500 hover:text-red-600 flex items-center gap-1 bg-white/80 backdrop-blur px-3 py-1.5 rounded-full shadow-sm border border-gray-100 transition-all"
          >
            <i className="fas fa-trash-alt"></i> Clear Chat
          </button>
        </div>

        <ChatWindow messages={state.messages} isLoading={state.isLoading} />
        
        <InputBar onSendMessage={handleSendMessage} isLoading={state.isLoading} />
      </main>
      
      {/* Mobile-Friendly Navigation/Shortcuts Bar (Optional) */}
      <nav className="md:hidden flex justify-around items-center bg-white border-t border-gray-100 py-2 text-[10px] font-medium text-gray-500">
        <button className="flex flex-col items-center gap-1 text-green-600">
          <i className="fas fa-comment-dots text-lg"></i>
          <span>Consult</span>
        </button>
        <button className="flex flex-col items-center gap-1">
          <i className="fas fa-cloud-sun text-lg"></i>
          <span>Weather</span>
        </button>
        <button className="flex flex-col items-center gap-1">
          <i className="fas fa-store text-lg"></i>
          <span>Markets</span>
        </button>
        <button className="flex flex-col items-center gap-1">
          <i className="fas fa-cog text-lg"></i>
          <span>Settings</span>
        </button>
      </nav>
    </div>
  );
};

export default App;
