const express = require("express");
const bodyParser = require("body-parser");

const promosRouter = express.Router();
promosRouter.use(bodyParser.json());

var authenticate = require("../authenticate");
const mongoose = require("mongoose");

const Promotions = require("../models/promotions");

const cors = require("./cors");

promosRouter
  .route("/")
  .options(cors.corsWithOptions, (req, res) => {
    res.statusCode(200);
  })
  .get(cors.cors, (req, res, next) => {
    Promotions.find({})
      .then(
        (promotions) => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(promotions);
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
      Promotions.create(req.body)
        .then(
          (promotions) => {
            res.statusCode = 201;
            res.setHeader("Content-Type", "application/json");
            res.json(promotions);
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
    res.end("PUT operation is not supported for /promotions");
  })
  .delete(
    cors.corsWithOptions,
    authenticate.verifyUser,
    authenticate.verifyAdmin,
    (req, res, next) => {
      Promotions.remove({})
        .then(
          (promotions) => {
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.json(promotions);
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

promosRouter
  .route("/:promoId")
  .options(cors.corsWithOptions, (req, res) => {
    res.statusCode(200);
  })
  .get(cors.cors, (req, res, next) => {
    Promotions.findById(req.params.promoId)
      .then(
        (promotion) => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(promotion);
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
    res.end("POST is not supported for /promotions/" + req.params.promoId);
  })
  .put(
    cors.corsWithOptions,
    authenticate.verifyUser,
    authenticate.verifyAdmin,
    (req, res, next) => {
      Promotions.findByIdAndUpdate(
        req.params.promoId,
        {
          $set: req.body,
        },
        {
          new: true,
        }
      )
        .then(
          (promotion) => {
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.json(promotion);
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
      Promotions.findByIdAndRemove(req.params.promoId)
        .then(
          (promotion) => {
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            res.json(promotion);
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

module.exports = promosRouter;
