// Spillere (fast rekkefølge)
const PLAYERS = ["MA","TR","KAS","FSA"];
const NAME = { MA:"MA", TR:"TR", KAS:"KAS", FSA:"FSA" };

/**
 * 2025-resultater
 * Dag 1 – Stableford (4–3–2–1) + bonus (0.5 for LD/CtP)
 * Dag 2 – Skins (4–3–2–1 etter flest skins) + bonus
 * Dag 3 – Lagmatch (vinnerlag 4 pr spiller, taperlag 2) + bonus
 */
const RESULTS = {
  // === DAG 1 – Santa Clara (Stableford) ===
  day1: {
    // Gårsdagens rekkefølge (1.–4. plass):
    // MA = 4p, KAS = 3p, FSA = 2p, TR = 1p
    ranking: ["MA", "KAS", "FSA", "TR"],

    // Closest to pin: ingen → utelates (ingen bonus gis)
    // closestToPin: null,

    // Longest drive: Trygve (TR) → +0.5
    longestDrive: "TR"
  },

  // === DAG 2 – Alferini (Skins) ===
  // Fylles inn etter runden
  day2: {
    skins: { MA:0, TR:0, KAS:0, FSA:0 }
    // closestToPin: "",
    // longestDrive: ""
  },

  // === DAG 3 – Marbella Club (Lagmatch) ===
  // Settes etter dag 2 (1+4 vs 2+3) + vinnerlag
  day3: {
    teamA: ["KAS","FSA"],   // eksempel – oppdater senere
    teamB: ["MA","TR"]      // eksempel – oppdater senere
    // winnerTeam: "A" eller "B"
    // closestToPin: "",
    // longestDrive: ""
  }
};
