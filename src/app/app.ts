import { Component, DOCUMENT, computed, inject, signal } from '@angular/core';

import { BalancesPanel } from './balances/balances-panel';
import { BestRoutesView } from './best-routes/best-routes-view';
import { BonusesView } from './bonuses/bonuses-view';
import { CardRatiosView } from './card-ratios/card-ratios-view';
import { CalculatorStore } from './core/calculator-store';
import { PartnerTransfersView } from './partner-transfers/partner-transfers-view';
import { ResultsView } from './results/results-view';
import { SettingsPanel } from './settings/settings-panel';
import { formatDate } from './shared/format';
import { SourcesView } from './sources/sources-view';

type ViewId =
  'results' | 'best-routes' | 'bonuses' | 'partner-transfers' | 'card-ratios' | 'sources';

const VIEWS: readonly { readonly id: ViewId; readonly label: string }[] = [
  { id: 'results', label: 'Results' },
  { id: 'best-routes', label: 'Best routes' },
  { id: 'bonuses', label: 'Transfer bonuses' },
  { id: 'partner-transfers', label: 'Partner transfers' },
  { id: 'card-ratios', label: 'Card ratios' },
  { id: 'sources', label: 'Sources' },
];

@Component({
  selector: 'app-root',
  imports: [
    BalancesPanel,
    BestRoutesView,
    BonusesView,
    CardRatiosView,
    PartnerTransfersView,
    ResultsView,
    SettingsPanel,
    SourcesView,
  ],
  templateUrl: './app.html',
  host: { '(document:visibilitychange)': 'onVisibilityChange()' },
})
export class App {
  private readonly document = inject(DOCUMENT);
  private readonly store = inject(CalculatorStore);

  protected readonly views = VIEWS;
  protected readonly view = signal<ViewId>('results');
  protected readonly checked = formatDate(this.store.data.checkedDate);
  protected readonly today = computed(() => formatDate(this.store.today()));

  /** A tab left open overnight picks up the new date when the user comes back to it. */
  protected onVisibilityChange(): void {
    if (this.document.visibilityState === 'visible') {
      this.store.refreshToday();
    }
  }
}
