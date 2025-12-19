
import React, { useState, useRef } from 'react';

interface InputBarProps {
  onSendMessage: (text: string, image?: string) => void;
  isLoading: boolean;
}

const InputBar: React.FC<InputBarProps> = ({ onSendMessage, isLoading }) => {
  const [inputText, setInputText] = useState('');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if ((!inputText.trim() && !selectedImage) || isLoading) return;
    
    onSendMessage(inputText, selectedImage || undefined);
    setInputText('');
    setSelectedImage(null);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const toggleSpeech = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech recognition is not supported in this browser.");
      return;
    }

    const recognition = new SpeechRecognition();
    recognition.lang = 'en-IN'; // Works well for mixed Indian languages too
    recognition.onstart = () => setIsRecording(true);
    recognition.onend = () => setIsRecording(false);
    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInputText(prev => prev + ' ' + transcript);
    };
    recognition.start();
  };

  return (
    <div className="bg-white border-t p-4 pb-6 md:pb-4 shadow-[0_-4px_10px_rgba(0,0,0,0.05)] sticky bottom-0">
      {selectedImage && (
        <div className="relative inline-block mb-3">
          <img src={selectedImage} alt="Preview" className="h-20 w-20 object-cover rounded-lg border-2 border-green-500" />
          <button 
            onClick={() => setSelectedImage(null)}
            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs shadow-md"
          >
            <i className="fas fa-times"></i>
          </button>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="flex gap-2 items-end max-w-5xl mx-auto">
        <button 
          type="button"
          onClick={() => fileInputRef.current?.click()}
          className="bg-gray-100 hover:bg-gray-200 text-gray-600 p-3 rounded-xl transition-colors shrink-0 flex items-center justify-center w-12 h-12"
          title="Upload photo of crop"
        >
          <i className="fas fa-camera text-lg"></i>
        </button>
        <input 
          type="file" 
          ref={fileInputRef} 
          className="hidden" 
          accept="image/*" 
          onChange={handleFileChange} 
        />
        
        <div className="relative flex-1 group">
          <textarea
            value={inputText}
            onChange={(e) => setInputText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault();
                handleSubmit();
              }
            }}
            placeholder="Type your question..."
            className="w-full bg-gray-50 border border-gray-200 rounded-xl py-3 pl-4 pr-12 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none min-h-[48px] max-h-32 text-gray-800 text-sm md:text-base transition-all"
            rows={1}
          />
          <button 
            type="button"
            onClick={toggleSpeech}
            className={`absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full transition-colors ${
              isRecording ? 'text-red-500 bg-red-50 animate-pulse' : 'text-gray-400 hover:text-green-600'
            }`}
          >
            <i className={`fas ${isRecording ? 'fa-microphone' : 'fa-microphone'}`}></i>
          </button>
        </div>

        <button 
          type="submit"
          disabled={(!inputText.trim() && !selectedImage) || isLoading}
          className={`p-3 rounded-xl transition-all flex items-center justify-center w-12 h-12 shrink-0 ${
            (!inputText.trim() && !selectedImage) || isLoading
              ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
              : 'bg-green-600 text-white hover:bg-green-700 shadow-md shadow-green-100'
          }`}
        >
          <i className={`fas ${isLoading ? 'fa-spinner fa-spin' : 'fa-paper-plane'}`}></i>
        </button>
      </form>
      <p className="text-[10px] text-gray-400 text-center mt-2">
        AI can make mistakes. Consult local agriculture experts for critical decisions.
      </p>
    </div>
  );
};

export default InputBar;
