import React, { useRef, useState } from 'react';
import { Link2 } from 'lucide-react';
import MarketingToolModal from './MarketingToolModal';
import MarketingPreviewMedia from './MarketingPreviewMedia';
import { OnboardPlayIcon, OnboardUploadIcon } from './marketingOnboardingIcons';
import { extractVideoThumbnail } from '../../services/marketingAnalysisService';

const REEL_VIDEOS = [
    '/marketing/videos/ugc-1.mp4',
    '/marketing/videos/gadget-2.mp4',
    '/marketing/videos/ugc-3.mp4',
];

export interface AdReferencePayload {
    videoUrl?: string;
    videoThumb?: string | null;
    productImage?: string | null;
    avatarImage?: string | null;
}

interface MarketingAdReferenceModalProps {
    onClose: () => void;
    onContinue: (payload: AdReferencePayload) => Promise<void>;
}

function MarketingAdReferenceModal({ onClose, onContinue }: MarketingAdReferenceModalProps) {
    const videoRef = useRef<HTMLInputElement>(null);
    const productRef = useRef<HTMLInputElement>(null);
    const avatarRef = useRef<HTMLInputElement>(null);

    const [videoUrl, setVideoUrl] = useState('');
    const [videoThumb, setVideoThumb] = useState<string | null>(null);
    const [videoName, setVideoName] = useState<string | null>(null);
    const [productImage, setProductImage] = useState<string | null>(null);
    const [avatarImage, setAvatarImage] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const readFile = (file: File, setter: (v: string) => void) => {
        const reader = new FileReader();
        reader.onload = () => setter(reader.result as string);
        reader.readAsDataURL(file);
    };

    const onVideoFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        setVideoName(file.name);
        setVideoUrl('');
        try {
            const thumb = await extractVideoThumbnail(file);
            setVideoThumb(thumb);
        } catch {
            readFile(file, setVideoThumb);
        }
        e.target.value = '';
    };

    const handleContinue = async () => {
        if (!videoUrl.trim() && !videoThumb) {
            setError('Загрузите видео или вставьте ссылку');
            return;
        }
        setLoading(true);
        setError(null);
        try {
            await onContinue({
                videoUrl: videoUrl.trim() || undefined,
                videoThumb,
                productImage,
                avatarImage,
            });
        } catch (e) {
            console.error(e);
            setError(e instanceof Error ? e.message : 'Не удалось проанализировать референс');
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <MarketingToolModal
                title="Референс рекламы"
                icon={<OnboardPlayIcon />}
                headline={<>Вдохновение<br />из вирусной рекламы</>}
                subtitle="Вставьте вирусный ролик — получите свою версию с тем же хуком и энергией, но с вашим товаром."
                loading={loading}
                error={error}
                onClose={onClose}
                onContinue={handleContinue}
                panelVariant="maroon"
                form={(
                    <div className="ms-onboard-fields">
                        <p className="ms-onboard-fields__label">Референс-видео</p>
                        <div className="ms-onboard-upload-row">
                            <button
                                type="button"
                                onClick={() => videoRef.current?.click()}
                                className="ms-onboard-upload-main"
                            >
                                {videoThumb ? (
                                    <img src={videoThumb} alt="" className="size-[34px] rounded-full object-cover shrink-0" />
                                ) : (
                                    <span className="ms-onboard-upload-chip">
                                        <OnboardUploadIcon />
                                    </span>
                                )}
                                <span className="min-w-0">
                                    <span className="ms-onboard-upload-title block truncate">
                                        {videoName ?? 'Загрузите видео'}
                                    </span>
                                    <span className="ms-onboard-upload-sub block truncate">
                                        Из загрузок или генераций
                                    </span>
                                </span>
                            </button>
                            <button
                                type="button"
                                onClick={() => productRef.current?.click()}
                                className="ms-onboard-add-tile"
                                aria-label="Добавить товар"
                            >
                                {productImage ? (
                                    <img src={productImage} alt="" className="size-full object-cover" />
                                ) : (
                                    <>
                                        <span className="ms-onboard-add-tile__plus">+</span>
                                        <span className="ms-onboard-add-tile__label">ТОВАР</span>
                                    </>
                                )}
                            </button>
                            <button
                                type="button"
                                onClick={() => avatarRef.current?.click()}
                                className="ms-onboard-add-tile"
                                aria-label="Добавить аватар"
                            >
                                {avatarImage ? (
                                    <img src={avatarImage} alt="" className="size-full object-cover" />
                                ) : (
                                    <>
                                        <span className="ms-onboard-add-tile__plus">+</span>
                                        <span className="ms-onboard-add-tile__label">АВАТАР</span>
                                    </>
                                )}
                            </button>
                        </div>
                        <div className="ms-onboard-input-bar">
                            <Link2 className="size-4 shrink-0 text-[var(--om-text-dim)]" />
                            <input
                                type="url"
                                value={videoUrl}
                                onChange={e => { setVideoUrl(e.target.value); setError(null); }}
                                placeholder="Или ссылка на видео"
                                disabled={loading}
                            />
                        </div>
                    </div>
                )}
                preview={(
                    <div className="ms-onboard-reels">
                        {REEL_VIDEOS.map((src, i) => (
                            <MarketingPreviewMedia
                                key={src}
                                src={i === 1 && videoThumb ? videoThumb : src}
                                className="ms-onboard-reel"
                            />
                        ))}
                    </div>
                )}
            />

            <input ref={videoRef} type="file" accept="video/*" className="hidden" onChange={onVideoFile} />
            <input ref={productRef} type="file" accept="image/*" className="hidden" onChange={e => {
                const f = e.target.files?.[0];
                if (f) readFile(f, setProductImage);
                e.target.value = '';
            }} />
            <input ref={avatarRef} type="file" accept="image/*" className="hidden" onChange={e => {
                const f = e.target.files?.[0];
                if (f) readFile(f, setAvatarImage);
                e.target.value = '';
            }} />
        </>
    );
}

export default MarketingAdReferenceModal;
