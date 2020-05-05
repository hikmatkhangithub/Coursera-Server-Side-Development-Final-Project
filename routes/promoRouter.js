const express = require("express");
const bodyParser = require("body-parser");

const promosRouter = express.Router();
promosRouter.use(bodyParser.json());

promosRouter
  .route("/")
  .all((req, res, next) => {
    res.statusCode = 200;
    res.setHeader("Content-type", "text/plain");
    next();
  })
  .get((req, res, next) => {
    res.status = 200;
    res.end("This will return all the promotions to you!");
  })
  .post((req, res, next) => {
    res.statusCode = 201;
    res.end(
      "This will create a New promotion: " +
        req.body.name +
        " with details: " +
        req.body.description
    );
  })
  .put((req, res, next) => {
    res.statusCode = 403;
    res.end("PUT operation is not supported for /promotions");
  })
  .delete((req, res, next) => {
    res.statusCode = 200;
    res.end(" This will delete all the promotions!");
  });

//-------------------HTTP requests with LeaderId-----------------------------

promosRouter
  .route("/:promoId")
  .get((req, res, next) => {
    res.status = 200;
    res.end(
      "This will return the promotions with Id: " +
        req.params.promoId +
        " name: " +
        req.body.name +
        " and Details: " +
        req.body.description
    );
  })
  .post((req, res, next) => {
    res.statusCode = 403;
    res.end("POST is not supported for /promotions/" + req.params.promoId);
  })
  .put((req, res, next) => {
    res.write("Updating the promotions with Id: " + req.params.promoId + "\n");
    res.end(
      "Updating the promotions with name: " +
        req.body.name +
        " and description: " +
        req.body.description
    );
  })
  .delete((req, res, next) => {
    res.statusCode = 200;
    res.end("This will delete the promotions with Id: " + req.params.promoId);
  });

module.exports = promosRouter;
