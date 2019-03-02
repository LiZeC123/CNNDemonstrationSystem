import numpy as np
import tensorflow as tf


class Predict:
    def __init__(self):
        self.sess = tf.Session()

    def close(self):
        self.sess.close()

    def predict(self, inputImage: np.ndarray, path: str) -> int:
        with tf.Session() as sess:
            saver = tf.train.import_meta_graph(path + '/cnn_model.meta')
            saver.restore(sess, tf.train.latest_checkpoint(path))

            graph = tf.get_default_graph()
            x = graph.get_tensor_by_name("x:0")
            y = graph.get_tensor_by_name("y:0")
            keep_prob = graph.get_tensor_by_name("keep_prob:0")
            prediction = graph.get_tensor_by_name("prediction:0")
            feed_dict = {x: inputImage, y: [[0., 0., 1., 0., 0., 0., 0., 0., 0., 0.]], keep_prob: 1.0}
            output = sess.run(tf.argmax(prediction, 1), feed_dict=feed_dict)
            return int(output[0])
