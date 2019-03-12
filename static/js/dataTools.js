var config = {
    baseURL: 'http://192.168.1.100:5000',
};

var dataTool = {};
dataTool.inOnline = function () {
    return true;
};

dataTool.autoGetData = function (URL, data, callBack) {
    if (dataTool.inOnline()) {
        $.post(URL, data, function (jsonStr) {
            const result = JSON.parse(jsonStr);
            callBack(result);
        });
    } else {
        console.log("Load Data From Local");
    }
};

dataTool.upload = function (data, callBack) {
    dataTool.autoGetData(config.baseURL + "/upload", data, callBack);
};

dataTool.getInputImage = function (callBack) {
    dataTool.autoGetData(config.baseURL + "/inputImage", {}, callBack);
};

dataTool.getConv1 = function (callBack) {
    dataTool.autoGetData(config.baseURL + "/conv1", {}, callBack);
};

dataTool.getConv2 = function (callBack) {
    dataTool.autoGetData(config.baseURL + "/conv2", {}, callBack);
};

dataTool.getFc1 = function (callBack) {
    dataTool.autoGetData(config.baseURL + "/fc1", {}, callBack);
};

dataTool.getFc2 = function (callBack) {
    dataTool.autoGetData(config.baseURL + "/fc2", {}, callBack);
};

dataTool.getPrediction = function (callBack) {
    dataTool.autoGetData(config.baseURL + "/prediction", {}, callBack);
};