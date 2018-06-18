process.on('uncaughtException', (err) => {
  console.error('whoops! there was an error:' + err);
});

 
configDir = './.appConfig';
certDir = './.appCert';
logDir = './log';
appConsts = require(configDir + '/appConfig.json');  //global variable
IoTConsts = require(configDir + '/iotConfig.json');  //global device variable
linkConsts = {};


function initialDevice() {
  const AWSIoT = require('./model/alzk_iot').AWSIoT;
  for (let dName in IoTConsts) {
    const device = new AWSIoT(dName);
    linkConsts[dName] = device;
    // console.log(linkConsts)
  }
}


function startAPP() {
  const express = require('express');
  const bodyParser = require('body-parser');
  const alzkApp = express();
  const appRouter = require("./alzk_appRouter");
  const AWS = require('aws-sdk');

  alzkApp.use(bodyParser.urlencoded({
    extended: true
  }));
  alzkApp.use(bodyParser.json());
  alzkApp.disable('x-powered-by');
  alzkApp.use(express.static('public'));

  alzkApp.use('/appApi', appRouter);

  alzkApp.get('/', (req, res) => {
    res.sendFile(__dirname + "/app.html", 'utf8', function (err) {
      if (err)
        console.log(err);
      // logger.error("pn page load error:" + err);
    });
  });

  const credentials = new AWS.SharedIniFileCredentials({
    profile: 'janus'
  });
  const AWSIoTClass = new AWS.Iot({
    region: 'us-east-2',
    credentials: credentials
  });
  appConsts.AWSIoTClass = AWSIoTClass;


  alzkApp.listen(appConsts.PORT_APP);
  console.log('App Web URL : http://127.0.0.1:' + appConsts.PORT_APP);
}

initialDevice();
startAPP();
