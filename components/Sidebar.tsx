
import React from 'react';
import {
  PanelLeftClose,
  PanelLeftOpen,
  Zap,
  X,
  MessageSquare,
  LayoutDashboard,
  ScanEye,
  Eraser,
  Wand2,
  Settings,
  Video,
  Sliders,
  Cloud,
  ImagePlus,
  Layers,
  Bot
} from 'lucide-react';
import { CategoryId, ViewMode, SubscriptionTier, AspectRatio, GenModelId } from '../types';

export interface CategoryItem {
  id: CategoryId;
  label: string;
  icon: any;
  badge?: string;
}

export interface ChatSettings {
  quality: 'low' | 'medium' | 'high';
  format: 'jpeg' | 'png';
  aspectRatio: AspectRatio;
  model: GenModelId;
  setModel: (m: GenModelId) => void;
  setQuality: (q: 'low' | 'medium' | 'high') => void;
  setFormat: (f: 'jpeg' | 'png') => void;
  setAspectRatio: (r: AspectRatio) => void;
  // Shared Input State
  prompt: string;
  setPrompt: (p: string) => void;
  attachedImages: string[];
  setAttachedImages: (imgs: string[]) => void;
  isGenerating: boolean;
  onGenerate: () => void;
  triggerFileSelect: () => void;
}

export interface VideoSettings {
  duration: '5' | '10';
  aspectRatio: '16:9' | '9:16' | '1:1';
  negativePrompt: string;
  cfgScale: number;
  setDuration: (d: '5' | '10') => void;
  setAspectRatio: (r: '16:9' | '9:16' | '1:1') => void;
  setNegativePrompt: (p: string) => void;
  setCfgScale: (s: number) => void;
}


interface SidebarProps {
  categories: CategoryItem[];
  activeCategory: CategoryId;
  onSelectCategory: (id: CategoryId) => void;
  isCollapsed: boolean;
  toggleCollapse: () => void;
  credits: number;
  userTier: SubscriptionTier;
  isOpen?: boolean;
  onClose?: () => void;
  currentView: ViewMode;
  onChangeView: (view: ViewMode) => void;
  chatSettings?: ChatSettings;
  videoSettings?: VideoSettings;
}

const TIER_LIMITS: Record<SubscriptionTier, number> = {
  'free': 5,
  'creator': 100,
  'pro': 500,
  'business': 2000
};

const Sidebar: React.FC<SidebarProps> = ({
  categories,
  activeCategory,
  onSelectCategory,
  isCollapsed,
  toggleCollapse,
  credits,
  userTier,
  isOpen = false,
  onClose,
  currentView,
  onChangeView,
  chatSettings,
  videoSettings
}) => {
  const maxCredits = TIER_LIMITS[userTier] || 5;
  const creditPercentage = Math.min((credits / maxCredits) * 100, 100);

  const NavItem = ({ view, icon: Icon, label, badge }: { view: ViewMode, icon: any, label: string, badge?: string, colorClass?: string }) => (
    <button
      onClick={() => { onChangeView(view); onClose?.(); }}
      className={`
          w-full flex items-center px-3 py-2 border-l-2 transition-colors group/btn
          ${currentView === view
          ? 'border-primary text-ink bg-surface-muted/50'
          : 'border-transparent text-ink-muted hover:text-ink'}
          ${isCollapsed ? 'justify-center' : 'justify-start gap-3'}
        `}
      title={label}
    >
      <Icon className="w-[18px] h-[18px] shrink-0" />
      {!isCollapsed && (
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <span className="text-[13px] truncate">{label}</span>
          {badge && (
            <span className="text-[9px] font-semibold text-ink-faint uppercase tracking-wider ml-auto">
              {badge}
            </span>
          )}
        </div>
      )}
    </button>
  );

  const renderSidebarContent = (collapsed: boolean) => (
    <div className="flex flex-col h-full bg-brand-sidebar text-brand-muted">
      {/* Feature Navigation */}
      <div className="px-2 pt-4 pb-2 space-y-1 shrink-0">
        <NavItem
          view="dashboard"
          icon={LayoutDashboard}
          label="Студия"
        />

        <NavItem
          view="chat"
          icon={MessageSquare}
          label="AI Studio"
          badge="PRO"
          colorClass="text-purple-400"
        />

        <NavItem
          view="video"
          icon={Video}
          label="Оживить Фото"
          badge="NEW"
          colorClass="text-pink-400"
        />

        <NavItem
          view="profile"
          icon={Settings}
          label="Настройки"
        />


      </div>

      <div className="h-px bg-brand-border/50 mx-4 my-2 shrink-0"></div>

      {/* Categories (Only show if in Dashboard mode) */}
      {currentView === 'dashboard' && (
        <div className="flex-1 overflow-y-auto custom-scrollbar px-2 space-y-1 pb-4 min-h-0">
          {!collapsed && <p className="px-3 py-2 text-[10px] font-bold text-brand-muted uppercase tracking-wider">Шаблоны</p>}
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => { onSelectCategory(cat.id); onClose?.(); }}
              title={collapsed ? cat.label : undefined}
              className={`
                   w-full flex items-center px-3 py-2 rounded-lg transition-all duration-200 group/btn relative
                   ${activeCategory === cat.id
                  ? 'bg-white shadow-sm border border-brand-border text-brand-text'
                  : 'text-brand-muted hover:text-brand-text hover:bg-gray-200'}
                   ${collapsed ? 'justify-center' : 'justify-between'}
                 `}
            >
              <div className={`flex items-center ${collapsed ? 'justify-center w-full' : 'gap-3'} overflow-hidden`}>
                <cat.icon className={`w-4 h-4 shrink-0 ${activeCategory === cat.id ? 'text-brand-accent' : 'text-brand-muted group-hover/btn:text-brand-text'}`} />

                {!collapsed && (
                  <span className="text-sm font-medium whitespace-nowrap overflow-hidden text-ellipsis">
                    {cat.label}
                  </span>
                )}
              </div>

              {!collapsed && cat.badge && (
                <span className="text-[9px] font-bold bg-brand-accent/20 text-brand-accent px-1.5 py-0.5 rounded uppercase tracking-wider ml-2 shrink-0">
                  {cat.badge}
                </span>
              )}
            </button>
          ))}
        </div>
      )}

      {/* Settings / Banner Area */}
      {currentView !== 'dashboard' && (
        <div className={`flex-1 overflow-y-auto p-4 ${collapsed ? 'px-2' : ''}`}>

          {/* Chat Settings */}
          {currentView === 'chat' && chatSettings && !collapsed && (
            <div className="space-y-6 animate-in fade-in slide-in-from-left-2 duration-300">
              <div className="flex items-center gap-2 mb-4">
                <Sliders className="w-4 h-4 text-purple-500" />
                <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Параметры</span>
              </div>

              {/* Model Selector */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Модель Нейросети</label>
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => chatSettings.setModel('gemini-2.5-flash-image')}
                    className={`flex items-center gap-3 p-2 rounded-xl border transition-all text-left ${chatSettings.model === 'gemini-2.5-flash-image' ? 'bg-purple-50 border-purple-200 ring-1 ring-purple-100' : 'bg-white border-gray-200 hover:bg-gray-50'}`}
                  >
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${chatSettings.model === 'gemini-2.5-flash-image' ? 'bg-purple-500 text-white' : 'bg-gray-100 text-slate-400'}`}>
                      <Zap className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-700">Gemini Flash 2.5</div>
                      <div className="text-[9px] text-slate-400">Быстро • Креативно</div>
                    </div>
                  </button>

                  <button
                    onClick={() => chatSettings.setModel('nano-banana-v1')}
                    className={`flex items-center gap-3 p-2 rounded-xl border transition-all text-left ${chatSettings.model === 'nano-banana-v1' ? 'bg-yellow-50 border-yellow-200 ring-1 ring-yellow-100' : 'bg-white border-gray-200 hover:bg-gray-50'}`}
                  >
                    <div className={`w-8 h-8 rounded-lg flex items-center justify-center ${chatSettings.model === 'nano-banana-v1' ? 'bg-yellow-500 text-white' : 'bg-gray-100 text-slate-400'}`}>
                      <Bot className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-700">Nano Banana v1</div>
                      <div className="text-[9px] text-slate-400">Точно • Реализм</div>
                    </div>
                  </button>
                </div>
              </div>

              {/* Aspect Ratio */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase">Формат</label>
                <div className="grid grid-cols-3 gap-2">
                  {(['1:1', '16:9', '9:16'] as const).map(ratio => (
                    <button
                      key={ratio}
                      onClick={() => chatSettings.setAspectRatio(ratio)}
                      className={`px-1 py-1.5 rounded-lg text-[10px] font-bold border transition-all ${chatSettings.aspectRatio === ratio ? 'bg-purple-600 text-white border-purple-600' : 'bg-white border-gray-200 text-slate-500 hover:bg-gray-50'}`}
                    >
                      {ratio}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quality */}
              <div className="space-y-2">
                <label className="text-[10px] font-bold text-slate-400 uppercase flex justify-between">
                  Качество
                  <span className="text-[9px] text-purple-600 bg-purple-100 px-1 rounded">{chatSettings.quality === 'high' ? '$$$' : chatSettings.quality === 'medium' ? '$$' : '$'}</span>
                </label>
                <div className="flex p-0.5 bg-gray-200 rounded-lg">
                  {(['low', 'medium', 'high'] as const).map((q) => (
                    <button
                      key={q}
                      onClick={() => chatSettings.setQuality(q)}
                      className={`flex-1 py-1 text-[10px] font-bold capitalize rounded-md transition-all ${chatSettings.quality === q ? 'bg-white text-purple-700 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                      {q}
                    </button>
                  ))}
                </div>
              </div>

            </div >
          )}

          {/* Video Settings */}
          {
            currentView === 'video' && videoSettings && !collapsed && (
              <div className="space-y-6 animate-in fade-in slide-in-from-left-2 duration-300">
                <div className="flex items-center gap-2 mb-4">
                  <Sliders className="w-4 h-4 text-pink-500" />
                  <span className="text-xs font-bold uppercase tracking-wider text-slate-500">Параметры</span>
                </div>

                {/* Duration */}
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Длительность</label>
                  <div className="flex gap-2">
                    <button
                      onClick={() => videoSettings.setDuration('5')}
                      className={`flex-1 py-1.5 text-[10px] font-bold rounded-lg transition-all ${videoSettings.duration === '5' ? 'bg-white text-pink-600 shadow-sm border border-pink-200' : 'text-slate-500 hover:text-slate-700 border border-transparent bg-gray-100'}`}
                    >
                      5 сек
                    </button>
                    <button
                      onClick={() => videoSettings.setDuration('10')}
                      className={`flex-1 py-1.5 text-[10px] font-bold rounded-lg transition-all ${videoSettings.duration === '10' ? 'bg-white text-pink-600 shadow-sm border border-pink-200' : 'text-slate-500 hover:text-slate-700 border border-transparent bg-gray-100'}`}
                    >
                      10 сек
                    </button>
                  </div>
                </div>

                {/* Aspect Ratio */}
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Формат</label>
                  <div className="grid grid-cols-3 gap-2">
                    <button
                      onClick={() => videoSettings.setAspectRatio('16:9')}
                      className={`px-1 py-1.5 rounded-lg text-[10px] font-bold border transition-all ${videoSettings.aspectRatio === '16:9' ? 'bg-pink-600 text-white border-pink-600' : 'bg-white border-gray-200 text-slate-500 hover:bg-gray-50'}`}
                    >
                      16:9
                    </button>
                    <button
                      onClick={() => videoSettings.setAspectRatio('1:1')}
                      className={`px-1 py-1.5 rounded-lg text-[10px] font-bold border transition-all ${videoSettings.aspectRatio === '1:1' ? 'bg-pink-600 text-white border-pink-600' : 'bg-white border-gray-200 text-slate-500 hover:bg-gray-50'}`}
                    >
                      1:1
                    </button>
                    <button
                      onClick={() => videoSettings.setAspectRatio('9:16')}
                      className={`px-1 py-1.5 rounded-lg text-[10px] font-bold border transition-all ${videoSettings.aspectRatio === '9:16' ? 'bg-pink-600 text-white border-pink-600' : 'bg-white border-gray-200 text-slate-500 hover:bg-gray-50'}`}
                    >
                      9:16
                    </button>
                  </div>
                </div>

                {/* CFG Scale */}
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="text-[10px] font-bold text-slate-400 uppercase">CFG Scale</label>
                    <span className="text-[9px] font-mono text-pink-600 bg-pink-100 px-1.5 py-0.5 rounded">{videoSettings.cfgScale.toFixed(1)}</span>
                  </div>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={videoSettings.cfgScale}
                    onChange={(e) => videoSettings.setCfgScale(parseFloat(e.target.value))}
                    className="w-full h-1.5 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-pink-600"
                  />
                  <div className="flex justify-between text-[9px] text-slate-400">
                    <span>Креативно</span>
                    <span>Точно</span>
                  </div>
                </div>

                {/* Negative Prompt */}
                <div className="space-y-2">
                  <label className="text-[10px] font-bold text-slate-400 uppercase">Negative Prompt</label>
                  <textarea
                    value={videoSettings.negativePrompt}
                    onChange={(e) => videoSettings.setNegativePrompt(e.target.value)}
                    placeholder="blur, distort..."
                    className="w-full px-2 py-1.5 text-[10px] border border-gray-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-pink-500 resize-none bg-white"
                    rows={2}
                  />
                </div>
              </div>
            )
          }

        </div >
      )}

      {/* Footer */}
      <div className="px-3 py-2.5 border-t border-[var(--border-strong)] bg-brand-sidebar shrink-0 flex flex-col gap-2 mt-auto">
        {!collapsed && (
          <div className="flex items-center justify-between px-1">
            <span className="text-[12px] text-ink-muted">Кредиты</span>
            <span className="text-[12px] text-ink font-medium tabular-nums">{credits}</span>
          </div>
        )}
        {!collapsed && (
          <div className="h-1 w-full bg-surface-muted rounded-full overflow-hidden">
            <div className="h-full bg-primary transition-all duration-500" style={{ width: `${creditPercentage}%` }} />
          </div>
        )}
        <button
          onClick={toggleCollapse}
          className={`p-1.5 text-ink-muted hover:text-ink hover:bg-surface-muted rounded-md transition-colors ${collapsed ? 'self-center' : 'self-end'}`}
          title={collapsed ? "Развернуть" : "Свернуть"}
        >
          {collapsed ? <PanelLeftOpen className="w-4 h-4" /> : <PanelLeftClose className="w-4 h-4" />}
        </button>
      </div>
    </div >
  );

  return (
    <>
      {/* Mobile Sidebar Overlay */}
      <div className={`fixed inset-0 z-[70] lg:hidden transition-all duration-300 ${isOpen ? 'visible' : 'invisible'}`}>
        <div className={`absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`} onClick={onClose} />
        <aside className={`absolute top-0 bottom-0 left-0 w-72 bg-brand-sidebar border-r border-brand-border flex flex-col shadow-2xl transition-transform duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className="h-16 flex items-center justify-between px-4 border-b border-brand-border shrink-0">
            <span className="font-bold text-brand-text text-lg">Меню</span>
            <button onClick={onClose} className="p-2 text-brand-muted hover:text-brand-text hover:bg-gray-200 rounded-lg transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>
          {renderSidebarContent(false)}
        </aside>
      </div>

      {/* Desktop Sidebar - STATIC LAYOUT (No Fixed positioning) */}
      <aside
        className={`hidden lg:flex flex-col shrink-0 border-r border-brand-border transition-all duration-300 ease-in-out bg-brand-sidebar ${isCollapsed ? 'w-16' : 'w-64'}`}
      >
        {renderSidebarContent(isCollapsed)}
      </aside>
    </>
  );
};

export default Sidebar;
