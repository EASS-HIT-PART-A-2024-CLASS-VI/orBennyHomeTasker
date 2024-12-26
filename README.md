orBennyHomeTasker
A home task management application built with:

FastAPI (Python) for the backend
MongoDB for data storage
React (Vite + TypeScript/JavaScript) for the frontend
Docker Compose for container orchestration
This project allows you to create, view, update, and delete home tasks via a simple web interface.

Features
Add Tasks: Enter a title and description, and store the task in MongoDB.
List Tasks: View existing tasks in a simple React UI.
Update / Delete: Easily edit or remove tasks.
Dockerized: Spin up the entire stack (database, backend, frontend) with a single command.
Prerequisites
Docker: Install Docker Desktop (on Mac/Windows) or Docker Engine (on Linux).
Docker Compose: Included by default in Docker Desktop or Docker Engine (as the docker compose or docker-compose command).
(If you want to develop outside of Docker, you’ll need Node.js (for the frontend) and Python 3.9+ (for the backend).)

Quick Start with Docker
Clone the Repository (SSH example):
bash
Copy code
git clone git@github.com:EASS-HIT-PART-A-2024-CLASS-VI/orBennyHomeTasker.git
cd orBennyHomeTasker
Build and Run the containers:
bash
Copy code
docker-compose build
docker-compose up
This will start:
MongoDB on port 27017
FastAPI backend on port 8000
React frontend on port 3000
Access the App:
Frontend: http://localhost:3000
FastAPI: http://localhost:8000
Stopping the App
Press Ctrl + C in the terminal (if running in the foreground) or run:

bash
Copy code
docker-compose down
Project Structure
bash
Copy code
orBennyHomeTasker/
├── docker-compose.yml       # Defines Docker services for MongoDB, Backend, Frontend
├── README.md                # You are here!
├── backend
│   ├── Dockerfile           # Dockerfile for FastAPI
│   ├── requirements.txt     # Python dependencies
│   └── main.py              # FastAPI entry point
├── frontend
│   ├── Dockerfile           # Dockerfile for React (Vite)
│   ├── package.json         # Node.js/React dependencies
│   └── src
│       ├── App.(jsx|tsx)    # Main React component
│       └── ...             # Other React components/files
└── ...
Usage
Add a Task

Go to http://localhost:3000, type your task info (title, description), and click “Add Task.”
View Tasks

New tasks appear in the task list automatically.
Update / Delete

Depending on your UI (buttons/forms), you can update or remove tasks and verify changes in the database.
Environment Variables
MONGO_URI: The connection string for MongoDB. In Docker Compose, this is set to mongodb://mongodb:27017/<database_name> by default. You can change this in docker-compose.yml if needed.
Development (Optional)
If you prefer running each component locally without Docker:

MongoDB: Install & run locally (or use a remote MongoDB Atlas connection).
FastAPI (Backend):
bash
Copy code
cd backend
pip install -r requirements.txt
uvicorn main:app --reload --port 8000
React (Frontend):
bash
Copy code
cd frontend
npm install
npm run dev
By default, Vite serves on http://localhost:5173.
Make sure the frontend is configured to request the backend at http://localhost:8000 (or wherever FastAPI is running).

Contributing
Fork the repo (if you don’t have direct write access).
Create your feature branch:
bash
Copy code
git checkout -b feature/my-new-feature
Commit your changes:
bash
Copy code
git commit -m "Add a new feature"
Push to the branch:
bash
Copy code
git push origin feature/my-new-feature
Open a Pull Request on GitHub.
License
(Choose a license, e.g., MIT, Apache, etc. if appropriate. Or remove if not needed.)

text
Copy code
MIT License

Copyright (c) 2024 ...

Permission is hereby granted, free of charge, to any person obtaining a copy...
Acknowledgments
FastAPI – for a modern, fast Python web framework
MongoDB – for document-based data storage
Vite + React – for a speedy front-end development experience
Docker – for containerization
Everyone who contributed ideas and code
Enjoy your new home task management experience! If you have any questions or suggestions, feel free to open an issue or submit a pull request.