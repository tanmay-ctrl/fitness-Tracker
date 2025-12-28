document.addEventListener('DOMContentLoaded', () => {
    
    const form = document.getElementById('log-workout-form');
    const activityList = document.getElementById('activity-list');
    const emptyState = document.getElementById('empty-state');

    const activityIcons = {
        'Running': '🏃', 'Walking': '🚶', 'Cycling': '🚴',
        'Weightlifting': '🏋️', 'Yoga': '🧘', 'Swimming': '🏊'
    };
    const caloriesPerMinute = {
        'Running': 11, 'Walking': 4, 'Cycling': 8,
        'Weightlifting': 6, 'Yoga': 3, 'Swimming': 10
    };

    let workouts = JSON.parse(localStorage.getItem('workouts')) || [];
    
    if (workouts.length > 0) {
        emptyState.style.display = 'none';
        workouts.forEach(workout => renderWorkout(workout, false)); 
    }

    form.addEventListener('submit', function(e) {
        e.preventDefault();

        const type = document.getElementById('activity-type').value;
        let duration = parseFloat(document.getElementById('duration').value);
        const unit = document.getElementById('duration-unit').value;
        const distance = document.getElementById('distance').value;

        let calcDuration = duration;
        if(unit === 'hours') calcDuration = duration * 60;
        const calsBurned = Math.round(calcDuration * (caloriesPerMinute[type] || 5));

        const newWorkout = {
            id: Date.now(), // Unique ID based on timestamp
            type: type,
            duration: duration,
            unit: unit,
            distance: distance,
            calories: calsBurned,
            date: new Date().toLocaleDateString() 
        };

        workouts.unshift(newWorkout); 
        saveToStorage();

        emptyState.style.display = 'none';
        renderWorkout(newWorkout, true); 
        
        form.reset();
    });

    function renderWorkout(workout, animate) {
        let details = `${workout.duration} ${workout.unit === 'hours' ? 'hr' : 'min'}`;
        if (workout.distance) details = `${workout.distance} miles • ${details}`;

        const newItem = document.createElement('div');
        newItem.className = 'activity-item';
        newItem.setAttribute('data-id', workout.id); // Attach ID for deletion

        if (!animate) newItem.style.animation = 'none';

        newItem.innerHTML = `
            <div class="activity-icon">${activityIcons[workout.type] || '⚡'}</div>
            <div class="activity-details">
                <strong>${workout.type}</strong>
                <span class="details-text">${details}</span>
                <span class="calorie-badge">🔥 ${workout.calories} cal</span>
            </div>
            <button class="delete-btn">&times;</button>
        `;

        newItem.querySelector('.delete-btn').addEventListener('click', function() {
            deleteWorkout(workout.id, newItem);
        });

        activityList.prepend(newItem);
    }

    function deleteWorkout(id, element) {
        element.style.animation = 'fadeOut 0.3s forwards';
        
        element.addEventListener('animationend', () => {
            element.remove();

            workouts = workouts.filter(w => w.id !== id);
            saveToStorage();
            if (workouts.length === 0) {
                emptyState.style.display = 'block';
            }
        });
    }
    function saveToStorage() {
        localStorage.setItem('workouts', JSON.stringify(workouts));
    }

});