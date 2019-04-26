window.mainConv2WbUpdate = function (WbData, idx) {
    paper.activate();
    paper.project.clear();

    drawTitle("第二卷积层权值");

    // W 8x4x5x5 8个特征面，每个特征面连接前一层的四个输入，卷积核大小为5x5
    var W0 = WbData.W[idx];
    W0.forEach(function (e, i) {
        drawMatrixNerve({x: 60, y: 155 + i * 400}, 9, 6, e)
    });
};