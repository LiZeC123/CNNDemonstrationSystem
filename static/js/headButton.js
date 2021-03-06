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
            window.trainData = {"first": data};
            window.mainFcUpdate(trainData, "data");
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
        window.conv1WbUpdate(trainData, "data");
        window.conv2WbUpdate(trainData, "data");
        window.mainFcUpdate(trainData, "data");
    })
}

window.isGradient = false;

function trainSwitch() {
    window.isGradient = !isGradient;
    if (isGradient) {
        window.conv1WbUpdate(trainData, "gradient");
        window.conv2WbUpdate(trainData, "gradient");
        window.mainFcUpdate(trainData, "gradient");
    } else {
        window.conv1WbUpdate(trainData, "data");
        window.conv2WbUpdate(trainData, "data");
        window.mainFcUpdate(trainData, "data");
    }
}

$(document).keydown(function (event) {
    if (window.trainData !== undefined) {
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

const frameTime = 120;
let intervalID;
let dataIdx = 0;
let frameId = 0;
let isPause = false;
let isReset = false;

function drawHandler() {
    // 如果达到数组的最后一个元素
    if (dataIdx >= trainDataList.length) {
        trainReset();
        return;
    }

    $("#progress").val(Math.floor(dataIdx / 2) + 1);
    $("#perShow").text("当前第" + (Math.floor(dataIdx / 2) + 1) + "次训练");

    if (dataIdx % 2 === 0) {
        window.isGradient = false;
        trainData.first = trainDataList[dataIdx];
        window.conv1WbUpdate(trainData, "data");
        window.conv2WbUpdate(trainData, "data");
        window.mainFcUpdate(trainData, "data");
        dataIdx++;
    } else {
        window.isGradient = true;
        trainData.gradient = trainDataList[dataIdx];
        window.conv1WbUpdate(trainData, "gradient", frameId);
        window.conv2WbUpdate(trainData, "gradient", frameId);
        window.mainFcUpdate(trainData, "gradient");

        if (frameId < 5) {
            // 在范围内才++，否则就越界了
            frameId++;
        } else {
            frameId = 0;
            dataIdx++;
        }
    }
}


// 进度条拖动函数'
let isClick = false;
$(function () {
    const progress = $("#progress");
    progress.mousedown(function () {
        isClick = true;
        dataIdx = 2 * progress.val();
        $("#perShow").text("当前第" + (Math.floor(dataIdx / 2) + 1) + "次训练");
        //dataIdx = progress.val();
        //drawHandler()
    });
    progress.mousemove(function () {
        if (isClick) {
            dataIdx = 2 * progress.val();
            $("#perShow").text("当前第" + (Math.floor(dataIdx / 2) + 1) + "次训练");
            drawHandler();
        }
    });
    progress.mouseup(function () {
        dataIdx = 2 * progress.val();
        $("#perShow").text("当前第" + (Math.floor(dataIdx / 2) + 1) + "次训练");
        drawHandler();
        isClick = false;
    });
});


function trainBack() {
    clearInterval(intervalID);
    // dataIdx指向下一个需要绘制的位置，因此回退需要-2
    if (dataIdx >= 2) {
        dataIdx = dataIdx - 2;
        frameId = 3;
        drawHandler();
    }
    console.log(dataIdx);
}

function trainForward() {
    clearInterval(intervalID);
    frameId = 3;
    drawHandler();
    console.log(dataIdx);
}

function trainPause() {
    if (isReset) {
        dataIdx = 0;
        isReset = false;
    }
    if (isPause) {
        console.log("frame=" + frameId);
        clearInterval(intervalID);
        if (frameId !== 0) {
            frameId = 1;
            dataIdx++;
            drawHandler();
        }
        $("#btnPause").attr("src", "svg/play-circle.svg")
    } else {
        intervalID = setInterval(drawHandler, frameTime);
        $("#btnPause").attr("src", "svg/stop.svg")
    }

    isPause = !isPause;
}

function trainReset() {
    clearInterval(intervalID);
    $("#btnPause").attr("src", "svg/replay.svg");
    isReset = true;
    isPause = false;
}