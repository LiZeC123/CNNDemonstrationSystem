import numpy as np
import tensorflow as tf


def weight_variable(shape, name):
    """创建一个给定大小的，随机初始化的tensor（用于卷积核的权值）"""
    initial = tf.truncated_normal(shape, stddev=0.1)
    return tf.Variable(initial, name=name)


def bias_variable(shape, name):
    """创建一个给定大小的，固定值的tensor（用于初始偏置值）"""
    initial = tf.constant(0.1, shape=shape)
    return tf.Variable(initial, name=name)


def conv2d(x, W, name):
    """计算卷积"""
    # x input tensor of shape [batch,in_height,in_width,in_channels]
    # W filter /kernel tensor of shape[filter_height,filter_width,in_channels,out_channels]
    # strides[0/3]=1,strides[1]代表x方向的步长，strides[2]y方向步长
    # padding 'SAME' 'VALID'
    return tf.nn.conv2d(x, W,
                        strides=[1, 1, 1, 1],
                        padding='SAME', name=name)


def max_pool_2x2(x, name):
    """进行池化操作"""
    # ksize[1,x,y,1]
    return tf.nn.max_pool(x, ksize=[1, 2, 2, 1], strides=[1, 2, 2, 1],
                          padding='SAME', name=name)


def buildNetwork(x, y, keep_prob):
    """创建一个卷积神经网络"""

    # 改变x的格式转为4D的向量[batch,in_height,in_width,in_channels]
    x_image = tf.reshape(x, [-1, 28, 28, 1])

    # 初始化第一个卷积层的权值和偏置
    # 把x_image和权值向量进行卷积，再加上偏置值，然后应用与relu激活函数
    W_conv1 = weight_variable([5, 5, 1, 4], 'W_conv1')
    b_conv1 = bias_variable([4], 'b_conv1')
    f_conv1 = tf.add(conv2d(x_image, W_conv1, name='c_conv1'), b_conv1, name='f_conv1')
    h_vonv1 = tf.nn.relu(f_conv1, name='h_vonv1')
    h_pool1 = max_pool_2x2(h_vonv1, 'h_pool1')

    # 初始化第二个卷积层的权值和偏置
    W_conv2 = weight_variable([5, 5, 4, 8], 'W_conv2')
    b_conv2 = bias_variable([8], 'b_conv2')
    f_conv2 = tf.add(conv2d(h_pool1, W_conv2, name='c_conv2'), b_conv2, name='f_conv2')
    h_vonv2 = tf.nn.relu(f_conv2, 'h_vonv2')
    h_pool2 = max_pool_2x2(h_vonv2, 'h_pool2')  # 进行max-pooling

    # 把池化层2的输出扁平化为1维
    h_pool2_flat = tf.reshape(h_pool2, [-1, 7 * 7 * 8], name='h_pool2_flat')

    # 初始化第一个全连接层的权值
    W_fc1 = weight_variable([7 * 7 * 8, 84], 'W_fc1')
    b_fc1 = bias_variable([84], 'b_fc1')
    f_fc1 = tf.add(tf.matmul(h_pool2_flat, W_fc1), b_fc1, name='f_fc1')
    h_fc1 = tf.nn.relu(f_fc1, name='h_fc1')

    # keep_prob用来表示神经元的输出概率
    h_fc1_drop = tf.nn.dropout(h_fc1, keep_prob, name='h_fc1_drop')

    # 初始化第二个全连接层
    W_fc2 = weight_variable([84, 10], 'W_fc2')
    b_fc2 = bias_variable([10], 'b_fc2')
    f_fc2 = tf.add(tf.matmul(h_fc1_drop, W_fc2), b_fc2, name='f_fc2')
    h_fc2 = tf.nn.softmax(f_fc2, name='h_fc2')

    # 计算输出
    prediction = h_fc2
    # softmax和交叉熵一起使用
    loss = tf.reduce_mean(tf.nn.softmax_cross_entropy_with_logits(labels=y, logits=prediction), name='loss')
    train_step = tf.train.GradientDescentOptimizer(0.2).minimize(loss, name='train_step')

    # 结果放在一个布尔列表中
    # argmax返回一维张量中最大的值所在的位置,1代表一行中的最大位置
    correct_prediction = tf.equal(tf.argmax(y, 1), tf.argmax(prediction, 1))
    # 求准确率
    accuracy = tf.reduce_mean(tf.cast(correct_prediction, tf.float32))

    return train_step, prediction, accuracy


def loadGraph(sess, path) -> tf.Session.graph:
    """从指定的位置加载以及保存的图"""
    saver = tf.train.import_meta_graph(path + '/cnn_model.meta')
    saver.restore(sess, tf.train.latest_checkpoint(path))
    graph = tf.get_default_graph()
    return graph


def oneHot(number: int):
    """对给定的数字执行one-hot操作"""
    data = np.array([number])
    return (np.arange(10) == data[:, None]).astype(np.integer)
