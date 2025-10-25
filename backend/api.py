from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import threading
import time
from typing import List

from src.parsers import parser2025
from src.packet_processing import packet_management, variables


app = FastAPI(title="F1 Telemetry API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


def _player_to_dict(p):
    # minimal safe serialization of Player
    return {
        "name": getattr(p, "name", ""),
        "position": getattr(p, "position", None),
        "speed": getattr(p, "speed", None),
        "lastLapTime": getattr(p, "lastLapTime", None),
        "currentLapTime": getattr(p, "currentLapTime", None),
        "bestLapTime": getattr(p, "bestLapTime", None),
        "lapDistance": getattr(p, "lapDistance", None),
        "tyres": getattr(p, "tyres", None),
        "tyresAgeLaps": getattr(p, "tyresAgeLaps", 0),
        "tyre_wear": getattr(p, "tyre_wear", []),
        "tyres_temp_surface": getattr(p, "tyres_temp_surface", [0, 0, 0, 0]),
        "tyres_temp_inner": getattr(p, "tyres_temp_inner", [0, 0, 0, 0]),
        "ERS_percentage": getattr(p, "ERS_pourcentage", None),
        "ERS_mode": getattr(p, "ERS_mode", -1),
        "fuelRemainingLaps": getattr(p, "fuelRemainingLaps", 0),
        "fuelMix": getattr(p, "fuelMix", 0),
        "networkId": getattr(p, "networkId", None),
        "pit": getattr(p, "pit", None),
        "teamId": getattr(p, "teamId", -1),
        "raceNumber": getattr(p, "raceNumber", 0),
        "drs": getattr(p, "drs", 0),
        "DRS_allowed": getattr(p, "DRS_allowed", 0),
        "DRS_activation_distance": getattr(p, "DRS_activation_distance", 0),
        "warnings": getattr(p, "warnings", 0),
        "penalties": getattr(p, "penalties", 0),
        "currentSectors": getattr(p, "currentSectors", [0, 0, 0]),
        "lastLapSectors": getattr(p, "lastLapSectors", [0, 0, 0]),
        "bestLapSectors": getattr(p, "bestLapSectors", [0, 0, 0]),
        "worldPositionX": getattr(p, "worldPositionX", 0),
        "worldPositionZ": getattr(p, "worldPositionZ", 0),
        "frontLeftWingDamage": getattr(p, "frontLeftWingDamage", 0),
        "frontRightWingDamage": getattr(p, "frontRightWingDamage", 0),
        "rearWingDamage": getattr(p, "rearWingDamage", 0),
        "floorDamage": getattr(p, "floorDamage", 0),
        "diffuserDamage": getattr(p, "diffuserDamage", 0),
        "sidepodDamage": getattr(p, "sidepodDamage", 0),
        "gap_to_car_ahead": getattr(p, "gap_to_car_ahead", 0),
    }


@app.get("/api/players")
def get_players():
    return [_player_to_dict(p) for p in variables.PLAYERS_LIST]


@app.get("/api/player/{idx}")
def get_player(idx: int):
    if idx < 0 or idx >= len(variables.PLAYERS_LIST):
        return {"error": "index out of range"}
    return _player_to_dict(variables.PLAYERS_LIST[idx])


@app.get("/api/session")
def get_session():
    s = variables.session
    return {
        "track": getattr(s, "track", None),
        "sessionType": getattr(s, "Session", None),
        "currentLap": getattr(s, "currentLap", None),
        "nbLaps": getattr(s, "nbLaps", None),
        "airTemperature": getattr(s, "airTemperature", None),
        "trackTemperature": getattr(s, "trackTemperature", None),
        "flag": getattr(s, "flag", ""),
    }


@app.get("/api/telemetry/motion")
def get_motion():
    # return world positions for all players
    return [{"index": i, "x": p.worldPositionX, "z": p.worldPositionZ} for i, p in enumerate(variables.PLAYERS_LIST)]


def listener_thread():
    # Start UDP listener (parser2025.Listener) and use packet_management update functions
    listener = parser2025.Listener(port=variables.PORT[0],
                                   adress=variables.dictionnary_settings.get("ip_adress", "127.0.0.1"),
                                   redirect=variables.dictionnary_settings.get("redirect_active", 0),
                                   redirect_port=int(variables.dictionnary_settings.get("redirect_port", variables.PORT[0])))

    try:
        while True:
            a = listener.get()
            if a is not None:
                header, packet = a
                pid = header.m_packet_id
                # map packet id to update functions in packet_management
                if pid == 0:
                    packet_management.update_motion(packet)
                elif pid == 1:
                    packet_management.update_session(packet)
                elif pid == 2:
                    packet_management.update_lap_data(packet)
                elif pid == 3:
                    # event may expect a QListWidget in original; ignore GUI arg
                    try:
                        packet_management.update_event(packet, None)
                    except TypeError:
                        # fallback if function signature changed
                        pass
                elif pid == 4:
                    packet_management.update_participants(packet)
                elif pid == 5:
                    packet_management.update_car_setups(packet)
                elif pid == 6:
                    packet_management.update_car_telemetry(packet)
                elif pid == 7:
                    packet_management.update_car_status(packet)
                elif pid == 10:
                    packet_management.update_car_damage(packet)
                else:
                    # other packets ignored or handled by 'nothing'
                    pass
            else:
                time.sleep(0.001)
    except Exception:
        listener.close()


@app.on_event("startup")
def startup_event():
    t = threading.Thread(target=listener_thread, daemon=True)
    t.start()


if __name__ == "__main__":
    import uvicorn

    uvicorn.run("backend.api:app", host="0.0.0.0", port=8000, reload=False)
