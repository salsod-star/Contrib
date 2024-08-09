const express = require("express");
const userController = require("./../controllers/userController");
const authcontroller = require("./../controllers/authController");

const router = express.Router();

router.post("/signup", authcontroller.signup);
router.post("/login", authcontroller.login);

router.post("/forgotPassword", authcontroller.forgotPassword);
router.post("/resetPassword/:token", authcontroller.resetPassword);
router.patch("/updateMyPassword", authcontroller.protect, authcontroller.updatePassword);

router.patch("/updateMyProfile", authcontroller.protect, userController.updateMyProfile);
router.delete("/deleteMyAccount", authcontroller.protect, userController.deleteMyAccount);

router.route("/").get(userController.getAllUsers);
router.route("/:id").delete(userController.deleteUser);

module.exports = router;
