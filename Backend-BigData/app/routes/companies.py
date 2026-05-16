from fastapi import APIRouter

from app.config import DATA_BASE_PATH
from app.services.loader import load_and_group_by_total


router = APIRouter(
    prefix="/companies",
    tags=["Companies"],
)


def get_companies_data():
    return load_and_group_by_total(
        DATA_BASE_PATH,
        "top-companies.json",
        "empresa",
        limit=20,
    )


@router.get("/")
def get_companies():
    return get_companies_data()


@router.get("/top")
def get_top_company():
    data = get_companies_data()
    return data[0]