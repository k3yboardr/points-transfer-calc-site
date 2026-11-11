import { InjectionToken, Service, computed, inject, signal } from '@angular/core';

import { CURRENT_DATASET } from './datasets/current';
import {
  compute,
  directPartnerIds,
  findProgram,
  isBonusActive,
  isIsoDate,
  localIsoDate,
  pathLabel,
  programName,
  sanitizeBalance,
  totalBalance,
} from './engine';
import {
  Balances,
  Bonus,
  Card,
  CardId,
  ChaseCard,
  CitiTier,
  Dataset,
  EngineInput,
  EngineResult,
  Program,
  ProgramId,
  RouteOverrides,
  Settings,
  Source,
} from './models';

/**
 * The built-in data the calculator runs on. The live site gets the current dataset. Tests
 * provide the fixed 2026-11-09 baseline instead, so data updates never break them.
 */
export const DATASET = new InjectionToken<Dataset>('DATASET', {
  providedIn: 'root',
  factory: () => CURRENT_DATASET,
});

/** localStorage key. Change the suffix only if the saved shape changes incompatibly. */
export const STORAGE_KEY = 'ptc.state.v1';

/** Raw text from the "add a bonus" form. */
export interface BonusDraft {
  readonly cardId: string;
  readonly programId: string;
  /** Percent as typed, for example '30' or '30%'. */
  readonly percent: string;
  /** '' for no end date, otherwise YYYY-MM-DD (what <input type="date"> gives). */
  readonly endDate: string;
}

export type BonusDraftResult =
  | { readonly ok: true; readonly bonus: Omit<Bonus, 'id'> }
  | { readonly ok: false; readonly error: string };

interface SavedState {
  readonly v: 1;
  readonly dataVersion: string;
  readonly balances: Balances;
  readonly settings: Settings;
  readonly bonuses: readonly Bonus[];
  readonly routeOverrides: RouteOverrides;
}

const ZERO_BALANCES: Balances = {
  amex: 0,
  chase: 0,
  citi: 0,
  'capital-one': 0,
  bilt: 0,
  'wells-fargo': 0,
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function findCard(data: Dataset, value: unknown): Card | undefined {
  return data.cards.find((card) => card.id === value);
}

/** Checks the "add a bonus" form and turns it into a bonus. Never throws. */
export function validateBonusDraft(data: Dataset, draft: BonusDraft): BonusDraftResult {
  const card = findCard(data, draft.cardId);
  if (!card) {
    return { ok: false, error: 'Choose a card.' };
  }
  if (!directPartnerIds(data, card.id).includes(draft.programId)) {
    return { ok: false, error: 'Choose a program this card transfers to directly.' };
  }
  const percentText = draft.percent.trim().replace(/%$/, '').trim();
  const percent = percentText === '' ? Number.NaN : Number(percentText);
  if (!Number.isFinite(percent) || percent <= 0 || percent > 1000) {
    return { ok: false, error: 'Enter the bonus as a percent between 1 and 1000, for example 30.' };
  }
  const endText = draft.endDate.trim();
  if (endText !== '' && !isIsoDate(endText)) {
    return { ok: false, error: 'Enter the last day as a date, or leave it empty.' };
  }
  return {
    ok: true,
    bonus: {
      cardId: card.id,
      programId: draft.programId,
      pct: percent / 100,
      endDate: endText === '' ? null : endText,
      sourceId: '',
      builtIn: false,
    },
  };
}

function readBalances(value: unknown): Balances {
  const source = isRecord(value) ? value : {};
  return {
    amex: sanitizeBalance(source['amex']),
    chase: sanitizeBalance(source['chase']),
    citi: sanitizeBalance(source['citi']),
    'capital-one': sanitizeBalance(source['capital-one']),
    bilt: sanitizeBalance(source['bilt']),
    'wells-fargo': sanitizeBalance(source['wells-fargo']),
  };
}

function readSettings(data: Dataset, value: unknown): Settings {
  const source = isRecord(value) ? value : {};
  const fallback = data.defaultSettings;
  const chaseCard = source['chaseCard'];
  const citiTier = source['citiTier'];
  const countBonuses = source['countBonuses'];
  const countBlockBonuses = source['countBlockBonuses'];
  return {
    chaseCard:
      chaseCard === 'reserve' || chaseCard === 'preferred' ? chaseCard : fallback.chaseCard,
    citiTier: citiTier === 'premium' || citiTier === 'other' ? citiTier : fallback.citiTier,
    countBonuses: typeof countBonuses === 'boolean' ? countBonuses : fallback.countBonuses,
    countBlockBonuses:
      typeof countBlockBonuses === 'boolean' ? countBlockBonuses : fallback.countBlockBonuses,
  };
}

/** Keeps only well-formed bonuses for a card and a program that card transfers to directly. */
function readBonuses(data: Dataset, value: unknown): Bonus[] {
  if (!Array.isArray(value)) {
    return [];
  }
  const bonuses: Bonus[] = [];
  const seen = new Set<string>();
  for (const item of value) {
    if (!isRecord(item)) {
      continue;
    }
    const id = item['id'];
    const card = findCard(data, item['cardId']);
    const programId = item['programId'];
    const pct = item['pct'];
    const endDate = item['endDate'];
    const sourceId = item['sourceId'];
    if (
      typeof id !== 'string' ||
      id === '' ||
      seen.has(id) ||
      !card ||
      typeof programId !== 'string' ||
      !directPartnerIds(data, card.id).includes(programId) ||
      typeof pct !== 'number' ||
      !Number.isFinite(pct) ||
      pct <= 0 ||
      !(endDate === null || isIsoDate(endDate))
    ) {
      continue;
    }
    seen.add(id);
    bonuses.push({
      id,
      cardId: card.id,
      programId,
      pct,
      endDate,
      sourceId: typeof sourceId === 'string' ? sourceId : '',
      builtIn: item['builtIn'] === true,
    });
  }
  return bonuses;
}

/** Keeps only switches for routes that exist and that differ from the route's default. */
function readRouteOverrides(data: Dataset, value: unknown): RouteOverrides {
  const overrides: Record<string, boolean> = {};
  if (isRecord(value)) {
    for (const route of data.partnerTransfers) {
      const enabled = value[route.id];
      if (typeof enabled === 'boolean' && enabled !== route.defaultOn) {
        overrides[route.id] = enabled;
      }
    }
  }
  return overrides;
}

function defaultState(data: Dataset): SavedState {
  return {
    v: 1,
    dataVersion: data.version,
    balances: data.exampleBalances,
    settings: data.defaultSettings,
    bonuses: data.builtInBonuses,
    routeOverrides: {},
  };
}

function browserStorage(): Storage | null {
  try {
    return globalThis.localStorage ?? null;
  } catch {
    return null;
  }
}

/** Reads saved state. Anything missing, damaged or out of date falls back to a safe value. */
function loadState(data: Dataset): SavedState {
  let parsed: unknown = null;
  try {
    const raw = browserStorage()?.getItem(STORAGE_KEY);
    parsed = raw ? JSON.parse(raw) : null;
  } catch {
    parsed = null;
  }
  if (!isRecord(parsed) || parsed['v'] !== 1) {
    return defaultState(data);
  }
  const saved = readBonuses(data, parsed['bonuses']);
  // When the built-in data changes, refresh the built-in bonuses and keep the ones the user added.
  const bonuses =
    parsed['dataVersion'] === data.version
      ? saved
      : [...data.builtInBonuses, ...saved.filter((bonus) => !bonus.builtIn)];
  return {
    v: 1,
    dataVersion: data.version,
    balances: readBalances(parsed['balances']),
    settings: readSettings(data, parsed['settings']),
    bonuses,
    routeOverrides: readRouteOverrides(data, parsed['routeOverrides']),
  };
}

/** `?today=YYYY-MM-DD` in the address pins the date (for demos and checks). Otherwise null. */
function pinnedToday(): string | null {
  try {
    const value = new URLSearchParams(globalThis.location?.search ?? '').get('today');
    return isIsoDate(value) ? value : null;
  } catch {
    return null;
  }
}

/**
 * The single source of truth for the page: the built-in data, everything the user can change,
 * and the calculated result. Components read the signals and call the methods; they never keep
 * their own copy of this state and never write it any other way.
 *
 * Every change is saved to this browser's localStorage. Nothing is sent anywhere.
 */
@Service()
export class CalculatorStore {
  /** Cards, programs, ratios, partner transfers, sources: everything that is not user input. */
  readonly data = inject(DATASET);

  private pinnedDate = pinnedToday();
  private readonly initial = loadState(this.data);

  private readonly todayState = signal(this.pinnedDate ?? localIsoDate(new Date()));
  private readonly balancesState = signal<Balances>(this.initial.balances);
  private readonly settingsState = signal<Settings>(this.initial.settings);
  private readonly bonusesState = signal<readonly Bonus[]>(this.initial.bonuses);
  private readonly routeOverridesState = signal<RouteOverrides>(this.initial.routeOverrides);

  /** Today as YYYY-MM-DD. Bonus end dates and the Bilt to Hyatt change are measured against it. */
  readonly today = this.todayState.asReadonly();
  readonly balances = this.balancesState.asReadonly();
  readonly settings = this.settingsState.asReadonly();
  /** Built-in bonuses the user has kept, followed by the ones the user added. */
  readonly bonuses = this.bonusesState.asReadonly();
  readonly routeOverrides = this.routeOverridesState.asReadonly();

  readonly input = computed<EngineInput>(() => ({
    today: this.todayState(),
    balances: this.balancesState(),
    settings: this.settingsState(),
    bonuses: this.bonusesState(),
    routeOverrides: this.routeOverridesState(),
  }));

  /** The whole calculation, recomputed whenever any input changes. */
  readonly result = computed<EngineResult>(() => compute(this.data, this.input()));

  readonly totalBalance = computed(() => totalBalance(this.data, this.balancesState()));

  /** true while the balances are still the example numbers from the first visit. */
  readonly showingExampleBalances = computed(() => {
    const balances = this.balancesState();
    const example = this.data.exampleBalances;
    return this.data.cards.every((card) => balances[card.id] === example[card.id]);
  });

  /** Number of partner transfers whose switch differs from its default. */
  readonly changedRouteCount = computed(() => Object.keys(this.routeOverridesState()).length);

  // ---- Lookups, so components never need to search the dataset themselves. ----

  /** 'Amex', 'Capital One', ... */
  cardName(cardId: CardId): string {
    return this.data.cards.find((card) => card.id === cardId)?.name ?? cardId;
  }

  /** 'British Airways Club', ... Falls back to the id for an unknown program. */
  programName(programId: ProgramId): string {
    return programName(this.data, programId);
  }

  /** 'No route', 'Direct', 'via A' or 'via A > B' for a CardCell.path. */
  pathLabel(path: readonly ProgramId[] | null): string {
    return pathLabel(this.data, path);
  }

  /** The programs a card transfers to directly, in display order. */
  directPartners(cardId: CardId): Program[] {
    return directPartnerIds(this.data, cardId).flatMap((id) => findProgram(this.data, id) ?? []);
  }

  /** The source with this id, or undefined (bonuses the user added have no source). */
  source(sourceId: string): Source | undefined {
    return this.data.sources.find((source) => source.id === sourceId);
  }

  /** true while a bonus has not passed its last day. Reads today(), so it is reactive. */
  isBonusActive(bonus: Bonus): boolean {
    return isBonusActive(bonus, this.todayState());
  }

  // ---- Changes. Each one saves. ----

  /** Accepts numbers or text such as '120,000'. Anything invalid becomes 0. */
  setBalance(cardId: CardId, value: unknown): void {
    this.balancesState.update((balances) => ({ ...balances, [cardId]: sanitizeBalance(value) }));
    this.persist();
  }

  clearBalances(): void {
    this.balancesState.set(ZERO_BALANCES);
    this.persist();
  }

  updateSettings(patch: Partial<Settings>): void {
    this.settingsState.update((settings) => ({ ...settings, ...patch }));
    this.persist();
  }

  setChaseCard(chaseCard: ChaseCard): void {
    this.updateSettings({ chaseCard });
  }

  setCitiTier(citiTier: CitiTier): void {
    this.updateSettings({ citiTier });
  }

  /** Switches one partner transfer on or off. Unknown route ids are ignored. */
  setRouteEnabled(routeId: string, enabled: boolean): void {
    const route = this.data.partnerTransfers.find((candidate) => candidate.id === routeId);
    if (!route) {
      return;
    }
    this.routeOverridesState.update((overrides) => {
      const next: Record<string, boolean> = { ...overrides };
      if (enabled === route.defaultOn) {
        delete next[routeId];
      } else {
        next[routeId] = enabled;
      }
      return next;
    });
    this.persist();
  }

  /** Puts every partner transfer back to its default on/off state. */
  resetRoutes(): void {
    this.routeOverridesState.set({});
    this.persist();
  }

  /** Adds a bonus from the form. Returns an error message to show, or null when it was added. */
  addBonus(draft: BonusDraft): string | null {
    const checked = validateBonusDraft(this.data, draft);
    if (!checked.ok) {
      return checked.error;
    }
    const bonus: Bonus = { ...checked.bonus, id: this.nextBonusId() };
    this.bonusesState.update((bonuses) => [...bonuses, bonus]);
    this.persist();
    return null;
  }

  removeBonus(id: string): void {
    this.bonusesState.update((bonuses) => bonuses.filter((bonus) => bonus.id !== id));
    this.persist();
  }

  /** Brings back the built-in bonus list and removes the bonuses the user added. */
  resetBonuses(): void {
    this.bonusesState.set(this.data.builtInBonuses);
    this.persist();
  }

  /** Back to the first-visit state. Also forgets what was saved in this browser. */
  resetAll(): void {
    const fresh = defaultState(this.data);
    this.balancesState.set(fresh.balances);
    this.settingsState.set(fresh.settings);
    this.bonusesState.set(fresh.bonuses);
    this.routeOverridesState.set(fresh.routeOverrides);
    try {
      browserStorage()?.removeItem(STORAGE_KEY);
    } catch {
      // Nothing to forget if storage is unavailable.
    }
  }

  /** Call when the page becomes visible again, so a tab left open overnight picks up the new date. */
  refreshToday(): void {
    if (this.pinnedDate === null) {
      this.todayState.set(localIsoDate(new Date()));
    }
  }

  /** For tests and demos: pretend today is another date. It stays pinned until the page reloads. */
  setToday(today: string): void {
    if (isIsoDate(today)) {
      this.pinnedDate = today;
      this.todayState.set(today);
    }
  }

  private nextBonusId(): string {
    const used = new Set(this.bonusesState().map((bonus) => bonus.id));
    let counter = 1;
    while (used.has(`user-${counter}`)) {
      counter++;
    }
    return `user-${counter}`;
  }

  private persist(): void {
    const state: SavedState = {
      v: 1,
      dataVersion: this.data.version,
      balances: this.balancesState(),
      settings: this.settingsState(),
      bonuses: this.bonusesState(),
      routeOverrides: this.routeOverridesState(),
    };
    try {
      browserStorage()?.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // Private browsing or a full disk: the calculator still works, it just will not remember.
    }
  }
}
