var createError = require("http-errors");
var express = require("express");
var path = require("path");
var cookieParser = require("cookie-parser");
var logger = require("morgan");
var indexRouter = require("./routes/index");
var usersRouter = require("./routes/users");
var cors = require("cors");
var app = express();

var passport = require("passport");
var authenticate = require("./authenticate");

var config = require("./config");

const session = require("express-session");
const FileStore = require("session-file-store")(session);

const mongoose = require("mongoose");
const Dishes = require("./models/dishes");
const Url = config.mongoUrl;
const connect = mongoose.connect(Url, { useNewUrlParser: true });

connect.then(
  (db) => {
    console.log("succesfully connected to mongoDB");
  },
  (err) => {
    console.log(err);
  }
);

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");
var dishRouter = require("./routes/dishRouter");
var promoRouter = require("./routes/promoRouter");
var leaderRouter = require("./routes/leadersRouter");
var favoriteRouter = require("./routes/favoriteRouter");
var uploadRouter = require("./routes/uploadRouter");
app.use(cors());
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
//app.use(cookieParser("12345-67890-09876-54321"));
app.use(express.static(path.join(__dirname, "public")));
app.use(
  session({
    name: "session-id",
    secret: "12345-67890-09876-54321",
    saveUninitialized: false,
    store: new FileStore(),
    resave: true,
  })
);
app.use(passport.initialize());
app.use(passport.session());

app.use("/", indexRouter);
app.use("/users", usersRouter);

//---------------Basic Authentication-----------------
function auth(req, res, next) {
  console.log(req.user);

  if (!req.user) {
    var err = new Error("You are not authenticated! salam");
    err.status = 403;
    next(err);
  } else {
    next();
  }
}

app.use(auth);

app.use("/dishes", dishRouter);
app.use("/promotions", promoRouter);
app.use("/leaders", leaderRouter);
app.use("/imageUpload", uploadRouter);
app.use("/favorites", favoriteRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});
app.all("*", (req, res, next) => {
  if (req.secure) {
    return next();
  } else {
    res.redirect(
      307,
      "https://" + req.hostname + ":" + app.get("secPort") + req.url
    );
  }
});
module.exports = app;
