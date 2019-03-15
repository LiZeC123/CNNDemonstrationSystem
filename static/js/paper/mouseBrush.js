tool.minDistance = 4;
tool.maxDistance = 6;

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
        // sys = [Eq(4*a+b,6),Eq(6*a+b,3)]
        // nonlinsolve(sys,[a,b])
        return vec * (-1) + i * 10;
    } else if (type === 1) {
        // y = 109e^(-x)+4
        return i * (109 * Math.exp(-vec.length) + 4);
    }
}

// 用于清除当前画布的内容
// 暴露到全局，以供其他函数调用
window.mouthBrushClean = function () {
    paper.activate();
    paper.project.clear();
};