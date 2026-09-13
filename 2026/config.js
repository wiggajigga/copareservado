/**
 * Supabase-tilkobling for stemmingen.
 *
 * Prosjekt: copa-reservado (organisasjon Copa Reservado, gratisplan, Frankfurt)
 *
 * Nøkkelen under er en publiserbar nøkkel. Den er ment å ligge i klienten.
 * Tilgangen styres av reglene i supabase/schema.sql, ikke av at nøkkelen
 * er hemmelig: alle kan lese og stemme, ingen kan slette.
 *
 * Står feltene tomme, viser siden banene uten stemming.
 */
window.COPA_SUPABASE = {
  url: 'https://pfstrtpnxtjljflmcrsv.supabase.co',
  anonKey: 'sb_publishable_C76uaZYqhfv-wmaNzegGdQ_7pQN0S-h'
};
