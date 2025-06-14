#Root Directory in System Path
import sys, os
root_path = os.path.abspath(os.path.join(os.path.dirname(__file__), '../'))
if root_path not in sys.path:
    sys.path.append(root_path)

import random, sendgrid
from twilio.rest import Client
from sendgrid.helpers.mail import Mail
from flask import Blueprint, jsonify, request
otp_bp = Blueprint('otp', __name__)

def generate_otp():
    return str(random.randint(100000, 999999))

def send_sms(phone, message):
    twilio_sid = os.getenv("TWILIO_ACCOUNT_SID")
    twilio_token = os.getenv("TWILIO_AUTH_TOKEN")
    twilio_phone = os.getenv("TWILIO_PHONE_NUMBER")
    client = Client(twilio_sid, twilio_token)
    try:
        message = client.messages.create(
            body=message,
            from_=twilio_phone,
            to=phone
        )
        print("SMS sent successfully. SID:", message.sid)
        return True
    except Exception as e:
        print("Failed to send SMS:", str(e))
        return False

def send_email(receiver_email, otp):
    SENDGRID_API_KEY = os.getenv("SENDGRID_API_KEY")
    sg = sendgrid.SendGridAPIClient(api_key=SENDGRID_API_KEY)
    html_content = f"""
    <html>
        <body>
            <h3>Welcome to हुनरBazaar 👋</h3>
            <p>Your One-Time Password (OTP) is: <strong>{otp}</strong></p>
            <p>Please do not share this OTP with anyone. Valid for 1 minute.</p>
        </body>
    </html>
    """
    message = Mail(
        from_email='tanujbhatt8279@gmail.com',
        to_emails=receiver_email,
        subject="हुनरBazaar OTP Verification",
        html_content=html_content
    )
    try:
        response = sg.send(message)
        print("Email sent. Status:", response.status_code)
        return response.status_code == 202
    except Exception as e:
        print("Failed to send email:", str(e))
        return False

@otp_bp.route('/send-email-otp', methods=['POST'])
def send_email_otp():
    data = request.json
    email = data.get('email')
    if not email: return jsonify({"message": "Email is required."}), 400
    otp = generate_otp()
    if send_email(email, otp): return jsonify({"message": "OTP sent to email", "otp": otp}), 200
    else: return jsonify({"message": "Failed to send email OTP."}), 500

@otp_bp.route('/send-sms-otp', methods=['POST'])
def send_sms_otp():
    data = request.json
    phone = data.get('country_code', '') + data.get('phone', '')
    if not phone: return jsonify({"message": "Phone number is required."}), 400
    otp = generate_otp()
    if send_sms(phone, f"हुनरBazaar: Your OTP is {otp}. Do not share this code with anyone. Valid for 1 minute."):
        print("OTP generated and SMS sent.")
        return jsonify({"otp": otp}), 200
    else: return jsonify({"message": "OTP sending error via SMS."}), 500