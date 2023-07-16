export const getRandomId = () => {
  return Number(Math.random().toFixed(16).substring(2)).toString(36);
};
