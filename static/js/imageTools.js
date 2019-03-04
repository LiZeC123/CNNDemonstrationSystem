function drawNerve(data) {
    'use strict';
    paper.install(window);
    paper.setup(document.getElementById('mainCanvas'));
    console.log(data);

    let c;
    let count = 0;
    const r = 4.5;
    const m = 6;
    const len = 28 * 2 * m + 1;
    for (let x = m; x < len; x += 2 * m) {
        for (let y = m; y < len; y += 2 * m) {
            c = Shape.Circle(y,x,r);
            c.strokeColor = 'white';
            // 值越大，透明度越低，颜色越白
            c.fillColor = new Color(1,data[count]/256.0);

            count++;
        }
    }
    paper.view.draw();
}