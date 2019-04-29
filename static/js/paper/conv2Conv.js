var point = {x: 143, y: 16};
var interval = 200;
var margin = 6;
var radius = 4.5;

window.conv2ConvUpdate = function () {
    paper.activate();
    paper.project.clear();
    drawTitle("第二卷积层");
    window.conv2.f.forEach(function (e, i) {
        var p = new Point(point.x, point.y + i * interval);
        drawMatrixNerve(p, margin, radius, e);
    });
};

var conv2ConvToIdx = genConvert(point, 8, 14, interval, margin);
var obj = $("#conv2Canvas");
obj.mousemove(genMouseMove(obj, conv2ConvToIdx,
    function (pos) {
        // 卷积核的数据跟随鼠标位置同步变化
        window.mainConv2WbUpdate(window.calcData.conv2, pos.feature);
        return "第二卷积层 特征面" + pos.feature + " 第" + pos.row + "行 第" + pos.col + "列";
    },
    function (pos) {
        return window.calcData.conv2.f[pos.feature][pos.row][pos.col];
    })
);