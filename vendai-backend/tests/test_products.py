import pytest
from httpx import AsyncClient, ASGITransport
from typing import AsyncGenerator
from main import app
from app.middleware.tenant import get_current_tenant
from app.core.database import get_database
from bson import ObjectId

# Mocks


async def override_get_current_tenant():
    return "test_tenant"


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
        self.products = []

    async def insert_one(self, data):
        class Result:
            inserted_id = ObjectId("5f9b3b9b9b9b9b9b9b9b9b9b")
        data["_id"] = Result.inserted_id
        self.products.append(data.copy())
        return Result()

    def find(self, query):
        return MockCursor([p.copy() for p in self.products])

    async def find_one(self, query):
        if self.products:
            return self.products[0].copy()
        return None

    async def update_one(self, query, update):
        class Result:
            matched_count = 1 if self.products else 0
        if self.products:
            self.products[0].update(update.get("$set", {}))
        return Result()

    async def delete_one(self, query):
        class Result:
            deleted_count = 1 if self.products else 0
        if self.products:
            self.products.pop()
        return Result()


class MockDB:
    def __init__(self):
        self._products = MockCollection()

    @property
    def products(self):
        return self._products


mock_db = MockDB()


async def override_get_database():
    return mock_db

# Override dependencies
app.dependency_overrides[get_current_tenant] = override_get_current_tenant
app.dependency_overrides[get_database] = override_get_database


@pytest.fixture
async def async_client() -> AsyncGenerator[AsyncClient, None]:
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        yield ac


@pytest.mark.asyncio
async def test_create_product(async_client: AsyncClient):
    response = await async_client.post(
        "/api/v1/products/",
        json={
            "name": "Test Product",
            "description": "A product for testing",
            "price": 10.5,
            "stock": 50
        }
    )
    assert response.status_code == 200, response.text
    data = response.json()
    assert data["name"] == "Test Product"
    assert data["price"] == 10.5
    assert "id" in data
    assert data["id"] == "5f9b3b9b9b9b9b9b9b9b9b9b"


@pytest.mark.asyncio
async def test_list_products(async_client: AsyncClient):
    response = await async_client.get("/api/v1/products/")
    assert response.status_code == 200, response.text
    data = response.json()
    assert isinstance(data, list)
    assert len(data) > 0
    assert data[0]["name"] == "Test Product"


@pytest.mark.asyncio
async def test_get_product(async_client: AsyncClient):
    response = await async_client.get("/api/v1/products/5f9b3b9b9b9b9b9b9b9b9b9b")
    assert response.status_code == 200, response.text
    data = response.json()
    assert data["name"] == "Test Product"


@pytest.mark.asyncio
async def test_update_product(async_client: AsyncClient):
    response = await async_client.put(
        "/api/v1/products/5f9b3b9b9b9b9b9b9b9b9b9b",
        json={
            "name": "Updated Test Product",
            "description": "Updated description",
            "price": 20.0,
            "stock": 40
        }
    )
    assert response.status_code == 200, response.text
    data = response.json()
    assert data["name"] == "Updated Test Product"
    assert data["price"] == 20.0


@pytest.mark.asyncio
async def test_delete_product(async_client: AsyncClient):
    response = await async_client.delete("/api/v1/products/5f9b3b9b9b9b9b9b9b9b9b9b")
    assert response.status_code == 200, response.text
    data = response.json()
    assert data["message"] == "Produto deletado com sucesso"
