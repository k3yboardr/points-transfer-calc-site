import { Component, computed, inject } from '@angular/core';

import { CalculatorStore } from '../core/calculator-store';
import { formatPercent, formatRatio, programKind } from '../shared/format';

@Component({
  selector: 'app-card-ratios-view',
  templateUrl: './card-ratios-view.html',
})
export class CardRatiosView {
  private readonly store = inject(CalculatorStore);

  protected readonly cards = this.store.data.cards;
  protected readonly notes = this.store.data.cardRatioNotes;

  protected readonly rows = computed(() =>
    this.store.result().programs.map((result) => ({
      id: result.program.id,
      name: result.program.name,
      kind: programKind(result.program),
      cells: result.cells.map((cell) => {
        // Compare what the spreadsheet called "standard ratio" with "ratio used in calculations".
        const adjusted = Math.abs(cell.directRatio - cell.baseRatio) > 1e-9;
        return {
          cardId: cell.cardId,
          base: cell.baseRatio > 0 ? formatRatio(cell.baseRatio) : '',
          used: !adjusted
            ? ''
            : cell.bonusPct > 0
              ? `${formatRatio(cell.directRatio)} with ${formatPercent(cell.bonusPct)} bonus`
              : `${formatRatio(cell.directRatio)} on your card`,
          boosted: adjusted && cell.bonusPct > 0,
        };
      }),
    })),
  );
}
