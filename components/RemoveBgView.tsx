
import React, { useState } from 'react';
import { Eraser, Download, Loader2, Zap, Check, Image as ImageIcon } from 'lucide-react';
import ImageUploader from './ImageUploader';
import { generateImageWithGemini, cleanBase64, getMimeType } from '../services/geminiService';
import { uploadImageToStorage, saveGenerationToHistory, deductCredits } from '../services/firebaseService';
import { useAuth } from '../contexts/AuthContext';

interface RemoveBgViewProps {
  credits: number;
  onUpdateCredits: (val: number) => void;
  isFreeTier: boolean;
}

const RemoveBgView: React.FC<RemoveBgViewProps> = ({ credits, onUpdateCredits, isFreeTier }) => {
  const { user } = useAuth();
  const [image, setImage] = useState<string | null>(null);
  const [result, setResult] = useState<string | null>(null);
  const [bgType, setBgType] = useState<'white' | 'green' | 'studio'>('white');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const COST = 1;

  const handleProcess = async () => {
    if (!image || !user) return;
    if (credits < COST) {
      alert("Недостаточно кредитов");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      let prompt = "";
      if (bgType === 'white') {
        prompt = "Isolate the main subject of this image on a pure solid white background. Product photography style. High quality, sharp edges.";
      } else if (bgType === 'green') {
        prompt = "Isolate the main subject on a solid bright green screen background for chroma key. High quality.";
      } else if (bgType === 'studio') {
        prompt = "Place the main subject of this image in a professional dark grey studio background with soft rim lighting. Product photography.";
      }

      const refs = [{ data: cleanBase64(image), mimeType: getMimeType(image) }];

      const generatedData = await generateImageWithGemini(
        prompt,
        refs,
        '1:1'
      );

      // generateImageWithGemini уже возвращает корректный data URL (data:mime;base64,...),
      // поэтому не нужно добавлять префикс ещё раз.
      const resultUrl = generatedData;
      setResult(resultUrl);

      await deductCredits(user.uid, COST);
      onUpdateCredits(credits - COST);

      const storageUrl = await uploadImageToStorage(user.uid, resultUrl, 'generated');
      await saveGenerationToHistory(user.uid, {
        original: image,
        generated: storageUrl,
        prompt: `[REMOVE_BG] ${prompt}`
      });

    } catch (err) {
      console.error(err);
      setError("Ошибка обработки. Попробуйте еще раз.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 bg-[#0B0E14] overflow-y-auto custom-scrollbar p-6 flex flex-col items-center">
      <div className="max-w-4xl w-full">
        <div className="mb-10 text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-green-500/10 mb-4">
            <Eraser className="w-8 h-8 text-green-400" />
          </div>
          <h1 className="text-3xl font-bold text-white">
            Удаление Фона
          </h1>
          <p className="text-brand-muted mt-2 max-w-lg mx-auto">
            Изолируйте объекты для карточек товаров или коллажей за секунды.
          </p>
        </div>

        <div className="bg-[#151921] border border-brand-border rounded-3xl p-6 md:p-8 shadow-2xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">

            {/* Upload Area */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white uppercase tracking-wider">Исходник</h3>
                {image && <button onClick={() => { setImage(null); setResult(null); }} className="text-xs text-red-400 hover:text-red-300">Очистить</button>}
              </div>

              <div className="aspect-square bg-[#0B0E14] rounded-2xl border-2 border-dashed border-brand-border relative overflow-hidden group">
                <ImageUploader
                  currentImage={image}
                  onImageUpload={setImage}
                  onClear={() => { setImage(null); setResult(null); }}
                  disabled={loading}
                  variant="default"
                />
              </div>

              {/* Options */}
              {image && (
                <div className="grid grid-cols-3 gap-2 animate-in fade-in slide-in-from-top-2">
                  <button
                    onClick={() => setBgType('white')}
                    className={`p-2 rounded-lg border text-xs font-bold transition-all ${bgType === 'white' ? 'bg-white text-black border-white' : 'bg-transparent border-brand-border text-brand-muted hover:border-white'}`}
                  >
                    Белый фон
                  </button>
                  <button
                    onClick={() => setBgType('green')}
                    className={`p-2 rounded-lg border text-xs font-bold transition-all ${bgType === 'green' ? 'bg-green-500/20 text-green-400 border-green-500' : 'bg-transparent border-brand-border text-brand-muted hover:border-green-500'}`}
                  >
                    Хромакей
                  </button>
                  <button
                    onClick={() => setBgType('studio')}
                    className={`p-2 rounded-lg border text-xs font-bold transition-all ${bgType === 'studio' ? 'bg-gray-700 text-white border-gray-500' : 'bg-transparent border-brand-border text-brand-muted hover:border-gray-500'}`}
                  >
                    Студия
                  </button>
                </div>
              )}

              <button
                onClick={handleProcess}
                disabled={!image || loading}
                className={`w-full py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 transition-all ${!image || loading ? 'bg-brand-border text-brand-muted' : 'bg-green-500 hover:bg-green-400 text-black shadow-lg shadow-green-900/20'}`}
              >
                {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <Eraser className="w-5 h-5" />}
                {loading ? 'Удаляем фон...' : 'Удалить фон (1 кр)'}
              </button>
              {error && <p className="text-xs text-red-400 text-center">{error}</p>}
            </div>

            {/* Result Area */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-white uppercase tracking-wider">Результат</h3>

              <div className="aspect-square bg-[url('https://grainy-gradients.vercel.app/noise.svg')] bg-[#0B0E14] rounded-2xl border border-brand-border flex items-center justify-center relative overflow-hidden">
                {/* Checkerboard pattern for transparency visualization */}
                <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'linear-gradient(45deg, #1f2937 25%, transparent 25%), linear-gradient(-45deg, #1f2937 25%, transparent 25%), linear-gradient(45deg, transparent 75%, #1f2937 75%), linear-gradient(-45deg, transparent 75%, #1f2937 75%)', backgroundSize: '20px 20px', backgroundPosition: '0 0, 0 10px, 10px -10px, -10px 0px' }}></div>

                {result ? (
                  <div className="relative z-10 w-full h-full p-4 flex items-center justify-center group">
                    <img src={result} className="max-w-full max-h-full object-contain drop-shadow-2xl" alt="Result" />
                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center backdrop-blur-sm">
                      <button
                        onClick={() => {
                          const link = document.createElement('a');
                          link.href = result;
                          link.download = `removebg-${Date.now()}.jpg`;
                          link.click();
                        }}
                        className="bg-white text-black px-6 py-3 rounded-xl font-bold flex items-center gap-2 hover:scale-105 transition-transform"
                      >
                        <Download className="w-5 h-5" /> Скачать
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="relative z-10 text-brand-muted opacity-50 flex flex-col items-center gap-3">
                    <ImageIcon className="w-10 h-10" />
                    <span className="text-sm">Здесь будет объект</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RemoveBgView;
