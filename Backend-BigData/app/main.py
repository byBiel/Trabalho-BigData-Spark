from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.routes.area import router as area_router
from app.routes.companies import router as companies_router
from app.routes.problems import router as problems_router
from app.routes.sentimento import router as sentimento_router
from app.routes.uf import router as uf_router


app = FastAPI(
    title="Backend BigData",
    version="1.0.0",
)


app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.get("/")
def health_check():
    return {
        "status": "ok",
        "message": "Backend BigData rodando"
    }


app.include_router(area_router)
app.include_router(companies_router)
app.include_router(problems_router)
app.include_router(sentimento_router)
app.include_router(uf_router)