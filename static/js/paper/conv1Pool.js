window.conv1PoolUpdate = function () {
    paper.activate();
    paper.project.clear();
    drawTitle("第一池化层");
    var data = window.conv1;
    for (var i = 0; i < data.v.length; i++) {
        drawMatrixNerve({x: 10, y: 74 + i * 400}, 9, 6, data.p[i]);
    }
};
