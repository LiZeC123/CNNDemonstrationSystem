function drawText(point, content) {
    var text = new PointText(point);
    text.content = content;
    //text.fontFamily = "SimSun";
    text.fontSize = 20;
    text.fillColor = 'white';

}

function drawLine(begin, end) {
    var line = new Path();
    line.strokeColor = 'white';
    line.strokeWidth = 2;

    line.add(begin);
    line.add(end);
}

/**
 * 根据给定的参数绘制详细界面
 * @param layoutName 当前所在的层次名称
 * @param value 当前神经元的取值
 * @param more 更多其他参数组成的字典
 */
window.drawDetail = function (layoutName, value, more) {
    paper.activate();
    paper.project.clear();

    drawText(new Point(5, 20), "当前位置:" + layoutName);
    drawText(new Point(5, 50), "当前神经元取值:" + value.toFixed(2));

    if (more !== undefined) {
        drawLine(new Point(0, 60), new Point(540, 60));
        if (more.name === "conv1Weight") {
            drawText(new Point(5, 80), more.weightTitle);
            // 图像部分向右偏移半个边框宽度的距离，从而与文字对齐
            drawMatrixNerveWithNumber(new Point(7, 100), 25, 20, more.getWeight(more.pos));

            drawLine(new Point(270, 60), new Point(270, 360));

            drawText(new Point(281, 80), more.inputTitle);
            drawMatrixNerveWithNumber(new Point(283, 100), 25, 20, more.getInputData(more.pos));
        } else if (more.name === "conv1Pool") {
            drawText(new Point(5, 80), more.title);
            drawMatrixNerveWithNumber(new Point(7, 100), 25, 20, more.getInputData(more.pos));
        } else if (more.name === "fc") {
            var W = more.getWeight(more.pos);
            drawText(new Point(5, 80), more.getBias(more.pos));
            drawText(new Point(5, 110), more.getWeightTitle(more.pos));
            var i, half = W.length / 2;
            for (i = 0; i < half; i++) {
                drawText(new Point(5, 130 + i * 20), W[i]);
            }
            for (i = half; i < W.length; i++) {
                drawText(new Point(270, 130 + (i - half) * 20), W[i]);
            }
        } else if (more.name === "convWb") {
            drawText(new Point(5, 80), more.getGradientInfo(more.pos));
        }
    }
};

var detailToIdx = function () {
    // 返回-1，使得鼠标移动在消息界面时隐藏此界面
    return {
        "feature": -1,
        "row": -1,
        "col": -1
    }
};
var obj = $("#detailCanvas");
obj.mousemove(genMouseMove(obj, detailToIdx,
    function () {

    },
    function () {

    })
);
