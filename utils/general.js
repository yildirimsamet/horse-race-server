exports.getRandomNumberInRange = (min, max) => {
  return Math.round(Math.random() * (max - min) + min);
};
exports.generateRandomHexColor = () => {
  let n = (Math.random() * 0xfffff * 1000000).toString(16);
  return "#" + n.slice(0, 6);
};
