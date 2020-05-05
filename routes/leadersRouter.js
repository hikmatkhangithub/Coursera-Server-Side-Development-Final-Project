const express = require("express");
const bodyParser = require("body-parser");

const leadersRouter = express.Router();
leadersRouter.use(bodyParser.json());

leadersRouter
  .route("/")
  .all((req, res, next) => {
    res.statusCode = 200;
    res.setHeader("Content-type", "text/plain");
    next();
  })
  .get((req, res, next) => {
    res.status = 200;
    res.end("This will return all the leaders to you!");
  })
  .post((req, res, next) => {
    res.statusCode = 201;
    res.end(
      "This will create a New Leader: " +
        req.body.name +
        " with details: " +
        req.body.description
    );
  })
  .put((req, res, next) => {
    res.statusCode = 403;
    res.end("PUT operation is not supported for /leaders");
  })
  .delete((req, res, next) => {
    res.statusCode = 200;
    res.end(" This will delete all the leaders!");
  });

//-------------------HTTP requests with LeaderId-----------------------------

leadersRouter
  .route("/:leaderId")
  .get((req, res, next) => {
    res.status = 200;
    res.end(
      "This will return the leaders with Id: " +
        req.params.leaderId +
        " name: " +
        req.body.name +
        " and Details: " +
        req.body.description
    );
  })
  .post((req, res, next) => {
    res.statusCode = 403;
    res.end("POST is not supported for /leaders/" + req.params.leaderId);
  })
  .put((req, res, next) => {
    res.write("Updating the leaders with Id: " + req.params.leaderId + "\n");
    res.end(
      "Updating the leaders with details " +
        req.body.name +
        " and " +
        req.body.description
    );
  })
  .delete((req, res, next) => {
    res.statusCode = 200;
    res.end("This will delete the leaders with Id: " + req.params.leaderId);
  });

module.exports = leadersRouter;
