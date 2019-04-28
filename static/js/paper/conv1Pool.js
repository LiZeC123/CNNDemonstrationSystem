var point = {x: 10, y: 74};
var interval = 400;
var margin = 9;
var radius = 6;

window.conv1PoolUpdate = function () {
    paper.activate();
    paper.project.clear();
    drawTitle("第一池化层");
    window.conv1.p.forEach(function (e, i) {
        var p = new Point(point.x, point.y + i * interval);
        drawMatrixNerve(p, margin, radius, e)
    });
};

var conv1PoolToIdx = genConvert(point, 4, 14, interval, margin);
var obj = $("#pool1Canvas");
obj.mousemove(genMouseMove(obj, conv1PoolToIdx,
    function (pos) {
        return "第一池化层 特征面" + pos.feature;
    },
    function (pos) {
        return window.calcData.conv1.p[pos.feature][pos.row][pos.col];
    })
);
