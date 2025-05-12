// ContestCalendar.js
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';

const localizer = momentLocalizer(moment);

export default function ContestCalendar({ events, onEventClick }) {
  return (
    <div style={{ height: 500 }}>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        titleAccessor="title"
        views={['month']}
        popup
        onSelectEvent={onEventClick}
        style={{ height: 500 }}
      />
    </div>
  );
}
