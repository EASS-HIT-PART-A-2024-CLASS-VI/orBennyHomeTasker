# Home Tasker

A **Home Task management** application built with:

- **FastAPI** (Python) for the backend
- **MongoDB** for data storage
- **React** (Vite/TypeScript or JavaScript) for the frontend
- **Docker Compose** for container orchestration

This project allows you to create, view, update, and delete home tasks via a simple web interface.

---

## Features

- **Add Tasks**: Enter a title and description, and store the task in MongoDB.  
- **List Tasks**: View existing tasks in a simple React UI.  
- **Update / Delete**: Easily edit or remove tasks.  
- **Dockerized**: Spin up the entire stack (database, backend, frontend) with a single command.

---

## Prerequisites

1. **Docker**: [Install Docker Desktop](https://www.docker.com/products/docker-desktop) (macOS/Windows) or [Docker Engine](https://docs.docker.com/engine/install/) (Linux).  
2. **Docker Compose**: Included with Docker Desktop or install separately as `docker-compose` or `docker compose`.

*(If you want to develop outside of Docker, you’ll need [Node.js](https://nodejs.org/) for the frontend and [Python 3.9+](https://www.python.org/downloads/) for the backend.)*

---

## Quick Start with Docker

1. **Clone the Repository (SSH example)**:
   ```bash
   git clone git@github.com:EASS-HIT-PART-A-2024-CLASS-VI/orBennyHomeTasker.git
   cd orBennyHomeTasker
   ```
2. **Build and Run the containers**:
   ```bash
   docker-compose build
   docker-compose up
   ```
   MongoDB → port 27017
   FastAPI → port 8000
   React → port 3000
3. **Access the App**:
Frontend at http://localhost:3000
FastAPI at http://localhost:8000

---

## Project Structure
   ```bash
   orBennyHomeTasker/
├── docker-compose.yml       # Defines Docker services (MongoDB, Backend, Frontend)
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
│       └── ...
└── ...
```

---

## Usage
1. **Add a Task**
Go to http://localhost:3000, type the task info (title, description), and click “Add Task”.
View Tasks

2. **Newly added tasks appear in the task list**
Update / Delete

3. The UI provides update/delete controls (depending on your implementation) to modify or remove tasks.

---

## Environment Variables
MONGO_URI: MongoDB connection string. In Docker Compose, it's set to
   ```bash
   mongodb://mongodb:27017/<database_name> by default. 
   ```
You can modify it in docker-compose.yml if needed.

---

## Environment Variables
1. Fork this repo (if you don’t have direct write access).
2. Create your feature branch:
   ```bash
   git checkout -b feature/my-new-feature
   ```
3. Commit your changes:
   ```bash
   git commit -m "Add my new feature"
   ```
4. Push to the branch:
   ```bash
   git push origin feature/my-new-feature
   ```
5. Open a Pull Request on GitHub.

---

# License
   ```bash
   MIT License

   Copyright (c) 2024 ...

   Permission is hereby granted, free of charge, to any person obtaining a copy ...
   ```



   
