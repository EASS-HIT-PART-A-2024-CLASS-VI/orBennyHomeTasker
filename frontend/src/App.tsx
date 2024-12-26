import React, { useEffect, useState } from 'react';

// Define the shape of a Task
interface Task {
  _id: string;           // instead of _id?: string
  title: string;
  description: string;
  completed: boolean;
}

function App() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');

  // Fetch tasks once on component mount
  useEffect(() => {
    fetch('http://localhost:8000/tasks')
      .then((res) => res.json())
      .then((data) => setTasks(data))
      .catch((error) => console.error(error));
  }, []);

  const toggleComplete = async (id: string) => {
    try {
      const response = await fetch(`http://localhost:8000/tasks/${id}/complete`, {
        method: "PATCH",
      });
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
  // Add a new task
  const addTask = async () => {
    const newTask: Task = {
      _id: 'temp-id',
      title: 'My Title',
      description: 'My Description',
      completed: false,
    };
    try {
      const response = await fetch('http://localhost:8000/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newTask),
      });
      const created = await response.json();
      setTasks((prev) => [...prev, created]);
      setTitle('');
      setDescription('');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ margin: '2rem' }}>
      <h1>Home Task Management (TypeScript)</h1>

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
        <button onClick={addTask}>Add Task</button>
      </div>

      <ul>
        {tasks.map((task) => (
          <li key={task._id}>
            <input
              type="checkbox"
              checked={task.completed}
              onChange={() => toggleComplete(task._id)}
            />
            <strong>{task.title}</strong> - {task.description}
            {task.completed ? " (Done)" : ""}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
