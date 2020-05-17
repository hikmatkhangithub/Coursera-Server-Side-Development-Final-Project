const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const Favorites = require('../models/favorite');
const authenticate = require ('../authenticate');
const cors = require('./cors');

const favoriteRouter = express.Router();

favoriteRouter.use(bodyParser.json());

favoriteRouter.route('/')
    .options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
    .get(cors.cors, authenticate.verifyUser, (req, res, next) => {
        Favorites.findOne({author: req.user._id})
        .populate('author')
        .populate('dishes')
        .then(favorite => {
            res.statusCode =  200;
            res.setHeader('Content-Type', 'application/json');
            res.json(favorite);
        }, err => next(err))
        .catch(err => next(err));
    })
    .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        const dishes = [];
        req.body.forEach(element => {
            dishes.push(element._id);
        });
        Favorites.findOne({author: req.user._id})
        .then(favorites => {
            if (favorites !== null) {
                dishes.forEach(dish => {
                    if (!favorites.dishes.some(item => item.equals(dish))) {
                        console.log(`Dish ${dish} added in you favorite list`);
                        favorites.dishes.push(dish);
                    }
                })
                favorites.save()
                .then(() => {
                    Favorites.findOne({author: req.user._id})
                    // .populate('author')
                    // .populate('dishes')
                    .then(favorite => {
                        res.statusCode =  200;
                        res.setHeader('Content-Type', 'application/json');
                        res.json(favorite);
                    }, err => next(err))
                }, err => next(err))
            } else {
                Favorites.create({author: req.user._id, dishes: dishes})
                .then(favorite => {
                    console.log('New list favorite dishes created', favorite);
                    res.statusCode =  201;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(favorite);
                }, err => next(err))
            }
        }, err => next(err))
        .catch(err => next(err));
    })
    .put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        res.statusCode = 403;
        res.end(`PUT operation not supported on /favorites/${req.params.dishId}`);
    })
    .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        Favorites.deleteOne({author: req.user._id})
        .then(resp => {
            res.statusCode =  200;
            res.setHeader('Content-Type', 'application/json');
            res.json(resp);
        }, err => next(err))
        .catch(err => next(err));
    })

favoriteRouter.route('/:dishId')
    .options(cors.corsWithOptions, (req, res) => { res.sendStatus(200); })
    .get(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        res.statusCode = 403;
        res.end(`GET operation not supported on /favorites/${req.params.dishId}`);
    })
    .post(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        Favorites.findOne({author: req.user._id})
        .then(favorite => {
            if (favorite !== null) {
                if (favorite.dishes.some(dish => dish.equals(req.params.dishId))) {
                    console.log(`Dish ${req.params.dishId} already exist in you favorite list`);
                    favorite.save()
                    .then(() => {
                        Favorites.findOne({author: req.user._id})
                        .then(favorite => {
                            res.statusCode =  200;
                            res.setHeader('Content-Type', 'application/json');
                            res.json(favorite);
                        }, err => next(err))
                    }, err => next(err))
                } else {
                    console.log(`Dish ${req.params.dishId} added in you favorite list`);
                    favorite.dishes.push(req.params.dishId);
                    favorite.save()
                    .then(() => {
                        Favorites.findOne({author: req.user._id})
                        // .populate('author')
                        // .populate('dishes')
                        .then(favorite => {
                            res.statusCode =  200;
                            res.setHeader('Content-Type', 'application/json');
                            res.json(favorite);
                        }, err => next(err))
                    }, err => next(err))
                }
            } else {
                Favorites.create({author: req.user._id, dishes: [req.params.dishId]})
                .then(favorite => {
                    console.log('New list favorite dishes created', favorite);
                    res.statusCode =  201;
                    res.setHeader('Content-Type', 'application/json');
                    res.json(favorite);
                }, err => next(err))
            }
        }, err => next(err))
        .catch(err => next(err));
    })
    .put(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        res.statusCode = 403;
        res.end(`PUT operation not supported on /favorites/${req.params.dishId}`);
    })
    .delete(cors.corsWithOptions, authenticate.verifyUser, (req, res, next) => {
        Favorites.findOne({author: req.user._id})
        .then(favorite => {
            if (favorite !== null) {
                if (favorite.dishes.some( dish => dish.equals(req.params.dishId))) {
                    console.log(`Dish ${req.params.dishId} removed in you favorite list`);
                    favorite.dishes = favorite.dishes.filter(dish => !dish.equals(req.params.dishId))
                    favorite.save()
                    .then(() => {
                        Favorites.findOne({author: req.user._id})
                        .populate('author')
                        .populate('dishes')
                        .then(favorite => {
                            res.statusCode =  200;
                            res.setHeader('Content-Type', 'application/json');
                            res.json(favorite);
                        }, err => next(err))
                    }, err => next(err))
                } else {
                    console.log(`Dish ${req.params.dishId} did not included in you favorite list`);
                    favorite.save()
                    .then(() => {
                        Favorites.findOne({author: req.user._id})
                        .populate('author')
                        .populate('dishes')
                        .then(favorite => {
                            res.statusCode =  200;
                            res.setHeader('Content-Type', 'application/json');
                            res.json(favorite);
                        }, err => next(err))
                    }, err => next(err))
                }
            } else {
                err = new Error(`You list favorite dishes not found`);
                err.status = 404;
                return next(err);
            }
        }, err => next(err))
        .catch(err => next(err));
    })

module.exports = favoriteRouter;