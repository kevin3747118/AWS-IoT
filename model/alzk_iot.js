const awsIoTsdk = require('aws-iot-device-sdk');
const AWSOperate = require('./alzk_aws');
const fs = require('fs');


class AWSIoT {
  constructor(dName) {
    // this.KEY_PATH = '';
    // this.CERT_PATH = '';
    // this.CA_PATH = '';
    this.CLIENT_ID = dName;
    // this.HOST = '';
    // if (dName) {
    //   Object.keys(dName).forEach((p) => {
    //     this[p] = dName[p];
    //   });
    // }
    this.device = this.initial();
    // this.initial(); x
  }

  static createLink(linkName) {
    return new Promise((resolve, reject) => {
      try {
        IoTConsts[linkName] = {
          "CLIENT_ID": linkName,
          "STATUS": "No Operation"
        };
        fs.writeFileSync(configDir + '/iotConfig.json', JSON.stringify(IoTConsts, null, '\t'), 'utf-8');
        AWSOperate.createThing(linkName)
          .then((data) => {
            resolve(IoTConsts[linkName]);
          })
          .catch((err) => {
            reject(err)
          });
      } catch (err) {
        reject(err);
      }
    });
  }

  msgPublish(msg) {
    let self = this;
    return new Promise((resolve, reject) => {
      console.log('iot push message: ' + JSON.stringify(msg));
      self.device.publish('App/LockAction', JSON.stringify(msg));
      self.device
        .on('packetsend', (packet) => {
          resolve(packet);
        });
    });
  }

  initial() {
    let self = this;
    let device = awsIoTsdk.device({
      keyPath: certDir + '/' + appConsts.IOT_INFO.KEY_PATH,
      certPath: certDir + '/' + appConsts.IOT_INFO.CERT_PATH,
      caPath: certDir + '/' + appConsts.IOT_INFO.CA_PATH,
      clientId: appConsts.IOT_INFO.CLIENT_ID,
      host: appConsts.IOT_INFO.HOST
    });
    device.subscribe('App/LockAction');
    device
      .on('connect', function () {
        console.log('connect');
      });
    device //seperate receive function as static
      .on('message', function (topic, payload) {
        let CLIENT_ID = JSON.parse(payload).clientID;
        let ACTION = JSON.parse(payload).action;
        IoTConsts[CLIENT_ID].STATUS = ACTION;
      });
    return device;
  }
}


module.exports.AWSIoT = AWSIoT;