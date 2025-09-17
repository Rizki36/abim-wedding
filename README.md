# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:


## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      ...tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      ...tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      ...tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default tseslint.config([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

## Scroll sensitivity

This project uses full-page vertical slides. Sensitivity and timing are controlled by a few constants near the top of `src/App.tsx`:

- `ANIMATION_MS` — slide transition duration (keep in sync with `.pages-container { transition }` in `src/App.css`).
- `MIN_SCROLL_INTERVAL_MS` — cooldown between page changes; lower = more sensitive to consecutive scrolls.
- `WHEEL_DEBOUNCE_MS` — groups small mouse wheel pulses; lower = reacts quicker.
- `SWIPE_MIN_DISTANCE_PX` and `SWIPE_MAX_DURATION_MS` — mobile swipe distance and time thresholds.

Example defaults:

```ts
const ANIMATION_MS = 900;
const MIN_SCROLL_INTERVAL_MS = 500;
const WHEEL_DEBOUNCE_MS = 50;
const SWIPE_MIN_DISTANCE_PX = 70;
const SWIPE_MAX_DURATION_MS = 600;
```

Adjust these values to fine‑tune the experience.
