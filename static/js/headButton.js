function drawClean() {
    window.mouthBrushClean();
}

function drawExport(URL) {
    //将canvas内容转化为base64格式的dataURL
    const canvas = document.getElementById('drawCanvas');
    const img_png_src = canvas.toDataURL('image/png');
    dataTool.upload({"image": img_png_src}, function (data) {
        const name = URL.split('/').pop();
        if (name === 'main.html') {
            window.mainMainUpdate();
            window.conv1ConvUpdate();
            window.conv1ReLUUpdate();
            window.conv1PoolUpdate();
            window.conv2ConvUpdate();
            window.conv2ReLUUpdate();
            window.conv2PoolUpdate();
            // 调整结构，使其兼容训练过程的数据格式
            window.mainFcUpdate({"first": data});
        }

        $("#numberResult").html(window.prediction[0])
    })
}


function trainExport() {
    const canvas = document.getElementById('drawCanvas');
    const img_png_src = canvas.toDataURL('image/png');
    let data = {
        "image": img_png_src,
        "number": $("#selectNumber").val()
    };

    dataTool.trainUpload(data, function (trainData) {
        console.log(trainData);
        window.trainData = trainData;
        window.conv1WbUpdate(trainData.first.conv1, "data");
        window.conv2WbUpdate(trainData.first.conv2, "data");
        window.mainFcUpdate(trainData, "data");
    })
}

let trainFlag = false;

function trainGradient() {
    trainFlag = !trainFlag;
    if (trainFlag) {
        window.conv1WbUpdate(trainData.gradient.conv1, "gradient");
        window.conv2WbUpdate(trainData.gradient.conv2, "gradient");
        window.mainFcUpdate(trainData, "gradient");
    } else {
        window.conv1WbUpdate(trainData.first.conv1, "data");
        window.conv2WbUpdate(trainData.first.conv2, "data");
        window.mainFcUpdate(trainData, "data");
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

