const express = require("express");
const contributorController = require("./../controllers/manual/contributorController");
const authController = require("./../controllers/authController");
const router = express.Router({ mergeParams: true });

router.use(authController.protect);

router
  .route("/")
  .get(contributorController.getAllContributors)
  .post(
    contributorController.addUserIDAndGroupIDToContributor,
    contributorController.createContributor
  );

router
  .route("/:id")
  .get(contributorController.getContributor)
  .delete(contributorController.deleteContributor)
  .patch(contributorController.updateContributor);

module.exports = router;
