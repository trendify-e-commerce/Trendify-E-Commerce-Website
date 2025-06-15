#Root Directory in System Path
import sys, os
root_path = os.path.abspath(os.path.join(os.path.dirname(__file__), '../'))
if root_path not in sys.path:
    sys.path.append(root_path)

import pymongo
from dotenv import load_dotenv
from flask import Blueprint, jsonify, request
from werkzeug.security import generate_password_hash, check_password_hash
load_dotenv()
mongo_uri = os.getenv("MONGO_URI")
if not mongo_uri: raise ValueError("MONGO_URI not set in environment variables")
mongo_client = pymongo.MongoClient(mongo_uri)
db = mongo_client["Secure-Delivery-Data"]

def initializeAPI(username=None, user_id = None, email=None, userType=None):
    print("Set User State", username, user_id)
    from backend.user_context_manager import update_user_context
    update_user_context(
        username=username,
        user_id=user_id,
        email=email,
        userType=userType
    )

login_bp = Blueprint('login', __name__)
logout_bp = Blueprint('logout', __name__)
register_bp = Blueprint('register', __name__)

@login_bp.route('/login', methods=['POST'])
def login():
    print(f"\n🟢 User initiated login request...")
    data = request.get_json()
    username = data["username"]
    userType = data["userType"]
    password = data["password"]
    if not username or not password or not userType:
        return jsonify({'error': 'Missing required fields'}), 400

    collection = db[userType]
    document = collection.find_one({"username": username})
    if document is None:
        return jsonify({"error": "User Not Found"}), 401
    elif not check_password_hash(document.get("password"), password):
        return jsonify({"error": "Password is Incorrect"}), 401
    else:
        if userType == "users" or userType == "sellers":
            initializeAPI(username, document["user_id"], document["email"], userType)
        else:initializeAPI(username, document["agent_id"], document["email"], userType)
        return jsonify({"user_id": document["user_id"],"user_email": document["email"], "username": document["username"], "phone": document["phone"], "userType": userType}), 200

@register_bp.route('/register', methods=['POST'])
def register():
    print(f"\n🟢 User initiated register request...")
    data = request.get_json()
    if not data.get("username"):
        print("Registration failed")
        return jsonify({'error': 'Registration failed or cancelled.'}), 401
    username = data["username"]
    userType = data["userType"]
    email = data["email"]
    phone = data["phone"]
    if not username or not userType:
        return jsonify({'error': 'Missing required fields'}), 400

    collection = db[userType]
    if collection.find_one({"$or": [{"username": username},{"email": email},{"phone": phone}] }) is not None:
        return jsonify({"error": "User already exists with the same username, email, or phone"}), 409
    else:
        import uuid
        data["user_id"] = str(uuid.uuid4())
        data["password"] = generate_password_hash(data["password"])
        data.pop("userType", None)
        collection.insert_one(data)
        return jsonify({"message": "Registration Successful"}), 200


@logout_bp.route('/logout', methods=['POST'])
def logout():
    import time
    initializeAPI()
    time.sleep(3)
    return jsonify({"message": "Logout Successful"}), 200