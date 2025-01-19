import logging
from dotenv import load_dotenv
import os

# Load environment variables from .env file
load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO)

from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from pymongo import MongoClient
from pydantic import BaseModel, Field
from datetime import datetime
from typing import Optional
from auth import get_current_user
from auth import router as auth_router
from enum import Enum
from bson.objectid import ObjectId
from bson.errors import InvalidId

app = FastAPI()
origins = [
    "*", #allow everything
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],   # allow POST, GET, OPTIONS, etc.
    allow_headers=["*"],   # allow all request headers
)
app.include_router(auth_router, prefix="/auth", tags=["auth"]) # Include the router from auth
MONGO_URI = os.getenv("MONGO_URI", "mongodb://localhost:27017/tasks_db")
client = MongoClient(MONGO_URI)
db = client["tasks_db"]
tasks_collection = db["tasks"]

# Define an Enum for the categories
class Category(str, Enum):
    bathroom = "bathroom"
    bedroom = "bedroom"
    garden = "garden"
    kitchen = "kitchen"
    laundry = "laundry"
    livingroom = "livingroom"

# Pydantic models
class Task(BaseModel):
    title: str
    description: str = ""
    completed: bool = False
    category: Category
    due_date: Optional[datetime] = Field(default=None, example="2023-10-10T10:00:00")

def convert_objectid_to_str(data):
    if isinstance(data, list):
        for item in data:
            if isinstance(item, dict):
                convert_objectid_to_str(item)
    elif isinstance(data, dict):
        for key, value in data.items():
            if isinstance(value, ObjectId):
                data[key] = str(value)
            elif isinstance(value, (dict, list)):
                convert_objectid_to_str(value)

@app.get("/")
def root():
    return {"message": "Home Task Management API"}

@app.post("/tasks")
def create_task(task: Task, current_user: dict = Depends(get_current_user)):
    logging.info(f"Creating task for user: {current_user['email']}")
    task_dict = task.dict()
    task_dict["user_id"] = current_user["_id"]
    result = tasks_collection.insert_one(task_dict)
    task_id = result.inserted_id
    logging.info(f"Task created with ID: {task_id}")
    task_dict["_id"] = str(task_id)  # Convert ObjectId to string
    task_dict["user_id"] = str(task_dict["user_id"])  # Convert ObjectId to string
    return task_dict

@app.get("/tasks")
def get_tasks(current_user: dict = Depends(get_current_user)):
    logging.info(f"Fetching tasks for user: {current_user['email']}")
    try:
        tasks = list(tasks_collection.find({"user_id": current_user["_id"]}))
        convert_objectid_to_str(tasks)
        logging.info(f"Tasks fetched: {tasks}")
        return tasks
    except Exception as e:
        logging.error(f"Error fetching tasks: {e}")
        raise HTTPException(status_code=500, detail="Internal Server Error")

@app.put("/tasks/{task_id}")
def update_task(task_id: str, task: Task, current_user: dict = Depends(get_current_user)):
    logging.info(f"Updating task: {task_id} for user: {current_user['email']}")
    task_dict = task.dict()
    try:
        result = tasks_collection.update_one(
            {"_id": ObjectId(task_id), "user_id": current_user["_id"]},
            {"$set": task_dict}
        )
    except InvalidId:
        raise HTTPException(status_code=400, detail="Invalid task ID")
    if result.matched_count == 0:
        raise HTTPException(status_code=404, detail="Task not found")
    return {"message": "Task updated successfully"}

@app.delete("/tasks/{task_id}")
def delete_task(task_id: str, current_user: dict = Depends(get_current_user)):
    logging.info(f"Deleting task: {task_id} for user: {current_user['email']}")
    try:
        result = tasks_collection.delete_one({"_id": ObjectId(task_id), "user_id": current_user["_id"]})
    except InvalidId:
        raise HTTPException(status_code=400, detail="Invalid task ID")
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Task not found")
    return {"message": "Task deleted successfully"}

@app.patch("/tasks/{task_id}/complete")
def toggle_task_completion(task_id: str, current_user: dict = Depends(get_current_user)):
    logging.info(f"Toggling completion for task: {task_id} by user: {current_user['email']}")
    try:
        task = tasks_collection.find_one({"_id": ObjectId(task_id), "user_id": current_user["_id"]})
    except InvalidId:
        raise HTTPException(status_code=400, detail="Invalid task ID")
    
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    
    current_status = task.get("completed", False)
    updated_status = not current_status

    result = tasks_collection.update_one(
        {"_id": task["_id"]},
        {"$set": {"completed": updated_status}}
    )
    return {"message": "Task completion toggled", "completed": updated_status}

@app.get("/tasks/{task_id}")
def get_task(task_id: str, current_user: dict = Depends(get_current_user)):
    logging.info(f"Fetching task: {task_id} for user: {current_user['email']}")
    try:
        task = tasks_collection.find_one({"_id": ObjectId(task_id), "user_id": current_user["_id"]})
    except InvalidId:
        raise HTTPException(status_code=400, detail="Invalid task ID")
    
    if not task:
        raise HTTPException(status_code=404, detail="Task not found")
    
    convert_objectid_to_str(task)
    return task