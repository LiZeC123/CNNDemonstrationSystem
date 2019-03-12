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

function drawLinearNerve(point, num, radius, margin, beginIdx, data) {
    var m = min(data);
    var l = max(data) - m;
    for (var i = 0; i < num; i++) {
        var c = new Shape.Circle(point.x, point.y + i * margin, radius);
        c.strokeColor = 'white';
        c.fillColor = new Color(1, (data[beginIdx + i] - m) / l);
    }
}

function drawOmissibleNerve(point, halfNum, radius, margin, idx1, idx2, data) {
    drawLinearNerve(point, halfNum, radius, margin, idx1, data);
    var pointMiss = new Point(point.x, point.y + halfNum * margin);
    var missNum = 2;
    var newMargin = margin / 5;
    var num = ((missNum + 1) * margin - 2 * radius) / newMargin - 1;
    for (var i = 0; i < num; i++) {
        var c = new Shape.Circle(pointMiss.x, pointMiss.y - margin + radius + (i + 1) * newMargin, radius / 5);
        c.strokeColor = 'white';
    }
    var pointBpttom = new Point(pointMiss.x, pointMiss.y + missNum * margin);
    drawLinearNerve(pointBpttom, halfNum, radius, margin, idx2, data);
}

function drawSinglePointConnectLine(point, linePoint, num, margin) {
    for (var i = 0; i < num; i++) {
        var path = new Path();
        path.strokeColor = 'white';
        path.add(point, new Point(linePoint.x, linePoint.y + i * margin));
    }
}

function drawConnectLine(pointLineA, numA, pointLineB, numB, margin) {
    for (var i = 0; i < numA; i++) {
        drawSinglePointConnectLine(new Point(pointLineA.x, pointLineA.y + i * margin), pointLineB, numB, margin)
    }
}

// 将多维数组扁平化，变成一维数组
function flatConv(data) {
    var fp = [].concat.apply([], data);
    fp = [].concat.apply([], fp);
    return fp;
}

function drawFullConnectNerve(pointIn, pointMid, pointOut) {
    var radius = 20;
    var margin = 100;
    var half1 = 6; //每一层一半的节点数量
    var half2 = 5;
    var fp = flatConv(window.conv2.p);
    drawOmissibleNerve(pointIn, half1, radius, margin, 0, 40, fp);
    drawOmissibleNerve(pointMid, half2, radius, margin, 0, 79, window.fc1.h[0]);
    drawLinearNerve(pointOut, 10, radius, margin, 0, window.fc2.h[0]);
    var point11 = new Point(pointIn.x + radius, pointIn.y);
    var point21 = new Point(pointMid.x - radius, pointMid.y);
    var point12 = new Point(pointIn.x + radius, pointIn.y + (half1 + 2) * margin);
    var point22 = new Point(pointMid.x - radius, pointMid.y + (half2 + 2) * margin);
    var point31 = new Point(pointMid.x + radius, pointMid.y);
    var point32 = new Point(pointMid.x + radius, pointMid.y + (half2 + 2) * margin);
    var point41 = new Point(pointOut.x - radius, pointOut.y);
    drawConnectLine(point11, half1, point21, half2, margin);
    drawConnectLine(point11, half1, point22, half2, margin);
    drawConnectLine(point12, half1, point21, half2, margin);
    drawConnectLine(point12, half1, point22, half2, margin);
    drawConnectLine(point31, half2, point41, 10, margin);
    drawConnectLine(point32, half2, point41, 10, margin)
}


window.mainFcUpdate = function () {
    paper.activate();
    paper.project.clear();
    drawFullConnectNerve(new Point(30, 22), new Point(200, 122), new Point(370, 222));
};