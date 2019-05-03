var radius = 20;  //全连接层神经元半径
var margin = 100; //全连接层神经元间距
var num1 = 14, num2 = 12;

var begIdx1 = 0, begIdx2 = 0;
window.mainFcChange = function (delta, layout) {
    if (layout === 1) {
        if ((begIdx1 + delta >= 0) && (begIdx1 + num1 + delta <= 392)) {
            begIdx1 += delta;
        }
    } else if (layout === 2) {
        if ((begIdx2 + delta >= 0) && (begIdx2 + num2 + delta <= 84)) {
            begIdx2 += delta;
        }
    }
};

var fcData;
window.mainFcUpdate = function (trainData, type) {
    paper.activate();
    paper.project.clear();
    console.log(trainData);
    var location = {
        "pointIn": new Point(37, 150),
        "pointMid": new Point(277, 250),
        "pointOut": new Point(517, 350)
    };

    drawTitle("全连接层", new Point(100, 30));
    drawArrows(location);

    fcData = {
        "type": type,
        "flatP": flatArray(trainData.first.conv2.p),
    };

    if (type === "gradient") {
        fcData.fc1 = trainData.gradient.fc1;
        fcData.fc2 = trainData.gradient.fc2;
    } else {
        fcData.fc1 = trainData.first.fc1;
        fcData.fc2 = trainData.first.fc2;
    }

    fcData.fc1.h = trainData.first.fc1.h;
    fcData.fc2.h = trainData.first.fc2.h;

    drawFullConnectNerve(location, fcData);

};

function drawArrows(location) {
    drawArrow(new Point(location.pointIn.x, location.pointIn.y - 100), "up");
    drawArrow(new Point(location.pointMid.x, location.pointIn.y - 100), "up");
    drawArrow(new Point(location.pointIn.x, location.pointIn.y + 1400), "down");
    drawArrow(new Point(location.pointMid.x, location.pointIn.y + 1400), "down");
}

function drawArrow(center, direction) {
    /*  箭头与点对应关系如下所示
    *       C            A
    *       |           /|\
    *       |          B x D
    *     B x D          |
    *      \|/           |
    *       A            C
    */
    var A, B, C, D, arrow;

    B = new Point(center.x - 12, center.y);
    D = new Point(center.x + 12, center.y);
    arrow = new Path({"strokeColor": "white"});
    if (direction === "up") {
        A = new Point(center.x, center.y - 12);
        C = new Point(center.x, center.y + 18);
    } else {
        A = new Point(center.x, center.y + 12);
        C = new Point(center.x, center.y - 18);
    }

    arrow.add(A, B);
    arrow.add(A, C);
    arrow.add(A, D);
}

function drawFullConnectNerve(location, fcData) {

    drawNerve(location.pointIn, begIdx1, num1, fcData.flatP);
    drawNerve2(location.pointMid, begIdx2, num2,
        {"v": fcData.fc1.h[0], "b": fcData.fc1.b});
    drawNerve2(location.pointOut, 0, 10,
        {"v": fcData.fc2.h[0], "b": fcData.fc2.b});

    drawConnectLine({"begPnt": location.pointIn, "begIdx": begIdx1, "num": num1},
        {"begPnt": location.pointMid, "begIdx": begIdx2, "num": num2},
        {
            "W": fcData.fc1.W,
            "Wmin": min(flatArray(fcData.fc1.W)),
            "Wmax": max(flatArray(fcData.fc1.W))
        }
    );

    drawConnectLine({"begPnt": location.pointMid, "begIdx": begIdx2, "num": num2},
        {"begPnt": location.pointOut, "begIdx": 0, "num": 10},
        {
            "W": fcData.fc2.W,
            "Wmin": min(flatArray(fcData.fc2.W)),
            "Wmax": max(flatArray(fcData.fc2.W))
        }
    );

    drawNumberLabel(location.pointOut);
}

// data -> {W,Wmin,Wmax}
// A B -> {begPnt,begIdx,num}
function drawConnectLine(A, B, data) {
    for (var i = 0; i < A.num; i++) {
        for (var j = 0; j < B.num; j++) {
            var value = data.W[A.begIdx + i][B.begIdx + j];
            var path = new Path();
            path.strokeColor = getColorByType(fcData.type, value, data.Wmax, data.Wmin);
            path.add(new Point(A.begPnt.x + radius, A.begPnt.y + i * margin),
                new Point(B.begPnt.x - radius, B.begPnt.y + j * margin));
        }
    }

}

function drawNerve(begPnt, begIdx, num, drawData) {
    var Vmax = max(drawData);
    var Vmin = min(drawData);
    for (var i = 0; i < num; i++) {
        var c = new Shape.Circle(begPnt.x, begPnt.y + i * margin, radius);
        c.strokeWidth = 2;
        var value = drawData[begIdx + i];
        if (value >= 0) {
            c.strokeColor = 'white';
            c.fillColor = new Color(1, retain(value / Vmax));
        } else {
            c.strokeColor = 'black';
            c.fillColor = new Color(1, retain(value / Vmin));
        }
        var text = new PointText(getTextPoint(begPnt.x, begPnt.y + i * margin, value));
        text.content = value.toFixed(2)
    }
}

function drawNerve2(begPnt, begIdx, num, drawData) {
    var Vmax = max(drawData.v);
    var Vmin = min(drawData.v);
    var Bmax = max(drawData.b);
    var Bmin = min(drawData.b);
    for (var i = 0; i < num; i++) {

        var c = new Shape.Circle(begPnt.x, begPnt.y + i * margin, radius);
        var v = drawData.v[begIdx + i];
        var b = drawData.b[begIdx + i];
        // 边框颜色根据绘制的类型有所不同
        c.strokeColor = getColorByType(fcData.type, b, Bmax, Bmin);
        c.strokeWidth = 2;
        // 神经元填充颜色始终为黑白色
        c.fillColor = getColorByType("data", v, Vmax, Vmin);
        var text = new PointText(getTextPoint(begPnt.x, begPnt.y + i * margin, v));
        text.content = v.toFixed(2)
    }
}

function drawNumberLabel(begPnt) {
    for (var i = 0; i < 10; i++) {
        var text = new PointText(new Point(begPnt.x + 40, begPnt.y + i * margin + 8));
        text.content = i;
        text.fontSize = 20;
        text.fillColor = 'white';
    }

}

function getColorByType(type, value, Vmax, Vmin) {
    // 确保当所有数值都为0的时候，不至于因为除法产生NaN
    Vmax = Vmax === 0 ? 0.00001 : Vmax;
    Vmin = Vmin === 0 ? 0.00001 : Vmin;
    if (type === "data") {
        if (value >= 0) {
            return new Color(1, retain(value / Vmax));
        } else {
            return new Color(0, retain(value / Vmin));
        }
    } else if (type === "gradient") {
        if (value >= 0) {
            return new Color(0, 1, 0, retain(value / Vmax));
        } else if (value < 0) {
            return new Color(1, 0, 0, retain(value / Vmin));
        }
    }
}

function retain(value) {
    return value < 0.1 ? 0.1 : value;
}


function max(arr) {
    var m = arr[0];
    arr.forEach(function (ele) {
        if (ele > m) {
            m = ele;
        }
    });
    return m;
}

function min(arr) {
    var m = arr[0];
    arr.forEach(function (ele) {
        if (ele < m) {
            m = ele;
        }
    });
    return m;
}

function flatArray(arr) {
    // 将多维数组扁平化，变成一维数组
    var fp = [].concat.apply([], arr);
    fp = [].concat.apply([], fp);
    return fp;
}


var mainFcToIdx = function (X, Y) {
    var rY = Y % 100;
    var absIdx, rIdx;
    var line = -1;
    if (rY > 50 - radius && rY < 50 + radius) {
        rIdx = Math.floor(Y / 100) - 1;

        if (X > 37 - radius && X < 37 + radius) {
            line = 0;
            absIdx = begIdx1 + rIdx;
        } else if (X > 277 - radius && X < 277 + radius) {
            line = 1;
            rIdx -= 1; // 不同层的神经元起点位置不同，需要作出调整
            absIdx = begIdx2 + rIdx;
        } else if (X > 517 - radius && X < 517 + radius) {
            line = 2;
            rIdx -= 2;
            absIdx = rIdx;
        }

    }


    if (line !== -1 && rIdx !== undefined && rIdx >= 0) {
        if ((line === 0 && rIdx < num1) ||
            (line === 1 && rIdx < num2) ||
            (line === 2 && rIdx < 10)) {
            return {
                "line": line,
                "rIdx": rIdx,
                "absIdx": absIdx
            }
        }

    }
};

var obj = $("#fullCanvas");
obj.mousemove(genMouseMove(obj, mainFcToIdx,
    function (pos) {
        switch (pos.line) {
            case 0:
                return "输入层 序号" + pos.absIdx + " 当前位置" + pos.rIdx;
            case 1:
                return "隐含层 序号" + pos.absIdx + " 当前位置" + pos.rIdx;
            case 2:
                return "输出层 序号" + pos.absIdx;
        }
    },
    function (pos) {
        switch (pos.line) {
            case 0:
                return fcData.flatP[pos.absIdx];
            case 1:
                return fcData.fc1.h[0][pos.absIdx];
            case 2:
                return fcData.fc2.h[0][pos.absIdx];
        }
    },
    {
        "name": "fc",
        "getWeight": getWeight,
        "getBias": getBias,
        "getWeightTitle": function () {
            return window.isGradient ? "当前神经元连接权值的梯度" : "当前神经元连接权值";
        }
    })
);

function getWeight(pos) {
    var result = [], i = 0;
    if (pos.line === 0) {
        result.push("此神经元没有连接的权值");
        result.push("");
    }
    if (pos.line === 1) {
        for (i = begIdx1; i < begIdx1 + num1; i++) {
            result.push("[" + (i - begIdx1) + "] " + fcData.fc1.W[i][pos.absIdx].toFixed(5));
        }
    } else if (pos.line === 2) {
        for (i = begIdx2; i < begIdx2 + num2; i++) {
            result.push("[" + (i - begIdx2) + "] " + fcData.fc2.W[i][pos.absIdx].toFixed(5));
        }
    }
    return result;
}

function getBias(pos) {
    var title = window.isGradient ? "当前神经元偏置的梯度: " : "当前神经元偏置值: ";
    switch (pos.line) {
        case 0:
            return title + "无";
        case 1:
            return title + fcData.fc1.b[pos.absIdx].toFixed(5);
        case 2:
            return title + fcData.fc2.b[pos.absIdx].toFixed(5);
    }
}

obj.click(function (e) {
    // 相对当前元素的坐标
    var X = e.pageX - obj.offset().left;
    var Y = e.pageY - obj.offset().top;

    if (X > 37 - radius && X < 37 + radius) {
        if (Y > 50 - radius && Y < 50 + radius) {
            mainFcChange(-1, 1);
        } else if (Y > 1550 - radius && Y < 1550 + radius) {
            mainFcChange(1, 1);
        }
    } else if (X > 277 - radius && X < 277 + radius) {
        if (Y > 50 - radius && Y < 50 + radius) {
            mainFcChange(-1, 2);
        } else if (Y > 1550 - radius && Y < 1550 + radius) {
            mainFcChange(1, 2);
        }
    }

    if (window.isGradient) {
        window.mainFcUpdate(window.trainData, "gradient");
    } else {
        window.mainFcUpdate(window.trainData, "data");
    }
});