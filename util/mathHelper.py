def calculateImageLocation(length, cutNum, margin, num):
    """
    :param length:  绘图区域的总长度
    :param cutNum: 需要分割的数量，即需要绘制的图的数量
    :param margin: 每一个图中各个神经元的间距
    :param num: 每一个图中每一列包含的神经元数量
    :return: 输入分割方案的起始距离和间距
    """
    # 图像的整体长度等于margin+(margin*(num-1))+margin+L/2+L/2
    # 其中L为边框线宽
    imageHeight = (2 * margin * num) + 4
    if length < imageHeight * cutNum:
        print(f"长度小于最低要求，问题无解(至少需要{imageHeight * cutNum})")
    else:
        interval = length / cutNum
        # 绘图点是边框线交叉部分的中点
        # 图像最两端都有半个线宽的距离
        #  |----------
        #  |  x  |
        #  |-----|----
        #  |     |
        begin = (interval / 2) - (imageHeight / 2) + 2
        print(f"起始距离为{begin},间距为{interval}")


if __name__ == '__main__':
    print("输入层")
    calculateImageLocation(1600, 1, 6, 28)
    print("第一卷积层和ReLU层")
    calculateImageLocation(1600, 4, 6, 28)
    print("第一池化层")
    calculateImageLocation(1600, 4, 9, 14)
    print("第二卷积层和ReLU层")
    calculateImageLocation(1600, 8, 6, 14)
    print("第二池化层")
    calculateImageLocation(1600, 8, 9, 7)
    print("全连接层")
    calculateImageLocation(1600, 16, 20, 1)
    print("第二卷积层权值")
    calculateImageLocation(1600, 4, 9, 5)
    print("------------------")
    print("训练界面第一卷积层权值")
    calculateImageLocation(1600, 4, 12, 5)
    print("训练界面第二卷积层权值")
    calculateImageLocation(1600, 8, 12, 5)
