window.mainConv2Update = function () {
    paper.activate();
    paper.project.clear();
    var data = window.conv2;
    for (var i = 0; i < data.v.length; i++) {
        drawMatrixNerve({x: 10, y: 21 + i * 168}, 9, 6, data.p[i]);
    }
};
