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
            window.mainFcUpdate({"first": data}, "data");
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

$(document).keydown(function (event) {
    if (trainData !== undefined) {
        if (event.key === 'a') {
            window.mainFcChange(1, 1);
        } else if (event.key === 's') {
            window.mainFcChange(1, 2);
        } else if (event.key === 'q') {
            window.mainFcChange(-1, 1);
        } else if (event.key === 'w') {
            window.mainFcChange(-1, 2);
        }

        if (trainFlag) {
            window.mainFcUpdate(trainData, "gradient");
        } else {
            window.mainFcUpdate(trainData, "data");
        }
    }

});


function drawBegin() {
    dataTool.trainData({}, function (result) {
        window.trainData = {};
        console.log(result);
        trainFlag = true;
        let dataIdx = 0;
        // 第一项是数据，第二项是梯度
        setInterval(function () {
            // 越界保护的逻辑
            if (dataIdx >= result.length) {
                return;
            }

            if (dataIdx % 2 === 0) {
                //console.log("Draw Data,dataIdx=", dataIdx);
                //console.log(result[dataIdx].conv1.W[0][0][0]);
                trainData.first = result[dataIdx];
                window.conv1WbUpdate(trainData.first.conv1, "data");
                window.conv2WbUpdate(trainData.first.conv2, "data");
                window.mainFcUpdate(trainData, "data");
            } else {
                //console.log("Draw Gradient,dataIdx=", dataIdx);
                //console.log(result[dataIdx]);
                trainData.gradient = result[dataIdx];
                window.conv1WbUpdate(trainData.gradient.conv1, "gradient");
                window.conv2WbUpdate(trainData.gradient.conv2, "gradient");
                window.mainFcUpdate(trainData, "gradient");
            }
            dataIdx++;
        }, 200);
    })
}