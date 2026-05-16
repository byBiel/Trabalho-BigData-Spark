from fastapi import APIRouter

from app.config import DATA_BASE_PATH
from app.services.loader import load_and_group_by_total


router = APIRouter(
    prefix="/api/sentimento",
    tags=["Sentimento"],
)


def get_sentimento_data():
    return load_and_group_by_total(DATA_BASE_PATH, "sentimento.json", "sentimento")


@router.get("/")
def get_sentimento():
    return get_sentimento_data()


@router.get("/top")
def get_top_sentimento():
    data = get_sentimento_data()
    return data[0]