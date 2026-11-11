import { DATASET_2026_11_09 as DATA } from './datasets/dataset-2026-11-09';
import { Bonus, CardId, EngineInput, ProgramId } from './models';

// Expected results for engine.spec.ts, for the 2026-11-09 dataset. They were produced by a separate
// re-implementation of the spreadsheet formulas, and scenario A was also checked cell by cell
// against the live Google Sheet. Do not edit by hand, and never regenerate from engine.ts: the
// point of this file is that it does not come from the code it checks.

/**
 * One program: [programId, direct ratio per card, best ratio per card, path per card, direct total, max total].
 * Per-card arrays follow the dataset's card order. A path of null means the card cannot reach the program.
 */
export type ExpectedRow = readonly [
  ProgramId,
  readonly number[],
  readonly number[],
  readonly (readonly ProgramId[] | null)[],
  number,
  number,
];

export interface Scenario {
  readonly name: string;
  readonly input: EngineInput;
  readonly expected: readonly ExpectedRow[];
}

function userBonus(
  id: string,
  cardId: CardId,
  programId: ProgramId,
  pct: number,
  endDate: string | null,
): Bonus {
  return { id, cardId, programId, pct, endDate, sourceId: '', builtIn: false };
}

const DEFAULTS = {
  balances: DATA.exampleBalances,
  settings: DATA.defaultSettings,
  bonuses: DATA.builtInBonuses,
  routeOverrides: {},
};

const A: Scenario = {
  name: 'A: default settings on 2026-11-09 (every built-in bonus active)',
  input: { ...DEFAULTS, today: '2026-11-09' },
  // prettier-ignore
  expected: [
    ['aer-lingus', [1, 1, 0, 0, 1, 1], [1, 1.3, 1, 1, 1, 1], [[], ['british-airways'], ['qatar'], ['british-airways'], [], []], 255000, 397000],
    ['aeromexico', [1.6, 0, 0, 1, 0, 0], [1.6, 0.675, 0.39, 1, 0.9, 0.39], [[], ['hyatt'], ['virgin-atlantic', 'hilton'], [], ['hyatt'], ['virgin-atlantic', 'hilton']], 267000, 376200],
    ['aeroplan', [1, 1, 0, 1, 1, 0], [1, 1, 0.3125, 1, 1, 0.20833333333333331], [[], [], ['krisflyer', 'marriott'], [], [], ['cathay', 'marriott']], 315000, 330625],
    ['flying-blue', [1, 1, 1, 1.2, 1, 1], [1, 1, 1, 1.2, 1, 1], [[], [], [], [], [], []], 385000, 385000],
    ['atmos', [0, 0, 0, 0, 1, 0], [0.5625, 0.41666666666666663, 0.3125, 0.3125, 1, 0.20833333333333331], [['marriott'], ['marriott'], ['krisflyer', 'marriott'], ['krisflyer', 'marriott'], [], ['cathay', 'marriott']], 30000, 174063],
    ['aadvantage', [0, 0, 1, 0, 0, 0], [0.45, 0.36000000000000004, 1, 0.25, 0.4, 0.16666666666666666], [['marriott'], ['ihg'], [], ['krisflyer', 'marriott'], ['hyatt'], ['cathay', 'marriott']], 40000, 159650],
    ['ana', [1, 0, 0, 0, 0, 0], [1, 0.41666666666666663, 0.3125, 0.3125, 0.5, 0.20833333333333331], [[], ['marriott'], ['krisflyer', 'marriott'], ['krisflyer', 'marriott'], ['hyatt'], ['cathay', 'marriott']], 120000, 211563],
    ['lifemiles', [1, 0, 1, 1, 1, 1], [1, 0.36000000000000004, 1, 1, 1, 1], [[], ['ihg'], [], [], [], []], 280000, 312400],
    ['british-airways', [1, 1.3, 0, 1, 1, 1], [1, 1.3, 1, 1, 1, 1], [[], [], ['qatar'], [], [], []], 357000, 397000],
    ['cathay', [0.8, 0, 1.1, 1, 1, 1], [0.8, 0.41666666666666663, 1.1, 1, 1, 1], [[], ['marriott'], [], [], [], []], 260000, 297500],
    ['copa', [0, 0, 0, 0.9750000000000001, 0, 0], [0.5625, 0.41666666666666663, 0.3125, 0.9750000000000001, 0.41666666666666663, 0.20833333333333331], [['marriott'], ['marriott'], ['krisflyer', 'marriott'], [], ['marriott'], ['cathay', 'marriott']], 73125, 206250],
    ['delta', [1, 0, 0, 0, 0, 0], [1, 0.375, 0.25, 0.25, 0.5, 0.16666666666666666], [[], ['hyatt'], ['accor'], ['accor'], ['hyatt'], ['cathay', 'marriott']], 120000, 200000],
    ['emirates', [0.8, 0, 0.8, 0.75, 1, 0], [0.8, 0.41666666666666663, 0.8, 0.75, 1, 0.20833333333333331], [[], ['marriott'], [], [], [], ['cathay', 'marriott']], 214250, 254875],
    ['etihad', [0, 0, 1, 1, 1, 0], [0.5625, 0.41666666666666663, 1, 1, 1, 0.20833333333333331], [['marriott'], ['marriott'], [], [], [], ['cathay', 'marriott']], 145000, 253125],
    ['eva', [0, 0, 1, 0.75, 0, 0], [0.2, 0.15000000000000002, 1, 0.75, 0.15000000000000002, 0.15000000000000002], [['hilton'], ['virgin-atlantic', 'hilton'], [], [], ['virgin-atlantic', 'hilton'], ['virgin-atlantic', 'hilton']], 96250, 140500],
    ['finnair', [0, 0, 0, 1, 0, 0], [1, 1.3, 1, 1, 1, 1], [['british-airways'], ['british-airways'], ['qatar'], [], ['british-airways'], ['british-airways']], 75000, 397000],
    ['iberia', [1, 1, 0, 0, 1, 1], [1, 1.3, 1, 1, 1, 1], [[], ['british-airways'], ['qatar'], ['british-airways'], [], []], 255000, 397000],
    ['jal', [0, 0, 1, 0.75, 1, 0], [0.5625, 0.41666666666666663, 1, 0.75, 1, 0.20833333333333331], [['marriott'], ['marriott'], [], [], [], ['cathay', 'marriott']], 126250, 234375],
    ['jetblue', [0.8, 1, 1, 0.6, 1, 1], [0.8, 1, 1, 0.6, 1, 1], [[], [], [], [], [], []], 316000, 316000],
    ['korean', [0, 0, 0, 0, 0, 0], [0.5625, 0.41666666666666663, 0.3125, 0.3125, 0.5, 0.20833333333333331], [['marriott'], ['marriott'], ['krisflyer', 'marriott'], ['krisflyer', 'marriott'], ['hyatt'], ['cathay', 'marriott']], 0, 159063],
    ['qantas', [1, 0, 1, 1, 0, 0], [1, 0.43499999999999994, 1, 1, 0.8333333333333333, 0.3125], [[], ['hyatt'], [], [], ['accor'], ['flying-blue', 'accor']], 235000, 303838],
    ['qatar', [1, 0, 1, 1, 1, 0], [1, 1.3, 1, 1, 1, 1], [[], ['british-airways'], [], [], [], ['british-airways']], 265000, 397000],
    ['krisflyer', [1, 1, 1, 1, 0, 0], [1, 1, 1, 1, 0.5, 0.4], [[], [], [], [], ['hyatt'], ['wyndham']], 325000, 346000],
    ['southwest', [0, 1, 0, 0, 1, 0], [0.5625, 1, 0.3125, 0.3125, 1, 0.20833333333333331], [['marriott'], [], ['krisflyer', 'marriott'], ['krisflyer', 'marriott'], [], ['cathay', 'marriott']], 120000, 226563],
    ['tap', [0, 0, 0, 1, 1, 0], [0.5625, 0.41666666666666663, 0.3125, 1, 1, 0.20833333333333331], [['marriott'], ['marriott'], ['krisflyer', 'marriott'], [], [], ['cathay', 'marriott']], 105000, 225625],
    ['thai', [0, 0, 1, 0, 0, 0], [0.5625, 0.41666666666666663, 1, 0.3125, 0.5, 0.20833333333333331], [['marriott'], ['marriott'], [], ['krisflyer', 'marriott'], ['hyatt'], ['cathay', 'marriott']], 40000, 186563],
    ['turkish', [0, 0, 1, 1, 1, 0], [0.5625, 0.41666666666666663, 1, 1, 1, 0.20833333333333331], [['marriott'], ['marriott'], [], [], [], ['cathay', 'marriott']], 145000, 253125],
    ['united', [0, 1, 0, 0, 1, 0], [0.675, 1, 0.375, 0.375, 1, 0.25], [['marriott'], [], ['krisflyer', 'marriott'], ['krisflyer', 'marriott'], [], ['cathay', 'marriott']], 120000, 247875],
    ['virgin-atlantic', [1.3, 1, 1, 1.3, 1, 1], [1.3, 1, 1, 1.3, 1, 1], [[], [], [], [], [], []], 428500, 428500],
    ['virgin-red', [0, 0, 0, 1.3, 0, 1], [1.3, 1, 1, 1.3, 1, 1], [['virgin-atlantic'], ['virgin-atlantic'], ['virgin-atlantic'], [], ['virgin-atlantic'], []], 112500, 428500],
    ['marriott', [1.35, 1, 0, 0, 1, 0], [1.35, 1, 0.75, 0.75, 1, 0.5], [[], [], ['krisflyer'], ['krisflyer'], [], ['cathay']], 282000, 375750],
    ['hilton', [2, 0, 0, 0, 1, 0], [2, 1.5, 1.5, 1.9500000000000002, 1.5, 1.5], [[], ['virgin-atlantic'], ['virgin-atlantic'], ['virgin-atlantic'], ['virgin-atlantic'], ['virgin-atlantic']], 270000, 648750],
    ['hyatt', [0, 0.75, 0, 0, 1, 0], [0, 0.75, 0, 0, 1, 0], [null, [], null, null, [], null], 97500, 97500],
    ['ihg', [0, 1.8, 0, 0, 1, 0], [0, 1.8, 0, 0, 1, 0], [null, [], null, null, [], null], 192000, 192000],
    ['accor', [0, 0, 0.5, 0.5, 0.6666666666666666, 0], [0.2857142857142857, 0.37142857142857144, 0.5, 0.5, 0.6666666666666666, 0.2857142857142857], [['qatar'], ['british-airways', 'qatar'], [], [], [], ['british-airways', 'qatar']], 77500, 149501],
    ['wyndham', [0, 1, 1, 1, 1, 2], [0, 1, 1, 1, 1, 2], [null, [], [], [], [], []], 265000, 265000],
    ['choice', [1, 0, 1.5, 1, 0, 2], [1, 0, 1.5, 1, 0, 2], [[], null, [], [], null, []], 285000, 285000],
    ['i-prefer', [0, 0, 2, 2, 2, 0], [0, 0, 2, 2, 2, 0], [null, null, [], [], [], null], 290000, 290000],
    ['leaders-club', [0.25, 0, 0.2, 0, 0, 0], [0.25, 0, 0.2, 0, 0, 0], [[], null, [], null, null, null], 38000, 38000],
    ['amtrak', [0, 0, 0, 0, 0.5, 0], [0, 0, 0, 0, 0.5, 0], [null, null, null, null, [], null], 15000, 15000],
  ],
};

const B: Scenario = {
  name: 'B: every setting flipped (Chase Reserve, other Citi card, no bonuses, no block bonuses)',
  input: {
    ...DEFAULTS,
    today: '2026-11-09',
    settings: {
      chaseCard: 'reserve',
      citiTier: 'other',
      countBonuses: false,
      countBlockBonuses: false,
    },
  },
  // prettier-ignore
  expected: [
    ['aer-lingus', [1, 1, 0, 0, 1, 1], [1, 1, 0.7, 1, 1, 1], [[], [], ['qatar'], ['british-airways'], [], []], 255000, 358000],
    ['aeromexico', [1.6, 0, 0, 1, 0, 0], [1.6, 0.8, 0.27299999999999996, 1, 0.8, 0.39], [[], ['hyatt'], ['virgin-atlantic', 'hilton'], [], ['hyatt'], ['virgin-atlantic', 'hilton']], 267000, 379770],
    ['aeroplan', [1, 1, 0, 1, 1, 0], [1, 1, 0.175, 1, 1, 0.16666666666666666], [[], [], ['accor'], [], [], ['cathay', 'marriott']], 315000, 324500],
    ['flying-blue', [1, 1, 0.7, 1, 1, 1], [1, 1, 0.7, 1, 1, 1], [[], [], [], [], [], []], 358000, 358000],
    ['atmos', [0, 0, 0, 0, 1, 0], [0.3333333333333333, 0.3333333333333333, 0.17499999999999996, 0.25, 1, 0.16666666666666666], [['marriott'], ['marriott'], ['krisflyer', 'marriott'], ['krisflyer', 'marriott'], [], ['cathay', 'marriott']], 30000, 128250],
    ['aadvantage', [0, 0, 0.7, 0, 0, 0], [0.3333333333333333, 0.4, 0.7, 0.25, 0.4, 0.16666666666666666], [['marriott'], ['hyatt'], [], ['krisflyer', 'marriott'], ['hyatt'], ['cathay', 'marriott']], 28000, 137250],
    ['ana', [1, 0, 0, 0, 0, 0], [1, 0.4, 0.17499999999999996, 0.25, 0.4, 0.16666666666666666], [[], ['hyatt'], ['krisflyer', 'marriott'], ['krisflyer', 'marriott'], ['hyatt'], ['cathay', 'marriott']], 120000, 196250],
    ['lifemiles', [1, 0, 0.7, 1, 1, 1], [1, 0.3333333333333333, 0.7, 1, 1, 1], [[], ['marriott'], [], [], [], []], 268000, 298000],
    ['british-airways', [1, 1, 0, 1, 1, 1], [1, 1, 0.7, 1, 1, 1], [[], [], ['qatar'], [], [], []], 330000, 358000],
    ['cathay', [0.8, 0, 0.7, 1, 1, 1], [0.8, 0.4, 0.7, 1, 1, 1], [[], ['hyatt'], [], [], [], []], 244000, 280000],
    ['copa', [0, 0, 0, 0.75, 0, 0], [0.3333333333333333, 0.3333333333333333, 0.17499999999999996, 0.75, 0.3333333333333333, 0.16666666666666666], [['marriott'], ['marriott'], ['krisflyer', 'marriott'], [], ['marriott'], ['cathay', 'marriott']], 56250, 145750],
    ['delta', [1, 0, 0, 0, 0, 0], [1, 0.4, 0.175, 0.25, 0.4, 0.16666666666666666], [[], ['hyatt'], ['accor'], ['accor'], ['hyatt'], ['cathay', 'marriott']], 120000, 196250],
    ['emirates', [0.8, 0, 0.5599999999999999, 0.75, 1, 0], [0.8, 0.4, 0.5599999999999999, 0.75, 1, 0.16666666666666666], [[], ['hyatt'], [], [], [], ['cathay', 'marriott']], 204650, 243150],
    ['etihad', [0, 0, 0.7, 1, 1, 0], [0.3333333333333333, 0.4, 0.7, 1, 1, 0.16666666666666666], [['marriott'], ['hyatt'], [], [], [], ['cathay', 'marriott']], 133000, 211500],
    ['eva', [0, 0, 0.7, 0.75, 0, 0], [0.2, 0.15000000000000002, 0.7, 0.75, 0.15000000000000002, 0.15000000000000002], [['hilton'], ['virgin-atlantic', 'hilton'], [], [], ['virgin-atlantic', 'hilton'], ['virgin-atlantic', 'hilton']], 84250, 128500],
    ['finnair', [0, 0, 0, 1, 0, 0], [1, 1, 0.7, 1, 1, 1], [['british-airways'], ['british-airways'], ['qatar'], [], ['british-airways'], ['british-airways']], 75000, 358000],
    ['iberia', [1, 1, 0, 0, 1, 1], [1, 1, 0.7, 1, 1, 1], [[], [], ['qatar'], ['british-airways'], [], []], 255000, 358000],
    ['jal', [0, 0, 0.7, 0.75, 1, 0], [0.3333333333333333, 0.4, 0.7, 0.75, 1, 0.16666666666666666], [['marriott'], ['hyatt'], [], [], [], ['cathay', 'marriott']], 114250, 192750],
    ['jetblue', [0.8, 1, 0.7, 0.6, 1, 1], [0.8, 1, 0.7, 0.6, 1, 1], [[], [], [], [], [], []], 304000, 304000],
    ['korean', [0, 0, 0, 0, 0, 0], [0.3333333333333333, 0.4, 0.175, 0.25, 0.4, 0.16666666666666666], [['marriott'], ['hyatt'], ['accor'], ['accor'], ['hyatt'], ['cathay', 'marriott']], 0, 116250],
    ['qantas', [1, 0, 0.7, 1, 0, 0], [1, 0.48, 0.7, 1, 0.8333333333333333, 0.3125], [[], ['hyatt'], [], [], ['accor'], ['flying-blue', 'accor']], 223000, 295888],
    ['qatar', [1, 0, 0.7, 1, 1, 0], [1, 1, 0.7, 1, 1, 1], [[], ['british-airways'], [], [], [], ['british-airways']], 253000, 358000],
    ['krisflyer', [1, 1, 0.7, 1, 0, 0], [1, 1, 0.7, 1, 0.4, 0.4], [[], [], [], [], ['hyatt'], ['wyndham']], 313000, 331000],
    ['southwest', [0, 1, 0, 0, 1, 0], [0.3333333333333333, 1, 0.17499999999999996, 0.25, 1, 0.16666666666666666], [['marriott'], [], ['krisflyer', 'marriott'], ['krisflyer', 'marriott'], [], ['cathay', 'marriott']], 120000, 188250],
    ['tap', [0, 0, 0, 1, 1, 0], [0.3333333333333333, 0.3333333333333333, 0.175, 1, 1, 0.16666666666666666], [['marriott'], ['marriott'], ['accor'], [], [], ['cathay', 'marriott']], 105000, 184500],
    ['thai', [0, 0, 0.7, 0, 0, 0], [0.3333333333333333, 0.4, 0.7, 0.25, 0.4, 0.16666666666666666], [['marriott'], ['hyatt'], [], ['accor'], ['hyatt'], ['cathay', 'marriott']], 28000, 137250],
    ['turkish', [0, 0, 0.7, 1, 1, 0], [0.3333333333333333, 0.3333333333333333, 0.7, 1, 1, 0.16666666666666666], [['marriott'], ['marriott'], [], [], [], ['cathay', 'marriott']], 133000, 205500],
    ['united', [0, 1, 0, 0, 1, 0], [0.3333333333333333, 1, 0.175, 0.25, 1, 0.16666666666666666], [['marriott'], [], ['accor'], ['accor'], [], ['cathay', 'marriott']], 120000, 188250],
    ['virgin-atlantic', [1, 1, 0.7, 1, 1, 1], [1, 1, 0.7, 1, 1, 1], [[], [], [], [], [], []], 358000, 358000],
    ['virgin-red', [0, 0, 0, 1, 0, 1], [1, 1, 0.7, 1, 1, 1], [['virgin-atlantic'], ['virgin-atlantic'], ['virgin-atlantic'], [], ['virgin-atlantic'], []], 90000, 358000],
    ['marriott', [1, 1, 0, 0, 1, 0], [1, 1, 0.5249999999999999, 0.75, 1, 0.5], [[], [], ['krisflyer'], ['krisflyer'], [], ['cathay']], 240000, 324750],
    ['hilton', [2, 0, 0, 0, 1, 0], [2, 1.5, 1.0499999999999998, 1.5, 1.5, 1.5], [[], ['virgin-atlantic'], ['virgin-atlantic'], ['virgin-atlantic'], ['virgin-atlantic'], ['virgin-atlantic']], 270000, 597000],
    ['hyatt', [0, 1, 0, 0, 1, 0], [0, 1, 0, 0, 1, 0], [null, [], null, null, [], null], 120000, 120000],
    ['ihg', [0, 1, 0, 0, 1, 0], [0, 1, 0, 0, 1, 0], [null, [], null, null, [], null], 120000, 120000],
    ['accor', [0, 0, 0.35, 0.5, 0.6666666666666666, 0], [0.2857142857142857, 0.2857142857142857, 0.35, 0.5, 0.6666666666666666, 0.2857142857142857], [['qatar'], ['british-airways', 'qatar'], [], [], [], ['british-airways', 'qatar']], 71500, 135786],
    ['wyndham', [0, 1, 0.7, 1, 1, 2], [0, 1, 0.7, 1, 1, 2], [null, [], [], [], [], []], 253000, 253000],
    ['choice', [1, 0, 1.0499999999999998, 1, 0, 2], [1, 0, 1.0499999999999998, 1, 0, 2], [[], null, [], [], null, []], 267000, 267000],
    ['i-prefer', [0, 0, 1.4, 2, 2, 0], [0, 0, 1.4, 2, 2, 0], [null, null, [], [], [], null], 266000, 266000],
    ['leaders-club', [0.25, 0, 0.13999999999999999, 0, 0, 0], [0.25, 0, 0.13999999999999999, 0, 0, 0], [[], null, [], null, null, null], 35600, 35600],
    ['amtrak', [0, 0, 0, 0, 0.5, 0], [0, 0, 0, 0, 0.5, 0], [null, null, null, null, [], null], 15000, 15000],
  ],
};

const C: Scenario = {
  name: 'C: default settings on 2027-01-15 (built-in bonuses ended, Bilt to Hyatt at 4:3)',
  input: { ...DEFAULTS, today: '2027-01-15' },
  // prettier-ignore
  expected: [
    ['aer-lingus', [1, 1, 0, 0, 1, 1], [1, 1, 1, 1, 1, 1], [[], [], ['qatar'], ['british-airways'], [], []], 255000, 370000],
    ['aeromexico', [1.6, 0, 0, 1, 0, 0], [1.6, 0.675, 0.39, 1, 0.675, 0.39], [[], ['hyatt'], ['virgin-atlantic', 'hilton'], [], ['hyatt'], ['virgin-atlantic', 'hilton']], 267000, 369450],
    ['aeroplan', [1, 1, 0, 1, 1, 0], [1, 1, 0.3125, 1, 1, 0.20833333333333331], [[], [], ['krisflyer', 'marriott'], [], [], ['cathay', 'marriott']], 315000, 330625],
    ['flying-blue', [1, 1, 1, 1, 1, 1], [1, 1, 1, 1, 1, 1], [[], [], [], [], [], []], 370000, 370000],
    ['atmos', [0, 0, 0, 0, 1, 0], [0.41666666666666663, 0.41666666666666663, 0.3125, 0.3125, 1, 0.20833333333333331], [['marriott'], ['marriott'], ['krisflyer', 'marriott'], ['krisflyer', 'marriott'], [], ['cathay', 'marriott']], 30000, 156563],
    ['aadvantage', [0, 0, 1, 0, 0, 0], [0.3333333333333333, 0.3333333333333333, 1, 0.25, 0.3333333333333333, 0.16666666666666666], [['marriott'], ['marriott'], [], ['krisflyer', 'marriott'], ['marriott'], ['cathay', 'marriott']], 40000, 141250],
    ['ana', [1, 0, 0, 0, 0, 0], [1, 0.41666666666666663, 0.3125, 0.3125, 0.41666666666666663, 0.20833333333333331], [[], ['marriott'], ['krisflyer', 'marriott'], ['krisflyer', 'marriott'], ['marriott'], ['cathay', 'marriott']], 120000, 209063],
    ['lifemiles', [1, 0, 1, 1, 1, 1], [1, 0.3333333333333333, 1, 1, 1, 1], [[], ['marriott'], [], [], [], []], 280000, 310000],
    ['british-airways', [1, 1, 0, 1, 1, 1], [1, 1, 1, 1, 1, 1], [[], [], ['qatar'], [], [], []], 330000, 370000],
    ['cathay', [0.8, 0, 1, 1, 1, 1], [0.8, 0.41666666666666663, 1, 1, 1, 1], [[], ['marriott'], [], [], [], []], 256000, 293500],
    ['copa', [0, 0, 0, 0.75, 0, 0], [0.41666666666666663, 0.41666666666666663, 0.3125, 0.75, 0.41666666666666663, 0.20833333333333331], [['marriott'], ['marriott'], ['krisflyer', 'marriott'], [], ['marriott'], ['cathay', 'marriott']], 56250, 171875],
    ['delta', [1, 0, 0, 0, 0, 0], [1, 0.375, 0.25, 0.25, 0.375, 0.16666666666666666], [[], ['hyatt'], ['accor'], ['accor'], ['hyatt'], ['cathay', 'marriott']], 120000, 196250],
    ['emirates', [0.8, 0, 0.8, 0.75, 1, 0], [0.8, 0.41666666666666663, 0.8, 0.75, 1, 0.20833333333333331], [[], ['marriott'], [], [], [], ['cathay', 'marriott']], 214250, 254875],
    ['etihad', [0, 0, 1, 1, 1, 0], [0.41666666666666663, 0.41666666666666663, 1, 1, 1, 0.20833333333333331], [['marriott'], ['marriott'], [], [], [], ['cathay', 'marriott']], 145000, 235625],
    ['eva', [0, 0, 1, 0.75, 0, 0], [0.2, 0.15000000000000002, 1, 0.75, 0.15000000000000002, 0.15000000000000002], [['hilton'], ['virgin-atlantic', 'hilton'], [], [], ['virgin-atlantic', 'hilton'], ['virgin-atlantic', 'hilton']], 96250, 140500],
    ['finnair', [0, 0, 0, 1, 0, 0], [1, 1, 1, 1, 1, 1], [['british-airways'], ['british-airways'], ['qatar'], [], ['british-airways'], ['british-airways']], 75000, 370000],
    ['iberia', [1, 1, 0, 0, 1, 1], [1, 1, 1, 1, 1, 1], [[], [], ['qatar'], ['british-airways'], [], []], 255000, 370000],
    ['jal', [0, 0, 1, 0.75, 1, 0], [0.41666666666666663, 0.41666666666666663, 1, 0.75, 1, 0.20833333333333331], [['marriott'], ['marriott'], [], [], [], ['cathay', 'marriott']], 126250, 216875],
    ['jetblue', [0.8, 1, 1, 0.6, 1, 1], [0.8, 1, 1, 0.6, 1, 1], [[], [], [], [], [], []], 316000, 316000],
    ['korean', [0, 0, 0, 0, 0, 0], [0.41666666666666663, 0.41666666666666663, 0.3125, 0.3125, 0.41666666666666663, 0.20833333333333331], [['marriott'], ['marriott'], ['krisflyer', 'marriott'], ['krisflyer', 'marriott'], ['marriott'], ['cathay', 'marriott']], 0, 139063],
    ['qantas', [1, 0, 1, 1, 0, 0], [1, 0.43499999999999994, 1, 1, 0.8333333333333333, 0.3125], [[], ['hyatt'], [], [], ['accor'], ['flying-blue', 'accor']], 235000, 303838],
    ['qatar', [1, 0, 1, 1, 1, 0], [1, 1, 1, 1, 1, 1], [[], ['british-airways'], [], [], [], ['british-airways']], 265000, 370000],
    ['krisflyer', [1, 1, 1, 1, 0, 0], [1, 1, 1, 1, 0.41666666666666663, 0.4], [[], [], [], [], ['marriott'], ['wyndham']], 325000, 343500],
    ['southwest', [0, 1, 0, 0, 1, 0], [0.41666666666666663, 1, 0.3125, 0.3125, 1, 0.20833333333333331], [['marriott'], [], ['krisflyer', 'marriott'], ['krisflyer', 'marriott'], [], ['cathay', 'marriott']], 120000, 209063],
    ['tap', [0, 0, 0, 1, 1, 0], [0.41666666666666663, 0.41666666666666663, 0.3125, 1, 1, 0.20833333333333331], [['marriott'], ['marriott'], ['krisflyer', 'marriott'], [], [], ['cathay', 'marriott']], 105000, 208125],
    ['thai', [0, 0, 1, 0, 0, 0], [0.41666666666666663, 0.41666666666666663, 1, 0.3125, 0.41666666666666663, 0.20833333333333331], [['marriott'], ['marriott'], [], ['krisflyer', 'marriott'], ['marriott'], ['cathay', 'marriott']], 40000, 166563],
    ['turkish', [0, 0, 1, 1, 1, 0], [0.41666666666666663, 0.41666666666666663, 1, 1, 1, 0.20833333333333331], [['marriott'], ['marriott'], [], [], [], ['cathay', 'marriott']], 145000, 235625],
    ['united', [0, 1, 0, 0, 1, 0], [0.5, 1, 0.375, 0.375, 1, 0.25], [['marriott'], [], ['krisflyer', 'marriott'], ['krisflyer', 'marriott'], [], ['cathay', 'marriott']], 120000, 226875],
    ['virgin-atlantic', [1, 1, 1, 1, 1, 1], [1, 1, 1, 1, 1, 1], [[], [], [], [], [], []], 370000, 370000],
    ['virgin-red', [0, 0, 0, 1, 0, 1], [1, 1, 1, 1, 1, 1], [['virgin-atlantic'], ['virgin-atlantic'], ['virgin-atlantic'], [], ['virgin-atlantic'], []], 90000, 370000],
    ['marriott', [1, 1, 0, 0, 1, 0], [1, 1, 0.75, 0.75, 1, 0.5], [[], [], ['krisflyer'], ['krisflyer'], [], ['cathay']], 240000, 333750],
    ['hilton', [2, 0, 0, 0, 1, 0], [2, 1.5, 1.5, 1.5, 1.5, 1.5], [[], ['virgin-atlantic'], ['virgin-atlantic'], ['virgin-atlantic'], ['virgin-atlantic'], ['virgin-atlantic']], 270000, 615000],
    ['hyatt', [0, 0.75, 0, 0, 0.75, 0], [0, 0.75, 0, 0, 0.75, 0], [null, [], null, null, [], null], 90000, 90000],
    ['ihg', [0, 1, 0, 0, 1, 0], [0, 1, 0, 0, 1, 0], [null, [], null, null, [], null], 120000, 120000],
    ['accor', [0, 0, 0.5, 0.5, 0.6666666666666666, 0], [0.2857142857142857, 0.2857142857142857, 0.5, 0.5, 0.6666666666666666, 0.2857142857142857], [['qatar'], ['british-airways', 'qatar'], [], [], [], ['british-airways', 'qatar']], 77500, 141786],
    ['wyndham', [0, 1, 1, 1, 1, 2], [0, 1, 1, 1, 1, 2], [null, [], [], [], [], []], 265000, 265000],
    ['choice', [1, 0, 1.5, 1, 0, 2], [1, 0, 1.5, 1, 0, 2], [[], null, [], [], null, []], 285000, 285000],
    ['i-prefer', [0, 0, 2, 2, 2, 0], [0, 0, 2, 2, 2, 0], [null, null, [], [], [], null], 290000, 290000],
    ['leaders-club', [0.25, 0, 0.2, 0, 0, 0], [0.25, 0, 0.2, 0, 0, 0], [[], null, [], null, null, null], 38000, 38000],
    ['amtrak', [0, 0, 0, 0, 0.5, 0], [0, 0, 0, 0, 0.5, 0], [null, null, null, null, [], null], 15000, 15000],
  ],
};

const D: Scenario = {
  name: 'D: bonuses the user added (no end date, ends today, ended yesterday), route switches, uneven balances',
  input: {
    today: '2026-11-09',
    balances: {
      amex: 12345,
      chase: 0,
      citi: 67890,
      'capital-one': 1,
      bilt: 999999,
      'wells-fargo': 5000,
    },
    settings: DATA.defaultSettings,
    bonuses: [
      ...DATA.builtInBonuses,
      userBonus('u-1', 'citi', 'qatar', 0.5, null),
      userBonus('u-2', 'wells-fargo', 'flying-blue', 0.25, '2026-11-09'),
      userBonus('u-3', 'amex', 'delta', 1, '2026-11-08'),
    ],
    routeOverrides: {
      'united>marriott': true,
      'virgin-atlantic>hilton': false,
      'british-airways>qatar': false,
    },
  },
  // prettier-ignore
  expected: [
    ['aer-lingus', [1, 1, 0, 0, 1, 1], [1, 1.3, 1.5, 1, 1, 1], [[], ['british-airways'], ['qatar'], ['british-airways'], [], []], 1017344, 1119180],
    ['aeromexico', [1.6, 0, 0, 1, 0, 0], [1.6, 0.675, 0.3125, 1, 0.9, 0.20833333333333331], [[], ['hyatt'], ['krisflyer', 'marriott'], [], ['hyatt'], ['cathay', 'marriott']], 19753, 942010],
    ['aeroplan', [1, 1, 0, 1, 1, 0], [1, 1, 0.3125, 1, 1, 0.20833333333333331], [[], [], ['krisflyer', 'marriott'], [], [], ['cathay', 'marriott']], 1012345, 1034603],
    ['flying-blue', [1, 1, 1, 1.2, 1, 1.25], [1, 1, 1, 1.2, 1, 1.25], [[], [], [], [], [], []], 1086485, 1086485],
    ['atmos', [0, 0, 0, 0, 1, 0], [0.5625, 0.41666666666666663, 0.3125, 0.3125, 1, 0.20833333333333331], [['marriott'], ['marriott'], ['krisflyer', 'marriott'], ['krisflyer', 'marriott'], [], ['cathay', 'marriott']], 999999, 1029201],
    ['aadvantage', [0, 0, 1, 0, 0, 0], [0.45, 0.36000000000000004, 1, 0.25, 0.4, 0.16666666666666666], [['marriott'], ['ihg'], [], ['krisflyer', 'marriott'], ['hyatt'], ['cathay', 'marriott']], 67890, 474278],
    ['ana', [1, 0, 0, 0, 0, 0], [1, 0.41666666666666663, 0.3125, 0.3125, 0.5, 0.20833333333333331], [[], ['marriott'], ['krisflyer', 'marriott'], ['krisflyer', 'marriott'], ['hyatt'], ['cathay', 'marriott']], 12345, 534603],
    ['lifemiles', [1, 0, 1, 1, 1, 1], [1, 0.36000000000000004, 1, 1, 1, 1], [[], ['ihg'], [], [], [], []], 1085235, 1085235],
    ['british-airways', [1, 1.3, 0, 1, 1, 1], [1, 1.3, 1.5, 1, 1, 1], [[], [], ['qatar'], [], [], []], 1017345, 1119180],
    ['cathay', [0.8, 0, 1.1, 1, 1, 1], [0.8, 0.41666666666666663, 1.1, 1, 1, 1], [[], ['marriott'], [], [], [], []], 1089555, 1089555],
    ['copa', [0, 0, 0, 0.9750000000000001, 0, 0], [0.5625, 0.41666666666666663, 0.3125, 0.9750000000000001, 0.41666666666666663, 0.20833333333333331], [['marriott'], ['marriott'], ['krisflyer', 'marriott'], [], ['marriott'], ['cathay', 'marriott']], 1, 445869],
    ['delta', [1, 0, 0, 0, 0, 0], [1, 0.375, 0.25, 0.25, 0.5, 0.16666666666666666], [[], ['hyatt'], ['accor'], ['accor'], ['hyatt'], ['cathay', 'marriott']], 12345, 530151],
    ['emirates', [0.8, 0, 0.8, 0.75, 1, 0], [0.8, 0.41666666666666663, 0.8, 0.75, 1, 0.20833333333333331], [[], ['marriott'], [], [], [], ['cathay', 'marriott']], 1064188, 1065230],
    ['etihad', [0, 0, 1, 1, 1, 0], [0.5625, 0.41666666666666663, 1, 1, 1, 0.20833333333333331], [['marriott'], ['marriott'], [], [], [], ['cathay', 'marriott']], 1067890, 1075876],
    ['eva', [0, 0, 1, 0.75, 0, 0], [0.2, 0, 1, 0.75, 0.1, 0], [['hilton'], null, [], [], ['hilton'], null], 67891, 170360],
    ['finnair', [0, 0, 0, 1, 0, 0], [1, 1.3, 1.5, 1, 1, 1], [['british-airways'], ['british-airways'], ['qatar'], [], ['british-airways'], ['british-airways']], 1, 1119180],
    ['iberia', [1, 1, 0, 0, 1, 1], [1, 1.3, 1.5, 1, 1, 1], [[], ['british-airways'], ['qatar'], ['british-airways'], [], []], 1017344, 1119180],
    ['jal', [0, 0, 1, 0.75, 1, 0], [0.5625, 0.41666666666666663, 1, 0.75, 1, 0.20833333333333331], [['marriott'], ['marriott'], [], [], [], ['cathay', 'marriott']], 1067890, 1075876],
    ['jetblue', [0.8, 1, 1, 0.6, 1, 1], [0.8, 1, 1, 0.6, 1, 1], [[], [], [], [], [], []], 1082766, 1082766],
    ['korean', [0, 0, 0, 0, 0, 0], [0.5625, 0.41666666666666663, 0.3125, 0.3125, 0.5, 0.20833333333333331], [['marriott'], ['marriott'], ['krisflyer', 'marriott'], ['krisflyer', 'marriott'], ['hyatt'], ['cathay', 'marriott']], 0, 529202],
    ['qantas', [1, 0, 1, 1, 0, 0], [1, 0.43499999999999994, 1, 1, 0.8333333333333333, 0.390625], [[], ['hyatt'], [], [], ['accor'], ['flying-blue', 'accor']], 80236, 915521],
    ['qatar', [1, 0, 1.5, 1, 1, 0], [1, 1.3, 1.5, 1, 1, 1], [[], ['british-airways', 'iberia'], [], [], [], ['iberia']], 1114180, 1119180],
    ['krisflyer', [1, 1, 1, 1, 0, 0], [1, 1, 1, 1, 0.5, 0.4], [[], [], [], [], ['hyatt'], ['wyndham']], 80236, 582236],
    ['southwest', [0, 1, 0, 0, 1, 0], [0.5625, 1, 0.3125, 0.3125, 1, 0.20833333333333331], [['marriott'], [], ['krisflyer', 'marriott'], ['krisflyer', 'marriott'], [], ['cathay', 'marriott']], 999999, 1029201],
    ['tap', [0, 0, 0, 1, 1, 0], [0.5625, 0.41666666666666663, 0.3125, 1, 1, 0.20833333333333331], [['marriott'], ['marriott'], ['krisflyer', 'marriott'], [], [], ['cathay', 'marriott']], 1000000, 1029202],
    ['thai', [0, 0, 1, 0, 0, 0], [0.5625, 0.41666666666666663, 1, 0.3125, 0.5, 0.20833333333333331], [['marriott'], ['marriott'], [], ['krisflyer', 'marriott'], ['hyatt'], ['cathay', 'marriott']], 67890, 575876],
    ['turkish', [0, 0, 1, 1, 1, 0], [0.5625, 0.41666666666666663, 1, 1, 1, 0.20833333333333331], [['marriott'], ['marriott'], [], [], [], ['cathay', 'marriott']], 1067890, 1075876],
    ['united', [0, 1, 0, 0, 1, 0], [0.675, 1, 0.375, 0.375, 1, 0.25], [['marriott'], [], ['krisflyer', 'marriott'], ['krisflyer', 'marriott'], [], ['cathay', 'marriott']], 999999, 1035041],
    ['virgin-atlantic', [1.3, 1, 1, 1.3, 1, 1], [1.3, 1, 1, 1.3, 1, 1], [[], [], [], [], [], []], 1088939, 1088939],
    ['virgin-red', [0, 0, 0, 1.3, 0, 1], [1.3, 1, 1, 1.3, 1, 1], [['virgin-atlantic'], ['virgin-atlantic'], ['virgin-atlantic'], [], ['virgin-atlantic'], []], 5001, 1088939],
    ['marriott', [1.35, 1, 0, 0, 1, 0], [1.35, 1, 0.75, 0.75, 1, 0.5], [[], [], ['krisflyer'], ['krisflyer'], [], ['cathay']], 1016665, 1070084],
    ['hilton', [2, 0, 0, 0, 1, 0], [2, 0, 0, 0, 1, 0], [[], null, null, null, [], null], 1024689, 1024689],
    ['hyatt', [0, 0.75, 0, 0, 1, 0], [0, 0.75, 0, 0, 1, 0], [null, [], null, null, [], null], 999999, 999999],
    ['ihg', [0, 1.8, 0, 0, 1, 0], [0, 1.8, 0, 0, 1, 0], [null, [], null, null, [], null], 999999, 999999],
    ['accor', [0, 0, 0.5, 0.5, 0.6666666666666666, 0], [0.2857142857142857, 0.2857142857142857, 0.5, 0.5, 0.6666666666666666, 0.3125], [['qatar'], ['iberia', 'qatar'], [], [], [], ['flying-blue']], 700612, 705702],
    ['wyndham', [0, 1, 1, 1, 1, 2], [0, 1, 1, 1, 1, 2], [null, [], [], [], [], []], 1077890, 1077890],
    ['choice', [1, 0, 1.5, 1, 0, 2], [1, 0, 1.5, 1, 0, 2], [[], null, [], [], null, []], 124181, 124181],
    ['i-prefer', [0, 0, 2, 2, 2, 0], [0, 0, 2, 2, 2, 0], [null, null, [], [], [], null], 2135780, 2135780],
    ['leaders-club', [0.25, 0, 0.2, 0, 0, 0], [0.25, 0, 0.2, 0, 0, 0], [[], null, [], null, null, null], 16664, 16664],
    ['amtrak', [0, 0, 0, 0, 0.5, 0], [0, 0, 0, 0, 0.5, 0], [null, null, null, null, [], null], 500000, 500000],
  ],
};

export const SCENARIOS: readonly Scenario[] = [A, B, C, D];
