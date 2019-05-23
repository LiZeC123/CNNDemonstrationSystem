var point = {x: 10, y: 140};
var interval = 400;
var margin = 12;
var radius = 10;

window.conv1WbUpdate = function (trainData, type, frameId) {
    paper.activate();
    paper.project.clear();
    drawTitle("第一卷积层权值");


    trainData.first.conv1.W.forEach(function (e, i) {
        drawMatrixNerve({x: 10, y: 140 + i * 400}, margin, radius, e);
    });

    if (type === "gradient") {
        trainData.gradient.conv1.W.forEach(function (e, i) {
            drawGradientMatrixNerve({x: 10, y: 140 + i * 400}, margin, radius, e, frameId);
        });
    }
};


var conv1WbToIdx = genConvert(point, 4, 5, interval, margin);
var obj = $("#Wb1Canvas");
obj.mousemove(genMouseMove(obj, conv1WbToIdx,
    function (pos) {
        return "第一卷积层 卷积核" + pos.feature + " 第" + pos.row + "行 第" + pos.col + "列";
    },
    function (pos) {
        return trainData.first.conv1.W[pos.feature][pos.row][pos.col];

    },
    {
        "name": "convWb",
        "getGradientInfo": function (pos) {
            if (window.isGradient) {
                var value = trainData.gradient.conv1.W[pos.feature][pos.row][pos.col];
                return "当前神经元梯度值: " + value.toFixed(5);
            } else {
                return "当前神经元梯度值: 无";
            }
        }
    }
));