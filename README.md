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

## How react works internally?

1. In Development Phase

- Initial Setup

  - When the project is initialized and the Vite dev server is started:

    - The Vite dev server runs on localhost:port and establishes a connection with the browser.

    - The browser makes a request to the root HTML file (index.html).

    - Vite serves the index.html, which contains:

      - <div id="root"></div> root element

      - <script type="module" src="/src/main.tsx"></script> # type="module" signifies JS module as ESModule

    - Borwser creates real DOM of the empty root element.

- Module Loading Begins:

  - The browser detects the main.tsx module and requests it from Vite.

  - Vite uses esbuild to transpile main.tsx to JavaScript and sends the result to the browser.

  - Browser stores the ESModule in its cache

  - The browser sees the App.tsx import inside main.tsx and requests it.

  - Vite transpiles App.tsx and sends the result to the browser.

- Import Handling (Code Splitting vs No Code Splitting)

  - Inside App.tsx, there are multiple module imports.

  - If code splitting is not used:

    - The browser eagerly requests all imported modules in parallel.

    - Vite transpiles all requested modules concurrently. # The order of transpilation depends on the time required to request

    - Vite responds with each transpiled module as soon as it's ready. # Transpilation completion order depends on the size of the module

  - If code splitting is used:

    - The browser only requests modules relevant to the current route/pathname.

    - Vite transpiles and serves only those requested modules.

- Module Caching

  - Vite uses internal caching:

    - If a transpiled module isn't immediately used (due to route mismatch), it’s cached.

    - When a route matches later, Vite serves it from the cache without retranspiling.

- Rendering and Reconciliation

  - Once JS modules are loaded:

    - React mounts the first component that is React builds the virtual DOM (vDOM) of a component based on the current pathname using React Router. # ReactDOM.createRoot(document.getElementById("root")).render(<App />) creates vDOM. # ReactDOM contains all the rendering and routing functions. # createRoot(document.getElementByID("root)) creates root element for each vDOM. render(<App/>) creates the vDOM of the components imported inside App.tsx based on the routes

    - React converts the first vDOM into its corresponding real DOM because there is no previous vDOM to reconcile and no meaningful real DOM present in the browser.

    - The real DOM is updated to reflect the initial UI.

- When Code Updates (HMR)

  - When code changes during development:

    - Vite only transpiles the changed module.

    - The transpiled JS is pushed to the browser using Hot Module Replacement (HMR).

    - Browser’s HMR runtime swaps the old module with the new one in the cache memory. # React generates the HMR runtime during initial rendering # The HMR runtime continuously tracks the module change and does HMR

    - React re-renders and reconciles, and the DOM is updated accordingly to reflect the changes as UI on the browser.

- When State Updates

  - When a state change occurs:

    - React creates a new vDOM and diffs it with the previous one.

    - Only the changed parts are applied to the real DOM (UI is updated efficiently).

- When Pathname Changes

  - On route (pathname) change:

        - The old component is removed from the DOM. #Unmounting

        - New modules are requested (depending on whether they are already cached or not).

        - Vite transpiles and feeds the modules (if needed). #For Code spliting #Dynamically imported modules

        - React creates a new vDOM and reconciles with the real DOM to update the UI.

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
                                            │ index.html served                           │
                                            │ - contains <div id="root"></div>            │
                                            │ - contains <script type="module"            |
                                            |    src="/src/main.tsx"></script>            │
                                            └────────────┬────────────────────────────────┘
                                                         ↓
                                            ┌─────────────────────────────────────────────┐
                                            │ Browser creates empty real DOM root element │
                                            └────────────┬────────────────────────────────┘
                                                         ↓
                                            ┌─────────────────────────────────────────────┐
                                            │ Browser requests main.tsx module            │
                                            └────────────┬────────────────────────────────┘
                                                         ↓
                                            ┌─────────────────────────────────────────────┐
                                            │ Vite transpiles main.tsx (using esbuild)    │
                                            │ Sends JS module to browser                  │
                                            └────────────┬────────────────────────────────┘
                                                         ↓
                                            ┌─────────────────────────────────────────────┐
                                            │ Browser caches main.tsx module              │
                                            │ Browser sees App.tsx import in main.tsx     │
                                            │ Browser requests App.tsx module             │
                                            └────────────┬────────────────────────────────┘
                                                         ↓
                                            ┌─────────────────────────────────────────────┐
                                            │ Vite transpiles App.tsx                     │
                                            │ Sends JS module to browser                  │
                                            └────────────┬────────────────────────────────┘
                                                         ↓
                                            ┌─────────────────────────────────────────────┐
                                            │ App.tsx imports multiple modules            │
                                            └────────────┬────────────────────────────────┘
                                                         ↓
                                            ┌────────────────────────────────────────────────────────────────────┐
                                            │ If code splitting is NOT used:                                     │
                                            │ - Browser requests all imported modules in parallel                │
                                            │ - Vite transpiles modules concurrently                             │
                                            │ - Modules served as soon as transpilation completes                │
                                            └────────────────────────────────────────────────────────────────────┘
                                            ┌────┴────────────────────────────────────────────────────────────────┐
                                            │ If code splitting IS used:                                          │
                                            │ - Browser requests only route-relevant modules                      │
                                            │ - Vite transpiles & serves only requested modules                   │
                                            └────────────────────────────────────────────────────────────────────-┘
                                                         ↓
                                            ┌─────────────────────────────────────────────┐
                                            │ Vite caches transpiled modules              │
                                            │ Unused modules (due to route mismatch)      |
                                            | cached                                      │
                                            └────────────┬────────────────────────────────┘
                                                         ↓
                                            ┌─────────────────────────────────────────────┐
                                            │ Browser loads JS modules                    │
                                            │ ReactDOM.createRoot().render(<App />)       │
                                            │ React builds first virtual DOM (vDOM) based │
                                            │ on current route                            │
                                            └────────────┬────────────────────────────────┘
                                                         ↓
                                            ┌─────────────────────────────────────────────┐
                                            │ First vDOM converted to real DOM (no prior  │
                                            │ vDOM to diff)                               │
                                            └────────────┬────────────────────────────────┘
                                                         ↓
                                            ┌─────────────────────────────────────────────┐
                                            │ Initial UI rendered in browser              │
                                            └────────────┬────────────────────────────────┘
                                                         ↓
                                            ┌───────────────-┬───────────────────┬───────────────────────┐
                                            │ Code Change    │ State Change      │ Pathname Change       │
                                            ├───────────────-┼───────────────────┼───────────────────────┤
                                            │ Vite transpiles│ React creates new │ Old component unmounts│
                                            │ changed module │ vDOM and diffs it │ Browser requests new  │
                                            │ and pushes JS  │ against old vDOM  │ route-relevant modules│
                                            │ to browser via │                   │ (cached or transpiled)│
                                            │ Hot Module     │ React patches real│ React creates new vDOM│
                                            │ Replacement    │ DOM efficiently   │ and converts into     │
                                            │ (HMR) runtime  │                   │ corresponding real DOM│
                                            │ swaps module in│ React updates UI  │ UI updates accordingly│
                                            │ cache          │                   │                       │
                                            └───────────────-┴───────────────────┴───────────────────────┘

## While mapping an array, why use unique prop key?

- Unique prop key acts as a unique identifier to individual item of an array
- All items of an array are siblings of the same level. So, to let the DOM recognize them as an unique element, an unique identifier(prop key), is assigned to them.
- They should be identified uniquely to avoid mis-manipulation of unwanted node or item. VDOM should consider each node as unique element to let it recognize a particular element.

## Why id associated with an item is recommended instead of the indices of the array as prop key?

- Indices of an array always maintain order. #If any random item is removed, just the item is removed but the index associated with that element is not removed. #Only length of the array changes
- If index of the array is used as a unique prop key:
  - Index associated to a particular item won't be its permanent key.
  - If that item is removed, the index associated with it will get associated to another one present after it. The result after this:
    - React whatsoever finds the key no matter the changed position of item.
    - During reconciliation, react only considers the key and does not diff the previously existed keys' values no matter the difference in the items associated.
    - This results in bug and unwanted UI # Already removed items are also seen due to the persistence of keys associated to the removed item.
- Thus, it is recommended to use unique id or other unique valued key as prop key when mapping an array and avoid the indices as key to avoid encountering bugs and mis-manipulation.

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
