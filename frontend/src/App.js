import React, { useState, useRef, useEffect } from 'react';
import { Calendar, dateFnsLocalizer } from 'react-big-calendar';
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop';
import format from 'date-fns/format';
import parse from 'date-fns/parse';
import startOfWeek from 'date-fns/startOfWeek';
import getDay from 'date-fns/getDay';
import enUS from 'date-fns/locale/en-US';
import axios from 'axios';
import 'react-big-calendar/lib/addons/dragAndDrop/styles.css';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import './App.css';

const locales = {
  'en-US': enUS,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

const DnDCalendar = withDragAndDrop(Calendar);

function App() {
  const [events, setEvents] = useState([]);
  const [title, setTitle] = useState('');
  const [difficulty, setDifficulty] = useState('Easy');
  const [importance, setImportance] = useState('Important');
  const [urgency, setUrgency] = useState('Not Urgent');
  const [selectedEvent, setSelectedEvent] = useState(null); 
  const [cardPosition, setCardPosition] = useState({ top: 0, left: 0 }); 

  const cardRef = useRef(null); 

  const onEventResize = (data) => {
    const { start, end } = data;

    setEvents((currentEvents) =>
      currentEvents.map((event) =>
        event.title === data.event.title ? { ...event, start: new Date(start), end: new Date(end) } : event
      )
    );
  };

  const onEventDrop = (data) => {
    const { start, end } = data;

    setEvents((currentEvents) =>
      currentEvents.map((event) =>
        event.title === data.event.title ? { ...event, start: new Date(start), end: new Date(end) } : event
      )
    );
  };

  const handleSubmit = async () => {
    if (!title) {
      alert('Please provide a task title');
      return;
    }

    try {
      const response = await axios.post('http://localhost:3001/schedule', {
        tasks: [{
          title,
          difficulty,
          importance,
          urgency,
        }],
      });

      const taskPrediction = response.data.schedule[0];

      const startTime = new Date();  
      const durationParts = taskPrediction.estimatedDuration.split(' ');
      const hours = parseInt(durationParts[0], 10);
      const minutes = parseInt(durationParts[2], 10);
      const endTime = new Date(startTime.getTime() + hours * 60 * 60 * 1000 + minutes * 60 * 1000);

      const newEvent = {
        title,
        start: startTime,
        end: endTime,
        description: taskPrediction.reason, 
        estimatedDuration: taskPrediction.estimatedDuration,
        bestTimeToDo: taskPrediction.bestTimeToDo,
      };

      setEvents((prevEvents) => [...prevEvents, newEvent]);

      setTitle('');
      setDifficulty('Easy');
      setImportance('Important');
      setUrgency('Not Urgent');
    } catch (error) {
      console.error('Error scheduling task:', error);
      alert('Failed to get scheduling from AI.');
    }
  };

  const eventStyleGetter = (event) => {
    return {
      style: {
        backgroundColor: '#3174ad',  
        color: '#fff',
        borderRadius: '8px',
        padding: '5px',
      },
    };
  };

  const handleSelectEvent = (event, e) => {
    const rect = e.target.getBoundingClientRect();
    setCardPosition({ top: rect.top + window.scrollY + 10, left: rect.left + window.scrollX + 10 });
    setSelectedEvent(event); 
  };

  const closeCard = () => {
    setSelectedEvent(null); 
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (cardRef.current && !cardRef.current.contains(e.target)) {
        closeCard();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  return (
    <div>
      <h1> TimeBlock </h1>

      {/* Task Form */}
      <div className="task-input">
        <input
          className="task-input-field"
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Enter task title"
        />
        <select className="task-select" value={difficulty} onChange={(e) => setDifficulty(e.target.value)}>
          <option value="Easy">Easy</option>
          <option value="Medium">Medium</option>
          <option value="Hard">Hard</option>
        </select>
        <select className="task-select" value={importance} onChange={(e) => setImportance(e.target.value)}>
          <option value="Not Important">Not Important</option>
          <option value="Important">Important</option>
          <option value="Very Important">Very Important</option>
        </select>
        <select className="task-select" value={urgency} onChange={(e) => setUrgency(e.target.value)}>
          <option value="Not Urgent">Not Urgent</option>
          <option value="Urgent">Urgent</option>
          <option value="Very Urgent">Very Urgent</option>
        </select>
        <button className="task-button" onClick={handleSubmit}>Add Task</button>
      </div>

      {/* Calendar */}
      <DnDCalendar
        localizer={localizer}
        events={events}
        onEventDrop={onEventDrop}
        onEventResize={onEventResize}
        resizable
        defaultView="week"
        style={{ height: '80vh', marginTop: '20px' }}
        eventPropGetter={eventStyleGetter}
        onSelectEvent={handleSelectEvent}
      />

      {/* Floating Card for event details */}
      {selectedEvent && (
        <div
          ref={cardRef}
          className="floating-card"
          style={{ 
            top: cardPosition.top, 
            left: cardPosition.left, 
            position: 'absolute', 
            zIndex: 10, 
            backgroundColor: '#fff', 
            padding: '15px', 
            boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.1)', 
            borderRadius: '8px',
            maxWidth: '300px', 
            maxHeight: '200px', 
            overflowY: 'auto', 
          }}
        >
          <h3>{selectedEvent.title}</h3>
          <p><strong>Duration:</strong> {selectedEvent.estimatedDuration}</p>
          <p><strong>Best Time To Do:</strong> {selectedEvent.bestTimeToDo}</p>
          <p><strong>Reason:</strong> {selectedEvent.description}</p>
          <button onClick={closeCard} style={{ marginTop: '10px', backgroundColor: '#3174ad', color: '#fff', padding: '5px 10px', borderRadius: '5px' }}>Close</button>
        </div>
      )}
    </div>
  );
}

export default App;



