window.conv2ReLUUpdate = function () {
    paper.activate();
    paper.project.clear();

    window.conv2.v.forEach(function (e, i) {
        drawMatrixNerve({x: 10, y: 12 + i * 200}, 6, 4.5, e)
    });
};