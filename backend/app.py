from flask import Flask, request, jsonify
from flask_cors import CORS
from database import get_db_connection, init_db
from models import Event

app = Flask(__name__)
CORS(app)

# Initialize database on startup
init_db()

@app.route('/api/events', methods=['GET'])
def get_all_events():
    conn = get_db_connection()
    # Sort by date upcoming first (ascending)
    rows = conn.execute('SELECT * FROM events ORDER BY date ASC, time ASC').fetchall()
    conn.close()
    events = [Event.from_row(row) for row in rows]
    return jsonify(events)

@app.route('/api/events/<int:event_id>', methods=['GET'])
def get_event(event_id):
    conn = get_db_connection()
    row = conn.execute('SELECT * FROM events WHERE id = ?', (event_id,)).fetchone()
    conn.close()
    if row is None:
        return jsonify({"error": "Event not found"}), 404
    return jsonify(Event.from_row(row))

@app.route('/api/events', methods=['POST'])
def create_event():
    data = request.json
    title = data.get('title')
    description = data.get('description')
    date = data.get('date')
    time = data.get('time')
    location = data.get('location')
    category = data.get('category')

    if not title or not date or not time:
        return jsonify({"error": "Title, date, and time are required"}), 400

    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute('''
        INSERT INTO events (title, description, date, time, location, category)
        VALUES (?, ?, ?, ?, ?, ?)
    ''', (title, description, date, time, location, category))
    conn.commit()
    new_id = cur.lastrowid
    conn.close()

    return jsonify({"id": new_id, "message": "Event created successfully"}), 201

@app.route('/api/events/<int:event_id>', methods=['PUT'])
def update_event(event_id):
    data = request.json
    title = data.get('title')
    description = data.get('description')
    date = data.get('date')
    time = data.get('time')
    location = data.get('location')
    category = data.get('category')

    conn = get_db_connection()
    cur = conn.cursor()
    cur.execute('''
        UPDATE events
        SET title = ?, description = ?, date = ?, time = ?, location = ?, category = ?
        WHERE id = ?
    ''', (title, description, date, time, location, category, event_id))
    conn.commit()
    conn.close()

    return jsonify({"message": "Event updated successfully"})

@app.route('/api/events/<int:event_id>', methods=['DELETE'])
def delete_event(event_id):
    conn = get_db_connection()
    conn.execute('DELETE FROM events WHERE id = ?', (event_id,))
    conn.commit()
    conn.close()
    return jsonify({"message": "Event deleted successfully"})

if __name__ == '__main__':
    app.run(debug=True, port=5000)
