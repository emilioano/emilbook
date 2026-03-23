from fastapi import FastAPI, Depends, Request
# from routes.posts import router
# from routes.posts_mockdb import mockdb_router
from sqlalchemy.orm import Session
from sqlalchemy import text

from db.db import init_db, get_db
from routes.auth import router as auth_router
from routes.user import router as user_router
from routes.post import router as post_router

import time

from fastapi.middleware.cors import CORSMiddleware



app = FastAPI (
    title='emilbook',
    description='A minimal social networking service!',
    version='0.0.1'
)



app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# app.include_router(router)
# app.include_router(mockdb_router)
# app.include_router(auth_router)

app.include_router(auth_router)
app.include_router(user_router)
app.include_router(post_router)


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
    uvicorn.run('app:app', host='0.0.0.0', port=8000, reload=True)