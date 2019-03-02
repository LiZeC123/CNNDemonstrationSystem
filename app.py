import json

from flask import Flask, render_template, request

from cnn.predict import Predict
from image2List import toList

app = Flask(__name__)
pred = Predict()


@app.route('/')
def hello_world():
    return render_template('index.html')


@app.route('/hello', methods=['POST'])
def hello():
    print(request.form)
    return 'Hello'


@app.route('/recognition', methods=['POST'])
def recognition():
    print(request.form)
    if 'image' in request.form:
        array = toList(request.form['image']).reshape(784).tolist()
        predResult = pred.predict(toList(request.form['image']), 'cnn/SavedData')
        result = {"predict": predResult, "data": array}
        return json.dumps(result)
    return json.dumps({"predict": -1, "data": "None"})


if __name__ == '__main__':
    app.run()
