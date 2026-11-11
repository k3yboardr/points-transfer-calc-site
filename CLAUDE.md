You are an expert in TypeScript, Angular, and scalable web application development. You write functional, maintainable, performant, and accessible code following Angular and TypeScript best practices.

## TypeScript Best Practices

- Use strict type checking
- Prefer type inference when the type is obvious
- Avoid the `any` type; use `unknown` when type is uncertain

## Angular Best Practices

- Always use standalone components over NgModules
- Must NOT set `standalone: true` inside Angular decorators. It's the default in Angular v20+.
- Do NOT set `changeDetection: ChangeDetectionStrategy.OnPush` explicitly. `OnPush` is the default in Angular v22+.
- Use signals for state management
- Implement lazy loading for feature routes
- Do NOT use the `@HostBinding` and `@HostListener` decorators. Put host bindings inside the `host` object of the `@Component` or `@Directive` decorator instead
- Use `NgOptimizedImage` for all static images.
  - `NgOptimizedImage` does not work for inline base64 images.

## Accessibility Requirements

- It MUST pass all AXE checks.
- It MUST follow all WCAG AA minimums, including focus management, color contrast, and ARIA attributes.

## Components

- Keep components small and focused on a single responsibility
- Use `input()` and `output()` functions instead of decorators
- Use `model()` for two-way bound properties with `[(prop)]` syntax instead of pairing `input()` with `output()`
- Use `computed()` for derived state
- Use `linkedSignal()` for state derived from multiple reactive sources that must stay synchronized
- Prefer inline templates for small components
- Prefer Signal Forms (`@angular/forms/signals`) for new forms. They are stable in Angular v22+ and provide signal-based state, type-safe field access, and schema-based validation
- When not using Signal Forms, prefer Reactive forms instead of Template-driven ones
- Do NOT use `ngClass`, use `class` bindings instead
- Do NOT use `ngStyle`, use `style` bindings instead
- Do NOT import `CommonModule`, import only the directives and pipes the template uses, such as `AsyncPipe` or `DatePipe`
- When using external templates/styles, use paths relative to the component TS file.

## State Management

- Use signals for local component state
- Use `computed()` for derived state
- Keep state transformations pure and predictable
- Do NOT use `mutate` on signals, use `update` or `set` instead

## Templates

- Keep templates simple and avoid complex logic
- Use native control flow (`@if`, `@for`, `@switch`) instead of `*ngIf`, `*ngFor`, `*ngSwitch`
- Use the async pipe to handle observables
- Do not assume globals like (`new Date()`) are available.

## Services

- Design services around a single responsibility
- Use the `providedIn: 'root'` option for singleton services
- Prefer the `@Service` decorator over `@Injectable({providedIn: 'root'})` for new singleton services (Angular v22+)
- Use the `inject()` function instead of constructor injection

## Project notes: points transfer calculator

These notes are specific to this project. Where they differ from the general advice above, follow these.

- `PLAN.md` is the build plan. Its Part A explains how the calculation maps to the original spreadsheet. Read Part A before changing behaviour. Do not read Part B: it is a copy of the source files.
- Commands: `npx ng test --watch=false` (must stay green), `npx ng build --base-href ./`, `npx ng serve`.
- This is one static page. There is no router, no server, no HTTP call and no forms package. Inputs are native elements bound to signals: see `src/app/balances/balances-panel.html` and `src/app/bonuses/bonuses-view.html`. Do not introduce Signal Forms, Reactive Forms, the router or lazy loading.
- All state lives in `CalculatorStore` (`src/app/core/calculator-store.ts`). Components read its signals and call its methods. They never touch `localStorage` and never import a dataset file.
- The calculation is `src/app/core/engine.ts`: pure functions, no Angular. Its results are pinned by `src/app/core/engine.fixtures.ts`, which came from the spreadsheet. Never regenerate the fixtures from the engine.
- Built-in data lives in `src/app/core/datasets/`. To change a ratio, a partner transfer, a source or a built-in bonus, add a new dated dataset file and point `current.ts` at it. Never edit `dataset-2026-11-09.ts`: the tests use it as their fixed baseline.
- Components build display-ready rows in one `computed()` and keep templates free of logic. `src/app/results/results-view.ts` is the pattern.
- All styles are in `src/styles.css`. Components have no stylesheets of their own.
- Tests find elements by `data-testid`. Keep the existing ids when changing markup.
- Never put real point balances in the repository. The example balances are made up.
