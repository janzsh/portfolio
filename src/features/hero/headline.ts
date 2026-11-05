/** Splits a headline so its last words can be highlighted. Short headlines are highlighted whole. */
export function splitHeadline(headline: string, accentWords = 3): { lead: string; accent: string } {
  const words = headline.split(' ');
  const cut = Math.max(words.length - accentWords, 0);
  return { lead: words.slice(0, cut).join(' '), accent: words.slice(cut).join(' ') };
}
