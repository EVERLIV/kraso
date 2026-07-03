import React, { useState } from 'react';
import MarketingToolModal from './MarketingToolModal';
import MarketingPreviewMedia from './MarketingPreviewMedia';
import { OnboardCursorIcon, OnboardGlobeIcon } from './marketingOnboardingIcons';

const PREVIEW = '/marketing/videos/gadget-1.mp4';

interface MarketingUrlToAdModalProps {
    onClose: () => void;
    onContinue: (url: string) => Promise<void>;
}

function MarketingUrlToAdModal({ onClose, onContinue }: MarketingUrlToAdModalProps) {
    const [url, setUrl] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleContinue = async () => {
        const trimmed = url.trim();
        if (!trimmed) {
            setError('Вставьте ссылку на товар');
            return;
        }
        setLoading(true);
        setError(null);
        try {
            await onContinue(trimmed);
        } catch (e) {
            console.error(e);
            setError(e instanceof Error ? e.message : 'Не удалось проанализировать ссылку');
        } finally {
            setLoading(false);
        }
    };

    return (
        <MarketingToolModal
            title="Ссылка в рекламу"
            icon={<OnboardCursorIcon />}
            headline={<>Создайте видеорекламу<br />в один клик</>}
            subtitle="Вставьте ссылку на товар — получите рекламу для TikTok, Reels и Shorts. Без съёмок, монтажа и брифа."
            loading={loading}
            error={error}
            onClose={onClose}
            onContinue={handleContinue}
            panelVariant="product"
            form={(
                <div className="ms-onboard-input-bar">
                    <OnboardGlobeIcon />
                    <input
                        type="url"
                        value={url}
                        onChange={e => { setUrl(e.target.value); setError(null); }}
                        placeholder="www.ваш-товар.ru"
                        disabled={loading}
                    />
                </div>
            )}
            preview={(
                <MarketingPreviewMedia
                    src={PREVIEW}
                    className="ms-onboard-panel__media"
                />
            )}
        />
    );
}

export default MarketingUrlToAdModal;
