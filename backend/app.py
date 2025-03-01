from flask import Flask, request, jsonify
from encryption import encrypt_data, decrypt_data
import qrcode
import database
import logs

app = Flask(__name__)

@app.route('/generate_qr', methods=['POST'])
def generate_qr():
    data = request.json  # Get JSON data from request
    encrypted_data = encrypt_data(data)  # Encrypt the customer info
    qr = qrcode.make(encrypted_data)  # Generate QR code
    qr.save(f"static/{data['id']}.png")  # Save QR code as image
    return jsonify({"message": "QR code generated", "qr_path": f"static/{data['id']}.png"})

if __name__ == '__main__':
    app.run(debug=True)