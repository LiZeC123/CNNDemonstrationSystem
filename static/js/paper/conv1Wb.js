window.conv1WbUpdate = function (WbData, type) {
    paper.activate();
    paper.project.clear();

    if (type === "data") {
        WbData.W.forEach(function (e, i) {
            drawMatrixNerve({x: 10, y: 10 + i * 346}, 9, 6, e)
        });
    } else if (type === "gradient") {
        WbData.W.forEach(function (e, i) {
            drawGradientMatrixNerve({x: 10, y: 10 + i * 346}, 9, 6, e)
        });
    }

};