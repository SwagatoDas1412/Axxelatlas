from fastapi import FastAPI
from sqlalchemy import text

from app.database import engine
from app.routes import admin, auth, products, requests
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI(title="Axxelatlas API")
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router)
app.include_router(products.router)
app.include_router(requests.router)
app.include_router(admin.router)

@app.get("/")
def root():
    return {"message": "Axxelatlas backend is running"}


@app.get("/health/db")
def db_health_check():
    with engine.connect() as connection:
        result = connection.execute(text("SELECT DATABASE();"))
        db_name = result.scalar()

    return {
        "status": "ok",
        "database": db_name,
    }