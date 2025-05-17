#Root Directory in System Path
import sys, os
root_path = os.path.abspath(os.path.join(os.path.dirname(__file__), '../'))
if root_path not in sys.path:
    sys.path.append(root_path)

import subprocess
import json, base64

def encrypt_text(plaintext):
    exe_path = os.path.join(root_path, "dependencies", "AES_Implementation", "build", "encrypt.exe")
    try:
        proc = subprocess.Popen(
            [exe_path],
            stdin=subprocess.PIPE,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True
        )
    except Exception:
        raise RuntimeError("AES is not built in dependencies. Run CMake first.")
    stdout, stderr = proc.communicate(input=plaintext)
    if proc.returncode != 0: raise RuntimeError(f"Encryption failed: {stderr}")
    hex_str = stdout.strip()
    byte_values = list(bytes.fromhex(hex_str))
    return byte_values

def decrypt_bytes(byte_values):
    hex_str = ''.join(f'{b:02X}' for b in byte_values)
    dec_path = os.path.join(
        root_path, "dependencies", "AES_Implementation",
        "build", "decrypt.exe"
    )
    try:
        proc = subprocess.Popen(
            [dec_path],
            stdin=subprocess.PIPE,
            stdout=subprocess.PIPE,
            stderr=subprocess.PIPE,
            text=True
        )
    except Exception:
        raise RuntimeError("AES is not built in dependencies. Run CMake first.")
    stdout, stderr = proc.communicate(input=hex_str + '\n')
    if proc.returncode != 0:
        raise RuntimeError(f"Decryption failed: {stderr}")
    return stdout.rstrip('\n')

def encrypt_dict(data: dict) -> dict:
    json_str = json.dumps(data, separators=(',', ':'))
    cipher_bytes = encrypt_text(json_str)
    b64_cipher   = base64.b64encode(bytes(cipher_bytes)).decode('ascii')
    return {"ciphertext": b64_cipher}

def decrypt_dict(payload: dict) -> dict:
    cipher_bytes = list(base64.b64decode(payload["ciphertext"]))
    json_str     = decrypt_bytes(cipher_bytes)
    return json.loads(json_str)