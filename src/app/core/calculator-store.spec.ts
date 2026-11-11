import { TestBed } from '@angular/core/testing';

import { CalculatorStore, DATASET, STORAGE_KEY, validateBonusDraft } from './calculator-store';
import { CURRENT_DATASET } from './datasets/current';
import { DATASET_2026_11_09 as DATA } from './datasets/dataset-2026-11-09';

/**
 * A store as the page would get it after a (re)load: it reads whatever is in localStorage.
 * It runs on the fixed baseline dataset, with today pinned to the day that data was checked.
 */
function loadStore(): CalculatorStore {
  TestBed.resetTestingModule();
  TestBed.configureTestingModule({ providers: [{ provide: DATASET, useValue: DATA }] });
  const store = TestBed.inject(CalculatorStore);
  store.setToday('2026-11-09');
  return store;
}

function saved(): Record<string, unknown> {
  return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '{}') as Record<string, unknown>;
}

function maxTotal(store: CalculatorStore, programId: string): number {
  return store.result().programs.find((p) => p.program.id === programId)?.maxTotal ?? -1;
}

const BUILT_IN_IDS = DATA.builtInBonuses.map((bonus) => bonus.id);

describe('CalculatorStore', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('starts with the example balances, default settings and built-in bonuses', () => {
    const store = loadStore();
    expect(store.data).toBe(DATA);
    expect(store.balances()).toEqual(DATA.exampleBalances);
    expect(store.settings()).toEqual(DATA.defaultSettings);
    expect(store.bonuses()).toEqual(DATA.builtInBonuses);
    expect(store.routeOverrides()).toEqual({});
    expect(store.showingExampleBalances()).toBe(true);
    expect(store.totalBalance()).toBe(370000);
    expect(maxTotal(store, 'qatar')).toBe(397000);
    expect(localStorage.getItem(STORAGE_KEY)).toBeNull();
  });

  it('uses the current dataset when nothing else is provided', () => {
    TestBed.resetTestingModule();
    const store = TestBed.inject(CalculatorStore);
    expect(store.data).toBe(CURRENT_DATASET);
    expect(store.result().programs.length).toBe(CURRENT_DATASET.programs.length);
    expect(store.balances()).toEqual(CURRENT_DATASET.exampleBalances);
  });

  it('looks things up by id', () => {
    const store = loadStore();
    expect(store.cardName('capital-one')).toBe('Capital One');
    expect(store.programName('british-airways')).toBe('British Airways Club');
    expect(store.pathLabel(['krisflyer', 'marriott'])).toBe(
      'via Singapore KrisFlyer > Marriott Bonvoy',
    );
    expect(store.pathLabel([])).toBe('Direct');
    expect(store.pathLabel(null)).toBe('No route');
    expect(store.directPartners('chase').length).toBe(14);
    expect(store.directPartners('chase')[0].name).toBe('Aer Lingus AerClub');
    expect(store.source('aw-amex')?.label).toBe('AwardWallet: Amex');
    expect(store.source('')).toBeUndefined();
  });

  it('recomputes when a balance changes and cleans up what was typed', () => {
    const store = loadStore();
    store.setBalance('chase', '0');
    expect(maxTotal(store, 'qatar')).toBe(280000);
    store.setBalance('chase', '90,000');
    expect(store.balances().chase).toBe(90000);
    store.setBalance('amex', -5);
    expect(store.balances().amex).toBe(0);
    store.setBalance('amex', 'abc');
    expect(store.balances().amex).toBe(0);
    expect(store.showingExampleBalances()).toBe(false);
    store.clearBalances();
    expect(store.totalBalance()).toBe(0);
    expect(maxTotal(store, 'qatar')).toBe(0);
  });

  it('applies each setting', () => {
    const store = loadStore();
    store.updateSettings({ countBonuses: false });
    expect(maxTotal(store, 'hilton')).toBe(615000);
    store.updateSettings({ countBonuses: true });
    expect(maxTotal(store, 'hilton')).toBe(648750);
    store.updateSettings({ countBlockBonuses: false });
    expect(maxTotal(store, 'united')).toBe(205250);
    store.updateSettings({ countBlockBonuses: true });
    store.setChaseCard('reserve');
    expect(store.result().programs.find((p) => p.program.id === 'hyatt')?.directTotal).toBe(120000);
    store.setCitiTier('other');
    expect(store.settings()).toEqual({
      ...DATA.defaultSettings,
      chaseCard: 'reserve',
      citiTier: 'other',
    });
  });

  it('stores only route switches that differ from the default', () => {
    const store = loadStore();
    store.setRouteEnabled('united>marriott', true);
    store.setRouteEnabled('british-airways>qatar', false);
    store.setRouteEnabled('not-a-route', true);
    expect(store.routeOverrides()).toEqual({
      'united>marriott': true,
      'british-airways>qatar': false,
    });
    expect(store.changedRouteCount()).toBe(2);
    store.setRouteEnabled('united>marriott', false);
    expect(store.routeOverrides()).toEqual({ 'british-airways>qatar': false });
    store.resetRoutes();
    expect(store.routeOverrides()).toEqual({});
    expect(store.changedRouteCount()).toBe(0);
  });

  it('adds, removes and restores bonuses', () => {
    const store = loadStore();
    const draft = { cardId: 'citi', programId: 'qatar', percent: '50', endDate: '' };
    expect(store.addBonus(draft)).toBeNull();
    expect(store.bonuses().at(-1)).toEqual({
      id: 'user-1',
      cardId: 'citi',
      programId: 'qatar',
      pct: 0.5,
      endDate: null,
      sourceId: '',
      builtIn: false,
    });
    const citiToQatar = store
      .result()
      .programs.find((p) => p.program.id === 'qatar')
      ?.cells.find((c) => c.cardId === 'citi');
    expect(citiToQatar?.directRatio).toBeCloseTo(1.5, 9);

    expect(store.addBonus({ ...draft, percent: '10%', endDate: '2026-12-31' })).toBeNull();
    expect(store.bonuses().at(-1)?.id).toBe('user-2');
    expect(store.bonuses().at(-1)?.endDate).toBe('2026-12-31');
    store.removeBonus('user-1');
    store.removeBonus('seed-amex-marriott');
    expect(store.bonuses().length).toBe(9);
    expect(store.addBonus(draft)).toBeNull();
    expect(store.bonuses().at(-1)?.id).toBe('user-1');
    store.resetBonuses();
    expect(store.bonuses()).toEqual(DATA.builtInBonuses);
  });

  it('knows whether a bonus still counts today', () => {
    const store = loadStore();
    const marriott = DATA.builtInBonuses[0];
    expect(marriott.endDate).toBe('2026-12-10');
    expect(store.isBonusActive(marriott)).toBe(true);
    store.setToday('2026-12-10');
    expect(store.isBonusActive(marriott)).toBe(true);
    store.setToday('2026-12-11');
    expect(store.isBonusActive(marriott)).toBe(false);
  });

  it('rejects bad bonus entries with a message and changes nothing', () => {
    const store = loadStore();
    const good = { cardId: 'chase', programId: 'united', percent: '30', endDate: '' };
    expect(store.addBonus({ ...good, cardId: 'nope' })).toMatch(/card/i);
    expect(store.addBonus({ ...good, programId: 'delta' })).toMatch(/program/i);
    expect(store.addBonus({ ...good, percent: '' })).toMatch(/percent/i);
    expect(store.addBonus({ ...good, percent: '-5' })).toMatch(/percent/i);
    expect(store.addBonus({ ...good, percent: 'lots' })).toMatch(/percent/i);
    expect(store.addBonus({ ...good, endDate: '12/31/2026' })).toMatch(/last day/i);
    expect(store.addBonus({ ...good, endDate: '2026-02-30' })).toMatch(/last day/i);
    expect(store.bonuses()).toEqual(DATA.builtInBonuses);
    expect(localStorage.getItem(STORAGE_KEY)).toBeNull();
    expect(validateBonusDraft(DATA, { ...good, percent: ' 12.5 % ' })).toEqual({
      ok: true,
      bonus: {
        cardId: 'chase',
        programId: 'united',
        pct: 0.125,
        endDate: null,
        sourceId: '',
        builtIn: false,
      },
    });
  });

  it('remembers everything in this browser', () => {
    const first = loadStore();
    first.setBalance('amex', 2500);
    first.setChaseCard('reserve');
    first.updateSettings({ countBlockBonuses: false });
    first.setRouteEnabled('atmos>marriott', true);
    first.addBonus({ cardId: 'bilt', programId: 'united', percent: '25', endDate: '2027-03-01' });
    first.removeBonus('seed-citi-cathay');
    expect(saved()['dataVersion']).toBe(DATA.version);

    const second = loadStore();
    expect(second).not.toBe(first);
    expect(second.balances().amex).toBe(2500);
    expect(second.balances().chase).toBe(90000);
    expect(second.settings()).toEqual({
      ...DATA.defaultSettings,
      chaseCard: 'reserve',
      countBlockBonuses: false,
    });
    expect(second.routeOverrides()).toEqual({ 'atmos>marriott': true });
    expect(second.bonuses().map((b) => b.id)).toEqual([
      ...BUILT_IN_IDS.filter((id) => id !== 'seed-citi-cathay'),
      'user-1',
    ]);
  });

  it('resetAll returns to the first-visit state and forgets what was saved', () => {
    const store = loadStore();
    store.setBalance('amex', 5);
    store.setRouteEnabled('united>marriott', true);
    store.addBonus({ cardId: 'bilt', programId: 'united', percent: '25', endDate: '' });
    store.resetAll();
    expect(store.balances()).toEqual(DATA.exampleBalances);
    expect(store.settings()).toEqual(DATA.defaultSettings);
    expect(store.bonuses()).toEqual(DATA.builtInBonuses);
    expect(store.routeOverrides()).toEqual({});
    expect(localStorage.getItem(STORAGE_KEY)).toBeNull();
  });

  it('survives damaged or unexpected saved data', () => {
    localStorage.setItem(STORAGE_KEY, '{not json');
    expect(loadStore().balances()).toEqual(DATA.exampleBalances);

    localStorage.setItem(STORAGE_KEY, JSON.stringify({ v: 99, balances: { amex: 1 } }));
    expect(loadStore().balances()).toEqual(DATA.exampleBalances);

    const ok = { cardId: 'amex', programId: 'delta', pct: 0.2, endDate: null };
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        v: 1,
        dataVersion: DATA.version,
        balances: { amex: '2,500', chase: -1, citi: 'x', bilt: 10.7 },
        settings: { chaseCard: 'gold', countBonuses: 'yes', citiTier: 'other' },
        bonuses: [
          { ...ok, id: 'ok', sourceId: '', builtIn: false },
          { ...ok, id: 'ok' },
          { ...ok, id: 'bad-card', cardId: 'visa' },
          { ...ok, id: 'bad-program', programId: 'united' },
          { ...ok, id: 'bad-pct', pct: 'x' },
          { ...ok, id: 'bad-date', endDate: 'soon' },
          'junk',
        ],
        routeOverrides: {
          'united>marriott': true,
          'british-airways>qatar': true,
          'made>up': false,
          x: 'y',
        },
      }),
    );
    const store = loadStore();
    expect(store.balances()).toEqual({
      amex: 2500,
      chase: 0,
      citi: 0,
      'capital-one': 0,
      bilt: 10,
      'wells-fargo': 0,
    });
    expect(store.settings()).toEqual({ ...DATA.defaultSettings, citiTier: 'other' });
    expect(store.bonuses().map((b) => b.id)).toEqual(['ok']);
    expect(store.routeOverrides()).toEqual({ 'united>marriott': true });
  });

  it('refreshes the built-in bonuses when the data version changes, and keeps the rest', () => {
    const old = { cardId: 'amex', programId: 'delta', pct: 0.5, endDate: '2026-01-01' };
    const mine = { cardId: 'chase', programId: 'united', pct: 0.3, endDate: null };
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        v: 1,
        dataVersion: 'older',
        balances: { amex: 7 },
        settings: { ...DATA.defaultSettings, chaseCard: 'reserve' },
        bonuses: [
          { ...old, id: 'seed-old', sourceId: 'aw-amex', builtIn: true },
          { ...mine, id: 'user-1', sourceId: '', builtIn: false },
        ],
        routeOverrides: { 'united>marriott': true },
      }),
    );
    const store = loadStore();
    expect(store.bonuses().map((b) => b.id)).toEqual([...BUILT_IN_IDS, 'user-1']);
    expect(store.balances().amex).toBe(7);
    expect(store.settings().chaseCard).toBe('reserve');
    expect(store.routeOverrides()).toEqual({ 'united>marriott': true });
  });

  it('keeps a pinned date when asked to refresh, and ignores invalid dates', () => {
    const store = loadStore();
    store.refreshToday();
    expect(store.today()).toBe('2026-11-09');
    store.setToday('not a date');
    expect(store.today()).toBe('2026-11-09');
    store.setToday('2027-01-15');
    expect(store.today()).toBe('2027-01-15');
    expect(maxTotal(store, 'hilton')).toBe(615000);
  });
});
