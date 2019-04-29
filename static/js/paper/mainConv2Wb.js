var point = {x: 60, y: 155};
var interval = 400;
var margin = 9;
var radius = 6;
var currentIdx = 0; // 指示当前是哪一个特征面

window.mainConv2WbUpdate = function (WbData, idx) {
    paper.activate();
    paper.project.clear();

    drawTitle("第二卷积层权值");

    // W 8x4x5x5 8个特征面，每个特征面连接前一层的四个输入，卷积核大小为5x5
    currentIdx = idx;
    //console.log("Current Idx="+idx);
    var W0 = WbData.W[idx];
    W0.forEach(function (e, i) {
        var p = new Point(point.x, point.y + i * interval);
        drawMatrixNerve(p, margin, radius, e);
    });
};

var mainConv2WbToIdx = genConvert(point, 4, 5, interval, margin);
var obj = $("#conv2WbCanvas");
obj.mousemove(genMouseMove(obj, mainConv2WbToIdx,
    function (pos) {
        return "第二卷积层权值 特征面" + currentIdx + " 卷积核" + pos.feature + " 第" + pos.row + "行 第" + pos.col + "列";
    },
    function (pos) {
        return window.calcData.conv2.W[currentIdx][pos.feature][pos.row][pos.col];
    })
);