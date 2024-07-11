/* eslint-disable no-bitwise */
export const getStringWordsInitials = (str: string) =>
  str
    .split(" ")
    .map((word) => word[0])
    .join("");

export const stringToColour = (str: string) => {
  let hash = 0;
  str.split("").forEach((char) => {
    hash = char.charCodeAt(0) + ((hash << 5) - hash);
  });
  let colour = "";
  // eslint-disable-next-line no-plusplus
  for (let i = 0; i < 3; i++) {
    const value = (hash >> (i * 8)) & 0xff;
    colour += value.toString(16).padStart(2, "0");
  }
  return colour;
};

export default { getStringWordsInitials, stringToColour };
