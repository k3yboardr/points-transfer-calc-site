import { Component, inject } from '@angular/core';

import { CalculatorStore } from '../core/calculator-store';
import { formatDate } from '../shared/format';

@Component({
  selector: 'app-sources-view',
  templateUrl: './sources-view.html',
})
export class SourcesView {
  private readonly store = inject(CalculatorStore);

  protected readonly sources = this.store.data.sources;
  protected readonly checked = formatDate(this.store.data.checkedDate);
}
