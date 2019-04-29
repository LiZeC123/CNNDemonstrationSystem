var point = {x: 143, y: 16};
var interval = 200;
var margin = 6;
var radius = 4.5;

window.conv2ReLUUpdate = function () {
    paper.activate();
    paper.project.clear();
    drawTitle("第二ReLU层");
    window.conv2.v.forEach(function (e, i) {
        var p = new Point(point.x, point.y + i * interval);
        drawMatrixNerve(p, margin, radius, e)
    });
};

var conv2ReLUToIdx = genConvert(point, 8, 14, interval, margin);
var obj = $("#reLU2Canvas");
obj.mousemove(genMouseMove(obj, conv2ReLUToIdx,
    function (pos) {
        return "第二ReLU层 特征面" + pos.feature + " 第" + pos.row + "行 第" + pos.col + "列";
    },
    function (pos) {
        return window.calcData.conv2.v[pos.feature][pos.row][pos.col];
    })
);