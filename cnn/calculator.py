import tensorflow as tf


class ConvLayout:
    def __init__(self, layoutIndex: int, graph: tf.Session.graph):
        i = layoutIndex
        # 卷积权重
        self.W_conv = graph.get_tensor_by_name(f'W_conv{i}:0')
        # 偏置置
        self.b_conv = graph.get_tensor_by_name(f'b_conv{i}:0')
        # 卷积和偏置计算结果
        self.f_conv = graph.get_tensor_by_name(f'f_conv{i}:0')
        # 经过reLu函数后的结果
        self.h_vonv = graph.get_tensor_by_name(f'h_vonv{i}:0')
        # 池化后的结果
        self.h_pool = graph.get_tensor_by_name(f'h_pool{i}:0')


class ConvValueLayout:
    def __init__(self, conv: ConvLayout, feed_dict: dict, sess: tf.Session):
        self.W, self.b, self.f, self.v, self.p = sess.run(
            [conv.W_conv, conv.b_conv, conv.f_conv, conv.h_vonv, conv.h_pool], feed_dict=feed_dict)


class FullLayout:
    def __init__(self):
        pass


class Calculator:
    def __init__(self, modelPath):
        self.sess = tf.Session()
        self.path = modelPath
        self.sess.close()
        self.cV1: ConvValueLayout = None
        self.cV2: ConvValueLayout = None

    def setInputImage(self, inputImage):
        self.__calcAll(inputImage)

    def __calcAll(self, inputImage):
        with tf.Session() as sess:
            graph = self.loadGraph(sess)
            x = graph.get_tensor_by_name("x:0")
            y = graph.get_tensor_by_name("y:0")
            conv1 = ConvLayout(1, graph)
            conv2 = ConvLayout(2, graph)
            keep_prob = graph.get_tensor_by_name("keep_prob:0")
            feed_dict = {x: inputImage, y: [[0., 0., 1., 0., 0., 0., 0., 0., 0., 0.]], keep_prob: 1.0}
            self.cV1 = ConvValueLayout(conv1, feed_dict, sess)
            self.cV2 = ConvValueLayout(conv2, feed_dict, sess)

    def calcConv1(self):
        cv: ConvValueLayout = self.cV1
        result = {
            'W': [cv.W[:, :, 0, i].tolist() for i in range(len(cv.W[0][0][0]))],
            'b': cv.b.tolist(),
            'f': [cv.f[0, :, :, i].tolist() for i in range(len(cv.f[0][0][0]))],
            'v': [cv.v[0, :, :, i].tolist() for i in range(len(cv.v[0][0][0]))],
            'p': [cv.p[0, :, :, i].tolist() for i in range(len(cv.p[0][0][0]))]}

        return result

    def calcConv2(self):
        return self.cV2

    def calcFull(self):
        pass

    def calcResult(self):
        pass

    def loadGraph(self, sess):
        saver = tf.train.import_meta_graph(self.path + '/cnn_model.meta')
        saver.restore(sess, tf.train.latest_checkpoint(self.path))
        graph = tf.get_default_graph()
        return graph
