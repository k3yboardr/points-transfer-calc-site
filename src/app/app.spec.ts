import { ComponentFixture, TestBed } from '@angular/core/testing';

import { App } from './app';
import { CalculatorStore, DATASET, STORAGE_KEY } from './core/calculator-store';
import { DATASET_2026_11_09 } from './core/datasets/dataset-2026-11-09';

// Acceptance tests for the whole page. They find elements only by data-testid, so the markup is
// free to change as long as the ids listed in PLAN.md stay. The page runs on the fixed 2026-11-09
// dataset with today pinned to that date, so the expected numbers never go stale.

describe('App', () => {
  let fixture: ComponentFixture<App>;
  let page: HTMLElement;
  let store: CalculatorStore;

  beforeEach(async () => {
    localStorage.clear();
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [{ provide: DATASET, useValue: DATASET_2026_11_09 }],
    }).compileComponents();
    store = TestBed.inject(CalculatorStore);
    store.setToday('2026-11-09');
    fixture = TestBed.createComponent(App);
    page = fixture.nativeElement as HTMLElement;
    await fixture.whenStable();
  });

  function all(testId: string): HTMLElement[] {
    return Array.from(page.querySelectorAll<HTMLElement>(`[data-testid="${testId}"]`));
  }

  function el<T extends HTMLElement = HTMLElement>(testId: string, within: HTMLElement = page): T {
    const found = within.querySelector<T>(`[data-testid="${testId}"]`);
    if (!found) {
      throw new Error(`Nothing on the page has data-testid="${testId}"`);
    }
    return found;
  }

  function text(testId: string, within: HTMLElement = page): string {
    return (el(testId, within).textContent ?? '').replace(/\s+/g, ' ').trim();
  }

  /** Text of one cell in the results table, for example result('qatar', 'max-total'). */
  function result(programId: string, cellId: string): string {
    return text(cellId, el(`result-row-${programId}`));
  }

  async function click(testId: string): Promise<void> {
    el(testId).click();
    await fixture.whenStable();
  }

  async function type(testId: string, value: string): Promise<void> {
    const input = el<HTMLInputElement>(testId);
    input.value = value;
    input.dispatchEvent(new Event('input', { bubbles: true }));
    await fixture.whenStable();
  }

  async function choose(testId: string, value: string): Promise<void> {
    const select = el<HTMLSelectElement>(testId);
    select.value = value;
    select.dispatchEvent(new Event('change', { bubbles: true }));
    await fixture.whenStable();
  }

  async function setChecked(testId: string, checked: boolean): Promise<void> {
    const box = el<HTMLInputElement>(testId);
    box.checked = checked;
    box.dispatchEvent(new Event('change', { bubbles: true }));
    await fixture.whenStable();
  }

  function resultRowIds(): string[] {
    return Array.from(page.querySelectorAll<HTMLElement>('[data-testid^="result-row-"]')).map(
      (row) => (row.getAttribute('data-testid') ?? '').replace('result-row-', ''),
    );
  }

  it('opens on the results with the example balances', () => {
    expect(page.querySelector('h1')?.textContent).toContain('Points transfer calculator');
    expect(el<HTMLInputElement>('balance-amex').value).toBe('120000');
    expect(el<HTMLInputElement>('balance-wells-fargo').value).toBe('15000');
    expect(text('total-balance')).toBe('370,000');
    expect(text('today')).toBe('Nov 9, 2026');
    expect(all('example-note').length).toBe(1);
    expect(resultRowIds().length).toBe(40);
    expect(resultRowIds().slice(0, 3)).toEqual(['aer-lingus', 'aeromexico', 'aeroplan']);

    expect(result('qatar', 'direct-cards')).toBe('4');
    expect(result('qatar', 'direct-total')).toBe('265,000');
    expect(result('qatar', 'max-total')).toBe('397,000');
    expect(result('qatar', 'added')).toBe('132,000');
    expect(result('qatar', 'routes')).toContain('Chase via British Airways Club');
    expect(result('qatar', 'routes')).toContain('Wells Fargo via British Airways Club');
    expect(result('korean', 'direct-total')).toBe('–');
    expect(result('korean', 'max-total')).toBe('159,063');
    expect(result('flying-blue', 'added')).toBe('–');
    expect(result('flying-blue', 'routes')).toBe('');
  });

  it('recalculates as a balance is typed and remembers it', async () => {
    await type('balance-chase', '0');
    expect(result('qatar', 'max-total')).toBe('280,000');
    expect(text('total-balance')).toBe('280,000');
    expect(all('example-note').length).toBe(0);
    expect(localStorage.getItem(STORAGE_KEY)).toContain('"chase":0');

    await click('clear-balances');
    expect(text('total-balance')).toBe('0');
    expect(el<HTMLInputElement>('balance-amex').value).toBe('');
    expect(result('qatar', 'max-total')).toBe('–');
  });

  it('Chase card setting changes the Hyatt ratio', async () => {
    expect(el<HTMLInputElement>('setting-chase-preferred').checked).toBe(true);
    expect(result('hyatt', 'direct-total')).toBe('97,500');
    await setChecked('setting-chase-reserve', true);
    expect(result('hyatt', 'direct-total')).toBe('120,000');
    expect(store.settings().chaseCard).toBe('reserve');
    await setChecked('setting-chase-preferred', true);
    expect(result('hyatt', 'direct-total')).toBe('97,500');
  });

  it('Citi card setting applies 70% to Citi ratios', async () => {
    expect(el<HTMLInputElement>('setting-citi-premium').checked).toBe(true);
    expect(result('aadvantage', 'direct-total')).toBe('40,000');
    await setChecked('setting-citi-other', true);
    expect(result('aadvantage', 'direct-total')).toBe('28,000');
  });

  it('Count limited-time transfer bonuses can be switched off', async () => {
    expect(el<HTMLInputElement>('setting-count-bonuses').checked).toBe(true);
    expect(result('hilton', 'max-total')).toBe('648,750');
    await setChecked('setting-count-bonuses', false);
    expect(result('hilton', 'max-total')).toBe('615,000');
    expect(result('british-airways', 'direct-total')).toBe('330,000');
  });

  it('Count Marriott and Hyatt block bonuses can be switched off', async () => {
    expect(el<HTMLInputElement>('setting-count-block-bonuses').checked).toBe(true);
    expect(result('united', 'max-total')).toBe('247,875');
    await setChecked('setting-count-block-bonuses', false);
    expect(result('united', 'max-total')).toBe('205,250');
  });

  it('routes that need status start off and can be switched on from Settings', async () => {
    const ids = ['accor>flying-blue', 'united>marriott', 'aeroplan>marriott', 'atmos>marriott'];
    for (const id of ids) {
      expect(el<HTMLInputElement>(`restricted-${id}`).checked, id).toBe(false);
    }
    expect(result('korean', 'max-total')).toBe('159,063');
    await setChecked('restricted-aeroplan>marriott', true);
    expect(result('korean', 'max-total')).toBe('166,875');
    expect(result('marriott', 'max-total')).toBe('394,500');
    expect(store.routeOverrides()).toEqual({ 'aeroplan>marriott': true });
  });

  it('every partner transfer has its own switch', async () => {
    await click('tab-partner-transfers');
    expect(page.querySelectorAll('[data-testid^="route-row-"]').length).toBe(146);
    expect(el<HTMLInputElement>('route-toggle-british-airways>qatar').checked).toBe(true);
    expect(el<HTMLInputElement>('route-toggle-united>marriott').checked).toBe(false);
    expect(text('ratio-used', el('route-row-marriott>united'))).toBe('0.50');
    expect(text('ratio-used', el('route-row-united>marriott'))).toBe('Off');
    expect(el<HTMLButtonElement>('routes-reset').disabled).toBe(true);

    await setChecked('route-toggle-british-airways>qatar', false);
    expect(text('ratio-used', el('route-row-british-airways>qatar'))).toBe('Off');
    expect(text('routes-reset')).toContain('1 changed');

    await click('tab-results');
    expect(result('qatar', 'max-total')).toBe('397,000');
    expect(result('qatar', 'routes')).toContain('Chase via British Airways Club > Iberia Plus');

    await click('tab-partner-transfers');
    await click('routes-reset');
    expect(el<HTMLInputElement>('route-toggle-british-airways>qatar').checked).toBe(true);
    expect(store.routeOverrides()).toEqual({});
  });

  it('lets the user add and remove a card transfer bonus', async () => {
    await click('tab-bonuses');
    expect(page.querySelectorAll('[data-testid^="bonus-row-"]').length).toBe(9);
    expect(text('bonus-status', el('bonus-row-seed-amex-marriott'))).toBe('Active');

    await choose('bonus-card', 'citi');
    expect(el<HTMLSelectElement>('bonus-program').options.length).toBe(20);
    await choose('bonus-program', 'qatar');
    await type('bonus-percent', '50');
    await click('bonus-add');
    expect(all('bonus-error').length).toBe(0);
    const added = el('bonus-row-user-1');
    expect(added.textContent).toContain('Citi');
    expect(added.textContent).toContain('Qatar Privilege Club');
    expect(added.textContent).toContain('50%');
    expect(added.textContent).toContain('No end date');
    expect(text('bonus-status', added)).toBe('Active');
    expect(el<HTMLInputElement>('bonus-percent').value).toBe('');

    await click('tab-results');
    expect(result('qatar', 'direct-total')).toBe('285,000');
    expect(result('qatar', 'max-total')).toBe('417,000');

    await click('tab-bonuses');
    await click('bonus-remove-user-1');
    expect(page.querySelectorAll('[data-testid^="bonus-row-"]').length).toBe(9);
    await click('tab-results');
    expect(result('qatar', 'direct-total')).toBe('265,000');
  });

  it('explains what is wrong with a bonus instead of adding it', async () => {
    await click('tab-bonuses');
    await click('bonus-add');
    expect(text('bonus-error')).toMatch(/percent/i);
    expect(page.querySelectorAll('[data-testid^="bonus-row-"]').length).toBe(9);
    await type('bonus-percent', '25');
    await type('bonus-end', '2026-12-31');
    await click('bonus-add');
    expect(all('bonus-error').length).toBe(0);
    expect(el('bonus-row-user-1').textContent).toContain('Dec 31, 2026');
  });

  it('shows when bonuses have ended or are not being counted, and can restore the built-in list', async () => {
    await click('tab-bonuses');
    await click('bonus-remove-seed-amex-marriott');
    expect(page.querySelectorAll('[data-testid^="bonus-row-"]').length).toBe(8);
    await click('bonus-reset');
    expect(page.querySelectorAll('[data-testid^="bonus-row-"]').length).toBe(9);

    await setChecked('setting-count-bonuses', false);
    expect(text('bonus-status', el('bonus-row-seed-amex-marriott'))).toBe('Not counted');

    store.setToday('2027-01-15');
    await fixture.whenStable();
    expect(text('bonus-status', el('bonus-row-seed-amex-marriott'))).toBe('Ended');
    expect(text('today')).toBe('Jan 15, 2027');
  });

  it('shows the best route for every card and program', async () => {
    await click('tab-best-routes');
    expect(page.querySelectorAll('[data-testid^="best-row-"]').length).toBe(40);
    expect(text('best-united-citi')).toContain('0.375');
    expect(text('best-united-citi')).toContain('via Singapore KrisFlyer > Marriott Bonvoy');
    expect(text('best-qatar-chase')).toContain('1.30');
    expect(text('best-qatar-chase')).toContain('via British Airways Club');
    expect(text('best-qatar-amex')).toContain('1.00');
    expect(text('best-qatar-amex')).toContain('Direct');
    expect(text('best-amtrak-amex')).toContain('No route');
  });

  it('shows the card ratios and what changes them', async () => {
    await click('tab-card-ratios');
    expect(page.querySelectorAll('[data-testid^="ratio-row-"]').length).toBe(40);
    expect(text('ratio-british-airways-chase')).toContain('1.00');
    expect(text('ratio-british-airways-chase')).toContain('1.30 with 30% bonus');
    expect(text('ratio-hyatt-chase')).toBe('0.75');
    expect(text('ratio-hyatt-amex')).toBe('');
    await setChecked('setting-citi-other', true);
    expect(text('ratio-aadvantage-citi')).toContain('1.00');
    expect(text('ratio-aadvantage-citi')).toContain('0.70 on your card');
  });

  it('lists the sources', async () => {
    await click('tab-sources');
    const links = el('sources-table').querySelectorAll('a[href^="https://"]');
    expect(links.length).toBe(25);
  });

  it('filters, searches and sorts the results', async () => {
    await click('filter-other');
    expect(resultRowIds().length).toBe(10);
    expect(resultRowIds()[0]).toBe('marriott');
    await click('filter-airline');
    expect(resultRowIds().length).toBe(30);
    await click('filter-all');

    await type('results-search', 'virgin');
    expect(resultRowIds()).toEqual(['virgin-atlantic', 'virgin-red']);
    await type('results-search', 'zzz');
    expect(resultRowIds()).toEqual([]);
    expect(all('results-empty').length).toBe(1);
    await type('results-search', '');

    await choose('results-sort', 'max');
    expect(resultRowIds()[0]).toBe('hilton');
    await choose('results-sort', 'added');
    expect(resultRowIds().slice(0, 2)).toEqual(['hilton', 'finnair']);
    await choose('results-sort', 'list');
    expect(resultRowIds()[0]).toBe('aer-lingus');
  });

  it('shows the per-card breakdown for a program', async () => {
    expect(all('detail-qatar').length).toBe(0);
    await click('details-qatar');
    const chase = text('detail-qatar-chase');
    expect(chase).toContain('90,000');
    expect(chase).toContain('1.30');
    expect(chase).toContain('via British Airways Club');
    expect(chase).toContain('117,000');
    await click('details-qatar');
    expect(all('detail-qatar').length).toBe(0);
  });

  it('Reset everything asks first, then restores the starting values', async () => {
    await type('balance-amex', '5');
    await setChecked('setting-chase-reserve', true);
    await setChecked('restricted-united>marriott', true);
    await click('reset-all');
    expect(store.balances().amex).toBe(5);
    await click('reset-all-confirm');
    expect(el<HTMLInputElement>('balance-amex').value).toBe('120000');
    expect(el<HTMLInputElement>('setting-chase-preferred').checked).toBe(true);
    expect(el<HTMLInputElement>('restricted-united>marriott').checked).toBe(false);
    expect(result('qatar', 'max-total')).toBe('397,000');
    expect(localStorage.getItem(STORAGE_KEY)).toBeNull();
  });
});
