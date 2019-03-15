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


@app.route('/inputImage', methods=['POST'])
def getInputImage():
    return json.dumps(calculator.calcInputImage())


@app.route('/conv1', methods=['POST'])
def getConv1():
    return json.dumps(calculator.calcConv1())


@app.route('/conv2', methods=['POST'])
def getConv2():
    return json.dumps(calculator.calcConv2())


@app.route('/fc1', methods=['POST'])
def getFc1():
    return json.dumps(calculator.calcFullConnect1())


@app.route('/fc2', methods=['POST'])
def getFc2():
    return json.dumps(calculator.calcFullConnect2())


@app.route('/prediction', methods=['POST'])
def getPrediction():
    return json.dumps(calculator.calcResult())


@app.route('/getMnistImage', methods=['POST'])
def getImage():
    return json.dumps(mnistHelper.getImage())


if __name__ == '__main__':
    app.run()
