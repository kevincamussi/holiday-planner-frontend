# from sqlalchemy import Column, Integer, String, Date
# from .database import Base

# class Vacation(Base):
#     __tablename__ = "vacations"

#     id = Column(Integer, primary_key=True, index=True)
#     employee_name = Column(String, index=True)
#     start_date = Column(Date, index=True)
#     end_date = Column(Date, index=True)

#     # An ORM model maps the vacations table.
#     # Date stores dates properly (better than string).
#     # index=True speeds up queries.

from pydantic import BaseModel
from typing import Optional

class Holiday(BaseModel):
    id: Optional[str]
    employee_name: str
    start_date: str
    end_date: str