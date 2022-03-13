const { Horse } = require("../models/Horse");
const schedule = require("node-schedule");

const handleHorseHunger = schedule.scheduleJob("0 */2 * * *", async () => {
  // Every 2 hours run this job "0 */2 * * *"
  await Horse.decreaseSatiety(10);
  await Horse.handleWeightAllHorses({ number: 20, operation: "-" });
});

const handleAge = schedule.scheduleJob("0 0 1 1 *", async () => {
  // Every 1 year run this job
  await Horse.increaseAge();
})

module.exports = {handleHorseHunger, handleAge};
