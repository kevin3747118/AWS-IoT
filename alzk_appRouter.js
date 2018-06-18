const express = require('express');
const appRouter = express.Router();

const fs = require('fs');
const path = require('path');

const AWSIoT = require('./model/alzk_iot').AWSIoT;
// const AWSOperate = require('./model/alzk_aws').AWSOperate;

// var credentials = new AWS.SharedIniFileCredentials({
//   profile: 'work-account'
// });
// AWS.config.credentials = credentials;


appRouter.use(function (req, res, next) {
  req.response = {
    status: "ok",
    errorText: ""
  }; // init the response
  next();
});


appRouter.get('/sendStatus', (req, res, next) => {
  let clientID = req.query.clientID;
  linkConsts[clientID].msgPublish(req.query)
    .then((packet) => {
      req.response = {
        status: "ok"
      };
      next();
    })
    .catch((err) => {
      req.response = {
        status: "error",
        errorText: "app action error :" + err
      };
      console.log(err);
      next();
    });
});

appRouter.get('/createLink', (req, res, next) => {
  let linkName = req.query.linkName;
  AWSIoT.createLink(linkName)
    .then((data) => {
      let dName = data.CLIENT_ID;
      const device = new AWSIoT(dName);
      linkConsts[dName] = device;
      req.response = {
        status: "ok"
      };
      next();
    })
    .catch((err) => {
      req.response = {
        status: "error",
        errorText: "app parameters save error :" + err
      };
      next();
    });
});

appRouter.get('/getLink', (req, res, next) => {
  // console.log(IoTConsts);
  req.response = {
    status: "ok",
    link: IoTConsts
  };
  next();
});


appRouter.use(function (req, res) {
  if (!req.response)
    req.response = {
      status: "error",
      errorText: "Unknown api:" + req.path
    };
  if (req.response.status == "error")
    console.log(JSON.stringify(req.response.errorText));
  res.json(req.response);
});

module.exports = appRouter;