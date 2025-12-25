# Руководство по тестированию

## Обзор

Проект использует три уровня тестирования:
- **Unit тесты** - для утилит и компонентов (Vitest + React Testing Library)
- **Integration тесты** - для страниц и форм (Vitest + React Testing Library + Apollo MockedProvider)
- **E2E тесты** - для основных сценариев (Playwright)

## Установка

Все зависимости уже установлены. Если нужно переустановить:

```bash
npm install
```

## Запуск тестов

### Unit и Integration тесты

```bash
# Запуск всех тестов
npm test

# Запуск в watch режиме
npm test -- --watch

# Запуск с UI
npm test:ui

# Запуск с покрытием кода
npm test:coverage
```

### E2E тесты

```bash
# Запуск всех E2E тестов
npm run test:e2e

# Запуск с UI
npm run test:e2e:ui

# Запуск в конкретном браузере
npx playwright test --project=chromium
```

## Структура тестов

```
smart_trach_front/
├── tests/
│   ├── unit/                    # Unit тесты
│   │   ├── components/
│   │   │   ├── Button.test.tsx
│   │   │   └── LanguageSwitcher.test.tsx
│   │   └── utils.test.ts
│   ├── integration/             # Integration тесты
│   │   └── pages/
│   │       ├── LoginPage.test.tsx
│   │       └── AdminDashboard.test.tsx
│   ├── e2e/                     # E2E тесты
│   │   ├── auth.spec.ts
│   │   ├── waste-sorting.spec.ts
│   │   └── admin-dashboard.spec.ts
│   ├── utils/
│   │   └── test-utils.tsx       # Утилиты для тестирования
│   └── setup.ts                 # Настройка тестового окружения
├── docs/
│   └── testing.md               # Документация по тестированию
├── vitest.config.ts             # Конфигурация Vitest
└── playwright.config.ts        # Конфигурация Playwright
```

## Написание тестов

### Unit тесты для утилит

```typescript
import { describe, it, expect } from 'vitest'
import { cn } from '@/lib/utils'

describe('cn utility', () => {
  it('should merge class names correctly', () => {
    const result = cn('foo', 'bar')
    expect(result).toContain('foo')
    expect(result).toContain('bar')
  })
})
```

### Unit тесты для компонентов

```typescript
import { describe, it, expect } from 'vitest'
import { render, screen } from '../../utils/test-utils'
import Button from '@/components/ui/Button'

describe('Button Component', () => {
  it('should render button with children', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByText('Click me')).toBeInTheDocument()
  })
})
```

### Integration тесты

```typescript
import { MockedProvider } from '@apollo/client/testing'
import { render, screen, waitFor } from '../../utils/test-utils'

const mocks = [/* GraphQL моки */]

render(
  <MockedProvider mocks={mocks}>
    <YourComponent />
  </MockedProvider>
)
```

### E2E тесты

```typescript
import { test, expect } from '@playwright/test'

test('should login successfully', async ({ page }) => {
  await page.goto('/login')
  await page.fill('input[type="email"]', 'test@example.com')
  await page.fill('input[type="password"]', 'password')
  await page.click('button:has-text("Войти")')
  await expect(page).toHaveURL(/.*dashboard/)
})
```

## Покрытие кода

Для просмотра покрытия кода:

```bash
npm run test:coverage
```

Отчет будет доступен в `coverage/index.html`

## Лучшие практики

1. **Изолируйте тесты** - каждый тест должен быть независимым
2. **Используйте моки** - для внешних зависимостей (API, localStorage)
3. **Тестируйте поведение, а не реализацию** - фокусируйтесь на том, что делает компонент
4. **Пишите понятные тесты** - используйте описательные имена тестов
5. **Поддерживайте тесты актуальными** - обновляйте тесты при изменении кода

## Troubleshooting

### Тесты не запускаются

Убедитесь, что все зависимости установлены:
```bash
npm install
```

### E2E тесты падают

Убедитесь, что:
1. Backend запущен на `http://localhost:5000`
2. Frontend запущен на `http://localhost:3000`
3. Браузеры установлены: `npx playwright install`

### Проблемы с моками Apollo

Убедитесь, что используете `MockedProvider` из `@apollo/client/testing` и правильно настроили моки запросов.


