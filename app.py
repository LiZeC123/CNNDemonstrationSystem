import json

from flask import Flask, render_template, request

from cnn.calculator import Calculator
from cnn.mnistHelper import MnistHelper
from cnn.trainer import StepTrainer
from util.image2List import toList

app = Flask(__name__)
calculator = Calculator('cnn/SavedData')
stepTrainer = StepTrainer('cnn/SemiData')
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


@app.route('/uploadTrain', methods=['POST'])
def uploadTrainImage():
    stepTrainer.setInputImage(toList(request.form['image']), int(request.form['number']))
    data = {
        "first": stepTrainer.first,
        "gradient": stepTrainer.gradient,
        "second": stepTrainer.second,
    }
    data.update(stepTrainer.calcInputImage())
    # print(data["gradient"])
    return json.dumps(data)


if __name__ == '__main__':
    app.run()
