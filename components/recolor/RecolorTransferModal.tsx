import React, { useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X, Sparkles, Pipette } from 'lucide-react';
import RecolorPresetGallery from './RecolorPresetGallery';
import { RecolorPreset } from '../../lib/recolorPresets';

interface RecolorTransferModalProps {
    open: boolean;
    onClose: () => void;
    selectedPresetId: string | null;
    onSelectPreset: (preset: RecolorPreset) => void;
    onUploadRef: () => void;
    onOpenManualPicker: () => void;
}

function RecolorTransferModal({
    open, onClose, selectedPresetId, onSelectPreset, onUploadRef, onOpenManualPicker,
}: RecolorTransferModalProps) {
    useEffect(() => {
        if (!open) return;
        const prev = document.body.style.overflow;
        document.body.style.overflow = 'hidden';
        return () => { document.body.style.overflow = prev; };
    }, [open]);

    if (!open) return null;

    const modal = (
        <div className="is is-overlay">
            <button type="button" className="is-overlay-backdrop" onClick={onClose} aria-label="Закрыть" />
            <div className="is-modal relative z-10 w-full max-w-[800px] flex flex-col max-h-[min(92dvh,720px)]" role="dialog" aria-modal="true">
                <div className="grid grid-cols-1 md:grid-cols-2 shrink-0">
                    <div className="p-8 md:p-10">
                        <h2 className="is-display text-[26px] md:text-[30px] leading-[1.06] text-balance">
                            Control your colors<br />with Soul HEX
                        </h2>
                        <p className="text-sm font-medium text-[var(--is-muted)] mt-4 max-w-[340px] text-pretty leading-relaxed">
                            Upload a reference image and let Soul HEX bring its colors in your own style.
                        </p>
                        <div className="flex flex-wrap gap-3 mt-7">
                            <button type="button" onClick={onUploadRef} className="is-btn-upload">
                                Upload &amp; Create
                                <Sparkles className="size-3.5" />
                            </button>
                            <button
                                type="button"
                                onClick={onOpenManualPicker}
                                className="is-chip"
                            >
                                <Pipette className="size-4" />
                                Палитра вручную
                            </button>
                        </div>
                    </div>
                    <div className="is-modal-art min-h-[200px] md:min-h-[240px]">
                        <div className="is-display text-[44px] text-white" style={{ textShadow: '0 4px 16px rgba(0,0,0,0.25)' }}>
                            #hex
                        </div>
                        <div className="absolute top-10 left-8 w-[54px] h-[68px] rounded-lg opacity-90" style={{ background: 'linear-gradient(135deg,#c94a6a,#6a3a8a)', transform: 'rotate(-8deg)', boxShadow: '0 8px 20px rgba(0,0,0,0.2)' }} />
                        <div className="absolute bottom-11 left-14 w-[50px] h-[62px] rounded-lg opacity-90" style={{ background: 'linear-gradient(135deg,#4a8ad0,#c9d24a)', transform: 'rotate(6deg)', boxShadow: '0 8px 20px rgba(0,0,0,0.2)' }} />
                        <div className="absolute top-14 right-11 w-[52px] h-[64px] rounded-lg opacity-90" style={{ background: 'linear-gradient(135deg,#f04a9a,#4ad0c9)', transform: 'rotate(9deg)', boxShadow: '0 8px 20px rgba(0,0,0,0.2)' }} />
                        <button type="button" onClick={onClose} className="is-modal-close" aria-label="Закрыть">
                            <X className="size-3.5" />
                        </button>
                    </div>
                </div>
                <div className="border-t border-[var(--is-hairline)] overflow-y-auto custom-scrollbar flex-1 min-h-0">
                    <RecolorPresetGallery selectedId={selectedPresetId} onSelect={onSelectPreset} />
                </div>
            </div>
        </div>
    );

    return createPortal(modal, document.body);
}

export default RecolorTransferModal;
