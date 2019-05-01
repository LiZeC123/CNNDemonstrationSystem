var point = {x: 10, y: 632};
var margin = 6;
var radius = 4.5;

window.mainMainUpdate = function (border) {
    paper.activate();
    paper.project.clear();
    drawTitle("输入图像");

    if (border !== undefined) {
        var adjustPoint = {x: 10, y: 32 + border.pos.feature * 400};
        drawMatrixNerve2(adjustPoint, margin, radius, window.inputImage);
        drawSelectedBorder(adjustPoint, border.pos, margin, 28);
    } else {
        drawMatrixNerve2(point, margin, radius, window.inputImage);
    }
};

var mainMainToIdx = genConvert(point, 1, 28, 0, margin);
var obj = $("#mainCanvas");
obj.mousemove(genMouseMove(obj, mainMainToIdx,
    function (pos) {
        return "输入层" + " 第" + pos.row + "行 第" + pos.col + "列";
    },
    function (pos) {
        return window.calcData.inputImage[pos.row * 28 + pos.col]
    })
);