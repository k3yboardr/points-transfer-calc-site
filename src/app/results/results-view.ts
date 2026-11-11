import { Component, computed, inject, signal } from '@angular/core';

import { CalculatorStore } from '../core/calculator-store';
import { ProgramResult } from '../core/models';
import { formatCount, formatPoints, formatRatio, programKind } from '../shared/format';

type TypeFilter = 'all' | 'airline' | 'other';
type SortKey = 'list' | 'max' | 'added' | 'direct' | 'name';

const SORT_KEYS: readonly SortKey[] = ['list', 'max', 'added', 'direct', 'name'];

function sortValue(result: ProgramResult, key: SortKey): number {
  switch (key) {
    case 'max':
      return result.maxTotal;
    case 'added':
      return result.added;
    case 'direct':
      return result.directTotal;
    default:
      return 0;
  }
}

/**
 * The main table: one row per program, like the spreadsheet's Calculator tab.
 *
 * This file is the pattern for every other view:
 * - inject the store and read everything from it (never import a dataset file);
 * - keep only view state (filter, search text, sort, open rows) in local signals;
 * - build display-ready rows in one computed(), so the template has no logic.
 */
@Component({
  selector: 'app-results-view',
  templateUrl: './results-view.html',
})
export class ResultsView {
  private readonly store = inject(CalculatorStore);

  protected readonly filter = signal<TypeFilter>('all');
  protected readonly query = signal('');
  protected readonly sort = signal<SortKey>('list');
  protected readonly openIds = signal<ReadonlySet<string>>(new Set());

  protected readonly rows = computed(() => {
    const filter = this.filter();
    const query = this.query().trim().toLowerCase();
    const sort = this.sort();
    const openIds = this.openIds();

    const visible = this.store.result().programs.filter((result) => {
      const isAirline = result.program.type === 'airline';
      const typeMatches = filter === 'all' || (filter === 'airline' ? isAirline : !isAirline);
      return typeMatches && result.program.name.toLowerCase().includes(query);
    });
    if (sort === 'name') {
      visible.sort((a, b) => a.program.name.localeCompare(b.program.name));
    } else if (sort !== 'list') {
      // Array.prototype.sort is stable, so ties keep the program list order.
      visible.sort((a, b) => sortValue(b, sort) - sortValue(a, sort));
    }

    return visible.map((result) => {
      const open = openIds.has(result.program.id);
      const cards = result.cells.map((cell) => ({
        id: cell.cardId,
        name: this.store.cardName(cell.cardId),
        balance: formatCount(cell.balance),
        directRatio: formatRatio(cell.directRatio),
        directPoints: formatPoints(cell.directPoints),
        bestRatio: formatRatio(cell.bestRatio),
        route: this.store.pathLabel(cell.path),
        bestPoints: formatPoints(cell.bestPoints),
        adds: cell.addsPoints,
        gain: `+${formatCount(cell.bestPoints - cell.directPoints)}`,
      }));
      return {
        id: result.program.id,
        name: result.program.name,
        kind: programKind(result.program),
        directCards: result.directCardCount,
        direct: formatPoints(result.directTotal),
        max: formatPoints(result.maxTotal),
        added: formatPoints(result.added),
        hasAdded: result.added > 0,
        open,
        toggleLabel: `${open ? 'Hide' : 'Show'} cards for ${result.program.name}`,
        cards,
        // "Partner routes that add points": one chip per card whose best route beats its direct transfer.
        routes: cards.filter((card) => card.adds),
      };
    });
  });

  protected setSort(value: string): void {
    const key = SORT_KEYS.find((candidate) => candidate === value);
    if (key) {
      this.sort.set(key);
    }
  }

  protected toggle(programId: string): void {
    this.openIds.update((current) => {
      const next = new Set(current);
      if (!next.delete(programId)) {
        next.add(programId);
      }
      return next;
    });
  }
}
