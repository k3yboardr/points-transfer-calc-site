import { Program } from '../core/models';
import {
  NONE,
  formatCount,
  formatDate,
  formatPercent,
  formatPoints,
  formatRatio,
  programKind,
} from './format';

describe('format', () => {
  it('formats points with thousands separators and shows a dash for nothing', () => {
    expect(formatPoints(397000)).toBe('397,000');
    expect(formatPoints(0)).toBe(NONE);
    expect(formatCount(0)).toBe('0');
    expect(formatCount(1234567)).toBe('1,234,567');
  });

  it('formats ratios with two to three decimals', () => {
    expect(formatRatio(1)).toBe('1.00');
    expect(formatRatio(0.675)).toBe('0.675');
    expect(formatRatio(1 / 3)).toBe('0.333');
    expect(formatRatio(0)).toBe(NONE);
  });

  it('formats percents and dates', () => {
    expect(formatPercent(0.3)).toBe('30%');
    expect(formatPercent(0.125)).toBe('12.5%');
    expect(formatDate('2026-12-10')).toBe('Dec 10, 2026');
    expect(formatDate('2027-01-01')).toBe('Jan 1, 2027');
  });

  it('describes a program the way the spreadsheet did', () => {
    const qatar: Program = {
      id: 'qatar',
      name: 'Qatar Privilege Club',
      type: 'airline',
      group: 'Avios pool',
    };
    const hyatt: Program = { id: 'hyatt', name: 'World of Hyatt', type: 'hotel', group: '' };
    const amtrak: Program = { id: 'amtrak', name: 'Amtrak Guest Rewards', type: 'rail', group: '' };
    expect(programKind(qatar)).toBe('Airline (Avios pool)');
    expect(programKind(hyatt)).toBe('Hotel');
    expect(programKind(amtrak)).toBe('Rail');
  });
});
