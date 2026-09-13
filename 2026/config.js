/**
 * Supabase-tilkobling for stemmingen.
 *
 * Fyll inn Project URL og anon/public key fra
 * Supabase → Project Settings → API.
 *
 * Anon-nøkkelen er ment å ligge i klienten. Tilgangen styres av
 * reglene i supabase/schema.sql, ikke av at nøkkelen er hemmelig.
 *
 * Står feltene tomme, viser siden banene uten stemming.
 */
window.COPA_SUPABASE = {
  url: '',
  anonKey: ''
};
