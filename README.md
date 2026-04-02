# emilbook
Emilbook is a guestbook/wall inspired by popular social networking apps.
Backend is built with FastAPI and Python, while React is used for the frontend, it is a modern scalable application.
It uses a MySQL database. 


It's possible to read and write posts on a wall and use different reactions, user account can be created and CRUD operations are supported.



Visit a live version here: https://emilbook.sjokvi.st/

Backend docs: https://api-emilbook.sjokvi.st/docs


Instructions:
```
# Database:
# In backend/docs/ there is a database model and script available which can be used to create a fit for purpose database.

# Example on how to create the db using the provided SQL script:
mysql -u root < emilbook.sql

# Create a user for the db:
CREATE USER 'username'@'host' IDENTIFIED BY 'password';

# Grant db authorization for the user:
GRANT ALL PRIVILEGES ON emilbook.* TO 'user'@'host';


# Backend:
# Navigate to the backend folder.

# Recommended to create a virtual environment
python3 -m venv .venv

# Activate venv. Note! .venv/Scripts/activate if Windows, .venv/bin/activate if Linux
source .venv/bin/activate

# Install the required libraries
pip install -r requirements.txt

# There is a .env_template file provided where you need to out your own parameters and save as .env

# After this you can start the backend with:
python3 app.py


# Frontend
# Navigate to the frontend folder.

# Install the dependencies
npm i

# There is a .env_template file provided where you need to out your own parameters and save as .env

# To start frontend in dev mode
npm run dev



```
