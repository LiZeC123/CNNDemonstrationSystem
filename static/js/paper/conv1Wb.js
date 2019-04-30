var point = {x: 10, y: 140};
var interval = 400;
var margin = 12;
var radius = 10;

window.conv1WbUpdate = function (WbData, type) {
    paper.activate();


    if (type === "data") {
        paper.project.clear();
        WbData.W.forEach(function (e, i) {
            drawMatrixNerve({x: 10, y: 140 + i * 400}, margin, radius, e)
        });
    }

    if (type === "gradient") {
        WbData.W.forEach(function (e, i) {
            drawGradientMatrixNerve({x: 10, y: 140 + i * 400}, margin, radius, e)
        });
    }

};