export interface Player {
  name: string;
  position: number | null;
  speed: number | null;
  lastLapTime: number | null;
  currentLapTime: number | null;
  bestLapTime: number | null;
  lapDistance: number | null;
  tyres: number | null;
  tyresAgeLaps: number;
  tyre_wear: string[];
  tyres_temp_surface: number[];
  tyres_temp_inner: number[];
  ERS_percentage: number | null;
  ERS_mode: number;
  fuelRemainingLaps: number;
  fuelMix: number;
  networkId: number | null;
  pit: number | null;
  teamId: number;
  raceNumber: number;
  drs: number;
  DRS_allowed: number;
  DRS_activation_distance: number;
  warnings: number;
  penalties: number;
  currentSectors: number[];
  lastLapSectors: number[];
  bestLapSectors: number[];
  worldPositionX: number;
  worldPositionZ: number;
  frontLeftWingDamage: number;
  frontRightWingDamage: number;
  rearWingDamage: number;
  floorDamage: number;
  diffuserDamage: number;
  sidepodDamage: number;
  gap_to_car_ahead: number;
}

export interface Session {
  track: number | null;
  sessionType: number | null;
  currentLap: number | null;
  nbLaps: number | null;
  airTemperature: number | null;
  trackTemperature: number | null;
  flag: string;
}

export interface MotionData {
  index: number;
  x: number;
  z: number;
}

export const tyresDict: Record<number, string> = {
  0: "S",
  16: "S",
  17: "M",
  18: "H",
  7: "I",
  8: "W"
};

export const tyresColorDict: Record<string, string> = {
  "S": "#FF0000",
  "M": "#FFD700",
  "H": "#FFFFFF",
  "I": "#00FF00",
  "W": "#0000FF"
};

export const sessionDict: Record<number, string> = {
  5: "Q1",
  6: "Q2",
  7: "Q3",
  8: "Short Qualifying",
  9: "One-Shot Qualifying",
  10: "Sprint Shootout 1",
  11: "Sprint Shootout 2",
  12: "Sprint Shootout 3",
  13: "Short Sprint Shootout",
  14: "One-Shot Sprint Shootout",
  15: "Race",
  16: "Sprint",
  17: "Race 2",
  18: "Time Trial"
};

export const trackDict: Record<number, string> = {
  0: "Melbourne",
  1: "Paul Ricard",
  2: "Shanghai",
  3: "Sakhir",
  4: "Catalunya",
  5: "Monaco",
  6: "Montreal",
  7: "Silverstone",
  8: "Hockenheim",
  9: "Hungaroring",
  10: "Spa",
  11: "Monza",
  12: "Singapore",
  13: "Suzuka",
  14: "Abu Dhabi",
  15: "Texas",
  16: "Brazil",
  17: "Austria",
  18: "Sochi",
  19: "Mexico",
  20: "Baku",
  21: "Sakhir Short",
  22: "Silverstone Short",
  23: "Texas Short",
  24: "Suzuka Short",
  25: "Hanoi",
  26: "Zandvoort",
  27: "Imola",
  28: "Portimao",
  29: "Jeddah",
  30: "Miami",
  31: "Las Vegas",
  32: "Losail"
};

export const ERSDict: Record<number, string> = {
  0: "NONE",
  1: "MEDIUM",
  2: "HOTLAP",
  3: "OVERTAKE",
  [-1]: "PRIVATE"
};

export const fuelMixDict: Record<number, string> = {
  0: "Lean",
  1: "Standard",
  2: "Rich",
  3: "Max"
};

export const teamsColorDict: Record<number, string> = {
  [-1]: "#FFFFFF",
  0: "#00C7CD", // Mercedes
  1: "#FF0000", // Ferrari
  2: "#0000FF", // Red Bull
  3: "#5097FF", // Williams
  4: "#00902A", // Aston Martin
  5: "#009BFF", // Alpine
  6: "#00446F", // Alpha Tauri
  7: "#95ACBB", // Haas
  8: "#FFAE00", // McLaren
  9: "#980404", // Alfa Romeo
  41: "#000000", // Multi
  104: "#670498",
  255: "#670498"
};

export const teamsNameDict: Record<number, string> = {
  [-1]: "Unknown",
  0: "Mercedes",
  1: "Ferrari",
  2: "Red Bull",
  3: "Williams",
  4: "Aston Martin",
  5: "Alpine",
  6: "Alpha Tauri",
  7: "Haas",
  8: "McLaren",
  9: "Alfa Romeo",
  41: "Multi"
};

export const formatTime = (milliseconds: number | null): string => {
  if (!milliseconds) return "--:--.---";
  const minutes = Math.floor(milliseconds / 60000);
  const seconds = Math.floor((milliseconds % 60000) / 1000);
  const ms = Math.floor(milliseconds % 1000);
  
  if (minutes > 0) {
    return `${minutes}:${seconds.toString().padStart(2, '0')}.${ms.toString().padStart(3, '0')}`;
  }
  return `${seconds}.${ms.toString().padStart(3, '0')}`;
};

export const getTempColor = (temp: number, isBrake: boolean = false): string => {
  if (isBrake) {
    // Brake temp colors
    if (temp < 200) return '#00ff00'; // Green
    if (temp < 300) return '#ffff00'; // Yellow
    if (temp < 400) return '#ff9300'; // Orange
    return '#ff0000'; // Red
  } else {
    // Tire temp colors
    if (temp < 80) return '#0000ff'; // Blue
    if (temp < 90) return '#00ff00'; // Green
    if (temp < 100) return '#ffff00'; // Yellow
    return '#ff0000'; // Red
  }
};
