import { Component, computed, inject } from '@angular/core';

import { CalculatorStore } from '../core/calculator-store';
import { formatRatio } from '../shared/format';

@Component({
  selector: 'app-best-routes-view',
  templateUrl: './best-routes-view.html',
})
export class BestRoutesView {
  private readonly store = inject(CalculatorStore);

  protected readonly cards = this.store.data.cards;

  protected readonly rows = computed(() =>
    this.store.result().programs.map((result) => ({
      id: result.program.id,
      name: result.program.name,
      cells: result.cells.map((cell) => ({
        cardId: cell.cardId,
        ratio: formatRatio(cell.bestRatio),
        route: this.store.pathLabel(cell.path),
        viaPartner: cell.path !== null && cell.path.length > 0,
        none: cell.path === null,
      })),
    })),
  );
}
