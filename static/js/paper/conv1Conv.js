var point = {x: 10, y: 32};
var interval = 400;
var margin = 6;
var radius = 4.5;

window.conv1ConvUpdate = function () {
    paper.activate();
    paper.project.clear();
    drawTitle("第一卷积层");
    window.conv1.f.forEach(function (e, i) {
        var p = new Point(point.x, point.y + i * interval);
        drawMatrixNerve(p, margin, radius, e)
    });
};

var conv1ConvToIdx = genConvert(point, 4, 28, interval, margin);
var obj = $("#conv1Canvas");
obj.mousemove(genMouseMove(obj, conv1ConvToIdx,
    function (pos) {
        return "第一卷积层 特征面" + pos.feature;
    },
    function (pos) {
        return window.calcData.conv1.f[pos.feature][pos.row][pos.col];
    })
);