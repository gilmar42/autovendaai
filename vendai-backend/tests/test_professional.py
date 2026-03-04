import pytest
from httpx import AsyncClient, ASGITransport
from main import app
from app.core.database import get_database
from app.api.deps import get_current_user
from bson import ObjectId


class MockCollection:
    def __init__(self):
        self.users = []

    async def find_one(self, query):
        for u in self.users:
            if str(u.get("_id")) == str(query.get("_id")):
                return u.copy()
        return None

    async def update_one(self, query, update):
        for u in self.users:
            if str(u.get("_id")) == str(query.get("_id")):
                u.update(update.get("$set", {}))

                class Result:
                    matched_count = 1
                return Result()

        class Result:
            matched_count = 0
        return Result()


class MockDB:
    def __init__(self):
        self._users = MockCollection()

    @property
    def users(self):
        return self._users


mock_db = MockDB()


async def override_get_database():
    return mock_db


def override_get_current_user():
    return {
        "_id": "5f9b3b9b9b9b9b9b9b9b9b9b",
        "name": "Test User",
        "email": "test@example.com",
        "role": "user"
    }


app.dependency_overrides[get_database] = override_get_database
app.dependency_overrides[get_current_user] = override_get_current_user


@pytest.fixture
async def async_client():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        yield ac


@pytest.mark.asyncio
async def test_register_professional_ok(async_client: AsyncClient):
    mock_db.users.users = [{
        "_id": "5f9b3b9b9b9b9b9b9b9b9b9b",
        "name": "Test User",
        "email": "test@example.com",
        "role": "user"
    }]
    response = await async_client.post(
        "/api/v1/professional/register",
        json={
            "userId": "5f9b3b9b9b9b9b9b9b9b9b9b",
            "specialty": "Developer",
            "experience": 5,
            "bio": "I code things"
        }
    )
    assert response.status_code == 200, response.text
    data = response.json()
    assert data["message"] == "Perfil profissional registrado com sucesso"
    assert data["user"]["professionalInfo"]["specialty"] == "Developer"


@pytest.mark.asyncio
async def test_register_professional_wrong_user(async_client: AsyncClient):
    mock_db.users.users = [{
        "_id": "5f9b3b9b9b9b9b9b9b9b9b9c",
        "name": "Another",
        "email": "another@example.com",
        "role": "user"
    }]
    response = await async_client.post(
        "/api/v1/professional/register",
        json={
            "userId": "5f9b3b9b9b9b9b9b9b9b9b9c",
            "specialty": "Developer",
            "experience": 5,
            "bio": "I code things"
        }
    )
    assert response.status_code == 403, response.text
