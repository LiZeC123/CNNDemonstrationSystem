/**
 *
 * @param layoutName
 * @param value
 */
window.drawDetail = function (layoutName, value) {
    paper.activate();
    paper.project.clear();

    var layout = new PointText(new Point(5, 20));
    layout.content = "当前位置:" + layoutName;
    //layout.fontFamily = "SimSun";
    layout.fontSize = 20;
    layout.fillColor = 'white';

    var v = new PointText(new Point(5, 50));
    v.content = "当前神经元取值:" + value.toFixed(2);
    // v.fontFamily = "SimSun";
    v.fontSize = 20;
    v.fillColor = 'white';

};