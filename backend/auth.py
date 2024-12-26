from typing import Optional
from pydantic import BaseModel, EmailStr
from passlib.context import CryptContext
from jose import JWTError, jwt
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from datetime import datetime, timedelta
from fastapi import Depends

# For demonstration, we keep everything in one file
# but best practice is to split routes, models, schemas, etc.

SECRET_KEY = "YOUR_JWT_SECRET_KEY"  # replace with a strong key!
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

# Create a password hashing context
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")

# MongoDB user collection
users_collection = db["users"]  # e.g. in your main.py: db = client["tasks_db"]

class User(BaseModel):
    id: Optional[str] = None  # We'll store Mongo _id as string
    email: EmailStr
    hashed_password: str

class UserCreate(BaseModel):
    email: EmailStr
    password: str

def get_password_hash(password: str) -> str:
    return pwd_context.hash(password)

def verify_password(plain_password: str, hashed_password: str) -> bool:
    return pwd_context.verify(plain_password, hashed_password)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
    """Create JWT token."""
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=15)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def get_current_user(token: str = Depends(oauth2_scheme)):
    """Decodes the JWT token, returns the user record."""
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_email: str = payload.get("sub")
        user_id: str = payload.get("user_id")
        if user_email is None or user_id is None:
            raise HTTPException(status_code=401, detail="Invalid token payload")
    except JWTError:
        raise HTTPException(status_code=401, detail="Token is invalid or expired")

    user = users_collection.find_one({"_id": ObjectId(user_id)})
    if not user:
        raise HTTPException(status_code=401, detail="User not found")

    return user 

@app.post("/register")
def register_user(user_data: UserCreate):
    # Check if email already exists
    existing_user = users_collection.find_one({"email": user_data.email})
    if existing_user:
        raise HTTPException(status_code=400, detail="Email already registered")

    # Hash the password
    hashed = get_password_hash(user_data.password)
    new_user = {
        "email": user_data.email,
        "hashed_password": hashed
    }
    # Insert into Mongo
    result = users_collection.insert_one(new_user)
    # Convert ObjectId to string
    user_id_str = str(result.inserted_id)

    return {"message": "User created", "user_id": user_id_str}

@app.post("/login")
def login(form_data: OAuth2PasswordRequestForm = Depends()):
    # form_data.username is actually the user’s email in this scenario
    user = users_collection.find_one({"email": form_data.username})
    if not user:
        raise HTTPException(status_code=400, detail="Invalid credentials")

    # Compare hashed password
    if not verify_password(form_data.password, user["hashed_password"]):
        raise HTTPException(status_code=400, detail="Invalid credentials")

    # Create JWT
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": user["email"], "user_id": str(user["_id"])},
        expires_delta=access_token_expires
    )

    return {
        "access_token": access_token,
        "token_type": "bearer"
    }

