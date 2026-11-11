import { Program } from '../core/models';

// Display formatting. Pure functions so components can call them inside computed() view models.

const WHOLE = new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 });
const RATIO = new Intl.NumberFormat('en-US', {
  minimumFractionDigits: 2,
  maximumFractionDigits: 3,
});
const PERCENT = new Intl.NumberFormat('en-US', { style: 'percent', maximumFractionDigits: 1 });
const DAY = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

/** Shown where there is nothing to show: no route, no points, no bonus. */
export const NONE = '–';

/** 397000 -> '397,000'. Zero and below -> '–'. */
export function formatPoints(value: number): string {
  return value > 0 ? WHOLE.format(value) : NONE;
}

/** 397000 -> '397,000', 0 -> '0'. For places where zero is a real answer. */
export function formatCount(value: number): string {
  return WHOLE.format(value);
}

/** 1 -> '1.00', 0.675 -> '0.675', 1/3 -> '0.333'. Zero -> '–'. */
export function formatRatio(value: number): string {
  return value > 0 ? RATIO.format(value) : NONE;
}

/** 0.3 -> '30%', 0.125 -> '12.5%'. */
export function formatPercent(fraction: number): string {
  return PERCENT.format(fraction);
}

/** '2026-12-10' -> 'Dec 10, 2026'. Built from the date parts so the time zone cannot shift the day. */
export function formatDate(isoDate: string): string {
  const [year, month, day] = isoDate.split('-').map(Number);
  return DAY.format(new Date(year, month - 1, day));
}

/** 'Airline (Avios pool)', 'Hotel', 'Rail': the wording of the spreadsheet's Type column. */
export function programKind(program: Program): string {
  const type = program.type.charAt(0).toUpperCase() + program.type.slice(1);
  return program.group ? `${type} (${program.group})` : type;
}
