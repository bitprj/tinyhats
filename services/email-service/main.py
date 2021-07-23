from flask import Flask, jsonify, request
import json
import smtplib, ssl
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

app = Flask(__name__)

def sendEmail(receiver_email, body):
    sender_email = ""
    password = ""

    message = MIMEMultipart("alternative")
    message["Subject"] = "UWUaaS Moderation Request"
    message["From"] = sender_email
    message["To"] = receiver_email

    # convert html into mimetext format
    emailContent = MIMEText(body, "html")
    message.attach(emailContent)

    # Create secure connection with server and send email
    context = ssl.create_default_context()
    with smtplib.SMTP_SSL("smtp.gmail.com", 465, context=context) as server:
        server.login(sender_email, password)
        server.sendmail(
        sender_email, receiver_email, message.as_string()
    )


@app.route("/email", methods=['POST'])
def index() -> str:
    email = request.args.get("send")
    body = request.get_data().decode()
    sendEmail(email, body)
    return jsonify({"message": "Email was sent to " + email + " with a message of " + body})

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=80)