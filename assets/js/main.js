document.addEventListener('DOMContentLoaded', function () {
  var calendarEl = document.getElementById('calendar');

  // Функция для загрузки событий из localStorage
  function loadEvents() {
    const events = localStorage.getItem('calendarEvents');
    return events ? JSON.parse(events) : [];
  }

  // Функция для сохранения событий в localStorage
  function saveEvents(events) {
    localStorage.setItem('calendarEvents', JSON.stringify(events));
  }

  var calendar = new FullCalendar.Calendar(calendarEl, {
    initialView: 'dayGridMonth',
    initialDate: new Date(),
    locale: 'ru',
    height: 'auto',
    editable: true,
    selectable: true,

    buttonText: {
      today: 'Сегодня',
      month: 'месяц',
      week: 'неделя',
      day: 'день',
      list: 'список'
    },

    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
    },

    // Загрузка событий из localStorage при инициализации
    events: loadEvents(),

    // Функция для обработки кликов на пустом месте календаря
    dateClick: function (info) {
      // Создаем пользовательское меню при клике левой кнопки мыши
      const menu = document.createElement('div');
      menu.style.position = 'absolute';
      menu.style.top = `${info.jsEvent.pageY}px`;  // Позиция по Y
      menu.style.left = `${info.jsEvent.pageX}px`; // Позиция по X
      menu.style.backgroundColor = '#fff';
      menu.style.border = '1px solid #ccc';
      menu.style.padding = '10px';
      menu.style.zIndex = '1000';

      // Опция "Добавить событие"
      const addOption = document.createElement('div');
      addOption.textContent = 'Добавить событие';
      addOption.style.cursor = 'pointer';
      addOption.addEventListener('click', function () {
        var title = prompt('Введите название события:');
        if (title) {
          var newEvent = {
            title: title,
            start: info.dateStr,
            allDay: true
          };
          calendar.addEvent(newEvent);

          // Сохраняем новое событие в localStorage
          var currentEvents = calendar.getEvents().map(event => ({
            title: event.title,
            start: event.startStr,
            end: event.endStr,
            allDay: event.allDay
          }));
          saveEvents(currentEvents);
        }
        document.body.removeChild(menu);  // Удаляем меню после добавления
      });

      menu.appendChild(addOption);  // Добавляем пункт "Добавить событие" в меню
      document.body.appendChild(menu);  // Показываем меню на странице

      // Закрываем меню при клике в любом другом месте
      document.addEventListener(
        'click',
        function () {
          if (menu) {
            document.body.removeChild(menu);
          }
        },
        { once: true }
      );
    },

    // Контекстное меню для событий при правом клике
    eventDidMount: function (info) {
      info.el.addEventListener('contextmenu', function (e) {
        e.preventDefault(); // Предотвращаем стандартное контекстное меню

        const menu = document.createElement('div');
        menu.style.position = 'absolute';
        menu.style.top = `${e.pageY}px`;
        menu.style.left = `${e.pageX}px`;
        menu.style.backgroundColor = '#fff';
        menu.style.border = '1px solid #ccc';
        menu.style.padding = '10px';
        menu.style.zIndex = '1000';

        // Опция "Редактировать"
        const editOption = document.createElement('div');
        editOption.textContent = 'Редактировать';
        editOption.style.cursor = 'pointer';
        editOption.addEventListener('click', function () {
          var newTitle = prompt('Измените название события:', info.event.title);
          if (newTitle) {
            info.event.setProp('title', newTitle);
            var currentEvents = calendar.getEvents().map(event => ({
              title: event.title,
              start: event.startStr,
              end: event.endStr,
              allDay: event.allDay
            }));
            saveEvents(currentEvents);
          }
          document.body.removeChild(menu);  // Удаляем меню
        });
        menu.appendChild(editOption);

        // Опция "Удалить"
        const deleteOption = document.createElement('div');
        deleteOption.textContent = 'Удалить';
        deleteOption.style.cursor = 'pointer';
        deleteOption.style.marginTop = '5px';
        deleteOption.addEventListener('click', function () {
          if (confirm('Вы уверены, что хотите удалить это событие?')) {
            info.event.remove();
            var currentEvents = calendar.getEvents().map(event => ({
              title: event.title,
              start: event.startStr,
              end: event.endStr,
              allDay: event.allDay
            }));
            saveEvents(currentEvents);
          }
          document.body.removeChild(menu);  // Удаляем меню
        });
        menu.appendChild(deleteOption);

        document.body.appendChild(menu);  // Показываем меню на странице

        // Закрываем меню при клике в любом другом месте
        document.addEventListener('click', function () {
          if (menu) {
            document.body.removeChild(menu);
          }
        }, { once: true });
      });
    }
  });

  calendar.render();
});
