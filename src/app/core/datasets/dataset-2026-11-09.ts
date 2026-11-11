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
