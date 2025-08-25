from fastapi import FastAPI, Depends, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy.orm import Session
from typing import List

from .database import Base, engine, SessionLocal
from .models import Vacation
from .schemas import VacationCreate, VacationOut

# create table with SQLite if they don't exist
Base.metadata.create_all(bind=engine)

app = FastAPI(title= "Holidays Planner", version='1.0.0')

# CORS: allows frontend (localhost:3000) calls API (localhost:8000)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "http://localhost:5173/"],
    allow_methods=["*"],
    allow_headers=["*"]
)

# dependence: open/close session by requisition
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.get("/holidays", response_model=List[VacationOut])
def list_vacations(db: Session = Depends(get_db)):
    return db.query(Vacation).order_by(Vacation.start_date).all()

@app.post("/holidays", response_model=VacationOut)
def create_vacation(payload: VacationCreate, db: Session = Depends(get_db)):
    # Check if the vacation overlaps with existing ones
    overlap = (
        db.query(Vacation)
        .filter(
            Vacation.employee_name == payload.employee_name,
            Vacation.start_date <= payload.end_date,
            Vacation.end_date >= payload.start_date,
        )
        .first()
    )
    if overlap:
        raise HTTPException(
            status_code=409,
            detail="Vacation overlaps with an existing vacation for this employee."
        )
    vacation = Vacation(
        employee_name=payload.employee_name,
        start_date=payload.start_date,
        end_date=payload.end_date,
    )
    db.add(vacation)
    db.commit()
    db.refresh(vacation)
    return vacation

@app.delete("/holidays/{vacation_id}", status_code=204)
def delete_vacation(vacation_id: int, db: Session = Depends(get_db)):
    v = db.query(Vacation).get(vacation_id)
    if not v:
        raise HTTPException(status_code=404, detail="Not found.")
    db.delete()
    db.commit()
    return None