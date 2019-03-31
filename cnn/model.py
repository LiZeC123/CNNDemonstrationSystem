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
