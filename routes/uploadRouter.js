const express = require("express");

const bodyParser = require("body-parser");

const authenticate = require("../authenticate");

const multer = require("multer");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "public/images");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const imageFileFilter = (req, file, cb) => {
  if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
    return cb(new Error("You can upload only image files!"), false);
  }
  cb(null, true);
};

const upload = multer({ storage: storage, fileFilter: imageFileFilter });

const uploadRouter = express.Router();

uploadRouter.use(bodyParser.json());

uploadRouter
  .route("/")
  .get((req, res, next) => {
    res.statusCode = 401;
    res.end("GET request is not spported on /images/");
  })
  .post(
    authenticate.verifyUser,
    authenticate.verifyAdmin,
    upload.single("imageFile"),
    (req, res, next) => {
      res.statusCode = 201;
      res.setHeader("Content-Type", "application/json");
      res.json(req.file);
    }
  )
  .put((req, res, next) => {
    res.statusCode = 401;
    res.end("PUT request is not spported on /images/");
  })
  .delete((req, res, next) => {
    res.statusCode = 401;
    res.end("DELETE request is not spported on /images/");
  });

module.exports = uploadRouter;
