import getopt
import sys


def usage():
    print("initialize.py 脚本用于初始化项目的参数")
    print("指令格式 initialize.py <指令>")
    print("指令列表")
    print("-i --ip    指定服务器的IP地址，默认为localhost")
    print("-p --port  指定服务器的端口，默认为5000")
    print("-n --num   指定服务器的最大用户数量，默认为1")
    print("--no-pre   关闭训练动画预加载")
    print("--thread   启用多线程模式")


def genConfig(config):
    jsConfigStr = f"""// initialize.py自动生成的JavaScript配置
const config = {{
    "baseURL": 'http://{config["ip"]}:{config["port"]}',
    "noPre": {"true" if config["no-pre"] else "false"},
}};
    """
    # print(jsConfigStr)
    with open("static/js/config/config.js", "w", encoding='utf8') as f:
        f.write(jsConfigStr)

    pythonConfigStr = f"""# initialize.py自动生成的Python配置
class Config:
    DEBUG = False
    HOST = "{config["ip"]}"
    PORT = {config["port"]}
    NUM = {config["num"]}
    THREAD = {config["thread"]}
"""
    # print(pythonConfigStr)
    with open("config.py", "w", encoding="utf8") as f:
        f.write(pythonConfigStr)


def main():
    try:
        options, args = getopt.getopt(
            sys.argv[1:],
            "hp:i:n:",
            ["help", "ip=", "port=", "num=", "no-pre", "thread"])
    except getopt.GetoptError:
        sys.exit()

    config = {
        "ip": "localhost",
        "port": "5000",
        "num": "1",
        "no-pre": False,
        "thread": False
    }
    for name, value in options:
        if name in ("-h", "--help"):
            usage()
            return
        if name in ("-i", "--ip"):
            config["ip"] = value
        if name in ("-p", "--port"):
            config["port"] = value
        if name in ("-n", "--num"):
            config["num"] = value
        if name == "--no-pre":
            config["no-pre"] = True
        if name == "--thread":
            config["thread"] = True

    genConfig(config)


if __name__ == '__main__':
    main()
