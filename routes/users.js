const express = require("express");
const User = require("../models/User");
const bcrypt = require("bcryptjs");
const passport = require("passport");

const router = express.Router();

router.get("/login", (req, res) => {
  res.render("login");
});

router.get("/register", (req, res) => {
  res.render("register");
});

router.post("/register", (req, res) => {
  const { name, email, password, password2 } = req.body;
  const errors = [];

  // check of empty value
  if (!name || !email || !password || !password2) {
    errors.push({ msg: "Please fill in all values" });
  }

  // check for password match
  if (password !== password2) {
    errors.push({ msg: "Password didnt match" });
  }

  if (password < 6) {
    errors.push({ msg: "password length should be atleast 6 characters" });
  }

  if (errors.length > 0) {
    res.render("register", {
      errors,
      name,
      email,
      password,
      password2,
    });
  } else {
    User.findOne({ email: email }).then((user) => {
      if (user) {
        errors.push({ msg: "Email already registered" });
        res.render("register", {
          errors,
          name,
          email,
          password,
          password2,
        });
      } else {
        const newUser = new User({
          name,
          email,
          password,
        });
        bcrypt.genSalt(10, (err, salt) => {
          bcrypt.hash(password, salt, (err, hash) => {
            if (!err) {
              newUser.password = hash;
              newUser
                .save()
                .then((user) => {
                  req.flash("success_msg", "You have registered successfully");
                  res.redirect("login");
                })
                .catch((err) => console.log(err));
            }
          });
        });
      }
    });
  }
});

router.post("/login", (req, res, next) => {
  passport.authenticate("local", {
    successRedirect: "/dashboard",
    failureRedirect: "/users/login",
    failureFlash: true,
  })(req, res, next);
});

router.get("/logout", (req, res, next) => {
  req.logout();
  req.flash("success_msg", "You have been logged out successfully");
  res.redirect("/users/login");
});
module.exports = router;
