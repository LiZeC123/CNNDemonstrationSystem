import tensorflow as tf
from tensorflow.examples.tutorials.mnist import input_data

from cnn.common import buildNetwork


def train(savePath='./SavedData/cnn_model', times=30):
    mnist = input_data.read_data_sets('MNIST_data', one_hot=True)

    batch_size = 100
    n_batch = mnist.train.num_examples // batch_size
    # n_test_batch = mnist.test.num_examples // batch_size
    x = tf.placeholder(tf.float32, [None, 784], name='x')  # 28*28
    y = tf.placeholder(tf.float32, [None, 10], name='y')
    keep_prob = tf.placeholder(tf.float32, name='keep_prob')

    train_step, prediction, accuracy = buildNetwork(x, y, keep_prob)

    saver = tf.train.Saver()
    with tf.Session() as sess:
        sess.run(tf.global_variables_initializer())
        for batch in range(1, n_batch * times + 1):
            batch_xs, batch_ys = mnist.train.next_batch(batch_size)
            sess.run(train_step, feed_dict={x: batch_xs, y: batch_ys, keep_prob: 0.7})
            if batch % 100 == 0:
                acc = sess.run(accuracy, feed_dict={x: batch_xs, y: batch_ys, keep_prob: 0.7})
                print(f'batch: {batch:6}, (Total progress: {batch / (n_batch * times) * 100:.2f}%), '
                      f'Current correct rate: {acc:.2f}')
        saver.save(sess, savePath)

        print("===== Begin Test ====")
        for i in range(3):
            acc_sum = 0
            for batch in range(i * 33 + 1, (i + 1) * 33 + 1):
                batch_test_xs, batch_test_ys = mnist.test.next_batch(batch_size)
                acc = sess.run(accuracy, feed_dict={x: batch_test_xs, y: batch_test_ys, keep_prob: 1})
                print(f'batch: {batch:6}, Current correct rate: {acc:.2f}')
                acc_sum = acc_sum + acc
            print(f"Average correct rate: {acc_sum / 33:.4f}")


if __name__ == '__main__':
    op = 'train'
    if op == 'train':
        train()
    elif op == 'Semi':
        # 创建一个显欠拟合的网络，用于进一步的训练
        # 训练次数为0，则直接跳过训练过程，只用初始值
        train('./SemiData/cnn_model', 0)
    else:
        print("Op is not a correct option")
