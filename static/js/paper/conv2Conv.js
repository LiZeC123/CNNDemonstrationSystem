window.conv2ConvUpdate = function () {
    paper.activate();
    paper.project.clear();
    drawTitle("第二卷积层");
    window.conv2.f.forEach(function (e, i) {
        drawMatrixNerve({x: 143, y: 16 + i * 200}, 6, 4.5, e)
    });
};