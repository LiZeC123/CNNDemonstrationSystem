window.mainConv1Update = function () {
    paper.activate();
    paper.project.clear();
    var data = window.conv1;
    for (var i = 0; i < data.v.length; i++) {
        drawMatrixNerve({x: 10, y: 42 + i * 336}, 9, 6, data.p[i]);
    }
};
