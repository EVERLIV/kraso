
import React, { useRef, useState } from 'react';
import { Upload, X, Image as ImageIcon, Plus } from 'lucide-react';

interface ImageUploaderProps {
  currentImage: string | null;
  onImageUpload: (base64: string) => void;
  onClear: () => void;
  disabled: boolean;
  variant?: 'default' | 'compact';
}

const ImageUploader: React.FC<ImageUploaderProps> = ({
  currentImage,
  onImageUpload,
  onClear,
  disabled,
  variant = 'default'
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const processFile = (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Пожалуйста, загрузите изображение (JPG, PNG).');
      return;
    }

    // Gemini API natively supports: image/png, image/jpeg, image/webp, image/heic, image/heif
    // AVIF is commonly used but NOT supported by Gemini API yet.
    const apiSupportedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/heic', 'image/heif'];

    // If the file type is supported by the API, use it directly.
    // HEIC is supported by API but difficult to convert in browser, so we pass it raw.
    if (apiSupportedTypes.includes(file.type)) {
      readFileRaw(file);
    } else {
      // Try to convert unsupported types (like AVIF) to JPEG using canvas
      convertToJpeg(file);
    }
  };

  const readFileRaw = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result) {
        onImageUpload(e.target.result as string);
      }
    };
    reader.readAsDataURL(file);
  };

  const convertToJpeg = (file: File) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        // Draw white background to handle transparency correctly when converting to JPEG
        ctx.fillStyle = '#FFFFFF';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);

        // Convert to JPEG
        const dataUrl = canvas.toDataURL('image/jpeg', 0.92);
        onImageUpload(dataUrl);
      } else {
        // Fallback to raw if canvas fails
        readFileRaw(file);
      }
      URL.revokeObjectURL(url);
    };

    img.onerror = () => {
      // Fallback if browser cannot load image (e.g. really obscure format)
      URL.revokeObjectURL(url);
      readFileRaw(file);
    };

    img.src = url;
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const triggerUpload = () => fileInputRef.current?.click();

  // --- COMPACT VARIANT (Mobile) ---
  if (variant === 'compact') {
    if (currentImage) {
      return (
        <div className="flex items-center gap-3 bg-brand-card border border-brand-border rounded-lg p-2 relative group">
          <div className="w-10 h-10 rounded overflow-hidden bg-black shrink-0 border border-white/10">
            <img src={currentImage} alt="Ref" className="w-full h-full object-cover" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs text-white font-medium truncate">Фото загружено</p>
            <p className="text-[10px] text-brand-muted">Нажмите X для удаления</p>
          </div>
          {!disabled && (
            <button
              onClick={(e) => { e.stopPropagation(); onClear(); }}
              className="p-1.5 bg-white/5 hover:bg-red-500/20 text-brand-muted hover:text-red-400 rounded-md transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      );
    }

    return (
      <div
        onClick={triggerUpload}
        className="flex items-center gap-3 bg-brand-card/50 border border-brand-border border-dashed rounded-lg p-2 cursor-pointer hover:bg-brand-card transition-colors active:scale-[0.98]"
      >
        <div className="w-10 h-10 rounded bg-white/5 flex items-center justify-center shrink-0">
          <Plus className="w-4 h-4 text-brand-muted" />
        </div>
        <div className="flex-1 text-left">
          <p className="text-xs text-brand-muted font-medium">Добавить фото</p>
        </div>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          className="hidden"
          disabled={disabled}
        />
      </div>
    );
  }

  // --- DEFAULT VARIANT (Desktop) ---
  if (currentImage) {
    return (
      <div className="relative w-full aspect-square bg-black/40 rounded-lg overflow-hidden border border-brand-border group shadow-lg">
        <img
          src={currentImage}
          alt="Reference"
          className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
        />
        {!disabled && (
          <button
            onClick={(e) => { e.stopPropagation(); onClear(); }}
            className="absolute top-2 right-2 p-1.5 bg-black/60 hover:bg-red-500/90 text-white rounded-full transition-all backdrop-blur-sm opacity-0 group-hover:opacity-100 transform translate-y-1 group-hover:translate-y-0"
            title="Удалить"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    );
  }

  return (
    <div
      className={`
        relative w-full aspect-square rounded-xl border border-dashed flex flex-col items-center justify-center transition-all duration-300 cursor-pointer group overflow-hidden
        ${dragActive ? 'border-brand-accent bg-brand-accent/10 scale-[0.98]' : 'border-brand-border/50 bg-brand-card/20 hover:border-brand-accent/50 hover:bg-brand-card/50 hover:shadow-2xl hover:shadow-brand-accent/5'}
        ${disabled ? 'opacity-50 cursor-not-allowed pointer-events-none' : ''}
      `}
      onDragEnter={handleDrag}
      onDragLeave={handleDrag}
      onDragOver={handleDrag}
      onDrop={handleDrop}
      onClick={triggerUpload}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        className="hidden"
        disabled={disabled}
      />

      {/* Decorative gradient blob */}
      <div className="absolute inset-0 bg-gradient-to-br from-brand-accent/0 via-brand-accent/0 to-brand-accent/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />

      <div className="relative z-10 w-12 h-12 rounded-full bg-brand-bg border border-brand-border flex items-center justify-center mb-3 text-brand-muted group-hover:text-brand-accent group-hover:border-brand-accent/50 group-hover:scale-110 transition-all duration-300 shadow-lg group-hover:shadow-brand-accent/20">
        <Plus className="w-5 h-5" />
      </div>
      <p className="relative z-10 text-xs text-brand-muted font-medium group-hover:text-brand-accent transition-colors duration-300">Загрузить фото</p>
      <p className="relative z-10 text-[10px] text-brand-muted/50 mt-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-2 group-hover:translate-y-0">Перетащите сюда</p>
    </div>
  );
};

export default ImageUploader;
