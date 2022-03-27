const Participant = require("../../models/Participants");
const Race = require("../../models/Races");
const User = require("../../models/User");
const { Horse } = require("../../models/Horse");
const Result = require("../../models/Results");

exports.getRaces = async (req, res, next) => {
  try {
    const [races] = await Race.getRaces({});
    for (const race of races) {
      race.users = [];
      const [participants] = await Participant.getParticipants({
        raceId: race.id,
      });
      for (const participant of participants) {
        const [[user]] = await User.getUserById(participant.userId);
        const [[horse]] = await Horse.getHorseById(participant.horseId);
        delete user.password;
        user.horseInfo = horse;
        race.users.push(user);
      }
    }
    return res.json({ success: true, races });
  } catch (error) {
    next(error);
  }
};
exports.joinRace = async (req, res, next) => {
  try {
    const { userId } = res.locals;
    const { horseId, raceId } = req.body;
    if (!horseId || !raceId)
      return res.json({ success: false, message: "Invalid request" });

    const [[race]] = await Race.getRaceById(raceId);
    if (!race)
      return res.json({ success: false, message: "Couldn't find race" });

    const isRaceFull = race.currentCount >= race.maxCount;
    if (isRaceFull)
      return res.json({ success: false, message: "Race is full!" });

    const isRaceDone = race.statu === 1;
    if (isRaceDone)
      return res.json({ success: false, message: "Race is done!" });

    const [[user]] = await User.getUserById(userId);
    const isUserHasEnoughCoins = user.coins >= race.price;

    if (!isUserHasEnoughCoins)
      return res.json({
        success: false,
        message: "You dont have enough coins!",
      });

    const [[horse]] = await Horse.getHorseById(horseId);
    if (!horse)
      return res.json({ success: false, message: "Couldn't find horse" });
    if (horse.isOnMarket === 1)
      return res.json({ success: false, message: "Horse is on market!" });

    const isHorseAlreadyInRace = horse.isOnRace === 1;
    if (isHorseAlreadyInRace)
      return res.json({ success: false, message: "Horse is already in race" });

    const isHorseUsers = user.id === horse.ownerId;
    if (!isHorseUsers)
      return res.json({
        success: false,
        message: "You are not the owner of this horse!",
      });

    const [[isUserParticipantOfThisRace]] =
      await Participant.getParticipantByUserIdAndRaceId({ userId, raceId });
    if (isUserParticipantOfThisRace)
      return res.json({
        success: false,
        message: "You are already in this race",
      });

    // NO PROBLEM START JOIN
    const [joinRaceInfo] = await new Participant({
      userId,
      horseId,
      raceId,
    }).create();
    if (joinRaceInfo.affectedRows <= 0)
      return res.json({
        success: false,
        message: "An error occured while joining race!",
      });
    await User.changeUserCoins({ userId, coins: race.price, operation: "-" });
    await Horse.setHorseIsOnRaceById({ horseId, isOnRace: 1 });
    await Race.changeRaceCurrentCountById({ raceId, count: 1, operation: "+" });

    return res.json({ success: true, message: "Successfully joined race" });
  } catch (error) {
    next();
  }
};

exports.leaveRace = async (req, res, next) => {
  try {
    const { userId } = res.locals;
    const { raceId, horseId } = req.body;
    if (!raceId || !horseId)
      return res.json({ success: false, message: "Invalid request" });

    const [[race]] = await Race.getRaceById(raceId);
    if (!race) return res.json({ success: false, message: "Race not found!" });
    if (race.statu === 1)
      return res.json({ success: false, message: "Race already done!" });

    const [[isUserParticipantOfThisRace]] =
      await Participant.getParticipantByUserIdAndRaceId({ userId, raceId });
    if (!isUserParticipantOfThisRace)
      return res.json({ success: false, message: "You are not in this race" });

    const [[user]] = await User.getUserById(userId);
    if (!user)
      return res.json({ success: false, message: "Couldn't find user" });

    const [[horse]] = await Horse.getHorseById(horseId);
    if (!horse)
      return res.json({ success: false, message: "Couldn't find horse" });

    const isHorseUsers = user.id === horse.ownerId;
    if (!isHorseUsers)
      return res.json({
        success: false,
        message: "You are not the owner of this horse!",
      });

    await User.changeUserCoins({ userId, coins: race.price, operation: "+" });
    await Horse.setHorseIsOnRaceById({ horseId, isOnRace: 0 });
    await Race.changeRaceCurrentCountById({ raceId, count: 1, operation: "-" });
    await Participant.removeParticipant({ raceId, userId });

    return res.json({
      success: true,
      message: "Successfully leaved from race",
    });
  } catch (error) {
    next();
  }
};

exports.getRaceResults = async (req, res, next) => {
  try {
    const { raceId } = req.body;
    const [results] = await Result.getResultsByRaceId(raceId);
    if(!results || results.length <=0) return res.json({success: false, message: "No results yet"});
    const resultsInfo = [];

    for (const result of results) {
      const [[[user]], [[horse]]] = await Promise.all([
        await User.getUserById(result.userId),
        await Horse.getHorseById(result.horseId),
      ]);
      if (!user || !horse)
        return res.json({
          success: false,
          message: "Couldn't find user or horse",
        });

      delete user.password;
      horse.speed = result.speed;
      horse.speedType = result.speedType;
      user.finishedAt = result.finishedAt;
      user.winPrice = result.winPrice;
      resultsInfo.push({ user, horse });
    }

    res.json({ success: true, resultsInfo });
  } catch (error) {
    next(error);
  }
};
