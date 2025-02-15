/* filepath: /c:/Users/v4pal/Desktop/PROGETTI/Websites/Climbing_booking_app/frontend/scripts.js */
const classTypeSelect = document.getElementById('class-type');
const dateInput = document.getElementById('date');
const calendarDiv = document.getElementById('calendar');
const bookingForm = document.getElementById('booking-form');

const classes = {
    beginner: ['Monday 10:00 AM', 'Wednesday 2:00 PM', 'Friday 4:00 PM'],
    intermediate: ['Tuesday 11:00 AM', 'Thursday 3:00 PM', 'Saturday 1:00 PM'],
    advanced: ['Monday 1:00 PM', 'Wednesday 5:00 PM', 'Friday 6:00 PM']
};

classTypeSelect.addEventListener('change', updateCalendar);
dateInput.addEventListener('change', updateCalendar);

function updateCalendar() {
    const selectedClassType = classTypeSelect.value;
    if (selectedClassType) {
        calendarDiv.innerHTML = '';
        const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
        daysOfWeek.forEach(day => {
            const dayDiv = document.createElement('div');
            dayDiv.classList.add('day');
            const dayTitle = document.createElement('h3');
            dayTitle.textContent = day;
            dayDiv.appendChild(dayTitle);
            const classList = document.createElement('ul');
            classes[selectedClassType].forEach(classTime => {
                if (classTime.startsWith(day)) {
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

bookingForm.addEventListener('submit', async function(event) {
    event.preventDefault();
    const formData = new FormData(bookingForm);
    const data = {
        name: formData.get('name'),
        surname: formData.get('surname'),
        email: formData.get('email'),
        classType: formData.get('class-type'),
        date: formData.get('date')
    };

    const response = await fetch('http://localhost:5000/book-class', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });

    const result = await response.json();
    if (result.success) {
        alert('Prenotazione effettuata con successo');
    } else {
        alert('Errore durante la prenotazione');
    }
});

const updateForm = document.getElementById('update-form');

updateForm.addEventListener('submit', async function(event) {
    event.preventDefault();
    const formData = new FormData(updateForm);
    const data = {
        classType: formData.get('class-type'),
        classDays: formData.get('class-days').split(',').map(day => day.trim())
    };

    const response = await fetch('http://localhost:5000/update-classes', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    });

    const result = await response.json();
    if (result.success) {
        alert('Classi aggiornate con successo');
    } else {
        alert('Errore durante l\'aggiornamento delle classi');
    }
});