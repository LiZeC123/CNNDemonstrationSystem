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

/**
 * 坐标转换函数，使得输入的数字在指定的位置居中显示
 * @param x 中心点x坐标
 * @param y 中心点y坐标
 * @param value 需要显示的数字
 * @returns 转化后的坐标
 */
window.getTextPoint = function (x, y, value) {
    if (value >= 100) {
        return new Point(x - 20, y + 5)
    } else if (value >= 10) {
        return new Point(x - 15, y + 5)
    } else if (value >= 0) {
        return new Point(x - 12, y + 5)
    } else if (value >= -10) {
        return new Point(x - 15, y + 5);
    }
};

function baseDrawMatrixNerve(point, margin, radius, data, colorType, drawText) {
    var b = matrixBorder(data);
    var min = b[0];
    var max = b[1];

    var width = data[0].length;
    var height = data.length;
    for (var x = 0; x < width; x++) {
        for (var y = 0; y < height; y++) {
            var center = new Point(point.x + 2 * x * margin + margin, point.y + 2 * y * margin + margin);
            var c = Shape.Circle(center, radius);
            //由于正负数分开进行归一化，因此ReLU函数前后的正数神经元看起来亮度不变，更能反映ReLU函数的特点
            if (data[y][x] >= 0) {
                c.strokeColor = getColorByType(colorType, +1);
                c.fillColor = getColorByType(colorType, +1, data[y][x] / max);
            } else {
                c.strokeColor = getColorByType(colorType, -1);
                c.fillColor = getColorByType(colorType, -1, data[y][x] / min);
            }

            // 在神经元上加上数值
            if (drawText) {
                var value = data[y][x];
                var text = new PointText(getTextPoint(center.x, center.y, value));
                text.content = value.toFixed(2);
                if (value < 0) {
                    text.fillColor = "white";
                }
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

/**
 *
 * @param point
 * @param pos
 * @param margin
 * @param eleNum
 */
window.drawSelectedBorder = function (point, pos, margin, eleNum) {

    var center = new Point(point.x + pos.col * 2 * margin + margin, point.y + pos.row * 2 * margin + margin);
    /* 边框与点的对应关系如下图所示
        A       B
         -------
        |   x   |
         -------
        D       C
     */
    var base = 5 * margin;
    var A = new Point(center.x - base, center.y - base);
    var B = new Point(center.x + base, center.y - base);
    var C = new Point(center.x + base, center.y + base);
    var D = new Point(center.x - base, center.y + base);

    var maxLen = eleNum * 2 * margin;
    [A, B, C, D].forEach(function (e) {
        if (e.x < point.x) {
            e.x = point.x;
        }
        if (e.y < point.y) {
            e.y = point.y;
        }
        if (e.x > point.x + maxLen) {
            e.x = point.x + maxLen;
        }
        if (e.y > point.y + maxLen) {
            e.y = point.y + maxLen;
        }
    });

    var border = new Path();
    border.strokeColor = 'white';
    border.strokeWidth = 4;
    border.add(A);
    border.add(B);
    border.add(C);
    border.add(D);
    border.closed = true;
};

window.drawMatrixNerve = function (point, margin, radius, data) {
    baseDrawMatrixNerve(point, margin, radius, data, "data");
};

/**
 * 在指定的位置绘制表示梯度的箭头
 * @param point 绘制梯度的矩形的起始位置
 * @param margin 矩形中元素的边距
 * @param radius
 * @param data 梯度数据
 * @param frame 箭头位置，分别使用数字0,1,2表示，依次绘制即可产生连续的动画
 */
window.drawGradientMatrixNerve = function (point, margin, radius, data, frame) {
    var b = matrixBorder(data);
    var min = b[0];
    var max = b[1];
    var scan = {"type": "middle"};

    var width = data[0].length;
    var height = data.length;
    for (var x = 0; x < width; x++) {
        for (var y = 0; y < height; y++) {
            var center = new Point(point.x + 2 * x * margin + margin, point.y + 2 * y * margin + margin);
            var value = data[y][x];
            if (frame === 0) {
                center = value > 0 ? new Point(center.x, center.y - 9) : new Point(center.x, center.y + 9);
                scan.type = "head";
            } else if (frame === 1) {
                center = value > 0 ? new Point(center.x, center.y - 3) : new Point(center.x, center.y + 3);
            } else if (frame === 2) {
                // center不变
            } else if (frame === 3) {
                center = value > 0 ? new Point(center.x, center.y + 5) : new Point(center.x, center.y - 5);
            } else if (frame === 4) {
                center = value > 0 ? new Point(center.x, center.y + 10) : new Point(center.x, center.y - 10);
                scan.type = "tail";
            } else if (frame === 5) {
                scan.type = "empty";
            }
            drawArrow(center,
                {"v": data[y][x], "max": max, "min": min},
                scan);
        }
    }
};


function drawArrow(center, value, scan) {
    /*  箭头与点对应关系如下所示
    *       C            A
    *       |           /|\
    *       |          B x D
    *     B x D          |
    *      \|/           |
    *       A            C
    */
    var A, B, C, D, arrow;
    B = new Point(center.x - 5, center.y);
    D = new Point(center.x + 5, center.y);
    if (value.v >= 0) {
        // 梯度为正，数值减少
        if (scan.type === "head") {
            A = new Point(center.x, center.y + 3);
        } else if (scan.type === "middle") {
            A = new Point(center.x, center.y + 3);
            C = new Point(center.x, center.y - 5);
        } else if (scan.type === "tail") {
            A = new Point(center.x, center.y - 2);
            C = new Point(center.x, center.y - 5);
        }
        arrow = new Path({"strokeColor": getColorByType("gradient", +1, value.v / value.max)});
    } else {
        if (scan.type === "head") {
            A = new Point(center.x, center.y - 3);
        } else if (scan.type === "middle") {
            A = new Point(center.x, center.y - 3);
            C = new Point(center.x, center.y + 5);
        } else if (scan.type === "tail") {
            A = new Point(center.x, center.y + 2);
            C = new Point(center.x, center.y + 5);
        }
        arrow = new Path({"strokeColor": getColorByType("gradient", -1, value.v / value.min)});
    }

    if (scan.type === "head") {
        arrow.add(A, B);
        arrow.add(A, D);
    } else if (scan.type === "middle") {
        arrow.add(A, B);
        arrow.add(A, C);
        arrow.add(A, D);
    } else if (scan.type === "tail") {
        arrow.add(A, C);
    } else if (scan.type === "empty") {
        // 不绘制图像
    }
}

window.drawMatrixNerveWithNumber = function (point, margin, radius, data) {
    baseDrawMatrixNerve(point, margin, radius, data, "data", true);
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
        //  console.log(xx, yy);
        if (pos !== undefined) {
            detail.show();
            setDetailCSS(detail, eleThis, xx, yy);

            if (more !== undefined) {
                // 如果更多参数不为空，则将pos加入到其中,以便于内部的模块调用其他函数
                more.pos = pos;
            }
            drawDetail(funGetName(pos), funGetValue(pos), more);
        } else {
            detail.hide();

            if (more !== undefined && more.onExit !== undefined) {
                more.onExit();
            }

        }
    }
};

/**
 * 根据鼠标的位置和详细界面的窗口类型设置详细界面的窗口的位置
 * @param detail 详细界面的窗口的JQuery对象
 * @param eleThis 当前需要展示的窗口的JQuery对象
 * @param xx 当前鼠标的X坐标
 * @param yy 当前鼠标的Y坐标
 */
function setDetailCSS(detail, eleThis, xx, yy) {
    var width = 500;
    var height = 55;
    if (eleThis.selector === "#conv1Canvas") {
        width = 540;
        height = 360;
    } else if (eleThis.selector === "#pool1Canvas") {
        height = 212;
    } else if (eleThis.selector === "#fullCanvas") {
        height = 260;
    }

    var m = 20;                 // 鼠标与窗口边缘的距离
    var topLimit = height + m - 30;  // 上方的极限距离，小于此距离时窗口必须位于下方(-30使得上下移动更平滑）
    var leftLimit = 1340 - width - m;
    if (xx < leftLimit && yy < topLimit) {
        detail.css({"left": xx + m, "top": yy + m, "width": width, "height": height});
        detail.attr({"width": width, "height": height});
    } else if (xx < leftLimit && yy >= topLimit) {
        detail.css({"left": xx + m, "top": yy - height - m, "width": width, "height": height});
        detail.attr({"width": width, "height": height});
    } else if (xx >= leftLimit && yy < topLimit) {
        detail.css({"left": xx - width - m, "top": yy + m, "width": width, "height": height});
        detail.attr({"width": width, "height": height});
    } else {
        detail.css({"left": xx - width - m, "top": yy - height - m, "width": width, "height": height});
        detail.attr({"width": width, "height": height});
    }

}