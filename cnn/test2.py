import tensorflow as tf
import numpy as np
import input_data

# such as official/mnist/dataset.py from tensorflow/models.
# def make_one_hot(data1):
#     return (np.arange(10) == data1[:, None]).astype(np.integer)
#
#
# def get_mnist_batch():
#     mnist = tf.keras.datasets.mnist
#     (x_train, y_train), (x_test, y_test) = mnist.load_data()
#     length = x_train.shape[0]
#     i = 0
#     while i < length:
#         # x = [x_train[idx].reshape(1, -1) for idx in range(i, i + 50)]
#         x_data = x_train[i:i + 50].reshape(50, 784)
#         y_data = make_one_hot(y_train[i: i + 50]).reshape(50, 10)
#         yield (x_data, y_data)
#         i = i + 50


mnist = input_data.read_data_sets("MNIST_data/", one_hot=True)

# 创建占位符
# 其中x的第二个维度是784，第一个维度不确定
x = tf.placeholder("float", shape=[None, 784])
y_ = tf.placeholder("float", shape=[None, 10])

# 创建变量
W = tf.Variable(tf.zeros([784, 10]))
b = tf.Variable(tf.ones([10]))

y = tf.nn.softmax(tf.matmul(x, W) + b)
cross_entropy = -tf.reduce_sum(y_ * tf.log(y))
train_step = tf.train.GradientDescentOptimizer(0.01).minimize(cross_entropy)

sess = tf.Session()
sess.run(tf.global_variables_initializer())

for i in range(1000):
    batch_xs, batch_ys = mnist.train.next_batch(100)
    sess.run(train_step, feed_dict={x: batch_xs, y_: batch_ys})
    print(f'b:\n{sess.run(b)}\n')
    # print(f'x:\n{batch[0]}\n')
    # print(f'y:\n{batch[1]}\n')

sess.close()
