function drawClean() {
    window.mouthBrushClean();
}

function drawExport(URL) {
    //将canvas内容转化为base64格式的dataURL
    const canvas = document.getElementById('drawCanvas');
    const img_png_src = canvas.toDataURL('image/png');
    dataTool.upload({"image": img_png_src}, function (data) {
        window.calcData = data;
        const name = URL.split('/').pop();
        window.dialog.hide();
        if (name === 'main.html') {
            window.mainMainUpdate();
            window.conv1ConvUpdate();
            window.conv1ReLUUpdate();
            window.conv1PoolUpdate();
            window.mainConv2WbUpdate(data.conv2, 0);
            window.conv2ConvUpdate();
            window.conv2ReLUUpdate();
            window.conv2PoolUpdate();
            // 调整结构，使其兼容训练过程的数据格式
            window.mainFcUpdate({"first": data}, "data");
            console.log(data);
        }

        $("#numberResult").html(window.prediction[0])
    })
}

function drawNew() {
    $.post(config.baseURL + "/getMnistImage", function (jsonStr) {
        var data = JSON.parse(jsonStr);
        window.inputImage = data.image;
        window.mainMainUpdate();
        $("#numberResult").html(data.label + "(MNIST)")
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
        window.dialog.hide();
        window.conv1WbUpdate(trainData.first.conv1, "data");
        window.conv2WbUpdate(trainData.first.conv2, "data");
        window.mainFcUpdate(trainData, "data");
    })
}

let isGradient = false;

function trainSwitch() {
    isGradient = !isGradient;
    if (isGradient) {
        window.conv1WbUpdate(trainData.gradient.conv1, "gradient");
        window.conv2WbUpdate(trainData.gradient.conv2, "gradient");
        window.mainFcUpdate(trainData, "gradient");
    } else {
        window.conv1WbUpdate(trainData.first.conv1, "data");
        window.conv2WbUpdate(trainData.first.conv2, "data");
        window.mainFcUpdate(trainData, "data");
    }
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

        if (isGradient) {
            window.mainFcUpdate(trainData, "gradient");
        } else {
            window.mainFcUpdate(trainData, "data");
        }
    }

});

let intervalID;
let dataIdx = 0;
let isPause = true;

function drawHandler() {
    // 如果达到数组的最后一个元素 或者 当前处于暂停状态
    if (dataIdx >= trainDataList.length) {
        return;
    }

    if (dataIdx % 2 === 0) {
        trainData.first = trainDataList[dataIdx];
        window.conv1WbUpdate(trainData.first.conv1, "data");
        window.conv2WbUpdate(trainData.first.conv2, "data");
        window.mainFcUpdate(trainData, "data");
    } else {
        trainData.gradient = trainDataList[dataIdx];
        window.conv1WbUpdate(trainData.gradient.conv1, "gradient");
        window.conv2WbUpdate(trainData.gradient.conv2, "gradient");
        window.mainFcUpdate(trainData, "gradient");
    }
    dataIdx++;
}

function trainBack() {
    clearInterval(intervalID);
    // dataIdx指向下一个需要绘制的位置，因此回退需要-2
    dataIdx = dataIdx - 2;
    drawHandler();
    console.log(dataIdx);
}

function trainForward() {
    clearInterval(intervalID);
    drawHandler();
    console.log(dataIdx);
}

function trainPause() {
    if (isPause) {
        intervalID = setInterval(drawHandler, 200);
        $("#btnPause").text("暂停")
    } else {
        console.log(dataIdx);
        clearInterval(intervalID);
        $("#btnPause").text("恢复")
    }
    isPause = !isPause;
}
