from flask import Flask, jsonify

app = Flask(__name__)


@app.route("/send", methods=['POST'])
def index() -> str:
    # transform a dict into an application/json response 
    return jsonify({"message": "It Works"})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=80) 