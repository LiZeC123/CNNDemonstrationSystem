import numpy as np
import tensorflow as tf

from cnn.common import loadGraph
from cnn.model import ConvLayout, ConvValueLayout, FullLayout, FullValueLayout


class Calculator:
    # noinspection PyTypeChecker
    def __init__(self, modelPath):
        # self.sess = tf.Session()
        self.path = modelPath
        # self.sess.close()
        self.inputImage: np.ndarray = None
        self.cV1: ConvValueLayout = None
        self.cV2: ConvValueLayout = None
        self.fV1: FullValueLayout = None
        self.fV2: FullValueLayout = None
        self.prediction: np.ndarray = None

    def setInputImage(self, inputImage: np.ndarray):
        self.inputImage = inputImage
        self.__calcAll(inputImage)

    def __calcAll(self, inputImage):
        with tf.Session() as sess:
            graph = loadGraph(sess, self.path)
            x = graph.get_tensor_by_name("x:0")
            y = graph.get_tensor_by_name("y:0")
            conv1 = ConvLayout(1, graph)
            conv2 = ConvLayout(2, graph)
            fc1 = FullLayout(1, graph)
            fc2 = FullLayout(2, graph)
            prediction = graph.get_tensor_by_name('h_fc2:0')
            keep_prob = graph.get_tensor_by_name("keep_prob:0")
            feed_dict = {x: inputImage / 255, y: [[0., 0., 1., 0., 0., 0., 0., 0., 0., 0.]], keep_prob: 1.0}
            self.cV1 = ConvValueLayout(conv1, feed_dict, sess)
            self.cV2 = ConvValueLayout(conv2, feed_dict, sess)
            self.fV1 = FullValueLayout(fc1, feed_dict, sess)
            self.fV2 = FullValueLayout(fc2, feed_dict, sess)
            self.prediction = sess.run(tf.argmax(prediction, 1), feed_dict=feed_dict)

    def calcInputImage(self) -> dict:
        return {'inputImage': self.inputImage.reshape(784).tolist()}

    def calcConv1(self) -> dict:
        return self.cV1.toDict()

    def calcConv2(self) -> dict:
        return self.cV2.toDict()

    def calcFullConnect1(self) -> dict:
        return self.fV1.toDict()

    def calcFullConnect2(self) -> dict:
        return self.fV2.toDict()

    def calcResult(self) -> dict:
        return {'prediction': self.prediction.tolist()}
