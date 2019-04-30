var point = {x: 10, y: 40};
var interval = 200;
var margin = 12;
var radius = 10;

window.conv2WbUpdate = function (WbData, type) {
    paper.activate();

    var i, line;
    if (type === "data") {
        paper.project.clear();
        drawTitle("第二卷积层权值");
        for (i = 0; i < 4; i++) {
            line = new Point(point.x + i * 140, point.y);
            WbData.W[i].forEach(function (e, i) {
                var p = new Point(line.x, line.y + i * interval);
                drawMatrixNerve(p, margin, radius, e)
            });
        }
        for (i = 0; i < 4; i++) {
            line = new Point(point.x + i * 140, point.y + 800);
            WbData.W[i + 4].forEach(function (e, i) {
                var p = new Point(line.x, line.y + i * interval);
                drawMatrixNerve(p, margin, radius, e)
            });
        }
    }

    if (type === "gradient") {
        for (i = 0; i < 4; i++) {
            line = new Point(point.x + i * 140, point.y);
            WbData.W[i].forEach(function (e, i) {
                var p = new Point(line.x, line.y + i * interval);
                drawGradientMatrixNerve(p, margin, radius, e)
            });
        }
        for (i = 0; i < 4; i++) {
            line = new Point(point.x + i * 140, point.y + 800);
            WbData.W[i + 4].forEach(function (e, i) {
                var p = new Point(line.x, line.y + i * interval);
                drawGradientMatrixNerve(p, margin, radius, e)
            });
        }
    }
};