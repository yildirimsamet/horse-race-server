const express = require("express");
const router = express.Router();
const raceController = require("../../controllers/race");
const { authMiddleware } = require("../../middlewares/auth");

router.use("/get-races", authMiddleware, raceController.getRaces);

router.use("/join-race", authMiddleware, raceController.joinRace);

router.use("/leave-race", authMiddleware, raceController.leaveRace);

router.use("/get-results", authMiddleware, raceController.getRaceResults);

module.exports = router;
