var point = {x: 10, y: 32};
var interval = 400;
var margin = 6;
var radius = 4.5;

window.conv1ConvUpdate = function () {
    paper.activate();
    paper.project.clear();
    drawTitle("第一卷积层");
    window.conv1.f.forEach(function (e, i) {
        var p = new Point(point.x, point.y + i * interval);
        drawMatrixNerve(p, margin, radius, e)
    });
};

var conv1ConvToIdx = genConvert(point, 4, 28, interval, margin);
var obj = $("#conv1Canvas");
obj.mousemove(genMouseMove(obj, conv1ConvToIdx,
    function (pos) {
        return "第一卷积层 特征面" + pos.feature;
    },
    function (pos) {
        return window.calcData.conv1.f[pos.feature][pos.row][pos.col];
    },
    {
        "name": "conv1Weight",
        "weightTitle": "当前卷积核",
        "getWeight": function (pos) {
            return window.calcData.conv1.W[pos.feature];
        },
        "inputTitle": "输入数据",
        "getInputData": function (pos) {
            var leftTop = {
                "row": pos.row - 2,
                "col": pos.col - 2
            };
            var result = [];
            for (var row = leftTop.row; row < leftTop.row + 5; row++) {
                var oneRow = [];
                for (var col = leftTop.col; col < leftTop.col + 5; col++) {
                    if (row < 0 || col < 0 || row >= 28 || col >= 28) {
                        // 超过范围的部分使用0填充
                        oneRow.push(0);
                    } else {
                        oneRow.push(window.calcData.inputImage[row * 28 + col])
                    }
                }
                result.push(oneRow);
            }
            return result;
        }
    })
);