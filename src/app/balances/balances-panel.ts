import { Component, computed, inject } from '@angular/core';

import { CalculatorStore } from '../core/calculator-store';
import { formatCount } from '../shared/format';

@Component({
  selector: 'app-balances-panel',
  templateUrl: './balances-panel.html',
})
export class BalancesPanel {
  protected readonly store = inject(CalculatorStore);

  protected readonly fields = computed(() => {
    const balances = this.store.balances();
    return this.store.data.cards.map((card) => {
      const balance = balances[card.id];
      return {
        id: card.id,
        label: card.name,
        // An empty box (with a 0 placeholder) is easier to type into than a box holding "0".
        value: balance === 0 ? '' : String(balance),
        echo: balance === 0 ? 'No points' : `${formatCount(balance)} points`,
      };
    });
  });

  protected readonly total = computed(() => formatCount(this.store.totalBalance()));

  /** 'Amex Membership Rewards, Chase Ultimate Rewards, ... and Wells Fargo Rewards'. */
  protected readonly currencies = new Intl.ListFormat('en-US', { type: 'conjunction' }).format(
    this.store.data.cards.map((card) => card.fullName),
  );
}
