# React + TypeScript + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## What is React?

- React is a JavaScript library for building client side single page applications.
- It is called library and not a framework because unlike frameworks, it does not provide inbuilt dependencies and packages. Even a small dependency need to be installed as third party package.
- React works with a syntax called JSX (JavaScript with XML), which allows JavaScript to be written with the html together.

## Why use React?

- React is a powerful tool to develop single page application with flexibility in creating highly responsive user interfaces ensuring smooth user experience.
- It uses the concept of Virtual DOM (a copy of the real DOM) and does UI updates and manipulations with vDOM without direct involvement of the real DOM.
-

## How react works internally?

1. In Development Phase

- Initial Setup

  - When the project is initialized and the Vite dev server is started:

    - The Vite dev server runs on localhost:port and establishes a connection with the browser.

    - The browser makes a request to the root HTML file (index.html).

    - Vite serves the index.html, which contains:

    - <div id="root"></div> element

    - <script type="module" src="/src/main.tsx"> tag

- Module Loading Begins

  - The browser detects the main.tsx module and requests it from Vite.

  - Vite uses esbuild to transpile main.tsx to JavaScript and sends the result to the browser.

  - The browser executes ReactDOM.createRoot(document.getElementById("root")).render(<App />) and creates a real DOM tree with the #root element.

  - The browser sees the App.tsx import inside main.tsx and requests it.

  - Vite transpiles App.tsx and sends the result to the browser.

- Import Handling (Code Splitting vs No Code Splitting)

  - Inside App.tsx, there are multiple module imports.

  - If code splitting is not used:
  - . The browser eagerly requests all imported modules in parallel.

  - . Vite transpiles all requested modules concurrently.

  - . Vite responds with each transpiled module as soon as it's ready, based on the request pathname.

  - . If code splitting is used:
  - . The browser only requests modules relevant to the current route/pathname.

  - . Vite transpiles and serves only those requested modules.

- Module Caching

  - Vite uses internal caching:

  - If a transpiled module isn't immediately used (due to route mismatch), it’s cached.

  - When a route matches later, Vite serves it from the cache without retranspiling.

- Rendering and Reconciliation

  - Once JS modules are loaded:
  - . React builds the virtual DOM (vDOM) based on the current pathname using React Router.

  - . For the first load, React reconciles the vDOM with the existing real DOM (i.e., the #root div).

  - . The DOM is updated to reflect the initial UI.

- When Code Updates (HMR)

  - When code changes during development:
  - . Vite only transpiles the changed module.

  - . The transpiled JS is pushed to the browser using Hot Module Replacement (HMR).

  - . React’s HMR runtime swaps the old module with the new one in memory.

  - . React re-renders and reconciles, and the DOM is updated accordingly.

- When State Updates

  - When a state change occurs:
  - . React creates a new vDOM and diffs it with the previous one.

  - . Only the changed parts are applied to the real DOM (UI is updated efficiently).

- When Pathname Changes

  - On route (pathname) change:
  - . The old component is removed from the DOM.

  - . New modules are requested (depending on whether they are already cached or not).

  - . Vite transpiles and feeds the modules (if needed).

  - . React creates a new vDOM and reconciles with the real DOM to update the UI.

                                                    ┌────────────────────────┐
                                                    │ Project Initialization │
                                                    └────────────┬───────────┘
                                                                 ↓
                                                    ┌─────────────────────────────────────────────┐
                                                    │ Vite Dev Server starts (localhost:port)     │
                                                    └────────────┬────────────────────────────────┘
                                                                 ↓
                                                    ┌─────────────────────────────────────────────┐
                                                    │ Browser requests index.html                 │
                                                    └────────────┬────────────────────────────────┘
                                                                 ↓
                                                    ┌─────────────────────────────────────────────┐
                                                    │ index.html served → main.tsx script found   │
                                                    └────────────┬────────────────────────────────┘
                                                                 ↓
                                                    ┌─────────────────────────────────────────────┐
                                                    │ main.tsx requested → Vite transpiles it     │
                                                    └────────────┬────────────────────────────────┘
                                                                 ↓
                                                    ┌─────────────────────────────────────────────┐
                                                    │ ReactDOM.createRoot().render(<App />)       │
                                                    └────────────┬────────────────────────────────┘
                                                                 ↓
                                                    ┌─────────────────────────────────────────────┐
                                                    │ App.tsx requested → Vite transpiles it │
                                                    └────────────┬────────────────────────────────┘
                                                                 ↓
                                                    ┌─────────────────────────────────────────────┐
                                                    │ App.tsx imports multiple modules            │
                                                    └────────────┬────────────────────────────────┘
                                                                 ↓
                                                    ┌────────────────────────────────────────────────────────────────────┐
                                                    │ If code splitting is NOT used:                                     │
                                                    │ - Browser requests all modules in parallel                         │
                                                    │ - Vite transpiles concurrently and serves on-demand                │
                                                    └────────────────────────────────────────────────────────────────────┘
                                                    ┌────┴────────────────────────────────────────────────────────────────┐
                                                    │ If code splitting is used:                                          │
                                                    │ - Browser only requests route-specific module                       │
                                                    │ - Vite transpiles & serves only what's needed                       │
                                                    └────────────────────────────────────────────────────────────────────-┘
                                                                  ↓
                                                    ┌─────────────────────────────────────────────┐
                                                    │ Browser loads JS modules → React builds vDOM│
                                                    └────────────┬────────────────────────────────┘
                                                                 ↓
                                                    ┌─────────────────────────────────────────────┐
                                                    │ React reconciles vDOM with real DOM         │
                                                    └────────────┬────────────────────────────────┘
                                                                 ↓
                                                    ┌─────────────────────────────────────────────┐
                                                    │ UI is rendered                              │
                                                    └────────────┬────────────────────────────────┘
                                                                 ↓
                                                    ┌────────────┐ ┌──────────────┐ ┌─────────────────┐
                                                    │ Code Change│ │ State Change │ │ Pathname Change │
                                                    ├────────────┤ ├──────────────┤ ├─────────────────┤
                                                    │ Vite HMR   │ │ New vDOM     │ │ Load new module │
                                                    │ Transpiles │ │ Diff & patch │ │ Transpile/cache │
                                                    │ Hot Reload │ │ UI updates   │ │ New vDOM → UI   │
                                                    └────────────┘ └──────────────┘ └─────────────────┘

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default tseslint.config([
  globalIgnores(["dist"]),
  {
    files: ["**/*.{ts,tsx}"],
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
        project: ["./tsconfig.node.json", "./tsconfig.app.json"],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
]);
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from "eslint-plugin-react-x";
import reactDom from "eslint-plugin-react-dom";

export default tseslint.config([
  globalIgnores(["dist"]),
  {
    files: ["**/*.{ts,tsx}"],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs["recommended-typescript"],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ["./tsconfig.node.json", "./tsconfig.app.json"],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
]);
```
