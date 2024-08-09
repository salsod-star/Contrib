const express = require("express");

const router = express.Router({ mergeParams: true });

const contribController = require("./../controllers/manual/contribControllers");
const authController = require("./../controllers/authController");

router.use(authController.protect);

router
  .route("/")
  .get(contribController.getAllContrib)
  .post(contribController.addReferenceIDToContribution, contribController.createContrib)
  .delete(contribController.deleteAllContribs);

router
  .route("/:id")
  .get(contribController.getContrib)
  .patch(contribController.updateContrib)
  .delete(contribController.deleteContrib);

module.exports = router;
