import pytest
from httpx import AsyncClient, ASGITransport
from main import app


@pytest.fixture
async def async_client():
    async with AsyncClient(transport=ASGITransport(app=app), base_url="http://test") as ac:
        yield ac


@pytest.mark.asyncio
async def test_process_payment(async_client: AsyncClient):
    response = await async_client.post("/api/v1/payments/pay")
    assert response.status_code == 200, response.text
    assert response.json() == {"message": "Pagamento processado (mock)"}
