window.conv1ConvUpdate = function () {
    paper.activate();
    paper.project.clear();

    window.conv1.f.forEach(function (e, i) {
        drawMatrixNerve({x: 10, y: 10 + i * 346}, 6, 4.5, e)
    });
};