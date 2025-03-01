from flask import Flask, render_template, request
from database import give_order_info
from encryption import decrypt_data

app = Flask(__name__, template_folder="../frontend")

@app.route("/")
def home():
    return render_template("index.html", order_data=None, qr_code=None, decrypted_data=None, error=None)

@app.route("/order", methods=["GET", "POST"])
def order_details():
    order_id = request.form.get("order_id") if request.method == "POST" else request.args.get("order_id")
    if not order_id:
        return render_template("index.html", order_data=None, qr_code=None, error="Order ID is required.")
    order_data, qr_code = give_order_info(order_id)
    if not order_data:
        return render_template("index.html", order_data=None, qr_code=None, error="Order not found.")
    return render_template("index.html", order_data=order_data, qr_code=qr_code, decrypted_data=None, error=None)

@app.route("/scan_qr", methods=["POST"])
def scan_qr():
    qr_data = request.form.get("qr_data")
    if not qr_data:
        return render_template("index.html", error="Invalid QR scan.")
    try:
        decrypted_data = decrypt_data(qr_data)
    except Exception as e:
        return render_template("index.html", error=f"QR decryption failed: {str(e)}")
    return render_template("index.html", order_data=None, qr_code=None, decrypted_data=decrypted_data, error=None)

if __name__ == "__main__":
    app.run(debug=True)