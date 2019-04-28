var point = {x: 10, y: 632};
var margin = 6;
var radius = 4.5;

window.mainMainUpdate = function () {
    paper.activate();
    paper.project.clear();
    drawTitle("输入图像");
    drawMatrixNerve2(point, margin, radius, window.inputImage);
};

window.mainMainToIdx = function (X, Y) {
    var rX = X - point.x;
    var rY = Y - point.y;

    return {
        "row": Math.ceil(rY / (2 * margin)) - 1,
        "col": Math.ceil(rX / (2 * margin)) - 1
    }
};