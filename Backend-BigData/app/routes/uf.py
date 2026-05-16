from fastapi import APIRouter

from app.config import DATA_BASE_PATH
from app.services.loader import load_and_group_by_total


router = APIRouter(
    prefix="/uf",
    tags=["UF"],
)


def get_uf_data():
    return load_and_group_by_total(DATA_BASE_PATH, "uf.json", "uf")


@router.get("/")
def get_uf():
    return get_uf_data()


@router.get("/top")
def get_top_uf():
    data = get_uf_data()
    return data[0]


@router.get("/bottom")
def get_bottom_uf():
    data = get_uf_data()
    return data[-1]