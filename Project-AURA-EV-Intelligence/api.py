from fastapi import FastAPI
from pydantic import BaseModel

app = FastAPI(title="Project AURA EV Intelligence API")


class StatusResponse(BaseModel):
    status: str
    message: str


@app.get("/", response_model=StatusResponse)
def root() -> StatusResponse:
    return StatusResponse(status="ok", message="Project AURA API is online")


@app.get("/health", response_model=StatusResponse)
def health() -> StatusResponse:
    return StatusResponse(status="healthy", message="Service is available")
