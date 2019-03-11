window.mainMainUpdate = function () {
    paper.activate();
    paper.project.clear();
    var data = window.inputImage;
    drawMatrixNerve2({x: 10, y: 504}, 6, 4.5, data.inputImage);
};