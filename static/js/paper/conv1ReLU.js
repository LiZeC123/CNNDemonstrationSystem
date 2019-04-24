window.conv1ReLUUpdate = function () {
    paper.activate();
    paper.project.clear();
    drawTitle("第一ReLU层");
    window.conv1.v.forEach(function (e, i) {
        drawMatrixNerve({x: 10, y: 32 + i * 400}, 6, 4.5, e)
    });
};