from cnn.trainCNN import train
import numpy as np


def predict(image: np.ndarray) -> int:
    print("Begin predict:")
    return train(False, image)
