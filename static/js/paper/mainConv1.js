function drawMatrixNerve(point, margin, radius, data) {
    var width = data[0].length;
    var height = data.length;
    for (var x = 0; x < width; x++) {
        for (var y = 0; y < height; y++) {
            var c = Shape.Circle(point.x + 2 * x * margin + margin, point.y + 2 * y * margin + margin, radius);
            // 绝对值越大，透明度越低
            // 对于边框颜色, 正数为白色,负数为黑色

            if (data[y][x] >= 0) {
                c.strokeColor = 'white';
                // c.strokeColor = new Color(1, data[y][x] / 256.0);
                c.fillColor = new Color(1, data[y][x] / 256.0);
            } else {
                console.log(data[y][x]);
                c.strokeColor = 'black';
                c.fillColor = new Color(1, -data[y][x] / 256.0);
            }
        }
    }

    var border = new Path();
    border.strokeColor = 'white';
    border.strokeWidth = 5;
    border.add(point);
    border.add(new Point(point.x, point.y + height * margin * 2));
    border.add(new Point(point.x + width * margin * 2, point.y + height * margin * 2));
    border.add(new Point(point.x + width * margin * 2, point.y));
    border.closed = true;


}


window.mainConv1Update = function () {
    paper.activate();
    paper.project.clear();
    var data = window.conv1;
    for (var i = 0; i < data.v.length; i++) {
        drawMatrixNerve({x: 10, y: 42 + i * 336}, 9, 6, data.p[i]);
    }
};
