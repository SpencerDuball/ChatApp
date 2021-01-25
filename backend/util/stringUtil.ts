/**
 * Returns a new string with the first word capitalized.
 *
 * @param word - the string input.
 */
export const capitalize = (word: string) =>
  word.replace(/^\w/, (firstWord) => firstWord.toUpperCase());
