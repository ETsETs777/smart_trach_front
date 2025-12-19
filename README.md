# Smart Trash Frontend

Frontend приложение для системы управления сортировкой отходов, построенное на React 18 с TypeScript и Vite.

## Технологии

- **React 18** - UI библиотека
- **TypeScript** - типизация
- **Vite** - сборщик и dev-сервер
- **Tailwind CSS** - стилизация
- **Apollo Client** - GraphQL клиент
- **React Router** - маршрутизация
- **Zustand** - управление состоянием
- **React Hook Form** - работа с формами
- **Framer Motion** - анимации
- **React Hot Toast** - уведомления

## Требования

- Node.js 18+
- npm или yarn
- Запущенный бэкенд (см. README в backend)

## Установка и запуск

### 1. Установка зависимостей

```bash
npm install
```

### 2. Настройка переменных окружения

Создайте файл `.env.local` в корне проекта:

```env
VITE_API_URL=http://localhost:5000
VITE_GRAPHQL_URL=http://localhost:5000/graphql
```

По умолчанию используются значения:
- `VITE_API_URL=http://localhost:5000`
- `VITE_GRAPHQL_URL=http://localhost:5000/graphql`

### 3. Запуск фронтенда

#### Режим разработки:

```bash
npm run dev
```

Приложение будет доступно на `http://localhost:5173`

#### Другие команды:

```bash
# Сборка для production
npm run build

# Предпросмотр production сборки
npm run preview

# Линтинг
npm run lint

# Форматирование кода
npm run format
```

## Структура проекта

```
src/
├── components/        # React компоненты
│   ├── ui/           # UI компоненты (Button, Card, etc.)
│   └── ...           # Другие компоненты
├── pages/            # Страницы приложения
│   ├── LandingPage.tsx
│   ├── LoginPage.tsx
│   ├── RegisterPage.tsx
│   ├── AdminDashboard.tsx
│   ├── EmployeeDashboard.tsx
│   └── ...
├── lib/              # Библиотеки и утилиты
│   ├── apollo.ts     # Apollo Client конфигурация
│   └── graphql/      # GraphQL запросы и мутации
├── store/            # Zustand хранилища
├── types/            # TypeScript типы
├── App.tsx           # Главный компонент
└── main.tsx          # Точка входа
```

## Основные страницы

### Публичные страницы

- `/` - Главная страница (Landing)
- `/login` - Вход в систему
- `/register` - Регистрация компании
- `/confirm-email` - Подтверждение email
- `/about` - О компании
- `/how-it-works` - Как это работает
- `/for-companies` - Для компаний
- `/contacts` - Контакты

### Защищенные страницы (требуют авторизации)

#### Для администраторов (`ADMIN_COMPANY`):

- `/admin/dashboard` - Панель администратора
- `/admin/employees` - Управление сотрудниками
- `/admin/collection-areas` - Управление зонами сбора
- `/admin/bins` - Управление контейнерами
- `/admin/analytics` - Аналитика
- `/admin/company-settings` - Настройки компании
- `/admin/achievements` - Управление достижениями

#### Для сотрудников (`EMPLOYEE`):

- `/employee/dashboard` - Панель сотрудника
- `/employee/tablet` - Интерфейс планшета для сортировки
- `/employee/leaderboard` - Рейтинг сотрудников
- `/employee/achievements` - Достижения
- `/employee/history` - История сортировок
- `/employee/profile` - Профиль

## Функциональность

### Аутентификация

- Регистрация администратора компании
- Регистрация сотрудника по приглашению
- Вход в систему (JWT токены)
- Подтверждение email
- Защищенные маршруты (ProtectedRoute)

### Управление отходами

- Фото классификация через AI (GigaChat)
- Ручной выбор типа отхода
- Сканирование штрих-кода
- История сортировок
- Статистика по типам отходов

### Геймификация

- Система достижений
- Рейтинг сотрудников
- Прогресс по целям
- Награды и бейджи

### Аналитика

- Статистика по компании
- Статистика по сотрудникам
- Графики и диаграммы
- Экспорт данных

## API интеграция

Frontend использует GraphQL API бэкенда через Apollo Client.

### Основные запросы:

- `GET_ME` - текущий пользователь
- `LOGIN` - вход
- `REGISTER_ADMIN` - регистрация администратора
- `REGISTER_EMPLOYEE` - регистрация сотрудника
- `CONFIRM_EMAIL` - подтверждение email
- `COMPANIES` - список компаний
- `COMPANY` - информация о компании
- `COLLECTION_AREAS` - зоны сбора
- `EMPLOYEES` - сотрудники
- `WASTE_PHOTOS` - история сортировок
- `ANALYTICS` - аналитика
- `ACHIEVEMENTS` - достижения

## Стилизация

Проект использует Tailwind CSS с кастомными компонентами:

- `GreenGradientBackground` - градиентный фон
- `Button` - кнопки с вариантами
- `Card` - карточки
- Адаптивный дизайн для планшетов и мобильных устройств

## State Management

Используется Zustand для управления состоянием:

- `useWasteStore` - состояние сортировки отходов
- `useAuthStore` - состояние аутентификации

## Troubleshooting

### Ошибка подключения к бэкенду

1. Убедитесь, что бэкенд запущен на `http://localhost:5000`
2. Проверьте переменные окружения в `.env.local`
3. Проверьте CORS настройки на бэкенде

### Ошибки компиляции TypeScript

```bash
# Очистить кэш и переустановить зависимости
rm -rf node_modules dist
npm install
```

### Проблемы с hot-reload

```bash
# Перезапустить dev-сервер
npm run dev
```

## Production сборка

```bash
# Сборка
npm run build

# Результат будет в папке dist/
# Можно развернуть на любом статическом хостинге
```

## Лицензия

MIT
