// Spillere (fast rekkefølge på visning)
const PLAYERS = ["MA","TR","KAS","FSA"];
const NAME = { MA:"MA", TR:"TR", KAS:"KAS", FSA:"FSA" };

/**
 * FYLL INN ETTERHVERT:
 * - Dag 1: ranking (1.–4.) + stableford (valgfritt for visning)
 * - Dag 2: skins per spiller
 * - Dag 3: laginndeling + winnerTeam ("A" eller "B")
 * - closestToPin/longestDrive hver dag
 */
const RESULTS = {
  day1: {
    ranking: ["KAS","TR","MA","FSA"], // eksempel – endre når runden er spilt
    stableford: { KAS:36, TR:34, MA:31, FSA:28 },
    closestToPin: "KAS",
    longestDrive: "MA"
  },
  day2: {
    skins: { MA:6, TR:4, KAS:5, FSA:3 },
    closestToPin: "TR",
    longestDrive: "FSA"
  },
  day3: {
    teamA: ["KAS","FSA"], // settes 1+4 vs 2+3 etter dag 2
    teamB: ["MA","TR"],
    winnerTeam: "A",
    closestToPin: "MA",
    longestDrive: "TR"
  }
};
