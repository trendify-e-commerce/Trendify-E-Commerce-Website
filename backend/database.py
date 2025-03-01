import sqlite3

def init_db():
    conn = sqlite3.connect("data.db")
    c = conn.cursor()
    c.execute('''CREATE TABLE IF NOT EXISTS logs (id INTEGER PRIMARY KEY, agent TEXT, timestamp TEXT)''')
    conn.commit()
    conn.close()

def log_access(agent, timestamp):
    conn = sqlite3.connect("data.db")
    c = conn.cursor()
    c.execute("INSERT INTO logs (agent, timestamp) VALUES (?, ?)", (agent, timestamp))
    conn.commit()
    conn.close()

init_db()