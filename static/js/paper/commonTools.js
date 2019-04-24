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

function getColorByType(colorType, sign, alpha) {
    alpha = (alpha === undefined ? 1 : alpha);
    if (colorType === "data") {
        if (sign > 0) {
            return new Color(1, 1, 1, alpha);
        } else {
            return new Color(0, 0, 0, alpha);
        }
    } else if (colorType === "gradient") {
        if (sign > 0) {
            return new Color(0, 1, 0.2, alpha);
        } else {
            return new Color(1, 0, 0, alpha);
        }
    }
}

function baseDrawMatrixNerve(point, margin, radius, data, colorType) {
    var b = matrixBorder(data);
    var min = b[0];
    var max = b[1];

    var width = data[0].length;
    var height = data.length;
    for (var x = 0; x < width; x++) {
        for (var y = 0; y < height; y++) {
            var c = Shape.Circle(point.x + 2 * x * margin + margin, point.y + 2 * y * margin + margin, radius);
            //由于正负数分开进行归一化，因此ReLU函数前后的正数神经元看起来亮度不变，更能反映ReLU函数的特点
            if (data[y][x] >= 0) {
                c.strokeColor = getColorByType(colorType, +1);
                c.fillColor = getColorByType(colorType, +1, data[y][x] / max);
            } else {
                c.strokeColor = getColorByType(colorType, -1);
                c.fillColor = getColorByType(colorType, -1, data[y][x] / min);
            }
        }
    }

    var border = new Path();
    border.strokeColor = 'white';
    border.strokeWidth = 4;
    border.add(point);
    border.add(new Point(point.x, point.y + height * margin * 2));
    border.add(new Point(point.x + width * margin * 2, point.y + height * margin * 2));
    border.add(new Point(point.x + width * margin * 2, point.y));
    border.closed = true;
}

window.drawMatrixNerve = function (point, margin, radius, data) {
    baseDrawMatrixNerve(point, margin, radius, data, "data");
};

window.drawGradientMatrixNerve = function (point, margin, radius, data) {
    baseDrawMatrixNerve(point, margin, radius, data, "gradient");
};

window.drawMatrixNerve2 = function (point, margin, radius, data) {
    var min = data[0], max = data[0], scan;
    data.forEach(function (ele) {
        if (ele < min) {
            min = ele;
        } else if (ele > max) {
            max = ele;
        }
    });
    scan = max - min;

    var len = Math.sqrt(data.length);
    var count = 0;
    for (var y = 0; y < len; y++) {
        for (var x = 0; x < len; x++) {
            var c = Shape.Circle(point.x + 2 * x * margin + margin, point.y + 2 * y * margin + margin, radius);
            c.strokeColor = 'white';
            // 值越大，透明度越低，颜色越白
            c.fillColor = new Color(1, data[count] / scan);
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

window.drawTitle = function (content,point) {
    if(point === undefined){
        point = new Point(5,20);
    }
    var text = new PointText(point);
    text.content = content;
    text.fontSize = 20;
    text.fillColor = 'white';
};