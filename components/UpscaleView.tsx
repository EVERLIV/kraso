
import React, { useState } from 'react';
import { ScanEye, Upload, ArrowRight, Download, Loader2, RefreshCcw, Palette, Zap } from 'lucide-react';
import ImageUploader from './ImageUploader';
import { generateImageWithGemini, cleanBase64, getMimeType } from '../services/geminiService';
import { uploadImageToStorage, saveGenerationToHistory, deductCredits } from '../services/firebaseService';
import { useAuth } from '../contexts/AuthContext';
import { AppState } from '../types';

interface UpscaleViewProps {
  credits: number;
  onUpdateCredits: (val: number) => void;
  isFreeTier: boolean;
}

type Mode = 'upscale' | 'recolor' | 'restore';

const UpscaleView: React.FC<UpscaleViewProps> = ({ credits, onUpdateCredits, isFreeTier }) => {
  const { user } = useAuth();
  const [image, setImage] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [mode, setMode] = useState<Mode>('upscale');
  const [recolorPrompt, setRecolorPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const COST = 2; // Upscaling costs 2 credits

  const handleProcess = async () => {
    if (!image || !user) return;
    if (credits < COST) {
      alert("Недостаточно кредитов");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // 1. Prepare Prompt
      let prompt = "";
      if (mode === 'upscale') {
        prompt = "Upscale this image to 4K resolution. Enhance details, sharpen textures, remove noise, and improve lighting while keeping the original content exactly the same. Photorealistic high quality.";
      } else if (mode === 'recolor') {
        prompt = `Keep the image composition exactly the same, but recolor it based on this instruction: ${recolorPrompt || "Vibrant colors"}. High quality, photorealistic.`;
      } else if (mode === 'restore') {
        prompt = "Restore this old photo. Remove scratches, fix tears, improve clarity and face details. Make it look like a modern high-resolution photo.";
      }

      // 2. Call Gemini
      const refs = [{ data: cleanBase64(image), mimeType: getMimeType(image) }];
      // Using Pro model for better detail in upscaling
      const generatedData = await generateImageWithGemini(
        prompt, 
        refs, 
        '1:1', 
        'gemini-3-pro-image-preview', 
        '4K',
        isFreeTier // Apply watermark if free
      );
      
      const resultUrl = `data:image/jpeg;base64,${generatedData}`;
      setResult(resultUrl);

      // 3. Save & Deduct
      await deductCredits(user.uid, COST);
      onUpdateCredits(credits - COST);
      
      const storageUrl = await uploadImageToStorage(user.uid, resultUrl, 'generated');
      await saveGenerationToHistory(user.uid, {
        original: image,
        generated: storageUrl,
        prompt: `[${mode.toUpperCase()}] ${prompt}`
      });

    } catch (err) {
      console.error(err);
      setError("Ошибка обработки. Попробуйте еще раз.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 bg-[#0B0E14] overflow-y-auto custom-scrollbar p-6">
      <div className="max-w-5xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white flex items-center gap-3">
             <ScanEye className="w-8 h-8 text-blue-400" />
             Upscale & Enhance 4K
          </h1>
          <p className="text-brand-muted mt-2">
            Улучшение качества, восстановление старых фото и изменение цветов с помощью AI.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
           {/* Sidebar Controls */}
           <div className="lg:col-span-1 space-y-6">
              
              {/* Mode Selector */}
              <div className="bg-[#151921] border border-brand-border rounded-xl p-4 space-y-3">
                 <label className="text-xs font-bold text-brand-muted uppercase tracking-wider">Режим обработки</label>
                 
                 <button 
                   onClick={() => setMode('upscale')}
                   className={`w-full flex items-center gap-3 p-3 rounded-lg border transition-all text-left ${mode === 'upscale' ? 'bg-blue-500/10 border-blue-500 text-white' : 'border-brand-border text-brand-muted hover:bg-white/5'}`}
                 >
                    <ScanEye className="w-5 h-5" />
                    <div>
                       <div className="font-bold text-sm">Upscale 4K</div>
                       <div className="text-[10px] opacity-70">Детализация и четкость</div>
                    </div>
                 </button>

                 <button 
                   onClick={() => setMode('recolor')}
                   className={`w-full flex items-center gap-3 p-3 rounded-lg border transition-all text-left ${mode === 'recolor' ? 'bg-purple-500/10 border-purple-500 text-white' : 'border-brand-border text-brand-muted hover:bg-white/5'}`}
                 >
                    <Palette className="w-5 h-5" />
                    <div>
                       <div className="font-bold text-sm">Recolor (Цвета)</div>
                       <div className="text-[10px] opacity-70">Изменение цветовой гаммы</div>
                    </div>
                 </button>

                 <button 
                   onClick={() => setMode('restore')}
                   className={`w-full flex items-center gap-3 p-3 rounded-lg border transition-all text-left ${mode === 'restore' ? 'bg-green-500/10 border-green-500 text-white' : 'border-brand-border text-brand-muted hover:bg-white/5'}`}
                 >
                    <RefreshCcw className="w-5 h-5" />
                    <div>
                       <div className="font-bold text-sm">Реставрация</div>
                       <div className="text-[10px] opacity-70">Восстановление старых фото</div>
                    </div>
                 </button>
              </div>

              {/* Recolor Input */}
              {mode === 'recolor' && (
                  <div className="bg-[#151921] border border-brand-border rounded-xl p-4 animate-in fade-in slide-in-from-top-2">
                     <label className="text-xs font-bold text-brand-muted uppercase tracking-wider mb-2 block">Описание цветов</label>
                     <textarea
                        value={recolorPrompt}
                        onChange={(e) => setRecolorPrompt(e.target.value)}
                        placeholder="Например: Сделай фото в неоновых киберпанк тонах, или черно-белым..."
                        className="w-full bg-[#0B0E14] border border-brand-border rounded-lg p-3 text-sm text-white placeholder-brand-muted/50 focus:border-brand-accent outline-none resize-none h-24"
                     />
                  </div>
              )}

              {/* Action Button */}
              <button
                 onClick={handleProcess}
                 disabled={!image || loading}
                 className={`
                    w-full py-4 rounded-xl font-bold text-lg flex items-center justify-center gap-2 shadow-lg transition-all
                    ${!image || loading 
                        ? 'bg-brand-border text-brand-muted cursor-not-allowed' 
                        : 'bg-white text-black hover:bg-gray-200 hover:scale-[1.02]'}
                 `}
              >
                 {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Zap className="w-5 h-5 text-black" />}
                 {loading ? 'Обработка...' : `Улучшить (${COST} кр)`}
              </button>
              
              {error && (
                  <div className="text-red-400 text-xs bg-red-500/10 p-3 rounded-lg border border-red-500/20 text-center">
                      {error}
                  </div>
              )}
           </div>

           {/* Canvas Area */}
           <div className="lg:col-span-2 space-y-6">
               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                   {/* Input Image */}
                   <div className="space-y-2">
                      <div className="text-xs font-bold text-brand-muted uppercase">До</div>
                      <div className="aspect-[3/4] bg-[#151921] rounded-2xl border border-brand-border overflow-hidden relative">
                          <ImageUploader 
                             currentImage={image}
                             onImageUpload={setImage}
                             onClear={() => { setImage(null); setResult(null); }}
                             disabled={loading}
                             variant="default"
                          />
                      </div>
                   </div>

                   {/* Result Image */}
                   <div className="space-y-2">
                      <div className="text-xs font-bold text-brand-muted uppercase">После</div>
                      <div className="aspect-[3/4] bg-[#151921] rounded-2xl border border-brand-border overflow-hidden relative flex items-center justify-center">
                          {result ? (
                             <div className="relative w-full h-full group">
                                <img src={result} alt="Result" className="w-full h-full object-cover" />
                                <button 
                                  onClick={() => {
                                    const link = document.createElement('a');
                                    link.href = result;
                                    link.download = `upscale-${Date.now()}.jpg`;
                                    link.click();
                                  }}
                                  className="absolute bottom-4 right-4 bg-white text-black px-4 py-2 rounded-lg font-bold shadow-lg opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-2"
                                >
                                   <Download className="w-4 h-4" /> Скачать
                                </button>
                             </div>
                          ) : (
                             <div className="text-brand-muted text-center p-6">
                                {loading ? (
                                    <div className="flex flex-col items-center gap-3">
                                        <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
                                        <span className="text-sm">AI улучшает ваше фото...</span>
                                    </div>
                                ) : (
                                    <div className="flex flex-col items-center gap-3 opacity-50">
                                        <ArrowRight className="w-8 h-8" />
                                        <span className="text-sm">Результат будет здесь</span>
                                    </div>
                                )}
                             </div>
                          )}
                      </div>
                   </div>
               </div>
           </div>
        </div>
      </div>
    </div>
  );
};

export default UpscaleView;
