import numpy as np
import tensorflow as tf
from tensorflow.examples.tutorials.mnist import input_data

from cnn.common import loadGraph, oneHot
from cnn.model import ConvLayout, ConvValueLayout, FullLayout, FullValueLayout, GradientList
from util.jsonWriter import JsonWriter


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
        # self.__checkCalculate()

    def trainByDataSet(self):
        with tf.Session() as sess:
            graph = loadGraph(sess, self.path)
            StepTrainer.__dataSetGradientDescent(sess, graph)
            self.__saveModel(sess)

    def __trainOneStep(self, inputImage: np.ndarray, realNumber: int):
        """执行一次计算，反向传播，再次计算的完整训练过程"""
        print(f"realNumber={realNumber}")
        with tf.Session() as sess:
            graph = loadGraph(sess, self.path)
            x = graph.get_tensor_by_name("x:0")
            y = graph.get_tensor_by_name("y:0")
            keep_prob = graph.get_tensor_by_name("keep_prob:0")

            feed_dict = {x: inputImage, y: oneHot(realNumber), keep_prob: 1.0}
            self.first = StepTrainer.calcValue(sess, graph, feed_dict)
            self.gradient = StepTrainer.gradientDescent(sess, graph, feed_dict)
            self.second = StepTrainer.calcValue(sess, graph, feed_dict)

    @staticmethod
    def calcValue(sess: tf.Session, graph: tf.Session.graph, feed_dict: dict):
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
    def calcGradient(sess: tf.Session, graph: tf.Session.graph, feed_dict: dict):
        loss = graph.get_tensor_by_name("loss:0")
        gradient = tf.train.GradientDescentOptimizer(0.2).compute_gradients(loss)
        gList = sess.run(gradient, feed_dict)
        return GradientList(gList).toDict()

    @staticmethod
    def gradientDescent(sess: tf.Session, graph: tf.Session.graph, feed_dict: dict):
        """根据预测结果计算梯度，并执行一次梯度下降优化"""
        loss = graph.get_tensor_by_name("loss:0")
        gradient = tf.train.GradientDescentOptimizer(0.2).compute_gradients(loss)
        # train_step = graph.get_operation_by_name("train_step")
        train_step = tf.train.GradientDescentOptimizer(0.2).apply_gradients(gradient)

        # 计算梯度
        gList = sess.run(gradient, feed_dict)
        gDict = GradientList(gList).toDict()

        # 执行梯度下降
        sess.run(train_step, feed_dict)

        return gDict

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

    def __saveModel(self, sess: tf.Session):
        """保存训练之后的模型"""
        saver = tf.train.Saver()
        saver.save(sess, self.path + "/cnn_model")

    def calcInputImage(self) -> dict:
        return {'inputImage': self.inputImage.reshape(784).tolist()}

    def __checkCalculate(self):
        """检查梯度下降计算和执行结果"""
        arr1 = np.array(self.first["conv1"]["W"][0])
        arr2 = np.array(self.second["conv1"]["W"][0])
        arr = arr1 - arr2
        g = np.array(self.gradient["conv1"]["W"][0])
        print(arr)
        print("----")
        print(g)
        print("----")
        print(arr / g)  # 如果比值等于学习率，则计算正确


def cast(value: dict) -> dict:
    del value["conv1"]["f"]
    del value["conv1"]["p"]
    del value["conv1"]["v"]
    del value["conv2"]["f"]
    # del value["conv2"]["p"]
    del value["conv2"]["v"]
    del value["fc1"]["f"]
    # del value["fc1"]["h"]
    del value["fc2"]["f"]
    # del value["fc2"]["h"]
    return value


class TrainDateGen:
    def __init__(self, modelPath, jsonPath):
        self.modelPath = modelPath
        self.jsonPath = jsonPath

    def genTrainData(self):
        mnist = input_data.read_data_sets('cnn/MNIST_data', one_hot=True)
        writer = JsonWriter(self.jsonPath)

        with tf.Session() as sess:
            graph = loadGraph(sess, self.modelPath)
            x = graph.get_tensor_by_name("x:0")
            y = graph.get_tensor_by_name("y:0")
            keep_prob = graph.get_tensor_by_name("keep_prob:0")

            for n in range(10):
                # 先执行计算操作，获得参数信息
                batch_xs, batch_ys = mnist.train.next_batch(1)
                feed_dict = {x: batch_xs, y: batch_ys, keep_prob: 1.0}
                value = StepTrainer.calcValue(sess, graph, feed_dict)
                writer.write(cast(value))
                # 再执行训练操作
                batch_xs, batch_ys = mnist.train.next_batch(100)
                feed_dict = {x: batch_xs, y: batch_ys, keep_prob: 1.0}
                value = StepTrainer.gradientDescent(sess, graph, feed_dict)
                writer.write(value)

        writer.close()


if __name__ == '__main__':
    # stepTrainer = StepTrainer()
    pass
