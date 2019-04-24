window.conv2PoolUpdate = function () {
    paper.activate();
    paper.project.clear();
    drawTitle("第二池化层");
    var data = window.conv2;
    for (var i = 0; i < data.v.length; i++) {
        drawMatrixNerve({x: 10, y: 37 + i * 200}, 9, 6, data.p[i]);
    }
};
