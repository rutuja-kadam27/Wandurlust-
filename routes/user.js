const express = require("express");
const router = express.Router();
const User = require("../models/user");
const asyncWrap = require("../utils/asyncWrap");
const passport = require("passport");
const { saveRedirectUrl } = require("../middlewares");

const userController = require("../controllers/user");
// ---------------- Signup ----------------
 router
 .route("/signup")
 .get(userController.rendersignup)
 .post(asyncWrap(userController.signup))

// ---------------- Login ----------------
router
.route("/login")
.get(userController.renderlogin)
.post(
  saveRedirectUrl,
  passport.authenticate("local", {
    failureRedirect: "/login",
    failureFlash: true
  }),
  userController.login
);

// ---------------- Logout ----------------
router.get("/logout", userController.logout);

module.exports = router;
