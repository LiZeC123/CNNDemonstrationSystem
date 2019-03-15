// 注意： 所有的PaperScript都依赖此文件，因此需要将此文件先于所有PaperScript引入
// 此文件需要以PaperScript的方式导入，并且与任意的Canvas绑定
function matrixBorder(matrix) {
    var max = matrix[0][0];
    var min = matrix[0][0];
    matrix.forEach(function (arr) {
        arr.forEach(function (ele) {
            if (ele < min) {
                min = ele;
            } else if (ele > max) {
                max = ele;
            }
        });
    });
    return [min, max];
}


window.drawMatrixNerve = function (point, margin, radius, data) {
    var b = matrixBorder(data);
    var min = b[0];
    var max = b[1];
    var scan = max - min;

    var width = data[0].length;
    var height = data.length;
    for (var x = 0; x < width; x++) {
        for (var y = 0; y < height; y++) {
            var c = Shape.Circle(point.x + 2 * x * margin + margin, point.y + 2 * y * margin + margin, radius);
            if (min >= 0) {
                // 只有正数的场景，全部使用白色，值越大，透明度越低，颜色越白
                c.strokeColor = 'white';
                c.fillColor = new Color(1, data[y][x] / scan);
            } else {
                // 正负数同时存在的场景，分别使用黑白两种颜色
                // 绝对值越大，透明度越低
                if (data[y][x] >= 0) {
                    c.strokeColor = 'white';
                    c.fillColor = new Color(1, data[y][x] / 256.0);
                } else {
                    c.strokeColor = 'black';
                    c.fillColor = new Color(0, -data[y][x] / 256.0);
                }
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