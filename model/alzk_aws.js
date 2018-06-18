const model = exports;


model.attachCert = function (linkName) {
  return new Promise((resolve, reject) => {
    let AWSIoTClass = appConsts.AWSIoTClass;
    let params = {
      principal: 'arn:aws:iot:us-east-2:130485320709:cert/7a5a6a668bce10f127a26f974e5f1c6ac71aff95401a934602e96d63a639c055',
      thingName: linkName
    };
    AWSIoTClass.attachThingPrincipal(params, function (err, data) {
      if (err) {
        reject(err, err.stack);
      } else {
        resolve();
      }
    });
  });
};


model.createThing = function (linkName) {
  return new Promise((resolve, reject) => {
    let AWSIoTClass = appConsts.AWSIoTClass;
    let params = {
      thingName: linkName
    };
    AWSIoTClass.createThing(params, function (err, data) {
      if (err) {
        reject(err, err.stack);
      } else {
        model.attachCert(linkName)
          .then(() => {
            resolve(data);
          })
          .catch((err) => {
            reject(err);
          });
      }
    });
  });
};