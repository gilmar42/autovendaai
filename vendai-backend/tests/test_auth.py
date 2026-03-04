import pytest
from httpx import AsyncClient, ASGITransport
from typing import AsyncGenerator
from main import app
from app.core.database import get_database
from app.core.security import get_password_hash
from bson import ObjectId


class MockCursor:
    def __init__(self, data):
        self.data = data
        self.idx = 0

    def __aiter__(self):
        return self

    async def __anext__(self):
        if self.idx < len(self.data):
            res = self.data[self.idx]
            self.idx += 1
            return res
        else:
            raise StopAsyncIteration


class MockCollection:
    def __init__(self):
        self.users = []

    async def insert_one(self, data):
        class Result:
            inserted_id = str(ObjectId())
        data["_id"] = Result.inserted_id
        self.users.append(data.copy())
        return Result()

    async def find_one(self, query):
        for u in self.users:
            if u.get("email") == query.get("email"):
                return u.copy()
        return None


class MockDB:
    def __init__(self):
        self._users = MockCollection()

    @property
    def users(self):
        return self._users


mock_db = MockDB()


async def override_get_database():
    return mock_db

app.dependency_overrides[get_database] = override_get_database


@pytest.fixture
async def async_client() -> AsyncGenerator[AsyncClient, None]:
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        yield ac


@pytest.mark.asyncio
async def test_register_user(async_client: AsyncClient):
    # Limpar mock para teste isolado
    mock_db.users.users = []
    response = await async_client.post(
        "/api/v1/auth/register",
        json={
            "name": "Test User",
            "email": "test@example.com",
            "password": "password123"
        }
    )
    assert response.status_code == 200, response.text
    data = response.json()
    assert "token" in data
    assert "user" in data
    assert data["user"]["email"] == "test@example.com"
    assert data["user"]["name"] == "Test User"


@pytest.mark.asyncio
async def test_register_existing_user(async_client: AsyncClient):
    mock_db.users.users = [{
        "_id": "some_id",
        "name": "Existing",
        "email": "existing@example.com",
        "password": get_password_hash("password123"),
        "role": "user"
    }]
    response = await async_client.post(
        "/api/v1/auth/register",
        json={
            "name": "Existing",
            "email": "existing@example.com",
            "password": "password123"
        }
    )
    assert response.status_code == 409, response.text


@pytest.mark.asyncio
async def test_login_user(async_client: AsyncClient):
    mock_db.users.users = [{
        "_id": "some_id",
        "name": "Login User",
        "email": "login@example.com",
        "password": get_password_hash("password123"),
        "role": "user"
    }]
    response = await async_client.post(
        "/api/v1/auth/login",
        json={
            "email": "login@example.com",
            "password": "password123"
        }
    )
    assert response.status_code == 200, response.text
    data = response.json()
    assert "token" in data
    assert data["user"]["email"] == "login@example.com"


@pytest.mark.asyncio
async def test_login_invalid_credentials(async_client: AsyncClient):
    mock_db.users.users = [{
        "_id": "some_id",
        "name": "Fail User",
        "email": "fail@example.com",
        "password": get_password_hash("password123"),
        "role": "user"
    }]
    response = await async_client.post(
        "/api/v1/auth/login",
        json={
            "email": "fail@example.com",
            "password": "wrongpassword"
        }
    )
    assert response.status_code == 401, response.text
