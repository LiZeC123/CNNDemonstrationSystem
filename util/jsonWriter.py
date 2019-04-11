import json


class JsonWriter:
    def __init__(self, filename):
        self.f = open(filename, "w")
        self.f.write("[\n")
        self.__writeCount = 0

    def write(self, data: dict):
        if self.__writeCount != 0:
            # 注意：JSON不支持list包含多余的逗号，因此在需要的时候才写入逗号
            self.f.write(",\n")
        self.f.write(json.dumps(data))
        self.__writeCount = self.__writeCount + 1

    def close(self):
        self.f.writelines("\n]")
        self.f.close()


if __name__ == '__main__':
    writer = JsonWriter("../static/local/test.json")
    for i in range(10):
        d = {
            "name": "Json",
            "index": i ** i
        }
        writer.write(d)

    writer.close()
