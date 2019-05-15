# 这是一个数据生成脚本，用于构建其他模块需要的模型以及创建

import getopt
import sys


def usage():
    print("newModel.py 脚本用于配置模型和训练动画的数据文件")
    print("指令格式 newModel.py <指令>")
    print("指令列表")
    print("--Saved  重新训练用于识别过程的模型")
    print("--Semi   重新训练用于训练过程的模型")
    print("--Train  重新生成训练过程动画的数据文件")


if __name__ == '__main__':
    try:
        options, args = getopt.getopt(
            sys.argv[1:],
            "h",
            ["Semi", "Saved", "Train"])
    except getopt.GetoptError:
        sys.exit()
    for name, value in options:
        if name in ("-h", "--help"):
            usage()
        if name == "--Train":
            print("开始生成训练过程动画")
            from cnn.trainer import TrainDateGen

            gen = TrainDateGen('cnn/SemiData', 'static/local/train.json')
            gen.genTrainData()
        if name == "--Saved":
            from cnn.generator import train

            print('开始识别过程的模型训练')
            train("cnn/SavedData/cnn_model", 30)
        if name == "--Semi":
            from cnn.generator import train

            print('开始训练动画的模型训练')
            train("./SemiData/cnn_model", 0)
