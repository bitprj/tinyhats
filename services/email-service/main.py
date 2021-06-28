from flask import Flask, jsonify, request
import requests

app = Flask(__name__)

def sendEmail(email, body):
	request = requests.post(
		"https://api.mailgun.net/v3/sandbox74ce6eb65f0840ca82d948300acd5fb8.mailgun.org/messages",
		auth=("api", MAILGUN_API_KEY),
		data={"from": "Mailgun Sandbox <postmaster@sandbox74ce6eb65f0840ca82d948300acd5fb8.mailgun.org>",
			"to": email,
			"subject": "UWUaaS Moderation Request",
			"html": body})

	print('Status: {0}'.format(request.status_code))
	print('Body:   {0}'.format(request.text))


@app.route("/send", methods=['POST'])
def index() -> str:
    email = request.json.get("send")
    body = request.json.get("html")
    sendEmail(email, body)
    return jsonify({"message": "Email was sent to " + email + " with a message of " + body})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=80)