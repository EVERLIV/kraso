
import React, { useState, useRef, useEffect } from 'react';
import { Send, Image as ImageIcon, X, Sparkles, Download, RefreshCw, Loader2, ArrowRight, Zap, Plus, Layers, Bot, User } from 'lucide-react';
import { ChatMessage, AspectRatio } from '../types';
import { generateImageWithGemini, cleanBase64, getMimeType, ReferenceImage } from '../services/geminiService';

interface ChatInterfaceProps {
  credits: number;
  onDeductCredit: (amount: number) => void;
  onSaveHistory: (original: string | null, generated: string, prompt: string) => void;
  isFreeTier: boolean;
}

const ChatInterface: React.FC<ChatInterfaceProps> = ({ credits, onDeductCredit, onSaveHistory, isFreeTier }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'model',
      text: 'Привет! Я AI Studio Chat. \n\n✨ **MIX STUDIO**: Загрузите до 2-х фото для смешивания стилей или лиц. \nПросто прикрепите фото и опишите, что хотите получить!'
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [attachedImages, setAttachedImages] = useState<string[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>('1:1');
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isGenerating, attachedImages]);

  const handleSendMessage = async () => {
    if ((!inputValue.trim() && attachedImages.length === 0) || isGenerating) return;
    
    if (credits < 1) {
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        role: 'model',
        text: 'Извините, у вас закончились кредиты. Пожалуйста, пополните баланс.',
        isError: true
      }]);
      return;
    }

    const newMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: inputValue,
      images: attachedImages.length > 0 ? [...attachedImages] : undefined
    };

    setMessages(prev => [...prev, newMessage]);
    const currentImages = [...attachedImages]; 
    setInputValue('');
    setAttachedImages([]);
    setIsGenerating(true);
    
    onDeductCredit(1);

    try {
      let prompt = newMessage.text || "Generate an image";
      let references: ReferenceImage[] = [];
      
      if (currentImages.length > 0) {
         references = currentImages.map(img => ({
            data: cleanBase64(img),
            mimeType: getMimeType(img)
         }));
      }

      const generatedData = await generateImageWithGemini(
          prompt, 
          references, 
          aspectRatio, 
          'gemini-2.5-flash-image', 
          '1K', 
          isFreeTier // Apply watermark if free
      );
      const generatedUrl = `data:image/jpeg;base64,${generatedData}`;

      const responseMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        images: [generatedUrl],
        text: 'Готово! Вот ваш результат:'
      };

      setMessages(prev => [...prev, responseMessage]);
      onSaveHistory(currentImages[0] || null, generatedUrl, prompt);

    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: 'Произошла ошибка при создании изображения. Пожалуйста, попробуйте снова.',
        isError: true
      }]);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleUseAsReference = (imageUrl: string) => {
    if (attachedImages.length < 2) {
        setAttachedImages(prev => [...prev, imageUrl]);
        const input = document.getElementById('chat-input');
        if (input) input.focus();
    } else {
        alert("Максимум 2 фото-референса.");
    }
  };

  const handleDownload = (imageUrl: string) => {
    const link = document.createElement('a');
    link.href = imageUrl;
    link.download = `ai-chat-${Date.now()}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
        if (!file.type.startsWith('image/')) {
            alert('Пожалуйста, выберите файл изображения.');
            return;
        }
        if (attachedImages.length >= 2) {
            alert("Максимум 2 фото.");
            return;
        }

        const reader = new FileReader();
        reader.onload = (e) => {
            if (e.target?.result) {
                setAttachedImages(prev => [...prev, e.target!.result as string]);
            }
        };
        reader.readAsDataURL(file);
    }
    e.target.value = '';
  };

  const removeAttachedImage = (index: number) => {
    setAttachedImages(prev => prev.filter((_, i) => i !== index));
  };

  const isReady = (inputValue.trim() || attachedImages.length > 0) && !isGenerating;

  return (
    <div className="flex flex-col h-full bg-[#050505] relative font-sans">
      
      {/* Background Ambience */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-purple-900/5 rounded-full blur-[150px]"></div>
          <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-blue-900/5 rounded-full blur-[150px]"></div>
      </div>

      {/* Header - Full Width */}
      <div className="h-16 border-b border-white/5 flex items-center justify-between px-4 md:px-8 bg-[#050505]/80 backdrop-blur-md z-20 sticky top-0 shrink-0">
        <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center shadow-lg shadow-purple-500/20">
                <Bot className="w-5 h-5 text-white" />
            </div>
            <div>
                <h2 className="font-bold text-white text-sm tracking-wide">AI Chat & Mix</h2>
                <div className="flex items-center gap-2">
                   <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse"></span>
                   <p className="text-[10px] text-gray-400">Online</p>
                </div>
            </div>
        </div>
        <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1.5 bg-white/5 rounded-full border border-white/10">
                <Zap className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />
                <span className="text-xs font-bold text-white">{credits}</span>
            </div>
            <select 
                value={aspectRatio} 
                onChange={(e) => setAspectRatio(e.target.value as AspectRatio)}
                className="bg-[#151921] border border-white/10 text-xs text-gray-300 rounded-lg px-3 py-1.5 outline-none hover:border-purple-500/50 transition-colors cursor-pointer hidden md:block"
            >
                <option value="1:1">1:1 Квадрат</option>
                <option value="16:9">16:9 Горизонт</option>
                <option value="9:16">9:16 Вертикаль</option>
            </select>
        </div>
      </div>

      {/* Messages Area - Fluid Width */}
      <div className="flex-1 overflow-y-auto px-4 md:px-8 py-6 space-y-8 custom-scrollbar scroll-smooth z-10">
        <div className="w-full space-y-8">
            {messages.map((msg) => (
            <div 
                key={msg.id} 
                className={`flex gap-4 md:gap-6 w-full ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}
            >
                {/* Avatar */}
                <div className={`w-10 h-10 rounded-xl shrink-0 flex items-center justify-center shadow-lg border border-white/5 ${msg.role === 'user' ? 'bg-[#1E1E2E]' : 'bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border-purple-500/30'}`}>
                    {msg.role === 'user' ? <User className="w-5 h-5 text-gray-400" /> : <Sparkles className="w-5 h-5 text-purple-400" />}
                </div>

                {/* Content Bubble */}
                <div className={`flex flex-col gap-3 max-w-[85%] md:max-w-[70%] xl:max-w-[60%] ${msg.role === 'user' ? 'items-end' : 'items-start'}`}>
                    
                    {/* Text */}
                    {msg.text && (
                        <div className={`px-6 py-4 rounded-2xl text-sm md:text-base leading-relaxed shadow-sm whitespace-pre-wrap ${
                            msg.role === 'user' 
                                ? 'bg-[#1E1E2E] text-white rounded-tr-sm border border-white/10' 
                                : msg.isError 
                                    ? 'bg-red-500/10 text-red-200 border border-red-500/20 rounded-tl-sm' 
                                    : 'bg-transparent text-gray-200'
                        }`}>
                            {msg.text}
                        </div>
                    )}

                    {/* Uploaded Images */}
                    {msg.images && msg.role === 'user' && (
                        <div className="flex flex-wrap gap-3 justify-end">
                            {msg.images.map((img, idx) => (
                                <div key={idx} className="relative w-32 h-32 md:w-48 md:h-48 rounded-2xl overflow-hidden border border-white/10 shadow-xl group">
                                    <img src={img} alt="Uploaded" className="w-full h-full object-cover" />
                                    <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-all"></div>
                                </div>
                            ))}
                        </div>
                    )}

                    {/* Generated Image */}
                    {msg.images && msg.role === 'model' && (
                        <div className="relative group rounded-2xl overflow-hidden border border-white/10 bg-black shadow-2xl w-full max-w-2xl">
                            <img src={msg.images[0]} alt="Generated" className="w-full h-auto object-contain" />
                            
                            {/* Actions Overlay */}
                            <div className="absolute inset-x-0 bottom-0 p-4 bg-gradient-to-t from-black/90 via-black/60 to-transparent flex items-center justify-end gap-3 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button 
                                    onClick={() => handleUseAsReference(msg.images![0])}
                                    className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 backdrop-blur-md rounded-xl text-xs font-bold text-white transition-all border border-white/10"
                                >
                                    <RefreshCw className="w-3.5 h-3.5" /> В ремикс
                                </button>
                                <button 
                                    onClick={() => handleDownload(msg.images![0])}
                                    className="p-2.5 bg-white text-black rounded-xl hover:bg-gray-200 transition-colors shadow-lg"
                                    title="Скачать"
                                >
                                    <Download className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            ))}

            {isGenerating && (
                <div className="flex flex-row gap-4 md:gap-6 animate-in fade-in">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500/20 to-purple-500/20 border border-purple-500/30 flex items-center justify-center shrink-0">
                        <Loader2 className="w-5 h-5 text-purple-400 animate-spin" />
                    </div>
                    <div className="flex flex-col gap-2 pt-2">
                        <div className="flex gap-1">
                            <span className="w-2 h-2 bg-purple-500 rounded-full animate-bounce"></span>
                            <span className="w-2 h-2 bg-purple-500 rounded-full animate-bounce delay-100"></span>
                            <span className="w-2 h-2 bg-purple-500 rounded-full animate-bounce delay-200"></span>
                        </div>
                        <span className="text-xs text-purple-400 font-medium">Создаю шедевр...</span>
                    </div>
                </div>
            )}
            <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Area - Wide */}
      <div className="p-4 md:p-6 bg-[#0B0E14]/95 backdrop-blur-xl border-t border-white/5 shrink-0 z-20">
         <div className="w-full max-w-7xl mx-auto">
            {/* Attached Image Preview */}
            {attachedImages.length > 0 && (
                <div className="mb-4 flex flex-wrap gap-3 animate-in slide-in-from-bottom-2">
                    {attachedImages.map((img, idx) => (
                        <div key={idx} className="relative group/preview">
                             <div className="relative w-16 h-16 md:w-20 md:h-20 rounded-xl overflow-hidden border border-white/10 shadow-lg">
                                <img src={img} alt={`Ref ${idx}`} className="w-full h-full object-cover" />
                                <button 
                                onClick={() => removeAttachedImage(idx)}
                                className="absolute inset-0 bg-black/60 flex items-center justify-center opacity-0 group-hover/preview:opacity-100 transition-opacity text-white"
                                >
                                    <X className="w-5 h-5" />
                                </button>
                            </div>
                            {idx < attachedImages.length - 1 && (
                                <div className="absolute top-1/2 -right-3 transform -translate-y-1/2 z-10 text-gray-500">
                                    <Plus className="w-4 h-4" />
                                </div>
                            )}
                        </div>
                    ))}
                    
                    {attachedImages.length < 2 && (
                        <button 
                          onClick={triggerFileInput}
                          className="w-16 h-16 md:w-20 md:h-20 rounded-xl border border-dashed border-white/20 hover:border-purple-500 hover:bg-purple-500/10 flex flex-col items-center justify-center text-gray-500 hover:text-purple-400 transition-all gap-1"
                          title="Добавить еще фото"
                        >
                            <Plus className="w-5 h-5" />
                            <span className="text-[9px] uppercase font-bold">Фото</span>
                        </button>
                    )}

                    <div className="w-full text-xs text-gray-400 pt-1 flex items-center gap-2">
                        <Layers className="w-3 h-3 text-purple-400" />
                        <span>{attachedImages.length === 2 ? 'Режим Mix: AI объединит эти 2 фото.' : 'Выбрано 1 фото.'}</span>
                    </div>
                </div>
            )}

            <div className="relative flex items-end gap-3 bg-[#151921] rounded-2xl p-2 border border-white/10 focus-within:border-purple-500/50 focus-within:ring-1 focus-within:ring-purple-500/50 transition-all shadow-xl">
                
                <input 
                    type="file" 
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept="image/*"
                    className="hidden"
                />

                <button 
                   onClick={triggerFileInput}
                   disabled={isGenerating || attachedImages.length >= 2}
                   className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-all text-gray-400 hover:text-white hover:bg-white/10 active:bg-white/20 ${isGenerating || attachedImages.length >= 2 ? 'opacity-50 cursor-not-allowed' : ''} mb-0.5`}
                   title="Загрузить фото (Макс 2)"
                >
                    <ImageIcon className="w-5 h-5" />
                </button>

                <textarea
                    id="chat-input"
                    value={inputValue}
                    onChange={(e) => setInputValue(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault();
                            handleSendMessage();
                        }
                    }}
                    placeholder={attachedImages.length === 0 ? "Опишите, что создать..." : "Что изменить в этом фото?"}
                    className="flex-1 bg-transparent border-none text-white placeholder-gray-500 text-sm py-3 max-h-32 resize-none outline-none custom-scrollbar"
                    rows={1}
                    style={{ minHeight: '44px' }}
                />

                <button 
                    onClick={handleSendMessage}
                    disabled={!isReady}
                    className={`
                        h-10 px-6 rounded-xl flex items-center justify-center shrink-0 transition-all mb-0.5 gap-2 font-bold text-sm
                        ${!isReady
                            ? 'bg-transparent text-gray-600 cursor-not-allowed' 
                            : 'bg-white text-black hover:bg-gray-200 shadow-lg active:scale-95'}
                    `}
                >
                    {isGenerating ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
                    <span className="hidden sm:inline">Отправить</span>
                </button>
            </div>
            
            <p className="text-[10px] text-gray-600 text-center mt-3">
               AI может допускать ошибки. Проверяйте важную информацию.
            </p>
         </div>
      </div>
    </div>
  );
};

export default ChatInterface;
