let status = ["init", "shrink", "C1", "C2"];
let currentStatus = "init";
let shrink = true;

// 状态转移图如下所示
/*                                  C1
*                                /
*                             (C1)
*         ---(C0/C1)-->       /
*  init                   shrink  <--|
*         <---(C0)----        \      |
*                              \    (C1)
*                             (C2)   |
*                                \   |
*                                  C2
* */

function initToShrink() {
    $("#conv1Canvas").hide("slow");
    $("#reLU1Canvas").hide("slow", function () {
        $("#conv2WbCanvas").hide("slow");
        $("#conv2Canvas").hide("slow");
        $("#reLU2Canvas").hide("slow");
    });
}

function shrinkToInit() {
    $("#reLU2Canvas").show("slow");
    $("#conv2Canvas").show("slow");
    $("#conv2WbCanvas").show("slow", function () {
        $("#reLU1Canvas").show("slow");
        $("#conv1Canvas").show("slow");
    });
}

function shrinkToC1() {
    $("#fullCanvas").hide();
    $("#pool2Canvas").hide("slow", function () {
        $("#conv1Canvas").show("slow");
        $("#reLU1Canvas").show("slow");
    });
}

function shrinkToC2() {
    $("#fullCanvas").hide();
    $("#mainCanvas").hide("slow", function () {
        $("#conv2WbCanvas").show("slow");
        $("#conv2Canvas").show("slow");
        $("#reLU2Canvas").show("slow");
    });
}

function C1ToShrink() {
    $("#conv1Canvas").hide("slow");
    $("#reLU1Canvas").hide("slow");
    $("#pool2Canvas").show();
    $("#fullCanvas").show();
}

function C2ToShrink() {
    $("#conv2WbCanvas").hide("slow");
    $("#conv2Canvas").hide("slow");
    $("#reLU2Canvas").hide("slow", function () {
        $("#mainCanvas").show("slow");
        $("#pool1Canvas").show("slow");
        $("#fullCanvas").show("slow");
    });
}


$(function () {
    const detail = $("#detailCanvas");
    $("#mainCanvas").click(function () {
        detail.hide();
        if (currentStatus === "shrink") {
            shrinkToInit();
            currentStatus = "init";
        } else if (currentStatus === "init") {
            initToShrink();
            currentStatus = "shrink";
        }
    });
    $("#pool1Canvas").click(function () {
        detail.hide();
        if (currentStatus === "init") {
            initToShrink();
            currentStatus = "shrink";
        } else if (currentStatus === "shrink") {
            shrinkToC1();
            currentStatus = "C1";
        } else if (currentStatus === "C1") {
            C1ToShrink();
            currentStatus = "shrink";
        } else if (currentStatus === "C2") {
            C2ToShrink();
            currentStatus = "shrink";
        }
    });
    $("#pool2Canvas").click(function () {
        detail.hide();
        if (currentStatus === "shrink") {
            shrinkToC2();
            currentStatus = "C2";
        } else if (currentStatus === "C2") {
            C2ToShrink();
            currentStatus = "shrink";
        }
    });
});