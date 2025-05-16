#Root Directory in System Path
import sys, os
from xmlrpc.client import DateTime

root_path = os.path.abspath(os.path.join(os.path.dirname(__file__), '../'))
if root_path not in sys.path:
    sys.path.append(root_path)

import pymongo
from random import randint
from dotenv import load_dotenv
from datetime import date, timedelta
from flask import Blueprint, jsonify, request
load_dotenv()
mongo_uri = os.getenv("MONGO_URI")
if not mongo_uri: raise ValueError("MONGO_URI not set in environment variables")
mongo_client = pymongo.MongoClient(mongo_uri)
db = mongo_client["Secure-Delivery-Data"]
collection = db["orders"]
collectionU = db["users"]
collectionA = db["agent"]

order_bp = Blueprint('order', __name__)

@order_bp.route('/order', methods=['POST'])
def login():
    print(f"\n🟢 User initiated order request...")
    data = request.get_json()
    print(data)
    result = {"total_amount": data["total"]}
    result["order_date"] = date.today()
    result["delivery_date"] = future_date = result["order_date"] + timedelta(days=randint(1, 15))
    cart = data[1]
    total = data[2]
    return jsonify({'error': 'Missing required fields'}), 400