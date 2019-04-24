window.conv2ReLUUpdate = function () {
    paper.activate();
    paper.project.clear();
    drawTitle("第二ReLU层");
    window.conv2.v.forEach(function (e, i) {
        drawMatrixNerve({x: 143, y: 16 + i * 200}, 6, 4.5, e)
    });
};