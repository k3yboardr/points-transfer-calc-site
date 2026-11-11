import { CURRENT_DATASET } from './datasets/current';
import { DATASET_2026_11_09 as DATA } from './datasets/dataset-2026-11-09';
import {
  EPSILON,
  activeBonusPct,
  baseCardRatio,
  compute,
  directPartnerIds,
  isBonusActive,
  isIsoDate,
  localIsoDate,
  pathLabel,
  programName,
  routeRatioUsed,
  sanitizeBalance,
  totalBalance,
} from './engine';
import { SCENARIOS } from './engine.fixtures';
import { Bonus, CardCell, Dataset, EngineInput, ProgramResult } from './models';

// Every test with a number in it runs on the fixed 2026-11-09 dataset (DATA), never on the
// current one, so updating the live data cannot break these tests.

const DEFAULT_INPUT: EngineInput = {
  today: '2026-11-09',
  balances: DATA.exampleBalances,
  settings: DATA.defaultSettings,
  bonuses: DATA.builtInBonuses,
  routeOverrides: {},
};

function row(input: EngineInput, programId: string): ProgramResult {
  const found = compute(DATA, input).programs.find((result) => result.program.id === programId);
  if (!found) {
    throw new Error(`No result for ${programId}`);
  }
  return found;
}

function cell(input: EngineInput, programId: string, cardId: string): CardCell {
  const found = row(input, programId).cells.find((candidate) => candidate.cardId === cardId);
  if (!found) {
    throw new Error(`No cell for ${cardId}`);
  }
  return found;
}

function withSettings(patch: Partial<EngineInput['settings']>): EngineInput {
  return { ...DEFAULT_INPUT, settings: { ...DATA.defaultSettings, ...patch } };
}

describe('datasets', () => {
  const datasets: readonly (readonly [string, Dataset])[] = [
    ['2026-11-09 baseline', DATA],
    ['current', CURRENT_DATASET],
  ];

  for (const [label, data] of datasets) {
    it(`${label}: ids are unique and everything referred to exists`, () => {
      const programIds = new Set(data.programs.map((program) => program.id));
      const sourceIds = new Set(data.sources.map((source) => source.id));
      expect(isIsoDate(data.checkedDate)).toBe(true);
      expect(data.version).not.toBe('');
      expect(programIds.size).toBe(data.programs.length);
      expect(sourceIds.size).toBe(data.sources.length);
      expect(new Set(data.cards.map((card) => card.id)).size).toBe(data.cards.length);
      expect(new Set(data.partnerTransfers.map((r) => r.id)).size).toBe(
        data.partnerTransfers.length,
      );
      expect(new Set(data.builtInBonuses.map((b) => b.id)).size).toBe(data.builtInBonuses.length);

      for (const card of data.cards) {
        for (const [programId, ratio] of Object.entries(data.cardRatios[card.id])) {
          expect(programIds.has(programId), `${card.id} to ${programId}`).toBe(true);
          expect(ratio, `${card.id} to ${programId}`).toBeGreaterThan(0);
        }
        expect(data.exampleBalances[card.id], card.id).toBeGreaterThanOrEqual(0);
      }
      for (const route of data.partnerTransfers) {
        expect(route.id).toBe(`${route.from}>${route.to}`);
        expect(route.from, route.id).not.toBe(route.to);
        expect(programIds.has(route.from), route.id).toBe(true);
        expect(programIds.has(route.to), route.id).toBe(true);
        expect(sourceIds.has(route.sourceId), route.id).toBe(true);
        expect(route.ratio, route.id).toBeGreaterThan(0);
        if (route.blockBonus) {
          expect(route.blockBonus.size, route.id).toBeGreaterThan(0);
        }
      }
      for (const bonus of data.builtInBonuses) {
        expect(directPartnerIds(data, bonus.cardId), bonus.id).toContain(bonus.programId);
        expect(sourceIds.has(bonus.sourceId), bonus.id).toBe(true);
        expect(bonus.builtIn, bonus.id).toBe(true);
        expect(bonus.pct, bonus.id).toBeGreaterThan(0);
        expect(bonus.endDate === null || isIsoDate(bonus.endDate), bonus.id).toBe(true);
      }
    });

    it(`${label}: the calculation runs and gives one row per program`, () => {
      const result = compute(data, {
        today: data.checkedDate,
        balances: data.exampleBalances,
        settings: data.defaultSettings,
        bonuses: data.builtInBonuses,
        routeOverrides: {},
      });
      expect(result.programs.length).toBe(data.programs.length);
      expect(result.routes.length).toBe(data.partnerTransfers.length);
      for (const program of result.programs) {
        expect(program.cells.length).toBe(data.cards.length);
        expect(program.maxTotal).toBeGreaterThanOrEqual(program.directTotal);
      }
    });
  }

  it('the baseline has the same shape as the spreadsheet', () => {
    expect(DATA.cards.length).toBe(6);
    expect(DATA.programs.length).toBe(40);
    expect(DATA.partnerTransfers.length).toBe(146);
    expect(DATA.builtInBonuses.length).toBe(9);
    expect(DATA.sources.length).toBe(25);
    expect(DATA.cards.map((card) => directPartnerIds(DATA, card.id).length)).toEqual([
      20, 14, 20, 24, 26, 11,
    ]);
    const off = DATA.partnerTransfers.filter((route) => !route.defaultOn).map((route) => route.id);
    expect(off).toEqual([
      'accor>flying-blue',
      'united>marriott',
      'aeroplan>marriott',
      'atmos>marriott',
    ]);
  });
});

describe('compute: matches the spreadsheet', () => {
  for (const scenario of SCENARIOS) {
    it(scenario.name, () => {
      const result = compute(DATA, scenario.input);
      expect(result.programs.map((program) => program.program.id)).toEqual(
        scenario.expected.map((expected) => expected[0]),
      );
      result.programs.forEach((actual, index) => {
        const [programId, direct, best, paths, directTotal, maxTotal] = scenario.expected[index];
        actual.cells.forEach((actualCell, cardIndex) => {
          const where = `${programId} / ${DATA.cards[cardIndex].id}`;
          expect(actualCell.cardId, where).toBe(DATA.cards[cardIndex].id);
          expect(Math.abs(actualCell.directRatio - direct[cardIndex]), where).toBeLessThan(EPSILON);
          expect(Math.abs(actualCell.bestRatio - best[cardIndex]), where).toBeLessThan(EPSILON);
          expect(actualCell.path, where).toEqual(paths[cardIndex]);
        });
        expect(actual.directTotal, programId).toBe(directTotal);
        expect(actual.maxTotal, programId).toBe(maxTotal);
        expect(actual.added, programId).toBe(maxTotal - directTotal);
      });
    });
  }
});

describe('compute: numbers worth knowing by heart (defaults on 2026-11-09)', () => {
  it('pools Avios: Qatar goes from 265,000 direct to 397,000', () => {
    const qatar = row(DEFAULT_INPUT, 'qatar');
    expect(qatar.directTotal).toBe(265000);
    expect(qatar.maxTotal).toBe(397000);
    expect(qatar.added).toBe(132000);
    expect(qatar.directCardCount).toBe(4);
    const adding = qatar.cells
      .filter((c) => c.addsPoints)
      .map((c) => [c.cardId, pathLabel(DATA, c.path), c.bestPoints - c.directPoints]);
    expect(adding).toEqual([
      ['chase', 'via British Airways Club', 117000],
      ['wells-fargo', 'via British Airways Club', 15000],
    ]);
  });

  it('finds two-move routes', () => {
    const viaTwo = cell(DEFAULT_INPUT, 'united', 'citi');
    expect(viaTwo.bestRatio).toBeCloseTo(0.375, 9);
    expect(pathLabel(DATA, viaTwo.path)).toBe('via Singapore KrisFlyer > Marriott Bonvoy');
    const accor = cell(DEFAULT_INPUT, 'accor', 'chase');
    expect(accor.bestRatio).toBeCloseTo(1.3 / 3.5, 9);
    expect(accor.path).toEqual(['british-airways', 'qatar']);
  });

  it('reports programs no card reaches directly', () => {
    const korean = row(DEFAULT_INPUT, 'korean');
    expect(korean.directTotal).toBe(0);
    expect(korean.directCardCount).toBe(0);
    expect(korean.maxTotal).toBe(159063);
    const amtrak = row(DEFAULT_INPUT, 'amtrak');
    expect(amtrak.cells.map((c) => pathLabel(DATA, c.path))).toEqual([
      'No route',
      'No route',
      'No route',
      'No route',
      'Direct',
      'No route',
    ]);
  });

  it('gives zero everywhere when all balances are zero, but keeps ratios and routes', () => {
    const empty = { amex: 0, chase: 0, citi: 0, 'capital-one': 0, bilt: 0, 'wells-fargo': 0 };
    const result = compute(DATA, { ...DEFAULT_INPUT, balances: empty });
    expect(result.programs.every((p) => p.maxTotal === 0 && p.added === 0)).toBe(true);
    expect(result.programs.every((p) => p.directCardCount === 0)).toBe(true);
    expect(result.programs.every((p) => p.cells.every((c) => !c.addsPoints))).toBe(true);
    const united = result.programs.find((p) => p.program.id === 'united');
    expect(united?.cells[0].bestRatio).toBeCloseTo(0.675, 9);
    expect(united?.cells[0].path).toEqual(['marriott']);
  });

  it('copies each cleaned-up balance into its cells', () => {
    const messy = { ...DATA.exampleBalances, amex: 2500.9, chase: -5 };
    const qatar = row({ ...DEFAULT_INPUT, balances: messy }, 'qatar');
    expect(qatar.cells.map((c) => c.balance)).toEqual([2500, 0, 40000, 75000, 30000, 15000]);
  });
});

describe('settings', () => {
  it('Chase card: Hyatt is 1:1 on Reserve and 4:3 otherwise', () => {
    expect(row(DEFAULT_INPUT, 'hyatt').directTotal).toBe(97500);
    expect(row(withSettings({ chaseCard: 'reserve' }), 'hyatt').directTotal).toBe(120000);
    expect(baseCardRatio(DATA, 'chase', 'hyatt', DATA.defaultSettings, '2026-11-09')).toBe(0.75);
    expect(baseCardRatio(DATA, 'amex', 'hyatt', DATA.defaultSettings, '2026-11-09')).toBe(0);
  });

  it('Citi card: other Citi cards get 70% of every Citi ratio', () => {
    const other = withSettings({ citiTier: 'other' });
    expect(cell(DEFAULT_INPUT, 'aadvantage', 'citi').directRatio).toBe(1);
    expect(cell(other, 'aadvantage', 'citi').directRatio).toBeCloseTo(0.7, 9);
    expect(cell(other, 'aadvantage', 'citi').baseRatio).toBe(1);
    expect(row(other, 'aadvantage').directTotal).toBe(28000);
    expect(cell(other, 'aadvantage', 'amex').bestRatio).toBe(
      cell(DEFAULT_INPUT, 'aadvantage', 'amex').bestRatio,
    );
  });

  it('Count limited-time transfer bonuses: off ignores every bonus', () => {
    const off = withSettings({ countBonuses: false });
    expect(row(DEFAULT_INPUT, 'hilton').maxTotal).toBe(648750);
    expect(row(off, 'hilton').maxTotal).toBe(615000);
    expect(row(off, 'qatar').maxTotal).toBe(370000);
    expect(cell(off, 'british-airways', 'chase').bonusPct).toBe(0);
    expect(cell(DEFAULT_INPUT, 'british-airways', 'chase').bonusPct).toBeCloseTo(0.3, 9);
  });

  it('Count Marriott and Hyatt block bonuses: off uses the plain ratio', () => {
    const marriottToUnited = DATA.partnerTransfers.find((route) => route.id === 'marriott>united');
    if (!marriottToUnited) {
      throw new Error('marriott>united is missing');
    }
    const off = { ...DATA.defaultSettings, countBlockBonuses: false };
    expect(routeRatioUsed(marriottToUnited, DATA.defaultSettings, {})).toBeCloseTo(0.5, 9);
    expect(routeRatioUsed(marriottToUnited, off, {})).toBeCloseTo(1 / 3, 9);
    expect(row(DEFAULT_INPUT, 'united').maxTotal).toBe(247875);
    expect(row(withSettings({ countBlockBonuses: false }), 'united').maxTotal).toBe(205250);
  });

  it('route switches: off routes contribute nothing, restricted routes can be turned on', () => {
    const baOff = { ...DEFAULT_INPUT, routeOverrides: { 'british-airways>qatar': false } };
    expect(row(baOff, 'qatar').maxTotal).toBe(397000);
    expect(cell(baOff, 'qatar', 'chase').path).toEqual(['british-airways', 'iberia']);
    const offRoute = compute(DATA, baOff).routes.find(
      (r) => r.route.id === 'british-airways>qatar',
    );
    expect(offRoute?.enabled).toBe(false);
    expect(offRoute?.ratioUsed).toBe(0);

    expect(row(DEFAULT_INPUT, 'marriott').maxTotal).toBe(375750);
    const aeroplanOn = { ...DEFAULT_INPUT, routeOverrides: { 'aeroplan>marriott': true } };
    expect(row(aeroplanOn, 'marriott').maxTotal).toBe(394500);
    expect(cell(aeroplanOn, 'marriott', 'capital-one').path).toEqual(['aeroplan']);
    expect(row(aeroplanOn, 'korean').maxTotal).toBe(166875);
  });
});

describe('bonuses', () => {
  const bonus = (endDate: string | null): Bonus => ({
    id: 'u',
    cardId: 'citi',
    programId: 'qatar',
    pct: 0.5,
    endDate,
    sourceId: '',
    builtIn: false,
  });

  it('counts a bonus through its last day and not after', () => {
    expect(isBonusActive(bonus('2026-11-09'), '2026-11-09')).toBe(true);
    expect(isBonusActive(bonus('2026-11-08'), '2026-11-09')).toBe(false);
    expect(isBonusActive(bonus(null), '2099-01-01')).toBe(true);
  });

  it('applies a bonus the user added to the direct ratio and to routes that start with it', () => {
    const input = { ...DEFAULT_INPUT, bonuses: [...DATA.builtInBonuses, bonus(null)] };
    expect(cell(input, 'qatar', 'citi').directRatio).toBeCloseTo(1.5, 9);
    expect(row(input, 'qatar').directTotal).toBe(285000);
    expect(row(input, 'qatar').maxTotal).toBe(417000);
    expect(cell(input, 'british-airways', 'citi').bestRatio).toBeCloseTo(1.5, 9);
    expect(cell(input, 'british-airways', 'citi').path).toEqual(['qatar']);
  });

  it('adds up two bonuses for the same card and program', () => {
    const both = [bonus(null), { ...bonus('2026-12-31'), id: 'v', pct: 0.25 }];
    expect(activeBonusPct('citi', 'qatar', { ...DEFAULT_INPUT, bonuses: both })).toBeCloseTo(
      0.75,
      9,
    );
  });

  it('drops the built-in bonuses once they end, and switches Bilt to Hyatt on 2027-01-01', () => {
    const later = { ...DEFAULT_INPUT, today: '2027-01-15' };
    expect(row(later, 'hilton').maxTotal).toBe(615000);
    expect(row(later, 'hyatt').directTotal).toBe(90000);
    expect(baseCardRatio(DATA, 'bilt', 'hyatt', DATA.defaultSettings, '2026-12-31')).toBe(1);
    expect(baseCardRatio(DATA, 'bilt', 'hyatt', DATA.defaultSettings, '2027-01-01')).toBe(0.75);
  });
});

describe('helpers', () => {
  it('pathLabel and programName', () => {
    expect(pathLabel(DATA, null)).toBe('No route');
    expect(pathLabel(DATA, [])).toBe('Direct');
    expect(pathLabel(DATA, ['marriott'])).toBe('via Marriott Bonvoy');
    expect(pathLabel(DATA, ['krisflyer', 'marriott'])).toBe(
      'via Singapore KrisFlyer > Marriott Bonvoy',
    );
    expect(programName(DATA, 'qatar')).toBe('Qatar Privilege Club');
    expect(programName(DATA, 'not-a-program')).toBe('not-a-program');
  });

  it('isIsoDate accepts only real YYYY-MM-DD dates', () => {
    expect(isIsoDate('2026-11-09')).toBe(true);
    expect(isIsoDate('2028-02-29')).toBe(true);
    expect(isIsoDate('2026-02-30')).toBe(false);
    expect(isIsoDate('2026-13-01')).toBe(false);
    expect(isIsoDate('11/09/2026')).toBe(false);
    expect(isIsoDate('')).toBe(false);
    expect(isIsoDate(null)).toBe(false);
  });

  it('localIsoDate uses local date parts', () => {
    expect(localIsoDate(new Date(2026, 10, 9, 23, 59))).toBe('2026-11-09');
    expect(localIsoDate(new Date(2027, 0, 1, 0, 0))).toBe('2027-01-01');
  });

  it('sanitizeBalance keeps whole, non-negative numbers', () => {
    expect(sanitizeBalance(120000)).toBe(120000);
    expect(sanitizeBalance('120,000')).toBe(120000);
    expect(sanitizeBalance(' 2 500 ')).toBe(2500);
    expect(sanitizeBalance(12.9)).toBe(12);
    expect(sanitizeBalance(-5)).toBe(0);
    expect(sanitizeBalance('abc')).toBe(0);
    expect(sanitizeBalance('')).toBe(0);
    expect(sanitizeBalance(undefined)).toBe(0);
    expect(sanitizeBalance(Number.NaN)).toBe(0);
  });

  it('totalBalance adds the six balances', () => {
    expect(totalBalance(DATA, DATA.exampleBalances)).toBe(370000);
  });
});
