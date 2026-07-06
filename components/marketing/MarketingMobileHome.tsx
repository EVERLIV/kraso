import React from 'react';
import { DollarSign, Clapperboard, Globe, Smartphone, Package, ShoppingBag, MessageCircle, ArrowLeftRight, Star, Zap, Video, Users, Lightbulb, Eye, Layers2, Wind } from 'lucide-react';
import { MARKETING_FILTERS, MARKETING_TEMPLATES, MarketingFilter, MarketingTemplate } from '../../lib/marketingPresets';

const TEMPLATE_ICON: Record<string, React.ReactNode> = {
    'ugc':                <Smartphone className="size-[15px] text-white" />,
    'unboxing-asmr':      <Package className="size-[15px] text-[var(--ms-on-lime)]" />,
    'unboxing-tryon':     <ShoppingBag className="size-[15px] text-white" />,
    'selfie-testimonial': <MessageCircle className="size-[15px] text-[var(--ms-on-lime)]" />,
    'before-after':       <ArrowLeftRight className="size-[15px] text-white" />,
    'product-review':     <Star className="size-[15px] text-[var(--ms-on-lime)]" />,
    'gadget-saved-me':    <Zap className="size-[15px] text-white" />,
    'couple-sharing':     <Users className="size-[15px] text-white" />,
    'secret-hack':        <Lightbulb className="size-[15px] text-white" />,
    'camera-pov':         <Eye className="size-[15px] text-white" />,
    'classic-modern':     <Layers2 className="size-[15px] text-[var(--ms-on-lime)]" />,
    'mess-to-fresh':      <Wind className="size-[15px] text-[var(--ms-on-lime)]" />,
};
import { MarketingTool } from './MarketingStudioShell';
import MarketingIconTile from './MarketingIconTile';
import MarketingPreviewMedia from './MarketingPreviewMedia';

const HERO_TPL = MARKETING_TEMPLATES[3] ?? MARKETING_TEMPLATES[0];

function HeroFanImage({ src, poster, className }: { src: string; poster: string; className?: string }) {
    return (
        <MarketingPreviewMedia src={src} poster={poster} fallback={poster} className={className} />
    );
}

interface MarketingMobileHomeProps {
    filter: MarketingFilter;
    onFilterChange: (f: MarketingFilter) => void;
    templates: MarketingTemplate[];
    onStartCreating: () => void;
    onTryTemplate: (tpl: MarketingTemplate) => void;
    onOpenTool?: (tool: MarketingTool) => void;
}

function MarketingMobileHome({
    filter, onFilterChange, templates, onStartCreating, onTryTemplate, onOpenTool,
}: MarketingMobileHomeProps) {
    const filterIcon = (id: MarketingFilter) => {
        if (id === 'commercial') return <DollarSign className="size-3.5" />;
        if (id === 'ugc') return <Clapperboard className="size-3.5" />;
        return null;
    };

    return (
        <div className="md:hidden px-4 pt-2 pb-8">
            {/* Hero fan */}
            <div className="relative flex items-end justify-center h-[200px] mb-6">
                <HeroFanImage
                    src={HERO_TPL.previews[0]}
                    poster={HERO_TPL.previewPosters[0]}
                    className="absolute left-[12%] bottom-0 w-[72px] h-[108px] rounded-2xl object-cover opacity-80 -rotate-6 shadow-lg"
                />
                <HeroFanImage
                    src={HERO_TPL.previews[1]}
                    poster={HERO_TPL.previewPosters[1]}
                    className="relative z-10 w-[100px] h-[150px] rounded-2xl object-cover shadow-xl"
                />
                <HeroFanImage
                    src={HERO_TPL.previews[2]}
                    poster={HERO_TPL.previewPosters[2]}
                    className="absolute right-[12%] bottom-0 w-[72px] h-[108px] rounded-2xl object-cover opacity-80 rotate-6 shadow-lg"
                />
            </div>

            <h1 className="ms-font-display text-[22px] leading-[0.95] text-center text-balance mb-6 px-2">
                Превратите любой товар в видеорекламу
            </h1>

            <button
                type="button"
                onClick={onStartCreating}
                className="w-full ms-btn-primary py-4 text-base font-bold rounded-2xl mb-4"
                style={{ background: 'linear-gradient(90deg, #DEFE4C, #C6F017)' }}
            >
                Начать создание
            </button>

            {onOpenTool && (
                <div className="grid grid-cols-2 gap-2 mb-8">
                    <button
                        type="button"
                        onClick={() => onOpenTool('url')}
                        className="ms-panel p-3 flex items-center gap-2.5 text-left"
                    >
                        <MarketingIconTile variant="blue" size="card">
                            <Globe className="size-3.5 text-white" />
                        </MarketingIconTile>
                        <span className="text-xs font-semibold leading-tight">Ссылка в рекламу</span>
                    </button>
                    <button
                        type="button"
                        onClick={() => onOpenTool('reference')}
                        className="ms-panel p-3 flex items-center gap-2.5 text-left"
                    >
                        <MarketingIconTile variant="purple" size="card">
                            <Clapperboard className="size-3.5 text-white" />
                        </MarketingIconTile>
                        <span className="text-xs font-semibold leading-tight">Референс рекламы</span>
                    </button>
                </div>
            )}

            {!onOpenTool && <div className="mb-8" />}

            {/* Filters — horizontal scroll */}
            <div className="flex gap-2 overflow-x-auto no-scrollbar mb-6 -mx-1 px-1">
                {MARKETING_FILTERS.map(f => (
                    <button
                        key={f.id}
                        type="button"
                        onClick={() => onFilterChange(f.id)}
                        className={`shrink-0 inline-flex items-center gap-1.5 ${
                            filter === f.id ? 'ms-filter-active' : 'ms-filter-inactive'
                        }`}
                    >
                        {filterIcon(f.id)}
                        {f.label}
                        {f.badge && <span className="ms-badge-new">{f.badge}</span>}
                    </button>
                ))}
            </div>

            {/* Template cards */}
            <div className="space-y-4">
                {templates.map(tpl => (
                    <div key={tpl.id} className="ms-panel p-3 shadow-[var(--ms-shadow-panel)]">
                        <div className="grid grid-cols-3 gap-1.5 mb-3">
                            {tpl.previews.map((src, i) => (
                                <HeroFanImage
                                    key={i}
                                    src={src}
                                    poster={tpl.previewPosters[i]}
                                    className="w-full aspect-[3/4] rounded-xl object-cover bg-[var(--ms-raised)]"
                                />
                            ))}
                        </div>
                        <div className="flex items-center gap-3">
                            <MarketingIconTile variant={tpl.tileVariant} size="card">
                                {TEMPLATE_ICON[tpl.id] ?? <Video className="size-[15px] text-white" />}
                            </MarketingIconTile>
                            <div className="flex-1 min-w-0">
                                <p className="text-[15px] font-bold">{tpl.title}</p>
                                <p className="text-xs text-[var(--ms-muted)] truncate">{tpl.subtitle}</p>
                            </div>
                            <button
                                type="button"
                                onClick={() => onTryTemplate(tpl)}
                                className="ms-btn-primary px-5 py-2 text-[13px] font-bold rounded-xl shrink-0"
                            >
                                Попробовать
                            </button>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default MarketingMobileHome;
