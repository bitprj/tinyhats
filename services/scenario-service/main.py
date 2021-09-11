from flask import Flask
import requests

app = Flask(__name__)

@app.route("/scenario1", methods=['GET'])
def index() -> str:
    response = requests.post("http://locust-service-1:8089/swarm", {"locust_count":10, "hatch_rate":1})
    print(response.content)

@app.route("/scenario2", methods=['GET'])
def index() -> str:
    response = requests.post("http://locust-service-2:8089/swarm", {"locust_count":10, "hatch_rate":1})
    print(response.content)

@app.route("/scenario3", methods=['GET'])
def index() -> str:
    response = requests.post("http://locust-service-3:8089/swarm", {"locust_count":10, "hatch_rate":1})
    print(response.content)

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=8080)