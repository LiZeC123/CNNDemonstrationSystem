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