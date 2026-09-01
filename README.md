# @timmi0-o/frontend-core

Общая библиотека UI для фронтов: React-примитивы без привязки к теме и два визуальных кита (`social`, `admin`).

Компоненты одни и те же. Меняется только CSS и значение `data-ui-kit` на корне приложения.

- React 19, TypeScript, ESM
- Поведение — [@base-ui/react](https://base-ui.com/), составной API (`Button`, `Button.Spinner`, `Card.Header`, …)
- Стили кита — обычный CSS по `data-slot` / `data-variant`, не Tailwind внутри пакета
- Пакет отдаёт только `dist/` (`files: ["dist"]`)
- Публикация: GitHub Packages

---

## Установка

Пакет приватный. В приложении нужен `.npmrc`:

```ini
@timmi0-o:registry=https://npm.pkg.github.com
//npm.pkg.github.com/:_authToken=${NODE_AUTH_TOKEN}
```

```bash
npm install @timmi0-o/frontend-core
```

Обязательные peer-зависимости:

```text
react ^19
react-dom ^19
@base-ui/react ^1.7.0
zod ^4
```

Опциональные — только если используете соответствующий компонент:

| Пакет           | Нужен для        |
| --------------- | ---------------- |
| `swiper` ^14    | `SwiperCarousel`  |
| `vaul` ^1       | `BottomSheet`    |
| `framer-motion` | `PhotoGallery`   |
| `next`          | `useManageSearchParams` |

---

## Быстрый старт

```tsx
import { uiKit } from '@timmi0-o/frontend-core/social-ui-kit'

<body data-ui-kit={uiKit}>{children}</body>
```

```css
@import '@timmi0-o/frontend-core/social-ui-kit/styles.css';
```

```tsx
import { Button, Card } from '@timmi0-o/frontend-core/ui-kit'

export const Example = () => {
	return (
		<Card>
			<Card.Header>
				<Card.Title>Заголовок</Card.Title>
			</Card.Header>
			<Card.Content>Текст</Card.Content>
			<Card.Footer>
				<Button variant="primary">Сохранить</Button>
			</Card.Footer>
		</Card>
	)
}
```

| CSS | `data-ui-kit` |
| --- | ------------- |
| `social-ui-kit/styles.css` | `social` |
| `admin-ui-kit/styles.css` | `admin` |

Рекомендуемый импорт компонентов: `@timmi0-o/frontend-core/ui-kit` (без скрытого CSS). Стили — отдельным `@import`.

---

## Точки входа

| Импорт | Что внутри |
| ------ | ---------- |
| `@timmi0-o/frontend-core/ui-kit` | Компоненты и типы, **без** CSS |
| `@timmi0-o/frontend-core/social-ui-kit` | Компоненты + CSS social + `uiKit` |
| `@timmi0-o/frontend-core/admin-ui-kit` | Компоненты + CSS admin + `uiKit` |
| `@timmi0-o/frontend-core/hooks` | `useDebounceValue`, `useLocalStorage`, `useMediaQuery`, `useManageSearchParams`, `useLockBodyScroll`, … |
| `@timmi0-o/frontend-core/actions` | `abstractGetAction`, `abstractMutateAction`, типы workers/fetcher/mapper |
| `@timmi0-o/frontend-core/utils` | `base64Manager`, `multiTypeFieldParser` |

`fetcher` и `responseMapper` в либу не входят: приложение передаёт их в `requestWorkers`.

```ts
import { abstractGetAction } from '@timmi0-o/frontend-core/actions'

await abstractGetAction(
	{ url, filters, isPublic },
	{
		fetcher: appFetcher,
		responseMapper: appEndpointResponseMapper,
		queryFilterSchema: EntityGetManyFiltersSchema,
	},
)
```

---

## Стилизация

Стили кита в `@layer components`. `className` и Tailwind-утилиты перекрывают кит. `variant="unstyled"` снимает chrome слота целиком.

Тёмная схема: класс `dark` на `html` или `data-theme="dark"`.

---

## Разработка пакета

```bash
npm install
npm run build
npm run playground
```

Playground: http://localhost:5173 — Social и Admin бок о бок.

---

## Публикация в GitHub Packages

1. Создай private repo `Timmi0-o/frontend-core`.
2. `git remote add origin git@github.com:Timmi0-o/frontend-core.git`
3. Токен с `write:packages` + `repo` в `NODE_AUTH_TOKEN`.
4. `npm run build && npm publish`

Приложение ставит `@timmi0-o/frontend-core` из GitHub Packages, не через `file:`.
