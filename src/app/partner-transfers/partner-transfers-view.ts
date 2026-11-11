import { Component, computed, inject, signal } from '@angular/core';

import { CalculatorStore } from '../core/calculator-store';
import { formatCount, formatRatio } from '../shared/format';

@Component({
  selector: 'app-partner-transfers-view',
  templateUrl: './partner-transfers-view.html',
})
export class PartnerTransfersView {
  protected readonly store = inject(CalculatorStore);
  protected readonly query = signal('');
  protected readonly changed = this.store.changedRouteCount;

  protected readonly rows = computed(() => {
    const query = this.query().trim().toLowerCase();
    return this.store
      .result()
      .routes.map(({ route, enabled, ratioUsed }) => {
        const source = this.store.source(route.sourceId);
        return {
          id: route.id,
          from: this.store.programName(route.from),
          to: this.store.programName(route.to),
          ratio: formatRatio(route.ratio),
          block: route.blockBonus
            ? `+${formatCount(route.blockBonus.bonus)} per ${formatCount(route.blockBonus.size)}`
            : '',
          enabled,
          ratioUsed: enabled ? formatRatio(ratioUsed) : 'Off',
          note: route.note,
          sourceLabel: source ? source.label : '',
          sourceUrl: source ? source.url : null,
        };
      })
      .filter((row) => `${row.from} ${row.to}`.toLowerCase().includes(query));
  });
}
