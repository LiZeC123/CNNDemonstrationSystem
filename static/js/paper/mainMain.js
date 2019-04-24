window.mainMainUpdate = function () {
    paper.activate();
    paper.project.clear();
    drawTitle("输入图像");
    drawMatrixNerve2({x: 10, y: 632}, 6, 4.5, window.inputImage);
};