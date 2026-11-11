// Types shared by the datasets, the calculation engine, the store and the UI.

/** The six transferable card currencies. */
export type CardId = 'amex' | 'chase' | 'citi' | 'capital-one' | 'bilt' | 'wells-fargo';

/** Slug of an airline, hotel or rail program, for example 'british-airways'. */
export type ProgramId = string;

export type ProgramType = 'airline' | 'hotel' | 'rail';

export interface Card {
  readonly id: CardId;
  /** Short name used in table headers, for example 'Capital One'. */
  readonly name: string;
  /** Currency name, for example 'Capital One Miles'. */
  readonly fullName: string;
}

export interface Program {
  readonly id: ProgramId;
  readonly name: string;
  readonly type: ProgramType;
  /** Alliance or shared-currency group for airlines ('Avios pool', 'Star Alliance', ...). Empty otherwise. */
  readonly group: string;
}

/** Extra points per full block moved, for example 5,000 bonus miles per 60,000 Marriott points. */
export interface BlockBonus {
  readonly bonus: number;
  readonly size: number;
}

/** A transfer from one airline or hotel program to another (a "partner move"). */
export interface PartnerTransfer {
  /** `${from}>${to}`. Unique. */
  readonly id: string;
  readonly from: ProgramId;
  readonly to: ProgramId;
  /** Points received per 1 point sent, before any block bonus. */
  readonly ratio: number;
  readonly blockBonus: BlockBonus | null;
  /** false for routes that need elite status or a specific card. The user can switch any route on or off. */
  readonly defaultOn: boolean;
  readonly note: string;
  readonly sourceId: string;
}

/** A limited-time bonus on transfers from a card currency to one of its direct partners. */
export interface Bonus {
  readonly id: string;
  readonly cardId: CardId;
  readonly programId: ProgramId;
  /** Fraction, not percent: 0.3 means 30% extra. */
  readonly pct: number;
  /** Last day the bonus applies, as YYYY-MM-DD. null means it never ends. */
  readonly endDate: string | null;
  /** Key into SOURCES, or '' for bonuses the user added. */
  readonly sourceId: string;
  /** true for bonuses that ship with the site, false for bonuses the user added. */
  readonly builtIn: boolean;
}

export interface Source {
  readonly id: string;
  readonly label: string;
  readonly url: string;
  readonly usedFor: string;
}

export type ChaseCard = 'reserve' | 'preferred';
export type CitiTier = 'premium' | 'other';

/** The four switches from the spreadsheet's Settings block. */
export interface Settings {
  /** 'reserve' = Sapphire Reserve cards (Hyatt 1:1). 'preferred' = Sapphire Preferred or Ink (Hyatt 4:3). */
  readonly chaseCard: ChaseCard;
  /** 'premium' = Strata Premier or Strata Elite (full ratios). 'other' = any other Citi card (70%). */
  readonly citiTier: CitiTier;
  /** Count limited-time card transfer bonuses that have not ended. */
  readonly countBonuses: boolean;
  /** Count the Marriott and Hyatt bonuses for moving a full block of points. */
  readonly countBlockBonuses: boolean;
}

export type Balances = Readonly<Record<CardId, number>>;

/**
 * All the built-in data for one point in time: the website's copy of the spreadsheet's data tabs.
 * Datasets live in core/datasets. The engine and the store never import one directly; they are
 * handed one, so tests can run on a fixed baseline while the live site uses the newest data.
 */
export interface Dataset {
  /** Changes whenever the data changes. Saved browser state is refreshed when it differs. */
  readonly version: string;
  /** Date (YYYY-MM-DD) the ratios were last checked against their sources. Shown in the UI. */
  readonly checkedDate: string;
  /** Card currencies in display order. Every per-card array in the results follows this order. */
  readonly cards: readonly Card[];
  /** Airline, hotel and rail programs in display order. */
  readonly programs: readonly Program[];
  /** Partner points per card point, before the Citi multiplier and bonuses. Missing = no direct transfer. */
  readonly cardRatios: Readonly<Record<CardId, Readonly<Record<ProgramId, number>>>>;
  /** Chase to Hyatt depends on the Chase card. */
  readonly chaseHyattRatio: Readonly<Record<ChaseCard, number>>;
  /** Bilt to Hyatt changes on a date. `date` is the first day of the new ratio. */
  readonly biltHyattSwitch: {
    readonly date: string;
    readonly before: number;
    readonly onOrAfter: number;
  };
  /** Multiplier for Citi cards other than Strata Premier and Strata Elite. */
  readonly citiOtherMultiplier: number;
  /** Partner-to-partner transfers. Order matters: on a tie, the route listed first is shown. */
  readonly partnerTransfers: readonly PartnerTransfer[];
  /** Limited-time bonuses that ship with the site. */
  readonly builtInBonuses: readonly Bonus[];
  readonly sources: readonly Source[];
  /** Notes shown under the card ratio table. */
  readonly cardRatioNotes: readonly string[];
  /** Made-up balances shown on a first visit. */
  readonly exampleBalances: Balances;
  readonly defaultSettings: Settings;
}

/** Routes whose on/off state differs from PartnerTransfer.defaultOn, keyed by route id. */
export type RouteOverrides = Readonly<Record<string, boolean>>;

/** Everything the calculation depends on. */
export interface EngineInput {
  /** Today's date as YYYY-MM-DD in the user's own time zone. */
  readonly today: string;
  readonly balances: Balances;
  readonly settings: Settings;
  readonly bonuses: readonly Bonus[];
  readonly routeOverrides: RouteOverrides;
}

/** One card currency's numbers for one program. */
export interface CardCell {
  readonly cardId: CardId;
  /** This card's balance, cleaned up: a whole number, never negative. */
  readonly balance: number;
  /** The "Card Ratios" value: before the Citi multiplier and before bonuses. 0 = not a direct partner. */
  readonly baseRatio: number;
  /** Active bonus fraction included in directRatio (0 when there is none or bonuses are switched off). */
  readonly bonusPct: number;
  /** Partner points per card point when transferring straight from the card, with multiplier and bonus. */
  readonly directRatio: number;
  /** Best partner points per card point using up to MAX_PARTNER_MOVES partner moves. */
  readonly bestRatio: number;
  /**
   * How to get bestRatio. null = this card cannot reach the program. [] = transfer directly.
   * ['a'] = card to a, then a to this program. ['a', 'b'] = card to a, a to b, b to this program.
   */
  readonly path: readonly ProgramId[] | null;
  /** round(directRatio x balance). */
  readonly directPoints: number;
  /** round(bestRatio x balance). */
  readonly bestPoints: number;
  /** true when the partner route gives this card more points than the direct transfer (bestPoints > directPoints). */
  readonly addsPoints: boolean;
}

/** One row of the results table. */
export interface ProgramResult {
  readonly program: Program;
  /** One entry per card, in CARDS order. */
  readonly cells: readonly CardCell[];
  /** Number of cards that have a balance and transfer here directly. */
  readonly directCardCount: number;
  /** Sum of directPoints: what you get if every card's whole balance goes straight to this program. */
  readonly directTotal: number;
  /** Sum of bestPoints: the most you can get here, using partner moves where they help. */
  readonly maxTotal: number;
  /** maxTotal - directTotal. */
  readonly added: number;
}

export interface RouteResult {
  readonly route: PartnerTransfer;
  readonly enabled: boolean;
  /** Ratio the calculation uses: 0 when the route is off, otherwise ratio plus the block bonus when counted. */
  readonly ratioUsed: number;
}

export interface EngineResult {
  /** One entry per program, in PROGRAMS order. */
  readonly programs: readonly ProgramResult[];
  /** One entry per partner transfer, in PARTNER_TRANSFERS order. */
  readonly routes: readonly RouteResult[];
}
