#Root Directory in System Path
import sys, os
root_path = os.path.abspath(os.path.join(os.path.dirname(__file__), '../'))
if root_path not in sys.path:
    sys.path.append(root_path)

import pymongo
from uuid import uuid4
from dotenv import load_dotenv
from random import randint, choice
from datetime import date, timedelta, datetime
from flask import Blueprint, jsonify, request
from backend.Encryption import encrypt_dict, decrypt_dict
from backend.user_context_manager import load_user_context
load_dotenv()
mongo_uri = os.getenv("MONGO_URI")
if not mongo_uri: raise ValueError("MONGO_URI not set in environment variables")
mongo_client = pymongo.MongoClient(mongo_uri)
db = mongo_client["Secure-Delivery-Data"]
collection = db["orders"]

order_bp = Blueprint('order', __name__)

def populateAgents():
    collectionA = db["agents"]
    agent_ids = [agent['agent_id'] for agent in collectionA.find({}, {'agent_id': 1})]
    return agent_ids

def generate_numeric_otp(length=6):
    return ''.join([str(randint(0, 9)) for _ in range(length)])

@order_bp.route('/order', methods=['POST'])
def order():
    print(f"\n🟢 User initiated order request...")
    data = request.get_json()
    try:
        result = {"total_amount": data["total"], "order_date": date.today()}
        result["delivery_date"] = result["order_date"] + timedelta(days=randint(1, 15))
        result["order_date"] = datetime.combine(result["order_date"], datetime.min.time())
        result["delivery_date"] = datetime.combine(result["delivery_date"], datetime.min.time())
        result["order_id"] = str(uuid4())
        order_id = result["order_id"]
        result["user_id"] = load_user_context()["user_id"]
        agent_ids = populateAgents()
        if not agent_ids:
            return jsonify({"message": "No agents available"}), 503
        result["agent_id"] = agent_ids[randint(0, len(agent_ids) - 1)]
        result["status"] = choice(["Shipped", "Processing", "Out for Delivery"])
        result["payment_status"] = choice(["Paid", "Cash On Delivery"])
        encrypted_data = {"cart": data["cart"], "special_instructions": data["special_instructions"], "agent_notes": data["agent_notes"], "username": data["name"], "user_email": data["email"], "phone": data["phone"]}
        encrypted_data["OTP"] = generate_numeric_otp()
        encrypted_data["return_policy"] = str(randint(3, 30)) + " days return policy"
        encrypted_data["transaction_id"] = str(uuid4()) if result["payment_status"] == "Paid" else ""
    except Exception as e:
        return jsonify({"message": "Missing Fields", "error": str(e)}), 400
    try:
        print("Starting the encryption process...")
        cipher_payload = encrypt_dict(encrypted_data)
        result["qr-sensitive-data"] = cipher_payload
        collection.insert_one(result)
        print("Pushed data to the MongoDB Database...")
    except Exception as e:
        return jsonify({"message": "AES Implementation Failed", "error": str(e)}), 500
    return jsonify({"total_amount": result["total_amount"], "delivery_date": result["delivery_date"], "items": len(data["cart"]), "order_id": order_id}), 200