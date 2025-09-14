"""
FastAPI application exposing a simple Holidays API backed by MongoDB.

Endpoints:
- GET    /holidays              → list all holidays
- POST   /holidays              → create a new holiday
- DELETE /holidays/{holiday_id} → delete a holiday by its ObjectId (string)

Design notes:
- Uses Motor (async MongoDB driver) for non-blocking IO.
- Dates are stored as ISO strings (YYYY-MM-DD) for simplicity.
- CORS is enabled for a React frontend running on http://localhost:5173.
"""

# Import FastAPI types for building the web API and raising HTTP errors.
from fastapi import FastAPI, HTTPException

# Import Pydantic models used to validate input/output payloads.
from .models.holidays import HolidayCreate, HolidayOut

# Import the Mongo collection handle created in database.py.
from .database import holidays_collection

# Import ObjectId to convert string IDs into Mongo's native type for queries.
from bson import ObjectId

# Import CORS middleware to allow the frontend (different origin) to call this API.
from fastapi.middleware.cors import CORSMiddleware

# Instantiate the FastAPI application.
app = FastAPI()

@app.get("/holidays", response_model=list[HolidayOut])
async def get_holidays():
    """
    Fetch all holidays from MongoDB and return them as a list of HolidayOut.

    Returns:
        list[HolidayOut]: { id: str, employee_name: str, start_date: date-like, end_date: date-like }

    Implementation details:
    - We call `find()` on the collection to get an async cursor.
    - We iterate with `async for` and build a Pydantic model per document.
    - `_id` must be stringified (ObjectId → str) to serialize to JSON.
    """
    # Ask MongoDB for all documents in the "holidays" collection.
    holidays_cursor = holidays_collection.find()

    # We'll accumulate Pydantic models here.
    holidays: list[HolidayOut] = []

    # Iterate the cursor asynchronously.
    async for h in holidays_cursor:
        # Convert each raw Mongo document into a strongly-typed Pydantic model.
        holidays.append(HolidayOut(
            id=str(h["_id"]),                  # Convert ObjectId to str for JSON
            employee_name=h["employee_name"],  # Read scalar field from document
            start_date=h["start_date"],        # Stored as "YYYY-MM-DD" (string)
            end_date=h["end_date"],            # Stored as "YYYY-MM-DD" (string)
        ))

    # Return the list of models; FastAPI will serialize them to JSON.
    return holidays

@app.post("/holidays")
async def create_holiday(holiday: HolidayCreate):
    """
    Create a new holiday document and return it.

    Args:
        holiday (HolidayCreate): Validated payload with employee_name, start_date, end_date.

    Returns:
        HolidayOut: The newly created holiday with a generated string `id`.
    """
    # Build the MongoDB document; convert Python `date` objects to ISO strings.
    doc = {
        "employee_name": holiday.employee_name,
        "start_date": holiday.start_date.isoformat(),  # "YYYY-MM-DD"
        "end_date": holiday.end_date.isoformat(),      # "YYYY-MM-DD"
    }

    # Insert the document asynchronously; MongoDB returns an InsertOneResult.
    result = await holidays_collection.insert_one(doc)

    # Return a Pydantic model with the inserted id. Dates are returned as `date` (from input model).
    return HolidayOut(
        id=str(result.inserted_id),
        employee_name=holiday.employee_name,
        start_date=holiday.start_date,
        end_date=holiday.end_date,
    )

@app.delete("/holidays/{holiday_id}")
async def delete_holiday(holiday_id: str):
    """
    Delete a holiday by its Mongo `_id` (provided as a string).

    Args:
        holiday_id (str): The stringified ObjectId.

    Returns:
        dict: A simple JSON message on success.

    Raises:
        HTTPException 404: If the id format is invalid or if no document was deleted.
    """
    try:
        # Convert the string id into a Mongo ObjectId for querying `_id`.
        oid = ObjectId(holiday_id)
    except Exception:
        # If conversion fails, the format is wrong (not a valid ObjectId).
        raise HTTPException(status_code=404, detail="Invalid ID format")

    # Try to delete a single document whose `_id` matches the ObjectId.
    result = await holidays_collection.delete_one({"_id": oid})

    # If delete_count is zero, nothing matched that id.
    if result.deleted_count == 0:
        raise HTTPException(status_code=404, detail="Holiday not found")

    # Return a simple success message.
    return {"message": "Holiday deleted"}

# Configure CORS so a Vite/React dev server can call this API from another origin.
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],  # Adjust for your frontend origin(s).
    allow_credentials=True,                   # Allow cookies/credentials if needed.
    allow_methods=["*"],                      # Allow all HTTP methods during dev.
    allow_headers=["*"],                      # Allow all headers during dev.
)
