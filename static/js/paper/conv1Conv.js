window.conv1ConvUpdate = function () {
    paper.activate();
    paper.project.clear();
    drawTitle("第一卷积层");
    window.conv1.f.forEach(function (e, i) {
        drawMatrixNerve({x: 10, y: 32 + i * 400}, 6, 4.5, e)
    });
};