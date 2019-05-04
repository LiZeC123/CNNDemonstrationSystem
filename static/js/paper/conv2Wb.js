var point = {x: 10, y: 40};
var interval = 200;
var margin = 12;
var radius = 10;

window.conv2WbUpdate = function (trainData, type, frameId) {
    paper.activate();
    paper.project.clear();
    drawTitle("第二卷积层权值");

    var i, line;
    for (i = 0; i < 4; i++) {
        line = new Point(point.x + i * 140, point.y);
        trainData.first.conv2.W[i].forEach(function (e, i) {
            var p = new Point(line.x, line.y + i * interval);
            drawMatrixNerve(p, margin, radius, e)
        });
    }
    for (i = 0; i < 4; i++) {
        line = new Point(point.x + i * 140, point.y + 800);
        trainData.first.conv2.W[i + 4].forEach(function (e, i) {
            var p = new Point(line.x, line.y + i * interval);
            drawMatrixNerve(p, margin, radius, e)
        });
    }

    if (type === "gradient") {
        for (i = 0; i < 4; i++) {
            line = new Point(point.x + i * 140, point.y);
            trainData.gradient.conv2.W[i].forEach(function (e, i) {
                var p = new Point(line.x, line.y + i * interval);
                drawGradientMatrixNerve(p, margin, radius, e, frameId)
            });
        }
        for (i = 0; i < 4; i++) {
            line = new Point(point.x + i * 140, point.y + 800);
            trainData.gradient.conv2.W[i + 4].forEach(function (e, i) {
                var p = new Point(line.x, line.y + i * interval);
                drawGradientMatrixNerve(p, margin, radius, e, frameId)
            });
        }
    }
};