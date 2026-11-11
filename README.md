# Points transfer calculator

A website that shows how many of your transferable credit card points could reach each airline and
hotel program: sent directly from the card, or through partner-to-partner moves such as
Chase to British Airways to Qatar. It is the website version of the "Transferable Points Transfer
Calculator" spreadsheet and uses the same formulas.

The site is static: there is no server and no account. Balances, settings and bonuses you enter
are saved in your own browser (localStorage) and are never sent anywhere.

## What you can change on the page

- Your points for Amex, Chase, Citi, Capital One, Bilt and Wells Fargo.
- Chase card (Sapphire Reserve, or Sapphire Preferred or Ink) and Citi card (Strata Premier or
  Strata Elite, or another Citi card).
- Whether limited-time transfer bonuses count, and whether the Marriott and Hyatt block bonuses count.
- Card transfer bonuses: add your own (card, program, percent, optional last day), remove any.
- Every partner-to-partner transfer has an on/off switch. Routes that need elite status or a
  specific card start off.

## Run it on your computer

Requires Node.js 22.22.3 or newer in the 22 line, 24.15 or newer in the 24 line, or 26 and up.

```bash
npm install
npx ng serve            # then open http://localhost:4200
```

Add `?today=2026-11-09` to the address to see the page as it was on a given date (bonuses that had
not ended yet count, and so on).

## Check it

```bash
npx ng test --watch=false        # unit and page tests
npx ng build --base-href ./      # production build in dist/points-transfer-calculator/browser
```

## Publish it for free with GitHub Pages

1. Create a **public** repository on GitHub and push this folder to its `main` branch.
2. In the repository: Settings > Pages > Build and deployment > Source: **GitHub Actions**.
3. Every push to `main` now runs `.github/workflows/deploy.yml`, which tests, builds and publishes
   the site. If the first run happened before step 2, open the Actions tab and re-run it.
4. The address is `https://<your-user>.github.io/<repository>/` (also shown on the Pages settings
   page and in the workflow run).

## Keep the numbers current

Transfer ratios and bonuses change. All built-in data lives in `src/app/core/datasets/`.

To change a ratio, a partner transfer, a source or the built-in bonus list:

1. Copy the newest `dataset-YYYY-MM-DD.ts` to a new file named for today's date.
2. In the copy, rename the exported constant, set `version` and `checkedDate` to that date, and
   make the changes. Keep the order of the partner transfers: ties between routes are broken by it.
3. Point `src/app/core/datasets/current.ts` at the new file.
4. Run the tests and push.

Do not edit `dataset-2026-11-09.ts`. The tests compare the calculation with the original
spreadsheet using that file, which is why updating the live data never breaks them.

Visitors keep their balances, settings and their own bonuses when the data changes. The built-in
bonus list is replaced by the new one.

## How it is organised

| Path                                           | What it is                                                                      |
| ---------------------------------------------- | ------------------------------------------------------------------------------- |
| `src/app/core/datasets/`                       | The built-in data, one file per date, and `current.ts` which picks the live one |
| `src/app/core/engine.ts`                       | The calculation, ported from the spreadsheet formulas. Pure functions           |
| `src/app/core/calculator-store.ts`             | Everything the user can change, the result, and saving to the browser           |
| `src/app/core/*.spec.ts`, `engine.fixtures.ts` | Tests, including expected results taken from the spreadsheet                    |
| `src/app/` (other folders)                     | The page: one folder per panel or view                                          |
| `src/styles.css`                               | Colours, fonts and the shared table, form and button styles                     |
| `PLAN.md`                                      | The build plan this project was made from, including how the calculation works  |

Not affiliated with any bank, airline or hotel. Transfers cannot be undone: confirm the ratio in
your card's own transfer page before moving points.
