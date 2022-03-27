const { Horse } = require("../models/Horse");
const schedule = require("node-schedule");
const Race = require("../models/Races");
const Participant = require("../models/Participants");
const User = require("../models/User");
const Result = require("../models/Results");
const { calculateResults } = require("../utils/general");

const handleHorseHunger = schedule.scheduleJob("0 */2 * * *", async () => {
  // Every 2 hours run this job "0 */2 * * *"
  await Horse.decreaseSatiety(10);
  await Horse.handleWeightAllHorses({ number: 20, operation: "-" });
});

const handleAge = schedule.scheduleJob("0 0 1 1 *", async () => {
  // Every 1 year run this job "0 0 1 1 *"
  await Horse.increaseAge();
});

const createRace = schedule.scheduleJob("*/15 * * * *", async () => {
  // Every 15 minutes run this job "*/15 * * * *"
  // TODO calculate results of the last race before crete new one
  const [finisedRaces] = await Race.findNotCalcutaledFinishedRaces();
  for (const finishedRace of finisedRaces) {
    if (finishedRace.currentCount > 0) {
      const [participants] = await Participant.getParticipants({
        raceId: finishedRace.id,
      });
      const users = [];
      const horses = [];
      for (const participant of participants) {
        const [[[user]], [[horse]]] = await Promise.all([
          await User.getUserById(participant.userId),
          await Horse.getHorseById(participant.horseId),
        ]);
        users.push(user);
        horses.push(horse);
      }
      const [sortedHorses, resultUsers] = calculateResults({
        horses,
        users,
        totalPrice: finishedRace.price * finishedRace.currentCount,
      });
      for (const index in sortedHorses) {
        await new Result({
          raceId: finishedRace.id,
          horseId: sortedHorses[index].id,
          userId: sortedHorses[index].ownerId,
          speed: sortedHorses[index].speed,
          finishedAt: +index + 1,
          winPrice:
            resultUsers.find(
              (resultUser) => resultUser.id === sortedHorses[index].ownerId
            ).winPrice || 0,
        }).create();
        await Horse.setHorseIsOnRaceById({
          horseId: sortedHorses[index].id,
          isOnRace: false,
        });
        await User.changeUserCoins({
          userId: sortedHorses[index].ownerId,
          coins: resultUsers[index].winPrice || 0,
          operation: "+",
        });
      }
      await Race.chageStatuById({ raceId: finishedRace.id, statu: 1 });
    } else {
      await Race.removeRaceById(finishedRace.id);
    }
  }
  await Race.create();
});

module.exports = { handleHorseHunger, handleAge, createRace };
