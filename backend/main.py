from fastapi import FastAPI, HTTPException
from pymongo import MongoClient
from pydantic import BaseModel
from datetime import date
from typing import Optional

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
    due_date: Optional[date] = None

@app.get("/")
def root():
    return {"message": "Home Task Management API"}

@app.post("/tasks")
def create_task(task: Task, current_user: dict = Depends(get_current_user)):
    # We can store the user_id with the task, so tasks are user-specific
    task_dict = task.dict()
    # if you used 'task' as a Pydantic model
    task_dict["owner_id"] = str(current_user["_id"])

    result = tasks_collection.insert_one(task_dict)
    return {"_id": str(result.inserted_id), **task_dict}

@app.get("/tasks")
def get_tasks(current_user: dict = Depends(get_current_user)):
    # fetch only tasks that belong to the current user
    user_id_str = str(current_user["_id"])
    tasks = list(tasks_collection.find({"owner_id": user_id_str}))
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

@app.patch("/tasks/{task_id}/complete")
def toggle_task_completion(task_id: str):
    task = tasks_collection.find_one({"_id": {"$oid": task_id} if len(task_id) == 24 else task_id})
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    
    current_status = task.get("completed", False)
    updated_status = not current_status

    result = tasks_collection.update_one(
        {"_id": task["_id"]},
        {"$set": {"completed": updated_status}}
    )
    return {"message": "Task completion toggled", "completed": updated_status}
