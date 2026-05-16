from fastapi import APIRouter

from app.config import DATA_BASE_PATH
from app.services.loader import load_and_group_by_total


router = APIRouter(
    prefix="/api/area",
    tags=["Area"],
)


def get_area_data():
    return load_and_group_by_total(DATA_BASE_PATH, "area.json", "area")


@router.get("/")
def get_area():
    return get_area_data()


@router.get("/top")
def get_top_area():
    data = get_area_data()
    return data[0]


@router.get("/bottom")
def get_bottom_area():
    data = get_area_data()
    return data[-1]