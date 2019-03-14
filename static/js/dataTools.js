const config = {
    baseURL: 'http://192.168.1.100:5000',
};

const dataTool = {};
dataTool.serverOnline = function () {
    // 向服务器发送请求，如果服务器再指定的时间内答复
    // 则说明当前网络可用（基于本地服务器）
    let result = false;
    $.ajax({
        url: config.baseURL + "/online",
        timeout: 100,
        type: "get",
        async: false,
        success: () => result = true,
    });
    return result;
};

dataTool.inOnline = function () {
    return navigator.onLine || dataTool.serverOnline();
};

dataTool.saveData = function (jsonStr) {
    sessionStorage.setItem("inputData", jsonStr);
};

dataTool.autoGetData = function (URL, data, callBack) {
    if (dataTool.inOnline()) {
        $.post(URL, data, function (jsonStr) {
            //dataTool.saveData(jsonStr);
            const result = JSON.parse(jsonStr);
            //window.inputData = result;
            window.inputImage = result.inputImage;
            window.conv1 = result.conv1;
            window.conv2 = result.conv2;
            window.fc1 = result.fc1;
            window.fc2 = result.fc2;
            window.prediction = result.prediction;
            callBack(result);
        });
    } else {
        console.log("Load Data From Local");
    }
};

dataTool.upload = function (data, callBack) {
    dataTool.autoGetData(config.baseURL + "/upload", data, callBack);
};

dataTool.reloadData = function () {
    const jsonStr = sessionStorage.getItem("inputData");
    if (jsonStr != null) {
        const result = JSON.parse(jsonStr);
        window.inputImage = result.inputImage;
        window.conv1 = result.conv1;
        window.conv2 = result.conv2;
        window.fc1 = result.fc1;
        window.fc2 = result.fc2;
        window.prediction = result.prediction;
        return true;
    } else {
        return false;
    }
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