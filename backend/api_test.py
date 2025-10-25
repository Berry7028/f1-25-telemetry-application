from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from typing import List
import threading
import time
import random

app = FastAPI(title="F1 Telemetry API Test")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# グローバル変数: テスト用のプレイヤーデータ
TEST_PLAYERS = [
    {
        "name": "Test Driver 1",
        "position": 1,
        "speed": 250,
        "lastLapTime": 90.5,
        "currentLapTime": 85.2,
        "bestLapTime": 88.0,
        "lapDistance": 1500.0,
        "tyres": "Soft",
        "tyresAgeLaps": 5,
        "tyre_wear": [10, 15, 20, 25],
        "tyres_temp_surface": [80, 85, 90, 95],
        "tyres_temp_inner": [75, 80, 85, 90],
        "ERS_percentage": 50.0,
        "ERS_mode": 1,
        "fuelRemainingLaps": 10.5,
        "fuelMix": 1,
        "networkId": 1,
        "pit": False,
        "teamId": 1,
        "raceNumber": 44,
        "drs": 1,
        "DRS_allowed": 1,
        "DRS_activation_distance": 1000,
        "warnings": 0,
        "penalties": 0,
        "currentSectors": [30.5, 35.2, 19.5],
        "lastLapSectors": [31.0, 34.8, 20.2],
        "bestLapSectors": [29.5, 33.5, 18.0],
        "worldPositionX": 1000.0,
        "worldPositionZ": 2000.0,
        "frontLeftWingDamage": 5,
        "frontRightWingDamage": 3,
        "rearWingDamage": 2,
        "floorDamage": 1,
        "diffuserDamage": 0,
        "sidepodDamage": 4,
        "gap_to_car_ahead": 2.5,
    },
    {
        "name": "Test Driver 2",
        "position": 2,
        "speed": 245,
        "lastLapTime": 91.0,
        "currentLapTime": 86.0,
        "bestLapTime": 89.0,
        "lapDistance": 1450.0,
        "tyres": "Medium",
        "tyresAgeLaps": 3,
        "tyre_wear": [8, 12, 18, 22],
        "tyres_temp_surface": [78, 83, 88, 93],
        "tyres_temp_inner": [73, 78, 83, 88],
        "ERS_percentage": 45.0,
        "ERS_mode": 0,
        "fuelRemainingLaps": 9.8,
        "fuelMix": 0,
        "networkId": 2,
        "pit": False,
        "teamId": 2,
        "raceNumber": 33,
        "drs": 0,
        "DRS_allowed": 1,
        "DRS_activation_distance": 950,
        "warnings": 1,
        "penalties": 0,
        "currentSectors": [31.2, 36.0, 20.1],
        "lastLapSectors": [31.5, 35.5, 20.8],
        "bestLapSectors": [30.0, 34.0, 19.0],
        "worldPositionX": 950.0,
        "worldPositionZ": 1950.0,
        "frontLeftWingDamage": 2,
        "frontRightWingDamage": 1,
        "rearWingDamage": 0,
        "floorDamage": 0,
        "diffuserDamage": 1,
        "sidepodDamage": 2,
        "gap_to_car_ahead": 5.0,
    },
]

# グローバル変数: テスト用のセッションデータ
TEST_SESSION = {
    "track": "Test Track",
    "sessionType": "Race",
    "currentLap": 5,
    "nbLaps": 20,
    "airTemperature": 25.0,
    "trackTemperature": 35.0,
    "flag": "Green",
}

# グローバル変数: テスト用のモーションデータ
TEST_MOTION = [
    {"index": 0, "x": 1000.0, "z": 2000.0},
    {"index": 1, "x": 950.0, "z": 1950.0},
]


@app.get("/api/players")
def get_players():
    return TEST_PLAYERS


@app.get("/api/player/{idx}")
def get_player(idx: int):
    if idx < 0 or idx >= len(TEST_PLAYERS):
        return {"error": "index out of range"}
    return TEST_PLAYERS[idx]


@app.get("/api/session")
def get_session():
    return TEST_SESSION


@app.get("/api/telemetry/motion")
def get_motion():
    return TEST_MOTION


def update_data():
    while True:
        for player in TEST_PLAYERS:
            player["speed"] = random.randint(240, 260)
            player["worldPositionX"] += random.uniform(-5, 5)
            player["worldPositionZ"] += random.uniform(-5, 5)
        for motion in TEST_MOTION:
            motion["x"] += random.uniform(-5, 5)
            motion["z"] += random.uniform(-5, 5)
        time.sleep(0.1)


@app.on_event("startup")
def startup_event():
    t = threading.Thread(target=update_data, daemon=True)
    t.start()


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("api_test:app", host="0.0.0.0", port=8000, reload=False)