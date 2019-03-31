import random

from tensorflow.examples.tutorials.mnist import input_data


class MnistHelper:
    def __init__(self):
        self.mnist = None
        self.index: int = random.randint(0, 10000)

    def getImage(self):
        if self.mnist is None:
            # 必须使用相对根目录的路径
            self.mnist = input_data.read_data_sets('cnn/MNIST_data')
        # mnist.train.images.shape
        # (55000, 78)
        result = {
            'image': self.mnist.train.images[self.index].tolist(),
            'label': int(self.mnist.train.labels[self.index])
        }
        self.index = self.index + 1
        return result
