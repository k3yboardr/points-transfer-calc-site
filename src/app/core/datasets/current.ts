// The data the live site uses.
//
// To change a ratio, a partner transfer, a source or the built-in bonuses:
//   1. Copy the newest dataset-YYYY-MM-DD.ts in this folder to a new file named for today's date.
//   2. In the copy, rename the exported constant to match the new date, set `version` and
//      `checkedDate` to that date, and make your changes. Reword the comment at the top of the
//      copy too: only the 2026-11-09 file is the test baseline.
//   3. Point the line below at the new file.
//
// Leave dataset-2026-11-09.ts exactly as it is. The tests use it as a fixed baseline, which is
// why changing the live data never breaks them.
export { DATASET_2026_11_09 as CURRENT_DATASET } from './dataset-2026-11-09';
