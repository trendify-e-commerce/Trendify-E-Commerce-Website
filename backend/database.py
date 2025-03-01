import pymongo
from encryption import encrypt_data, generate_qr

mongo_client = pymongo.MongoClient("mongodb://localhost:27017/")
db = mongo_client["Secure-Delivery-Data"]
orders = db["orders"]
users = db["users"]
agents = db["agents"]

def give_order_info(order_id):
    fields = ["order_id", "user_id", "agent_id", "order_date", "delivery_date", "status", "total_price", "payment_status", "items"]
    projection = {field: 1 for field in fields}
    projection["_id"] = 0
    display_data = orders.find_one({"order_id": order_id}, projection)
    qr_data = orders.find_one({"order_id": order_id}, {"qr_sensitive_data": 1, "_id": 0}) or {}

    if not display_data: return None, None
    user_id = display_data["user_id"]
    display_data.pop("user_id", None)
    agent_id = display_data["agent_id"]
    display_data.pop("agent_id", None)

    user_data = users.find_one({"user_id": user_id}, {"name": 1, "phone": 1, "address": 1, "_id": 0}) or {}
    user_data = {
        "user_name": user_data.get("name", "Unknown"),
        "user_phone": user_data.get("phone", "Unknown"),
        "user_address": user_data.get("address", "Unknown")
    }
    agent_data = agents.find_one({"agent_id": agent_id}, {"name": 1, "phone": 1, "_id": 0}) or {}
    agent_data = {
        "agent_name": agent_data.get("name", "Unknown"),
        "agent_phone": agent_data.get("phone", "Unknown")
    }
    qr_data.update(user_data)
    qr_data.update(agent_data)

    encrypted_qr_data = encrypt_data(str(qr_data))
    qr_code_base64 = generate_qr(encrypted_qr_data)

    return display_data, qr_code_base64