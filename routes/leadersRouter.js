const express = require("express");
const bodyParser = require("body-parser");

const leadersRouter = express.Router();
leadersRouter.use(bodyParser.json());

var authenticate = require("../authenticate");

const cors = require("./cors");

const mongoose = require("mongoose");
const Leaders = require("../models/leaders");

leadersRouter
  .route("/")
  .options(cors.corsWithOptions, (req, res) => {
    res.statusCode(200);
  })
  .get(cors.cors, (req, res, next) => {
    Leaders.find({})
      .then(
        (leaders) => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(leaders);
        },
        (err) => {
          next(err);
        }
      )
      .catch((err) => {
        next(err);
      });
  })
  .post(
    cors.corsWithOptions,
    authenticate.verifyUser,
    authenticate.verifyAdmin,
    (req, res, next) => {
      Leaders.create(req.body)
        .then(
          (leader) => {
            res.statusCode = 201;
            res.setHeader("Content-Type", "application/json");
            res.json(leader);
          },
          (err) => {
            next(err);
          }
        )
        .catch((err) => {
          next(err);
        });
    }
  )
  .put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end("PUT operation is not supported for /leaders");
  })
  .delete(
    cors.corsWithOptions,
    authenticate.verifyUser,
    authenticate.verifyAdmin,
    (req, res, next) => {
      Leaders.remove({})
        .then(
          (leaders) => {
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.json(leaders);
          },
          (err) => {
            next(err);
          }
        )
        .catch((err) => {
          next(err);
        });
    }
  );

//-------------------HTTP requests with LeaderId-----------------------------

leadersRouter
  .route("/:leaderId")
  .options(cors.corsWithOptions, (req, res) => {
    res.statusCode(200);
  })
  .get(cors.cors, (req, res, next) => {
    Leaders.findById(req.params.leaderId)
      .then(
        (leader) => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(leader);
        },
        (err) => {
          next(err);
        }
      )
      .catch((err) => {
        next(err);
      });
  })
  .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    res.statusCode = 403;
    res.end("POST is not supported for /leaders/" + req.params.leaderId);
  })
  .put(
    cors.corsWithOptions,
    authenticate.verifyUser,
    authenticate.verifyAdmin,
    (req, res, next) => {
      Leaders.findByIdAndUpdate(
        req.params.leaderId,
        {
          $set: req.body,
        },
        {
          new: true,
        }
      )
        .then(
          (leader) => {
            res.statusCode = 202;
            res.setHeader("Content-Type", "application/json");
            res.json(leader);
          },
          (err) => {
            next(err);
          }
        )
        .catch((err) => {
          next(err);
        });
    }
  )
  .delete(
    cors.corsWithOptions,
    authenticate.verifyUser,
    authenticate.verifyAdmin,
    (req, res, next) => {
      Leaders.findByIdAndRemove(req.params.leaderId)
        .then(
          (leader) => {
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.json(leader);
          },
          (err) => {
            next(err);
          }
        )
        .catch((err) => {
          next(err);
        });
    }
  );

module.exports = leadersRouter;
