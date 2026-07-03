import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Loader2, X } from 'lucide-react';

export type OnboardPanelVariant = 'product' | 'maroon';

export interface MarketingToolModalProps {
    title: string;
    icon: React.ReactNode;
    headline: React.ReactNode;
    subtitle: string;
    loading?: boolean;
    error?: string | null;
    onClose: () => void;
    onContinue: () => void;
    form: React.ReactNode;
    preview: React.ReactNode;
    panelVariant?: OnboardPanelVariant;
}

function MarketingToolModal({
    title, icon, headline, subtitle,
    loading = false, error,
    onClose, onContinue, form, preview, panelVariant = 'product',
}: MarketingToolModalProps) {
    useEffect(() => {
        const prev = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        return () => { document.body.style.overflow = prev; };
    }, []);

    const modal = (
        <div className="ms ms-onboard-overlay">
            <button
                type="button"
                className="ms-onboard-backdrop"
                onClick={onClose}
                aria-label="Закрыть"
            />
            <div
                className="ms-onboard-modal"
                role="dialog"
                aria-modal="true"
                aria-labelledby="ms-onboard-title"
            >
                <div className="ms-onboard-modal__header">
                    <span id="ms-onboard-title" className="ms-onboard-modal__title">{title}</span>
                    <button
                        type="button"
                        onClick={onClose}
                        className="ms-onboard-modal__close"
                        aria-label="Закрыть"
                    >
                        <X className="size-4" />
                    </button>
                </div>

                <div className="ms-onboard-modal__body">
                    <div className="ms-onboard-modal__left">
                        <div className="ms-onboard-icon" aria-hidden>{icon}</div>
                        <h2 className="ms-onboard-headline text-balance">{headline}</h2>
                        <p className="ms-onboard-body text-pretty">{subtitle}</p>

                        <div className="ms-onboard-controls">
                            {form}
                            {error && (
                                <p className="text-xs text-red-400 text-pretty" role="alert">{error}</p>
                            )}
                            <button
                                type="button"
                                onClick={onContinue}
                                disabled={loading}
                                className="ms-onboard-cta"
                            >
                                {loading ? (
                                    <>
                                        <Loader2 className="size-4 animate-spin" />
                                        ИИ анализирует…
                                    </>
                                ) : 'Продолжить'}
                            </button>
                        </div>
                    </div>

                    <div className={`ms-onboard-panel ms-onboard-panel--${panelVariant}`}>
                        {preview}
                    </div>
                </div>
            </div>
        </div>
    );

    return createPortal(modal, document.body);
}

export default MarketingToolModal;
