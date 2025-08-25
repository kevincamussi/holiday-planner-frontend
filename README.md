# holiday_planner

pip freeze > requirements.txt is used at the backend folder to create the depencies file

To install the dependencies open the backend folder and use the following commands:

python -m venv venv - create a isolate ambient to install packages without affecting the rest of the system

venv\Scripts\activate - activate the isolate ambient
deactivate - deactivate the ambient

pip install -r requirements.txt - install the dependencies from the requirements.txt

uvicorn app.main:app --reload - execute backend server
