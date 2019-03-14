window.conv2ConvUpdate = function () {
    paper.activate();
    paper.project.clear();

    window.conv2.f.forEach(function (e, i) {
        drawMatrixNerve({x: 10, y: 67 + i * 336}, 9, 6, e)
    });
};