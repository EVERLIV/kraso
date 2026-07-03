import React from 'react';

interface VideoOnboardingProps {
  onOpenPresets: () => void;
  onUpload: () => void;
}

const STEPS = [
  {
    id: '1',
    title: 'Добавьте фото',
    body: 'Загрузите или сгенерируйте изображение — с него начнётся анимация.',
    action: 'upload' as const,
    media: { type: 'image' as const, src: '/video/how-it-works/step-1.webp' },
  },
  {
    id: '2',
    title: 'Выберите пресет',
    body: 'Подберите пресет движения камеры и кадрирования.',
    action: 'presets' as const,
    media: { type: 'video' as const, src: '/video/how-it-works/step-2.mp4' },
  },
  {
    id: '3',
    title: 'Получите видео',
    body: 'Нажмите «Создать» в панели слева — готовый ролик появится в истории.',
    action: null,
    media: { type: 'video' as const, src: '/video/how-it-works/step-3.mp4' },
  },
];

function StepMedia({ media }: { media: (typeof STEPS)[number]['media'] }) {
  if (media.type === 'image') {
    return (
      <img
        src={media.src}
        alt=""
        className="vs-how-media"
        loading="lazy"
        decoding="async"
      />
    );
  }

  return (
    <video
      src={media.src}
      className="vs-how-media"
      autoPlay
      muted
      loop
      playsInline
      preload="metadata"
    />
  );
}

function VideoOnboarding({ onOpenPresets, onUpload }: VideoOnboardingProps) {
  const handleStepClick = (action: (typeof STEPS)[number]['action']) => {
    if (action === 'upload') onUpload();
    if (action === 'presets') onOpenPresets();
  };

  return (
    <div className="flex-1 overflow-y-auto custom-scrollbar pb-8">
      <div className="max-w-5xl pt-1">
        <h1 className="text-xl sm:text-2xl md:text-[28px] font-black uppercase text-ink text-balance leading-tight">
          Видео в один клик
        </h1>
        <p className="mt-2 text-sm text-ink-muted text-pretty max-w-xl">
          Пресеты движения камеры и кадрирования — или настройте всё вручную в панели слева.
        </p>

        <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-5 md:gap-6">
          {STEPS.map((item) => {
            const clickable = item.action !== null;
            const Tag = clickable ? 'button' : 'div';
            return (
              <Tag
                key={item.id}
                type={clickable ? 'button' : undefined}
                onClick={clickable ? () => handleStepClick(item.action) : undefined}
                className={`flex flex-col gap-3 w-full text-left ${clickable ? 'group cursor-pointer' : ''}`}
              >
                <div className="vs-how-card">
                  <StepMedia media={item.media} />
                </div>
                <div>
                  <p className="text-sm font-black uppercase text-ink text-balance">
                    <span className="text-primary">{item.id}.</span>{' '}
                    {item.title}
                  </p>
                  <p className="mt-1 text-xs text-ink-muted text-pretty leading-relaxed">
                    {item.body}
                  </p>
                  {clickable && (
                    <span className="mt-1.5 inline-block text-xs font-semibold text-primary opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                      Начать →
                    </span>
                  )}
                </div>
              </Tag>
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default VideoOnboarding;
