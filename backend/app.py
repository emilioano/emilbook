from fastapi import FastAPI, Depends, Request
from sqlalchemy.orm import Session
from sqlalchemy import text

from db.db import init_db, get_db
from routes.auth import router as auth_router
from routes.users import router as user_router
from routes.posts import router as post_router
from routes.comments import router as comments_router
from routes.reactions import router as reaction_router

import time
import os

from fastapi.middleware.cors import CORSMiddleware

from dotenv import load_dotenv
load_dotenv()

ALLOW_ORIGINS = os.getenv("ALLOW_ORIGINS")

app = FastAPI (
    title='emilbook',
    description='A minimal social networking service!',
    version='0.0.1'
)



app.add_middleware(
    CORSMiddleware,
    allow_origins=[ALLOW_ORIGINS],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
async def startup_event():
    # Creating db tables if not already existing
    init_db()


app.include_router(auth_router)
app.include_router(user_router)
app.include_router(post_router)
app.include_router(comments_router)
app.include_router(reaction_router)


@app.get('/')
async def root():
    return {
        'message': 'emilbook API!',
        'version': '0.0.1'
    }


@app.get('/health')
async def health_check(db: Session = Depends(get_db)):

    try:
        db.execute(text("SELECT 1"))
        return {
            "status": "Healthy",
            "message": "Server is running!",
            "database": "Connected",
            "error": "No errors"
        }
    except Exception as err:
        return {
            "status": "Unhealthy",
            "message": "Server is not running!",
            "database": "Disconnected",
            "error": str(err)            
        }


@app.middleware("http")
async def add_process_time_header(request: Request, call_next):
    start_time = time.perf_counter()
    response = await call_next(request)
    process_time = time.perf_counter() - start_time
    response.headers["X-Process-Time"] = str(process_time)
    print(f'Middleware measuring process time for operations: {process_time}')
    return response

if __name__ == '__main__':
    import uvicorn
    uvicorn.run('app:app', host='0.0.0.0', port=37640, reload=True)
    # IMPORTANT! DISABLE RELOAD FOR PRODUCTION