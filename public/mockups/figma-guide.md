# 🎨 FireWatch - Руководство для Figma

## 📋 Общая информация

Это подробное руководство поможет вам быстро воссоздать интерфейс FireWatch в Figma. Все экраны, компоненты, размеры и цвета описаны максимально детально.

---

## 🎨 Цветовая палитра

### Основные цвета
```
Primary (Синий):        hsl(199, 89%, 48%)  →  #0B9FD9
Background:             hsl(210, 20%, 98%)  →  #F7F9FB
Foreground (Текст):     hsl(222.2, 47.4%, 11.2%)  →  #0F172A
```

### Статусные цвета
```
Critical (Красный):     hsl(0, 84%, 60%)    →  #F44336
Warning (Оранжевый):    hsl(38, 92%, 50%)   →  #FF9800
Success (Зелёный):      hsl(142, 76%, 36%)  →  #16A34A
No Signal (Серый):      hsl(215.4, 16.3%, 46.9%)  →  #64748B
```

### Дополнительные цвета
```
Card Background:        #FFFFFF
Border:                 hsl(214.3, 31.8%, 91.4%)  →  #E2E8F0
Muted Text:             hsl(215.4, 16.3%, 46.9%)  →  #64748B
Secondary Background:   hsl(210, 40%, 96.1%)  →  #F1F5F9
```

---

## 📐 Типографика

### Шрифт
- **Основной**: System Font Stack
  - macOS: -apple-system, SF Pro
  - Windows: Segoe UI
  - Альтернатива: Roboto, sans-serif

### Размеры текста
```
Заголовок H1:      28px / 700 weight
Заголовок H2:      24px / 700 weight
Заголовок H3:      20px / 600 weight
Заголовок H4:      18px / 600 weight
Текст основной:    14px / 400 weight
Текст крупный:     16px / 400 weight
Текст мелкий:      13px / 400 weight
Текст очень мелкий: 11px / 500 weight
Цифры крупные:     36px / 700 weight
Цифры средние:     24px / 700 weight
```

---

## 📱 Сетка и отступы

### Основные параметры
- **Максимальная ширина контента**: 1400px
- **Отступы контейнера**: 24px
- **Border radius карточек**: 12px
- **Border radius кнопок**: 8px
- **Gap между элементами**: 16px - 24px

### Breakpoints
```
Mobile:     < 768px
Tablet:     768px - 1024px
Desktop:    > 1024px
Large:      > 1400px
```

---

## 🧩 Компоненты

### 1. Header (Шапка)
**Размеры:**
- Высота: 64px
- Padding: 16px 24px

**Элементы:**
- Логотип: 24px, weight 700, цвет Primary
- Кнопки: padding 8px 16px, border-radius 8px

---

### 2. Статистические карточки (Stat Cards)
**Размеры:**
- Padding: 24px
- Border radius: 12px
- Тень: 0px 1px 3px rgba(0, 0, 0, 0.1)

**Структура:**
- Иконка: 48×48px, border-radius 10px
- Значение: 36px, weight 700
- Подпись: 14px, цвет Muted

**Цвета иконок:**
- Critical: фон hsl(0, 84%, 95%)
- Warning: фон hsl(38, 92%, 95%)
- Normal: фон hsl(142, 76%, 95%)
- Info: фон hsl(199, 89%, 95%)

---

### 3. Building Card (Карточка объекта)
**Размеры:**
- Padding: 16px
- Border: 1px solid Border color
- Border radius: 8px
- Gap между элементами: 16px

**Структура:**
1. Статус-индикатор: 12×12px круг
2. Название: 16px, weight 600
3. Адрес: 13px, цвет Muted
4. Статистика: 18px, weight 600
5. Badge: padding 4px 12px, border-radius 6px, font-size 12px

**Hover эффект:**
- Border color: Primary
- Background: hsl(199, 89%, 98%)

---

### 4. Alert Card (Карточка тревоги)
**Размеры:**
- Padding: 20px
- Border radius: 12px
- Border-left: 4px solid (цвет статуса)
- Gap: 16px

**Структура:**
- Иконка: 48×48px, border-radius 12px
- Название: 18px, weight 600
- Сообщение: 14px, цвет Muted
- Время: 12px, цвет Muted
- Кнопки: padding 8px 16px

**Анимация Critical:**
```css
animation: pulse 2s infinite
0%, 100%: scale(1), shadow small
50%: scale(1.05), shadow large
```

---

### 5. Кнопки (Buttons)

**Primary Button:**
- Background: Primary color
- Color: white
- Padding: 8-14px horizontal, 8-10px vertical
- Border radius: 8-10px
- Font: 14-15px, weight 500-600

**Secondary Button:**
- Background: white или Secondary BG
- Border: 1px solid Border color
- Color: Foreground
- Hover: Background чуть темнее

**Danger Button:**
- Background: Critical color
- Color: white

---

### 6. Модальное окно (Modal)
**Размеры:**
- Максимальная ширина: 900px
- Border radius: 16px
- Тень: 0px 20px 60px rgba(0, 0, 0, 0.3)

**Структура:**
- Header: padding 24px, border-bottom 1px
- Tabs: padding 12px 20px каждая
- Content: padding 24px

---

### 7. Таблица (Table)
**Размеры:**
- Cell padding: 16px
- Header background: Secondary BG
- Border: 1px solid Border color

**Типографика:**
- Header: 13px, uppercase, letter-spacing 0.5px
- Cell: 14px

---

## 📄 Экраны

### 1. Dashboard (Главная)
**Компоненты:**
1. Header
2. Stats Grid (4 карточки)
3. Buildings Section (список объектов)

**Layout:**
- Stats Grid: 4 колонки, auto-fit, min 250px
- Gap: 20px между карточками

---

### 2. Map View (Карта)
**Компоненты:**
1. Map Container (100% высоты)
2. Legend Overlay (top-left, 300px)
3. Stats Panel (bottom-right)
4. Building Markers (60×60px круги)

**Цвета маркеров:**
- Critical: пульсирующий красный
- Warning: оранжевый
- Normal: зелёный
- No Signal: серый

---

### 3. Alerts (Оповещения)
**Компоненты:**
1. Page Header
2. Filters (кнопки фильтров)
3. Alerts List (вертикальный список)

**Layout:**
- Filters: flex, gap 12px
- Alert Cards: вертикальный stack, gap 16px

---

### 4. Building Details (Детали объекта)
**Компоненты:**
1. Modal Header (название, адрес)
2. Tabs (Обзор, Системы, История, Обслуживание)
3. Tab Content (динамический контент)

**Tab structure:**
- Info Grid: 2-4 колонки, auto-fit
- Systems Grid: 2 колонки
- History List: вертикальный список

---

### 5. Journal (Журнал)
**Компоненты:**
1. Page Header
2. Stats Bar (4 статистики)
3. Search + Export controls
4. Journal Table

**Layout:**
- Stats Bar: 4 равных колонки
- Table: 4 колонки (Время, Действие, Объект, Оператор)

---

### 6. Critical Alert (Критическая тревога)
**Компоненты:**
1. Full-screen overlay (rgba(0,0,0,0.85))
2. Modal (600px, centered)
3. Gradient header (красный градиент)
4. Info section + Actions

**Анимации:**
- Пульсирующая иконка
- Fade in overlay
- Slide up modal
- Живой таймер

---

## 🎭 Состояния компонентов

### Hover состояния
```
Кнопки: transform: translateY(-2px), добавить тень
Карточки: transform: translateY(-4px), увеличить тень
Links: подчёркивание
```

### Active состояния
```
Кнопки: немного темнее цвет
Tabs: border-bottom Primary, background white
Filters: background Primary, color white
```

### Disabled состояния
```
Opacity: 0.6
Cursor: not-allowed
```

---

## 🔤 Иконки

### Используемые эмодзи иконки:
```
🔥 - Логотип FireWatch
🚨 - Критическая тревога
⚠️ - Предупреждение
✅ - Норма
📊 - Статистика
🗺️ - Карта
📝 - Журнал
⚙️ - Настройки
🏢 - Здание (офис/ТЦ)
🏭 - Склад
🏨 - Отель
🍽️ - Ресторан
🏥 - Медцентр
⚽ - Спорткомплекс
📡 - Датчики
🔔 - Сигнализация
💧 - Спринклеры
💨 - Дымоудаление
🌡️ - Температура
🔧 - Обслуживание
📍 - Местоположение
🕐 - Время
👁️ - Просмотр
✓ - Подтверждение
```

---

## 📦 Структура слоёв в Figma

### Рекомендуемая организация:

```
🎨 Design System
  ├── 🎨 Colors
  ├── 📝 Typography
  └── 🧩 Components
      ├── Buttons
      ├── Cards
      ├── Inputs
      ├── Badges
      ├── Icons
      └── Modals

📱 Screens
  ├── Dashboard
  ├── Map View
  ├── Alerts
  ├── Building Details
  ├── Journal
  └── Critical Alert

📐 Grids & Layouts
  ├── Desktop Grid
  ├── Tablet Grid
  └── Mobile Grid
```

---

## 🔗 Интерактивность в Figma

### Прототипирование переходов:

1. **Dashboard → Building Details**
   - Триггер: Click на карточку объекта
   - Анимация: Smart Animate, 300ms

2. **Dashboard → Alerts**
   - Триггер: Click на статистику тревог
   - Анимация: Instant

3. **Alerts → Building Details**
   - Триггер: Click на кнопку "Детали"
   - Анимация: Smart Animate, 300ms

4. **Любой экран → Critical Alert**
   - Триггер: Overlay trigger
   - Анимация: Dissolve, 300ms

5. **Tabs в Building Details**
   - Триггер: Click на tab
   - Анимация: Smart Animate, 200ms

---

## 💡 Советы по созданию в Figma

### Auto Layout
- Используйте Auto Layout для всех карточек и списков
- Padding: 16-24px
- Gap: 12-20px
- Alignment: flex-start или space-between

### Компоненты
1. Создайте **Button Component** с вариантами (Primary, Secondary, Danger)
2. Создайте **Card Component** с вариантами статусов
3. Создайте **Badge Component** с цветовыми вариантами
4. Создайте **Icon Component** с библиотекой иконок

### Эффекты
- **Drop Shadow для карточек**: X:0, Y:1, Blur:3, Opacity:10%
- **Drop Shadow для модалов**: X:0, Y:20, Blur:60, Opacity:30%
- **Inner Shadow для inputs**: X:0, Y:1, Blur:2, Opacity:5%

### Responsive Design
- Используйте constraints (Left & Right, Top & Bottom)
- Создайте Breakpoint variants для Mobile/Tablet/Desktop
- Используйте min/max width для адаптивности

---

## 📸 Референсные изображения

В папке `public/mockups/` созданы интерактивные HTML-макеты всех экранов:
1. `index.html` - Навигация по всем макетам
2. `dashboard.html` - Главная страница
3. `map-view.html` - Карта объектов
4. `alerts.html` - Центр оповещений
5. `building-details.html` - Детали объекта
6. `journal.html` - Журнал действий
7. `critical-alert.html` - Критическая тревога

Откройте их в браузере для изучения реального поведения и размеров элементов.

---

## ✅ Чеклист создания в Figma

- [ ] Создать Color Styles для всех цветов
- [ ] Создать Text Styles для всех размеров текста
- [ ] Создать компонент Button с 3 вариантами
- [ ] Создать компонент Card с 4 статусами
- [ ] Создать компонент Badge с 4 цветами
- [ ] Создать Grid Layout (1400px, 24px padding)
- [ ] Создать Frame Dashboard (1440×900px)
- [ ] Создать Frame Map View (1440×900px)
- [ ] Создать Frame Alerts (1440×900px)
- [ ] Создать Frame Building Details (modal 900×700px)
- [ ] Создать Frame Journal (1440×900px)
- [ ] Создать Frame Critical Alert (modal 600×600px)
- [ ] Настроить Auto Layout для всех компонентов
- [ ] Добавить интерактивные прототипы
- [ ] Протестировать переходы между экранами

---

## 🎯 Быстрый старт

1. **Создайте новый Figma файл**
2. **Импортируйте цветовую палитру** (Color Styles)
3. **Настройте типографику** (Text Styles)
4. **Создайте базовые компоненты** (Button, Card, Badge)
5. **Соберите первый экран** (Dashboard) используя компоненты
6. **Дублируйте и адаптируйте** для остальных экранов
7. **Добавьте прототипирование** между экранами

---

## 📞 Полезные ссылки

- Интерактивные макеты: `/mockups/index.html`
- Живое приложение: основной URL проекта
- Исходный код: доступен через GitHub интеграцию

---

**Создано для проекта FireWatch**  
*Система мониторинга пожарной безопасности*
