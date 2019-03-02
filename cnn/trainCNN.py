import tensorflow as tf
from tensorflow.examples.tutorials.mnist import input_data


# 初始化权值
def weight_variable(shape, name):
    initial = tf.truncated_normal(shape, stddev=0.1, name=name)
    return tf.Variable(initial)


# 初始化偏置值
def bias_variable(shape, name):
    initial = tf.constant(0.1, shape=shape, name=name)
    return tf.Variable(initial)


# 卷积层
def conv2d(x, W, name):
    # x input tensor of shape [batch,in_height,in_width,in_channels]
    # W filter /kernel tensor of shape[filter_height,filter_width,in_channels,out_channels]
    # strides[0/3]=1,strides[1]代表x方向的步长，strides[2]y方向步长
    # padding 'SAME' 'VALID'
    return tf.nn.conv2d(x, W,
                        strides=[1, 1, 1, 1],
                        padding='SAME', name=name)


# 池化层
def max_pool_2x2(x, name):
    # ksize[1,x,y,1]
    return tf.nn.max_pool(x, ksize=[1, 2, 2, 1], strides=[1, 2, 2, 1],
                          padding='SAME', name=name)


def buildNetwork(x, y, keep_prob):
    # 改变x的格式转为4D的向量[batch,in_height,in_width,in_channels]
    x_image = tf.reshape(x, [-1, 28, 28, 1])

    # 初始化第一个卷积层的权值和偏置
    # 把x_image和权值向量进行卷积，再加上偏置值，然后应用与relu激活函数
    W_conv1 = weight_variable([5, 5, 1, 32], 'W_conv1')
    b_conv1 = bias_variable([32], 'b_conv1')
    f_conv1 = conv2d(x_image, W_conv1, 'f_conv1')
    h_vonv1 = tf.nn.relu(f_conv1 + b_conv1, name='h_vonv1')
    h_pool1 = max_pool_2x2(h_vonv1, 'h_pool1')

    # 初始化第二个卷积层的权值和偏置
    W_conv2 = weight_variable([5, 5, 32, 64], 'W_conv2')
    b_conv2 = bias_variable([64], 'b_conv2')
    f_conv2 = conv2d(h_pool1, W_conv2, 'f_conv2')
    h_vonv2 = tf.nn.relu(f_conv2 + b_conv2, 'h_vonv2')
    h_pool2 = max_pool_2x2(h_vonv2, 'h_pool2')  # 进行max-pooling

    # 28*28的图片第一次卷积后还是28*28，第一次池化后变为14*14
    # 第二次卷积后为14*14，第二次池化后变为7*7

    # 初始化第一个全连接层的权值
    # 经过上面操作后得到64张7*7的平面，输出为1024个神经元
    W_fc1 = weight_variable([7 * 7 * 64, 1024], 'W_fc1')
    b_fc1 = bias_variable([1024], 'b_fc1')
    # 把池化层2的输出扁平化为1维
    h_pool2_flat = tf.reshape(h_pool2, [-1, 7 * 7 * 64], name='h_pool2_flat')
    # 求第一个全连接层的输出
    f_fc1 = tf.matmul(h_pool2_flat, W_fc1, name='f_fc1')
    h_fc1 = tf.nn.relu(f_fc1 + b_fc1, name='h_fc1')

    # keep_prob用来表示神经元的输出概率
    h_fc1_drop = tf.nn.dropout(h_fc1, keep_prob, name='h_fc1_drop')

    # 初始化第二个全连接层
    W_fc2 = weight_variable([1024, 10], 'W_fc2')
    b_fc2 = bias_variable([10], 'b_fc2')
    f_fc2 = tf.matmul(h_fc1_drop, W_fc2, name='f_fc2')
    # 计算输出

    prediction = tf.nn.softmax(f_fc2 + b_fc2, name='prediction')
    # softmax和交叉熵一起使用
    loss = tf.reduce_mean(tf.nn.softmax_cross_entropy_with_logits(labels=y, logits=prediction), name='loss')
    train_step = tf.train.GradientDescentOptimizer(0.2).minimize(loss, name='train_step')

    # 结果放在一个布尔列表中
    # argmax返回一维张量中最大的值所在的位置,1代表一行中的最大位置
    correct_prediction = tf.equal(tf.argmax(y, 1), tf.argmax(prediction, 1))
    # 求准确率
    accuracy = tf.reduce_mean(tf.cast(correct_prediction, tf.float32))

    return train_step, prediction, accuracy


def train():
    mnist = input_data.read_data_sets('MNIST_data', one_hot=True)

    batch_size = 100
    n_batch = mnist.train.num_examples // batch_size

    x = tf.placeholder(tf.float32, [None, 784], name='x')  # 28*28
    y = tf.placeholder(tf.float32, [None, 10], name='y')
    keep_prob = tf.placeholder(tf.float32, name='keep_prob')

    train_step, prediction, accuracy = buildNetwork(x, y, keep_prob)

    # TODO: 修改计算方法
    saver = tf.train.Saver()
    with tf.Session() as sess:
        sess.run(tf.global_variables_initializer())
        times = 1
        for batch in range(n_batch * times):
            batch_xs, batch_ys = mnist.train.next_batch(batch_size)
            sess.run(train_step, feed_dict={x: batch_xs, y: batch_ys, keep_prob: 0.7})
            if batch % 100 == 0:
                acc = sess.run(accuracy, feed_dict={x: batch_xs, y: batch_ys, keep_prob: 0.7})
                print(f'batch {batch}, acc = {acc}')
        saver.save(sess, './SavedData/cnn_model')


if __name__ == '__main__':
    train()

# def lalal():
#     # 下面的代码为修改后的结果
#     acc = 0
#     for batch in range(n_test_batch):
#         batch_test_xs, batch_test_ys = mnist.test.next_batch(batch_size)
#         acc += sess.run(accuracy, feed_dict={x: batch_test_xs, y: batch_test_ys, keep_prob: 1})
#         print("Iter " + str(epoch) + ",Testing Accuracy " + str(acc / (batch + 1)))