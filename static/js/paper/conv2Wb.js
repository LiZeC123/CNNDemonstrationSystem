window.conv2WbUpdate = function (WbData, type) {
    paper.activate();
    paper.project.clear();

    if (type === "data") {
        WbData.W.forEach(function (e, i) {
            drawMatrixNerve({x: 10, y: 12 + i * 200}, 9, 6, e)
        });
    } else if (type === "gradient") {
        WbData.W.forEach(function (e, i) {
            drawGradientMatrixNerve({x: 10, y: 12 + i * 200}, 9, 6, e)
        });
    }

};