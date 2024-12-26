from fastapi import FastAPI, HTTPException
from pymongo import MongoClient
from pydantic import BaseModel
import os

app = FastAPI()

MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017/tasks_db")
client = MongoClient(MONGO_URI)
db = client["tasks_db"]
tasks_collection = db["tasks"]

# Pydantic models
class Task(BaseModel):
    title: str
    description: str = ""
    completed: bool = False

@app.get("/")
def root():
    return {"message": "Home Task Management API"}

@app.post("/tasks")
def create_task(task: Task):
    result = tasks_collection.insert_one(task.dict())
    return {"_id": str(result.inserted_id), **task.dict()}

@app.get("/tasks")
def get_tasks():
    tasks = list(tasks_collection.find({}))
    for t in tasks:
        t["_id"] = str(t["_id"])
    return tasks

@app.put("/tasks/{task_id}")
def update_task(task_id: str, task: Task):
    result = tasks_collection.update_one(
        {"_id": {"$oid": task_id} if len(task_id) == 24 else task_id}, 
        {"$set": task.dict()}
    )
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Task not found")
    return {"message": "Task updated successfully"}

@app.delete("/tasks/{task_id}")
def delete_task(task_id: str):
    result = tasks_collection.delete_one(
        {"_id": {"$oid": task_id} if len(task_id) == 24 else task_id}
    )
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Task not found")
    return {"message": "Task deleted successfully"}