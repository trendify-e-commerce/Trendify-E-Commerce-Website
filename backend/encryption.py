from Crypto.Cipher import AES
import base64
import os

SECRET_KEY = os.urandom(16)  # Generate a random 16-byte key

def encrypt_data(data):
    cipher = AES.new(SECRET_KEY, AES.MODE_EAX)  # Create AES encryption object
    ciphertext, tag = cipher.encrypt_and_digest(data.encode())  # Encrypt data
    return base64.b64encode(cipher.nonce + tag + ciphertext).decode()

def decrypt_data(encrypted_data):
    raw = base64.b64decode(encrypted_data)
    nonce, tag, ciphertext = raw[:16], raw[16:32], raw[32:]
    cipher = AES.new(SECRET_KEY, AES.MODE_EAX, nonce=nonce)
    return cipher.decrypt_and_verify(ciphertext, tag).decode()