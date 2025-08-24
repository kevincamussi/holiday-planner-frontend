from datetime import date
from pydantic import BaseModel, ConfigDict, field_validator

class VacationBase(BaseModel):
    employee_name: str
    start_date: date
    end_date: date

    #  simple validation: start <= end
    @field_validator("end_date")
    @classmethod
    def check_end_after_start(cls, v, values):
        start = values.get("start_date")
        if start and v < start:
            raise ValueError("end_date cannot be before start_date")
        return v
    
class VacationCreate(VacationBase):
    pass

class VacationOut(VacationBase):
    id: int
    model_config = ConfigDict(from_attributes=True)  # convert ORM → Pydantic