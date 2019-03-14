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
            window.conv1ConvUpdate();
            window.conv1ReLUUpdate();
            window.conv1PoolUpdate();
            window.conv2ConvUpdate();
            window.conv2ReLUUpdate();
            window.conv2PoolUpdate();
            window.mainFcUpdate();
        }

        $("#numberResult").html(window.prediction[0])
    })
}
