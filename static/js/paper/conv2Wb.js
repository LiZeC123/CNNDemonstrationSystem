var point = {x: 10, y: 40};
var interval = 200;
var margin = 12;
var radius = 10;

window.conv2WbUpdate = function (trainData, type, frameId) {
    paper.activate();
    paper.project.clear();
    drawTitle("第二卷积层权值");

    var i, line;
    for (i = 0; i < 4; i++) {
        line = new Point(point.x + i * 140, point.y);
        trainData.first.conv2.W[i].forEach(function (e, i) {
            var p = new Point(line.x, line.y + i * interval);
            drawMatrixNerve(p, margin, radius, e)
        });
    }
    for (i = 0; i < 4; i++) {
        line = new Point(point.x + i * 140, point.y + 800);
        trainData.first.conv2.W[i + 4].forEach(function (e, i) {
            var p = new Point(line.x, line.y + i * interval);
            drawMatrixNerve(p, margin, radius, e)
        });
    }

    if (type === "gradient") {
        for (i = 0; i < 4; i++) {
            line = new Point(point.x + i * 140, point.y);
            trainData.gradient.conv2.W[i].forEach(function (e, i) {
                var p = new Point(line.x, line.y + i * interval);
                drawGradientMatrixNerve(p, margin, radius, e, frameId)
            });
        }
        for (i = 0; i < 4; i++) {
            line = new Point(point.x + i * 140, point.y + 800);
            trainData.gradient.conv2.W[i + 4].forEach(function (e, i) {
                var p = new Point(line.x, line.y + i * interval);
                drawGradientMatrixNerve(p, margin, radius, e, frameId)
            });
        }
    }
};

var conv2WbToIdx = function (X, Y) {
    var rxIdx = Math.floor(X / 140);
    var rX = point.x + rxIdx * 140;
    var rY = point.y;
    var pos;
    if (Y < 800) {
        pos = genConvert(new Point(rX, rY), 4, 5, interval, margin)(X, Y);
    } else {
        rY = point.y + 800;
        pos = genConvert(new Point(rX, rY), 4, 5, interval, margin)(X, Y);
    }

    if (pos !== undefined) {
        pos.out = Y < 800 ? rxIdx : rxIdx + 4;
    }

    return pos;
};


var obj = $("#Wb2Canvas");
obj.mousemove(genMouseMove(obj, conv2WbToIdx,
    function (pos) {
        return "第二卷积层 特征面" + pos.out + " 卷积核" + pos.feature + " 第" + pos.row + "行 第" + pos.col + "列";
    },
    function (pos) {
        return trainData.first.conv2.W[pos.out][pos.feature][pos.row][pos.col];

    },
    {
        "name": "convWb",
        "getGradientInfo": function (pos) {
            if (window.isGradient) {
                var value = trainData.gradient.conv2.W[pos.out][pos.feature][pos.row][pos.col];
                return "当前神经元梯度值: " + value.toFixed(5);
            } else {
                return "当前神经元梯度值: 无";
            }
        }
    }
));