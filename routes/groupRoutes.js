const express = require("express");
const authController = require("./../controllers/authController");
const groupController = require("./../controllers/groupController");

const contribRouter = require("./../routes/contribRoutes");
const contributorRouter = require("./../routes/ContributorRoutes");

const router = express.Router();

router.use(authController.protect);

router.use("/:groupID/contributions", contribRouter);
router.use("/:groupID/contributors", contributorRouter);

router
  .route("/")
  .get(groupController.getAllGroups)
  .post(
    groupController.addCurrentUserIDToGroupAndSetNameToAdmin,
    groupController.createGroup
  )
  .delete(groupController.deleteAllGroups);

router
  .route("/:slug")
  .get(groupController.getGroup)
  .patch(groupController.updateGroup)
  .delete(groupController.deleteGroup);

module.exports = router;
