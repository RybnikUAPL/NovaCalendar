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

      // Создаем поле ввода для названия события
      const input = document.createElement('input');
      input.type = 'text';
      input.placeholder = 'Название события';
      input.style.marginBottom = '10px';

      // Останавливаем распространение события клика, чтобы меню не закрывалось при вводе
      input.addEventListener('click', function (event) {
        event.stopPropagation();
      });



      // Кнопка "Добавить событие"
      const addButton = document.createElement('button');
      addButton.textContent = 'Добавить событие';
      addButton.style.display = 'block';
      addButton.style.marginTop = '5px';
      addButton.addEventListener('click', function () {
        const title = input.value.trim();
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

      // Останавливаем распространение события клика для кнопки "Добавить событие"
      addButton.addEventListener('click', function (event) {
        event.stopPropagation();
      });



      // Кнопка "Отмена"
      const cancelButton = document.createElement('button');
      cancelButton.textContent = 'Отмена';
      cancelButton.style.display = 'block';
      cancelButton.style.marginTop = '5px';
      cancelButton.addEventListener('click', function () {
        document.body.removeChild(menu);  // Удаляем меню при отмене
      });

      // Останавливаем распространение события клика для кнопки "Отмена"
      cancelButton.addEventListener('click', function (event) {
        event.stopPropagation();
      });



      // Добавляем поле ввода и кнопки в меню
      menu.appendChild(input);
      menu.appendChild(addButton);
      menu.appendChild(cancelButton);
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

        // Поле для редактирования названия события
        const input = document.createElement('input');
        input.type = 'text';
        input.value = info.event.title;
        input.style.marginBottom = '10px';

        // Останавливаем распространение события клика, чтобы меню не закрывалось при редактировании
        input.addEventListener('click', function (event) {
          event.stopPropagation();
        });

        // Кнопка "Редактировать"
        const editButton = document.createElement('button');
        editButton.textContent = 'Сохранить изменения';
        editButton.style.display = 'block';
        editButton.style.marginTop = '5px';
        editButton.addEventListener('click', function () {
          const newTitle = input.value.trim();
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

        // Кнопка "Удалить"
        const deleteButton = document.createElement('button');
        deleteButton.textContent = 'Удалить событие';
        deleteButton.style.display = 'block';
        deleteButton.style.marginTop = '5px';
        deleteButton.addEventListener('click', function () {
          info.event.remove();
          var currentEvents = calendar.getEvents().map(event => ({
            title: event.title,
            start: event.startStr,
            end: event.endStr,
            allDay: event.allDay
          }));
          saveEvents(currentEvents);
          document.body.removeChild(menu);  // Удаляем меню
        });

        // Кнопка "Отмена"
        const cancelButton = document.createElement('button');
        cancelButton.textContent = 'Отмена';
        cancelButton.style.display = 'block';
        cancelButton.style.marginTop = '5px';
        cancelButton.addEventListener('click', function () {
          document.body.removeChild(menu);  // Удаляем меню при отмене
        });

        // Останавливаем распространение события клика для кнопок
        editButton.addEventListener('click', function (event) {
          event.stopPropagation();
        });
        deleteButton.addEventListener('click', function (event) {
          event.stopPropagation();
        });
        cancelButton.addEventListener('click', function (event) {
          event.stopPropagation();
        });

        // Добавляем элементы в меню
        menu.appendChild(input);
        menu.appendChild(editButton);
        menu.appendChild(deleteButton);
        menu.appendChild(cancelButton);
        document.body.appendChild(menu);  // Показываем меню на странице

        // Закрываем меню при клике в любом другом месте, кроме самого меню
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