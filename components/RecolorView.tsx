import React, { useRef, useState } from 'react';
import RecolorCanvas from './recolor/RecolorCanvas';
import RecolorComposer from './recolor/RecolorComposer';
import PalettePanel from './recolor/PaletteMoodboardModal';
import StyleTemplatePanel from './recolor/StyleTemplatePanel';
import {
    PALETTE_GEN_COST, PhotoStyle, ColorPalette, getPhotoStyle, getColorPalette,
    buildStudioPrompt, DEFAULT_MANUAL_COLORS, DEFAULT_STYLE_ID,
} from '../lib/recolorPresets';
import { generateImageWithGemini, cleanBase64, getMimeType } from '../services/geminiService';
import { uploadImageToStorage, saveGenerationToHistory, deductCredits } from '../services/firebaseService';
import { useAuth } from '../contexts/AuthContext';
import { AspectRatio, GeneratedImage, ImageResolution } from '../types';
import { KrasoModelId } from '../lib/krasoModels';
import './recolor/imageStudioTheme.css';

interface RecolorViewProps {
    credits: number;
    onUpdateCredits: (val: number) => void;
    isFreeTier: boolean;
    initialImage?: string | null;
    historyData: GeneratedImage[];
    onGenerationSaved: (item: GeneratedImage) => void;
}

type ColorMode = 'none' | 'preset' | 'manual';

function RecolorView({
    credits, onUpdateCredits, initialImage = null, historyData, onGenerationSaved,
}: RecolorViewProps) {
    const { user } = useAuth();
    const characterRef = useRef<HTMLInputElement>(null);
    const promptRefInput = useRef<HTMLInputElement>(null);

    const [characterImage, setCharacterImage] = useState<string | null>(initialImage);
    const [promptReferences, setPromptReferences] = useState<string[]>([]);
    const [prompt, setPrompt] = useState('');

    // Photo style template (General card)
    const [selectedStyleId, setSelectedStyleId] = useState<string>(DEFAULT_STYLE_ID);
    const [stylesOpen, setStylesOpen] = useState(false);

    // Color palette (Color Transfer chip)
    const [colorMode, setColorMode] = useState<ColorMode>('none');
    const [selectedColorId, setSelectedColorId] = useState<string | null>(null);
    const [manualColors, setManualColors] = useState<string[]>(DEFAULT_MANUAL_COLORS);
    const [manualBackground, setManualBackground] = useState<string | null>(null);
    const [paletteOpen, setPaletteOpen] = useState(false);

    const [krasoModelId, setKrasoModelId] = useState<KrasoModelId>('kraso-quality');
    const [aspectRatio, setAspectRatio] = useState<AspectRatio>('3:4');
    const [resolution, setResolution] = useState<ImageResolution>('2K');
    const [batchCount, setBatchCount] = useState(1);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const selectedStyle: PhotoStyle | null = getPhotoStyle(selectedStyleId) ?? null;
    const selectedColorPalette: ColorPalette | null = selectedColorId ? getColorPalette(selectedColorId) ?? null : null;
    const colorActive = colorMode !== 'none';
    const colorLabel = colorMode === 'preset'
        ? selectedColorPalette?.title ?? null
        : colorMode === 'manual'
            ? 'Своя'
            : null;
    const colorSwatches = colorMode === 'preset'
        ? selectedColorPalette?.colors ?? []
        : colorMode === 'manual'
            ? manualColors
            : [];

    const anyPanelOpen = stylesOpen || paletteOpen;

    React.useEffect(() => {
        if (initialImage) setCharacterImage(initialImage);
    }, [initialImage]);

    const pickCharacter = () => characterRef.current?.click();
    const pickPromptReference = () => promptRefInput.current?.click();

    const closePanels = () => {
        setStylesOpen(false);
        setPaletteOpen(false);
    };

    const openStyles = () => {
        setPaletteOpen(false);
        setStylesOpen(true);
    };

    const openPalette = () => {
        setStylesOpen(false);
        setPaletteOpen(true);
    };

    const handleCharacterUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = ev => {
            setCharacterImage(ev.target?.result as string);
            setError(null);
        };
        reader.readAsDataURL(file);
        e.target.value = '';
    };

    const handlePromptRefUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = ev => {
            const url = ev.target?.result as string;
            setPromptReferences(prev => [...prev, url].slice(0, 4));
            setError(null);
        };
        reader.readAsDataURL(file);
        e.target.value = '';
    };

    const selectStyle = (style: PhotoStyle) => {
        setSelectedStyleId(style.id);
        setError(null);
        setStylesOpen(false);
    };

    const selectPalette = (palette: ColorPalette) => {
        setSelectedColorId(palette.id);
        setColorMode('preset');
        setError(null);
        setPaletteOpen(false);
    };

    const resetColor = () => {
        setColorMode('none');
        setSelectedColorId(null);
        setError(null);
        setPaletteOpen(false);
    };

    const applyManualColors = (colors: string[], background: string | null) => {
        setManualColors(colors);
        setManualBackground(background);
        setColorMode('manual');
        setSelectedColorId(null);
        setError(null);
        setPaletteOpen(false);
    };

    const handleUploadReference = () => {
        setPaletteOpen(false);
        pickPromptReference();
    };

    const addPromptReference = (url: string) => {
        setPromptReferences(prev => (prev.includes(url) ? prev : [...prev, url].slice(0, 4)));
        setError(null);
    };

    const removeCharacter = () => {
        setCharacterImage(null);
        setError(null);
    };

    const handleGenerate = async () => {
        if (!characterImage || !user) {
            setError('Загрузите фото в Character');
            pickCharacter();
            return;
        }
        const totalCost = PALETTE_GEN_COST * batchCount;
        if (credits < totalCost) {
            setError(`Недостаточно кредитов (${totalCost})`);
            return;
        }

        setLoading(true);
        setError(null);

        const refs = [
            { data: cleanBase64(characterImage), mimeType: getMimeType(characterImage), role: 'character' as const },
            ...promptReferences.map(url => ({
                data: cleanBase64(url),
                mimeType: getMimeType(url),
                role: 'reference' as const,
            })),
        ];

        try {
            let remainingCredits = credits;
            for (let i = 0; i < batchCount; i++) {
                const promptText = buildStudioPrompt({
                    userPrompt: prompt,
                    style: selectedStyle,
                    colorMode,
                    colorPalette: colorMode === 'preset' ? selectedColorPalette : null,
                    manualColors: colorMode === 'manual' ? manualColors : undefined,
                    backgroundColor: colorMode === 'manual' ? manualBackground : null,
                    promptReferenceCount: promptReferences.length,
                    aspectRatio,
                    resolution,
                    batchIndex: batchCount > 1 ? i + 1 : undefined,
                    batchTotal: batchCount > 1 ? batchCount : undefined,
                });

                const generatedData = await generateImageWithGemini(
                    promptText,
                    refs,
                    aspectRatio,
                    'gemini-2.5-flash-image',
                    { quality: resolution, krasoModel: krasoModelId },
                );

                await deductCredits(user.uid, PALETTE_GEN_COST);
                remainingCredits -= PALETTE_GEN_COST;
                onUpdateCredits(remainingCredits);

                const storageUrl = await uploadImageToStorage(user.uid, generatedData, 'generated');
                const meta = [
                    selectedStyle?.title,
                    colorMode === 'preset' ? selectedColorPalette?.title : colorMode === 'manual' ? 'Custom palette' : null,
                    aspectRatio,
                    resolution,
                ].filter(Boolean).join(' · ');

                const item: GeneratedImage = {
                    original: characterImage,
                    generated: storageUrl,
                    prompt: `[ШАБЛОН] ${meta}\n${promptText}`,
                    source: 'recolor',
                    createdAt: { seconds: Math.floor(Date.now() / 1000) } as GeneratedImage['createdAt'],
                };
                const docId = await saveGenerationToHistory(user.uid, item);
                if (docId) item.id = docId;
                onGenerationSaved(item);
            }
        } catch (err) {
            console.error('[RecolorView] generation failed:', err);
            const detail = err instanceof Error ? err.message : String(err);
            setError(detail ? `Ошибка генерации: ${detail}` : 'Ошибка генерации. Попробуйте ещё раз.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="is is-root flex-1 flex flex-col min-h-0 overflow-hidden relative">
            <input type="file" ref={characterRef} className="hidden" accept="image/*" onChange={handleCharacterUpload} />
            <input type="file" ref={promptRefInput} className="hidden" accept="image/*" onChange={handlePromptRefUpload} />

            {anyPanelOpen && (
                <button
                    type="button"
                    className="is-canvas-dim"
                    onClick={closePanels}
                    aria-label="Закрыть панель"
                />
            )}

            <div className="is-canvas-scroll custom-scrollbar">
                <RecolorCanvas
                    items={historyData}
                    loading={loading}
                    onAddPromptReference={addPromptReference}
                />
            </div>

            <div className="is-dock">
                <div className="is-dock__stack">
                    {stylesOpen && (
                        <StyleTemplatePanel
                            selectedStyleId={selectedStyleId}
                            onSelectStyle={selectStyle}
                            onClose={() => setStylesOpen(false)}
                        />
                    )}
                    {paletteOpen && (
                        <PalettePanel
                            initialColors={manualColors}
                            selectedPaletteId={colorMode === 'preset' ? selectedColorId : null}
                            onSelectPalette={selectPalette}
                            onReset={resetColor}
                            onClose={() => setPaletteOpen(false)}
                            onUploadReference={handleUploadReference}
                            onApplyManual={applyManualColors}
                        />
                    )}
                    <div className="is-dock__inner">
                        <RecolorComposer
                            prompt={prompt}
                            onPromptChange={setPrompt}
                            promptReferences={promptReferences}
                            onRemovePromptReference={(i) => setPromptReferences(prev => prev.filter((_, idx) => idx !== i))}
                            characterImage={characterImage}
                            selectedStyle={selectedStyle}
                            krasoModelId={krasoModelId}
                            onKrasoModelChange={setKrasoModelId}
                            colorLabel={colorLabel}
                            colorActive={colorActive}
                            colorSwatches={colorSwatches}
                            onOpenStyles={openStyles}
                            onOpenPalette={openPalette}
                            onPickCharacter={pickCharacter}
                            onRemoveCharacter={removeCharacter}
                            onPickPromptReference={pickPromptReference}
                            aspectRatio={aspectRatio}
                            onAspectRatioChange={setAspectRatio}
                            resolution={resolution}
                            onResolutionChange={setResolution}
                            batchCount={batchCount}
                            onBatchChange={setBatchCount}
                            loading={loading}
                            error={error}
                            credits={credits}
                            onGenerate={handleGenerate}
                            canGenerate={Boolean(characterImage && selectedStyleId)}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default RecolorView;
