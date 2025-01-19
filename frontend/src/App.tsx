import { useState, useEffect } from 'react';
import { useNavigate, Link } from "react-router-dom";

// Define the shape of a Task
interface Task {
  _id: string;           // instead of _id?: string
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

function App() {
  const navigate = useNavigate();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState<string | null>(null);
  const [startTime, setStartTime] = useState<string | null>(null);
  const [category, setCategory] = useState<Category>(Category.Bathroom);

  // Fetch and Sort tasks once on component mount
  useEffect(() => {
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
          // Unauthorized => token expired or invalid
          alert("Session expired or unauthorized");
          navigate("/login");
          return [];
        }
        return res.json();
      })
      .then((data: Task[]) => {
        // Sort by earliest due date first
        const sorted = data.sort((a, b) => {
          const dateA = new Date(a.due_date || "9999-12-31");
          const dateB = new Date(b.due_date || "9999-12-31");
          return dateA.getTime() - dateB.getTime();
        });
        setTasks(sorted);
      })
      .catch((err) => console.error(err));
  }, [navigate]);

  const toggleComplete = async (id: string) => {
    const token = localStorage.getItem("token");
    console.log("Retrieved token for toggleComplete:", token);
    if (!token) {
      alert("Please log in first");
      navigate("/login");
      return;
    }

    try {
      const response = await fetch(`http://localhost:8000/tasks/${id}/complete`, {
        method: "PATCH",
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      if (response.status === 401) {
        alert("Session expired or unauthorized");
        navigate("/login");
        return;
      }
      const data = await response.json();
      // Update state
      setTasks((prevTasks) =>
        prevTasks.map((t) =>
          t._id === id ? { ...t, completed: data.completed } : t
        )
      );
    } catch (err) {
      console.error(err);
    }
  };

  // Data validation function
  const validateData = () => {
    if (!title || !description || !dueDate || !startTime || !category) {
      alert("All fields must be filled out");
      return false;
    }
    const selectedDate = new Date(dueDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set to start of the day
    if (selectedDate < today) {
      alert("Due date must be today or later");
      return false;
    }
    return true;
  };

  // Add a new task
  const addTask = async () => {
    if (!validateData()) {
      return;
    }
    const token = localStorage.getItem("token");
    console.log("Retrieved token for addTask:", token);
    if (!token) {
      alert("Please log in first");
      navigate("/login");
      return;
    }

    const newTask = {
      title: title,
      description: description,
      due_date: dueDate ? new Date(dueDate).toISOString() : null,  // Ensure due_date is null if not provided
      start_time: startTime ? new Date(startTime).toISOString() : null,
      completed: false,
      category: category,
    };
    try {
      const response = await fetch('http://localhost:8000/tasks', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(newTask),
      });
      if (response.status === 401) {
        alert("Session expired or unauthorized");
        navigate("/login");
        return;
      }
      const created = await response.json();
      setTasks((prev) => [...prev, created]);
      setTitle('');
      setDescription('');
      setDueDate(null);
      setStartTime(null);
      setCategory(Category.Bathroom);
    } catch (err) {
      console.error(err);
    }
  };

  const deleteTask = async (taskId: string) => {
    const token = localStorage.getItem("token");
    console.log("Retrieved token for deleteTask:", token);
    if (!token) {
      alert("Please log in first");
      navigate("/login");
      return;
    }

    try {
      await fetch(`http://localhost:8000/tasks/${taskId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      setTasks(tasks.filter(task => task._id !== taskId));
    } catch (error) {
      console.error('Error deleting task:', error);
    }
  };

  // Group tasks by category
  const groupedTasks = tasks.reduce((acc, task) => {
    if (!acc[task.category]) {
      acc[task.category] = [];
    }
    acc[task.category].push(task);
    return acc;
  }, {} as Record<Category, Task[]>);

  return (
    <div style={{ margin: '2rem' }}>
      <h1>Home Task Management</h1>
      <div style={{ marginBottom: '1rem' }}>
        <Link to="/calendar">View Calendar</Link>
      </div>
      <div style={{ marginBottom: '1rem' }}>
        <input
          type="text"
          placeholder="Task Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <input
          type="text"
          placeholder="Task Description"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <div>
          <h1>Due date:</h1>
          <input
            type="datetime-local"
            value={dueDate || ''}
            onChange={(e) => setDueDate(e.target.value)}
          />
        </div>
        <div>
          <h1>Start time:</h1>
          <input
            type="datetime-local"
            value={startTime || ''}
            onChange={(e) => setStartTime(e.target.value)}
          />
        </div>
        <div>
          <h1>Category:</h1>
          <select value={category} onChange={(e) => setCategory(e.target.value as Category)}>
            {Object.values(Category).map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
        <button onClick={addTask}>Add Task</button>
      </div>
      <div>
        <button onClick={() => {
          localStorage.removeItem("token");
          navigate("/login");
        }}>
          Logout
        </button>
      </div>

      {Object.entries(groupedTasks).map(([category, tasks]) => (
        <div key={category}>
          <h2>{category}</h2>
          <ul>
            {tasks.map((task) => (
              <li key={task._id} style={{ marginBottom: '1rem', padding: '1rem', border: '1px solid #ccc', borderRadius: '8px' }}>
                <input
                  type="checkbox"
                  checked={task.completed}
                  onChange={() => toggleComplete(task._id)}
                />
                <strong>{task.title}</strong> - {task.description} - {new Date(task.due_date || "").toLocaleString("en-GB", { year: "numeric", month: "2-digit", day: "2-digit", hour: "2-digit", minute: "2-digit" })}
                {task.completed ? " (Done)" : ""}
                <button onClick={() => deleteTask(task._id)}>Delete</button>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
  );
}

export default App;
