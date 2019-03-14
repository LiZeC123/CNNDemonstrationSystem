window.conv1PoolUpdate = function () {
    paper.activate();
    paper.project.clear();
    var data = window.conv1;
    for (var i = 0; i < data.v.length; i++) {
        drawMatrixNerve({x: 10, y: 67 + i * 336}, 9, 6, data.p[i]);
    }
};
