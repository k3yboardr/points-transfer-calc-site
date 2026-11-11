import {
  Balances,
  Bonus,
  CardCell,
  CardId,
  Dataset,
  EngineInput,
  EngineResult,
  PartnerTransfer,
  Program,
  ProgramId,
  ProgramResult,
  RouteOverrides,
  RouteResult,
  Settings,
} from './models';

// The calculation, ported from the spreadsheet formulas. Pure functions only: no Angular, no
// browser APIs, no Date.now(). The data arrives as a Dataset, everything else as an EngineInput.

/** Most partner-to-partner moves chained after the card transfer. The spreadsheet uses 2. */
export const MAX_PARTNER_MOVES = 2;

/** Ratios closer than this count as equal, so floating point noise never picks a longer route. */
export const EPSILON = 1e-9;

/** YYYY-MM-DD for a Date in the browser's own time zone. Do not use toISOString(): that is UTC. */
export function localIsoDate(date: Date): string {
  const year = String(date.getFullYear()).padStart(4, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/** true for a real calendar date written as YYYY-MM-DD. */
export function isIsoDate(value: unknown): value is string {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false;
  }
  const year = Number(value.slice(0, 4));
  const month = Number(value.slice(5, 7));
  const day = Number(value.slice(8, 10));
  const date = new Date(Date.UTC(year, month - 1, day));
  return (
    date.getUTCFullYear() === year && date.getUTCMonth() === month - 1 && date.getUTCDate() === day
  );
}

/** A bonus counts through its end date. ISO dates compare correctly as plain strings. */
export function isBonusActive(bonus: Bonus, today: string): boolean {
  return bonus.endDate === null || bonus.endDate >= today;
}

/** Whole, non-negative number of points. Accepts text such as '120,000'. Anything else becomes 0. */
export function sanitizeBalance(value: unknown): number {
  const cleaned = typeof value === 'string' ? value.replace(/[,\s]/g, '') : value;
  const parsed = typeof cleaned === 'string' && cleaned !== '' ? Number(cleaned) : cleaned;
  if (typeof parsed !== 'number' || !Number.isFinite(parsed) || parsed <= 0) {
    return 0;
  }
  return Math.min(Math.floor(parsed), 1e12);
}

/** Sum of all card balances. */
export function totalBalance(data: Dataset, balances: Balances): number {
  return data.cards.reduce((total, card) => total + sanitizeBalance(balances[card.id]), 0);
}

/** The program with this id, or undefined. */
export function findProgram(data: Dataset, id: ProgramId): Program | undefined {
  return data.programs.find((program) => program.id === id);
}

/** Program name for an id, or the id itself when it is unknown. */
export function programName(data: Dataset, id: ProgramId): string {
  return findProgram(data, id)?.name ?? id;
}

/** 'No route', 'Direct', 'via A' or 'via A > B', using full program names. */
export function pathLabel(data: Dataset, path: readonly ProgramId[] | null): string {
  if (path === null) {
    return 'No route';
  }
  if (path.length === 0) {
    return 'Direct';
  }
  return `via ${path.map((id) => programName(data, id)).join(' > ')}`;
}

/** Ids of the programs a card can transfer to directly, in program order. */
export function directPartnerIds(data: Dataset, cardId: CardId): ProgramId[] {
  const ratios = data.cardRatios[cardId];
  return data.programs
    .filter((program) => (ratios[program.id] ?? 0) > 0)
    .map((program) => program.id);
}

/**
 * The "Card Ratios" tab: partner points per card point before the Citi multiplier and bonuses.
 * 0 means the card cannot transfer to the program directly.
 */
export function baseCardRatio(
  data: Dataset,
  cardId: CardId,
  programId: ProgramId,
  settings: Settings,
  today: string,
): number {
  const listed = data.cardRatios[cardId][programId] ?? 0;
  if (listed <= 0) {
    return 0;
  }
  if (programId === 'hyatt' && cardId === 'chase') {
    return data.chaseHyattRatio[settings.chaseCard];
  }
  if (programId === 'hyatt' && cardId === 'bilt') {
    const rule = data.biltHyattSwitch;
    return today < rule.date ? rule.before : rule.onOrAfter;
  }
  return listed;
}

/** The Citi multiplier for Citi cards other than Strata Premier and Strata Elite, otherwise 1. */
export function cardMultiplier(data: Dataset, cardId: CardId, settings: Settings): number {
  return cardId === 'citi' && settings.citiTier === 'other' ? data.citiOtherMultiplier : 1;
}

/** Sum of the bonuses that apply to one card and program today. 0 when bonuses are switched off. */
export function activeBonusPct(
  cardId: CardId,
  programId: ProgramId,
  input: Pick<EngineInput, 'today' | 'settings' | 'bonuses'>,
): number {
  if (!input.settings.countBonuses) {
    return 0;
  }
  let total = 0;
  for (const bonus of input.bonuses) {
    if (
      bonus.cardId === cardId &&
      bonus.programId === programId &&
      isBonusActive(bonus, input.today)
    ) {
      total += bonus.pct;
    }
  }
  return total;
}

export function isRouteEnabled(route: PartnerTransfer, overrides: RouteOverrides): boolean {
  return overrides[route.id] ?? route.defaultOn;
}

/** 0 when the route is off, otherwise its ratio plus the per-point value of the block bonus. */
export function routeRatioUsed(
  route: PartnerTransfer,
  settings: Settings,
  overrides: RouteOverrides,
): number {
  if (!isRouteEnabled(route, overrides)) {
    return 0;
  }
  const block = route.blockBonus;
  const blockValue =
    settings.countBlockBonuses && block && block.size > 0 ? block.bonus / block.size : 0;
  return route.ratio + blockValue;
}

/** How well one card reaches one program: the ratio, and the programs passed through on the way. */
interface Reach {
  readonly ratio: number;
  readonly path: readonly ProgramId[];
}

/** An active partner transfer, with programs as positions in data.programs. */
interface Hop {
  readonly from: number;
  readonly to: number;
  readonly fromId: ProgramId;
  readonly ratio: number;
}

function toHops(data: Dataset, routes: readonly RouteResult[]): Hop[] {
  const position = new Map(data.programs.map((program, index) => [program.id, index] as const));
  const hops: Hop[] = [];
  for (const { route, ratioUsed } of routes) {
    const from = position.get(route.from);
    const to = position.get(route.to);
    if (ratioUsed > 0 && from !== undefined && to !== undefined) {
      hops.push({ from, to, fromId: route.from, ratio: ratioUsed });
    }
  }
  return hops;
}

/**
 * Best ratio from one card to every program, allowing up to MAX_PARTNER_MOVES partner moves.
 *
 * Each pass answers "what is the best I can do with one more move?" using only the previous
 * pass, exactly like the spreadsheet's OneMoveRatio and BestRatio blocks. A longer route replaces
 * a shorter one only when it is strictly better, and when two routes tie, the one listed first in
 * data.partnerTransfers wins (hops are visited in that order and only a better one replaces).
 */
function bestReach(direct: readonly Reach[], hops: readonly Hop[]): Reach[] {
  let layer: Reach[] = [...direct];
  for (let move = 1; move <= MAX_PARTNER_MOVES; move++) {
    const next = [...layer];
    for (const hop of hops) {
      const source = layer[hop.from];
      const candidate = source.ratio * hop.ratio;
      if (candidate > next[hop.to].ratio + EPSILON) {
        next[hop.to] = { ratio: candidate, path: [...source.path, hop.fromId] };
      }
    }
    layer = next;
  }
  return layer;
}

/** One card's numbers for every program, in program order. */
function cellsForCard(
  data: Dataset,
  cardId: CardId,
  input: EngineInput,
  hops: readonly Hop[],
): CardCell[] {
  const balance = sanitizeBalance(input.balances[cardId]);
  const multiplier = cardMultiplier(data, cardId, input.settings);
  const baseRatios: number[] = [];
  const bonusPcts: number[] = [];
  const direct: Reach[] = [];
  for (const program of data.programs) {
    const baseRatio = baseCardRatio(data, cardId, program.id, input.settings, input.today);
    const bonusPct = baseRatio > 0 ? activeBonusPct(cardId, program.id, input) : 0;
    baseRatios.push(baseRatio);
    bonusPcts.push(bonusPct);
    direct.push({ ratio: baseRatio * multiplier * (1 + bonusPct), path: [] });
  }
  const best = bestReach(direct, hops);
  return data.programs.map((_, index) => {
    const directRatio = direct[index].ratio;
    const bestRatio = best[index].ratio;
    const directPoints = Math.round(directRatio * balance);
    const bestPoints = Math.round(bestRatio * balance);
    return {
      cardId,
      balance,
      baseRatio: baseRatios[index],
      bonusPct: bonusPcts[index],
      directRatio,
      bestRatio,
      path: bestRatio > 0 ? best[index].path : null,
      directPoints,
      bestPoints,
      addsPoints: bestPoints > directPoints,
    };
  });
}

function sum(values: readonly number[]): number {
  return values.reduce((total, value) => total + value, 0);
}

/** Runs the whole calculation. Cheap enough to call on every input change. */
export function compute(data: Dataset, input: EngineInput): EngineResult {
  const routes: RouteResult[] = data.partnerTransfers.map((route) => ({
    route,
    enabled: isRouteEnabled(route, input.routeOverrides),
    ratioUsed: routeRatioUsed(route, input.settings, input.routeOverrides),
  }));
  const hops = toHops(data, routes);
  const columns = data.cards.map((card) => cellsForCard(data, card.id, input, hops));

  const programs: ProgramResult[] = data.programs.map((program, index) => {
    const cells = columns.map((column) => column[index]);
    const directTotal = sum(cells.map((cell) => cell.directPoints));
    const maxTotal = sum(cells.map((cell) => cell.bestPoints));
    return {
      program,
      cells,
      directCardCount: cells.filter((cell) => cell.directRatio * cell.balance > 0).length,
      directTotal,
      maxTotal,
      added: maxTotal - directTotal,
    };
  });

  return { programs, routes };
}
