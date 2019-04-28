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

window.drawTitle = function (content, point) {
    if (point === undefined) {
        point = new Point(5, 20);
    }
    var text = new PointText(point);
    text.content = content;
    text.fontSize = 20;
    text.fillColor = 'white';
};

/**
 * 产生一个将像素坐标转化元素序号的函数
 * @param point 第一个特征面的起始点
 * @param num 特征面的数量
 * @param eleNum 一个特征面中元素的数量
 * @param interval 特征面各起始点之间的间隔
 * @param margin 元素之间的间距
 * @returns {Function} 一个将坐标转化为{特征面，行数，列数}的函数
 */
window.genConvert = function (point, num, eleNum, interval, margin) {
    return function (X, Y) {
        for (var i = 0; i < num; i++) {
            var rX = X - point.x;
            var rY = Y - (point.y + i * interval);
            var row = Math.ceil(rY / (2 * margin)) - 1;
            var col = Math.ceil(rX / (2 * margin)) - 1;

            if (row >= 0 && col >= 0 && row < eleNum && col < eleNum) {
                return {
                    "feature": i,
                    "row": row,
                    "col": col
                }
            }
        }
    }
};


/**
 * 根据给定的参数，创建鼠标移动时的监听函数
 * @param eleThis 监听鼠标移动的JQuery对象
 * @param funConv 将坐标转化为元素索引的函数
 * @param funGetName 根据索引值获得名称的函数
 * @param funGetValue 根据索引值获得神经元值的函数
 * @param more 更多其他参数组成的字典
 * @returns {Function} 返回鼠标的监听函数
 */
window.genMouseMove = function (eleThis, funConv, funGetName, funGetValue, more) {
    return function (e) {
        ////相对浏览器窗口的坐标
        var xx = e.originalEvent.x || e.originalEvent.layerX || 0;
        var yy = e.originalEvent.y || e.originalEvent.layerY || 0;
        // 相对当前元素的坐标
        var positionX = e.pageX - eleThis.offset().left;
        var positionY = e.pageY - eleThis.offset().top;

        var detail = $("#detailCanvas");
        var pos = funConv(positionX, positionY);
        console.log(xx, yy);
        if (pos !== undefined) {
            detail.show();
            if (xx < 710 && yy < 240) {
                detail.css({"left": xx + 20, "top": yy + 20});
            } else if (xx < 710 && yy >= 240) {
                detail.css({"left": xx + 20, "top": yy - 200 - 20});
            } else if (xx >= 710 && yy < 240) {
                detail.css({"left": xx - 300 - 20, "top": yy + 20});
            } else {
                detail.css({"left": xx - 300 - 20, "top": yy - 200 - 20});
            }

            if (more !== undefined) {
                // 如果更多参数不为空，则将pos加入到其中,以便于内部的模块调用其他函数
                more.pos = pos;
            }
            drawDetail(funGetName(pos), funGetValue(pos), more);
        } else {
            detail.hide();
        }
    }
};