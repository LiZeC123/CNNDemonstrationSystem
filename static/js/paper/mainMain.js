function drawMatrixNerve(point, margin, radius, data) {
    var len = Math.sqrt(data.length);
    var count = 0;
    for (var y = 0; y < len; y++) {
        for (var x = 0; x < len; x++) {
            var c = Shape.Circle(point.x + 2 * x * margin + margin, point.y + 2 * y * margin + margin, radius);
            c.strokeColor = 'white';
            // 值越大，透明度越低，颜色越白
            c.fillColor = new Color(1, data[count] / 256.0);
            count++;
        }
    }


    var border = new Path();
    border.strokeColor = 'white';
    border.strokeWidth = 5;
    border.add(point);
    border.add(new Point(point.x, point.y + len * margin * 2));
    border.add(new Point(point.x + len * margin * 2, point.y + len * margin * 2));
    border.add(new Point(point.x + len * margin * 2, point.y));
    border.closed = true;

}


window.mainMainUpdate = function () {
    paper.activate();
    paper.project.clear();
    var data = window.inputImage;
    drawMatrixNerve({x: 10, y: 504}, 6, 4.5, data.inputImage);
};