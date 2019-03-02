import tensorflow as tf
from tensorflow.examples.tutorials.mnist import input_data


# 初始化权值
def weight_variable(shape):
    initial = tf.truncated_normal(shape, stddev=0.1)
    return tf.Variable(initial)


# 初始化偏置值
def bias_variable(shape):
    initial = tf.constant(0.1, shape=shape)
    return tf.Variable(initial)


# 卷积层
def conv2d(x, W):
    # x input tensor of shape [batch,in_height,in_width,in_channels]
    # W filter /kernel tensor of shape[filter_height,filter_width,in_channels,out_channels]
    # strides[0/3]=1,strides[1]代表x方向的步长，strides[2]y方向步长
    # padding 'SAME' 'VALID'
    return tf.nn.conv2d(x, W, strides=[1, 1, 1, 1], padding='SAME')


# 池化层
def max_pool_2x2(x):
    # ksize[1,x,y,1]
    return tf.nn.max_pool(x, ksize=[1, 2, 2, 1], strides=[1, 2, 2, 1], padding='SAME')


def train(isTrain=True,inputImage=None):
    mnist = input_data.read_data_sets('MNIST_data', one_hot=True)

    batch_size = 100
    n_batch = mnist.train.num_examples // batch_size
    n_test_batch = mnist.train.num_examples // batch_size

    x = tf.placeholder(tf.float32, [None, 784])  # 28*28
    y = tf.placeholder(tf.float32, [None, 10])

    # 改变x的格式转为4D的向量[batch,in_height,in_width,in_channels]
    x_image = tf.reshape(x, [-1, 28, 28, 1])

    # 初始化第一个卷积层的权值和偏置
    # 把x_image和权值向量进行卷积，再加上偏置值，然后应用与relu激活函数
    W_conv1 = weight_variable([5, 5, 1, 32])
    b_conv1 = bias_variable([32])
    h_vonv1 = tf.nn.relu(conv2d(x_image, W_conv1) + b_conv1)
    h_pool1 = max_pool_2x2(h_vonv1)

    # 初始化第二个卷积层的权值和偏置
    W_conv2 = weight_variable([5, 5, 32, 64])
    b_conv2 = bias_variable([64])
    h_vonv2 = tf.nn.relu(conv2d(h_pool1, W_conv2) + b_conv2)
    h_pool2 = max_pool_2x2(h_vonv2)  # 进行max-pooling

    # 28*28的图片第一次卷积后还是28*28，第一次池化后变为14*14
    # 第二次卷积后为14*14，第二次池化后变为7*7

    # 初始化第一个全连接层的权值
    # 经过上面操作后得到64张7*7的平面，输出为1024个神经元
    W_fc1 = weight_variable([7 * 7 * 64, 1024])
    b_fc1 = bias_variable([1024])
    # 把池化层2的输出扁平化为1维
    h_pool2_flat = tf.reshape(h_pool2, [-1, 7 * 7 * 64])
    # 求第一个全连接层的输出
    h_fc1 = tf.nn.relu(tf.matmul(h_pool2_flat, W_fc1) + b_fc1)

    # keep_prob用来表示神经元的输出概率
    keep_prob = tf.placeholder(tf.float32)
    h_fc1_drop = tf.nn.dropout(h_fc1, keep_prob)

    # 初始化第二个全连接层
    W_fc2 = weight_variable([1024, 10])
    b_fc2 = bias_variable([10])

    # 计算输出
    prediction = tf.nn.softmax(tf.matmul(h_fc1_drop, W_fc2) + b_fc2)
    # softmax和交叉熵一起使用
    loss = tf.reduce_mean(tf.nn.softmax_cross_entropy_with_logits(labels=y, logits=prediction))
    train_step = tf.train.GradientDescentOptimizer(0.2).minimize(loss)

    # 结果放在一个布尔列表中
    # argmax返回一维张量中最大的值所在的位置,1代表一行中的最大位置
    correct_prediction = tf.equal(tf.argmax(y, 1), tf.argmax(prediction, 1))
    # 求准确率
    accuracy = tf.reduce_mean(tf.cast(correct_prediction, tf.float32))

    # TODO: 修改计算方法
    saver = tf.train.Saver()
    with tf.Session() as sess:
        if isTrain:
            sess.run(tf.global_variables_initializer())
            for batch in range(n_batch*20):
                batch_xs, batch_ys = mnist.train.next_batch(batch_size)
                sess.run(train_step, feed_dict={x: batch_xs, y: batch_ys, keep_prob: 0.7})
                if batch % 100 == 0:
                    acc = sess.run(accuracy, feed_dict={x: batch_xs, y: batch_ys, keep_prob: 0.7})
                    print(f'batch {batch}, acc = {acc}')

            saver.save(sess, './SavedData/cnn_model')
        else:
            print("Load CheckPoint")
            checkpoint = tf.train.get_checkpoint_state('SavedData')
            if checkpoint and checkpoint.model_checkpoint_path:
                print("Begin Session")
                saver.restore(sess, checkpoint.model_checkpoint_path)
                # batch_test_xs, batch_test_ys = mnist.test.next_batch(1)
                test_output = sess.run(tf.argmax(prediction, 1),
                                       feed_dict={x: inputImage, y: -1,
                                                  keep_prob: 1.0})
                print(f"Output is {test_output}")
                return test_output

# if __name__ == '__main__':
#     #train()
#     train(False)

# def lalal():
#     # 下面的代码为修改后的结果
#     acc = 0
#     for batch in range(n_test_batch):
#         batch_test_xs, batch_test_ys = mnist.test.next_batch(batch_size)
#         acc += sess.run(accuracy, feed_dict={x: batch_test_xs, y: batch_test_ys, keep_prob: 1})
#         print("Iter " + str(epoch) + ",Testing Accuracy " + str(acc / (batch + 1)))
