import json


def round_floats(o):
    """将浮点数舍入为指定的位数，从而转换为JSON后，减少占用空间，提高加载速度"""
    if isinstance(o, float):
        return round(o, 5)
    if isinstance(o, dict):
        return {k: round_floats(v) for k, v in o.items()}
    if isinstance(o, (list, tuple)):
        return [round_floats(x) for x in o]
    return o


class JsonWriter:
    def __init__(self, filename):
        self.f = open(filename, "w")
        self.f.write("[\n")
        self.__writeCount = 0

    def write(self, data: dict):
        if self.__writeCount != 0:
            # 注意：JSON不支持list包含多余的逗号，因此在需要的时候才写入逗号
            self.f.write(",\n")
        self.f.write(json.dumps(round_floats(data)))
        self.__writeCount = self.__writeCount + 1

    def close(self):
        self.f.writelines("\n]")
        self.f.close()


if __name__ == '__main__':
    writer = JsonWriter("../static/local/test.json")
    for i in range(10):
        d = {
            "name": "Json",
            "index": i ** i * 0.2323132798472
        }
        writer.write(d)

    writer.close()
