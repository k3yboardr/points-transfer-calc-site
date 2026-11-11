import { Component, computed, inject, signal } from '@angular/core';

import { CalculatorStore } from '../core/calculator-store';
import { CardId } from '../core/models';
import { formatDate, formatPercent } from '../shared/format';

@Component({
  selector: 'app-bonuses-view',
  templateUrl: './bonuses-view.html',
})
export class BonusesView {
  protected readonly store = inject(CalculatorStore);
  protected readonly cards = this.store.data.cards;

  // The "add a bonus" form. Plain signals mirror the native inputs; no forms package is used.
  protected readonly cardId = signal<CardId>(this.cards[0].id);
  protected readonly programId = signal(this.firstPartnerId(this.cards[0].id));
  protected readonly percent = signal('');
  protected readonly endDate = signal('');
  protected readonly error = signal<string | null>(null);

  /** Only the programs the chosen card transfers to directly. */
  protected readonly programOptions = computed(() => this.store.directPartners(this.cardId()));

  protected readonly rows = computed(() => {
    const counting = this.store.settings().countBonuses;
    return this.store.bonuses().map((bonus) => {
      const active = this.store.isBonusActive(bonus);
      const source = this.store.source(bonus.sourceId);
      const card = this.store.cardName(bonus.cardId);
      const program = this.store.programName(bonus.programId);
      return {
        id: bonus.id,
        card,
        program,
        removeLabel: `Remove ${card} to ${program} bonus`,
        bonus: formatPercent(bonus.pct),
        lastDay: bonus.endDate === null ? 'No end date' : formatDate(bonus.endDate),
        status: !active ? 'Ended' : counting ? 'Active' : 'Not counted',
        counted: active && counting,
        sourceLabel: source ? source.label : 'Added by you',
        sourceUrl: source ? source.url : null,
      };
    });
  });

  protected chooseCard(value: string): void {
    const card = this.cards.find((candidate) => candidate.id === value);
    if (card) {
      this.cardId.set(card.id);
      this.programId.set(this.firstPartnerId(card.id));
    }
  }

  protected add(event: Event): void {
    // Without a forms package the browser would submit the form and reload the page.
    event.preventDefault();
    const error = this.store.addBonus({
      cardId: this.cardId(),
      programId: this.programId(),
      percent: this.percent(),
      endDate: this.endDate(),
    });
    this.error.set(error);
    if (error === null) {
      this.percent.set('');
      this.endDate.set('');
    }
  }

  private firstPartnerId(cardId: CardId): string {
    return this.store.directPartners(cardId)[0]?.id ?? '';
  }
}
