// src/components/Calendar.jsx
import React, { useState } from 'react';
import { Calendar as BigCalendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import './Calendar.css';

const localizer = momentLocalizer(moment);

function Calendar() {
  const [events, setEvents] = useState([]);

  const handleSelectSlot = ({ start, end }) => {
    const title = window.prompt('New Event Name');
    const priority = window.prompt('Priority (Low, Medium, High)');

    if (title) {
      setEvents([
        ...events,
        {
          start,
          end,
          title,
          priority: priority || 'Low', // default to 'Low' if no priority given
        },
      ]);
    }
  };

  const eventStyleGetter = (event) => {
    let backgroundColor = '#3174ad'; // default color
    if (event.priority === 'High') backgroundColor = '#d9534f';
    else if (event.priority === 'Medium') backgroundColor = '#f0ad4e';

    return {
      style: { backgroundColor },
    };
  };

  return (
    <div className="calendar-container">
      <BigCalendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        selectable
        onSelectSlot={handleSelectSlot}
        style={{ height: 600 }}
        eventPropGetter={eventStyleGetter}
      />
    </div>
  );
}

export default Calendar;
