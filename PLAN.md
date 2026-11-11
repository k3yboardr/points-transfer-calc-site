# Points transfer calculator: build plan

This file is a complete plan for turning the Google Sheet "Transferable Points Transfer Calculator" into a website: Angular 22 and TypeScript, fully static (no server), hosted free on GitHub Pages.

It has two parts.

- **Part A (lines 1 to 476)** is the plan: what gets built, the steps, the checks, and how the spreadsheet formulas map to code.
- **Part B (the rest)** is the finished source code for all 36 project files. One command in step 3 copies it into place. Nobody needs to read it.

The code in Part B was built and checked on 2026-11-11 with Angular 22.2.5, Angular CLI 22.2.6, TypeScript 6.0.3, Vitest 5.1.0 and Node 22.23.4:

- 63 automated tests pass. They include the calculation compared, program by program and card by card, with expected results in four scenarios. The expected results come from a separate re-implementation of the sheet's formulas, and the default scenario was also checked cell by cell against the live sheet.
- The production build succeeds with no warnings (about 183 kB before compression).
- The built site was driven in a real browser from a sub-path, the way GitHub Pages serves it, at desktop and phone widths: typing, every toggle, adding a bonus, reload, reset.
- An accessibility scan (axe, WCAG A and AA rules plus best practices) found no violations on any of the six views.

## How to use this file (for the person)

1. Create a new folder, or clone a new GitHub repository, and save this file in it as `PLAN.md`. Save the file itself. Do not paste its text into the chat: it is about 5,300 lines long because it carries the code.
2. Open Claude Code in that folder with Sonnet 5.5 and send this message:

   > Follow PLAN.md. Read lines 1 to 476 first, then do the steps in section 3 in order.

3. When it reports that it is done, follow section 9 to put the site on GitHub Pages.

## Instructions for the agent

You are implementing this plan in the folder that contains this file.

- Read all of Part A (lines 1 to 476) before running anything. Do not read Part B. It is long, and step 3 copies it for you.
- Section 2 is the rules. Section 3 is the work: eight steps, each with the exact command and the result to expect. Section 4 is what to do when a result differs.
- Sections 5 to 8 are reference. They explain the calculation and the layout so that you, or anyone later, can change the site safely. You do not need them to finish section 3.
- The work is assembly and verification. The files are already written and tested. Your job is to get them into a working Angular project on this machine, prove that the tests and the build pass here, commit, and report.

## 1. What gets built

A one-page website that answers one question: if I sent all my transferable card points to one airline or hotel program, how many points would arrive, sent directly or through partner-to-partner moves?

On the page:

- **Your points.** Six number boxes: Amex, Chase, Citi, Capital One, Bilt, Wells Fargo.
- **Settings.** Every toggle from the sheet (table below).
- **Six views**, switched with tabs:
  - **Results**: one row per program (40 programs). Direct total, max with partner moves, points added by partner moves, and the routes that add them. Filter, search, sort, and a per-card breakdown for each row.
  - **Best routes**: for every program and card, the best ratio and the route that gives it.
  - **Transfer bonuses**: the list of card transfer bonuses. Visitors add their own (card, program, percent, optional last day) and remove any.
  - **Partner transfers**: all 146 program-to-program transfers, each with its own on/off switch.
  - **Card ratios**: the card-to-program ratio table, and what the ratio becomes with the visitor's card type and active bonuses.
  - **Sources**: where the numbers come from.

Everything a visitor enters is saved in their own browser (localStorage). Nothing is sent anywhere. There is no account and no server.

### Every toggle in the sheet, and where it is on the site

| In the sheet | On the site | Starts as |
| --- | --- | --- |
| Chase card: Reserve / Preferred or Ink | Settings, "Chase card": Sapphire Reserve / Sapphire Preferred or Ink | Preferred or Ink |
| Citi card: Premium / Other | Settings, "Citi card": Strata Premier or Strata Elite / Other Citi card | Strata Premier or Strata Elite |
| Count limited-time transfer bonuses: Yes / No | Settings, checkbox with the same name | On |
| Count Marriott and Hyatt block bonuses: Yes / No | Settings, checkbox with the same name | On |
| "Use?" Yes / No on each row of the Partner Transfers tab | Partner transfers view: a checkbox on each of the 146 routes, plus "Reset switches" | 142 on, 4 off |
| The 4 routes that are "No" because they need status or a specific card | Also listed in Settings, so they are easy to find | Off |
| Rows you type into the Transfer Bonuses tab | Transfer bonuses view: add, remove, bring back the built-in list | 9 built-in bonuses |
| Automatic: a bonus stops counting after its end date | Same, measured against the visitor's own date | |
| Automatic: Bilt to Hyatt is 1:1 through Dec 31, 2026, then 4:3 | Same | |

The site starts from the sheet's original defaults and made-up example balances, not from anyone's real numbers, because the repository is public. A visitor sets their own values once and the browser remembers them.

### Decided, and not part of this build

Do not add these. Each was considered and left out to keep the site simple and static.

- Editing card ratios or partner transfer ratios on the page. They change by editing a data file (section 8).
- Adding new partner routes on the page.
- Accounts, sync between devices, share links.
- Dark mode. A router. A UI component library. A forms package.

## 2. Rules for the agent

1. Do the steps in order. Each step ends with a check. If a check fails, do not go on: use section 4.
2. The files in Part B are final. Do not rewrite, reformat, rename or "improve" them, and do not retype them: step 3 copies them exactly. If a check fails and you have confirmed that the cause is in a provided file, make the smallest change that fixes it and say exactly what you changed in your final report.
3. Stay on Angular 22. Do not upgrade or downgrade Angular, TypeScript or Vitest. The only packages added to the generated project are the two font packages in step 2.
4. Do not push, do not create a GitHub repository, and do not publish anything unless the person asked for that in the chat. Section 9 is for the person.
5. Never put real point balances in any file.
6. Stop and ask the person when: the folder already contains another project (step 1), you cannot get a supported Node version (step 1), or a check still fails after you have tried section 4.

## 3. Steps

Run every command from the folder that contains `PLAN.md`.

### Step 1. Check the tools and the folder

```bash
node -e 'const [a,b,c]=process.versions.node.split(".").map(Number);const ok=(a===22&&(b>22||(b===22&&c>=3)))||(a===24&&b>=15)||a>=26;console.log("Node",process.versions.node,ok?"OK":"NOT SUPPORTED")'
npm -v
git --version
ls -A
```

Check:

- The first line ends with `OK`. Angular 22 needs Node 22.22.3 or newer in the 22 line, 24.15.0 or newer in the 24 line, or 26 and up. If it says `NOT SUPPORTED`, go to "Node is not supported" in section 4.
- `ls -A` shows `PLAN.md` and at most a few repository files such as `.git`, `.gitignore`, `README.md`, `LICENSE`, `.claude`. If it shows `angular.json`, step 2 was already done: skip to step 3. If it shows anything else that looks like a project (`package.json`, `src`, and so on), stop and ask the person.

### Step 2. Create the Angular project

```bash
npx -y @angular/cli@22 new points-transfer-calculator --directory ng-scaffold --style=css --ssr=false --routing=false --zoneless --test-runner=vitest --ai-config=claude-code --package-manager=npm --skip-git --skip-install --defaults --interactive=false
cp -a ng-scaffold/. . && rm -rf ng-scaffold
npm install @fontsource/ibm-plex-sans@5 @fontsource/ibm-plex-sans-condensed@5
npx ng analytics disable
```

What this does, line by line:

1. Generates a new Angular 22 project into a temporary subfolder. A subfolder is needed because the generator refuses to write into a folder that already has a `README.md`. The project name must stay `points-transfer-calculator`: the build output folder and the deploy workflow use it.
2. Moves the generated project up into this folder. The generated `README.md` and `.gitignore` replace any that were here. `PLAN.md`, `.git` and `LICENSE` are untouched.
3. Installs everything the project needs, plus the two font packages the stylesheet imports. This takes about a minute.
4. Turns off the Angular CLI's usage-data question for this project, so no later command stops to ask.

Check:

```bash
ls angular.json package.json src/main.ts src/app/app.config.ts CLAUDE.md node_modules/@fontsource/ibm-plex-sans/latin-400.css
npx ng version
```

All six paths are listed, and `ng version` reports Angular CLI 22.x and Angular 22.x.

### Step 3. Copy in the project files

```bash
node -e 'const s=require("fs").readFileSync("PLAN.md","utf8").replace(/\r\n/g,"\n");const m=s.match(/<!-- EXTRACTOR -->\n+\x60{3,}[^\n]*\n([\s\S]*?)\n\x60{3,}\n/);new Function("require",m[1])(require)'
```

Copy that command exactly. It finds a short script near the top of Part B and runs it. The script writes every file in Part B to its place, adds a "Project notes" section to the generated `CLAUDE.md`, and deletes two generated files that are no longer used (`src/app/app.css` and `public/favicon.ico`). It is safe to run again.

Check: the output is

```text
36 files written, 1 appended, 2 scaffold files removed.
All checksums match.
```

On a second run the last count is 0, because the two generated files are already gone. If your shell cannot run the command, or the output differs in any other way, see "The copy command" in section 4.

### Step 4. Run the tests

```bash
npx ng test --watch=false
```

Check: the summary says `Test Files  4 passed (4)` and `Tests  63 passed (63)`.

What the four files prove:

| Test file | Tests | What it proves |
| --- | --- | --- |
| `src/app/core/engine.spec.ts` | 28 | The calculation gives the spreadsheet's numbers in four scenarios, and every setting, route switch and bonus rule does what the sheet did |
| `src/app/core/calculator-store.spec.ts` | 14 | State changes, validation of a bonus someone types in, saving and loading, damaged saved data |
| `src/app/shared/format.spec.ts` | 4 | Number, ratio, percent and date formatting |
| `src/app/app.spec.ts` | 17 | The page itself: every toggle, adding and removing a bonus, every view, filter, search, sort, reset |

The tests run on a fixed copy of the data with the date pinned to 2026-11-09, so they pass on any day.

### Step 5. Build the site

```bash
npx ng build --base-href ./
grep -c '<base href="./">' dist/points-transfer-calculator/browser/index.html
```

Check:

- The build ends with `Application bundle generation complete` and prints no warning and no error. The initial total is about 183 kB.
- `grep` prints `1`.

`--base-href ./` makes every address in the built page relative, so the same build works at `https://<user>.github.io/<repository>/` without knowing the repository name.

### Step 6. Look at the page (only if you can open a browser)

Skip this step if you have no browser tool. The page tests in step 4 make the same checks.

```bash
npx ng serve
```

Open `http://localhost:4200/?today=2026-11-09`. The `today` part pins the date so the built-in bonuses count. Check:

- The Qatar Privilege Club row reads: direct total 265,000, max 397,000, added 132,000, with routes "Chase via British Airways Club" and "Wells Fargo via British Airways Club".
- Untick "Count limited-time transfer bonuses": Hilton Honors max goes from 648,750 to 615,000. Tick it again.
- Transfer bonuses tab: add Citi, Qatar Privilege Club, 50. Back on Results, Qatar max is 417,000.
- Reload the page: the bonus is still there. "Reset everything" in Settings brings back the starting values.

Stop the server when you are done.

### Step 7. Commit

```bash
git rev-parse --is-inside-work-tree 2>/dev/null || git init -b main
git add -A
git commit -m "Build the points transfer calculator from PLAN.md"
git branch --show-current
```

Check: the commit succeeds and `git status --short` prints nothing. `node_modules`, `dist` and `.angular` are ignored by the generated `.gitignore`.

If the commit fails because git has no name or email configured, do not invent one: tell the person. If the branch is not `main`, tell the person: the deploy workflow runs on pushes to `main`.

### Step 8. Report

Tell the person, briefly:

- That the site is built, and the results of steps 4 and 5 (test counts, build size).
- Anything that differed from this plan, and any provided file you had to change, with the reason.
- The four steps in section 9, so they can publish it.
- That the page starts with example balances and the sheet's original settings, and that they can try it now with `npx ng serve`.

### Done means

- [ ] `npx ng test --watch=false` passes: 4 files, 63 tests.
- [ ] `npx ng build --base-href ./` finishes without warnings or errors.
- [ ] The step 3 output said "All checksums match", or the report explains why not.
- [ ] Everything is committed. Nothing was pushed unless the person asked.
- [ ] The person has the publishing steps.

## 4. When a check fails

**Node is not supported (step 1).** Install Node 24 with whichever version manager this machine has, then run step 1 again. Try them in this order: `nvm` (`source ~/.nvm/nvm.sh && nvm install 24 && nvm use 24`), `fnm` (`fnm install 24 && fnm use 24`), `volta` (`volta install node@24`), `mise` (`mise use -g node@24`), Homebrew (`brew install node@24`). A version manager usually has to be activated again in every new shell, so put the same activation in front of later commands, for example `source ~/.nvm/nvm.sh && nvm use 24 && npx ng test --watch=false`. If none of these exists, stop and ask the person to install Node 24 or newer from nodejs.org. Do not make Angular older to fit an old Node.

**The generator says "A merge conflicted on path" (step 2).** It was pointed at a folder that already has files. Use the command exactly as written: it generates into `ng-scaffold` and then moves the result.

**The generator says `ng-scaffold` already exists (step 2).** An earlier attempt stopped halfway. Delete the `ng-scaffold` folder and run step 2 again.

**The generator says the command is not available inside a workspace (step 2).** There is already an `angular.json` here or in a parent folder. If it is here, step 2 is done. If it is in a parent folder, this folder is inside another Angular project: stop and ask the person.

**The copy command (step 3).**

- `TypeError: Cannot read properties of null`: the command did not find the script. Check that the file is named `PLAN.md`, that you are in its folder, and that you copied the command exactly, including the `\x60` parts.
- Your shell cannot run it (for example PowerShell changes the quotes): open `PLAN.md` at the line `<!-- EXTRACTOR -->` just below the "Part B" heading, save the code block that follows it as `extract.cjs`, run `node extract.cjs`, then delete `extract.cjs`.
- `PROBLEM: expected 37 blocks`: `PLAN.md` is incomplete or was reformatted. Ask the person for a fresh copy of the file.
- `WARNING: ... Checksum differs`: something changed `PLAN.md` after it was written, most likely an editor that formats Markdown on save. The files were still written. Carry on to step 4. If the tests and the build pass, nothing is wrong: mention the warning in your report.

**A test fails (step 4).** With unchanged files this should not happen, so look for what is different on this machine before touching any code.

1. Run step 3 again and read its output.
2. Run `npx ng version`. Angular must be 22.x.
3. Read the failure. `engine.spec.ts` and `calculator-store.spec.ts` do not depend on the browser, the clock or the time zone. If one of them fails, the files or the tool versions are not what this plan expects.
4. Do not edit `engine.fixtures.ts` or `dataset-2026-11-09.ts` to make a test pass. Those two files are the record of what the spreadsheet's formulas give.

**The build cannot resolve `@fontsource/...` (step 5).** The `npm install` line of step 2 did not run. Run it.

**The build prints a budget warning (step 5).** Not expected: the limits are 500 kB for the page and 4 kB for a component stylesheet, and components have no stylesheets. Check that nothing extra was installed or added.

**`npx ng serve` says port 4200 is in use (step 6).** Run `npx ng serve --port 4300` and use that port in the address.

## 5. How the spreadsheet became code

This section is the specification of the calculation. The code is `src/app/core/engine.ts`. The tests in `engine.spec.ts` hold it to the numbers the spreadsheet's formulas give.

### The words

- **Card points**: Amex Membership Rewards, Chase Ultimate Rewards, Citi ThankYou, Capital One Miles, Bilt Rewards, Wells Fargo Rewards.
- **Program**: an airline, hotel or rail loyalty program. There are 40.
- **Ratio**: points received for 1 point sent. 1 means 1:1. 0.75 means 4 sent, 3 received. 0 means the transfer does not exist.
- **Direct transfer**: card to program.
- **Partner move**: program to program, for example British Airways Avios to Qatar Avios, or Marriott points to United miles. There are 146.
- **Route**: a direct transfer followed by zero, one or two partner moves.

### The four formulas

**1. Direct ratio** (the sheet's `RatioUsed` block), for each card and program:

```text
direct = base x multiplier x (1 + bonus)
```

- `base` is the Card Ratios table. A blank cell is 0. Two cells are rules, not numbers: Chase to Hyatt is 1 with a Sapphire Reserve card and 0.75 otherwise, and Bilt to Hyatt is 1 before 2027-01-01 and 0.75 from that day on.
- `multiplier` is 0.7 for Citi when the Citi card setting is "Other Citi card". Otherwise it is 1.
- `bonus` is 0 when "Count limited-time transfer bonuses" is off. When it is on, it is the sum of the bonus fractions (30% is 0.3) of every bonus for that card and program whose last day is today or later. A bonus with no last day always counts. Two bonuses for the same card and program add up.

Code: `baseCardRatio`, `cardMultiplier`, `activeBonusPct`.

**2. Ratio used for a partner move** (the sheet's "Ratio used" column):

```text
used = 0                                      when the route's switch is off
used = ratio + bonus per block / block size   when block bonuses count and the route has one
used = ratio                                  otherwise
```

Example: Marriott to United is 3:1 with 10,000 bonus miles per 60,000 points, so `1/3 + 10000/60000 = 0.5`. Code: `routeRatioUsed`.

**3. Best ratio with up to two partner moves** (the sheet's `OneMoveRatio` and `BestRatio` blocks), for each card:

```text
pass 0:  best[p] = direct[p]                                for every program p
pass 1:  best[p] = max( best[p], best_before[f] x used )    over every route f -> p that is on
pass 2:  the same again, reading the results of pass 1
```

- Each pass reads only the pass before it. That is what limits a route to two partner moves (`MAX_PARTNER_MOVES = 2`).
- A longer route replaces a shorter one only when it is better by more than `1e-9`. Equal is not better, so a direct transfer is never replaced by a detour with the same ratio.
- When two routes tie, the one listed first in the partner transfer list wins. The order of that list matters and must be kept.
- The route is remembered as the list of programs passed through: `[]` is direct, `['british-airways']` is card to British Airways to the program, `['krisflyer', 'marriott']` is two moves. When the best ratio is 0 the route is `null`: the card cannot reach the program.

Code: `bestReach`.

**4. Points** (the sheet's Calculator tab), for each program:

```text
direct points (per card) = round( direct x balance )
best points (per card)   = round( best x balance )
Direct total             = sum of direct points
Max with partner moves   = sum of best points
Added by partner moves   = Max - Direct total
Your cards that transfer directly = number of cards where direct x balance > 0
Partner routes that add points    = every card whose best points > direct points
```

Each row assumes every card's whole balance goes to that one program. Rows are alternatives. They cannot be added together, and the page says so.

Code: `compute`.

### Worked example (example balances, default settings, 2026-11-09)

Qatar Privilege Club. Balances: Amex 120,000, Chase 90,000, Citi 40,000, Capital One 75,000, Bilt 30,000, Wells Fargo 15,000.

- Amex, Citi, Capital One and Bilt transfer to Qatar directly at 1:1: 120,000 + 40,000 + 75,000 + 30,000 = **265,000 direct**.
- Chase does not transfer to Qatar. It transfers to British Airways at 1:1 with a 30% bonus (1.3), and Avios move from British Airways to Qatar at 1:1. So 90,000 x 1.3 = 117,000.
- Wells Fargo does the same without a bonus: 15,000.
- **Max 397,000. Added 132,000.** Routes: "Chase via British Airways Club", "Wells Fargo via British Airways Club".

A two-move route: Citi to United. Citi to Singapore KrisFlyer 1:1, KrisFlyer to Marriott 4:3 (0.75), Marriott to United 0.5. So 1 x 0.75 x 0.5 = **0.375**, shown as "via Singapore KrisFlyer > Marriott Bonvoy".

More numbers the tests hold fixed: Hilton max 648,750 (615,000 with bonuses off), United max 247,875 (205,250 with block bonuses off), Hyatt direct 97,500 (120,000 with Sapphire Reserve), Korean Air direct 0 and max 159,063.

### Where each part of the sheet went

| Sheet | Website |
| --- | --- |
| Calculator tab, yellow balance cells | `CalculatorStore.balances`, the "Your points" panel |
| Calculator tab, Settings rows | `Settings` in `models.ts`, the Settings panel |
| Calculator tab, result rows | `ProgramResult`, the Results view |
| Best Routes tab | `CardCell.bestRatio` and `CardCell.path`, the Best routes view |
| Card Ratios tab | `cardRatios`, `chaseHyattRatio`, `biltHyattSwitch`, `citiOtherMultiplier` in the dataset, the Card ratios view |
| Partner Transfers tab | `partnerTransfers` in the dataset, `routeOverrides` in the store, the Partner transfers view |
| Transfer Bonuses tab | `builtInBonuses` in the dataset, `bonuses` in the store, the Transfer bonuses view |
| Route Calc tab (hidden working) | `engine.ts` |
| Sources tab | `sources` in the dataset, the Sources view |
| `TODAY()` | `CalculatorStore.today`, the visitor's local date |

### Deliberate differences from the sheet

- A bonus may have no last day. It then counts until someone removes it. In the sheet a bonus without a date never counted.
- The bonus list has no row limit. The sheet had room up to row 30.
- "Partner routes that add points" lists a card only when its route adds at least one whole point. The sheet listed it whenever the ratio was better, even with a balance too small to gain a point.
- A bonus can only be added for a program the card transfers to directly. A bonus on a transfer that does not exist would do nothing.
- The date is the visitor's local date, and it refreshes when they come back to an open tab. Adding `?today=YYYY-MM-DD` to the address pins it, for demos and checks.

## 6. Project layout and conventions

```text
PLAN.md                              this file
README.md                            for people: run, publish, update the data
CLAUDE.md                            generated Angular advice, plus project notes added by step 3
.github/workflows/deploy.yml         test, build and publish to GitHub Pages on every push to main
public/favicon.svg
src/index.html
src/main.ts                          starts the app, exactly as Angular generates it
src/styles.css                       every style of the site (components have no stylesheets)
src/app/app.ts, app.html             page frame: heading, the two input panels, the tabs, the footer
src/app/app.spec.ts                  page tests (find elements by data-testid)
src/app/app.config.ts                app setup, exactly as Angular generates it
src/app/core/models.ts               every type
src/app/core/engine.ts               the calculation: pure functions, no Angular, no browser
src/app/core/engine.fixtures.ts      expected results from the spreadsheet's formulas
src/app/core/engine.spec.ts
src/app/core/calculator-store.ts     all state, validation, saving to the browser
src/app/core/calculator-store.spec.ts
src/app/core/datasets/dataset-2026-11-09.ts   the built-in data, and the fixed baseline for tests
src/app/core/datasets/current.ts     one line: which dataset the live site uses
src/app/shared/format.ts             number, ratio, percent and date formatting
src/app/shared/format.spec.ts
src/app/balances/                    "Your points" panel
src/app/settings/                    Settings panel
src/app/results/                     Results view (the pattern for the others)
src/app/best-routes/
src/app/bonuses/                     Transfer bonuses view, with the add form
src/app/partner-transfers/
src/app/card-ratios/
src/app/sources/
```

How the pieces fit:

- **Dataset.** All built-in data for one date is one object of type `Dataset`: cards, programs, card ratios, partner transfers, built-in bonuses, sources, example balances, default settings. The engine and the store are handed a dataset. They never import one. The live site gets the one named in `current.ts`, through the `DATASET` injection token, and components read it as `store.data`. The tests provide `dataset-2026-11-09.ts` for that token, which is why changing the live data cannot break a test.
- **Engine.** `compute(dataset, input)` returns one `ProgramResult` per program and one `RouteResult` per partner transfer. `input` is today's date, the balances, the settings, the bonus list and the route switches.
- **Store.** `CalculatorStore` is the only place state lives. It exposes read-only signals (`balances`, `settings`, `bonuses`, `routeOverrides`, `today`, `result`) and methods that change them (`setBalance`, `clearBalances`, `updateSettings`, `setChaseCard`, `setCitiTier`, `setRouteEnabled`, `resetRoutes`, `addBonus`, `removeBonus`, `resetBonuses`, `resetAll`). `result` is a `computed` that reruns the engine whenever an input changes. Every method saves to localStorage under the key `ptc.state.v1`.
- **Components.** Each one injects the store, builds display-ready rows in a single `computed()`, and has a template with no logic. They keep only view state of their own (search text, sort order, open rows, the bonus form fields). Inputs are native elements: the value is bound with `[value]` or `[checked]`, and changes go to the store through `(input)` or `(change)`.
- **Saved data.** On load the store checks everything it reads. Anything missing or damaged falls back to a safe value. When the dataset version differs from the saved one, the visitor keeps their balances, settings, route switches and their own bonuses, and the built-in bonus list is replaced by the new one.
- **Look.** The palette comes from the sheet and keeps its meaning: navy headings, yellow for anything editable, green for points added by partner moves. The fonts (IBM Plex Sans) are bundled, so the page calls no outside service.

The same conventions are written into `CLAUDE.md` by step 3, so later sessions in this repository follow them.

## 7. The page: what the tests hold fixed

The page tests find elements by `data-testid` only, so wording and layout can change freely while these ids stay. `<card>` is a card id (`amex`, `chase`, `citi`, `capital-one`, `bilt`, `wells-fargo`). `<program>` is a program id such as `qatar` or `british-airways`. `<route>` is `from>to`, such as `british-airways>qatar`.

| Where | `data-testid` | What it is |
| --- | --- | --- |
| Frame | `tab-results`, `tab-best-routes`, `tab-bonuses`, `tab-partner-transfers`, `tab-card-ratios`, `tab-sources` | The tabs |
| Frame | `today` | The date used for bonus end dates |
| Your points | `balance-<card>` | Number box. Empty when the balance is 0 |
| Your points | `total-balance`, `example-note`, `clear-balances` | Sum of the boxes, the note shown while the example balances are untouched, the clear button |
| Settings | `setting-chase-reserve`, `setting-chase-preferred` | Chase card radio buttons |
| Settings | `setting-citi-premium`, `setting-citi-other` | Citi card radio buttons |
| Settings | `setting-count-bonuses`, `setting-count-block-bonuses` | The two checkboxes |
| Settings | `restricted-<route>` | Checkbox for each route that starts off |
| Settings | `reset-all`, `reset-all-confirm` | Reset everything asks first, then resets |
| Results | `filter-all`, `filter-airline`, `filter-other`, `results-search`, `results-sort` | Filter buttons, search box, sort list (`list`, `max`, `added`, `direct`, `name`) |
| Results | `result-row-<program>` containing `direct-cards`, `direct-total`, `max-total`, `added`, `routes` | One row per program |
| Results | `details-<program>`, `detail-<program>`, `detail-<program>-<card>` | Show or hide the per-card breakdown, the breakdown, one card's line |
| Results | `results-empty` | Shown when the search matches nothing |
| Best routes | `best-row-<program>`, `best-<program>-<card>` | Ratio and route for one card and program |
| Transfer bonuses | `bonus-card`, `bonus-program`, `bonus-percent`, `bonus-end`, `bonus-add`, `bonus-error` | The add form and its error message |
| Transfer bonuses | `bonus-row-<id>` containing `bonus-status`, and `bonus-remove-<id>` | One bonus. Status is `Active`, `Ended` or `Not counted`. Built-in ids start with `seed-`, added ones are `user-1`, `user-2`, ... |
| Transfer bonuses | `bonus-reset`, `bonuses-empty` | Bring back the built-in list, and the empty-list message |
| Partner transfers | `routes-search`, `routes-reset` | Search box, and "Reset switches (N changed)" |
| Partner transfers | `route-row-<route>` containing `ratio-used`, and `route-toggle-<route>` | One route. Ratio used shows `Off` when the route is off |
| Card ratios | `ratio-row-<program>`, `ratio-<program>-<card>` | The base ratio, and a second line such as "1.30 with 30% bonus" or "0.70 on your card" when it differs |
| Sources | `sources-table` | One link per source |
| Tables | `results-table`, `best-routes-table`, `bonuses-table`, `routes-table`, `card-ratios-table` | The table of each view |

Rules for a bonus someone adds (enforced by `validateBonusDraft` in the store, shown as a message under the form):

- The card must be one of the six, and the program must be one that card transfers to directly. The program list in the form already shows only those.
- The percent must be a number above 0 and at most 1000. `30` and `30%` both mean 30%.
- The last day is optional. When given it must be a real date.

## 8. Keeping the numbers current

Transfer ratios and bonuses change, and the nine built-in bonuses all end by Dec 10, 2026. After its last day a bonus shows as "Ended" and stops counting. Nothing breaks.

There are two ways to bring in a new bonus:

- **For one visitor:** add it on the Transfer bonuses view. It is saved in that browser.
- **For everyone:** update the built-in data, as below.

To change a ratio, a partner transfer, a source or the built-in bonus list:

1. Copy the newest `src/app/core/datasets/dataset-YYYY-MM-DD.ts` to a new file named for today's date.
2. In the copy: rename the exported constant to match the date, set `version` and `checkedDate` to that date, and make the changes. Keep the order of `partnerTransfers`: ties are broken by it. Reword the comment at the top of the copy, because only the 2026-11-09 file is the test baseline.
3. Point `src/app/core/datasets/current.ts` at the new file.
4. Run `npx ng test --watch=false`, commit and push. The site redeploys itself.

Leave `dataset-2026-11-09.ts` and `engine.fixtures.ts` exactly as they are. The tests check the current dataset for mistakes (unknown program ids, duplicate ids, missing sources) and run the calculation on it, but the spreadsheet comparison always uses the 2026-11-09 baseline.

This procedure was rehearsed: with a second, changed dataset made current, all tests still passed and the build succeeded.

## 9. Publishing on GitHub Pages (for the person)

GitHub Pages is free for public repositories.

1. Create a **public** repository on GitHub (skip this if you cloned one in the first place) and push this folder to its `main` branch. You can ask Claude Code to push for you, or run:

   ```bash
   git remote add origin https://github.com/<your-user>/<repository>.git
   git push -u origin main
   ```

2. In the repository on GitHub: Settings, then Pages, then under "Build and deployment" set Source to **GitHub Actions**.
3. Open the Actions tab. The workflow "Deploy to GitHub Pages" runs on every push to `main`: it runs the tests, builds the site and publishes it. If its first run failed because step 2 was not done yet, press "Re-run jobs".
4. The address is `https://<your-user>.github.io/<repository>/`. It is also shown on the Pages settings page and at the end of the workflow run.

After that, every push to `main` updates the site in a minute or two.

# Part B: project files

Everything below is copied into the project by the command in step 3. Do not read it, retype it
or edit it here. To change the site, change the files in the project.

The first block is the script that does the copying.

<!-- EXTRACTOR -->
````text
// Copies every file in Part B of PLAN.md into the project. Run it from the folder that holds
// PLAN.md, with the command in step 3. Safe to run again: it writes the same files.
const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const EXPECTED_BLOCKS = 37;
const STALE_SCAFFOLD_FILES = ['src/app/app.css', 'public/favicon.ico'];

const plan = fs.readFileSync('PLAN.md', 'utf8').replace(/\r\n/g, '\n');
const partB = plan.slice(plan.indexOf('\n# Part B'));
// A block is a comment line "FILE|APPEND path checksum", then a fenced block with the content.
const blocks = /<!-- (FILE|APPEND) (\S+) ([0-9a-f]{12}) -->\n+(`{3,})[^\n]*\n([\s\S]*?)\n\4\n/g;

let written = 0;
let appended = 0;
let removed = 0;
const altered = [];

for (const [, kind, file, checksum, , body] of partB.matchAll(blocks)) {
  if (path.isAbsolute(file) || file.split('/').includes('..')) {
    throw new Error(`Refusing to write outside the project: ${file}`);
  }
  const text = body + '\n';
  if (!crypto.createHash('sha256').update(text).digest('hex').startsWith(checksum)) {
    altered.push(file);
  }
  fs.mkdirSync(path.dirname(file), { recursive: true });
  if (kind === 'FILE') {
    fs.writeFileSync(file, text);
    written++;
  } else {
    // APPEND: add the block to the end of the file once. Its first line is how we recognise it.
    const current = fs.existsSync(file) ? fs.readFileSync(file, 'utf8') : '';
    if (!current.includes(text.split('\n')[0])) {
      fs.writeFileSync(file, current.replace(/\s*$/, '') + '\n\n' + text);
    }
    appended++;
  }
}

for (const file of STALE_SCAFFOLD_FILES) {
  if (fs.existsSync(file)) {
    fs.rmSync(file);
    removed++;
  }
}

console.log(`${written} files written, ${appended} appended, ${removed} scaffold files removed.`);
if (written + appended !== EXPECTED_BLOCKS) {
  console.error(`PROBLEM: expected ${EXPECTED_BLOCKS} blocks in Part B but found ${written + appended}.`);
  process.exitCode = 1;
} else if (altered.length > 0) {
  console.error(`WARNING: PLAN.md was changed after it was written. Checksum differs for:`);
  console.error(altered.map((file) => `  ${file}`).join('\n'));
  console.error('The files were still written. If a check fails later, suspect these first.');
} else {
  console.log('All checksums match.');
}
````

## `README.md`

<!-- FILE README.md 63eb1a0b3c90 -->
````text
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
````

## `.github/workflows/deploy.yml`

<!-- FILE .github/workflows/deploy.yml 894b5c29239f -->
````text
name: Deploy to GitHub Pages

# Tests, builds and publishes the site every time main changes.
# One-time setup in the repository: Settings > Pages > Build and deployment > Source: GitHub Actions.

on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v7
      - uses: actions/setup-node@v7
        with:
          node-version: 24
          cache: npm
      - run: npm ci
      - run: npx ng test --watch=false
      # A relative base href lets the same build work at https://<user>.github.io/<repository>/
      # and on a custom domain, without knowing the repository name.
      - run: npx ng build --base-href ./
      - uses: actions/configure-pages@v6
      - uses: actions/upload-pages-artifact@v5
        with:
          path: dist/points-transfer-calculator/browser

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - id: deployment
        uses: actions/deploy-pages@v5
````

## `public/favicon.svg`

<!-- FILE public/favicon.svg 295067b3b86c -->
````text
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32">
  <rect width="32" height="32" rx="6" fill="#1f3864" />
  <g fill="none" stroke-width="2.75" stroke-linecap="round" stroke-linejoin="round">
    <path stroke="#ffffff" d="M7 12h17m-5-5 5 5-5 5" />
    <path stroke="#ffd966" d="M25 21H8m5-5-5 5 5 5" />
  </g>
</svg>
````

## `src/index.html`

<!-- FILE src/index.html 6fc52b7b4115 -->
````text
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <title>Points transfer calculator</title>
    <base href="/" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta
      name="description"
      content="See how many of your transferable card points can reach each airline and hotel program, directly or through partner-to-partner moves."
    />
    <link rel="icon" type="image/svg+xml" href="favicon.svg" />
  </head>
  <body>
    <app-root></app-root>
  </body>
</html>
````

## `src/main.ts`

<!-- FILE src/main.ts ecc610fb7d56 -->
````text
import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { App } from './app/app';

bootstrapApplication(App, appConfig).catch((err) => console.error(err));
````

## `src/styles.css`

<!-- FILE src/styles.css f7596433f3dc -->
````text
/*
  The whole look of the site is in this file. Components have no stylesheets of their own.
  Fonts are bundled with the site (npm packages), so the page never calls a font service.
*/
@import '@fontsource/ibm-plex-sans/latin-400.css';
@import '@fontsource/ibm-plex-sans/latin-500.css';
@import '@fontsource/ibm-plex-sans/latin-600.css';
@import '@fontsource/ibm-plex-sans-condensed/latin-500.css';
@import '@fontsource/ibm-plex-sans-condensed/latin-600.css';

/*
  The palette comes from the spreadsheet this site replaces, and keeps its meaning:
  yellow = something you can edit, green = points added by partner moves, navy = headings.
*/
:root {
  --ink: #14213d;
  --ink-soft: #4a5673;
  --paper: #ffffff;
  --navy: #1f3864;
  --band: #d9e1f2;
  --band-soft: #eef2f9;
  --rule: #b8c2d8;
  --input: #fff2cc;
  --input-edge: #7a6200;
  --gain: #c6efce;
  --gain-ink: #0b5d1e;
  --danger: #a3211b;
  --focus: #b45f06;
  --font-text: 'IBM Plex Sans', system-ui, -apple-system, 'Segoe UI', sans-serif;
  --font-condensed: 'IBM Plex Sans Condensed', 'IBM Plex Sans', system-ui, sans-serif;
}

*,
*::before,
*::after {
  box-sizing: border-box;
}

body {
  margin: 0;
  background: var(--paper);
  color: var(--ink);
  font: 400 1rem/1.5 var(--font-text);
  font-variant-numeric: tabular-nums;
}

h2 {
  margin: 1.25rem 0 0.5rem;
  font: 600 1.3125rem/1.2 var(--font-condensed);
  color: var(--navy);
}

a {
  color: var(--navy);
  text-underline-offset: 0.15em;
}

:focus-visible {
  outline: 3px solid var(--focus);
  outline-offset: 2px;
}

/* Page frame: masthead, the tinted band that holds the inputs, the view switcher, the footer. */
app-root {
  display: block;
  max-width: 76rem;
  margin: 0 auto;
  padding: 1.5rem 1.25rem 3rem;
}

.masthead h1 {
  margin: 0;
  font: 600 2.25rem/1.1 var(--font-condensed);
  color: var(--navy);
}

.lede {
  max-width: 42rem;
  margin: 0.5rem 0 0;
  font-size: 1.125rem;
}

.meta {
  margin: 0.375rem 0 0;
  color: var(--ink-soft);
  font-size: 0.875rem;
}

.inputs {
  margin: 1.5rem 0 0;
  padding: 0.25rem 1.25rem 1.25rem;
  border-top: 3px solid var(--navy);
  background: var(--band-soft);
}

.views {
  display: flex;
  flex-wrap: wrap;
  gap: 0 0.25rem;
  margin: 2rem 0 1.25rem;
  border-bottom: 1px solid var(--rule);
}

.view-tab {
  margin: 0 0 -1px;
  padding: 0.625rem 0.875rem;
  border: 0;
  border-bottom: 3px solid transparent;
  background: none;
  color: var(--ink-soft);
  font: 500 1.0625rem var(--font-condensed);
  cursor: pointer;
}

.view-tab:hover {
  color: var(--ink);
}

.view-tab.is-current {
  border-bottom-color: var(--navy);
  color: var(--navy);
  font-weight: 600;
}

.colophon {
  max-width: 42rem;
  margin: 3rem 0 0;
  padding-top: 1rem;
  border-top: 1px solid var(--rule);
  color: var(--ink-soft);
  font-size: 0.875rem;
}

/* Text helpers */
.note,
.hint,
.kind,
.cell-sub {
  color: var(--ink-soft);
}

.note {
  max-width: 46rem;
  margin: 0 0 0.75rem;
  font-size: 0.9375rem;
}

.hint,
.kind,
.cell-sub {
  display: block;
  font-size: 0.8125rem;
  line-height: 1.35;
}

.error {
  margin: 0.5rem 0;
  color: var(--danger);
  font-weight: 500;
}

.notes {
  max-width: 46rem;
  padding-left: 1.25rem;
  color: var(--ink-soft);
  font-size: 0.9375rem;
}

.gain {
  display: inline-block;
  margin-right: -0.375rem;
  padding: 0 0.375rem;
  border-radius: 3px;
  background: var(--gain);
  color: var(--gain-ink);
  font-weight: 600;
}

.gain-text {
  color: var(--gain-ink);
  font-weight: 600;
}

.muted,
.muted th {
  color: var(--ink-soft);
}

/* Inputs: everything the user can edit is yellow, as in the spreadsheet. */
.input {
  min-height: 2.25rem;
  padding: 0.25rem 0.5rem;
  border: 1px solid var(--input-edge);
  border-radius: 3px;
  background: var(--input);
  color: var(--ink);
  font: inherit;
}

.input-number {
  width: 100%;
  text-align: right;
}

.input-short {
  width: 6rem;
}

input[type='checkbox'],
input[type='radio'] {
  width: 1.0625rem;
  height: 1.0625rem;
  margin: 0;
  accent-color: var(--navy);
}

.field label,
.inline-field,
legend {
  font-weight: 500;
  font-size: 0.9375rem;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
}

.total {
  margin: 0;
  font-weight: 500;
}

.total output {
  font: 600 1.3125rem var(--font-condensed);
}

.inline-field {
  display: flex;
  flex-direction: column;
  gap: 0.125rem;
}

.balance-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(9.5rem, 100%), 1fr));
  gap: 0.75rem 1rem;
}

.settings-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(15rem, 100%), 1fr));
  gap: 0.75rem 1.5rem;
}

.restricted-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(min(24rem, 100%), 1fr));
  gap: 0.25rem 1.5rem;
}

.choice {
  min-width: 0;
  margin: 0;
  padding: 0;
  border: 0;
}

.choice-wide {
  margin-top: 1rem;
}

.option {
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  padding: 0.1875rem 0;
}

.option input {
  flex: none;
  margin-top: 0.2rem;
}

.panel-actions {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  gap: 0.5rem 1rem;
  margin-top: 0.875rem;
}

.panel-actions .note {
  margin: 0;
}

/* Buttons */
.button {
  min-height: 2.25rem;
  padding: 0.25rem 0.875rem;
  border: 1px solid var(--navy);
  border-radius: 3px;
  background: var(--paper);
  color: var(--navy);
  font: 500 0.9375rem var(--font-text);
  cursor: pointer;
}

.button:hover:not(:disabled) {
  background: var(--band);
}

.button:disabled {
  border-color: var(--rule);
  color: var(--ink-soft);
  cursor: default;
}

.button-primary {
  background: var(--navy);
  color: #ffffff;
}

.button-primary:hover:not(:disabled) {
  background: var(--ink);
}

.button-danger {
  border-color: var(--danger);
  color: var(--danger);
}

.link-button {
  padding: 0.125rem 0;
  border: 0;
  background: none;
  color: var(--navy);
  font: inherit;
  text-decoration: underline;
  text-underline-offset: 0.15em;
  cursor: pointer;
}

.segmented {
  display: inline-flex;
  align-self: flex-end;
}

.segmented button {
  min-height: 2.25rem;
  margin-left: -1px;
  padding: 0.25rem 0.75rem;
  border: 1px solid var(--navy);
  background: var(--paper);
  color: var(--navy);
  font: 500 0.9375rem var(--font-text);
  cursor: pointer;
}

.segmented button:first-child {
  margin-left: 0;
  border-radius: 3px 0 0 3px;
}

.segmented button:last-child {
  border-radius: 0 3px 3px 0;
}

.segmented button.is-current {
  background: var(--navy);
  color: #ffffff;
}

.toolbar,
.bonus-form {
  display: flex;
  flex-wrap: wrap;
  align-items: flex-end;
  gap: 0.75rem 1rem;
  margin: 0 0 0.875rem;
}

/*
  Tables: a ledger. Navy header, right-aligned figures, thin rules.
  Every table sits in a .table-wrap so a wide table scrolls sideways instead of the page.
*/
.table-wrap {
  overflow-x: auto;
}

.data-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.9375rem;
}

.data-table th,
.data-table td {
  padding: 0.4375rem 0.625rem;
  border-bottom: 1px solid var(--rule);
  text-align: left;
  vertical-align: top;
}

.data-table thead th {
  border-bottom: 0;
  background: var(--navy);
  color: #ffffff;
  font: 600 0.9375rem/1.25 var(--font-condensed);
  vertical-align: bottom;
}

.data-table tbody th {
  font-weight: 500;
}

.data-table .num {
  text-align: right;
}

.data-table td.num {
  white-space: nowrap;
}

.data-table thead th.num {
  max-width: 7.5rem;
}

.data-table .strong {
  font-weight: 600;
}

.data-table.matrix td {
  min-width: 6.5rem;
}

.data-table .via {
  background: var(--band-soft);
}

.cell-main {
  display: block;
  font-weight: 500;
}

.detail-row > td {
  padding: 0 0 0.75rem 1.5rem;
  background: var(--band-soft);
}

.data-table.nested thead th {
  background: var(--band);
  color: var(--ink);
}

.routes-cell {
  min-width: 20rem;
}

.route-chip {
  display: inline-block;
  margin: 0 0.375rem 0.25rem 0;
  padding: 0.0625rem 0.4375rem;
  border: 1px solid var(--rule);
  border-radius: 3px;
  background: var(--paper);
  font-size: 0.875rem;
}

@media (max-width: 40rem) {
  .data-table th,
  .data-table td {
    padding: 0.375rem 0.5rem;
  }
}
````

## `src/app/core/models.ts`

<!-- FILE src/app/core/models.ts 1d204dd93ee0 -->
````text
// Types shared by the datasets, the calculation engine, the store and the UI.

/** The six transferable card currencies. */
export type CardId = 'amex' | 'chase' | 'citi' | 'capital-one' | 'bilt' | 'wells-fargo';

/** Slug of an airline, hotel or rail program, for example 'british-airways'. */
export type ProgramId = string;

export type ProgramType = 'airline' | 'hotel' | 'rail';

export interface Card {
  readonly id: CardId;
  /** Short name used in table headers, for example 'Capital One'. */
  readonly name: string;
  /** Currency name, for example 'Capital One Miles'. */
  readonly fullName: string;
}

export interface Program {
  readonly id: ProgramId;
  readonly name: string;
  readonly type: ProgramType;
  /** Alliance or shared-currency group for airlines ('Avios pool', 'Star Alliance', ...). Empty otherwise. */
  readonly group: string;
}

/** Extra points per full block moved, for example 5,000 bonus miles per 60,000 Marriott points. */
export interface BlockBonus {
  readonly bonus: number;
  readonly size: number;
}

/** A transfer from one airline or hotel program to another (a "partner move"). */
export interface PartnerTransfer {
  /** `${from}>${to}`. Unique. */
  readonly id: string;
  readonly from: ProgramId;
  readonly to: ProgramId;
  /** Points received per 1 point sent, before any block bonus. */
  readonly ratio: number;
  readonly blockBonus: BlockBonus | null;
  /** false for routes that need elite status or a specific card. The user can switch any route on or off. */
  readonly defaultOn: boolean;
  readonly note: string;
  readonly sourceId: string;
}

/** A limited-time bonus on transfers from a card currency to one of its direct partners. */
export interface Bonus {
  readonly id: string;
  readonly cardId: CardId;
  readonly programId: ProgramId;
  /** Fraction, not percent: 0.3 means 30% extra. */
  readonly pct: number;
  /** Last day the bonus applies, as YYYY-MM-DD. null means it never ends. */
  readonly endDate: string | null;
  /** Key into SOURCES, or '' for bonuses the user added. */
  readonly sourceId: string;
  /** true for bonuses that ship with the site, false for bonuses the user added. */
  readonly builtIn: boolean;
}

export interface Source {
  readonly id: string;
  readonly label: string;
  readonly url: string;
  readonly usedFor: string;
}

export type ChaseCard = 'reserve' | 'preferred';
export type CitiTier = 'premium' | 'other';

/** The four switches from the spreadsheet's Settings block. */
export interface Settings {
  /** 'reserve' = Sapphire Reserve cards (Hyatt 1:1). 'preferred' = Sapphire Preferred or Ink (Hyatt 4:3). */
  readonly chaseCard: ChaseCard;
  /** 'premium' = Strata Premier or Strata Elite (full ratios). 'other' = any other Citi card (70%). */
  readonly citiTier: CitiTier;
  /** Count limited-time card transfer bonuses that have not ended. */
  readonly countBonuses: boolean;
  /** Count the Marriott and Hyatt bonuses for moving a full block of points. */
  readonly countBlockBonuses: boolean;
}

export type Balances = Readonly<Record<CardId, number>>;

/**
 * All the built-in data for one point in time: the website's copy of the spreadsheet's data tabs.
 * Datasets live in core/datasets. The engine and the store never import one directly; they are
 * handed one, so tests can run on a fixed baseline while the live site uses the newest data.
 */
export interface Dataset {
  /** Changes whenever the data changes. Saved browser state is refreshed when it differs. */
  readonly version: string;
  /** Date (YYYY-MM-DD) the ratios were last checked against their sources. Shown in the UI. */
  readonly checkedDate: string;
  /** Card currencies in display order. Every per-card array in the results follows this order. */
  readonly cards: readonly Card[];
  /** Airline, hotel and rail programs in display order. */
  readonly programs: readonly Program[];
  /** Partner points per card point, before the Citi multiplier and bonuses. Missing = no direct transfer. */
  readonly cardRatios: Readonly<Record<CardId, Readonly<Record<ProgramId, number>>>>;
  /** Chase to Hyatt depends on the Chase card. */
  readonly chaseHyattRatio: Readonly<Record<ChaseCard, number>>;
  /** Bilt to Hyatt changes on a date. `date` is the first day of the new ratio. */
  readonly biltHyattSwitch: {
    readonly date: string;
    readonly before: number;
    readonly onOrAfter: number;
  };
  /** Multiplier for Citi cards other than Strata Premier and Strata Elite. */
  readonly citiOtherMultiplier: number;
  /** Partner-to-partner transfers. Order matters: on a tie, the route listed first is shown. */
  readonly partnerTransfers: readonly PartnerTransfer[];
  /** Limited-time bonuses that ship with the site. */
  readonly builtInBonuses: readonly Bonus[];
  readonly sources: readonly Source[];
  /** Notes shown under the card ratio table. */
  readonly cardRatioNotes: readonly string[];
  /** Made-up balances shown on a first visit. */
  readonly exampleBalances: Balances;
  readonly defaultSettings: Settings;
}

/** Routes whose on/off state differs from PartnerTransfer.defaultOn, keyed by route id. */
export type RouteOverrides = Readonly<Record<string, boolean>>;

/** Everything the calculation depends on. */
export interface EngineInput {
  /** Today's date as YYYY-MM-DD in the user's own time zone. */
  readonly today: string;
  readonly balances: Balances;
  readonly settings: Settings;
  readonly bonuses: readonly Bonus[];
  readonly routeOverrides: RouteOverrides;
}

/** One card currency's numbers for one program. */
export interface CardCell {
  readonly cardId: CardId;
  /** This card's balance, cleaned up: a whole number, never negative. */
  readonly balance: number;
  /** The "Card Ratios" value: before the Citi multiplier and before bonuses. 0 = not a direct partner. */
  readonly baseRatio: number;
  /** Active bonus fraction included in directRatio (0 when there is none or bonuses are switched off). */
  readonly bonusPct: number;
  /** Partner points per card point when transferring straight from the card, with multiplier and bonus. */
  readonly directRatio: number;
  /** Best partner points per card point using up to MAX_PARTNER_MOVES partner moves. */
  readonly bestRatio: number;
  /**
   * How to get bestRatio. null = this card cannot reach the program. [] = transfer directly.
   * ['a'] = card to a, then a to this program. ['a', 'b'] = card to a, a to b, b to this program.
   */
  readonly path: readonly ProgramId[] | null;
  /** round(directRatio x balance). */
  readonly directPoints: number;
  /** round(bestRatio x balance). */
  readonly bestPoints: number;
  /** true when the partner route gives this card more points than the direct transfer (bestPoints > directPoints). */
  readonly addsPoints: boolean;
}

/** One row of the results table. */
export interface ProgramResult {
  readonly program: Program;
  /** One entry per card, in CARDS order. */
  readonly cells: readonly CardCell[];
  /** Number of cards that have a balance and transfer here directly. */
  readonly directCardCount: number;
  /** Sum of directPoints: what you get if every card's whole balance goes straight to this program. */
  readonly directTotal: number;
  /** Sum of bestPoints: the most you can get here, using partner moves where they help. */
  readonly maxTotal: number;
  /** maxTotal - directTotal. */
  readonly added: number;
}

export interface RouteResult {
  readonly route: PartnerTransfer;
  readonly enabled: boolean;
  /** Ratio the calculation uses: 0 when the route is off, otherwise ratio plus the block bonus when counted. */
  readonly ratioUsed: number;
}

export interface EngineResult {
  /** One entry per program, in PROGRAMS order. */
  readonly programs: readonly ProgramResult[];
  /** One entry per partner transfer, in PARTNER_TRANSFERS order. */
  readonly routes: readonly RouteResult[];
}
````

## `src/app/core/datasets/current.ts`

<!-- FILE src/app/core/datasets/current.ts ee89c12cbaa0 -->
````text
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
````

## `src/app/core/datasets/dataset-2026-11-09.ts`

<!-- FILE src/app/core/datasets/dataset-2026-11-09.ts 4e834cec6a8a -->
````text
import { BlockBonus, Dataset, PartnerTransfer, ProgramId } from '../models';

// Built-in data as checked on 2026-11-09: the website's copy of the spreadsheet tabs "Card Ratios",
// "Partner Transfers", "Transfer Bonuses" and "Sources".
//
// THIS FILE IS THE TEST BASELINE. The tests compare the calculation with the spreadsheet using
// exactly these numbers, so do not edit it. When a ratio, a route or a bonus changes, follow the
// steps at the top of current.ts: copy this file under a new date and edit the copy.

const MARRIOTT_5K: BlockBonus = { bonus: 5000, size: 60000 };
const MARRIOTT_10K: BlockBonus = { bonus: 10000, size: 60000 };
const HYATT_5K: BlockBonus = { bonus: 5000, size: 50000 };
/** Restricted route: needs elite status or a specific card, so it stays off until the user turns it on. */
const OFF = false;

/** Notes shared by many routes. */
const N = {
  avios: 'Avios move 1:1 between linked accounts (names must match).',
  virgin: 'Same Virgin Points currency.',
  marriott: '3 Marriott points = 1 mile, plus 5,000 bonus miles per 60,000 points. Minimum 3,000.',
  marriottNoBonus: '3 Marriott points = 1 mile. No 60,000-point bonus for this airline.',
  hilton: 'Hilton points to miles (mostly 10:1).',
  hyatt: 'Plus 5,000 bonus miles per 50,000 points. Minimum 5,000.',
  hyattNoBonus: 'No 50,000-point bonus listed for this airline. Minimum 5,000.',
  ihg: '5 IHG points = 1 mile. Minimum 10,000.',
  accor: 'Per the Accor partner terms.',
  toAccor4k: '4,000 miles = 1,000 Accor points.',
} as const;

/** One partner-to-partner transfer. `ratio` = points received per point sent. */
function route(
  from: ProgramId,
  to: ProgramId,
  ratio: number,
  sourceId: string,
  note: string,
  blockBonus: BlockBonus | null = null,
  defaultOn = true,
): PartnerTransfer {
  return { id: `${from}>${to}`, from, to, ratio, blockBonus, defaultOn, note, sourceId };
}

export const DATASET_2026_11_09: Dataset = {
  version: '2026-11-09',
  checkedDate: '2026-11-09',

  // Card currencies, in display order. This is also the column order of every table.
  cards: [
    { id: 'amex', name: 'Amex', fullName: 'Amex Membership Rewards' },
    { id: 'chase', name: 'Chase', fullName: 'Chase Ultimate Rewards' },
    { id: 'citi', name: 'Citi', fullName: 'Citi ThankYou' },
    { id: 'capital-one', name: 'Capital One', fullName: 'Capital One Miles' },
    { id: 'bilt', name: 'Bilt', fullName: 'Bilt Rewards' },
    { id: 'wells-fargo', name: 'Wells Fargo', fullName: 'Wells Fargo Rewards' },
  ],

  // Airline, hotel and rail programs, in display order.
  // prettier-ignore
  programs: [
    { id: 'aer-lingus', name: 'Aer Lingus AerClub', type: 'airline', group: 'Avios pool' },
    { id: 'aeromexico', name: 'Aeromexico Rewards', type: 'airline', group: 'SkyTeam' },
    { id: 'aeroplan', name: 'Air Canada Aeroplan', type: 'airline', group: 'Star Alliance' },
    { id: 'flying-blue', name: 'Air France-KLM Flying Blue', type: 'airline', group: 'SkyTeam' },
    { id: 'atmos', name: 'Atmos Rewards (Alaska/Hawaiian)', type: 'airline', group: 'oneworld' },
    { id: 'aadvantage', name: 'American AAdvantage', type: 'airline', group: 'oneworld' },
    { id: 'ana', name: 'ANA Mileage Club', type: 'airline', group: 'Star Alliance' },
    { id: 'lifemiles', name: 'Avianca LifeMiles', type: 'airline', group: 'Star Alliance' },
    { id: 'british-airways', name: 'British Airways Club', type: 'airline', group: 'Avios pool' },
    { id: 'cathay', name: 'Cathay Asia Miles', type: 'airline', group: 'oneworld' },
    { id: 'copa', name: 'Copa ConnectMiles', type: 'airline', group: 'Star Alliance' },
    { id: 'delta', name: 'Delta SkyMiles', type: 'airline', group: 'SkyTeam' },
    { id: 'emirates', name: 'Emirates Skywards', type: 'airline', group: 'No alliance' },
    { id: 'etihad', name: 'Etihad Guest', type: 'airline', group: 'No alliance' },
    { id: 'eva', name: 'EVA Air Infinity MileageLands', type: 'airline', group: 'Star Alliance' },
    { id: 'finnair', name: 'Finnair Plus', type: 'airline', group: 'Avios pool' },
    { id: 'iberia', name: 'Iberia Plus', type: 'airline', group: 'Avios pool' },
    { id: 'jal', name: 'JAL Mileage Bank', type: 'airline', group: 'oneworld' },
    { id: 'jetblue', name: 'JetBlue TrueBlue', type: 'airline', group: 'No alliance' },
    { id: 'korean', name: 'Korean Air SKYPASS', type: 'airline', group: 'SkyTeam' },
    { id: 'qantas', name: 'Qantas Frequent Flyer', type: 'airline', group: 'oneworld' },
    { id: 'qatar', name: 'Qatar Privilege Club', type: 'airline', group: 'Avios pool' },
    { id: 'krisflyer', name: 'Singapore KrisFlyer', type: 'airline', group: 'Star Alliance' },
    { id: 'southwest', name: 'Southwest Rapid Rewards', type: 'airline', group: 'No alliance' },
    { id: 'tap', name: 'TAP Miles&Go', type: 'airline', group: 'Star Alliance' },
    { id: 'thai', name: 'Thai Royal Orchid Plus', type: 'airline', group: 'Star Alliance' },
    { id: 'turkish', name: 'Turkish Miles&Smiles', type: 'airline', group: 'Star Alliance' },
    { id: 'united', name: 'United MileagePlus', type: 'airline', group: 'Star Alliance' },
    { id: 'virgin-atlantic', name: 'Virgin Atlantic Flying Club', type: 'airline', group: 'Virgin Points' },
    { id: 'virgin-red', name: 'Virgin Red', type: 'airline', group: 'Virgin Points' },
    { id: 'marriott', name: 'Marriott Bonvoy', type: 'hotel', group: '' },
    { id: 'hilton', name: 'Hilton Honors', type: 'hotel', group: '' },
    { id: 'hyatt', name: 'World of Hyatt', type: 'hotel', group: '' },
    { id: 'ihg', name: 'IHG One Rewards', type: 'hotel', group: '' },
    { id: 'accor', name: 'Accor Live Limitless', type: 'hotel', group: '' },
    { id: 'wyndham', name: 'Wyndham Rewards', type: 'hotel', group: '' },
    { id: 'choice', name: 'Choice Privileges', type: 'hotel', group: '' },
    { id: 'i-prefer', name: 'I Prefer (Preferred Hotels)', type: 'hotel', group: '' },
    { id: 'leaders-club', name: 'Leaders Club (LHW)', type: 'hotel', group: '' },
    { id: 'amtrak', name: 'Amtrak Guest Rewards', type: 'rail', group: '' },
  ],

  // Partner points received for 1 card point, before the Citi multiplier and before bonuses.
  // A missing program means the card cannot transfer there directly. The two Hyatt entries only
  // mark Hyatt as a partner: the real ratio comes from chaseHyattRatio and biltHyattSwitch.
  cardRatios: {
    // prettier-ignore
    amex: {
      'aer-lingus': 1, aeromexico: 1.6, aeroplan: 1, 'flying-blue': 1, ana: 1, lifemiles: 1,
      'british-airways': 1, cathay: 0.8, delta: 1, emirates: 0.8, iberia: 1, jetblue: 0.8,
      qantas: 1, qatar: 1, krisflyer: 1, 'virgin-atlantic': 1, marriott: 1, hilton: 2, choice: 1,
      'leaders-club': 0.25,
    },
    // prettier-ignore
    chase: {
      'aer-lingus': 1, aeroplan: 1, 'flying-blue': 1, 'british-airways': 1, iberia: 1, jetblue: 1,
      krisflyer: 1, southwest: 1, united: 1, 'virgin-atlantic': 1, marriott: 1, hyatt: 0.75,
      ihg: 1, wyndham: 1,
    },
    // prettier-ignore
    citi: {
      'flying-blue': 1, aadvantage: 1, lifemiles: 1, cathay: 1, emirates: 0.8, etihad: 1, eva: 1,
      jal: 1, jetblue: 1, qantas: 1, qatar: 1, krisflyer: 1, thai: 1, turkish: 1,
      'virgin-atlantic': 1, accor: 0.5, wyndham: 1, choice: 1.5, 'i-prefer': 2,
      'leaders-club': 0.2,
    },
    // prettier-ignore
    'capital-one': {
      aeromexico: 1, aeroplan: 1, 'flying-blue': 1, lifemiles: 1, 'british-airways': 1, cathay: 1,
      copa: 0.75, emirates: 0.75, etihad: 1, eva: 0.75, finnair: 1, jal: 0.75, jetblue: 0.6,
      qantas: 1, qatar: 1, krisflyer: 1, tap: 1, turkish: 1, 'virgin-atlantic': 1,
      'virgin-red': 1, accor: 0.5, wyndham: 1, choice: 1, 'i-prefer': 2,
    },
    // prettier-ignore
    bilt: {
      'aer-lingus': 1, aeroplan: 1, 'flying-blue': 1, atmos: 1, lifemiles: 1,
      'british-airways': 1, cathay: 1, emirates: 1, etihad: 1, iberia: 1, jal: 1, jetblue: 1,
      qatar: 1, southwest: 1, tap: 1, turkish: 1, united: 1, 'virgin-atlantic': 1, marriott: 1,
      hilton: 1, hyatt: 1, ihg: 1, accor: 2 / 3, wyndham: 1, 'i-prefer': 2, amtrak: 0.5,
    },
    // prettier-ignore
    'wells-fargo': {
      'aer-lingus': 1, 'flying-blue': 1, lifemiles: 1, 'british-airways': 1, cathay: 1, iberia: 1,
      jetblue: 1, 'virgin-atlantic': 1, 'virgin-red': 1, wyndham: 2, choice: 2,
    },
  },

  // Chase to Hyatt: 1:1 on Sapphire Reserve cards, 4:3 on Sapphire Preferred and Ink (since Oct 1, 2026).
  chaseHyattRatio: { reserve: 1, preferred: 0.75 },
  // Bilt to Hyatt: 1:1 through Dec 31, 2026, then 4:3. `date` is the first day of the new ratio.
  biltHyattSwitch: { date: '2027-01-01', before: 1, onOrAfter: 0.75 },
  // Citi cards other than Strata Premier and Strata Elite get 70% of every Citi ratio.
  citiOtherMultiplier: 0.7,

  // Partner-to-partner transfers. ORDER MATTERS: when two routes give the same result, the one
  // listed first is the one shown. Keep the order when editing.
  // prettier-ignore
  partnerTransfers: [
    // From British Airways Club
    route('british-airways', 'iberia', 1, 'nw-avios', N.avios),
    route('british-airways', 'aer-lingus', 1, 'nw-avios', N.avios),
    route('british-airways', 'qatar', 1, 'nw-avios', N.avios),
    route('british-airways', 'finnair', 1, 'nw-avios', N.avios),
    // From Iberia Plus
    route('iberia', 'british-airways', 1, 'nw-avios', N.avios),
    route('iberia', 'aer-lingus', 1, 'nw-avios', N.avios),
    route('iberia', 'qatar', 1, 'nw-avios', N.avios),
    route('iberia', 'finnair', 1, 'nw-avios', N.avios),
    // From Aer Lingus AerClub
    route('aer-lingus', 'british-airways', 1, 'nw-avios', N.avios),
    route('aer-lingus', 'iberia', 1, 'nw-avios', N.avios),
    route('aer-lingus', 'qatar', 1, 'nw-avios', N.avios),
    route('aer-lingus', 'finnair', 1, 'nw-avios', N.avios),
    // From Qatar Privilege Club
    route('qatar', 'british-airways', 1, 'nw-avios', N.avios),
    route('qatar', 'iberia', 1, 'nw-avios', N.avios),
    route('qatar', 'aer-lingus', 1, 'nw-avios', N.avios),
    route('qatar', 'finnair', 1, 'nw-avios', N.avios),
    // From Finnair Plus
    route('finnair', 'british-airways', 1, 'nw-avios', N.avios),
    route('finnair', 'iberia', 1, 'nw-avios', N.avios),
    route('finnair', 'aer-lingus', 1, 'nw-avios', N.avios),
    route('finnair', 'qatar', 1, 'nw-avios', N.avios),
    // From Virgin Atlantic Flying Club
    route('virgin-atlantic', 'virgin-red', 1, 'aw-capital-one', N.virgin),
    // From Virgin Red
    route('virgin-red', 'virgin-atlantic', 1, 'aw-capital-one', N.virgin),
    // From Virgin Atlantic Flying Club
    route('virgin-atlantic', 'hilton', 1.5, 'aw-hilton', 'Virgin Points convert to Hilton points at 1:1.5.'),
    // From Marriott Bonvoy
    route('marriott', 'aer-lingus', 1 / 3, 'aw-marriott-guide', N.marriott, MARRIOTT_5K),
    route('marriott', 'aeromexico', 1 / 3, 'aw-marriott-guide', N.marriott, MARRIOTT_5K),
    route('marriott', 'aeroplan', 1 / 3, 'aw-marriott-guide', N.marriott, MARRIOTT_5K),
    route('marriott', 'flying-blue', 1 / 3, 'aw-marriott-guide', N.marriott, MARRIOTT_5K),
    route('marriott', 'atmos', 1 / 3, 'aw-marriott-guide', N.marriott, MARRIOTT_5K),
    route('marriott', 'ana', 1 / 3, 'aw-marriott-guide', N.marriott, MARRIOTT_5K),
    route('marriott', 'british-airways', 1 / 3, 'aw-marriott-guide', N.marriott, MARRIOTT_5K),
    route('marriott', 'cathay', 1 / 3, 'aw-marriott-guide', N.marriott, MARRIOTT_5K),
    route('marriott', 'copa', 1 / 3, 'aw-marriott-guide', N.marriott, MARRIOTT_5K),
    route('marriott', 'emirates', 1 / 3, 'aw-marriott-guide', N.marriott, MARRIOTT_5K),
    route('marriott', 'etihad', 1 / 3, 'aw-marriott-guide', N.marriott, MARRIOTT_5K),
    route('marriott', 'iberia', 1 / 3, 'aw-marriott-guide', N.marriott, MARRIOTT_5K),
    route('marriott', 'jal', 1 / 3, 'aw-marriott-guide', N.marriott, MARRIOTT_5K),
    route('marriott', 'korean', 1 / 3, 'aw-marriott-guide', N.marriott, MARRIOTT_5K),
    route('marriott', 'qantas', 1 / 3, 'aw-marriott-guide', N.marriott, MARRIOTT_5K),
    route('marriott', 'qatar', 1 / 3, 'aw-marriott-guide', N.marriott, MARRIOTT_5K),
    route('marriott', 'krisflyer', 1 / 3, 'aw-marriott-guide', N.marriott, MARRIOTT_5K),
    route('marriott', 'southwest', 1 / 3, 'aw-marriott-guide', N.marriott, MARRIOTT_5K),
    route('marriott', 'tap', 1 / 3, 'aw-marriott-guide', N.marriott, MARRIOTT_5K),
    route('marriott', 'thai', 1 / 3, 'aw-marriott-guide', N.marriott, MARRIOTT_5K),
    route('marriott', 'turkish', 1 / 3, 'aw-marriott-guide', N.marriott, MARRIOTT_5K),
    route('marriott', 'virgin-atlantic', 1 / 3, 'aw-marriott-guide', N.marriott, MARRIOTT_5K),
    route('marriott', 'aadvantage', 1 / 3, 'aw-marriott-guide', N.marriottNoBonus),
    route('marriott', 'delta', 1 / 3, 'aw-marriott-guide', N.marriottNoBonus),
    route('marriott', 'lifemiles', 1 / 3, 'aw-marriott-guide', N.marriottNoBonus),
    route('marriott', 'united', 1 / 3, 'aw-marriott-guide', '3 Marriott points = 1 mile, plus 10,000 bonus miles per 60,000 points.', MARRIOTT_10K),
    // From Hilton Honors
    route('hilton', 'aeromexico', 0.26, 'aw-hilton', N.hilton),
    route('hilton', 'aeroplan', 0.1, 'aw-hilton', N.hilton),
    route('hilton', 'flying-blue', 0.1, 'aw-hilton', N.hilton),
    route('hilton', 'ana', 0.1, 'aw-hilton', N.hilton),
    route('hilton', 'british-airways', 0.1, 'aw-hilton', N.hilton),
    route('hilton', 'cathay', 0.1, 'aw-hilton', N.hilton),
    route('hilton', 'delta', 0.1, 'aw-hilton', N.hilton),
    route('hilton', 'etihad', 0.1, 'aw-hilton', N.hilton),
    route('hilton', 'eva', 0.1, 'aw-hilton', N.hilton),
    route('hilton', 'jal', 0.1, 'aw-hilton', N.hilton),
    route('hilton', 'qantas', 0.15, 'aw-hilton', N.hilton),
    route('hilton', 'qatar', 0.1, 'aw-hilton', N.hilton),
    route('hilton', 'krisflyer', 0.125, 'aw-hilton', N.hilton),
    route('hilton', 'turkish', 0.1, 'aw-hilton', N.hilton),
    route('hilton', 'united', 0.1, 'aw-hilton', N.hilton),
    route('hilton', 'virgin-atlantic', 0.15, 'aw-hilton', N.hilton),
    // From World of Hyatt
    route('hyatt', 'aeromexico', 0.8, 'aw-hyatt', N.hyatt, HYATT_5K),
    route('hyatt', 'aeroplan', 0.5, 'aw-hyatt', N.hyattNoBonus),
    route('hyatt', 'flying-blue', 0.4, 'aw-hyatt', N.hyatt, HYATT_5K),
    route('hyatt', 'ana', 0.4, 'aw-hyatt', N.hyatt, HYATT_5K),
    route('hyatt', 'aadvantage', 0.4, 'aw-hyatt', N.hyattNoBonus),
    route('hyatt', 'cathay', 0.4, 'aw-hyatt', N.hyattNoBonus),
    route('hyatt', 'delta', 0.4, 'aw-hyatt', N.hyatt, HYATT_5K),
    route('hyatt', 'emirates', 0.4, 'aw-hyatt', N.hyatt, HYATT_5K),
    route('hyatt', 'etihad', 0.4, 'aw-hyatt', N.hyattNoBonus),
    route('hyatt', 'jal', 0.4, 'aw-hyatt', N.hyatt, HYATT_5K),
    route('hyatt', 'korean', 0.4, 'aw-hyatt', N.hyatt, HYATT_5K),
    route('hyatt', 'qantas', 0.48, 'aw-hyatt', N.hyatt, HYATT_5K),
    route('hyatt', 'qatar', 0.4, 'aw-hyatt', N.hyattNoBonus),
    route('hyatt', 'krisflyer', 0.4, 'aw-hyatt', N.hyatt, HYATT_5K),
    route('hyatt', 'southwest', 0.48, 'aw-hyatt', N.hyatt, HYATT_5K),
    route('hyatt', 'thai', 0.4, 'aw-hyatt', N.hyatt, HYATT_5K),
    route('hyatt', 'united', 0.4, 'aw-hyatt', N.hyattNoBonus),
    route('hyatt', 'virgin-atlantic', 0.6, 'aw-hyatt', N.hyatt, HYATT_5K),
    // From IHG One Rewards
    route('ihg', 'aeromexico', 0.2, 'aw-ihg', N.ihg),
    route('ihg', 'aeroplan', 0.2, 'aw-ihg', N.ihg),
    route('ihg', 'flying-blue', 0.2, 'aw-ihg', N.ihg),
    route('ihg', 'atmos', 0.2, 'aw-ihg', N.ihg),
    route('ihg', 'ana', 0.2, 'aw-ihg', N.ihg),
    route('ihg', 'aadvantage', 0.2, 'aw-ihg', N.ihg),
    route('ihg', 'lifemiles', 0.2, 'aw-ihg', N.ihg),
    route('ihg', 'british-airways', 0.2, 'aw-ihg', N.ihg),
    route('ihg', 'cathay', 0.2, 'aw-ihg', N.ihg),
    route('ihg', 'delta', 0.2, 'aw-ihg', N.ihg),
    route('ihg', 'emirates', 0.2, 'aw-ihg', N.ihg),
    route('ihg', 'etihad', 0.2, 'aw-ihg', N.ihg),
    route('ihg', 'finnair', 0.2, 'aw-ihg', N.ihg),
    route('ihg', 'iberia', 0.2, 'aw-ihg', N.ihg),
    route('ihg', 'jal', 0.2, 'aw-ihg', N.ihg),
    route('ihg', 'jetblue', 0.2, 'aw-ihg', N.ihg),
    route('ihg', 'korean', 0.2, 'aw-ihg', N.ihg),
    route('ihg', 'qantas', 0.2, 'aw-ihg', N.ihg),
    route('ihg', 'qatar', 0.2, 'aw-ihg', N.ihg),
    route('ihg', 'krisflyer', 0.2, 'aw-ihg', N.ihg),
    route('ihg', 'tap', 0.2, 'aw-ihg', N.ihg),
    route('ihg', 'thai', 0.2, 'aw-ihg', N.ihg),
    route('ihg', 'united', 0.2, 'aw-ihg', N.ihg),
    route('ihg', 'virgin-atlantic', 0.2, 'aw-ihg', N.ihg),
    // From Accor Live Limitless
    route('accor', 'aeroplan', 0.5, 'accor-terms', N.accor),
    route('accor', 'cathay', 0.5, 'accor-terms', N.accor),
    route('accor', 'aeromexico', 0.5, 'accor-terms', N.accor),
    route('accor', 'etihad', 0.5, 'accor-terms', N.accor),
    route('accor', 'british-airways', 0.5, 'accor-terms', N.accor),
    route('accor', 'finnair', 0.65, 'accor-terms', N.accor),
    route('accor', 'iberia', 1, 'accor-terms', N.accor),
    route('accor', 'jal', 0.5, 'accor-terms', N.accor),
    route('accor', 'krisflyer', 0.5, 'accor-terms', N.accor),
    route('accor', 'lifemiles', 0.5, 'accor-terms', N.accor),
    route('accor', 'united', 0.5, 'accor-terms', N.accor),
    route('accor', 'tap', 0.5, 'accor-terms', N.accor),
    route('accor', 'turkish', 0.5, 'accor-terms', N.accor),
    route('accor', 'thai', 0.5, 'accor-terms', N.accor),
    route('accor', 'delta', 0.5, 'accor-terms', N.accor),
    route('accor', 'korean', 0.5, 'accor-terms', N.accor),
    route('accor', 'emirates', 0.5, 'accor-terms', N.accor),
    route('accor', 'flying-blue', 0.5, 'accor-terms', 'Only for ALL x Flying Blue subscribers. Turn on if that is you.', null, OFF),
    route('accor', 'qatar', 0.75, 'll-accor-qatar', '2,000 Accor points = 1,500 Avios (since Nov 2025).'),
    route('accor', 'qantas', 1.25, 'll-accor-qantas', '2,000 Accor points = 2,500 Qantas points.'),
    // From Choice Privileges
    route('choice', 'british-airways', 0.2, 'll-choice', '5 Choice points = 1 Avios.'),
    route('choice', 'iberia', 0.2, 'll-choice', '5 Choice points = 1 Avios.'),
    // From Wyndham Rewards
    route('wyndham', 'krisflyer', 0.2, 'll-wyndham', '5 Wyndham points = 1 KrisFlyer mile.'),
    // From Qatar Privilege Club
    route('qatar', 'accor', 1 / 3.5, 'll-accor-qatar', '3,500 Avios = 1,000 Accor points.'),
    // From Air France-KLM Flying Blue
    route('flying-blue', 'accor', 0.25, 'aw-accor', N.toAccor4k),
    // From Emirates Skywards
    route('emirates', 'accor', 0.25, 'aw-accor', N.toAccor4k),
    // From Finnair Plus
    route('finnair', 'accor', 500 / 2300, 'aw-accor', '2,300 Avios = 500 Accor points.'),
    // From JAL Mileage Bank
    route('jal', 'accor', 0.2, 'aw-accor', '5,000 miles = 1,000 Accor points.'),
    // From Singapore KrisFlyer
    route('krisflyer', 'accor', 1 / 4.5, 'aw-accor', '4,500 miles = 1,000 Accor points.'),
    route('krisflyer', 'marriott', 0.75, 'll-krisflyer-marriott', '4 miles = 3 Marriott points (since Apr 1, 2026). Cap: 250,000 miles a year.'),
    // From Emirates Skywards
    route('emirates', 'marriott', 2 / 3, 'aw-marriott', '3 miles = 2 Marriott points. Minimum 3,000.'),
    // From JAL Mileage Bank
    route('jal', 'marriott', 0.75, 'aw-marriott', '4 miles = 3 Marriott points.'),
    // From Qatar Privilege Club
    route('qatar', 'marriott', 0.5, 'aw-marriott', '2 Avios = 1 Marriott point. Minimum 1,000.'),
    // From Cathay Asia Miles
    route('cathay', 'marriott', 0.5, 'aw-marriott', '2 miles = 1 Marriott point. Minimum 2,000.'),
    // From Korean Air SKYPASS
    route('korean', 'marriott', 0.5, 'aw-marriott', '2 miles = 1 Marriott point. Minimum 5,000.'),
    // From ANA Mileage Club
    route('ana', 'marriott', 0.5, 'aw-marriott', '1:1 for your first two transfers, then 2:1. Counted here at 2:1.'),
    // From United MileagePlus
    route('united', 'marriott', 1, 'aw-united-marriott', 'United Premier Silver or higher only. Turn on if you qualify.', null, OFF),
    // From Air Canada Aeroplan
    route('aeroplan', 'marriott', 1, 'pot-aeroplan-marriott', 'Aeroplan elite members only. Turn on if you qualify.', null, OFF),
    // From Atmos Rewards (Alaska/Hawaiian)
    route('atmos', 'marriott', 1, 'll-atmos-marriott', 'Atmos Rewards Summit card holders only. Turn on if you qualify.', null, OFF),
  ],

  // Limited-time card transfer bonuses known on the checked date. `pct` is a fraction (0.3 = 30%),
  // `endDate` is the last day the bonus applies. Users can remove these and add their own.
  // prettier-ignore
  builtInBonuses: [
    { id: 'seed-amex-marriott', cardId: 'amex', programId: 'marriott', pct: 0.35, endDate: '2026-12-10', sourceId: 'aw-amex', builtIn: true },
    { id: 'seed-amex-virgin-atlantic', cardId: 'amex', programId: 'virgin-atlantic', pct: 0.3, endDate: '2026-11-30', sourceId: 'aw-amex', builtIn: true },
    { id: 'seed-chase-ihg', cardId: 'chase', programId: 'ihg', pct: 0.8, endDate: '2026-12-03', sourceId: 'aw-ihg', builtIn: true },
    { id: 'seed-chase-british-airways', cardId: 'chase', programId: 'british-airways', pct: 0.3, endDate: '2026-12-01', sourceId: 'aw-british-airways', builtIn: true },
    { id: 'seed-citi-cathay', cardId: 'citi', programId: 'cathay', pct: 0.1, endDate: '2026-11-14', sourceId: 'aw-citi', builtIn: true },
    { id: 'seed-capital-one-flying-blue', cardId: 'capital-one', programId: 'flying-blue', pct: 0.2, endDate: '2026-11-30', sourceId: 'aw-capital-one', builtIn: true },
    { id: 'seed-capital-one-virgin-atlantic', cardId: 'capital-one', programId: 'virgin-atlantic', pct: 0.3, endDate: '2026-11-20', sourceId: 'aw-capital-one', builtIn: true },
    { id: 'seed-capital-one-virgin-red', cardId: 'capital-one', programId: 'virgin-red', pct: 0.3, endDate: '2026-11-20', sourceId: 'aw-capital-one', builtIn: true },
    { id: 'seed-capital-one-copa', cardId: 'capital-one', programId: 'copa', pct: 0.3, endDate: '2026-12-01', sourceId: 'aw-capital-one', builtIn: true },
  ],

  // Where the numbers come from. Shown on the Sources view and linked from routes and bonuses.
  // prettier-ignore
  sources: [
    { id: 'aw-amex', label: 'AwardWallet: Amex', url: 'https://awardwallet.com/mile-transfer-times?program=Amex', usedFor: 'Amex partners, ratios and current bonuses' },
    { id: 'aw-chase', label: 'AwardWallet: Chase', url: 'https://awardwallet.com/mile-transfer-times?program=Chase', usedFor: 'Chase partners, ratios and current bonuses' },
    { id: 'aw-citi', label: 'AwardWallet: Citi', url: 'https://awardwallet.com/mile-transfer-times?program=Citi', usedFor: 'Citi partners, ratios and current bonuses' },
    { id: 'aw-capital-one', label: 'AwardWallet: Capital One', url: 'https://awardwallet.com/mile-transfer-times?program=Capital+One', usedFor: 'Capital One partners, ratios and current bonuses; Virgin Points' },
    { id: 'aw-bilt', label: 'AwardWallet: Bilt', url: 'https://awardwallet.com/mile-transfer-times?program=Bilt', usedFor: 'Bilt partners, ratios and current bonuses' },
    { id: 'aw-wells-fargo', label: 'AwardWallet: Wells Fargo', url: 'https://awardwallet.com/mile-transfer-times?program=Wells+Fargo', usedFor: 'Wells Fargo partners, ratios and current bonuses' },
    { id: 'aw-ihg', label: 'AwardWallet: IHG', url: 'https://awardwallet.com/mile-transfer-times?program=IHG', usedFor: 'IHG to airlines (5:1); Chase to IHG bonus' },
    { id: 'aw-british-airways', label: 'AwardWallet: British Airways', url: 'https://awardwallet.com/mile-transfer-times?program=British+Airways', usedFor: 'Chase to British Airways bonus' },
    { id: 'aw-marriott-guide', label: 'AwardWallet: Marriott guide', url: 'https://awardwallet.com/hotels/marriott-bonvoy/marriott-transfer-partners/', usedFor: 'Marriott to airlines, 3:1 and 60,000-point bonus rules' },
    { id: 'aw-marriott', label: 'AwardWallet: Marriott', url: 'https://awardwallet.com/mile-transfer-times?program=Marriott', usedFor: 'Airlines to Marriott' },
    { id: 'aw-hilton', label: 'AwardWallet: Hilton', url: 'https://awardwallet.com/mile-transfer-times?program=Hilton', usedFor: 'Hilton to airlines; Virgin Points to Hilton' },
    { id: 'aw-hyatt', label: 'AwardWallet: Hyatt', url: 'https://awardwallet.com/mile-transfer-times?program=Hyatt', usedFor: 'Hyatt to airlines and which get the 50,000-point bonus' },
    { id: 'ana-hyatt', label: 'ANA: Hyatt conversion', url: 'https://www.ana.co.jp/en/gb/amc/exchange-point/hyatt/', usedFor: 'Hyatt 2.5:1 plus 5,000 per 50,000 points' },
    { id: 'aw-accor', label: 'AwardWallet: Accor', url: 'https://awardwallet.com/mile-transfer-times?program=Accor', usedFor: 'Airlines to Accor' },
    { id: 'accor-terms', label: 'Accor partner terms', url: 'https://all.accor.com/a/en/loyalty-program/partners/conditions/airlines.html', usedFor: 'Accor to airlines' },
    { id: 'll-accor-qatar', label: 'LoyaltyLobby: Accor and Qatar', url: 'https://loyaltylobby.com/2025/11/20/all-accor-qatar-airways-privilege-club-enhance-conversion-ratios/', usedFor: 'Accor and Qatar Avios ratios' },
    { id: 'll-accor-qantas', label: 'LoyaltyLobby: Accor and Qantas', url: 'https://loyaltylobby.com/2025/02/01/accor-all-qantas-conversion-ratio-enhancement-positive/', usedFor: 'Accor to Qantas 2,000:2,500' },
    { id: 'nw-avios', label: 'NerdWallet: moving Avios', url: 'https://www.nerdwallet.com/travel/learn/how-to-transfer-avios-between-british-airways-iberia-and-aer-lingus', usedFor: 'Avios move 1:1 among British Airways, Iberia, Aer Lingus, Qatar, Finnair' },
    { id: 'll-choice', label: 'LoyaltyLobby: Choice', url: 'https://loyaltylobby.com/2024/07/09/choice-privileges-new-conversion-partners-british-airways-iberia-aer-lingus/', usedFor: 'Choice to British Airways and Iberia, 5:1' },
    { id: 'll-wyndham', label: 'LoyaltyLobby: Wyndham', url: 'https://loyaltylobby.com/2025/09/10/wyndham-rewards-points-can-now-be-converted-to-singapore-airlines-krisflyer-miles/', usedFor: 'Wyndham to KrisFlyer, 5:1' },
    { id: 'll-krisflyer-marriott', label: 'LoyaltyLobby: KrisFlyer to Marriott', url: 'https://loyaltylobby.com/2026/03/27/singapore-airlines-to-marriott-bonvoy-conversion-ratio-changes-april-1-2026-for-the-better/', usedFor: 'KrisFlyer to Marriott 4:3 from Apr 1, 2026' },
    { id: 'aw-united-marriott', label: 'AwardWallet: United to Marriott', url: 'https://awardwallet.com/news/united-mileageplus/marriott-bonvoy-transfer-bonus/', usedFor: 'United to Marriott 1:1, Premier members only' },
    { id: 'll-atmos-marriott', label: 'LoyaltyLobby: Atmos to Marriott', url: 'https://loyaltylobby.com/2025/08/21/alaska-atmos-rewards-to-marriott-bonvoy-11-conversion-ratio/', usedFor: 'Atmos to Marriott 1:1, Summit card holders only' },
    { id: 'pot-aeroplan-marriott', label: 'Prince of Travel: Aeroplan to Marriott', url: 'https://princeoftravel.com/news/aeroplan-points-now-transferable-to-marriott-bonvoy/', usedFor: 'Aeroplan to Marriott 1:1, elite members only' },
    { id: 'nw-bilt', label: 'NerdWallet: Bilt partners', url: 'https://www.nerdwallet.com/travel/learn/bilt-transfer-partners', usedFor: 'Bilt to Hyatt becomes 4:3 on Jan 1, 2027' },
  ],

  // Shown under the card ratio table.
  // prettier-ignore
  cardRatioNotes: [
    'Chase to Hyatt is 1:1 on Sapphire Reserve cards and 4:3 on Sapphire Preferred and Ink cards (since Oct 1, 2026). Choose your card in Settings.',
    'Bilt to Hyatt is 1:1 through Dec 31, 2026, then 4:3. The switch happens automatically.',
    'Citi cards other than Strata Premier and Strata Elite get 70% of these ratios. Choose your card in Settings.',
    'Recently removed: Amex to Etihad (ended Jun 30, 2026) and Citi to Aeromexico (ended Jan 25, 2026).',
  ],

  // Shown on a first visit. These are made-up numbers: never put real balances in this file.
  exampleBalances: {
    amex: 120000,
    chase: 90000,
    citi: 40000,
    'capital-one': 75000,
    bilt: 30000,
    'wells-fargo': 15000,
  },

  defaultSettings: {
    chaseCard: 'preferred',
    citiTier: 'premium',
    countBonuses: true,
    countBlockBonuses: true,
  },
};
````

## `src/app/core/engine.ts`

<!-- FILE src/app/core/engine.ts 2801142e6858 -->
````text
import {
  Balances,
  Bonus,
  CardCell,
  CardId,
  Dataset,
  EngineInput,
  EngineResult,
  PartnerTransfer,
  Program,
  ProgramId,
  ProgramResult,
  RouteOverrides,
  RouteResult,
  Settings,
} from './models';

// The calculation, ported from the spreadsheet formulas. Pure functions only: no Angular, no
// browser APIs, no Date.now(). The data arrives as a Dataset, everything else as an EngineInput.

/** Most partner-to-partner moves chained after the card transfer. The spreadsheet uses 2. */
export const MAX_PARTNER_MOVES = 2;

/** Ratios closer than this count as equal, so floating point noise never picks a longer route. */
export const EPSILON = 1e-9;

/** YYYY-MM-DD for a Date in the browser's own time zone. Do not use toISOString(): that is UTC. */
export function localIsoDate(date: Date): string {
  const year = String(date.getFullYear()).padStart(4, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/** true for a real calendar date written as YYYY-MM-DD. */
export function isIsoDate(value: unknown): value is string {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return false;
  }
  const year = Number(value.slice(0, 4));
  const month = Number(value.slice(5, 7));
  const day = Number(value.slice(8, 10));
  const date = new Date(Date.UTC(year, month - 1, day));
  return (
    date.getUTCFullYear() === year && date.getUTCMonth() === month - 1 && date.getUTCDate() === day
  );
}

/** A bonus counts through its end date. ISO dates compare correctly as plain strings. */
export function isBonusActive(bonus: Bonus, today: string): boolean {
  return bonus.endDate === null || bonus.endDate >= today;
}

/** Whole, non-negative number of points. Accepts text such as '120,000'. Anything else becomes 0. */
export function sanitizeBalance(value: unknown): number {
  const cleaned = typeof value === 'string' ? value.replace(/[,\s]/g, '') : value;
  const parsed = typeof cleaned === 'string' && cleaned !== '' ? Number(cleaned) : cleaned;
  if (typeof parsed !== 'number' || !Number.isFinite(parsed) || parsed <= 0) {
    return 0;
  }
  return Math.min(Math.floor(parsed), 1e12);
}

/** Sum of all card balances. */
export function totalBalance(data: Dataset, balances: Balances): number {
  return data.cards.reduce((total, card) => total + sanitizeBalance(balances[card.id]), 0);
}

/** The program with this id, or undefined. */
export function findProgram(data: Dataset, id: ProgramId): Program | undefined {
  return data.programs.find((program) => program.id === id);
}

/** Program name for an id, or the id itself when it is unknown. */
export function programName(data: Dataset, id: ProgramId): string {
  return findProgram(data, id)?.name ?? id;
}

/** 'No route', 'Direct', 'via A' or 'via A > B', using full program names. */
export function pathLabel(data: Dataset, path: readonly ProgramId[] | null): string {
  if (path === null) {
    return 'No route';
  }
  if (path.length === 0) {
    return 'Direct';
  }
  return `via ${path.map((id) => programName(data, id)).join(' > ')}`;
}

/** Ids of the programs a card can transfer to directly, in program order. */
export function directPartnerIds(data: Dataset, cardId: CardId): ProgramId[] {
  const ratios = data.cardRatios[cardId];
  return data.programs
    .filter((program) => (ratios[program.id] ?? 0) > 0)
    .map((program) => program.id);
}

/**
 * The "Card Ratios" tab: partner points per card point before the Citi multiplier and bonuses.
 * 0 means the card cannot transfer to the program directly.
 */
export function baseCardRatio(
  data: Dataset,
  cardId: CardId,
  programId: ProgramId,
  settings: Settings,
  today: string,
): number {
  const listed = data.cardRatios[cardId][programId] ?? 0;
  if (listed <= 0) {
    return 0;
  }
  if (programId === 'hyatt' && cardId === 'chase') {
    return data.chaseHyattRatio[settings.chaseCard];
  }
  if (programId === 'hyatt' && cardId === 'bilt') {
    const rule = data.biltHyattSwitch;
    return today < rule.date ? rule.before : rule.onOrAfter;
  }
  return listed;
}

/** The Citi multiplier for Citi cards other than Strata Premier and Strata Elite, otherwise 1. */
export function cardMultiplier(data: Dataset, cardId: CardId, settings: Settings): number {
  return cardId === 'citi' && settings.citiTier === 'other' ? data.citiOtherMultiplier : 1;
}

/** Sum of the bonuses that apply to one card and program today. 0 when bonuses are switched off. */
export function activeBonusPct(
  cardId: CardId,
  programId: ProgramId,
  input: Pick<EngineInput, 'today' | 'settings' | 'bonuses'>,
): number {
  if (!input.settings.countBonuses) {
    return 0;
  }
  let total = 0;
  for (const bonus of input.bonuses) {
    if (
      bonus.cardId === cardId &&
      bonus.programId === programId &&
      isBonusActive(bonus, input.today)
    ) {
      total += bonus.pct;
    }
  }
  return total;
}

export function isRouteEnabled(route: PartnerTransfer, overrides: RouteOverrides): boolean {
  return overrides[route.id] ?? route.defaultOn;
}

/** 0 when the route is off, otherwise its ratio plus the per-point value of the block bonus. */
export function routeRatioUsed(
  route: PartnerTransfer,
  settings: Settings,
  overrides: RouteOverrides,
): number {
  if (!isRouteEnabled(route, overrides)) {
    return 0;
  }
  const block = route.blockBonus;
  const blockValue =
    settings.countBlockBonuses && block && block.size > 0 ? block.bonus / block.size : 0;
  return route.ratio + blockValue;
}

/** How well one card reaches one program: the ratio, and the programs passed through on the way. */
interface Reach {
  readonly ratio: number;
  readonly path: readonly ProgramId[];
}

/** An active partner transfer, with programs as positions in data.programs. */
interface Hop {
  readonly from: number;
  readonly to: number;
  readonly fromId: ProgramId;
  readonly ratio: number;
}

function toHops(data: Dataset, routes: readonly RouteResult[]): Hop[] {
  const position = new Map(data.programs.map((program, index) => [program.id, index] as const));
  const hops: Hop[] = [];
  for (const { route, ratioUsed } of routes) {
    const from = position.get(route.from);
    const to = position.get(route.to);
    if (ratioUsed > 0 && from !== undefined && to !== undefined) {
      hops.push({ from, to, fromId: route.from, ratio: ratioUsed });
    }
  }
  return hops;
}

/**
 * Best ratio from one card to every program, allowing up to MAX_PARTNER_MOVES partner moves.
 *
 * Each pass answers "what is the best I can do with one more move?" using only the previous
 * pass, exactly like the spreadsheet's OneMoveRatio and BestRatio blocks. A longer route replaces
 * a shorter one only when it is strictly better, and when two routes tie, the one listed first in
 * data.partnerTransfers wins (hops are visited in that order and only a better one replaces).
 */
function bestReach(direct: readonly Reach[], hops: readonly Hop[]): Reach[] {
  let layer: Reach[] = [...direct];
  for (let move = 1; move <= MAX_PARTNER_MOVES; move++) {
    const next = [...layer];
    for (const hop of hops) {
      const source = layer[hop.from];
      const candidate = source.ratio * hop.ratio;
      if (candidate > next[hop.to].ratio + EPSILON) {
        next[hop.to] = { ratio: candidate, path: [...source.path, hop.fromId] };
      }
    }
    layer = next;
  }
  return layer;
}

/** One card's numbers for every program, in program order. */
function cellsForCard(
  data: Dataset,
  cardId: CardId,
  input: EngineInput,
  hops: readonly Hop[],
): CardCell[] {
  const balance = sanitizeBalance(input.balances[cardId]);
  const multiplier = cardMultiplier(data, cardId, input.settings);
  const baseRatios: number[] = [];
  const bonusPcts: number[] = [];
  const direct: Reach[] = [];
  for (const program of data.programs) {
    const baseRatio = baseCardRatio(data, cardId, program.id, input.settings, input.today);
    const bonusPct = baseRatio > 0 ? activeBonusPct(cardId, program.id, input) : 0;
    baseRatios.push(baseRatio);
    bonusPcts.push(bonusPct);
    direct.push({ ratio: baseRatio * multiplier * (1 + bonusPct), path: [] });
  }
  const best = bestReach(direct, hops);
  return data.programs.map((_, index) => {
    const directRatio = direct[index].ratio;
    const bestRatio = best[index].ratio;
    const directPoints = Math.round(directRatio * balance);
    const bestPoints = Math.round(bestRatio * balance);
    return {
      cardId,
      balance,
      baseRatio: baseRatios[index],
      bonusPct: bonusPcts[index],
      directRatio,
      bestRatio,
      path: bestRatio > 0 ? best[index].path : null,
      directPoints,
      bestPoints,
      addsPoints: bestPoints > directPoints,
    };
  });
}

function sum(values: readonly number[]): number {
  return values.reduce((total, value) => total + value, 0);
}

/** Runs the whole calculation. Cheap enough to call on every input change. */
export function compute(data: Dataset, input: EngineInput): EngineResult {
  const routes: RouteResult[] = data.partnerTransfers.map((route) => ({
    route,
    enabled: isRouteEnabled(route, input.routeOverrides),
    ratioUsed: routeRatioUsed(route, input.settings, input.routeOverrides),
  }));
  const hops = toHops(data, routes);
  const columns = data.cards.map((card) => cellsForCard(data, card.id, input, hops));

  const programs: ProgramResult[] = data.programs.map((program, index) => {
    const cells = columns.map((column) => column[index]);
    const directTotal = sum(cells.map((cell) => cell.directPoints));
    const maxTotal = sum(cells.map((cell) => cell.bestPoints));
    return {
      program,
      cells,
      directCardCount: cells.filter((cell) => cell.directRatio * cell.balance > 0).length,
      directTotal,
      maxTotal,
      added: maxTotal - directTotal,
    };
  });

  return { programs, routes };
}
````

## `src/app/core/calculator-store.ts`

<!-- FILE src/app/core/calculator-store.ts d9bf3b7fe54a -->
````text
import { InjectionToken, Service, computed, inject, signal } from '@angular/core';

import { CURRENT_DATASET } from './datasets/current';
import {
  compute,
  directPartnerIds,
  findProgram,
  isBonusActive,
  isIsoDate,
  localIsoDate,
  pathLabel,
  programName,
  sanitizeBalance,
  totalBalance,
} from './engine';
import {
  Balances,
  Bonus,
  Card,
  CardId,
  ChaseCard,
  CitiTier,
  Dataset,
  EngineInput,
  EngineResult,
  Program,
  ProgramId,
  RouteOverrides,
  Settings,
  Source,
} from './models';

/**
 * The built-in data the calculator runs on. The live site gets the current dataset. Tests
 * provide the fixed 2026-11-09 baseline instead, so data updates never break them.
 */
export const DATASET = new InjectionToken<Dataset>('DATASET', {
  providedIn: 'root',
  factory: () => CURRENT_DATASET,
});

/** localStorage key. Change the suffix only if the saved shape changes incompatibly. */
export const STORAGE_KEY = 'ptc.state.v1';

/** Raw text from the "add a bonus" form. */
export interface BonusDraft {
  readonly cardId: string;
  readonly programId: string;
  /** Percent as typed, for example '30' or '30%'. */
  readonly percent: string;
  /** '' for no end date, otherwise YYYY-MM-DD (what <input type="date"> gives). */
  readonly endDate: string;
}

export type BonusDraftResult =
  | { readonly ok: true; readonly bonus: Omit<Bonus, 'id'> }
  | { readonly ok: false; readonly error: string };

interface SavedState {
  readonly v: 1;
  readonly dataVersion: string;
  readonly balances: Balances;
  readonly settings: Settings;
  readonly bonuses: readonly Bonus[];
  readonly routeOverrides: RouteOverrides;
}

const ZERO_BALANCES: Balances = {
  amex: 0,
  chase: 0,
  citi: 0,
  'capital-one': 0,
  bilt: 0,
  'wells-fargo': 0,
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function findCard(data: Dataset, value: unknown): Card | undefined {
  return data.cards.find((card) => card.id === value);
}

/** Checks the "add a bonus" form and turns it into a bonus. Never throws. */
export function validateBonusDraft(data: Dataset, draft: BonusDraft): BonusDraftResult {
  const card = findCard(data, draft.cardId);
  if (!card) {
    return { ok: false, error: 'Choose a card.' };
  }
  if (!directPartnerIds(data, card.id).includes(draft.programId)) {
    return { ok: false, error: 'Choose a program this card transfers to directly.' };
  }
  const percentText = draft.percent.trim().replace(/%$/, '').trim();
  const percent = percentText === '' ? Number.NaN : Number(percentText);
  if (!Number.isFinite(percent) || percent <= 0 || percent > 1000) {
    return { ok: false, error: 'Enter the bonus as a percent between 1 and 1000, for example 30.' };
  }
  const endText = draft.endDate.trim();
  if (endText !== '' && !isIsoDate(endText)) {
    return { ok: false, error: 'Enter the last day as a date, or leave it empty.' };
  }
  return {
    ok: true,
    bonus: {
      cardId: card.id,
      programId: draft.programId,
      pct: percent / 100,
      endDate: endText === '' ? null : endText,
      sourceId: '',
      builtIn: false,
    },
  };
}

function readBalances(value: unknown): Balances {
  const source = isRecord(value) ? value : {};
  return {
    amex: sanitizeBalance(source['amex']),
    chase: sanitizeBalance(source['chase']),
    citi: sanitizeBalance(source['citi']),
    'capital-one': sanitizeBalance(source['capital-one']),
    bilt: sanitizeBalance(source['bilt']),
    'wells-fargo': sanitizeBalance(source['wells-fargo']),
  };
}

function readSettings(data: Dataset, value: unknown): Settings {
  const source = isRecord(value) ? value : {};
  const fallback = data.defaultSettings;
  const chaseCard = source['chaseCard'];
  const citiTier = source['citiTier'];
  const countBonuses = source['countBonuses'];
  const countBlockBonuses = source['countBlockBonuses'];
  return {
    chaseCard:
      chaseCard === 'reserve' || chaseCard === 'preferred' ? chaseCard : fallback.chaseCard,
    citiTier: citiTier === 'premium' || citiTier === 'other' ? citiTier : fallback.citiTier,
    countBonuses: typeof countBonuses === 'boolean' ? countBonuses : fallback.countBonuses,
    countBlockBonuses:
      typeof countBlockBonuses === 'boolean' ? countBlockBonuses : fallback.countBlockBonuses,
  };
}

/** Keeps only well-formed bonuses for a card and a program that card transfers to directly. */
function readBonuses(data: Dataset, value: unknown): Bonus[] {
  if (!Array.isArray(value)) {
    return [];
  }
  const bonuses: Bonus[] = [];
  const seen = new Set<string>();
  for (const item of value) {
    if (!isRecord(item)) {
      continue;
    }
    const id = item['id'];
    const card = findCard(data, item['cardId']);
    const programId = item['programId'];
    const pct = item['pct'];
    const endDate = item['endDate'];
    const sourceId = item['sourceId'];
    if (
      typeof id !== 'string' ||
      id === '' ||
      seen.has(id) ||
      !card ||
      typeof programId !== 'string' ||
      !directPartnerIds(data, card.id).includes(programId) ||
      typeof pct !== 'number' ||
      !Number.isFinite(pct) ||
      pct <= 0 ||
      !(endDate === null || isIsoDate(endDate))
    ) {
      continue;
    }
    seen.add(id);
    bonuses.push({
      id,
      cardId: card.id,
      programId,
      pct,
      endDate,
      sourceId: typeof sourceId === 'string' ? sourceId : '',
      builtIn: item['builtIn'] === true,
    });
  }
  return bonuses;
}

/** Keeps only switches for routes that exist and that differ from the route's default. */
function readRouteOverrides(data: Dataset, value: unknown): RouteOverrides {
  const overrides: Record<string, boolean> = {};
  if (isRecord(value)) {
    for (const route of data.partnerTransfers) {
      const enabled = value[route.id];
      if (typeof enabled === 'boolean' && enabled !== route.defaultOn) {
        overrides[route.id] = enabled;
      }
    }
  }
  return overrides;
}

function defaultState(data: Dataset): SavedState {
  return {
    v: 1,
    dataVersion: data.version,
    balances: data.exampleBalances,
    settings: data.defaultSettings,
    bonuses: data.builtInBonuses,
    routeOverrides: {},
  };
}

function browserStorage(): Storage | null {
  try {
    return globalThis.localStorage ?? null;
  } catch {
    return null;
  }
}

/** Reads saved state. Anything missing, damaged or out of date falls back to a safe value. */
function loadState(data: Dataset): SavedState {
  let parsed: unknown = null;
  try {
    const raw = browserStorage()?.getItem(STORAGE_KEY);
    parsed = raw ? JSON.parse(raw) : null;
  } catch {
    parsed = null;
  }
  if (!isRecord(parsed) || parsed['v'] !== 1) {
    return defaultState(data);
  }
  const saved = readBonuses(data, parsed['bonuses']);
  // When the built-in data changes, refresh the built-in bonuses and keep the ones the user added.
  const bonuses =
    parsed['dataVersion'] === data.version
      ? saved
      : [...data.builtInBonuses, ...saved.filter((bonus) => !bonus.builtIn)];
  return {
    v: 1,
    dataVersion: data.version,
    balances: readBalances(parsed['balances']),
    settings: readSettings(data, parsed['settings']),
    bonuses,
    routeOverrides: readRouteOverrides(data, parsed['routeOverrides']),
  };
}

/** `?today=YYYY-MM-DD` in the address pins the date (for demos and checks). Otherwise null. */
function pinnedToday(): string | null {
  try {
    const value = new URLSearchParams(globalThis.location?.search ?? '').get('today');
    return isIsoDate(value) ? value : null;
  } catch {
    return null;
  }
}

/**
 * The single source of truth for the page: the built-in data, everything the user can change,
 * and the calculated result. Components read the signals and call the methods; they never keep
 * their own copy of this state and never write it any other way.
 *
 * Every change is saved to this browser's localStorage. Nothing is sent anywhere.
 */
@Service()
export class CalculatorStore {
  /** Cards, programs, ratios, partner transfers, sources: everything that is not user input. */
  readonly data = inject(DATASET);

  private pinnedDate = pinnedToday();
  private readonly initial = loadState(this.data);

  private readonly todayState = signal(this.pinnedDate ?? localIsoDate(new Date()));
  private readonly balancesState = signal<Balances>(this.initial.balances);
  private readonly settingsState = signal<Settings>(this.initial.settings);
  private readonly bonusesState = signal<readonly Bonus[]>(this.initial.bonuses);
  private readonly routeOverridesState = signal<RouteOverrides>(this.initial.routeOverrides);

  /** Today as YYYY-MM-DD. Bonus end dates and the Bilt to Hyatt change are measured against it. */
  readonly today = this.todayState.asReadonly();
  readonly balances = this.balancesState.asReadonly();
  readonly settings = this.settingsState.asReadonly();
  /** Built-in bonuses the user has kept, followed by the ones the user added. */
  readonly bonuses = this.bonusesState.asReadonly();
  readonly routeOverrides = this.routeOverridesState.asReadonly();

  readonly input = computed<EngineInput>(() => ({
    today: this.todayState(),
    balances: this.balancesState(),
    settings: this.settingsState(),
    bonuses: this.bonusesState(),
    routeOverrides: this.routeOverridesState(),
  }));

  /** The whole calculation, recomputed whenever any input changes. */
  readonly result = computed<EngineResult>(() => compute(this.data, this.input()));

  readonly totalBalance = computed(() => totalBalance(this.data, this.balancesState()));

  /** true while the balances are still the example numbers from the first visit. */
  readonly showingExampleBalances = computed(() => {
    const balances = this.balancesState();
    const example = this.data.exampleBalances;
    return this.data.cards.every((card) => balances[card.id] === example[card.id]);
  });

  /** Number of partner transfers whose switch differs from its default. */
  readonly changedRouteCount = computed(() => Object.keys(this.routeOverridesState()).length);

  // ---- Lookups, so components never need to search the dataset themselves. ----

  /** 'Amex', 'Capital One', ... */
  cardName(cardId: CardId): string {
    return this.data.cards.find((card) => card.id === cardId)?.name ?? cardId;
  }

  /** 'British Airways Club', ... Falls back to the id for an unknown program. */
  programName(programId: ProgramId): string {
    return programName(this.data, programId);
  }

  /** 'No route', 'Direct', 'via A' or 'via A > B' for a CardCell.path. */
  pathLabel(path: readonly ProgramId[] | null): string {
    return pathLabel(this.data, path);
  }

  /** The programs a card transfers to directly, in display order. */
  directPartners(cardId: CardId): Program[] {
    return directPartnerIds(this.data, cardId).flatMap((id) => findProgram(this.data, id) ?? []);
  }

  /** The source with this id, or undefined (bonuses the user added have no source). */
  source(sourceId: string): Source | undefined {
    return this.data.sources.find((source) => source.id === sourceId);
  }

  /** true while a bonus has not passed its last day. Reads today(), so it is reactive. */
  isBonusActive(bonus: Bonus): boolean {
    return isBonusActive(bonus, this.todayState());
  }

  // ---- Changes. Each one saves. ----

  /** Accepts numbers or text such as '120,000'. Anything invalid becomes 0. */
  setBalance(cardId: CardId, value: unknown): void {
    this.balancesState.update((balances) => ({ ...balances, [cardId]: sanitizeBalance(value) }));
    this.persist();
  }

  clearBalances(): void {
    this.balancesState.set(ZERO_BALANCES);
    this.persist();
  }

  updateSettings(patch: Partial<Settings>): void {
    this.settingsState.update((settings) => ({ ...settings, ...patch }));
    this.persist();
  }

  setChaseCard(chaseCard: ChaseCard): void {
    this.updateSettings({ chaseCard });
  }

  setCitiTier(citiTier: CitiTier): void {
    this.updateSettings({ citiTier });
  }

  /** Switches one partner transfer on or off. Unknown route ids are ignored. */
  setRouteEnabled(routeId: string, enabled: boolean): void {
    const route = this.data.partnerTransfers.find((candidate) => candidate.id === routeId);
    if (!route) {
      return;
    }
    this.routeOverridesState.update((overrides) => {
      const next: Record<string, boolean> = { ...overrides };
      if (enabled === route.defaultOn) {
        delete next[routeId];
      } else {
        next[routeId] = enabled;
      }
      return next;
    });
    this.persist();
  }

  /** Puts every partner transfer back to its default on/off state. */
  resetRoutes(): void {
    this.routeOverridesState.set({});
    this.persist();
  }

  /** Adds a bonus from the form. Returns an error message to show, or null when it was added. */
  addBonus(draft: BonusDraft): string | null {
    const checked = validateBonusDraft(this.data, draft);
    if (!checked.ok) {
      return checked.error;
    }
    const bonus: Bonus = { ...checked.bonus, id: this.nextBonusId() };
    this.bonusesState.update((bonuses) => [...bonuses, bonus]);
    this.persist();
    return null;
  }

  removeBonus(id: string): void {
    this.bonusesState.update((bonuses) => bonuses.filter((bonus) => bonus.id !== id));
    this.persist();
  }

  /** Brings back the built-in bonus list and removes the bonuses the user added. */
  resetBonuses(): void {
    this.bonusesState.set(this.data.builtInBonuses);
    this.persist();
  }

  /** Back to the first-visit state. Also forgets what was saved in this browser. */
  resetAll(): void {
    const fresh = defaultState(this.data);
    this.balancesState.set(fresh.balances);
    this.settingsState.set(fresh.settings);
    this.bonusesState.set(fresh.bonuses);
    this.routeOverridesState.set(fresh.routeOverrides);
    try {
      browserStorage()?.removeItem(STORAGE_KEY);
    } catch {
      // Nothing to forget if storage is unavailable.
    }
  }

  /** Call when the page becomes visible again, so a tab left open overnight picks up the new date. */
  refreshToday(): void {
    if (this.pinnedDate === null) {
      this.todayState.set(localIsoDate(new Date()));
    }
  }

  /** For tests and demos: pretend today is another date. It stays pinned until the page reloads. */
  setToday(today: string): void {
    if (isIsoDate(today)) {
      this.pinnedDate = today;
      this.todayState.set(today);
    }
  }

  private nextBonusId(): string {
    const used = new Set(this.bonusesState().map((bonus) => bonus.id));
    let counter = 1;
    while (used.has(`user-${counter}`)) {
      counter++;
    }
    return `user-${counter}`;
  }

  private persist(): void {
    const state: SavedState = {
      v: 1,
      dataVersion: this.data.version,
      balances: this.balancesState(),
      settings: this.settingsState(),
      bonuses: this.bonusesState(),
      routeOverrides: this.routeOverridesState(),
    };
    try {
      browserStorage()?.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
      // Private browsing or a full disk: the calculator still works, it just will not remember.
    }
  }
}
````

## `src/app/shared/format.ts`

<!-- FILE src/app/shared/format.ts 0771c6a8a22f -->
````text
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
````

## `src/app/app.config.ts`

<!-- FILE src/app/app.config.ts 0d89d2482b81 -->
````text
import { ApplicationConfig, provideBrowserGlobalErrorListeners } from '@angular/core';

export const appConfig: ApplicationConfig = {
  providers: [provideBrowserGlobalErrorListeners()],
};
````

## `src/app/app.ts`

<!-- FILE src/app/app.ts fdacda94f9bf -->
````text
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
````

## `src/app/app.html`

<!-- FILE src/app/app.html 6e28d6fc5fab -->
````text
<header class="masthead">
  <h1>Points transfer calculator</h1>
  <p class="lede">
    Enter your card points to see how many could reach each airline or hotel program, sent directly
    or through partner-to-partner moves such as Chase to British Airways to Qatar.
  </p>
  <!-- prettier-ignore -->
  <p class="meta">
    Ratios checked {{ checked }}. Today is <span data-testid="today">{{ today() }}</span>. Transfers
    cannot be undone, so confirm in your card's portal first.
  </p>
</header>

<main>
  <div class="inputs">
    <app-balances-panel />
    <app-settings-panel />
  </div>

  <nav class="views" aria-label="Views">
    @for (item of views; track item.id) {
      <button
        type="button"
        class="view-tab"
        [class.is-current]="view() === item.id"
        [attr.aria-current]="view() === item.id ? 'page' : null"
        [attr.data-testid]="'tab-' + item.id"
        (click)="view.set(item.id)"
      >
        {{ item.label }}
      </button>
    }
  </nav>

  @switch (view()) {
    @case ('results') {
      <app-results-view />
    }
    @case ('best-routes') {
      <app-best-routes-view />
    }
    @case ('bonuses') {
      <app-bonuses-view />
    }
    @case ('partner-transfers') {
      <app-partner-transfers-view />
    }
    @case ('card-ratios') {
      <app-card-ratios-view />
    }
    @case ('sources') {
      <app-sources-view />
    }
  }
</main>

<footer>
  <p class="colophon">
    Not affiliated with any bank, airline or hotel. Ratios and bonuses change often. Everything you
    enter is saved in this browser only and is never sent anywhere.
  </p>
</footer>
````

## `src/app/balances/balances-panel.ts`

<!-- FILE src/app/balances/balances-panel.ts 6adc0c50cb52 -->
````text
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
````

## `src/app/balances/balances-panel.html`

<!-- FILE src/app/balances/balances-panel.html 64bd654402c3 -->
````text
<section aria-labelledby="balances-heading">
  <h2 id="balances-heading">Your points</h2>
  <p class="note">Transferable points only: {{ currencies }}.</p>
  <div class="balance-grid">
    @for (field of fields(); track field.id) {
      <div class="field">
        <label [for]="'balance-' + field.id">{{ field.label }}</label>
        <input
          #box
          class="input input-number"
          type="number"
          inputmode="numeric"
          min="0"
          step="1000"
          placeholder="0"
          [id]="'balance-' + field.id"
          [attr.data-testid]="'balance-' + field.id"
          [value]="field.value"
          (input)="store.setBalance(field.id, box.value)"
        />
        <span class="hint">{{ field.echo }}</span>
      </div>
    }
  </div>
  <div class="panel-actions">
    <p class="total">
      All cards: <output data-testid="total-balance">{{ total() }}</output> points
    </p>
    @if (store.showingExampleBalances()) {
      <p class="note" data-testid="example-note">
        These are example balances. Replace them with yours. Your numbers stay in this browser.
      </p>
    }
    <button
      type="button"
      class="button"
      data-testid="clear-balances"
      (click)="store.clearBalances()"
    >
      Clear balances
    </button>
  </div>
</section>
````

## `src/app/settings/settings-panel.ts`

<!-- FILE src/app/settings/settings-panel.ts 99cf8349f226 -->
````text
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
````

## `src/app/settings/settings-panel.html`

<!-- FILE src/app/settings/settings-panel.html 979b24cb7cbe -->
````text
<section aria-labelledby="settings-heading">
  <h2 id="settings-heading">Settings</h2>
  <div class="settings-grid">
    <fieldset class="choice">
      <legend>Chase card</legend>
      <label class="option">
        <input
          type="radio"
          name="chase-card"
          data-testid="setting-chase-reserve"
          [checked]="settings().chaseCard === 'reserve'"
          (change)="store.setChaseCard('reserve')"
        />
        Sapphire Reserve
      </label>
      <label class="option">
        <input
          type="radio"
          name="chase-card"
          data-testid="setting-chase-preferred"
          [checked]="settings().chaseCard === 'preferred'"
          (change)="store.setChaseCard('preferred')"
        />
        Sapphire Preferred or Ink
      </label>
      <p class="hint">Reserve = 1:1 to Hyatt. Preferred or Ink = 4:3 (since Oct 1, 2026).</p>
    </fieldset>

    <fieldset class="choice">
      <legend>Citi card</legend>
      <label class="option">
        <input
          type="radio"
          name="citi-card"
          data-testid="setting-citi-premium"
          [checked]="settings().citiTier === 'premium'"
          (change)="store.setCitiTier('premium')"
        />
        Strata Premier or Strata Elite
      </label>
      <label class="option">
        <input
          type="radio"
          name="citi-card"
          data-testid="setting-citi-other"
          [checked]="settings().citiTier === 'other'"
          (change)="store.setCitiTier('other')"
        />
        Other Citi card
      </label>
      <p class="hint">Other Citi cards get 70% of the Strata ratios.</p>
    </fieldset>

    <div class="choice">
      <label class="option">
        <input
          #countBonuses
          type="checkbox"
          data-testid="setting-count-bonuses"
          [checked]="settings().countBonuses"
          (change)="store.updateSettings({ countBonuses: countBonuses.checked })"
        />
        Count limited-time transfer bonuses
      </label>
      <p class="hint">
        Bonuses are listed under Transfer bonuses and stop counting after their end date.
      </p>
    </div>

    <div class="choice">
      <label class="option">
        <input
          #countBlockBonuses
          type="checkbox"
          data-testid="setting-count-block-bonuses"
          [checked]="settings().countBlockBonuses"
          (change)="store.updateSettings({ countBlockBonuses: countBlockBonuses.checked })"
        />
        Count Marriott and Hyatt block bonuses
      </label>
      <p class="hint">Assumes full 60,000-point Marriott or 50,000-point Hyatt transfers.</p>
    </div>
  </div>

  <fieldset class="choice choice-wide">
    <legend>Routes that need status or a specific card</legend>
    <div class="restricted-grid">
      @for (route of restrictedRoutes(); track route.id) {
        <label class="option">
          <input
            #box
            type="checkbox"
            [attr.data-testid]="'restricted-' + route.id"
            [checked]="route.enabled"
            (change)="store.setRouteEnabled(route.id, box.checked)"
          />
          <span>
            {{ route.label }}
            <span class="hint">{{ route.note }}</span>
          </span>
        </label>
      }
    </div>
    <p class="hint">Every other partner transfer has its own switch under Partner transfers.</p>
  </fieldset>

  <div class="panel-actions">
    @if (confirmingReset()) {
      <p class="note" role="alert">
        Reset balances, settings, bonuses and route switches to their starting values?
      </p>
      <button
        type="button"
        class="button button-danger"
        data-testid="reset-all-confirm"
        (click)="resetEverything()"
      >
        Yes, reset everything
      </button>
      <button type="button" class="button" (click)="confirmingReset.set(false)">Cancel</button>
    } @else {
      <button
        type="button"
        class="button"
        data-testid="reset-all"
        (click)="confirmingReset.set(true)"
      >
        Reset everything
      </button>
    }
  </div>
</section>
````

## `src/app/results/results-view.ts`

<!-- FILE src/app/results/results-view.ts c549fb5a58b3 -->
````text
import { Component, computed, inject, signal } from '@angular/core';

import { CalculatorStore } from '../core/calculator-store';
import { ProgramResult } from '../core/models';
import { formatCount, formatPoints, formatRatio, programKind } from '../shared/format';

type TypeFilter = 'all' | 'airline' | 'other';
type SortKey = 'list' | 'max' | 'added' | 'direct' | 'name';

const SORT_KEYS: readonly SortKey[] = ['list', 'max', 'added', 'direct', 'name'];

function sortValue(result: ProgramResult, key: SortKey): number {
  switch (key) {
    case 'max':
      return result.maxTotal;
    case 'added':
      return result.added;
    case 'direct':
      return result.directTotal;
    default:
      return 0;
  }
}

/**
 * The main table: one row per program, like the spreadsheet's Calculator tab.
 *
 * This file is the pattern for every other view:
 * - inject the store and read everything from it (never import a dataset file);
 * - keep only view state (filter, search text, sort, open rows) in local signals;
 * - build display-ready rows in one computed(), so the template has no logic.
 */
@Component({
  selector: 'app-results-view',
  templateUrl: './results-view.html',
})
export class ResultsView {
  private readonly store = inject(CalculatorStore);

  protected readonly filter = signal<TypeFilter>('all');
  protected readonly query = signal('');
  protected readonly sort = signal<SortKey>('list');
  protected readonly openIds = signal<ReadonlySet<string>>(new Set());

  protected readonly rows = computed(() => {
    const filter = this.filter();
    const query = this.query().trim().toLowerCase();
    const sort = this.sort();
    const openIds = this.openIds();

    const visible = this.store.result().programs.filter((result) => {
      const isAirline = result.program.type === 'airline';
      const typeMatches = filter === 'all' || (filter === 'airline' ? isAirline : !isAirline);
      return typeMatches && result.program.name.toLowerCase().includes(query);
    });
    if (sort === 'name') {
      visible.sort((a, b) => a.program.name.localeCompare(b.program.name));
    } else if (sort !== 'list') {
      // Array.prototype.sort is stable, so ties keep the program list order.
      visible.sort((a, b) => sortValue(b, sort) - sortValue(a, sort));
    }

    return visible.map((result) => {
      const open = openIds.has(result.program.id);
      const cards = result.cells.map((cell) => ({
        id: cell.cardId,
        name: this.store.cardName(cell.cardId),
        balance: formatCount(cell.balance),
        directRatio: formatRatio(cell.directRatio),
        directPoints: formatPoints(cell.directPoints),
        bestRatio: formatRatio(cell.bestRatio),
        route: this.store.pathLabel(cell.path),
        bestPoints: formatPoints(cell.bestPoints),
        adds: cell.addsPoints,
        gain: `+${formatCount(cell.bestPoints - cell.directPoints)}`,
      }));
      return {
        id: result.program.id,
        name: result.program.name,
        kind: programKind(result.program),
        directCards: result.directCardCount,
        direct: formatPoints(result.directTotal),
        max: formatPoints(result.maxTotal),
        added: formatPoints(result.added),
        hasAdded: result.added > 0,
        open,
        toggleLabel: `${open ? 'Hide' : 'Show'} cards for ${result.program.name}`,
        cards,
        // "Partner routes that add points": one chip per card whose best route beats its direct transfer.
        routes: cards.filter((card) => card.adds),
      };
    });
  });

  protected setSort(value: string): void {
    const key = SORT_KEYS.find((candidate) => candidate === value);
    if (key) {
      this.sort.set(key);
    }
  }

  protected toggle(programId: string): void {
    this.openIds.update((current) => {
      const next = new Set(current);
      if (!next.delete(programId)) {
        next.add(programId);
      }
      return next;
    });
  }
}
````

## `src/app/results/results-view.html`

<!-- FILE src/app/results/results-view.html 164db4afe4dc -->
````text
<section aria-labelledby="results-heading">
  <h2 id="results-heading">Points each program could receive</h2>
  <p class="note">
    Each row assumes every card's whole balance goes to that one program, so rows are alternatives
    and cannot be added together. Green marks points added by partner-to-partner moves.
  </p>

  <div class="toolbar">
    <div class="segmented" role="group" aria-label="Program type">
      <button
        type="button"
        data-testid="filter-all"
        [class.is-current]="filter() === 'all'"
        [attr.aria-pressed]="filter() === 'all'"
        (click)="filter.set('all')"
      >
        All programs
      </button>
      <button
        type="button"
        data-testid="filter-airline"
        [class.is-current]="filter() === 'airline'"
        [attr.aria-pressed]="filter() === 'airline'"
        (click)="filter.set('airline')"
      >
        Airlines
      </button>
      <button
        type="button"
        data-testid="filter-other"
        [class.is-current]="filter() === 'other'"
        [attr.aria-pressed]="filter() === 'other'"
        (click)="filter.set('other')"
      >
        Hotels and rail
      </button>
    </div>
    <label class="inline-field">
      Find a program
      <input
        #search
        class="input"
        type="search"
        data-testid="results-search"
        [value]="query()"
        (input)="query.set(search.value)"
      />
    </label>
    <label class="inline-field">
      Sort by
      <select #sortBox class="input" data-testid="results-sort" (change)="setSort(sortBox.value)">
        <option value="list" [selected]="sort() === 'list'">Program list</option>
        <option value="max" [selected]="sort() === 'max'">Max with partner moves</option>
        <option value="added" [selected]="sort() === 'added'">Added by partner moves</option>
        <option value="direct" [selected]="sort() === 'direct'">Direct total</option>
        <option value="name" [selected]="sort() === 'name'">Name</option>
      </select>
    </label>
  </div>

  <div class="table-wrap">
    <table class="data-table" data-testid="results-table">
      <thead>
        <tr>
          <th scope="col">Program</th>
          <th scope="col" class="num">Your cards that transfer directly</th>
          <th scope="col" class="num">Direct total</th>
          <th scope="col" class="num">Max with partner moves</th>
          <th scope="col" class="num">Added by partner moves</th>
          <th scope="col">Partner routes that add points</th>
          <th scope="col">Per card</th>
        </tr>
      </thead>
      <tbody>
        @for (row of rows(); track row.id) {
          <tr [attr.data-testid]="'result-row-' + row.id">
            <th scope="row">
              {{ row.name }}
              <span class="kind">{{ row.kind }}</span>
            </th>
            <td class="num" data-testid="direct-cards">{{ row.directCards }}</td>
            <td class="num" data-testid="direct-total">{{ row.direct }}</td>
            <td class="num strong" data-testid="max-total">{{ row.max }}</td>
            <td class="num" data-testid="added">
              <span [class.gain]="row.hasAdded">{{ row.added }}</span>
            </td>
            <td class="routes-cell" data-testid="routes">
              @for (chip of row.routes; track chip.id) {
                <span class="route-chip">
                  <b>{{ chip.name }}</b> {{ chip.route }}
                  <span class="gain-text">{{ chip.gain }}</span>
                </span>
              }
            </td>
            <td>
              <button
                type="button"
                class="link-button"
                [attr.data-testid]="'details-' + row.id"
                [attr.aria-expanded]="row.open"
                [attr.aria-label]="row.toggleLabel"
                (click)="toggle(row.id)"
              >
                {{ row.open ? 'Hide' : 'Show' }}
              </button>
            </td>
          </tr>
          @if (row.open) {
            <tr class="detail-row" [attr.data-testid]="'detail-' + row.id">
              <td colspan="7">
                <table class="data-table nested">
                  <thead>
                    <tr>
                      <th scope="col">Card</th>
                      <th scope="col" class="num">Your points</th>
                      <th scope="col" class="num">Direct ratio</th>
                      <th scope="col" class="num">Direct points</th>
                      <th scope="col" class="num">Best ratio</th>
                      <th scope="col">Best route</th>
                      <th scope="col" class="num">Best points</th>
                    </tr>
                  </thead>
                  <tbody>
                    @for (card of row.cards; track card.id) {
                      <tr [attr.data-testid]="'detail-' + row.id + '-' + card.id">
                        <th scope="row">{{ card.name }}</th>
                        <td class="num">{{ card.balance }}</td>
                        <td class="num">{{ card.directRatio }}</td>
                        <td class="num">{{ card.directPoints }}</td>
                        <td class="num">{{ card.bestRatio }}</td>
                        <td>{{ card.route }}</td>
                        <td class="num">
                          <span [class.gain]="card.adds">{{ card.bestPoints }}</span>
                        </td>
                      </tr>
                    }
                  </tbody>
                </table>
              </td>
            </tr>
          }
        } @empty {
          <tr>
            <td colspan="7" data-testid="results-empty">No program matches “{{ query() }}”.</td>
          </tr>
        }
      </tbody>
    </table>
  </div>
</section>
````

## `src/app/best-routes/best-routes-view.ts`

<!-- FILE src/app/best-routes/best-routes-view.ts 1b045fa8d648 -->
````text
import { Component, computed, inject } from '@angular/core';

import { CalculatorStore } from '../core/calculator-store';
import { formatRatio } from '../shared/format';

@Component({
  selector: 'app-best-routes-view',
  templateUrl: './best-routes-view.html',
})
export class BestRoutesView {
  private readonly store = inject(CalculatorStore);

  protected readonly cards = this.store.data.cards;

  protected readonly rows = computed(() =>
    this.store.result().programs.map((result) => ({
      id: result.program.id,
      name: result.program.name,
      cells: result.cells.map((cell) => ({
        cardId: cell.cardId,
        ratio: formatRatio(cell.bestRatio),
        route: this.store.pathLabel(cell.path),
        viaPartner: cell.path !== null && cell.path.length > 0,
        none: cell.path === null,
      })),
    })),
  );
}
````

## `src/app/best-routes/best-routes-view.html`

<!-- FILE src/app/best-routes/best-routes-view.html eaca59b14fb0 -->
````text
<section aria-labelledby="best-routes-heading">
  <h2 id="best-routes-heading">Best route from each card</h2>
  <p class="note">
    Ratio = points in this program for 1 card point, using the best path with up to two partner
    moves. “via X” = send card points to X, then move them here. “via X &gt; Y” = two moves.
  </p>
  <div class="table-wrap">
    <table class="data-table matrix" data-testid="best-routes-table">
      <thead>
        <tr>
          <th scope="col">Program</th>
          @for (card of cards; track card.id) {
            <th scope="col">{{ card.name }}</th>
          }
        </tr>
      </thead>
      <tbody>
        @for (row of rows(); track row.id) {
          <tr [attr.data-testid]="'best-row-' + row.id">
            <th scope="row">{{ row.name }}</th>
            @for (cell of row.cells; track cell.cardId) {
              <td
                [class.via]="cell.viaPartner"
                [class.muted]="cell.none"
                [attr.data-testid]="'best-' + row.id + '-' + cell.cardId"
              >
                <span class="cell-main">{{ cell.ratio }}</span>
                <span class="cell-sub">{{ cell.route }}</span>
              </td>
            }
          </tr>
        }
      </tbody>
    </table>
  </div>
</section>
````

## `src/app/bonuses/bonuses-view.ts`

<!-- FILE src/app/bonuses/bonuses-view.ts 6fd7702c84a8 -->
````text
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
````

## `src/app/bonuses/bonuses-view.html`

<!-- FILE src/app/bonuses/bonuses-view.html b390504208f9 -->
````text
<section aria-labelledby="bonuses-heading">
  <h2 id="bonuses-heading">Card transfer bonuses</h2>
  <p class="note">
    A bonus adds extra points when you transfer from a card to one of its partners. It counts
    through its end date. Add any bonus your card is offering, and remove the ones you do not want
    counted.
  </p>

  <form class="bonus-form" novalidate (submit)="add($event)">
    <label class="inline-field">
      Card
      <select #cardBox class="input" data-testid="bonus-card" (change)="chooseCard(cardBox.value)">
        @for (card of cards; track card.id) {
          <option [value]="card.id" [selected]="card.id === cardId()">{{ card.name }}</option>
        }
      </select>
    </label>
    <label class="inline-field">
      Program
      <select
        #programBox
        class="input"
        data-testid="bonus-program"
        (change)="programId.set(programBox.value)"
      >
        @for (option of programOptions(); track option.id) {
          <option [value]="option.id" [selected]="option.id === programId()">
            {{ option.name }}
          </option>
        }
      </select>
    </label>
    <label class="inline-field">
      Bonus %
      <input
        #percentBox
        class="input input-number input-short"
        type="number"
        inputmode="decimal"
        min="1"
        step="1"
        placeholder="30"
        data-testid="bonus-percent"
        [value]="percent()"
        (input)="percent.set(percentBox.value)"
      />
    </label>
    <label class="inline-field">
      Last day (optional)
      <input
        #endBox
        class="input"
        type="date"
        data-testid="bonus-end"
        [value]="endDate()"
        (input)="endDate.set(endBox.value)"
      />
    </label>
    <button type="submit" class="button button-primary" data-testid="bonus-add">Add bonus</button>
  </form>
  @if (error(); as message) {
    <p class="error" role="alert" data-testid="bonus-error">{{ message }}</p>
  }

  <div class="table-wrap">
    <table class="data-table" data-testid="bonuses-table">
      <thead>
        <tr>
          <th scope="col">Card</th>
          <th scope="col">Program</th>
          <th scope="col" class="num">Bonus</th>
          <th scope="col">Last day</th>
          <th scope="col">Status</th>
          <th scope="col">Source</th>
          <th scope="col">Remove</th>
        </tr>
      </thead>
      <tbody>
        @for (row of rows(); track row.id) {
          <tr [attr.data-testid]="'bonus-row-' + row.id" [class.muted]="!row.counted">
            <th scope="row">{{ row.card }}</th>
            <td>{{ row.program }}</td>
            <td class="num">{{ row.bonus }}</td>
            <td>{{ row.lastDay }}</td>
            <td data-testid="bonus-status">{{ row.status }}</td>
            <td>
              @if (row.sourceUrl; as url) {
                <a [href]="url" target="_blank" rel="noopener noreferrer">{{ row.sourceLabel }}</a>
              } @else {
                {{ row.sourceLabel }}
              }
            </td>
            <td>
              <button
                type="button"
                class="link-button"
                [attr.data-testid]="'bonus-remove-' + row.id"
                [attr.aria-label]="row.removeLabel"
                (click)="store.removeBonus(row.id)"
              >
                Remove
              </button>
            </td>
          </tr>
        } @empty {
          <tr>
            <td colspan="7" data-testid="bonuses-empty">
              No bonuses listed. Add one above, or bring back the built-in list.
            </td>
          </tr>
        }
      </tbody>
    </table>
  </div>

  <div class="panel-actions">
    <button type="button" class="button" data-testid="bonus-reset" (click)="store.resetBonuses()">
      Bring back the built-in list
    </button>
    <p class="note">This also removes bonuses you added.</p>
  </div>
</section>
````

## `src/app/partner-transfers/partner-transfers-view.ts`

<!-- FILE src/app/partner-transfers/partner-transfers-view.ts 603ff0bb318c -->
````text
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
````

## `src/app/partner-transfers/partner-transfers-view.html`

<!-- FILE src/app/partner-transfers/partner-transfers-view.html e1bce38537b7 -->
````text
<section aria-labelledby="partner-transfers-heading">
  <h2 id="partner-transfers-heading">Partner-to-partner transfers</h2>
  <p class="note">
    Moves you can make once points are in an airline or hotel program. Untick a route to leave it
    out of the calculation. Routes that need status or a specific card start unticked.
  </p>

  <div class="toolbar">
    <label class="inline-field">
      Find a program
      <input
        #search
        class="input"
        type="search"
        data-testid="routes-search"
        [value]="query()"
        (input)="query.set(search.value)"
      />
    </label>
    <button
      type="button"
      class="button"
      data-testid="routes-reset"
      [disabled]="changed() === 0"
      (click)="store.resetRoutes()"
    >
      Reset switches ({{ changed() }} changed)
    </button>
  </div>

  <div class="table-wrap">
    <table class="data-table" data-testid="routes-table">
      <thead>
        <tr>
          <th scope="col">Use</th>
          <th scope="col">From</th>
          <th scope="col">To</th>
          <th scope="col" class="num">Partner points per point</th>
          <th scope="col">Bonus per block</th>
          <th scope="col" class="num">Ratio used</th>
          <th scope="col">Notes</th>
          <th scope="col">Source</th>
        </tr>
      </thead>
      <tbody>
        @for (row of rows(); track row.id) {
          <tr [attr.data-testid]="'route-row-' + row.id" [class.muted]="!row.enabled">
            <td>
              <input
                #box
                type="checkbox"
                [attr.data-testid]="'route-toggle-' + row.id"
                [attr.aria-label]="'Use ' + row.from + ' to ' + row.to"
                [checked]="row.enabled"
                (change)="store.setRouteEnabled(row.id, box.checked)"
              />
            </td>
            <th scope="row">{{ row.from }}</th>
            <td>{{ row.to }}</td>
            <td class="num">{{ row.ratio }}</td>
            <td>{{ row.block }}</td>
            <td class="num" data-testid="ratio-used">{{ row.ratioUsed }}</td>
            <td>{{ row.note }}</td>
            <td>
              @if (row.sourceUrl; as url) {
                <a [href]="url" target="_blank" rel="noopener noreferrer">{{ row.sourceLabel }}</a>
              }
            </td>
          </tr>
        } @empty {
          <tr>
            <td colspan="8">No transfer matches “{{ query() }}”.</td>
          </tr>
        }
      </tbody>
    </table>
  </div>
</section>
````

## `src/app/card-ratios/card-ratios-view.ts`

<!-- FILE src/app/card-ratios/card-ratios-view.ts 6b619469e155 -->
````text
import { Component, computed, inject } from '@angular/core';

import { CalculatorStore } from '../core/calculator-store';
import { formatPercent, formatRatio, programKind } from '../shared/format';

@Component({
  selector: 'app-card-ratios-view',
  templateUrl: './card-ratios-view.html',
})
export class CardRatiosView {
  private readonly store = inject(CalculatorStore);

  protected readonly cards = this.store.data.cards;
  protected readonly notes = this.store.data.cardRatioNotes;

  protected readonly rows = computed(() =>
    this.store.result().programs.map((result) => ({
      id: result.program.id,
      name: result.program.name,
      kind: programKind(result.program),
      cells: result.cells.map((cell) => {
        // Compare what the spreadsheet called "standard ratio" with "ratio used in calculations".
        const adjusted = Math.abs(cell.directRatio - cell.baseRatio) > 1e-9;
        return {
          cardId: cell.cardId,
          base: cell.baseRatio > 0 ? formatRatio(cell.baseRatio) : '',
          used: !adjusted
            ? ''
            : cell.bonusPct > 0
              ? `${formatRatio(cell.directRatio)} with ${formatPercent(cell.bonusPct)} bonus`
              : `${formatRatio(cell.directRatio)} on your card`,
          boosted: adjusted && cell.bonusPct > 0,
        };
      }),
    })),
  );
}
````

## `src/app/card-ratios/card-ratios-view.html`

<!-- FILE src/app/card-ratios/card-ratios-view.html 680a306db487 -->
````text
<section aria-labelledby="card-ratios-heading">
  <h2 id="card-ratios-heading">Card transfer ratios</h2>
  <p class="note">
    Partner points you get for 1 card point. Blank = no direct transfer. A second line shows the
    ratio used in the calculation when your card type or an active bonus changes it.
  </p>
  <div class="table-wrap">
    <table class="data-table matrix" data-testid="card-ratios-table">
      <thead>
        <tr>
          <th scope="col">Program</th>
          <th scope="col">Type</th>
          @for (card of cards; track card.id) {
            <th scope="col">{{ card.name }}</th>
          }
        </tr>
      </thead>
      <tbody>
        @for (row of rows(); track row.id) {
          <tr [attr.data-testid]="'ratio-row-' + row.id">
            <th scope="row">{{ row.name }}</th>
            <td>{{ row.kind }}</td>
            @for (cell of row.cells; track cell.cardId) {
              <td [attr.data-testid]="'ratio-' + row.id + '-' + cell.cardId">
                <span class="cell-main">{{ cell.base }}</span>
                @if (cell.used) {
                  <span class="cell-sub" [class.gain-text]="cell.boosted">{{ cell.used }}</span>
                }
              </td>
            }
          </tr>
        }
      </tbody>
    </table>
  </div>
  <ul class="notes">
    @for (note of notes; track note) {
      <li>{{ note }}</li>
    }
  </ul>
</section>
````

## `src/app/sources/sources-view.ts`

<!-- FILE src/app/sources/sources-view.ts 9a53feb7c1f1 -->
````text
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
````

## `src/app/sources/sources-view.html`

<!-- FILE src/app/sources/sources-view.html 7ddc6348fe75 -->
````text
<section aria-labelledby="sources-heading">
  <h2 id="sources-heading">Sources</h2>
  <p class="note">
    Ratios, partner lists and built-in bonuses were checked on {{ checked }}. Programs change them
    without much notice, so confirm in your card's own transfer page before moving points.
  </p>
  <div class="table-wrap">
    <table class="data-table" data-testid="sources-table">
      <thead>
        <tr>
          <th scope="col">Source</th>
          <th scope="col">Used for</th>
        </tr>
      </thead>
      <tbody>
        @for (source of sources; track source.id) {
          <tr>
            <th scope="row">
              <a [href]="source.url" target="_blank" rel="noopener noreferrer">{{
                source.label
              }}</a>
            </th>
            <td>{{ source.usedFor }}</td>
          </tr>
        }
      </tbody>
    </table>
  </div>
</section>
````

## `src/app/core/engine.fixtures.ts`

<!-- FILE src/app/core/engine.fixtures.ts 071736cb5604 -->
````text
import { DATASET_2026_11_09 as DATA } from './datasets/dataset-2026-11-09';
import { Bonus, CardId, EngineInput, ProgramId } from './models';

// Expected results for engine.spec.ts, for the 2026-11-09 dataset. They were produced by a separate
// re-implementation of the spreadsheet formulas, and scenario A was also checked cell by cell
// against the live Google Sheet. Do not edit by hand, and never regenerate from engine.ts: the
// point of this file is that it does not come from the code it checks.

/**
 * One program: [programId, direct ratio per card, best ratio per card, path per card, direct total, max total].
 * Per-card arrays follow the dataset's card order. A path of null means the card cannot reach the program.
 */
export type ExpectedRow = readonly [
  ProgramId,
  readonly number[],
  readonly number[],
  readonly (readonly ProgramId[] | null)[],
  number,
  number,
];

export interface Scenario {
  readonly name: string;
  readonly input: EngineInput;
  readonly expected: readonly ExpectedRow[];
}

function userBonus(
  id: string,
  cardId: CardId,
  programId: ProgramId,
  pct: number,
  endDate: string | null,
): Bonus {
  return { id, cardId, programId, pct, endDate, sourceId: '', builtIn: false };
}

const DEFAULTS = {
  balances: DATA.exampleBalances,
  settings: DATA.defaultSettings,
  bonuses: DATA.builtInBonuses,
  routeOverrides: {},
};

const A: Scenario = {
  name: 'A: default settings on 2026-11-09 (every built-in bonus active)',
  input: { ...DEFAULTS, today: '2026-11-09' },
  // prettier-ignore
  expected: [
    ['aer-lingus', [1, 1, 0, 0, 1, 1], [1, 1.3, 1, 1, 1, 1], [[], ['british-airways'], ['qatar'], ['british-airways'], [], []], 255000, 397000],
    ['aeromexico', [1.6, 0, 0, 1, 0, 0], [1.6, 0.675, 0.39, 1, 0.9, 0.39], [[], ['hyatt'], ['virgin-atlantic', 'hilton'], [], ['hyatt'], ['virgin-atlantic', 'hilton']], 267000, 376200],
    ['aeroplan', [1, 1, 0, 1, 1, 0], [1, 1, 0.3125, 1, 1, 0.20833333333333331], [[], [], ['krisflyer', 'marriott'], [], [], ['cathay', 'marriott']], 315000, 330625],
    ['flying-blue', [1, 1, 1, 1.2, 1, 1], [1, 1, 1, 1.2, 1, 1], [[], [], [], [], [], []], 385000, 385000],
    ['atmos', [0, 0, 0, 0, 1, 0], [0.5625, 0.41666666666666663, 0.3125, 0.3125, 1, 0.20833333333333331], [['marriott'], ['marriott'], ['krisflyer', 'marriott'], ['krisflyer', 'marriott'], [], ['cathay', 'marriott']], 30000, 174063],
    ['aadvantage', [0, 0, 1, 0, 0, 0], [0.45, 0.36000000000000004, 1, 0.25, 0.4, 0.16666666666666666], [['marriott'], ['ihg'], [], ['krisflyer', 'marriott'], ['hyatt'], ['cathay', 'marriott']], 40000, 159650],
    ['ana', [1, 0, 0, 0, 0, 0], [1, 0.41666666666666663, 0.3125, 0.3125, 0.5, 0.20833333333333331], [[], ['marriott'], ['krisflyer', 'marriott'], ['krisflyer', 'marriott'], ['hyatt'], ['cathay', 'marriott']], 120000, 211563],
    ['lifemiles', [1, 0, 1, 1, 1, 1], [1, 0.36000000000000004, 1, 1, 1, 1], [[], ['ihg'], [], [], [], []], 280000, 312400],
    ['british-airways', [1, 1.3, 0, 1, 1, 1], [1, 1.3, 1, 1, 1, 1], [[], [], ['qatar'], [], [], []], 357000, 397000],
    ['cathay', [0.8, 0, 1.1, 1, 1, 1], [0.8, 0.41666666666666663, 1.1, 1, 1, 1], [[], ['marriott'], [], [], [], []], 260000, 297500],
    ['copa', [0, 0, 0, 0.9750000000000001, 0, 0], [0.5625, 0.41666666666666663, 0.3125, 0.9750000000000001, 0.41666666666666663, 0.20833333333333331], [['marriott'], ['marriott'], ['krisflyer', 'marriott'], [], ['marriott'], ['cathay', 'marriott']], 73125, 206250],
    ['delta', [1, 0, 0, 0, 0, 0], [1, 0.375, 0.25, 0.25, 0.5, 0.16666666666666666], [[], ['hyatt'], ['accor'], ['accor'], ['hyatt'], ['cathay', 'marriott']], 120000, 200000],
    ['emirates', [0.8, 0, 0.8, 0.75, 1, 0], [0.8, 0.41666666666666663, 0.8, 0.75, 1, 0.20833333333333331], [[], ['marriott'], [], [], [], ['cathay', 'marriott']], 214250, 254875],
    ['etihad', [0, 0, 1, 1, 1, 0], [0.5625, 0.41666666666666663, 1, 1, 1, 0.20833333333333331], [['marriott'], ['marriott'], [], [], [], ['cathay', 'marriott']], 145000, 253125],
    ['eva', [0, 0, 1, 0.75, 0, 0], [0.2, 0.15000000000000002, 1, 0.75, 0.15000000000000002, 0.15000000000000002], [['hilton'], ['virgin-atlantic', 'hilton'], [], [], ['virgin-atlantic', 'hilton'], ['virgin-atlantic', 'hilton']], 96250, 140500],
    ['finnair', [0, 0, 0, 1, 0, 0], [1, 1.3, 1, 1, 1, 1], [['british-airways'], ['british-airways'], ['qatar'], [], ['british-airways'], ['british-airways']], 75000, 397000],
    ['iberia', [1, 1, 0, 0, 1, 1], [1, 1.3, 1, 1, 1, 1], [[], ['british-airways'], ['qatar'], ['british-airways'], [], []], 255000, 397000],
    ['jal', [0, 0, 1, 0.75, 1, 0], [0.5625, 0.41666666666666663, 1, 0.75, 1, 0.20833333333333331], [['marriott'], ['marriott'], [], [], [], ['cathay', 'marriott']], 126250, 234375],
    ['jetblue', [0.8, 1, 1, 0.6, 1, 1], [0.8, 1, 1, 0.6, 1, 1], [[], [], [], [], [], []], 316000, 316000],
    ['korean', [0, 0, 0, 0, 0, 0], [0.5625, 0.41666666666666663, 0.3125, 0.3125, 0.5, 0.20833333333333331], [['marriott'], ['marriott'], ['krisflyer', 'marriott'], ['krisflyer', 'marriott'], ['hyatt'], ['cathay', 'marriott']], 0, 159063],
    ['qantas', [1, 0, 1, 1, 0, 0], [1, 0.43499999999999994, 1, 1, 0.8333333333333333, 0.3125], [[], ['hyatt'], [], [], ['accor'], ['flying-blue', 'accor']], 235000, 303838],
    ['qatar', [1, 0, 1, 1, 1, 0], [1, 1.3, 1, 1, 1, 1], [[], ['british-airways'], [], [], [], ['british-airways']], 265000, 397000],
    ['krisflyer', [1, 1, 1, 1, 0, 0], [1, 1, 1, 1, 0.5, 0.4], [[], [], [], [], ['hyatt'], ['wyndham']], 325000, 346000],
    ['southwest', [0, 1, 0, 0, 1, 0], [0.5625, 1, 0.3125, 0.3125, 1, 0.20833333333333331], [['marriott'], [], ['krisflyer', 'marriott'], ['krisflyer', 'marriott'], [], ['cathay', 'marriott']], 120000, 226563],
    ['tap', [0, 0, 0, 1, 1, 0], [0.5625, 0.41666666666666663, 0.3125, 1, 1, 0.20833333333333331], [['marriott'], ['marriott'], ['krisflyer', 'marriott'], [], [], ['cathay', 'marriott']], 105000, 225625],
    ['thai', [0, 0, 1, 0, 0, 0], [0.5625, 0.41666666666666663, 1, 0.3125, 0.5, 0.20833333333333331], [['marriott'], ['marriott'], [], ['krisflyer', 'marriott'], ['hyatt'], ['cathay', 'marriott']], 40000, 186563],
    ['turkish', [0, 0, 1, 1, 1, 0], [0.5625, 0.41666666666666663, 1, 1, 1, 0.20833333333333331], [['marriott'], ['marriott'], [], [], [], ['cathay', 'marriott']], 145000, 253125],
    ['united', [0, 1, 0, 0, 1, 0], [0.675, 1, 0.375, 0.375, 1, 0.25], [['marriott'], [], ['krisflyer', 'marriott'], ['krisflyer', 'marriott'], [], ['cathay', 'marriott']], 120000, 247875],
    ['virgin-atlantic', [1.3, 1, 1, 1.3, 1, 1], [1.3, 1, 1, 1.3, 1, 1], [[], [], [], [], [], []], 428500, 428500],
    ['virgin-red', [0, 0, 0, 1.3, 0, 1], [1.3, 1, 1, 1.3, 1, 1], [['virgin-atlantic'], ['virgin-atlantic'], ['virgin-atlantic'], [], ['virgin-atlantic'], []], 112500, 428500],
    ['marriott', [1.35, 1, 0, 0, 1, 0], [1.35, 1, 0.75, 0.75, 1, 0.5], [[], [], ['krisflyer'], ['krisflyer'], [], ['cathay']], 282000, 375750],
    ['hilton', [2, 0, 0, 0, 1, 0], [2, 1.5, 1.5, 1.9500000000000002, 1.5, 1.5], [[], ['virgin-atlantic'], ['virgin-atlantic'], ['virgin-atlantic'], ['virgin-atlantic'], ['virgin-atlantic']], 270000, 648750],
    ['hyatt', [0, 0.75, 0, 0, 1, 0], [0, 0.75, 0, 0, 1, 0], [null, [], null, null, [], null], 97500, 97500],
    ['ihg', [0, 1.8, 0, 0, 1, 0], [0, 1.8, 0, 0, 1, 0], [null, [], null, null, [], null], 192000, 192000],
    ['accor', [0, 0, 0.5, 0.5, 0.6666666666666666, 0], [0.2857142857142857, 0.37142857142857144, 0.5, 0.5, 0.6666666666666666, 0.2857142857142857], [['qatar'], ['british-airways', 'qatar'], [], [], [], ['british-airways', 'qatar']], 77500, 149501],
    ['wyndham', [0, 1, 1, 1, 1, 2], [0, 1, 1, 1, 1, 2], [null, [], [], [], [], []], 265000, 265000],
    ['choice', [1, 0, 1.5, 1, 0, 2], [1, 0, 1.5, 1, 0, 2], [[], null, [], [], null, []], 285000, 285000],
    ['i-prefer', [0, 0, 2, 2, 2, 0], [0, 0, 2, 2, 2, 0], [null, null, [], [], [], null], 290000, 290000],
    ['leaders-club', [0.25, 0, 0.2, 0, 0, 0], [0.25, 0, 0.2, 0, 0, 0], [[], null, [], null, null, null], 38000, 38000],
    ['amtrak', [0, 0, 0, 0, 0.5, 0], [0, 0, 0, 0, 0.5, 0], [null, null, null, null, [], null], 15000, 15000],
  ],
};

const B: Scenario = {
  name: 'B: every setting flipped (Chase Reserve, other Citi card, no bonuses, no block bonuses)',
  input: {
    ...DEFAULTS,
    today: '2026-11-09',
    settings: {
      chaseCard: 'reserve',
      citiTier: 'other',
      countBonuses: false,
      countBlockBonuses: false,
    },
  },
  // prettier-ignore
  expected: [
    ['aer-lingus', [1, 1, 0, 0, 1, 1], [1, 1, 0.7, 1, 1, 1], [[], [], ['qatar'], ['british-airways'], [], []], 255000, 358000],
    ['aeromexico', [1.6, 0, 0, 1, 0, 0], [1.6, 0.8, 0.27299999999999996, 1, 0.8, 0.39], [[], ['hyatt'], ['virgin-atlantic', 'hilton'], [], ['hyatt'], ['virgin-atlantic', 'hilton']], 267000, 379770],
    ['aeroplan', [1, 1, 0, 1, 1, 0], [1, 1, 0.175, 1, 1, 0.16666666666666666], [[], [], ['accor'], [], [], ['cathay', 'marriott']], 315000, 324500],
    ['flying-blue', [1, 1, 0.7, 1, 1, 1], [1, 1, 0.7, 1, 1, 1], [[], [], [], [], [], []], 358000, 358000],
    ['atmos', [0, 0, 0, 0, 1, 0], [0.3333333333333333, 0.3333333333333333, 0.17499999999999996, 0.25, 1, 0.16666666666666666], [['marriott'], ['marriott'], ['krisflyer', 'marriott'], ['krisflyer', 'marriott'], [], ['cathay', 'marriott']], 30000, 128250],
    ['aadvantage', [0, 0, 0.7, 0, 0, 0], [0.3333333333333333, 0.4, 0.7, 0.25, 0.4, 0.16666666666666666], [['marriott'], ['hyatt'], [], ['krisflyer', 'marriott'], ['hyatt'], ['cathay', 'marriott']], 28000, 137250],
    ['ana', [1, 0, 0, 0, 0, 0], [1, 0.4, 0.17499999999999996, 0.25, 0.4, 0.16666666666666666], [[], ['hyatt'], ['krisflyer', 'marriott'], ['krisflyer', 'marriott'], ['hyatt'], ['cathay', 'marriott']], 120000, 196250],
    ['lifemiles', [1, 0, 0.7, 1, 1, 1], [1, 0.3333333333333333, 0.7, 1, 1, 1], [[], ['marriott'], [], [], [], []], 268000, 298000],
    ['british-airways', [1, 1, 0, 1, 1, 1], [1, 1, 0.7, 1, 1, 1], [[], [], ['qatar'], [], [], []], 330000, 358000],
    ['cathay', [0.8, 0, 0.7, 1, 1, 1], [0.8, 0.4, 0.7, 1, 1, 1], [[], ['hyatt'], [], [], [], []], 244000, 280000],
    ['copa', [0, 0, 0, 0.75, 0, 0], [0.3333333333333333, 0.3333333333333333, 0.17499999999999996, 0.75, 0.3333333333333333, 0.16666666666666666], [['marriott'], ['marriott'], ['krisflyer', 'marriott'], [], ['marriott'], ['cathay', 'marriott']], 56250, 145750],
    ['delta', [1, 0, 0, 0, 0, 0], [1, 0.4, 0.175, 0.25, 0.4, 0.16666666666666666], [[], ['hyatt'], ['accor'], ['accor'], ['hyatt'], ['cathay', 'marriott']], 120000, 196250],
    ['emirates', [0.8, 0, 0.5599999999999999, 0.75, 1, 0], [0.8, 0.4, 0.5599999999999999, 0.75, 1, 0.16666666666666666], [[], ['hyatt'], [], [], [], ['cathay', 'marriott']], 204650, 243150],
    ['etihad', [0, 0, 0.7, 1, 1, 0], [0.3333333333333333, 0.4, 0.7, 1, 1, 0.16666666666666666], [['marriott'], ['hyatt'], [], [], [], ['cathay', 'marriott']], 133000, 211500],
    ['eva', [0, 0, 0.7, 0.75, 0, 0], [0.2, 0.15000000000000002, 0.7, 0.75, 0.15000000000000002, 0.15000000000000002], [['hilton'], ['virgin-atlantic', 'hilton'], [], [], ['virgin-atlantic', 'hilton'], ['virgin-atlantic', 'hilton']], 84250, 128500],
    ['finnair', [0, 0, 0, 1, 0, 0], [1, 1, 0.7, 1, 1, 1], [['british-airways'], ['british-airways'], ['qatar'], [], ['british-airways'], ['british-airways']], 75000, 358000],
    ['iberia', [1, 1, 0, 0, 1, 1], [1, 1, 0.7, 1, 1, 1], [[], [], ['qatar'], ['british-airways'], [], []], 255000, 358000],
    ['jal', [0, 0, 0.7, 0.75, 1, 0], [0.3333333333333333, 0.4, 0.7, 0.75, 1, 0.16666666666666666], [['marriott'], ['hyatt'], [], [], [], ['cathay', 'marriott']], 114250, 192750],
    ['jetblue', [0.8, 1, 0.7, 0.6, 1, 1], [0.8, 1, 0.7, 0.6, 1, 1], [[], [], [], [], [], []], 304000, 304000],
    ['korean', [0, 0, 0, 0, 0, 0], [0.3333333333333333, 0.4, 0.175, 0.25, 0.4, 0.16666666666666666], [['marriott'], ['hyatt'], ['accor'], ['accor'], ['hyatt'], ['cathay', 'marriott']], 0, 116250],
    ['qantas', [1, 0, 0.7, 1, 0, 0], [1, 0.48, 0.7, 1, 0.8333333333333333, 0.3125], [[], ['hyatt'], [], [], ['accor'], ['flying-blue', 'accor']], 223000, 295888],
    ['qatar', [1, 0, 0.7, 1, 1, 0], [1, 1, 0.7, 1, 1, 1], [[], ['british-airways'], [], [], [], ['british-airways']], 253000, 358000],
    ['krisflyer', [1, 1, 0.7, 1, 0, 0], [1, 1, 0.7, 1, 0.4, 0.4], [[], [], [], [], ['hyatt'], ['wyndham']], 313000, 331000],
    ['southwest', [0, 1, 0, 0, 1, 0], [0.3333333333333333, 1, 0.17499999999999996, 0.25, 1, 0.16666666666666666], [['marriott'], [], ['krisflyer', 'marriott'], ['krisflyer', 'marriott'], [], ['cathay', 'marriott']], 120000, 188250],
    ['tap', [0, 0, 0, 1, 1, 0], [0.3333333333333333, 0.3333333333333333, 0.175, 1, 1, 0.16666666666666666], [['marriott'], ['marriott'], ['accor'], [], [], ['cathay', 'marriott']], 105000, 184500],
    ['thai', [0, 0, 0.7, 0, 0, 0], [0.3333333333333333, 0.4, 0.7, 0.25, 0.4, 0.16666666666666666], [['marriott'], ['hyatt'], [], ['accor'], ['hyatt'], ['cathay', 'marriott']], 28000, 137250],
    ['turkish', [0, 0, 0.7, 1, 1, 0], [0.3333333333333333, 0.3333333333333333, 0.7, 1, 1, 0.16666666666666666], [['marriott'], ['marriott'], [], [], [], ['cathay', 'marriott']], 133000, 205500],
    ['united', [0, 1, 0, 0, 1, 0], [0.3333333333333333, 1, 0.175, 0.25, 1, 0.16666666666666666], [['marriott'], [], ['accor'], ['accor'], [], ['cathay', 'marriott']], 120000, 188250],
    ['virgin-atlantic', [1, 1, 0.7, 1, 1, 1], [1, 1, 0.7, 1, 1, 1], [[], [], [], [], [], []], 358000, 358000],
    ['virgin-red', [0, 0, 0, 1, 0, 1], [1, 1, 0.7, 1, 1, 1], [['virgin-atlantic'], ['virgin-atlantic'], ['virgin-atlantic'], [], ['virgin-atlantic'], []], 90000, 358000],
    ['marriott', [1, 1, 0, 0, 1, 0], [1, 1, 0.5249999999999999, 0.75, 1, 0.5], [[], [], ['krisflyer'], ['krisflyer'], [], ['cathay']], 240000, 324750],
    ['hilton', [2, 0, 0, 0, 1, 0], [2, 1.5, 1.0499999999999998, 1.5, 1.5, 1.5], [[], ['virgin-atlantic'], ['virgin-atlantic'], ['virgin-atlantic'], ['virgin-atlantic'], ['virgin-atlantic']], 270000, 597000],
    ['hyatt', [0, 1, 0, 0, 1, 0], [0, 1, 0, 0, 1, 0], [null, [], null, null, [], null], 120000, 120000],
    ['ihg', [0, 1, 0, 0, 1, 0], [0, 1, 0, 0, 1, 0], [null, [], null, null, [], null], 120000, 120000],
    ['accor', [0, 0, 0.35, 0.5, 0.6666666666666666, 0], [0.2857142857142857, 0.2857142857142857, 0.35, 0.5, 0.6666666666666666, 0.2857142857142857], [['qatar'], ['british-airways', 'qatar'], [], [], [], ['british-airways', 'qatar']], 71500, 135786],
    ['wyndham', [0, 1, 0.7, 1, 1, 2], [0, 1, 0.7, 1, 1, 2], [null, [], [], [], [], []], 253000, 253000],
    ['choice', [1, 0, 1.0499999999999998, 1, 0, 2], [1, 0, 1.0499999999999998, 1, 0, 2], [[], null, [], [], null, []], 267000, 267000],
    ['i-prefer', [0, 0, 1.4, 2, 2, 0], [0, 0, 1.4, 2, 2, 0], [null, null, [], [], [], null], 266000, 266000],
    ['leaders-club', [0.25, 0, 0.13999999999999999, 0, 0, 0], [0.25, 0, 0.13999999999999999, 0, 0, 0], [[], null, [], null, null, null], 35600, 35600],
    ['amtrak', [0, 0, 0, 0, 0.5, 0], [0, 0, 0, 0, 0.5, 0], [null, null, null, null, [], null], 15000, 15000],
  ],
};

const C: Scenario = {
  name: 'C: default settings on 2027-01-15 (built-in bonuses ended, Bilt to Hyatt at 4:3)',
  input: { ...DEFAULTS, today: '2027-01-15' },
  // prettier-ignore
  expected: [
    ['aer-lingus', [1, 1, 0, 0, 1, 1], [1, 1, 1, 1, 1, 1], [[], [], ['qatar'], ['british-airways'], [], []], 255000, 370000],
    ['aeromexico', [1.6, 0, 0, 1, 0, 0], [1.6, 0.675, 0.39, 1, 0.675, 0.39], [[], ['hyatt'], ['virgin-atlantic', 'hilton'], [], ['hyatt'], ['virgin-atlantic', 'hilton']], 267000, 369450],
    ['aeroplan', [1, 1, 0, 1, 1, 0], [1, 1, 0.3125, 1, 1, 0.20833333333333331], [[], [], ['krisflyer', 'marriott'], [], [], ['cathay', 'marriott']], 315000, 330625],
    ['flying-blue', [1, 1, 1, 1, 1, 1], [1, 1, 1, 1, 1, 1], [[], [], [], [], [], []], 370000, 370000],
    ['atmos', [0, 0, 0, 0, 1, 0], [0.41666666666666663, 0.41666666666666663, 0.3125, 0.3125, 1, 0.20833333333333331], [['marriott'], ['marriott'], ['krisflyer', 'marriott'], ['krisflyer', 'marriott'], [], ['cathay', 'marriott']], 30000, 156563],
    ['aadvantage', [0, 0, 1, 0, 0, 0], [0.3333333333333333, 0.3333333333333333, 1, 0.25, 0.3333333333333333, 0.16666666666666666], [['marriott'], ['marriott'], [], ['krisflyer', 'marriott'], ['marriott'], ['cathay', 'marriott']], 40000, 141250],
    ['ana', [1, 0, 0, 0, 0, 0], [1, 0.41666666666666663, 0.3125, 0.3125, 0.41666666666666663, 0.20833333333333331], [[], ['marriott'], ['krisflyer', 'marriott'], ['krisflyer', 'marriott'], ['marriott'], ['cathay', 'marriott']], 120000, 209063],
    ['lifemiles', [1, 0, 1, 1, 1, 1], [1, 0.3333333333333333, 1, 1, 1, 1], [[], ['marriott'], [], [], [], []], 280000, 310000],
    ['british-airways', [1, 1, 0, 1, 1, 1], [1, 1, 1, 1, 1, 1], [[], [], ['qatar'], [], [], []], 330000, 370000],
    ['cathay', [0.8, 0, 1, 1, 1, 1], [0.8, 0.41666666666666663, 1, 1, 1, 1], [[], ['marriott'], [], [], [], []], 256000, 293500],
    ['copa', [0, 0, 0, 0.75, 0, 0], [0.41666666666666663, 0.41666666666666663, 0.3125, 0.75, 0.41666666666666663, 0.20833333333333331], [['marriott'], ['marriott'], ['krisflyer', 'marriott'], [], ['marriott'], ['cathay', 'marriott']], 56250, 171875],
    ['delta', [1, 0, 0, 0, 0, 0], [1, 0.375, 0.25, 0.25, 0.375, 0.16666666666666666], [[], ['hyatt'], ['accor'], ['accor'], ['hyatt'], ['cathay', 'marriott']], 120000, 196250],
    ['emirates', [0.8, 0, 0.8, 0.75, 1, 0], [0.8, 0.41666666666666663, 0.8, 0.75, 1, 0.20833333333333331], [[], ['marriott'], [], [], [], ['cathay', 'marriott']], 214250, 254875],
    ['etihad', [0, 0, 1, 1, 1, 0], [0.41666666666666663, 0.41666666666666663, 1, 1, 1, 0.20833333333333331], [['marriott'], ['marriott'], [], [], [], ['cathay', 'marriott']], 145000, 235625],
    ['eva', [0, 0, 1, 0.75, 0, 0], [0.2, 0.15000000000000002, 1, 0.75, 0.15000000000000002, 0.15000000000000002], [['hilton'], ['virgin-atlantic', 'hilton'], [], [], ['virgin-atlantic', 'hilton'], ['virgin-atlantic', 'hilton']], 96250, 140500],
    ['finnair', [0, 0, 0, 1, 0, 0], [1, 1, 1, 1, 1, 1], [['british-airways'], ['british-airways'], ['qatar'], [], ['british-airways'], ['british-airways']], 75000, 370000],
    ['iberia', [1, 1, 0, 0, 1, 1], [1, 1, 1, 1, 1, 1], [[], [], ['qatar'], ['british-airways'], [], []], 255000, 370000],
    ['jal', [0, 0, 1, 0.75, 1, 0], [0.41666666666666663, 0.41666666666666663, 1, 0.75, 1, 0.20833333333333331], [['marriott'], ['marriott'], [], [], [], ['cathay', 'marriott']], 126250, 216875],
    ['jetblue', [0.8, 1, 1, 0.6, 1, 1], [0.8, 1, 1, 0.6, 1, 1], [[], [], [], [], [], []], 316000, 316000],
    ['korean', [0, 0, 0, 0, 0, 0], [0.41666666666666663, 0.41666666666666663, 0.3125, 0.3125, 0.41666666666666663, 0.20833333333333331], [['marriott'], ['marriott'], ['krisflyer', 'marriott'], ['krisflyer', 'marriott'], ['marriott'], ['cathay', 'marriott']], 0, 139063],
    ['qantas', [1, 0, 1, 1, 0, 0], [1, 0.43499999999999994, 1, 1, 0.8333333333333333, 0.3125], [[], ['hyatt'], [], [], ['accor'], ['flying-blue', 'accor']], 235000, 303838],
    ['qatar', [1, 0, 1, 1, 1, 0], [1, 1, 1, 1, 1, 1], [[], ['british-airways'], [], [], [], ['british-airways']], 265000, 370000],
    ['krisflyer', [1, 1, 1, 1, 0, 0], [1, 1, 1, 1, 0.41666666666666663, 0.4], [[], [], [], [], ['marriott'], ['wyndham']], 325000, 343500],
    ['southwest', [0, 1, 0, 0, 1, 0], [0.41666666666666663, 1, 0.3125, 0.3125, 1, 0.20833333333333331], [['marriott'], [], ['krisflyer', 'marriott'], ['krisflyer', 'marriott'], [], ['cathay', 'marriott']], 120000, 209063],
    ['tap', [0, 0, 0, 1, 1, 0], [0.41666666666666663, 0.41666666666666663, 0.3125, 1, 1, 0.20833333333333331], [['marriott'], ['marriott'], ['krisflyer', 'marriott'], [], [], ['cathay', 'marriott']], 105000, 208125],
    ['thai', [0, 0, 1, 0, 0, 0], [0.41666666666666663, 0.41666666666666663, 1, 0.3125, 0.41666666666666663, 0.20833333333333331], [['marriott'], ['marriott'], [], ['krisflyer', 'marriott'], ['marriott'], ['cathay', 'marriott']], 40000, 166563],
    ['turkish', [0, 0, 1, 1, 1, 0], [0.41666666666666663, 0.41666666666666663, 1, 1, 1, 0.20833333333333331], [['marriott'], ['marriott'], [], [], [], ['cathay', 'marriott']], 145000, 235625],
    ['united', [0, 1, 0, 0, 1, 0], [0.5, 1, 0.375, 0.375, 1, 0.25], [['marriott'], [], ['krisflyer', 'marriott'], ['krisflyer', 'marriott'], [], ['cathay', 'marriott']], 120000, 226875],
    ['virgin-atlantic', [1, 1, 1, 1, 1, 1], [1, 1, 1, 1, 1, 1], [[], [], [], [], [], []], 370000, 370000],
    ['virgin-red', [0, 0, 0, 1, 0, 1], [1, 1, 1, 1, 1, 1], [['virgin-atlantic'], ['virgin-atlantic'], ['virgin-atlantic'], [], ['virgin-atlantic'], []], 90000, 370000],
    ['marriott', [1, 1, 0, 0, 1, 0], [1, 1, 0.75, 0.75, 1, 0.5], [[], [], ['krisflyer'], ['krisflyer'], [], ['cathay']], 240000, 333750],
    ['hilton', [2, 0, 0, 0, 1, 0], [2, 1.5, 1.5, 1.5, 1.5, 1.5], [[], ['virgin-atlantic'], ['virgin-atlantic'], ['virgin-atlantic'], ['virgin-atlantic'], ['virgin-atlantic']], 270000, 615000],
    ['hyatt', [0, 0.75, 0, 0, 0.75, 0], [0, 0.75, 0, 0, 0.75, 0], [null, [], null, null, [], null], 90000, 90000],
    ['ihg', [0, 1, 0, 0, 1, 0], [0, 1, 0, 0, 1, 0], [null, [], null, null, [], null], 120000, 120000],
    ['accor', [0, 0, 0.5, 0.5, 0.6666666666666666, 0], [0.2857142857142857, 0.2857142857142857, 0.5, 0.5, 0.6666666666666666, 0.2857142857142857], [['qatar'], ['british-airways', 'qatar'], [], [], [], ['british-airways', 'qatar']], 77500, 141786],
    ['wyndham', [0, 1, 1, 1, 1, 2], [0, 1, 1, 1, 1, 2], [null, [], [], [], [], []], 265000, 265000],
    ['choice', [1, 0, 1.5, 1, 0, 2], [1, 0, 1.5, 1, 0, 2], [[], null, [], [], null, []], 285000, 285000],
    ['i-prefer', [0, 0, 2, 2, 2, 0], [0, 0, 2, 2, 2, 0], [null, null, [], [], [], null], 290000, 290000],
    ['leaders-club', [0.25, 0, 0.2, 0, 0, 0], [0.25, 0, 0.2, 0, 0, 0], [[], null, [], null, null, null], 38000, 38000],
    ['amtrak', [0, 0, 0, 0, 0.5, 0], [0, 0, 0, 0, 0.5, 0], [null, null, null, null, [], null], 15000, 15000],
  ],
};

const D: Scenario = {
  name: 'D: bonuses the user added (no end date, ends today, ended yesterday), route switches, uneven balances',
  input: {
    today: '2026-11-09',
    balances: {
      amex: 12345,
      chase: 0,
      citi: 67890,
      'capital-one': 1,
      bilt: 999999,
      'wells-fargo': 5000,
    },
    settings: DATA.defaultSettings,
    bonuses: [
      ...DATA.builtInBonuses,
      userBonus('u-1', 'citi', 'qatar', 0.5, null),
      userBonus('u-2', 'wells-fargo', 'flying-blue', 0.25, '2026-11-09'),
      userBonus('u-3', 'amex', 'delta', 1, '2026-11-08'),
    ],
    routeOverrides: {
      'united>marriott': true,
      'virgin-atlantic>hilton': false,
      'british-airways>qatar': false,
    },
  },
  // prettier-ignore
  expected: [
    ['aer-lingus', [1, 1, 0, 0, 1, 1], [1, 1.3, 1.5, 1, 1, 1], [[], ['british-airways'], ['qatar'], ['british-airways'], [], []], 1017344, 1119180],
    ['aeromexico', [1.6, 0, 0, 1, 0, 0], [1.6, 0.675, 0.3125, 1, 0.9, 0.20833333333333331], [[], ['hyatt'], ['krisflyer', 'marriott'], [], ['hyatt'], ['cathay', 'marriott']], 19753, 942010],
    ['aeroplan', [1, 1, 0, 1, 1, 0], [1, 1, 0.3125, 1, 1, 0.20833333333333331], [[], [], ['krisflyer', 'marriott'], [], [], ['cathay', 'marriott']], 1012345, 1034603],
    ['flying-blue', [1, 1, 1, 1.2, 1, 1.25], [1, 1, 1, 1.2, 1, 1.25], [[], [], [], [], [], []], 1086485, 1086485],
    ['atmos', [0, 0, 0, 0, 1, 0], [0.5625, 0.41666666666666663, 0.3125, 0.3125, 1, 0.20833333333333331], [['marriott'], ['marriott'], ['krisflyer', 'marriott'], ['krisflyer', 'marriott'], [], ['cathay', 'marriott']], 999999, 1029201],
    ['aadvantage', [0, 0, 1, 0, 0, 0], [0.45, 0.36000000000000004, 1, 0.25, 0.4, 0.16666666666666666], [['marriott'], ['ihg'], [], ['krisflyer', 'marriott'], ['hyatt'], ['cathay', 'marriott']], 67890, 474278],
    ['ana', [1, 0, 0, 0, 0, 0], [1, 0.41666666666666663, 0.3125, 0.3125, 0.5, 0.20833333333333331], [[], ['marriott'], ['krisflyer', 'marriott'], ['krisflyer', 'marriott'], ['hyatt'], ['cathay', 'marriott']], 12345, 534603],
    ['lifemiles', [1, 0, 1, 1, 1, 1], [1, 0.36000000000000004, 1, 1, 1, 1], [[], ['ihg'], [], [], [], []], 1085235, 1085235],
    ['british-airways', [1, 1.3, 0, 1, 1, 1], [1, 1.3, 1.5, 1, 1, 1], [[], [], ['qatar'], [], [], []], 1017345, 1119180],
    ['cathay', [0.8, 0, 1.1, 1, 1, 1], [0.8, 0.41666666666666663, 1.1, 1, 1, 1], [[], ['marriott'], [], [], [], []], 1089555, 1089555],
    ['copa', [0, 0, 0, 0.9750000000000001, 0, 0], [0.5625, 0.41666666666666663, 0.3125, 0.9750000000000001, 0.41666666666666663, 0.20833333333333331], [['marriott'], ['marriott'], ['krisflyer', 'marriott'], [], ['marriott'], ['cathay', 'marriott']], 1, 445869],
    ['delta', [1, 0, 0, 0, 0, 0], [1, 0.375, 0.25, 0.25, 0.5, 0.16666666666666666], [[], ['hyatt'], ['accor'], ['accor'], ['hyatt'], ['cathay', 'marriott']], 12345, 530151],
    ['emirates', [0.8, 0, 0.8, 0.75, 1, 0], [0.8, 0.41666666666666663, 0.8, 0.75, 1, 0.20833333333333331], [[], ['marriott'], [], [], [], ['cathay', 'marriott']], 1064188, 1065230],
    ['etihad', [0, 0, 1, 1, 1, 0], [0.5625, 0.41666666666666663, 1, 1, 1, 0.20833333333333331], [['marriott'], ['marriott'], [], [], [], ['cathay', 'marriott']], 1067890, 1075876],
    ['eva', [0, 0, 1, 0.75, 0, 0], [0.2, 0, 1, 0.75, 0.1, 0], [['hilton'], null, [], [], ['hilton'], null], 67891, 170360],
    ['finnair', [0, 0, 0, 1, 0, 0], [1, 1.3, 1.5, 1, 1, 1], [['british-airways'], ['british-airways'], ['qatar'], [], ['british-airways'], ['british-airways']], 1, 1119180],
    ['iberia', [1, 1, 0, 0, 1, 1], [1, 1.3, 1.5, 1, 1, 1], [[], ['british-airways'], ['qatar'], ['british-airways'], [], []], 1017344, 1119180],
    ['jal', [0, 0, 1, 0.75, 1, 0], [0.5625, 0.41666666666666663, 1, 0.75, 1, 0.20833333333333331], [['marriott'], ['marriott'], [], [], [], ['cathay', 'marriott']], 1067890, 1075876],
    ['jetblue', [0.8, 1, 1, 0.6, 1, 1], [0.8, 1, 1, 0.6, 1, 1], [[], [], [], [], [], []], 1082766, 1082766],
    ['korean', [0, 0, 0, 0, 0, 0], [0.5625, 0.41666666666666663, 0.3125, 0.3125, 0.5, 0.20833333333333331], [['marriott'], ['marriott'], ['krisflyer', 'marriott'], ['krisflyer', 'marriott'], ['hyatt'], ['cathay', 'marriott']], 0, 529202],
    ['qantas', [1, 0, 1, 1, 0, 0], [1, 0.43499999999999994, 1, 1, 0.8333333333333333, 0.390625], [[], ['hyatt'], [], [], ['accor'], ['flying-blue', 'accor']], 80236, 915521],
    ['qatar', [1, 0, 1.5, 1, 1, 0], [1, 1.3, 1.5, 1, 1, 1], [[], ['british-airways', 'iberia'], [], [], [], ['iberia']], 1114180, 1119180],
    ['krisflyer', [1, 1, 1, 1, 0, 0], [1, 1, 1, 1, 0.5, 0.4], [[], [], [], [], ['hyatt'], ['wyndham']], 80236, 582236],
    ['southwest', [0, 1, 0, 0, 1, 0], [0.5625, 1, 0.3125, 0.3125, 1, 0.20833333333333331], [['marriott'], [], ['krisflyer', 'marriott'], ['krisflyer', 'marriott'], [], ['cathay', 'marriott']], 999999, 1029201],
    ['tap', [0, 0, 0, 1, 1, 0], [0.5625, 0.41666666666666663, 0.3125, 1, 1, 0.20833333333333331], [['marriott'], ['marriott'], ['krisflyer', 'marriott'], [], [], ['cathay', 'marriott']], 1000000, 1029202],
    ['thai', [0, 0, 1, 0, 0, 0], [0.5625, 0.41666666666666663, 1, 0.3125, 0.5, 0.20833333333333331], [['marriott'], ['marriott'], [], ['krisflyer', 'marriott'], ['hyatt'], ['cathay', 'marriott']], 67890, 575876],
    ['turkish', [0, 0, 1, 1, 1, 0], [0.5625, 0.41666666666666663, 1, 1, 1, 0.20833333333333331], [['marriott'], ['marriott'], [], [], [], ['cathay', 'marriott']], 1067890, 1075876],
    ['united', [0, 1, 0, 0, 1, 0], [0.675, 1, 0.375, 0.375, 1, 0.25], [['marriott'], [], ['krisflyer', 'marriott'], ['krisflyer', 'marriott'], [], ['cathay', 'marriott']], 999999, 1035041],
    ['virgin-atlantic', [1.3, 1, 1, 1.3, 1, 1], [1.3, 1, 1, 1.3, 1, 1], [[], [], [], [], [], []], 1088939, 1088939],
    ['virgin-red', [0, 0, 0, 1.3, 0, 1], [1.3, 1, 1, 1.3, 1, 1], [['virgin-atlantic'], ['virgin-atlantic'], ['virgin-atlantic'], [], ['virgin-atlantic'], []], 5001, 1088939],
    ['marriott', [1.35, 1, 0, 0, 1, 0], [1.35, 1, 0.75, 0.75, 1, 0.5], [[], [], ['krisflyer'], ['krisflyer'], [], ['cathay']], 1016665, 1070084],
    ['hilton', [2, 0, 0, 0, 1, 0], [2, 0, 0, 0, 1, 0], [[], null, null, null, [], null], 1024689, 1024689],
    ['hyatt', [0, 0.75, 0, 0, 1, 0], [0, 0.75, 0, 0, 1, 0], [null, [], null, null, [], null], 999999, 999999],
    ['ihg', [0, 1.8, 0, 0, 1, 0], [0, 1.8, 0, 0, 1, 0], [null, [], null, null, [], null], 999999, 999999],
    ['accor', [0, 0, 0.5, 0.5, 0.6666666666666666, 0], [0.2857142857142857, 0.2857142857142857, 0.5, 0.5, 0.6666666666666666, 0.3125], [['qatar'], ['iberia', 'qatar'], [], [], [], ['flying-blue']], 700612, 705702],
    ['wyndham', [0, 1, 1, 1, 1, 2], [0, 1, 1, 1, 1, 2], [null, [], [], [], [], []], 1077890, 1077890],
    ['choice', [1, 0, 1.5, 1, 0, 2], [1, 0, 1.5, 1, 0, 2], [[], null, [], [], null, []], 124181, 124181],
    ['i-prefer', [0, 0, 2, 2, 2, 0], [0, 0, 2, 2, 2, 0], [null, null, [], [], [], null], 2135780, 2135780],
    ['leaders-club', [0.25, 0, 0.2, 0, 0, 0], [0.25, 0, 0.2, 0, 0, 0], [[], null, [], null, null, null], 16664, 16664],
    ['amtrak', [0, 0, 0, 0, 0.5, 0], [0, 0, 0, 0, 0.5, 0], [null, null, null, null, [], null], 500000, 500000],
  ],
};

export const SCENARIOS: readonly Scenario[] = [A, B, C, D];
````

## `src/app/core/engine.spec.ts`

<!-- FILE src/app/core/engine.spec.ts 81ef6c2715a6 -->
````text
import { CURRENT_DATASET } from './datasets/current';
import { DATASET_2026_11_09 as DATA } from './datasets/dataset-2026-11-09';
import {
  EPSILON,
  activeBonusPct,
  baseCardRatio,
  compute,
  directPartnerIds,
  isBonusActive,
  isIsoDate,
  localIsoDate,
  pathLabel,
  programName,
  routeRatioUsed,
  sanitizeBalance,
  totalBalance,
} from './engine';
import { SCENARIOS } from './engine.fixtures';
import { Bonus, CardCell, Dataset, EngineInput, ProgramResult } from './models';

// Every test with a number in it runs on the fixed 2026-11-09 dataset (DATA), never on the
// current one, so updating the live data cannot break these tests.

const DEFAULT_INPUT: EngineInput = {
  today: '2026-11-09',
  balances: DATA.exampleBalances,
  settings: DATA.defaultSettings,
  bonuses: DATA.builtInBonuses,
  routeOverrides: {},
};

function row(input: EngineInput, programId: string): ProgramResult {
  const found = compute(DATA, input).programs.find((result) => result.program.id === programId);
  if (!found) {
    throw new Error(`No result for ${programId}`);
  }
  return found;
}

function cell(input: EngineInput, programId: string, cardId: string): CardCell {
  const found = row(input, programId).cells.find((candidate) => candidate.cardId === cardId);
  if (!found) {
    throw new Error(`No cell for ${cardId}`);
  }
  return found;
}

function withSettings(patch: Partial<EngineInput['settings']>): EngineInput {
  return { ...DEFAULT_INPUT, settings: { ...DATA.defaultSettings, ...patch } };
}

describe('datasets', () => {
  const datasets: readonly (readonly [string, Dataset])[] = [
    ['2026-11-09 baseline', DATA],
    ['current', CURRENT_DATASET],
  ];

  for (const [label, data] of datasets) {
    it(`${label}: ids are unique and everything referred to exists`, () => {
      const programIds = new Set(data.programs.map((program) => program.id));
      const sourceIds = new Set(data.sources.map((source) => source.id));
      expect(isIsoDate(data.checkedDate)).toBe(true);
      expect(data.version).not.toBe('');
      expect(programIds.size).toBe(data.programs.length);
      expect(sourceIds.size).toBe(data.sources.length);
      expect(new Set(data.cards.map((card) => card.id)).size).toBe(data.cards.length);
      expect(new Set(data.partnerTransfers.map((r) => r.id)).size).toBe(
        data.partnerTransfers.length,
      );
      expect(new Set(data.builtInBonuses.map((b) => b.id)).size).toBe(data.builtInBonuses.length);

      for (const card of data.cards) {
        for (const [programId, ratio] of Object.entries(data.cardRatios[card.id])) {
          expect(programIds.has(programId), `${card.id} to ${programId}`).toBe(true);
          expect(ratio, `${card.id} to ${programId}`).toBeGreaterThan(0);
        }
        expect(data.exampleBalances[card.id], card.id).toBeGreaterThanOrEqual(0);
      }
      for (const route of data.partnerTransfers) {
        expect(route.id).toBe(`${route.from}>${route.to}`);
        expect(route.from, route.id).not.toBe(route.to);
        expect(programIds.has(route.from), route.id).toBe(true);
        expect(programIds.has(route.to), route.id).toBe(true);
        expect(sourceIds.has(route.sourceId), route.id).toBe(true);
        expect(route.ratio, route.id).toBeGreaterThan(0);
        if (route.blockBonus) {
          expect(route.blockBonus.size, route.id).toBeGreaterThan(0);
        }
      }
      for (const bonus of data.builtInBonuses) {
        expect(directPartnerIds(data, bonus.cardId), bonus.id).toContain(bonus.programId);
        expect(sourceIds.has(bonus.sourceId), bonus.id).toBe(true);
        expect(bonus.builtIn, bonus.id).toBe(true);
        expect(bonus.pct, bonus.id).toBeGreaterThan(0);
        expect(bonus.endDate === null || isIsoDate(bonus.endDate), bonus.id).toBe(true);
      }
    });

    it(`${label}: the calculation runs and gives one row per program`, () => {
      const result = compute(data, {
        today: data.checkedDate,
        balances: data.exampleBalances,
        settings: data.defaultSettings,
        bonuses: data.builtInBonuses,
        routeOverrides: {},
      });
      expect(result.programs.length).toBe(data.programs.length);
      expect(result.routes.length).toBe(data.partnerTransfers.length);
      for (const program of result.programs) {
        expect(program.cells.length).toBe(data.cards.length);
        expect(program.maxTotal).toBeGreaterThanOrEqual(program.directTotal);
      }
    });
  }

  it('the baseline has the same shape as the spreadsheet', () => {
    expect(DATA.cards.length).toBe(6);
    expect(DATA.programs.length).toBe(40);
    expect(DATA.partnerTransfers.length).toBe(146);
    expect(DATA.builtInBonuses.length).toBe(9);
    expect(DATA.sources.length).toBe(25);
    expect(DATA.cards.map((card) => directPartnerIds(DATA, card.id).length)).toEqual([
      20, 14, 20, 24, 26, 11,
    ]);
    const off = DATA.partnerTransfers.filter((route) => !route.defaultOn).map((route) => route.id);
    expect(off).toEqual([
      'accor>flying-blue',
      'united>marriott',
      'aeroplan>marriott',
      'atmos>marriott',
    ]);
  });
});

describe('compute: matches the spreadsheet', () => {
  for (const scenario of SCENARIOS) {
    it(scenario.name, () => {
      const result = compute(DATA, scenario.input);
      expect(result.programs.map((program) => program.program.id)).toEqual(
        scenario.expected.map((expected) => expected[0]),
      );
      result.programs.forEach((actual, index) => {
        const [programId, direct, best, paths, directTotal, maxTotal] = scenario.expected[index];
        actual.cells.forEach((actualCell, cardIndex) => {
          const where = `${programId} / ${DATA.cards[cardIndex].id}`;
          expect(actualCell.cardId, where).toBe(DATA.cards[cardIndex].id);
          expect(Math.abs(actualCell.directRatio - direct[cardIndex]), where).toBeLessThan(EPSILON);
          expect(Math.abs(actualCell.bestRatio - best[cardIndex]), where).toBeLessThan(EPSILON);
          expect(actualCell.path, where).toEqual(paths[cardIndex]);
        });
        expect(actual.directTotal, programId).toBe(directTotal);
        expect(actual.maxTotal, programId).toBe(maxTotal);
        expect(actual.added, programId).toBe(maxTotal - directTotal);
      });
    });
  }
});

describe('compute: numbers worth knowing by heart (defaults on 2026-11-09)', () => {
  it('pools Avios: Qatar goes from 265,000 direct to 397,000', () => {
    const qatar = row(DEFAULT_INPUT, 'qatar');
    expect(qatar.directTotal).toBe(265000);
    expect(qatar.maxTotal).toBe(397000);
    expect(qatar.added).toBe(132000);
    expect(qatar.directCardCount).toBe(4);
    const adding = qatar.cells
      .filter((c) => c.addsPoints)
      .map((c) => [c.cardId, pathLabel(DATA, c.path), c.bestPoints - c.directPoints]);
    expect(adding).toEqual([
      ['chase', 'via British Airways Club', 117000],
      ['wells-fargo', 'via British Airways Club', 15000],
    ]);
  });

  it('finds two-move routes', () => {
    const viaTwo = cell(DEFAULT_INPUT, 'united', 'citi');
    expect(viaTwo.bestRatio).toBeCloseTo(0.375, 9);
    expect(pathLabel(DATA, viaTwo.path)).toBe('via Singapore KrisFlyer > Marriott Bonvoy');
    const accor = cell(DEFAULT_INPUT, 'accor', 'chase');
    expect(accor.bestRatio).toBeCloseTo(1.3 / 3.5, 9);
    expect(accor.path).toEqual(['british-airways', 'qatar']);
  });

  it('reports programs no card reaches directly', () => {
    const korean = row(DEFAULT_INPUT, 'korean');
    expect(korean.directTotal).toBe(0);
    expect(korean.directCardCount).toBe(0);
    expect(korean.maxTotal).toBe(159063);
    const amtrak = row(DEFAULT_INPUT, 'amtrak');
    expect(amtrak.cells.map((c) => pathLabel(DATA, c.path))).toEqual([
      'No route',
      'No route',
      'No route',
      'No route',
      'Direct',
      'No route',
    ]);
  });

  it('gives zero everywhere when all balances are zero, but keeps ratios and routes', () => {
    const empty = { amex: 0, chase: 0, citi: 0, 'capital-one': 0, bilt: 0, 'wells-fargo': 0 };
    const result = compute(DATA, { ...DEFAULT_INPUT, balances: empty });
    expect(result.programs.every((p) => p.maxTotal === 0 && p.added === 0)).toBe(true);
    expect(result.programs.every((p) => p.directCardCount === 0)).toBe(true);
    expect(result.programs.every((p) => p.cells.every((c) => !c.addsPoints))).toBe(true);
    const united = result.programs.find((p) => p.program.id === 'united');
    expect(united?.cells[0].bestRatio).toBeCloseTo(0.675, 9);
    expect(united?.cells[0].path).toEqual(['marriott']);
  });

  it('copies each cleaned-up balance into its cells', () => {
    const messy = { ...DATA.exampleBalances, amex: 2500.9, chase: -5 };
    const qatar = row({ ...DEFAULT_INPUT, balances: messy }, 'qatar');
    expect(qatar.cells.map((c) => c.balance)).toEqual([2500, 0, 40000, 75000, 30000, 15000]);
  });
});

describe('settings', () => {
  it('Chase card: Hyatt is 1:1 on Reserve and 4:3 otherwise', () => {
    expect(row(DEFAULT_INPUT, 'hyatt').directTotal).toBe(97500);
    expect(row(withSettings({ chaseCard: 'reserve' }), 'hyatt').directTotal).toBe(120000);
    expect(baseCardRatio(DATA, 'chase', 'hyatt', DATA.defaultSettings, '2026-11-09')).toBe(0.75);
    expect(baseCardRatio(DATA, 'amex', 'hyatt', DATA.defaultSettings, '2026-11-09')).toBe(0);
  });

  it('Citi card: other Citi cards get 70% of every Citi ratio', () => {
    const other = withSettings({ citiTier: 'other' });
    expect(cell(DEFAULT_INPUT, 'aadvantage', 'citi').directRatio).toBe(1);
    expect(cell(other, 'aadvantage', 'citi').directRatio).toBeCloseTo(0.7, 9);
    expect(cell(other, 'aadvantage', 'citi').baseRatio).toBe(1);
    expect(row(other, 'aadvantage').directTotal).toBe(28000);
    expect(cell(other, 'aadvantage', 'amex').bestRatio).toBe(
      cell(DEFAULT_INPUT, 'aadvantage', 'amex').bestRatio,
    );
  });

  it('Count limited-time transfer bonuses: off ignores every bonus', () => {
    const off = withSettings({ countBonuses: false });
    expect(row(DEFAULT_INPUT, 'hilton').maxTotal).toBe(648750);
    expect(row(off, 'hilton').maxTotal).toBe(615000);
    expect(row(off, 'qatar').maxTotal).toBe(370000);
    expect(cell(off, 'british-airways', 'chase').bonusPct).toBe(0);
    expect(cell(DEFAULT_INPUT, 'british-airways', 'chase').bonusPct).toBeCloseTo(0.3, 9);
  });

  it('Count Marriott and Hyatt block bonuses: off uses the plain ratio', () => {
    const marriottToUnited = DATA.partnerTransfers.find((route) => route.id === 'marriott>united');
    if (!marriottToUnited) {
      throw new Error('marriott>united is missing');
    }
    const off = { ...DATA.defaultSettings, countBlockBonuses: false };
    expect(routeRatioUsed(marriottToUnited, DATA.defaultSettings, {})).toBeCloseTo(0.5, 9);
    expect(routeRatioUsed(marriottToUnited, off, {})).toBeCloseTo(1 / 3, 9);
    expect(row(DEFAULT_INPUT, 'united').maxTotal).toBe(247875);
    expect(row(withSettings({ countBlockBonuses: false }), 'united').maxTotal).toBe(205250);
  });

  it('route switches: off routes contribute nothing, restricted routes can be turned on', () => {
    const baOff = { ...DEFAULT_INPUT, routeOverrides: { 'british-airways>qatar': false } };
    expect(row(baOff, 'qatar').maxTotal).toBe(397000);
    expect(cell(baOff, 'qatar', 'chase').path).toEqual(['british-airways', 'iberia']);
    const offRoute = compute(DATA, baOff).routes.find(
      (r) => r.route.id === 'british-airways>qatar',
    );
    expect(offRoute?.enabled).toBe(false);
    expect(offRoute?.ratioUsed).toBe(0);

    expect(row(DEFAULT_INPUT, 'marriott').maxTotal).toBe(375750);
    const aeroplanOn = { ...DEFAULT_INPUT, routeOverrides: { 'aeroplan>marriott': true } };
    expect(row(aeroplanOn, 'marriott').maxTotal).toBe(394500);
    expect(cell(aeroplanOn, 'marriott', 'capital-one').path).toEqual(['aeroplan']);
    expect(row(aeroplanOn, 'korean').maxTotal).toBe(166875);
  });
});

describe('bonuses', () => {
  const bonus = (endDate: string | null): Bonus => ({
    id: 'u',
    cardId: 'citi',
    programId: 'qatar',
    pct: 0.5,
    endDate,
    sourceId: '',
    builtIn: false,
  });

  it('counts a bonus through its last day and not after', () => {
    expect(isBonusActive(bonus('2026-11-09'), '2026-11-09')).toBe(true);
    expect(isBonusActive(bonus('2026-11-08'), '2026-11-09')).toBe(false);
    expect(isBonusActive(bonus(null), '2099-01-01')).toBe(true);
  });

  it('applies a bonus the user added to the direct ratio and to routes that start with it', () => {
    const input = { ...DEFAULT_INPUT, bonuses: [...DATA.builtInBonuses, bonus(null)] };
    expect(cell(input, 'qatar', 'citi').directRatio).toBeCloseTo(1.5, 9);
    expect(row(input, 'qatar').directTotal).toBe(285000);
    expect(row(input, 'qatar').maxTotal).toBe(417000);
    expect(cell(input, 'british-airways', 'citi').bestRatio).toBeCloseTo(1.5, 9);
    expect(cell(input, 'british-airways', 'citi').path).toEqual(['qatar']);
  });

  it('adds up two bonuses for the same card and program', () => {
    const both = [bonus(null), { ...bonus('2026-12-31'), id: 'v', pct: 0.25 }];
    expect(activeBonusPct('citi', 'qatar', { ...DEFAULT_INPUT, bonuses: both })).toBeCloseTo(
      0.75,
      9,
    );
  });

  it('drops the built-in bonuses once they end, and switches Bilt to Hyatt on 2027-01-01', () => {
    const later = { ...DEFAULT_INPUT, today: '2027-01-15' };
    expect(row(later, 'hilton').maxTotal).toBe(615000);
    expect(row(later, 'hyatt').directTotal).toBe(90000);
    expect(baseCardRatio(DATA, 'bilt', 'hyatt', DATA.defaultSettings, '2026-12-31')).toBe(1);
    expect(baseCardRatio(DATA, 'bilt', 'hyatt', DATA.defaultSettings, '2027-01-01')).toBe(0.75);
  });
});

describe('helpers', () => {
  it('pathLabel and programName', () => {
    expect(pathLabel(DATA, null)).toBe('No route');
    expect(pathLabel(DATA, [])).toBe('Direct');
    expect(pathLabel(DATA, ['marriott'])).toBe('via Marriott Bonvoy');
    expect(pathLabel(DATA, ['krisflyer', 'marriott'])).toBe(
      'via Singapore KrisFlyer > Marriott Bonvoy',
    );
    expect(programName(DATA, 'qatar')).toBe('Qatar Privilege Club');
    expect(programName(DATA, 'not-a-program')).toBe('not-a-program');
  });

  it('isIsoDate accepts only real YYYY-MM-DD dates', () => {
    expect(isIsoDate('2026-11-09')).toBe(true);
    expect(isIsoDate('2028-02-29')).toBe(true);
    expect(isIsoDate('2026-02-30')).toBe(false);
    expect(isIsoDate('2026-13-01')).toBe(false);
    expect(isIsoDate('11/09/2026')).toBe(false);
    expect(isIsoDate('')).toBe(false);
    expect(isIsoDate(null)).toBe(false);
  });

  it('localIsoDate uses local date parts', () => {
    expect(localIsoDate(new Date(2026, 10, 9, 23, 59))).toBe('2026-11-09');
    expect(localIsoDate(new Date(2027, 0, 1, 0, 0))).toBe('2027-01-01');
  });

  it('sanitizeBalance keeps whole, non-negative numbers', () => {
    expect(sanitizeBalance(120000)).toBe(120000);
    expect(sanitizeBalance('120,000')).toBe(120000);
    expect(sanitizeBalance(' 2 500 ')).toBe(2500);
    expect(sanitizeBalance(12.9)).toBe(12);
    expect(sanitizeBalance(-5)).toBe(0);
    expect(sanitizeBalance('abc')).toBe(0);
    expect(sanitizeBalance('')).toBe(0);
    expect(sanitizeBalance(undefined)).toBe(0);
    expect(sanitizeBalance(Number.NaN)).toBe(0);
  });

  it('totalBalance adds the six balances', () => {
    expect(totalBalance(DATA, DATA.exampleBalances)).toBe(370000);
  });
});
````

## `src/app/core/calculator-store.spec.ts`

<!-- FILE src/app/core/calculator-store.spec.ts 91e2cc6530b0 -->
````text
import { TestBed } from '@angular/core/testing';

import { CalculatorStore, DATASET, STORAGE_KEY, validateBonusDraft } from './calculator-store';
import { CURRENT_DATASET } from './datasets/current';
import { DATASET_2026_11_09 as DATA } from './datasets/dataset-2026-11-09';

/**
 * A store as the page would get it after a (re)load: it reads whatever is in localStorage.
 * It runs on the fixed baseline dataset, with today pinned to the day that data was checked.
 */
function loadStore(): CalculatorStore {
  TestBed.resetTestingModule();
  TestBed.configureTestingModule({ providers: [{ provide: DATASET, useValue: DATA }] });
  const store = TestBed.inject(CalculatorStore);
  store.setToday('2026-11-09');
  return store;
}

function saved(): Record<string, unknown> {
  return JSON.parse(localStorage.getItem(STORAGE_KEY) ?? '{}') as Record<string, unknown>;
}

function maxTotal(store: CalculatorStore, programId: string): number {
  return store.result().programs.find((p) => p.program.id === programId)?.maxTotal ?? -1;
}

const BUILT_IN_IDS = DATA.builtInBonuses.map((bonus) => bonus.id);

describe('CalculatorStore', () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it('starts with the example balances, default settings and built-in bonuses', () => {
    const store = loadStore();
    expect(store.data).toBe(DATA);
    expect(store.balances()).toEqual(DATA.exampleBalances);
    expect(store.settings()).toEqual(DATA.defaultSettings);
    expect(store.bonuses()).toEqual(DATA.builtInBonuses);
    expect(store.routeOverrides()).toEqual({});
    expect(store.showingExampleBalances()).toBe(true);
    expect(store.totalBalance()).toBe(370000);
    expect(maxTotal(store, 'qatar')).toBe(397000);
    expect(localStorage.getItem(STORAGE_KEY)).toBeNull();
  });

  it('uses the current dataset when nothing else is provided', () => {
    TestBed.resetTestingModule();
    const store = TestBed.inject(CalculatorStore);
    expect(store.data).toBe(CURRENT_DATASET);
    expect(store.result().programs.length).toBe(CURRENT_DATASET.programs.length);
    expect(store.balances()).toEqual(CURRENT_DATASET.exampleBalances);
  });

  it('looks things up by id', () => {
    const store = loadStore();
    expect(store.cardName('capital-one')).toBe('Capital One');
    expect(store.programName('british-airways')).toBe('British Airways Club');
    expect(store.pathLabel(['krisflyer', 'marriott'])).toBe(
      'via Singapore KrisFlyer > Marriott Bonvoy',
    );
    expect(store.pathLabel([])).toBe('Direct');
    expect(store.pathLabel(null)).toBe('No route');
    expect(store.directPartners('chase').length).toBe(14);
    expect(store.directPartners('chase')[0].name).toBe('Aer Lingus AerClub');
    expect(store.source('aw-amex')?.label).toBe('AwardWallet: Amex');
    expect(store.source('')).toBeUndefined();
  });

  it('recomputes when a balance changes and cleans up what was typed', () => {
    const store = loadStore();
    store.setBalance('chase', '0');
    expect(maxTotal(store, 'qatar')).toBe(280000);
    store.setBalance('chase', '90,000');
    expect(store.balances().chase).toBe(90000);
    store.setBalance('amex', -5);
    expect(store.balances().amex).toBe(0);
    store.setBalance('amex', 'abc');
    expect(store.balances().amex).toBe(0);
    expect(store.showingExampleBalances()).toBe(false);
    store.clearBalances();
    expect(store.totalBalance()).toBe(0);
    expect(maxTotal(store, 'qatar')).toBe(0);
  });

  it('applies each setting', () => {
    const store = loadStore();
    store.updateSettings({ countBonuses: false });
    expect(maxTotal(store, 'hilton')).toBe(615000);
    store.updateSettings({ countBonuses: true });
    expect(maxTotal(store, 'hilton')).toBe(648750);
    store.updateSettings({ countBlockBonuses: false });
    expect(maxTotal(store, 'united')).toBe(205250);
    store.updateSettings({ countBlockBonuses: true });
    store.setChaseCard('reserve');
    expect(store.result().programs.find((p) => p.program.id === 'hyatt')?.directTotal).toBe(120000);
    store.setCitiTier('other');
    expect(store.settings()).toEqual({
      ...DATA.defaultSettings,
      chaseCard: 'reserve',
      citiTier: 'other',
    });
  });

  it('stores only route switches that differ from the default', () => {
    const store = loadStore();
    store.setRouteEnabled('united>marriott', true);
    store.setRouteEnabled('british-airways>qatar', false);
    store.setRouteEnabled('not-a-route', true);
    expect(store.routeOverrides()).toEqual({
      'united>marriott': true,
      'british-airways>qatar': false,
    });
    expect(store.changedRouteCount()).toBe(2);
    store.setRouteEnabled('united>marriott', false);
    expect(store.routeOverrides()).toEqual({ 'british-airways>qatar': false });
    store.resetRoutes();
    expect(store.routeOverrides()).toEqual({});
    expect(store.changedRouteCount()).toBe(0);
  });

  it('adds, removes and restores bonuses', () => {
    const store = loadStore();
    const draft = { cardId: 'citi', programId: 'qatar', percent: '50', endDate: '' };
    expect(store.addBonus(draft)).toBeNull();
    expect(store.bonuses().at(-1)).toEqual({
      id: 'user-1',
      cardId: 'citi',
      programId: 'qatar',
      pct: 0.5,
      endDate: null,
      sourceId: '',
      builtIn: false,
    });
    const citiToQatar = store
      .result()
      .programs.find((p) => p.program.id === 'qatar')
      ?.cells.find((c) => c.cardId === 'citi');
    expect(citiToQatar?.directRatio).toBeCloseTo(1.5, 9);

    expect(store.addBonus({ ...draft, percent: '10%', endDate: '2026-12-31' })).toBeNull();
    expect(store.bonuses().at(-1)?.id).toBe('user-2');
    expect(store.bonuses().at(-1)?.endDate).toBe('2026-12-31');
    store.removeBonus('user-1');
    store.removeBonus('seed-amex-marriott');
    expect(store.bonuses().length).toBe(9);
    expect(store.addBonus(draft)).toBeNull();
    expect(store.bonuses().at(-1)?.id).toBe('user-1');
    store.resetBonuses();
    expect(store.bonuses()).toEqual(DATA.builtInBonuses);
  });

  it('knows whether a bonus still counts today', () => {
    const store = loadStore();
    const marriott = DATA.builtInBonuses[0];
    expect(marriott.endDate).toBe('2026-12-10');
    expect(store.isBonusActive(marriott)).toBe(true);
    store.setToday('2026-12-10');
    expect(store.isBonusActive(marriott)).toBe(true);
    store.setToday('2026-12-11');
    expect(store.isBonusActive(marriott)).toBe(false);
  });

  it('rejects bad bonus entries with a message and changes nothing', () => {
    const store = loadStore();
    const good = { cardId: 'chase', programId: 'united', percent: '30', endDate: '' };
    expect(store.addBonus({ ...good, cardId: 'nope' })).toMatch(/card/i);
    expect(store.addBonus({ ...good, programId: 'delta' })).toMatch(/program/i);
    expect(store.addBonus({ ...good, percent: '' })).toMatch(/percent/i);
    expect(store.addBonus({ ...good, percent: '-5' })).toMatch(/percent/i);
    expect(store.addBonus({ ...good, percent: 'lots' })).toMatch(/percent/i);
    expect(store.addBonus({ ...good, endDate: '12/31/2026' })).toMatch(/last day/i);
    expect(store.addBonus({ ...good, endDate: '2026-02-30' })).toMatch(/last day/i);
    expect(store.bonuses()).toEqual(DATA.builtInBonuses);
    expect(localStorage.getItem(STORAGE_KEY)).toBeNull();
    expect(validateBonusDraft(DATA, { ...good, percent: ' 12.5 % ' })).toEqual({
      ok: true,
      bonus: {
        cardId: 'chase',
        programId: 'united',
        pct: 0.125,
        endDate: null,
        sourceId: '',
        builtIn: false,
      },
    });
  });

  it('remembers everything in this browser', () => {
    const first = loadStore();
    first.setBalance('amex', 2500);
    first.setChaseCard('reserve');
    first.updateSettings({ countBlockBonuses: false });
    first.setRouteEnabled('atmos>marriott', true);
    first.addBonus({ cardId: 'bilt', programId: 'united', percent: '25', endDate: '2027-03-01' });
    first.removeBonus('seed-citi-cathay');
    expect(saved()['dataVersion']).toBe(DATA.version);

    const second = loadStore();
    expect(second).not.toBe(first);
    expect(second.balances().amex).toBe(2500);
    expect(second.balances().chase).toBe(90000);
    expect(second.settings()).toEqual({
      ...DATA.defaultSettings,
      chaseCard: 'reserve',
      countBlockBonuses: false,
    });
    expect(second.routeOverrides()).toEqual({ 'atmos>marriott': true });
    expect(second.bonuses().map((b) => b.id)).toEqual([
      ...BUILT_IN_IDS.filter((id) => id !== 'seed-citi-cathay'),
      'user-1',
    ]);
  });

  it('resetAll returns to the first-visit state and forgets what was saved', () => {
    const store = loadStore();
    store.setBalance('amex', 5);
    store.setRouteEnabled('united>marriott', true);
    store.addBonus({ cardId: 'bilt', programId: 'united', percent: '25', endDate: '' });
    store.resetAll();
    expect(store.balances()).toEqual(DATA.exampleBalances);
    expect(store.settings()).toEqual(DATA.defaultSettings);
    expect(store.bonuses()).toEqual(DATA.builtInBonuses);
    expect(store.routeOverrides()).toEqual({});
    expect(localStorage.getItem(STORAGE_KEY)).toBeNull();
  });

  it('survives damaged or unexpected saved data', () => {
    localStorage.setItem(STORAGE_KEY, '{not json');
    expect(loadStore().balances()).toEqual(DATA.exampleBalances);

    localStorage.setItem(STORAGE_KEY, JSON.stringify({ v: 99, balances: { amex: 1 } }));
    expect(loadStore().balances()).toEqual(DATA.exampleBalances);

    const ok = { cardId: 'amex', programId: 'delta', pct: 0.2, endDate: null };
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        v: 1,
        dataVersion: DATA.version,
        balances: { amex: '2,500', chase: -1, citi: 'x', bilt: 10.7 },
        settings: { chaseCard: 'gold', countBonuses: 'yes', citiTier: 'other' },
        bonuses: [
          { ...ok, id: 'ok', sourceId: '', builtIn: false },
          { ...ok, id: 'ok' },
          { ...ok, id: 'bad-card', cardId: 'visa' },
          { ...ok, id: 'bad-program', programId: 'united' },
          { ...ok, id: 'bad-pct', pct: 'x' },
          { ...ok, id: 'bad-date', endDate: 'soon' },
          'junk',
        ],
        routeOverrides: {
          'united>marriott': true,
          'british-airways>qatar': true,
          'made>up': false,
          x: 'y',
        },
      }),
    );
    const store = loadStore();
    expect(store.balances()).toEqual({
      amex: 2500,
      chase: 0,
      citi: 0,
      'capital-one': 0,
      bilt: 10,
      'wells-fargo': 0,
    });
    expect(store.settings()).toEqual({ ...DATA.defaultSettings, citiTier: 'other' });
    expect(store.bonuses().map((b) => b.id)).toEqual(['ok']);
    expect(store.routeOverrides()).toEqual({ 'united>marriott': true });
  });

  it('refreshes the built-in bonuses when the data version changes, and keeps the rest', () => {
    const old = { cardId: 'amex', programId: 'delta', pct: 0.5, endDate: '2026-01-01' };
    const mine = { cardId: 'chase', programId: 'united', pct: 0.3, endDate: null };
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        v: 1,
        dataVersion: 'older',
        balances: { amex: 7 },
        settings: { ...DATA.defaultSettings, chaseCard: 'reserve' },
        bonuses: [
          { ...old, id: 'seed-old', sourceId: 'aw-amex', builtIn: true },
          { ...mine, id: 'user-1', sourceId: '', builtIn: false },
        ],
        routeOverrides: { 'united>marriott': true },
      }),
    );
    const store = loadStore();
    expect(store.bonuses().map((b) => b.id)).toEqual([...BUILT_IN_IDS, 'user-1']);
    expect(store.balances().amex).toBe(7);
    expect(store.settings().chaseCard).toBe('reserve');
    expect(store.routeOverrides()).toEqual({ 'united>marriott': true });
  });

  it('keeps a pinned date when asked to refresh, and ignores invalid dates', () => {
    const store = loadStore();
    store.refreshToday();
    expect(store.today()).toBe('2026-11-09');
    store.setToday('not a date');
    expect(store.today()).toBe('2026-11-09');
    store.setToday('2027-01-15');
    expect(store.today()).toBe('2027-01-15');
    expect(maxTotal(store, 'hilton')).toBe(615000);
  });
});
````

## `src/app/shared/format.spec.ts`

<!-- FILE src/app/shared/format.spec.ts 55dfadaf5792 -->
````text
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
````

## `src/app/app.spec.ts`

<!-- FILE src/app/app.spec.ts 3226def6e9ee -->
````text
import { ComponentFixture, TestBed } from '@angular/core/testing';

import { App } from './app';
import { CalculatorStore, DATASET, STORAGE_KEY } from './core/calculator-store';
import { DATASET_2026_11_09 } from './core/datasets/dataset-2026-11-09';

// Acceptance tests for the whole page. They find elements only by data-testid, so the markup is
// free to change as long as the ids listed in PLAN.md stay. The page runs on the fixed 2026-11-09
// dataset with today pinned to that date, so the expected numbers never go stale.

describe('App', () => {
  let fixture: ComponentFixture<App>;
  let page: HTMLElement;
  let store: CalculatorStore;

  beforeEach(async () => {
    localStorage.clear();
    await TestBed.configureTestingModule({
      imports: [App],
      providers: [{ provide: DATASET, useValue: DATASET_2026_11_09 }],
    }).compileComponents();
    store = TestBed.inject(CalculatorStore);
    store.setToday('2026-11-09');
    fixture = TestBed.createComponent(App);
    page = fixture.nativeElement as HTMLElement;
    await fixture.whenStable();
  });

  function all(testId: string): HTMLElement[] {
    return Array.from(page.querySelectorAll<HTMLElement>(`[data-testid="${testId}"]`));
  }

  function el<T extends HTMLElement = HTMLElement>(testId: string, within: HTMLElement = page): T {
    const found = within.querySelector<T>(`[data-testid="${testId}"]`);
    if (!found) {
      throw new Error(`Nothing on the page has data-testid="${testId}"`);
    }
    return found;
  }

  function text(testId: string, within: HTMLElement = page): string {
    return (el(testId, within).textContent ?? '').replace(/\s+/g, ' ').trim();
  }

  /** Text of one cell in the results table, for example result('qatar', 'max-total'). */
  function result(programId: string, cellId: string): string {
    return text(cellId, el(`result-row-${programId}`));
  }

  async function click(testId: string): Promise<void> {
    el(testId).click();
    await fixture.whenStable();
  }

  async function type(testId: string, value: string): Promise<void> {
    const input = el<HTMLInputElement>(testId);
    input.value = value;
    input.dispatchEvent(new Event('input', { bubbles: true }));
    await fixture.whenStable();
  }

  async function choose(testId: string, value: string): Promise<void> {
    const select = el<HTMLSelectElement>(testId);
    select.value = value;
    select.dispatchEvent(new Event('change', { bubbles: true }));
    await fixture.whenStable();
  }

  async function setChecked(testId: string, checked: boolean): Promise<void> {
    const box = el<HTMLInputElement>(testId);
    box.checked = checked;
    box.dispatchEvent(new Event('change', { bubbles: true }));
    await fixture.whenStable();
  }

  function resultRowIds(): string[] {
    return Array.from(page.querySelectorAll<HTMLElement>('[data-testid^="result-row-"]')).map(
      (row) => (row.getAttribute('data-testid') ?? '').replace('result-row-', ''),
    );
  }

  it('opens on the results with the example balances', () => {
    expect(page.querySelector('h1')?.textContent).toContain('Points transfer calculator');
    expect(el<HTMLInputElement>('balance-amex').value).toBe('120000');
    expect(el<HTMLInputElement>('balance-wells-fargo').value).toBe('15000');
    expect(text('total-balance')).toBe('370,000');
    expect(text('today')).toBe('Nov 9, 2026');
    expect(all('example-note').length).toBe(1);
    expect(resultRowIds().length).toBe(40);
    expect(resultRowIds().slice(0, 3)).toEqual(['aer-lingus', 'aeromexico', 'aeroplan']);

    expect(result('qatar', 'direct-cards')).toBe('4');
    expect(result('qatar', 'direct-total')).toBe('265,000');
    expect(result('qatar', 'max-total')).toBe('397,000');
    expect(result('qatar', 'added')).toBe('132,000');
    expect(result('qatar', 'routes')).toContain('Chase via British Airways Club');
    expect(result('qatar', 'routes')).toContain('Wells Fargo via British Airways Club');
    expect(result('korean', 'direct-total')).toBe('–');
    expect(result('korean', 'max-total')).toBe('159,063');
    expect(result('flying-blue', 'added')).toBe('–');
    expect(result('flying-blue', 'routes')).toBe('');
  });

  it('recalculates as a balance is typed and remembers it', async () => {
    await type('balance-chase', '0');
    expect(result('qatar', 'max-total')).toBe('280,000');
    expect(text('total-balance')).toBe('280,000');
    expect(all('example-note').length).toBe(0);
    expect(localStorage.getItem(STORAGE_KEY)).toContain('"chase":0');

    await click('clear-balances');
    expect(text('total-balance')).toBe('0');
    expect(el<HTMLInputElement>('balance-amex').value).toBe('');
    expect(result('qatar', 'max-total')).toBe('–');
  });

  it('Chase card setting changes the Hyatt ratio', async () => {
    expect(el<HTMLInputElement>('setting-chase-preferred').checked).toBe(true);
    expect(result('hyatt', 'direct-total')).toBe('97,500');
    await setChecked('setting-chase-reserve', true);
    expect(result('hyatt', 'direct-total')).toBe('120,000');
    expect(store.settings().chaseCard).toBe('reserve');
    await setChecked('setting-chase-preferred', true);
    expect(result('hyatt', 'direct-total')).toBe('97,500');
  });

  it('Citi card setting applies 70% to Citi ratios', async () => {
    expect(el<HTMLInputElement>('setting-citi-premium').checked).toBe(true);
    expect(result('aadvantage', 'direct-total')).toBe('40,000');
    await setChecked('setting-citi-other', true);
    expect(result('aadvantage', 'direct-total')).toBe('28,000');
  });

  it('Count limited-time transfer bonuses can be switched off', async () => {
    expect(el<HTMLInputElement>('setting-count-bonuses').checked).toBe(true);
    expect(result('hilton', 'max-total')).toBe('648,750');
    await setChecked('setting-count-bonuses', false);
    expect(result('hilton', 'max-total')).toBe('615,000');
    expect(result('british-airways', 'direct-total')).toBe('330,000');
  });

  it('Count Marriott and Hyatt block bonuses can be switched off', async () => {
    expect(el<HTMLInputElement>('setting-count-block-bonuses').checked).toBe(true);
    expect(result('united', 'max-total')).toBe('247,875');
    await setChecked('setting-count-block-bonuses', false);
    expect(result('united', 'max-total')).toBe('205,250');
  });

  it('routes that need status start off and can be switched on from Settings', async () => {
    const ids = ['accor>flying-blue', 'united>marriott', 'aeroplan>marriott', 'atmos>marriott'];
    for (const id of ids) {
      expect(el<HTMLInputElement>(`restricted-${id}`).checked, id).toBe(false);
    }
    expect(result('korean', 'max-total')).toBe('159,063');
    await setChecked('restricted-aeroplan>marriott', true);
    expect(result('korean', 'max-total')).toBe('166,875');
    expect(result('marriott', 'max-total')).toBe('394,500');
    expect(store.routeOverrides()).toEqual({ 'aeroplan>marriott': true });
  });

  it('every partner transfer has its own switch', async () => {
    await click('tab-partner-transfers');
    expect(page.querySelectorAll('[data-testid^="route-row-"]').length).toBe(146);
    expect(el<HTMLInputElement>('route-toggle-british-airways>qatar').checked).toBe(true);
    expect(el<HTMLInputElement>('route-toggle-united>marriott').checked).toBe(false);
    expect(text('ratio-used', el('route-row-marriott>united'))).toBe('0.50');
    expect(text('ratio-used', el('route-row-united>marriott'))).toBe('Off');
    expect(el<HTMLButtonElement>('routes-reset').disabled).toBe(true);

    await setChecked('route-toggle-british-airways>qatar', false);
    expect(text('ratio-used', el('route-row-british-airways>qatar'))).toBe('Off');
    expect(text('routes-reset')).toContain('1 changed');

    await click('tab-results');
    expect(result('qatar', 'max-total')).toBe('397,000');
    expect(result('qatar', 'routes')).toContain('Chase via British Airways Club > Iberia Plus');

    await click('tab-partner-transfers');
    await click('routes-reset');
    expect(el<HTMLInputElement>('route-toggle-british-airways>qatar').checked).toBe(true);
    expect(store.routeOverrides()).toEqual({});
  });

  it('lets the user add and remove a card transfer bonus', async () => {
    await click('tab-bonuses');
    expect(page.querySelectorAll('[data-testid^="bonus-row-"]').length).toBe(9);
    expect(text('bonus-status', el('bonus-row-seed-amex-marriott'))).toBe('Active');

    await choose('bonus-card', 'citi');
    expect(el<HTMLSelectElement>('bonus-program').options.length).toBe(20);
    await choose('bonus-program', 'qatar');
    await type('bonus-percent', '50');
    await click('bonus-add');
    expect(all('bonus-error').length).toBe(0);
    const added = el('bonus-row-user-1');
    expect(added.textContent).toContain('Citi');
    expect(added.textContent).toContain('Qatar Privilege Club');
    expect(added.textContent).toContain('50%');
    expect(added.textContent).toContain('No end date');
    expect(text('bonus-status', added)).toBe('Active');
    expect(el<HTMLInputElement>('bonus-percent').value).toBe('');

    await click('tab-results');
    expect(result('qatar', 'direct-total')).toBe('285,000');
    expect(result('qatar', 'max-total')).toBe('417,000');

    await click('tab-bonuses');
    await click('bonus-remove-user-1');
    expect(page.querySelectorAll('[data-testid^="bonus-row-"]').length).toBe(9);
    await click('tab-results');
    expect(result('qatar', 'direct-total')).toBe('265,000');
  });

  it('explains what is wrong with a bonus instead of adding it', async () => {
    await click('tab-bonuses');
    await click('bonus-add');
    expect(text('bonus-error')).toMatch(/percent/i);
    expect(page.querySelectorAll('[data-testid^="bonus-row-"]').length).toBe(9);
    await type('bonus-percent', '25');
    await type('bonus-end', '2026-12-31');
    await click('bonus-add');
    expect(all('bonus-error').length).toBe(0);
    expect(el('bonus-row-user-1').textContent).toContain('Dec 31, 2026');
  });

  it('shows when bonuses have ended or are not being counted, and can restore the built-in list', async () => {
    await click('tab-bonuses');
    await click('bonus-remove-seed-amex-marriott');
    expect(page.querySelectorAll('[data-testid^="bonus-row-"]').length).toBe(8);
    await click('bonus-reset');
    expect(page.querySelectorAll('[data-testid^="bonus-row-"]').length).toBe(9);

    await setChecked('setting-count-bonuses', false);
    expect(text('bonus-status', el('bonus-row-seed-amex-marriott'))).toBe('Not counted');

    store.setToday('2027-01-15');
    await fixture.whenStable();
    expect(text('bonus-status', el('bonus-row-seed-amex-marriott'))).toBe('Ended');
    expect(text('today')).toBe('Jan 15, 2027');
  });

  it('shows the best route for every card and program', async () => {
    await click('tab-best-routes');
    expect(page.querySelectorAll('[data-testid^="best-row-"]').length).toBe(40);
    expect(text('best-united-citi')).toContain('0.375');
    expect(text('best-united-citi')).toContain('via Singapore KrisFlyer > Marriott Bonvoy');
    expect(text('best-qatar-chase')).toContain('1.30');
    expect(text('best-qatar-chase')).toContain('via British Airways Club');
    expect(text('best-qatar-amex')).toContain('1.00');
    expect(text('best-qatar-amex')).toContain('Direct');
    expect(text('best-amtrak-amex')).toContain('No route');
  });

  it('shows the card ratios and what changes them', async () => {
    await click('tab-card-ratios');
    expect(page.querySelectorAll('[data-testid^="ratio-row-"]').length).toBe(40);
    expect(text('ratio-british-airways-chase')).toContain('1.00');
    expect(text('ratio-british-airways-chase')).toContain('1.30 with 30% bonus');
    expect(text('ratio-hyatt-chase')).toBe('0.75');
    expect(text('ratio-hyatt-amex')).toBe('');
    await setChecked('setting-citi-other', true);
    expect(text('ratio-aadvantage-citi')).toContain('1.00');
    expect(text('ratio-aadvantage-citi')).toContain('0.70 on your card');
  });

  it('lists the sources', async () => {
    await click('tab-sources');
    const links = el('sources-table').querySelectorAll('a[href^="https://"]');
    expect(links.length).toBe(25);
  });

  it('filters, searches and sorts the results', async () => {
    await click('filter-other');
    expect(resultRowIds().length).toBe(10);
    expect(resultRowIds()[0]).toBe('marriott');
    await click('filter-airline');
    expect(resultRowIds().length).toBe(30);
    await click('filter-all');

    await type('results-search', 'virgin');
    expect(resultRowIds()).toEqual(['virgin-atlantic', 'virgin-red']);
    await type('results-search', 'zzz');
    expect(resultRowIds()).toEqual([]);
    expect(all('results-empty').length).toBe(1);
    await type('results-search', '');

    await choose('results-sort', 'max');
    expect(resultRowIds()[0]).toBe('hilton');
    await choose('results-sort', 'added');
    expect(resultRowIds().slice(0, 2)).toEqual(['hilton', 'finnair']);
    await choose('results-sort', 'list');
    expect(resultRowIds()[0]).toBe('aer-lingus');
  });

  it('shows the per-card breakdown for a program', async () => {
    expect(all('detail-qatar').length).toBe(0);
    await click('details-qatar');
    const chase = text('detail-qatar-chase');
    expect(chase).toContain('90,000');
    expect(chase).toContain('1.30');
    expect(chase).toContain('via British Airways Club');
    expect(chase).toContain('117,000');
    await click('details-qatar');
    expect(all('detail-qatar').length).toBe(0);
  });

  it('Reset everything asks first, then restores the starting values', async () => {
    await type('balance-amex', '5');
    await setChecked('setting-chase-reserve', true);
    await setChecked('restricted-united>marriott', true);
    await click('reset-all');
    expect(store.balances().amex).toBe(5);
    await click('reset-all-confirm');
    expect(el<HTMLInputElement>('balance-amex').value).toBe('120000');
    expect(el<HTMLInputElement>('setting-chase-preferred').checked).toBe(true);
    expect(el<HTMLInputElement>('restricted-united>marriott').checked).toBe(false);
    expect(result('qatar', 'max-total')).toBe('397,000');
    expect(localStorage.getItem(STORAGE_KEY)).toBeNull();
  });
});
````

## Added to the end of `CLAUDE.md`

<!-- APPEND CLAUDE.md fbf061ae27f6 -->
````text
## Project notes: points transfer calculator

These notes are specific to this project. Where they differ from the general advice above, follow these.

- `PLAN.md` is the build plan. Its Part A explains how the calculation maps to the original spreadsheet. Read Part A before changing behaviour. Do not read Part B: it is a copy of the source files.
- Commands: `npx ng test --watch=false` (must stay green), `npx ng build --base-href ./`, `npx ng serve`.
- This is one static page. There is no router, no server, no HTTP call and no forms package. Inputs are native elements bound to signals: see `src/app/balances/balances-panel.html` and `src/app/bonuses/bonuses-view.html`. Do not introduce Signal Forms, Reactive Forms, the router or lazy loading.
- All state lives in `CalculatorStore` (`src/app/core/calculator-store.ts`). Components read its signals and call its methods. They never touch `localStorage` and never import a dataset file.
- The calculation is `src/app/core/engine.ts`: pure functions, no Angular. Its results are pinned by `src/app/core/engine.fixtures.ts`, which came from the spreadsheet. Never regenerate the fixtures from the engine.
- Built-in data lives in `src/app/core/datasets/`. To change a ratio, a partner transfer, a source or a built-in bonus, add a new dated dataset file and point `current.ts` at it. Never edit `dataset-2026-11-09.ts`: the tests use it as their fixed baseline.
- Components build display-ready rows in one `computed()` and keep templates free of logic. `src/app/results/results-view.ts` is the pattern.
- All styles are in `src/styles.css`. Components have no stylesheets of their own.
- Tests find elements by `data-testid`. Keep the existing ids when changing markup.
- Never put real point balances in the repository. The example balances are made up.
````
