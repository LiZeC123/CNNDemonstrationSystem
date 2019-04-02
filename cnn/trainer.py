import numpy as np
import tensorflow as tf
from tensorflow.examples.tutorials.mnist import input_data

from cnn.common import loadGraph, oneHot
from cnn.model import ConvLayout, ConvValueLayout, FullLayout, FullValueLayout


class StepTrainer:
    # noinspection PyTypeChecker
    def __init__(self, modelPath):
        self.sess = tf.Session()
        self.path = modelPath
        self.sess.close()
        self.inputImage: np.ndarray = None
        self.first: dict = None
        self.gradient = None
        self.second: dict = None
        # self.mnist =

    def setInputImage(self, inputImage: np.ndarray, realNumber: int):
        self.inputImage = inputImage
        self.__trainOneStep(inputImage, realNumber)

    def __trainOneStep(self, inputImage: np.ndarray, realNumber: int):
        """执行一次计算，反向传播，再次计算的完整训练过程"""
        # TODO：优化函数过程，尽量去除冗余的代码计算
        print(f"realNumber={realNumber}")
        with tf.Session() as sess:
            graph = loadGraph(sess, self.path)
            x = graph.get_tensor_by_name("x:0")
            y = graph.get_tensor_by_name("y:0")
            keep_prob = graph.get_tensor_by_name("keep_prob:0")

            # num = 100
            # xs = np.zeros((num, 784))
            # ys = np.zeros((num, 10))
            # for i in range(num):
            #     xs[i] = np.array(inputImage / 255)
            #     ys[i] = oneHot(realNumber)
            # feed_dict = {x: xs, y: ys, keep_prob: 1.0}

            feed_dict = {x: inputImage / 255, y: oneHot(realNumber), keep_prob: 1.0}

            self.first = StepTrainer.__calcValue(sess, graph, feed_dict)

            self.gradient = StepTrainer.__gradientDescent(sess, graph, feed_dict)

            self.second = StepTrainer.__calcValue(sess, graph, feed_dict)
            saver = tf.train.Saver()
            saver.save(sess, self.path + "/cnn_model")

    @staticmethod
    def __calcValue(sess: tf.Session, graph: tf.Session.graph, feed_dict: dict):
        """预测图片的数值"""
        conv1 = ConvLayout(1, graph)
        conv2 = ConvLayout(2, graph)
        fc1 = FullLayout(1, graph)
        fc2 = FullLayout(2, graph)
        prediction = graph.get_tensor_by_name('h_fc2:0')
        pV = sess.run(tf.argmax(prediction, 1), feed_dict=feed_dict)
        return {
            "conv1": ConvValueLayout(conv1, feed_dict, sess).toDict(),
            "conv2": ConvValueLayout(conv2, feed_dict, sess).toDict(),
            "fc1": FullValueLayout(fc1, feed_dict, sess).toDict(),
            "fc2": FullValueLayout(fc2, feed_dict, sess).toDict(),
            "prediction": pV.tolist()
        }

    @staticmethod
    def __gradientDescent(sess: tf.Session, graph: tf.Session.graph, feed_dict: dict):
        """根据预测结果计算梯度，并执行一次梯度下降优化"""

        for k, v in feed_dict.items():
            print(f"k={k},v={v}")

        loss = graph.get_tensor_by_name("loss:0")
        gradient = tf.train.GradientDescentOptimizer(0.2).compute_gradients(loss)
        train_step = graph.get_operation_by_name("train_step")

        # 计算梯度
        lossV = sess.run(loss, feed_dict)
        print(f"loss Value = {lossV}")
        glist = sess.run(gradient, feed_dict)
        # 执行梯度下降
        sess.run(train_step, feed_dict)

        # 输出的梯度是一个列表，其中每个元素是（gradient, variable）的格式
        # 因此提取gradient即可
        print(glist[0][0])
        result = []
        for g in glist:
            # print(g[0])
            # print("-----------------")
            result.append(g[0].tolist())

        return result

    @staticmethod
    def __dataSetGradientDescent(sess: tf.Session, graph: tf.Session.graph):
        """从数据集中抽取一部分数据进行梯度下降操作"""
        mnist = input_data.read_data_sets('cnn/MNIST_data', one_hot=True)
        batch_xs, batch_ys = mnist.train.next_batch(100)

        x = graph.get_tensor_by_name("x:0")
        y = graph.get_tensor_by_name("y:0")
        keep_prob = graph.get_tensor_by_name("keep_prob:0")

        feed_dict = {x: batch_xs, y: batch_ys, keep_prob: 1.0}

        train_step = graph.get_operation_by_name("train_step")

        sess.run(train_step, feed_dict)

    def __saveModel(self):
        """保存训练之后的模型"""
        pass

    def calcInputImage(self) -> dict:
        return {'inputImage': self.inputImage.reshape(784).tolist()}


if __name__ == '__main__':
    # stepTrainer = StepTrainer()
    pass
