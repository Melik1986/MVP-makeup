# MVP Kosmetic - Лендинг курса визажа

Лендинг-страница для продажи курса визажа с GSAP анимациями, созданный на Vue 3.

## Технологии

- **Bun** - JavaScript runtime и пакетный менеджер
- **Vue 3** (Composition API, JavaScript)
- **GSAP 3** для анимаций
- **SCSS** для стилей
- **Vite** для сборки
- **Feature-Sliced Design** архитектура

## Установка и запуск

### Требования

- Bun 1.0+ ([Установка Bun](https://bun.sh/docs/installation))

### Установка зависимостей

```bash
bun install
```

### Запуск dev-сервера

```bash
bun run dev
```

Приложение будет доступно по адресу `http://localhost:5173`

### Сборка для production

```bash
bun run build
```

### Превью production сборки

```bash
bun run preview
```

### Дополнительные команды

```bash
# Линтинг кода
bun run lint

# Форматирование кода
bun run format

# Проверка типов
bun run type-check
```

## Структура проекта

```
src/
├── app/              # Конфигурация приложения
├── pages/            # Страницы
├── widgets/          # Составные виджеты (Header, Footer)
├── features/         # Фичи (hero, audience, booking)
│   ├── hero/         # Hero секция с анимациями
│   ├── audience/     # Секция целевой аудитории
│   └── booking/      # Форма бронирования
├── entities/         # Бизнес-сущности (AudienceCard)
└── shared/           # Общие компоненты и стили
    ├── ui/           # UI компоненты (Button, Container, etc.)
    └── styles/       # Дизайн-система и стили
```

## Дизайн-система

Дизайн-система находится в `src/shared/styles/design-system.scss` и основана на файле `.cursor/design-system.md`.

### Основные цвета

- Primary: `#A81C26` (красный)
- Secondary: `#1B3F2B` (зеленый)
- Background Hero: градиент от `#1a0406` до `#4a0e14`

### Шрифты

- Primary: Montserrat
- Secondary: Playfair Display
- Script: Great Vibes (для подписи)

## Изображения

Необходимые изображения для проекта:

- `/public/model.jpg` - изображение модели для Hero секции
- `/public/cosmetic-tube.png` - косметическая туба для декора
- `/public/makeup-brush.png` - кисть для макияжа для декора
- `/public/audience-1.jpg` до `/public/audience-4.jpg` - изображения для карточек аудитории

**Важно**: Добавьте эти изображения в папку `public/` перед запуском.

## Особенности

- GSAP анимации появления элементов в Hero секции
- Parallax эффекты для декоративных элементов
- Адаптивный дизайн (mobile-first)
- Форма бронирования с валидацией
- Модальное окно для формы
- ScrollTrigger анимации при скролле

## Браузерная поддержка

- Chrome (последние версии)
- Firefox (последние версии)
- Safari (последние версии)
- Edge (последние версии)

## Лицензия

MIT
