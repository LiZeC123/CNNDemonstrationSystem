# 这是一个数据生成脚本，用于构建其他模块需要的模型以及创建
from cnn.trainer import TrainDateGen


def genTrainData():
    gen = TrainDateGen('cnn/SemiData', 'static/local/train.json')
    gen.genTrainData()


if __name__ == '__main__':
    genTrainData()
