tool.minDistance = 2;
// tool.maxDistance = 6;

var isTest = false;

if (isTest) {
    // 创建一个记录移动数据的列表，以便后续导出分析
    window.mouseData = [];
}

var path;
function onMouseDown(event) {
    path = new Path();
    path.fillColor = 'white';

    path.add(event.point);
}

function onMouseDrag(event) {
    var step = event.delta;
    step.angle += 90;
    if (isTest) {
        mouseData.push(step.length);
    }
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
    var type = 2;
    var i = vec / vec.length;
    var len = vec.length;
    if (type === 0) {
        // 线性模型
        // sys = [Eq(4*a+b,6),Eq(6*a+b,3)]
        // nonlinsolve(sys,[a,b])
        return vec * (-1) + i * 10;
    } else if (type === 1) {
        // 指数模型
        // y = 109e^(-x)+4
        return i * (109 * Math.exp(-vec.length) + 4);
    } else if (type === 2) {
        // 对数模型
        // 7-3*log(x)
        // 假定x最小值为1
        return i * (10 - 2 * Math.log(len));
    }

}

// 用于清除当前画布的内容
// 暴露到全局，以供其他函数调用
window.mouthBrushClean = function () {
    paper.activate();
    paper.project.clear();
};