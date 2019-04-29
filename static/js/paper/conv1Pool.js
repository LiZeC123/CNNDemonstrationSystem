var point = {x: 10, y: 74};
var interval = 400;
var margin = 9;
var radius = 6;

window.conv1PoolUpdate = function () {
    paper.activate();
    paper.project.clear();
    drawTitle("第一池化层");
    window.conv1.p.forEach(function (e, i) {
        var p = new Point(point.x, point.y + i * interval);
        drawMatrixNerve(p, margin, radius, e)
    });
};

var conv1PoolToIdx = genConvert(point, 4, 14, interval, margin);
var obj = $("#pool1Canvas");
obj.mousemove(genMouseMove(obj, conv1PoolToIdx,
    function (pos) {
        return "第一池化层 特征面" + pos.feature + " 第" + pos.row + "行 第" + pos.col + "列";
    },
    function (pos) {
        return window.calcData.conv1.p[pos.feature][pos.row][pos.col];
    },
    {
        "name": "conv1Pool",
        "title": "池化层输入",
        "getInputData": function (pos) {
            var leftTop = {
                "row": 2 * pos.row,
                "col": 2 * pos.col
            };

            var result = [];
            for (var row = leftTop.row; row < leftTop.row + 2; row++) {
                var oneRow = [];
                for (var col = leftTop.col; col < leftTop.col + 2; col++) {
                    oneRow.push(window.calcData.conv1.v[pos.feature][row][col]);
                }
                result.push(oneRow);
            }
            return result;
        }

    })
);
