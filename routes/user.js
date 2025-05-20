const express = require("express");
const router = express.Router();
// const User = require("../models/user.js");
const wrapAsync = require("../utils/wrapAsync");
const passport = require("passport");
const { savaRedirect, isAlreadyLoggedIn } = require("../utils/middleware.js");

const userController = require("../controllers/user.js");

router
  .route("/signup")
  .get(isAlreadyLoggedIn, userController.renderSignup)
  .post(wrapAsync(userController.createNewUser));

// router.get("/signup", userController.renderSignup);

// router.post("/signup", wrapAsync(userController.createNewUser));

router
  .route("/login")
  .get(isAlreadyLoggedIn, userController.renderLogin)
  .post(
    savaRedirect,
    passport.authenticate("local", {
      failureRedirect: "/login",
      failureFlash: true,
    }),
    userController.loginUser
  );

// router.get("/login", userController.renderLogin);

// router.post(
//   "/login",
//   savaRedirect,
//   passport.authenticate("local", {
//     failureRedirect: "/login",
//     failureFlash: true,
//   }),
//   userController.loginUser
// );

router.get("/logout", userController.logoutUser);

module.exports = router;
