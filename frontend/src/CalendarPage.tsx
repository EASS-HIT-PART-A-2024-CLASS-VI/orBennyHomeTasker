import { useState, useEffect } from 'react';
import { useNavigate, Link } from "react-router-dom";
import { Calendar, momentLocalizer, Event } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css';

// Define the shape of a Task
interface Task {
  _id: string;
  title: string;
  description: string;
  completed: boolean;
  due_date?: string;
  start_time?: string;
  category: Category;
}

// Define an Enum for the categories
enum Category {
  Bathroom = "bathroom",
  Bedroom = "bedroom",
  Garden = "garden",
  Kitchen = "kitchen",
  Laundry = "laundry",
  Livingroom = "livingroom"
}

const localizer = momentLocalizer(moment);

function CalendarPage() {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [events, setEvents] = useState<Event[]>([]);

  // Fetch tasks once on component mount
  useEffect(() => {
    console.log("CalendarPage component mounted");
    const token = localStorage.getItem("token");
    console.log("Retrieved token:", token);
    if (!token) {
      alert("Please log in first");
      navigate("/login");
      return;
    }
    fetch("http://localhost:8000/tasks", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then((res) => {
        if (res.status === 401) {
          alert("Session expired or unauthorized");
          navigate("/login");
          return [];
        }
        return res.json();
      })
      .then((data: Task[]) => {
        console.log("Fetched tasks:", data); // Debugging log
        setTasks(data);
        const events = data.map(task => ({
          title: task.title,
          start: new Date(task.start_time || task.due_date || ""),
          end: new Date(task.due_date || ""),
          allDay: false,
          resource: task
        }));
        setEvents(events);
      })
      .catch((err) => console.error("Error fetching tasks:", err));
  }, [navigate]);

  useEffect(() => {
    console.log("Tasks state updated:", tasks);
  }, [tasks]);

  return (
    <div style={{ margin: '2rem' }}>
      <h1>Calendar View</h1>
      <div style={{ marginBottom: '1rem' }}>
        <Link to="/">Back to Home</Link>
      </div>
      <Calendar
        localizer={localizer}
        events={events}
        startAccessor="start"
        endAccessor="end"
        style={{ height: 500 }}
      />
    </div>
  );
}

export default CalendarPage;
