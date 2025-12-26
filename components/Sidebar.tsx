
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
  Wand2
} from 'lucide-react';
import { CategoryId, ViewMode, SubscriptionTier } from '../types';

export interface CategoryItem {
  id: CategoryId;
  label: string;
  icon: any;
  badge?: string;
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
  onChangeView
}) => {
  const maxCredits = TIER_LIMITS[userTier] || 5;
  const creditPercentage = Math.min((credits / maxCredits) * 100, 100);

  const NavItem = ({ view, icon: Icon, label, badge, colorClass }: { view: ViewMode, icon: any, label: string, badge?: string, colorClass?: string }) => (
    <button
        onClick={() => { onChangeView(view); onClose?.(); }}
        className={`
          w-full flex items-center px-3 py-2.5 rounded-lg transition-all duration-200 group/btn
          ${currentView === view 
            ? 'bg-brand-card text-brand-text border border-brand-border shadow-sm' 
            : 'text-brand-muted hover:text-white hover:bg-white/5 border border-transparent'}
          ${isCollapsed ? 'justify-center' : 'justify-start gap-3'}
        `}
        title={label}
    >
        <div className={`w-5 h-5 shrink-0 flex items-center justify-center ${currentView === view ? colorClass : ''}`}>
          <Icon className="w-5 h-5" />
        </div>
        {!isCollapsed && (
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <span className="text-sm font-medium truncate">{label}</span>
            {badge && (
              <span className="text-[9px] font-bold bg-brand-accent/20 text-brand-accent px-1.5 py-0.5 rounded uppercase tracking-wider ml-auto">
                {badge}
              </span>
            )}
          </div>
        )}
    </button>
  );

  const renderSidebarContent = (collapsed: boolean) => (
    <div className="flex flex-col h-full bg-brand-bg text-brand-muted">
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
            label="AI Чат" 
            badge="MIX"
            colorClass="text-purple-400"
          />

          <div className="h-px bg-brand-border/50 mx-2 my-2 shrink-0"></div>
          
          <div className={`px-3 py-1 text-[10px] font-bold text-brand-muted uppercase tracking-wider mb-1 ${collapsed ? 'hidden' : 'block'}`}>
             Инструменты
          </div>

          <NavItem 
            view="upscale" 
            icon={ScanEye} 
            label="Upscale 4K" 
            badge="NEW"
            colorClass="text-blue-400"
          />

          <NavItem 
            view="remove-bg" 
            icon={Eraser} 
            label="Удалить фон" 
            colorClass="text-green-400"
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
                      ? 'bg-white/5 text-white' 
                      : 'text-brand-muted hover:text-white hover:bg-white/5'}
                   ${collapsed ? 'justify-center' : 'justify-between'}
                 `}
               >
                 <div className={`flex items-center ${collapsed ? 'justify-center w-full' : 'gap-3'} overflow-hidden`}>
                   <cat.icon className={`w-4 h-4 shrink-0 ${activeCategory === cat.id ? 'text-brand-accent' : 'text-brand-muted group-hover/btn:text-white'}`} />
                   
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
       
       {currentView !== 'dashboard' && (
          <div className="flex-1 px-4 py-8 text-center text-brand-muted text-xs">
             {!collapsed && (
                <div className="bg-white/5 rounded-xl p-4 border border-white/5">
                   <Wand2 className="w-6 h-6 mx-auto mb-2 text-brand-accent" />
                   <p className="mb-2 font-bold text-white">Совет</p>
                   <p className="opacity-70">
                      {currentView === 'chat' && 'Используйте чат для смешивания фото.'}
                      {currentView === 'upscale' && 'Upscale делает фото четче и может менять цвета.'}
                      {currentView === 'remove-bg' && 'Быстрое удаление фона для товаров.'}
                   </p>
                </div>
             )}
          </div>
       )}

       {/* Footer Toggle */}
       <div className="p-3 border-t border-brand-border/50 bg-brand-bg shrink-0 flex flex-col gap-3 mt-auto">
          {!collapsed && (
             <div className="bg-gradient-to-r from-purple-500/10 to-blue-500/10 border border-brand-border rounded-xl p-3 group">
                <div className="flex justify-between items-center mb-2">
                   <p className="text-xs text-brand-muted">Кредиты</p>
                   <Zap className="w-3 h-3 text-yellow-500" fill="currentColor"/>
                </div>
                
                <div className="h-1.5 w-full bg-brand-bg rounded-full overflow-hidden mb-1 ring-1 ring-white/5">
                   <div 
                     className="h-full bg-gradient-to-r from-yellow-500 to-orange-500 transition-all duration-500"
                     style={{ width: `${creditPercentage}%` }}
                   ></div>
                </div>
                <p className="text-[10px] text-right text-brand-muted opacity-70 font-mono">
                  {credits} / {maxCredits}
                </p>
             </div>
          )}

          <div className={`flex ${collapsed ? 'justify-center' : 'justify-end'}`}>
            <button 
               onClick={toggleCollapse}
               className="p-2 text-brand-muted hover:text-white hover:bg-white/5 rounded-lg transition-colors"
               title={collapsed ? "Развернуть" : "Свернуть"}
            >
               {collapsed ? <PanelLeftOpen className="w-5 h-5" /> : <PanelLeftClose className="w-5 h-5" />}
            </button>
          </div>
       </div>
    </div>
  );

  return (
    <>
      {/* Mobile Sidebar Overlay */}
      <div className={`fixed inset-0 z-[70] lg:hidden transition-all duration-300 ${isOpen ? 'visible' : 'invisible'}`}>
        <div className={`absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`} onClick={onClose} />
        <aside className={`absolute top-0 bottom-0 left-0 w-72 bg-brand-bg border-r border-brand-border flex flex-col shadow-2xl transition-transform duration-300 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
          <div className="h-16 flex items-center justify-between px-4 border-b border-brand-border shrink-0">
             <span className="font-bold text-white text-lg">Меню</span>
             <button onClick={onClose} className="p-2 text-brand-muted hover:text-white hover:bg-white/10 rounded-lg transition-colors">
                <X className="w-5 h-5" />
             </button>
          </div>
          {renderSidebarContent(false)}
        </aside>
      </div>

      {/* Desktop Sidebar - STATIC LAYOUT (No Fixed positioning) */}
      <aside 
        className={`hidden lg:flex flex-col shrink-0 border-r border-brand-border transition-all duration-300 ease-in-out bg-brand-bg ${isCollapsed ? 'w-16' : 'w-64'}`}
      >
         {renderSidebarContent(isCollapsed)}
      </aside>
    </>
  );
};

export default Sidebar;
