function drawClean() {
    window.mouthBrushClean();
}

function drawExport(URL) {
    //将canvas内容转化为base64格式的dataURL
    const canvas = document.getElementById('drawCanvas');
    const img_png_src = canvas.toDataURL('image/png');
    dataTool.upload({"image": img_png_src}, function () {
        const name = URL.split('/').pop();
        if (name === 'main.html') {
            window.mainMainUpdate();
            window.mainConv1Update();
            window.mainConv2Update();
            window.mainFcUpdate();
        }

        $("#numberResult").html(window.prediction[0])
    })
}
