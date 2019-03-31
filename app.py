import json

from flask import Flask, render_template, request

from cnn.calculator import Calculator
from cnn.mnistHelper import MnistHelper
from image2List import toList

app = Flask(__name__)
calculator = Calculator('cnn/SavedData')
mnistHelper = MnistHelper()


@app.route('/')
def index():
    return render_template('index.html')


@app.route('/online', methods=['GET'])
def isOnline():
    return "Hello From Server"


@app.route('/upload', methods=['POST'])
def uploadImage():
    calculator.setInputImage(toList(request.form['image']))
    data = {
        'conv1': calculator.calcConv1(),
        'conv2': calculator.calcConv2(),
        'fc1': calculator.calcFullConnect1(),
        'fc2': calculator.calcFullConnect2()
    }
    data.update(calculator.calcInputImage())
    data.update(calculator.calcResult())
    return json.dumps(data)
    # return json.dumps({'status': 'OK'})


# 获得MNIST的图片
@app.route('/getMnistImage', methods=['POST'])
def getImage():
    return json.dumps(mnistHelper.getImage())


@app.route('/uploadTrainImage', methods=['POST'])
def uploadTrainImage():
    pass


if __name__ == '__main__':
    app.run()
