// Spillere (fast rekkefølge)
const PLAYERS = ["MA","TR","KAS","FSA"];
const NAME = { MA:"MA", TR:"TR", KAS:"KAS", FSA:"FSA" };

// 2025 – kun Dag 1 lagt inn (Dag 2/3 spilles senere)
const RESULTS = {
  day1: {
    // Rekkefølge 1.–4. plass → 4–3–2–1 poeng:
    // MA = 4, KAS = 3, FSA = 2, TR = 1
    ranking: ["MA", "KAS", "FSA", "TR"],
    // Closest to pin: ingen (utelates)
    // Longest drive: Trygve (TR) → +0.5
    longestDrive: "TR"
  }
  // day2: (utelatt til spilt)
  // day3: (utelatt til spilt)
};
