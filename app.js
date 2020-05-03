const express = require("express");
const ejsLayouts = require("express-ejs-layouts");
const mongoose = require("mongoose");
const flash = require("connect-flash");
const passport = require("passport");
const session = require("express-session");
const indexRoute = require("./routes/index");
const userRoute = require("./routes/users");

const app = express();

//passport configuration
require("./config/passport")(passport);

//database connection
//"mongodb+srv://<username>:<password>@cluster0-wnwz9.mongodb.net/<collection_name>?retryWrites=true&w=majority"
const db = require("./config/keys").MongoURI;
mongoose
  .connect(db, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("DB connected"))
  .catch((err) => console.log(err));

// template
app.use(ejsLayouts);
app.set("view engine", "ejs");

//body parser
app.use(express.urlencoded({ extended: false }));

// express session
app.use(
  session({
    secret: "secret",
    resave: true,
    saveUninitialized: true,
  })
);

//passport
app.use(passport.initialize());
app.use(passport.session());

// connect flash
app.use(flash());

// Global variables
app.use((req, res, next) => {
  res.locals.success_msg = req.flash("success_msg");
  res.locals.error_msg = req.flash("error_msg");
  res.locals.error = req.flash("error");
  next();
});
//routes
app.use("/", indexRoute);
app.use("/users", userRoute);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log("Server started"));
