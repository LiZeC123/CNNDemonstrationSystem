// 注意： 所有的PaperScript都依赖此文件，因此需要将此文件先于所有PaperScript引入
// 此文件需要以PaperScript的方式导入，并且与任意的Canvas绑定
window.drawMatrixNerve = function (point, margin, radius, data) {
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
};

window.drawMatrixNerve2 = function (point, margin, radius, data) {
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
};