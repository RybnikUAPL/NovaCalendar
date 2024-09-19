document.addEventListener('DOMContentLoaded', function() {
    var calendarEl = document.getElementById('calendar');
    var calendar = new FullCalendar.Calendar(calendarEl, {
        themeSystem: 'bootstrap5',
        initialView: 'dayGridMonth',
        dateClick: function(info) {
        alert('Date: ' + info.dateStr);
        alert('Resource ID: ' + info.resource.id)
      }
    });
    calendar.render();
  });

