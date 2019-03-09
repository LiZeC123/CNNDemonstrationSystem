tool.minDistance = 4;
tool.maxDistance = 8;

var path;

function onMouseDown(event) {
    path = new Path();
    path.fillColor = 'white';

    path.add(event.point);
}

function onMouseDrag(event) {
    var step = event.delta;
    step.angle += 90;

    // 通过此函数约束输入的变化,使线条变化更平滑
    step = restrain(step);

    var top = event.middlePoint + step;
    var bottom = event.middlePoint - step;

    path.add(top);
    path.insert(0, bottom);
    path.smooth();
}

function onMouseUp(event) {
    path.add(event.point);
    path.closed = true;
    path.smooth();
}

function restrain(vec) {
    var type = 0;
    var i = vec / vec.length;

    if (type === 0) {
        return vec / -2 + i * 8;
    } else if (type === 1) {
        // y = 109e^(-x)+4
        return i * (109 * Math.exp(-vec.length) + 4);
    }
}


window.drawClean = function () {
    paper.activate();
    paper.project.clear();
};