document.addEventListener('DOMContentLoaded', function() {
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
    // Основные настройки
    initialView: 'dayGridMonth',
    initialDate: new Date(),  // Устанавливаем текущую дату
    locale: 'ru',
    height: 'auto',

    editable: true, // Включаем возможность редактирования
    selectable: true, // Включаем возможность выбора дат
    selectHelper: true, // Включаем визуальный помощник при выборе 
    
    buttonText: {
      today: 'Сегодня',
      month: 'месяц',
      week: 'неделя',
      day: 'день',
      list: 'список'
    },
    // Настройки заголовков
    headerToolbar: {
      left: 'prev,next today',
      center: 'title',
      right: 'dayGridMonth,timeGridWeek,timeGridDay,listWeek'
    },

    // Загрузка событий из localStorage при инициализации
    events: loadEvents(),

    // Настройки событий

    eventColor: '#378006',
    eventBackgroundColor: '#007bff',
    eventBorderColor: '#000000',
    eventTextColor: '#ffffff',

    // Функция для создания нового события
    select: function(info) {
      var title = prompt('Введите название события:');
      if (title) {
        var newEvent = {
          title: title,
          start: info.startStr,
          end: info.endStr,
          allDay: info.allDay
        };
        calendar.addEvent(newEvent);  // Добавляем событие в календарь

        // Сохраняем новое событие в localStorage
        var currentEvents = calendar.getEvents().map(event => ({
          title: event.title,
          start: event.startStr,
          end: event.endStr,
          allDay: event.allDay
        }));
        saveEvents(currentEvents);  // Обновляем localStorage
      }
      calendar.unselect();
    },

    // Обработчик клика по событию для редактирования или удаления
    eventClick: function(info) {
      // Всплывающее окно с выбором действия
      var action = confirm("Нажмите OK, чтобы отредактировать событие, или Отмена для удаления.");
      
      if (action) {
        // Редактирование события
        var newTitle = prompt('Измените название события:', info.event.title);
        if (newTitle) {
          info.event.setProp('title', newTitle); // Редактирование названия

          // Обновляем localStorage
          var currentEvents = calendar.getEvents().map(event => ({
            title: event.title,
            start: event.startStr,
            end: event.endStr,
            allDay: event.allDay
          }));
          saveEvents(currentEvents);
        }
      } else {
        // Удаление события
        if (confirm('Вы уверены, что хотите удалить это событие?')) {
          info.event.remove(); // Удаление события

          // Обновляем localStorage после удаления события
          var currentEvents = calendar.getEvents().map(event => ({
            title: event.title,
            start: event.startStr,
            end: event.endStr,
            allDay: event.allDay
          }));
          saveEvents(currentEvents);

        }
      }
    },

    
    // Виды календаря
    views: {
      dayGridMonth: {
        titleFormat: { year: 'numeric', month: 'long' }
      },
      timeGridWeek: {
        slotDuration: '00:30:00',
        slotLabelFormat: { hour: 'numeric', minute: '2-digit', hour12: false }
      }
    },

    // Интерактивные настройки
    editable: true,
    droppable: true,
    selectable: true,

    // Обратные вызовы (события)
    eventDrop: function(info) {
      // Обновляем событие в localStorage после перемещения
      var currentEvents = calendar.getEvents().map(event => ({
        title: event.title,
        start: event.startStr,
        end: event.endStr,
        allDay: event.allDay
      }));
      saveEvents(currentEvents);
      alert('Событие перемещено на: ' + info.event.start.toISOString());
    },

    // Настройки времени
    timeZone: 'local',
    slotDuration: '00:30:00',
    slotLabelFormat: {
      hour: 'numeric',
      minute: '2-digit',
      hour12: false
    },

    // Ограничения по дате
    validRange: {
      start: '2024-01-01',
      end: '2025-12-31'
    },
    nowIndicator: true,

    // Тема и внешний вид
    themeSystem: 'bootstrap5',
    contentHeight: 600,

    // Адаптивность
    aspectRatio: 1.5,

    // Тестирование функции изменения размера окна
    windowResize: function(view) {
      console.log('Календарь изменил размер');


      // Обновляем событие в localStorage после изменения длительности
      var currentEvents = calendar.getEvents().map(event => ({
        title: event.title,
        start: event.startStr,
        end: event.endStr,
        allDay: event.allDay
      }));
      saveEvents(currentEvents);
      alert('Событие изменено: ' + info.event.title);      
    },

    // Прочие настройки
    eventLimit: true,  // Показывать "ещё", если слишком много событий
    scrollTime: '08:00:00',  // Начинать с 8 утра
  });

  calendar.render();
});