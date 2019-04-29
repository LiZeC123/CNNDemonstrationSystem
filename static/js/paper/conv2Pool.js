var point = {x: 10, y: 37};
var interval = 200;
var margin = 9;
var radius = 6;

window.conv2PoolUpdate = function () {
    paper.activate();
    paper.project.clear();
    drawTitle("第二池化层");
    window.conv2.p.forEach(function (e, i) {
        var p = new Point(point.x, point.y + i * interval);
        drawMatrixNerve(p, margin, radius, e)
    });
};

var conv2PoolToIdx = genConvert(point, 8, 7, interval, margin);
var obj = $("#pool2Canvas");
obj.mousemove(genMouseMove(obj, conv2PoolToIdx,
    function (pos) {
        return "第二池化层 特征面" + pos.feature + " 第" + pos.row + "行 第" + pos.col + "列";
    },
    function (pos) {
        return window.calcData.conv2.p[pos.feature][pos.row][pos.col];
    })
);
