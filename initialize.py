import getopt
import sys


def usage():
    print("initialize.py 脚本用于初始化项目的参数")
    print("指令格式 initialize.py <指令>")
    print("指令列表")
    print("-i --ip    指定服务器的IP地址，默认为localhost")
    print("-p --port  指定服务器的端口，默认为5000")
    print("-n --num   指定服务器的最大用户数量，默认为1")


def genConfig(ip, port, num):
    jsConfigStr = f"""
// initialize.py自动生成的JS配置
const config = {{
    baseURL: 'http://{ip}:{port}',
}};
    """
    print(jsConfigStr)
    with open("static/js/config/config.js", "w", encoding='utf8') as f:
        f.write(jsConfigStr)

    pythonConfigStr = f"""
class Config:
    DEBUG = False
    HOST = "{ip}"
    PORT = {port}
"""
    print(pythonConfigStr)
    with open("config.py", "w", encoding="utf8") as f:
        f.write(pythonConfigStr)


def main():
    try:
        options, args = getopt.getopt(
            sys.argv[1:],
            "hp:i:n:",
            ["help", "ip=", "port=", "num="])
    except getopt.GetoptError:
        sys.exit()

    ip = "localhost"
    port = "5000"
    num = "1"
    for name, value in options:
        if name in ("-h", "--help"):
            usage()
        if name in ("-i", "--ip"):
            ip = value
        if name in ("-p", "--port"):
            port = value
        if name in ("-n", "--num"):
            num = value

    genConfig(ip, port, num)


if __name__ == '__main__':
    main()
