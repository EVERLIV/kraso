# Video Studio — дизайн-спецификация

> Источник правды для страницы `/video` (VideoStudio).  
> Любые новые элементы **обязаны** использовать токены из `genBarStyles.ts` и классы из `videoTheme.css`.

## Архитектура экрана

```
┌─────────────────────────────────────────────────────────────┐
│ video-studio (.video-studio)                                 │
│  ┌──────────────┐  ┌──────────────────────────────────────┐ │
│  │ vs-sidebar   │  │ vs-workspace                          │ │
│  │ (GEN_BAR_    │  │  • static: История / Как это работает │ │
│  │  FORM)       │  │  • или vs-preset-workspace (галерея)  │ │
│  │ 320px max    │  │                                       │ │
│  └──────────────┘  └──────────────────────────────────────┘ │
└─────────────────────────────────────────────────────────────┘
```

### Поток UX (не нарушать)

1. **До «Сменить»** — справа только статичные вкладки «История» / «Как это работает». Список моделей **не** показывается.
2. **Карточка пресета** — только название + описание. Модель **скрыта**.
3. **После выбора в галерее** (`presetPanelUsed`) — на карточке: пресет + **модель**; строка «Модель · … →»; бейджи звука (если `hasAudio`).
4. **Галерея пресетов** заменяет правую область целиком (не overlay). Фон и рамка как у сайдбара.

## Токены (обязательные)

| Токен | Значение | Где |
|-------|----------|-----|
| `GEN_BAR_R` | `rounded-[6px]` | Все блоки, чипы, карточки |
| `GEN_BAR_FORM` | `bg-card-light` + border + padding | Сайдбар, галерея пресетов |
| `GEN_BAR_CHIP` | h-10, surface-muted | Параметры (длительность, формат, качество) |
| `GEN_BAR_GENERATE` | Лаймовая 3D-кнопка | «Создать» |
| `GEN_BAR_DROPDOWN` | `bottom-full` | Выпадашки в **dock** сайдбара (вверх) |
| CSS vars | `--ink`, `--primary`, `--border-soft`, `--surface-muted`, `--card-light` | Цвета |

**Запрещено:** произвольные `rounded-xl`, `border-b` разделители между секциями сайдбара/галереи, отдельный тёмный фон галереи.

## Сайдбар (`VideoStudioSidebar`)

### Порядок блоков (сверху вниз)

1. `vs-mode-tabs` — вкладки режима (без нижней border-полоски)
2. `vs-preset-card` — пресет + кнопка «Сменить»
3. `vs-model-row` — только после выбора в галерее
4. `vs-frames` — стартовый / конечный кадр (2 колонки)
5. `vs-prompt-block` — textarea + `vs-prompt-badges` внутри поля
6. `vs-sidebar__dock` — параметры + `GEN_BAR_GENERATE` (без `border-t`)

### Промпт-бейджи (`vs-prompt-badge`)

- Внутри `vs-prompt-block`, `position: absolute; bottom: 8px`
- Высота 24px, `font-size: 10px`, `font-weight: 600`
- Активный: `vs-prompt-badge--active` (primary tint)
- Набор: «Улучшение вкл.» / «Выкл.»; для моделей со звуком: «Звук вкл.» / «Без звука»

### Выпадающие параметры

- Живут в `vs-sidebar__dock`, `overflow: visible`
- Открываются **вверх** (`GEN_BAR_DROPDOWN`)
- Backdrop: `fixed inset-0 z-[55]`
- Chevron: ▼ закрыто, ▲ открыто

## Галерея пресетов (`VideoPresetPicker`)

### Контейнер `vs-preset-workspace`

- Те же `background`, `border`, `border-radius: 6px`, что у `GEN_BAR_FORM`
- Padding: `14px 16px 16px`
- **Без** горизонтальных разделителей под вкладками моделей

### Шапка (одна строка)

```
[ vs-picker-model-tab × N … ]     [ search 132px ] [ × ]
```

- Вкладки моделей: `font-weight: 600`, активная `800`, подчёркивание `border-bottom: 2px solid var(--ink)`
- Поиск: `vs-preset-workspace__search-wrap`
- Закрытие: круглая кнопка без рамки

### Сетка пресетов

- `grid-template-columns: repeat(auto-fill, minmax(148px, 1fr))`, gap 14–16px
- Карточка: `vs-preset-card-btn`, radius **12px**, aspect **3/4**
- Заголовок: uppercase, `font-weight: 800`, внизу на градиенте
- «Обычная Генерация»: `vs-preset-card-btn__placeholder--general` (зелёный ландшафтный градиент)
- Активная: `box-shadow: 0 0 0 2px var(--primary)` + галочка

## Пресеты и модели (логика)

- У **всех** моделей: `DEFAULT_VIDEO_PRESET` («Обычная Генерация»)
- Доп. пресеты: только `seedance-1.5-pro`, `seedance-2` (`SEEDANCE_VIDEO_PRESETS`)
- Выбор в галерее обновляет **и** preset, **и** model (`krasoModel` + `variant`)

## Файлы

| Файл | Назначение |
|------|------------|
| `components/VideoStudio.tsx` | Layout, состояние `presetPanelUsed`, `showPresets` |
| `components/video/VideoStudioSidebar.tsx` | Левая панель |
| `components/video/VideoPresetPicker.tsx` | Галерея пресетов |
| `components/video/videoTheme.css` | Все `vs-*` стили (только внутри `.video-studio`) |
| `components/genbar/genBarStyles.ts` | Общие токены generation bar |
| `lib/videoPresets.ts` | Данные пресетов |
| `components/video/videoStudioTokens.ts` | Имена классов + re-export токенов |

## Чеклист для новых фич

- [ ] Использует `GEN_BAR_*` или классы из `videoTheme.css`
- [ ] Radius 6px (карточки пресетов в галерее — 12px)
- [ ] Нет лишних `border-t` / `border-b` разделителей
- [ ] Модель не показывается в сайдбаре до выбора в галерее
- [ ] Dropdown в dock открывается вверх, не обрезается
- [ ] Бейджи контролов — внутри поля промпта, не отдельной строкой
- [ ] Стили scoped под `.video-studio`
