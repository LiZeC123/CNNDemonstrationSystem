import tensorflow as tf
from cnn import input_data


# http://wiki.jikexueyuan.com/project/tensorflow-zh/tutorials/mnist_pros.html

# 权重初始化的有关函数
def weight_variable(shape):
    initial = tf.truncated_normal(shape, stddev=0.1)
    return tf.Variable(initial)


def bias_variable(shape):
    initial = tf.constant(0.1, shape=shape)
    return tf.Variable(initial)


def conv2d(x, W):
    return tf.nn.conv2d(x, W, strides=[1, 1, 1, 1], padding='SAME')


def max_pool_2x2(x):
    return tf.nn.max_pool(x, ksize=[1, 2, 2, 1],
                          strides=[1, 2, 2, 1], padding='SAME')


def print_info(name, sess, value):
    print(f'{name}:\n{sess.run(value)}\n')


mnist = input_data.read_data_sets('MNIST_data', one_hot=True)
x = tf.placeholder("float", shape=[None, 784])
y_ = tf.placeholder("float", shape=[None, 10])
x_image = tf.reshape(x, [-1, 28, 28, 1])

# 卷积核的大小是5x5，产生32个特征面（也可以认为是卷积核的数量）
# 其中后两个参数分别是输入的通道数（1）和输出的通道数（32）
# 实际上W和b就是卷积的参数
W_conv1 = weight_variable([5, 5, 1, 32])
b_conv1 = bias_variable([32])

h_conv1 = tf.nn.relu(conv2d(x_image, W_conv1) + b_conv1)
h_pool1 = max_pool_2x2(h_conv1)

W_conv2 = weight_variable([5, 5, 32, 64])
b_conv2 = bias_variable([64])

h_conv2 = tf.nn.relu(conv2d(h_pool1, W_conv2) + b_conv2)
h_pool2 = max_pool_2x2(h_conv2)

W_fc1 = weight_variable([7 * 7 * 64, 1024])
b_fc1 = bias_variable([1024])

h_pool2_flat = tf.reshape(h_pool2, [-1, 7 * 7 * 64])
h_fc1 = tf.nn.relu(tf.matmul(h_pool2_flat, W_fc1) + b_fc1)

# 以一定的概率使某个神经元不参与计算，同时也不更新权值
keep_prob = tf.placeholder("float")
h_fc1_drop = tf.nn.dropout(h_fc1, keep_prob)

W_fc2 = weight_variable([1024, 10])
b_fc2 = bias_variable([10])

y_conv = tf.nn.softmax(tf.matmul(h_fc1_drop, W_fc2) + b_fc2)

sess = tf.Session()
cross_entropy = -tf.reduce_sum(y_ * tf.log(y_conv))
train_step = tf.train.AdamOptimizer(1e-4).minimize(cross_entropy)
correct_prediction = tf.equal(tf.argmax(y_conv, 1), tf.argmax(y_, 1))
accuracy = tf.reduce_mean(tf.cast(correct_prediction, "float"))

sess.run(tf.global_variables_initializer())
for i in range(400):
    batch = mnist.train.next_batch(50)
    if i % 100 == 0:
        train_accuracy = sess.run(accuracy,
                                  feed_dict={x: batch[0], y_: batch[1], keep_prob: 1.0})
        print(f'step {i}, training accuracy {train_accuracy}')
        print_info('W_conv1', sess, W_conv1)
        print_info('b_conv1', sess, b_conv1)
    sess.run(train_step, feed_dict={x: batch[0], y_: batch[1], keep_prob: 0.5})

for i in range(10):
    test_batch = mnist.test.next_batch(50)
    test_accuracy = sess.run(accuracy,
                             feed_dict={x: test_batch[0], y_: test_batch[1], keep_prob: 1.0})
    print(f'test accuracy{test_accuracy}')

sess.close()

# 关于是否一次性加载数据集的分析,以及对于当前代码更为细致的注解
# https://www.jianshu.com/p/817ea446b9b9

# 关于梯度下降的一些分析
# https://blog.csdn.net/xierhacker/article/details/53174558

# 关于正则化
# https://blog.csdn.net/u012560212/article/details/73000740
