window.conv2ConvUpdate = function () {
    paper.activate();
    paper.project.clear();

    window.conv2.f.forEach(function (e, i) {
        drawMatrixNerve({x: 143, y: 12 + i * 200}, 6, 4.5, e)
    });
};