import base64
import io
import json
import numpy as np
from PIL import Image


def toList(base64_image: str) -> np.ndarray:
    image = base64.b64decode(base64_image.split(',')[1])
    byte_stream = io.BytesIO(image)
    i = Image.open(byte_stream)
    i_grey = i.convert('L').resize((28, 28), Image.ANTIALIAS)
    array = np.array(i_grey).reshape(1, 784)
    return array


def toString(base64_image: str) -> str:
    array = toList(base64_image).reshape(784).tolist()
    result = {"data": array}
    return json.dumps(result)
