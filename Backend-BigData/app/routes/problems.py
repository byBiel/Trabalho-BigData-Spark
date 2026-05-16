from fastapi import APIRouter

from app.config import DATA_BASE_PATH
from app.services.loader import load_and_group_by_total


router = APIRouter(
    prefix="/problems",
    tags=["Problems"],
)


def get_problems_data():
    return load_and_group_by_total(
        DATA_BASE_PATH,
        "top-problems.json",
        "problema",
        limit=20,
    )


@router.get("/")
def get_problems():
    return get_problems_data()


@router.get("/top")
def get_top_problem():
    data = get_problems_data()
    return data[0]