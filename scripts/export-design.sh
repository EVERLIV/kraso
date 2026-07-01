#!/usr/bin/env bash
# Собирает весь UI/UX-контекст проекта SmartPhotos в один файл design-export.md
# для отправки в Claude (редизайн UI/UX).
#
# Запуск:  bash scripts/export-design.sh
# Результат: design-export.md в корне проекта

set -euo pipefail
cd "$(dirname "$0")/.."

OUT="design-export.md"

# Ключевые файлы дизайна (порядок = приоритет для чтения Claude)
FILES=(
  "index.html"                          # design tokens, тема, Tailwind config, шрифты
  "components/DesignSystemView.tsx"     # витрина дизайн-системы
  "components/LandingPage.tsx"          # лендинг
  "components/Header.tsx"
  "components/Footer.tsx"
  "components/Sidebar.tsx"
  "components/ChatInterface.tsx"        # основной экран генерации
  "components/ImageUploader.tsx"
  "components/Presets.tsx"
  "components/TemplateGrid.tsx"
  "components/PricingModal.tsx"
  "components/UserProfileModal.tsx"
  "components/InfoModal.tsx"
  "components/ProfileSettings.tsx"
  "components/CookieConsent.tsx"
  "App.tsx"                             # корневой layout / роутинг
)

# Шапка
{
  echo "# SmartPhotos — UI/UX Design Export"
  echo
  echo "Полный дизайн-контекст проекта для редизайна в Claude."
  echo "Стек: React 19 + Vite + Tailwind (CDN, конфиг инлайн в index.html)."
  echo "Design tokens (CSS-переменные) и тема — в \`<style>\` внутри index.html."
  echo
  echo "Сгенерировано: $(date '+%Y-%m-%d %H:%M')"
  echo
  echo "## Файлы в этом экспорте"
  for f in "${FILES[@]}"; do
    [ -f "$f" ] && echo "- \`$f\` ($(wc -l < "$f" | tr -d ' ') строк)"
  done
  echo
  echo "---"
  echo
} > "$OUT"

# Содержимое каждого файла в fenced-блоке с подсказкой языка
for f in "${FILES[@]}"; do
  if [ ! -f "$f" ]; then
    echo "⚠️  пропущен (нет файла): $f" >&2
    continue
  fi
  case "$f" in
    *.html) lang=html ;;
    *.tsx)  lang=tsx ;;
    *.ts)   lang=ts ;;
    *.css)  lang=css ;;
    *)      lang= ;;
  esac
  {
    echo "## \`$f\`"
    echo
    echo "\`\`\`$lang"
    cat "$f"
    echo "\`\`\`"
    echo
  } >> "$OUT"
done

LINES=$(wc -l < "$OUT" | tr -d ' ')
SIZE=$(wc -c < "$OUT" | tr -d ' ')
echo "✅ Готово: $OUT  ($LINES строк, $SIZE байт)"
echo "Откройте файл и скопируйте его содержимое в Claude вместе с описанием желаемого редизайна."
