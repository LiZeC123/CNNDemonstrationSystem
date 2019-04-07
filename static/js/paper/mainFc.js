var radius = 20;  //全连接层神经元半径
var margin = 100; //全连接层神经元间距


window.mainFcUpdate = function (trainData, type) {
    paper.activate();
    paper.project.clear();
    var location = {
        "pointIn": new Point(30, 47),
        "pointMid": new Point(200, 147),
        "pointOut": new Point(370, 247)
    };


    if (type === "gradient") {
        drawFullConnectGradientNerve(location, trainData)
    } else {
        drawFullConnectNerve(location, trainData);
    }
};

function drawFullConnectGradientNerve(location, trainData) {
    var flatP = flatArray(trainData.first.conv2.p);
    //var len1 = flatP.length;
    //var len2 = fcData.fc1.b.length;

    drawNerve(location.pointIn, 0, 12, flatP);
    drawNerve2(location.pointMid, 0, 10,
        {"type": "gradient", "v": trainData.first.fc1.h[0], "b": trainData.gradient.fc1.b});
    drawNerve2(location.pointOut, 0, 10,
        {"type": "gradient", "v": trainData.first.fc2.h[0], "b": trainData.gradient.fc2.b});

    var begIdx1 = 0, begIdx2 = 0, begIdx3 = 0;
    var num1 = 12, num2 = 10, num3 = 10;
    drawConnectLine({"begPnt": location.pointIn, "begIdx": begIdx1, "num": num1},
        {"begPnt": location.pointMid, "begIdx": begIdx2, "num": num2},
        {
            "type": "gradient", "W": trainData.gradient.fc1.W,
            "Wmin": min(flatArray(trainData.gradient.fc1.W)),
            "Wmax": max(flatArray(trainData.gradient.fc1.W))
        }
    );

    drawConnectLine({"begPnt": location.pointMid, "begIdx": begIdx2, "num": num2},
        {"begPnt": location.pointOut, "begIdx": begIdx3, "num": num3},
        {
            "type": "gradient", "W": trainData.gradient.fc2.W,
            "Wmin": min(flatArray(trainData.gradient.fc2.W)),
            "Wmax": max(flatArray(trainData.gradient.fc2.W))
        }
    );
}

function drawFullConnectNerve(location, trainData) {
    var flatP = flatArray(trainData.first.conv2.p);
    // var len1 = flatP.length;
    // var len2 = fcData.fc1.h[0].length;
    var begIdx1 = 0, begIdx2 = 0, begIdx3 = 0;
    var num1 = 12, num2 = 10, num3 = 10;
    drawNerve(location.pointIn, begIdx1, num1, flatP);
    drawNerve2(location.pointMid, begIdx2, num2,
        {"type": "data", "v": trainData.first.fc1.h[0], "b": trainData.first.fc1.b});
    drawNerve2(location.pointOut, begIdx3, num3,
        {"type": "data", "v": trainData.first.fc2.h[0], "b": trainData.first.fc2.b});

    drawConnectLine({"begPnt": location.pointIn, "begIdx": begIdx1, "num": num1},
        {"begPnt": location.pointMid, "begIdx": begIdx2, "num": num2},
        {
            "type": "data", "W": trainData.first.fc1.W,
            "Wmin": min(flatArray(trainData.first.fc1.W)),
            "Wmax": max(flatArray(trainData.first.fc1.W))
        }
    );

    drawConnectLine({"begPnt": location.pointMid, "begIdx": begIdx2, "num": num2},
        {"begPnt": location.pointOut, "begIdx": begIdx3, "num": num3},
        {
            "type": "data", "W": trainData.first.fc2.W,
            "Wmin": min(flatArray(trainData.first.fc2.W)),
            "Wmax": max(flatArray(trainData.first.fc2.W))
        }
    );
}

// data -> {type,W,Wmin,Wmax}
// A B -> {begPnt,begIdx,num}
function drawConnectLine(A, B, data) {
    for (var i = 0; i < A.num; i++) {
        for (var j = 0; j < B.num; j++) {
            var value = data.W[A.begIdx + i][B.begIdx + j];
            var path = new Path();
            path.strokeColor = getColorByType(data.type, value, data.Wmax, data.Wmin);
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
        c.strokeColor = getColorByType(drawData.type, b, Bmax, Bmin);
        c.strokeWidth = 2;
        c.fillColor = getColorByType("data", v, Vmax, Vmin);
        var text = new PointText(getTextPoint(begPnt.x, begPnt.y + i * margin, v));
        text.content = v.toFixed(2)
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
    return value < 0.2 ? 0.2 : value;
}

function getTextPoint(x, y, value) {
    if (value >= 100) {
        return new Point(x - 20, y + 5)
    } else if (value >= 10) {
        return new Point(x - 15, y + 5)
    } else {
        return new Point(x - 12, y + 5)
    }
}

function max(array) {
    var m = array[0];
    array.forEach(function (ele) {
        if (ele > m) {
            m = ele;
        }
    });
    return m;
}

function min(array) {
    var m = array[0];
    array.forEach(function (ele) {
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