import { Component, computed, inject, signal } from '@angular/core';

import { CalculatorStore } from '../core/calculator-store';

@Component({
  selector: 'app-settings-panel',
  templateUrl: './settings-panel.html',
})
export class SettingsPanel {
  protected readonly store = inject(CalculatorStore);
  protected readonly settings = this.store.settings;
  protected readonly confirmingReset = signal(false);

  /** Routes that stay off unless the user qualifies: the ones with defaultOn = false. */
  protected readonly restrictedRoutes = computed(() =>
    this.store
      .result()
      .routes.filter((item) => !item.route.defaultOn)
      .map((item) => ({
        id: item.route.id,
        enabled: item.enabled,
        label: `${this.store.programName(item.route.from)} to ${this.store.programName(item.route.to)}`,
        note: item.route.note,
      })),
  );

  protected resetEverything(): void {
    this.store.resetAll();
    this.confirmingReset.set(false);
  }
}
