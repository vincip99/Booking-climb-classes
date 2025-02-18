/* filepath: /c:/Users/v4pal/Desktop/PROGETTI/Websites/Climbing_booking_app/frontend/scripts.js */
// Get references to DOM elements
const classTypeSelect = document.getElementById('class-type');
const dateInput = document.getElementById('date');
const calendarDiv = document.getElementById('calendar');
const bookingForm = document.getElementById('booking-form');

// Define the available classes for each level
const classes = {
    beginner: ['Monday 10:00 AM', 'Wednesday 2:00 PM', 'Friday 4:00 PM'],
    intermediate: ['Tuesday 11:00 AM', 'Thursday 3:00 PM', 'Saturday 1:00 PM'],
    advanced: ['Monday 1:00 PM', 'Wednesday 5:00 PM', 'Friday 6:00 PM']
};

// Add event listeners to update the calendar when the class type or date changes
classTypeSelect.addEventListener('change', updateCalendar);
dateInput.addEventListener('change', updateCalendar);

// Function to update the calendar based on the selected class type and date
function updateCalendar() {
    const selectedClassType = classTypeSelect.value;
    const selectedDate = dateInput.value ? new Date(dateInput.value) : new Date();
    const selectedDay = selectedDate.toLocaleDateString('en-US', { weekday: 'long' });

    if (selectedClassType) {
        calendarDiv.innerHTML = ''; // Clear the current calendar
        const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        daysOfWeek.forEach(day => {
            const dayDiv = document.createElement('div');
            dayDiv.classList.add('day');
            const dayTitle = document.createElement('h3');
            dayTitle.textContent = day;
            dayDiv.appendChild(dayTitle);
            const classList = document.createElement('ul');
            classes[selectedClassType].forEach(classTime => {
                if (classTime.startsWith(day) && (day === selectedDay || !dateInput.value)) {
                    const li = document.createElement('li');
                    li.textContent = classTime;
                    classList.appendChild(li);
                }
            });
            dayDiv.appendChild(classList);
            calendarDiv.appendChild(dayDiv);
        });
    }
}

// Initial population of the calendar based on the default selected class type and current day
document.addEventListener('DOMContentLoaded', () => {
    updateCalendar();
});

// Add event listener to handle form submission for booking a class
bookingForm.addEventListener('submit', async function(event) {
    event.preventDefault(); // Prevent the default form submission behavior
    const formData = new FormData(bookingForm);
    const data = {
        name: formData.get('name'),
        surname: formData.get('surname'),
        email: formData.get('email'),
        classType: formData.get('class-type'),
        date: formData.get('date')
    };

    // Send a POST request to the backend to book a class
    const response = await fetch('http://localhost:5000/book-class', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });

    const result = await response.json();
    if (result.success) {
        alert('Prenotazione effettuata con successo'); // Show success message
    } else {
        alert('Errore durante la prenotazione'); // Show error message
    }
});

// Get reference to the update form
const updateForm = document.getElementById('update-form');

// Add event listener to handle form submission for updating classes
updateForm.addEventListener('submit', async function(event) {
    event.preventDefault(); // Prevent the default form submission behavior
    const formData = new FormData(updateForm);
    const data = {
        classType: formData.get('class-type'),
        classDays: formData.get('class-days').split(',').map(day => day.trim())
    };

    // Send a POST request to the backend to update classes
    const response = await fetch('http://localhost:5000/update-classes', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });

    const result = await response.json();
    if (result.success) {
        alert('Classi aggiornate con successo'); // Show success message
    } else {
        alert('Errore durante l\'aggiornamento delle classi'); // Show error message
    }
});