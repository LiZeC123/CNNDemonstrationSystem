from flask import Flask, render_template, request
import json
from cnn.recognition import predict
from image2List import toList, toString

app = Flask(__name__)


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
        array = toList(request.form['image']).tolist()
        pred = predict(toList(request.form['image']))
        result = {"predict": pred, "data": array}
        return json.dumps(result)
    return json.dumps({"predict": -1, "data": "None"})


if __name__ == '__main__':
    app.run()
