from fastapi import FastAPI, HTTPException
from .models.holidays import HolidayCreate, HolidayOut
from .database import holidays_collection
from bson import ObjectId
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

@app.get("/holidays", response_model=list[HolidayOut])
async def get_holidays():
    holidays_cursor = holidays_collection.find()
    holidays = []
    async for h in holidays_cursor:
        holidays.append(HolidayOut(
            id=str(h["_id"]),
            employee_name=h["employee_name"],
            start_date=h["start_date"],
            end_date=h["end_date"]
        ))
    
    return holidays

@app.post("/holidays")
async def create_holiday(holiday: HolidayCreate):

    doc = {
        "employee_name": holiday.employee_name,
        "start_date": holiday.start_date.isoformat(),  # <- string YYYY-MM-DD
        "end_date": holiday.end_date.isoformat(),
    }
    result = await holidays_collection.insert_one(doc)
    return HolidayOut(
        id=str(result.inserted_id),
        employee_name=holiday.employee_name,
        start_date=holiday.start_date,
        end_date=holiday.end_date
    )

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)