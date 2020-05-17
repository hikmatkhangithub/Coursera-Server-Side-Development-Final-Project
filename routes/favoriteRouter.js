const express = require("express");
const bodyParser = require("body-parser");

const Favorites = require("../models/favorite");
const favoriteRouter = express.Router();
favoriteRouter.use(bodyParser.json());
var authenticate = require("../authenticate");
const cors = require("./cors");

favoriteRouter
  .route("/")
  .options(cors.corsWithOptions, (req, res) => {
    res.sendStatus(200);
  })
  .get(cors.cors, authenticate.verifyUser, (req, res, next) => {
    Favorites.findOne({ user: req.user._id })
      .populate("user dishes")
      .then(
        (favorites) => {
          res.statusCode = 200;
          res.setHeader("Content-Type", "application/json");
          res.json(favorites);
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  })
  .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorites.findOne({ user: req.user._id }).then((favorite) => {
      if (favorite) {
        req.body.map((favoriteDish) => {
          if (favorite.dishes.indexOf(favoriteDish._id) == -1) {
            favorite.dishes.push({ _id: favoriteDish._id });
          }
        });
        favorite.save().then((updatedFavorite) => {
          Favorites.findById(updatedFavorite._id)
            .populate("user dishes")
            .then(
              (updatedFavorite) => {
                res.status = 200;
                res.setHeader("Content-Type", "application/json");
                res.json(updatedFavorite);
              },
              (err) => next(err)
            )
            .catch((err) => next(err));
        });
      } else if (!favorite) {
        let newFavorite = new Object({
          user: req.user._id,
        });
        req.body.map((favoriteDish) => {
          if (favorite.dishes.indexOf(favoriteDish._id) == -1) {
            newFavorite.dishes.push({ _id: favoriteDish._id });
          }
        });
        favorite.save();
        then((newFavorite) => {
          Favorites.findById(newFavorite._id)
            .populate("user dishes")
            .then(
              (newFavorite) => {
                res.status = 200;
                res.setHeader("Content-Type", "application/json");
                res.json(newFavorite);
              },
              (err) => next(err)
            )
            .catch((err) => next(err));
        });
      }
    });
  })
  .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorites.findOne({ user: req.user._id })
      .then(
        (favorite) => {
          if (favorite) {
            favorite.dishes = [];
            favorite
              .save()
              .then(
                (updatedFavorite) => {
                  res.status = 200;
                  res.setHeader("Content-Type", "application/json");
                  res.json(updatedFavorite);
                },
                (err) => next(err)
              )
              .catch((err) => next(err));
          } else if (!favorite) {
            var err = new Error(
              "Please, You have no dish in your favorite list"
            );
            err.status = 404;
            return next(err);
          }
        },
        (err) => {
          next(err);
        }
      )
      .catch((err) => {
        next(err);
      });
  });
//------------------Favoritee list with dishId---------------------------
favoriteRouter
  .route("/:dishId")
  .get(cors.cors, authenticate.verifyUser, (req, res, next) => {
    Favorites.findOne({ user: req.user._id })
      .then(
        (favorites) => {
          if (!favorites) {
            res.statusCode = 200;
            res.setHeader("Content-Type", "application/json");
            return res.json({ exists: false, favorites: favorites });
          } else {
            if (favorites.dishes.indexOf(req.params.dishId) < 0) {
              res.statusCode = 200;
              res.setHeader("Content-Type", "application/json");
              return res.json({ exists: false, favorites: favorites });
            } else {
              res.statusCode = 200;
              res.setHeader("Content-Type", "application/json");
              return res.json({ exists: true, favorites: favorites });
            }
          }
        },
        (err) => next(err)
      )
      .catch((err) => next(err));
  })
  .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorites.findOne({ user: req.user._id }).then((favorite) => {
      if (favorite) {
        if (favorite.dishes.indexOf(req.params.dishId) == -1) {
          favorite.dishes.push({ _id: req.params.dishId });
          favorite
            .save()
            .then(
              (updatedFavorite) => {
                Favorites.findById(updatedFavorite._id)
                  .populate("user dishes")
                  .then(
                    (updatedFavorite) => {
                      res.status = 200;
                      res.setHeader("Content-Type", "application/json");
                      res.json(updatedFavorite);
                    },
                    (err) => next(err)
                  )
                  .catch((err) => next(err));
              },
              (err) => next(err)
            )
            .catch((err) => next(err));
        } else {
          var err = new Error("Already in to your favorite list");
          err.status = 402;
          return next(err);
        }
      } else if (!favorite) {
        let newFavorite = new Object({
          user: req.user._id,
          dishes: [{ _id: req.params.dishId }],
        });
        Favorites.create(newFavorite).then((newFavorite) => {
          Favorites.findById(newFavorite._id)
            .populate("user dishes")
            .then(
              (newFavorite) => {
                res.status = 200;
                res.setHeader("Content-Type", "application/json");
                res.json(newFavorite);
              },
              (err) => next(err)
            )
            .catch((err) => next(err));
        });
      }
    });
  })
  .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
    Favorites.findOne({ user: req.user._id })
      .then(
        (favorite) => {
          let index = favorite.dishes.indexOf(req.params.dishId);
          if (index != -1) {
            favorite.dishes.splice(index, 1);
            favorite.save().then((updatedFavorite) => {
              Favorites.findById(updatedFavorite._id)
                .populate("user dishes")
                .then(
                  (updatedFavorite) => {
                    res.status = 200;
                    res.setHeader("Content-Type", "application/json");
                    res.json(updatedFavorite);
                  },
                  (err) => next(err)
                )
                .catch((err) => next(err));
            });
          } else {
            let err = new Error("Your selected dish is not your favorite dish");
            err.status = 403;
            return next(err);
          }
        },
        (err) => next(err)
      )
      .catch((err) => {
        next(err);
      });
  });

module.exports = favoriteRouter;
