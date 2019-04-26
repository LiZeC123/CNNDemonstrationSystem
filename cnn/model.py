import tensorflow as tf


class ConvLayout:
    def __init__(self, layoutIndex: int, graph: tf.Session.graph):
        i = layoutIndex
        self.W_conv = graph.get_tensor_by_name(f'W_conv{i}:0')  # 卷积权重
        self.b_conv = graph.get_tensor_by_name(f'b_conv{i}:0')  # 偏置置
        self.f_conv = graph.get_tensor_by_name(f'f_conv{i}:0')  # 卷积计算结果
        self.h_vonv = graph.get_tensor_by_name(f'h_vonv{i}:0')  # 经过reLU函数后的结果
        self.h_pool = graph.get_tensor_by_name(f'h_pool{i}:0')  # 池化后的结果


class ConvValueLayout:
    def __init__(self, conv: ConvLayout, feed_dict: dict, sess: tf.Session):
        self.W, self.b, self.f, self.v, self.p = sess.run(
            [conv.W_conv, conv.b_conv, conv.f_conv, conv.h_vonv, conv.h_pool], feed_dict=feed_dict)

    def toDict(self):
        if self.W.shape[2] == 1:
            return {
                'W': [self.W[:, :, 0, i].tolist() for i in range(len(self.W[0][0][0]))],
                'b': self.b.tolist(),
                'f': [self.f[0, :, :, i].tolist() for i in range(len(self.f[0][0][0]))],
                'v': [self.v[0, :, :, i].tolist() for i in range(len(self.v[0][0][0]))],
                'p': [self.p[0, :, :, i].tolist() for i in range(len(self.p[0][0][0]))]
            }
        else:
            W = []
            for m in range(self.W.shape[2]):
                W.append([self.W[:, :, 0, i].tolist() for i in range(len(self.W[0][0][0]))])
            return {
                'W': W,
                'b': self.b.tolist(),
                'f': [self.f[0, :, :, i].tolist() for i in range(len(self.f[0][0][0]))],
                'v': [self.v[0, :, :, i].tolist() for i in range(len(self.v[0][0][0]))],
                'p': [self.p[0, :, :, i].tolist() for i in range(len(self.p[0][0][0]))]
            }


class FullLayout:
    def __init__(self, layoutIndex: int, graph: tf.Session.graph):
        i = layoutIndex
        self.W_fc = graph.get_tensor_by_name(f'W_fc{i}:0')  # 权重
        self.b_fc = graph.get_tensor_by_name(f'b_fc{i}:0')  # 偏置
        self.f_fc = graph.get_tensor_by_name(f'f_fc{i}:0')  # 计算结果
        self.h_fc = graph.get_tensor_by_name(f'h_fc{i}:0')  # 经过reLU函数后的结果


class FullValueLayout:
    def __init__(self, fc: FullLayout, feed_dict: dict, sess: tf.Session):
        self.W, self.b, self.f, self.h = sess.run([fc.W_fc, fc.b_fc, fc.f_fc, fc.h_fc], feed_dict=feed_dict)

    def toDict(self):
        return {
            'W': self.W.tolist(),
            'b': self.b.tolist(),
            'f': self.f.tolist(),
            'h': self.h.tolist(),
        }


class ConvGradientValueLayout:
    def __init__(self, W, b):
        self.W = W
        self.b = b

    def toDict(self):
        if self.W.shape[2] == 1:
            return {
                "W": [self.W[:, :, 0, i].tolist() for i in range(len(self.W[0][0][0]))],
                "b": self.b.tolist()
            }
        else:
            W = []
            for m in range(self.W.shape[2]):
                W.append([self.W[:, :, 0, i].tolist() for i in range(len(self.W[0][0][0]))])
            return {
                "W": W,
                "b": self.b.tolist()
            }


class FullGradientValueLayout:
    def __init__(self, W, b):
        self.W = W
        self.b = b

    def toDict(self):
        return {
            "W": self.W.tolist(),
            "b": self.b.tolist()
        }


class GradientList:
    def __init__(self, gradient):
        # 梯度是一个列表，其中每个元素是（gradient, variable）的格式
        self.conv1 = ConvGradientValueLayout(gradient[0][0], gradient[1][0])
        self.conv2 = ConvGradientValueLayout(gradient[2][0], gradient[3][0])
        self.fc1 = FullGradientValueLayout(gradient[4][0], gradient[5][0])
        self.fc2 = FullGradientValueLayout(gradient[6][0], gradient[7][0])

    def toDict(self):
        return {
            "conv1": self.conv1.toDict(),
            "conv2": self.conv2.toDict(),
            "fc1": self.fc1.toDict(),
            "fc2": self.fc2.toDict()
        }
