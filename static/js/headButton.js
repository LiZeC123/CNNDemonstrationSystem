function drawClean() {
    window.mouthBrushClean();
}

function drawExport(URL) {
    //将canvas内容转化为base64格式的dataURL
    const canvas = document.getElementById('drawCanvas');
    const img_png_src = canvas.toDataURL('image/png');
    dataTool.upload({"image": img_png_src}, function () {
        const name = URL.split('/').pop();
        if (name === 'main.html') {
            window.mainMainUpdate();
            window.conv1ConvUpdate();
            window.conv1ReLUUpdate();
            window.conv1PoolUpdate();
            window.conv2ConvUpdate();
            window.conv2ReLUUpdate();
            window.conv2PoolUpdate();
            window.mainFcUpdate();
        }

        $("#numberResult").html(window.prediction[0])
    })
}


function trainExport() {
    const canvas = document.getElementById('drawCanvas');
    const img_png_src = canvas.toDataURL('image/png');
    //TODO: 使用真实获得的数字
    let data = {
        "image": img_png_src,
        "number": 0
    };

    dataTool.trainUpload(data, function (trainData) {
        // TODO: 调用绘图函数 / 添加锁定逻辑，保证先获得数据
        console.log(trainData);
        window.trainData = trainData;
        window.conv1WbUpdate(trainData.first.conv1, "data");
        window.conv2WbUpdate(trainData.first.conv2, "data");

    })
}

var trainFlag = false;

function trainGradient() {
    trainFlag = !trainFlag;
    if (trainFlag) {
        window.conv1WbUpdate(trainData.gradient.conv1, "gradient");
        window.conv2WbUpdate(trainData.gradient.conv2, "gradient");
    } else {
        window.conv1WbUpdate(trainData.first.conv1, "data");
        window.conv2WbUpdate(trainData.first.conv2, "data");
    }

}

function drawNew() {
    $.post(config.baseURL + "/getMnistImage", function (jsonStr) {
        var data = JSON.parse(jsonStr);
        window.inputImage = data.image;
        window.mainMainUpdate();
        $("#numberResult").html(data.label + "(MNIST)")
    })
}

