import json

from flask import Flask, render_template, request

from cnn.calculator import Calculator
from image2List import toList

app = Flask(__name__)
# pred = Predict()
calculator = Calculator('cnn/SavedData')


@app.route('/')
def hello_world():
    return render_template('index.html')


@app.route('/hello', methods=['POST'])
def hello():
    print(request.form)
    return 'Hello'


@app.route('/online', methods=['GET'])
def isOnline():
    return "Hello From Server"


#
# @app.route('/recognition', methods=['POST'])
# def recognition():
#     print(request.form)
#     if 'image' in request.form:
#         array = toList(request.form['image']).reshape(784).tolist()
#         predResult = pred.predict(toList(request.form['image']), 'cnn/SavedData')
#         result = {"predict": predResult, "data": array}
#         return json.dumps(result)
#     return json.dumps({"predict": -1, "data": "None"})


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


@app.route('/getAll', methods=['POST'])
def getAll():
    data = {
        'conv1': calculator.calcConv1(),
        'conv2': calculator.calcConv2(),
        'fc1': calculator.calcFullConnect1(),
        'fc2': calculator.calcFullConnect2()
    }
    data.update(calculator.calcInputImage())
    data.update(calculator.calcResult())
    return json.dumps(data)


if __name__ == '__main__':
    app.run()
