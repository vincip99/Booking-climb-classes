from flask import Flask, request, jsonify
from flask_cors import CORS
from pymongo import MongoClient
import logging

app = Flask(__name__)
CORS(app)

# Configure logging
logging.basicConfig(level=logging.INFO)

# Connect to MongoDB
client = MongoClient('mongodb://localhost:27017/')
db = client['climbing_booking']
users_collection = db['users']
bookings_collection = db['bookings']

# Define the classes dictionary globally
classes = {
    'beginner': ['Monday 10:00 AM', 'Wednesday 2:00 PM', 'Friday 4:00 PM'],
    'intermediate': ['Tuesday 11:00 AM', 'Thursday 3:00 PM', 'Saturday 1:00 PM'],
    'advanced': ['Monday 1:00 PM', 'Wednesday 5:00 PM', 'Friday 6:00 PM']
}

@app.route('/')
def home():
    return "Server is running!"

@app.route('/check-user', methods=['POST'])
def check_user():
    try:
        data = request.json
        name = data.get('name')
        surname = data.get('surname')

        if not name or not surname:
            return jsonify({'success': False, 'message': 'Name and surname are required'}), 400

        user = users_collection.find_one({'name': name, 'surname': surname})
        if user:
            logging.info(f"User found: {name} {surname}")
            return jsonify({'success': True, 'message': 'User found'})
        else:
            logging.info(f"User not found: {name} {surname}")
            return jsonify({'success': False, 'message': 'User not found'})
    except Exception as e:
        logging.error(f"Error checking user: {e}")
        return jsonify({'success': False, 'message': 'An error occurred'}), 500

@app.route('/update-classes', methods=['POST'])
def update_classes():
    try:
        data = request.json
        class_type = data.get('classType')
        class_days = data.get('classDays')

        if not class_type or not class_days:
            return jsonify({'success': False, 'message': 'Class type and class days are required'}), 400

        # Update the classes dictionary (in a real application, you would update the database)
        classes[class_type] = class_days

        logging.info(f"Updated classes for {class_type}: {class_days}")
        return jsonify({'success': True, 'message': 'Classes updated successfully'})
    except Exception as e:
        logging.error(f"Error updating classes: {e}")
        return jsonify({'success': False, 'message': 'An error occurred'}), 500

@app.route('/book-class', methods=['POST'])
def book_class():
    try:
        data = request.json
        logging.info(f"Received booking data: {data}")
        name = data.get('name')
        surname = data.get('surname')
        email = data.get('email')
        class_type = data.get('classType')
        date = data.get('date')

        if not name or not surname or not email or not class_type or not date:
            return jsonify({'success': False, 'message': 'All fields are required'}), 400

        booking = {
            'name': name,
            'surname': surname,
            'email': email,
            'classType': class_type,
            'date': date
        }

        bookings_collection.insert_one(booking)
        logging.info(f"Booking created: {booking}")
        return jsonify({'success': True, 'message': 'Booking created successfully'})
    except Exception as e:
        logging.error(f"Error creating booking: {e}")
        return jsonify({'success': False, 'message': 'An error occurred'}), 500

if __name__ == '__main__':
    app.run(port=5000)