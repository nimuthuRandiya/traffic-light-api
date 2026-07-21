// ============================================
// උසස් දිශා පාලන ට්‍රැෆික් ලයිට් පද්ධතිය
// සෑම දිශාවක්ම තනි තනිව පාලනය කිරීම
// ============================================

// හදිසි පාලන ගබඩාව
let emergencyOverrides = {};

// හදිසි ප්‍රතිසාධනය සඳහා මුල් තත්ව ගබඩා කිරීම
const ORIGINAL_TIMERS = {};
const ORIGINAL_STATUSES = {};

// ============================================
// ශ්‍රී ලංකා නගර සඳහා ට්‍රැෆික් ලයිට් තත්ව කළමනාකරණය
// සෑම දිශාවකටම වෙන වෙනම පාලනය
// ============================================
const trafficLights = {
  colombo: {
    city: 'Colombo',
    province: 'Western',
    phase: 'vertical-green',
    phaseTimer: 90,
    directions: {
      up: { status: 'green', timer: 90 },
      down: { status: 'red', timer: 90 },    // up green, down red
      left: { status: 'red', timer: 90 },
      right: { status: 'red', timer: 90 }
    }
  },
  kandy: {
    city: 'Kandy',
    province: 'Central',
    phase: 'horizontal-green',
    phaseTimer: 75,
    directions: {
      up: { status: 'red', timer: 75 },
      down: { status: 'red', timer: 75 },
      left: { status: 'green', timer: 75 },
      right: { status: 'green', timer: 75 }
    }
  },
  galle: {
    city: 'Galle',
    province: 'Southern',
    phase: 'horizontal-green',
    phaseTimer: 70,
    directions: {
      up: { status: 'red', timer: 70 },
      down: { status: 'red', timer: 70 },
      left: { status: 'green', timer: 70 },
      right: { status: 'green', timer: 70 }
    }
  },
  negombo: {
    city: 'Negombo',
    province: 'Western',
    phase: 'vertical-green',
    phaseTimer: 85,
    directions: {
      up: { status: 'green', timer: 85 },
      down: { status: 'red', timer: 85 },    // up green, down red
      left: { status: 'red', timer: 85 },
      right: { status: 'red', timer: 85 }
    }
  },
  jaffna: {
    city: 'Jaffna',
    province: 'Northern',
    phase: 'horizontal-green',
    phaseTimer: 65,
    directions: {
      up: { status: 'red', timer: 65 },
      down: { status: 'red', timer: 65 },
      left: { status: 'green', timer: 65 },
      right: { status: 'green', timer: 65 }
    }
  },
  anuradhapura: {
    city: 'Anuradhapura',
    province: 'North Central',
    phase: 'vertical-green',
    phaseTimer: 80,
    directions: {
      up: { status: 'green', timer: 80 },
      down: { status: 'red', timer: 80 },
      left: { status: 'red', timer: 80 },
      right: { status: 'red', timer: 80 }
    }
  },
  polonnaruwa: {
    city: 'Polonnaruwa',
    province: 'North Central',
    phase: 'horizontal-green',
    phaseTimer: 60,
    directions: {
      up: { status: 'red', timer: 60 },
      down: { status: 'red', timer: 60 },
      left: { status: 'green', timer: 60 },
      right: { status: 'green', timer: 60 }
    }
  },
  badulla: {
    city: 'Badulla',
    province: 'Uva',
    phase: 'horizontal-green',
    phaseTimer: 70,
    directions: {
      up: { status: 'red', timer: 70 },
      down: { status: 'red', timer: 70 },
      left: { status: 'green', timer: 70 },
      right: { status: 'green', timer: 70 }
    }
  },
  ratnapura: {
    city: 'Ratnapura',
    province: 'Sabaragamuwa',
    phase: 'vertical-green',
    phaseTimer: 75,
    directions: {
      up: { status: 'green', timer: 75 },
      down: { status: 'red', timer: 75 },
      left: { status: 'red', timer: 75 },
      right: { status: 'red', timer: 75 }
    }
  },
  kurunegala_1: {
    city: 'Kurunegala - Main',
    province: 'North Western',
    phase: 'vertical-green',
    phaseTimer: 90,
    directions: {
      up: { status: 'green', timer: 90 },
      down: { status: 'red', timer: 90 },
      left: { status: 'red', timer: 90 },
      right: { status: 'red', timer: 90 }
    }
  },
  kurunegala_2: {
    city: 'Kurunegala - Town Hall',
    province: 'North Western',
    phase: 'horizontal-green',
    phaseTimer: 60,
    directions: {
      up: { status: 'red', timer: 60 },
      down: { status: 'red', timer: 60 },
      left: { status: 'green', timer: 60 },
      right: { status: 'green', timer: 60 }
    }
  },
  kurunegala_3: {
    city: 'Kurunegala - Railway',
    province: 'North Western',
    phase: 'horizontal-green',
    phaseTimer: 65,
    directions: {
      up: { status: 'red', timer: 65 },
      down: { status: 'red', timer: 65 },
      left: { status: 'green', timer: 65 },
      right: { status: 'green', timer: 65 }
    }
  },
  kurunegala_4: {
    city: 'Kurunegala - Hospital',
    province: 'North Western',
    phase: 'vertical-green',
    phaseTimer: 70,
    directions: {
      up: { status: 'green', timer: 70 },
      down: { status: 'red', timer: 70 },
      left: { status: 'red', timer: 70 },
      right: { status: 'red', timer: 70 }
    }
  },
  kurunegala_5: {
    city: 'Kurunegala - Bus Stand',
    province: 'North Western',
    phase: 'horizontal-green',
    phaseTimer: 80,
    directions: {
      up: { status: 'red', timer: 80 },
      down: { status: 'red', timer: 80 },
      left: { status: 'green', timer: 80 },
      right: { status: 'green', timer: 80 }
    }
  },
  matara: {
    city: 'Matara',
    province: 'Southern',
    phase: 'horizontal-green',
    phaseTimer: 65,
    directions: {
      up: { status: 'red', timer: 65 },
      down: { status: 'red', timer: 65 },
      left: { status: 'green', timer: 65 },
      right: { status: 'green', timer: 65 }
    }
  },
  batticaloa: {
    city: 'Batticaloa',
    province: 'Eastern',
    phase: 'vertical-green',
    phaseTimer: 75,
    directions: {
      up: { status: 'green', timer: 75 },
      down: { status: 'red', timer: 75 },
      left: { status: 'red', timer: 75 },
      right: { status: 'red', timer: 75 }
    }
  },
  trincomalee: {
    city: 'Trincomalee',
    province: 'Eastern',
    phase: 'horizontal-green',
    phaseTimer: 60,
    directions: {
      up: { status: 'red', timer: 60 },
      down: { status: 'red', timer: 60 },
      left: { status: 'green', timer: 60 },
      right: { status: 'green', timer: 60 }
    }
  },
  kalutara: {
    city: 'Kalutara',
    province: 'Western',
    phase: 'horizontal-green',
    phaseTimer: 70,
    directions: {
      up: { status: 'red', timer: 70 },
      down: { status: 'red', timer: 70 },
      left: { status: 'green', timer: 70 },
      right: { status: 'green', timer: 70 }
    }
  },
  avissawella: {
    city: 'Avissawella',
    province: 'Western',
    phase: 'vertical-green',
    phaseTimer: 80,
    directions: {
      up: { status: 'green', timer: 80 },
      down: { status: 'red', timer: 80 },
      left: { status: 'red', timer: 80 },
      right: { status: 'red', timer: 80 }
    }
  },
  gampaha: {
    city: 'Gampaha',
    province: 'Western',
    phase: 'horizontal-green',
    phaseTimer: 65,
    directions: {
      up: { status: 'red', timer: 65 },
      down: { status: 'red', timer: 65 },
      left: { status: 'green', timer: 65 },
      right: { status: 'green', timer: 65 }
    }
  },
  matale: {
    city: 'Matale',
    province: 'Central',
    phase: 'vertical-green',
    phaseTimer: 70,
    directions: {
      up: { status: 'green', timer: 70 },
      down: { status: 'red', timer: 70 },
      left: { status: 'red', timer: 70 },
      right: { status: 'red', timer: 70 }
    }
  },
  nugegoda: {
    city: 'Nugegoda',
    province: 'Western',
    phase: 'horizontal-green',
    phaseTimer: 75,
    directions: {
      up: { status: 'red', timer: 75 },
      down: { status: 'red', timer: 75 },
      left: { status: 'green', timer: 75 },
      right: { status: 'green', timer: 75 }
    }
  },
  moratuwa: {
    city: 'Moratuwa',
    province: 'Western',
    phase: 'vertical-green',
    phaseTimer: 80,
    directions: {
      up: { status: 'green', timer: 80 },
      down: { status: 'red', timer: 80 },
      left: { status: 'red', timer: 80 },
      right: { status: 'red', timer: 80 }
    }
  },
  dehiwala: {
    city: 'Dehiwala',
    province: 'Western',
    phase: 'horizontal-green',
    phaseTimer: 60,
    directions: {
      up: { status: 'red', timer: 60 },
      down: { status: 'red', timer: 60 },
      left: { status: 'green', timer: 60 },
      right: { status: 'green', timer: 60 }
    }
  },
  mountlavinia: {
    city: 'Mount Lavinia',
    province: 'Western',
    phase: 'horizontal-green',
    phaseTimer: 65,
    directions: {
      up: { status: 'red', timer: 65 },
      down: { status: 'red', timer: 65 },
      left: { status: 'green', timer: 65 },
      right: { status: 'green', timer: 65 }
    }
  },
  chilaw: {
    city: 'Chilaw',
    province: 'North Western',
    phase: 'vertical-green',
    phaseTimer: 75,
    directions: {
      up: { status: 'green', timer: 75 },
      down: { status: 'red', timer: 75 },
      left: { status: 'red', timer: 75 },
      right: { status: 'red', timer: 75 }
    }
  },
  puttalam: {
    city: 'Puttalam',
    province: 'North Western',
    phase: 'horizontal-green',
    phaseTimer: 60,
    directions: {
      up: { status: 'red', timer: 60 },
      down: { status: 'red', timer: 60 },
      left: { status: 'green', timer: 60 },
      right: { status: 'green', timer: 60 }
    }
  },
  homagama: {
    city: 'Homagama',
    province: 'Western',
    phase: 'horizontal-green',
    phaseTimer: 70,
    directions: {
      up: { status: 'red', timer: 70 },
      down: { status: 'red', timer: 70 },
      left: { status: 'green', timer: 70 },
      right: { status: 'green', timer: 70 }
    }
  },
  maharagama: {
    city: 'Maharagama',
    province: 'Western',
    phase: 'vertical-green',
    phaseTimer: 85,
    directions: {
      up: { status: 'green', timer: 85 },
      down: { status: 'red', timer: 85 },
      left: { status: 'red', timer: 85 },
      right: { status: 'red', timer: 85 }
    }
  }
};

// ============================================
// මුල් තත්ව ආරම්භ කිරීම
// ============================================
function initializeOriginalStates() {
  Object.keys(trafficLights).forEach(location => {
    if (!ORIGINAL_TIMERS[location]) ORIGINAL_TIMERS[location] = {};
    if (!ORIGINAL_STATUSES[location]) ORIGINAL_STATUSES[location] = {};
    
    const directions = ['up', 'down', 'left', 'right'];
    directions.forEach(dir => {
      const light = trafficLights[location].directions[dir];
      if (light) {
        ORIGINAL_TIMERS[location][dir] = light.timer;
        ORIGINAL_STATUSES[location][dir] = light.status;
      }
    });
  });
}

initializeOriginalStates();

// ============================================
// IoT සංවේදක දත්ත
// ============================================
const iotData = {
  cameras: {
    colombo: { id: 'CAM-001', location: 'Colombo', status: 'active', vehiclesDetected: 45, pedestrians: 12, timestamp: new Date().toISOString() },
    kandy: { id: 'CAM-002', location: 'Kandy', status: 'active', vehiclesDetected: 28, pedestrians: 8, timestamp: new Date().toISOString() },
    galle: { id: 'CAM-003', location: 'Galle', status: 'active', vehiclesDetected: 32, pedestrians: 15, timestamp: new Date().toISOString() },
    negombo: { id: 'CAM-004', location: 'Negombo', status: 'active', vehiclesDetected: 38, pedestrians: 10, timestamp: new Date().toISOString() },
    jaffna: { id: 'CAM-005', location: 'Jaffna', status: 'active', vehiclesDetected: 22, pedestrians: 6, timestamp: new Date().toISOString() },
    kurunegala_1: { id: 'CAM-006', location: 'Kurunegala - Main', status: 'active', vehiclesDetected: 35, pedestrians: 14, timestamp: new Date().toISOString() },
    kurunegala_2: { id: 'CAM-007', location: 'Kurunegala - Town Hall', status: 'active', vehiclesDetected: 29, pedestrians: 11, timestamp: new Date().toISOString() },
    kurunegala_3: { id: 'CAM-008', location: 'Kurunegala - Railway', status: 'active', vehiclesDetected: 42, pedestrians: 9, timestamp: new Date().toISOString() },
    kurunegala_4: { id: 'CAM-009', location: 'Kurunegala - Hospital', status: 'active', vehiclesDetected: 31, pedestrians: 13, timestamp: new Date().toISOString() },
    kurunegala_5: { id: 'CAM-010', location: 'Kurunegala - Bus Stand', status: 'active', vehiclesDetected: 48, pedestrians: 18, timestamp: new Date().toISOString() }
  },
  inductiveLoops: {
    colombo: { id: 'LOOP-001', location: 'Colombo', vehicleCount: 156, avgSpeed: 35, congestion: 'medium', timestamp: new Date().toISOString() },
    kandy: { id: 'LOOP-002', location: 'Kandy', vehicleCount: 89, avgSpeed: 42, congestion: 'low', timestamp: new Date().toISOString() },
    galle: { id: 'LOOP-003', location: 'Galle', vehicleCount: 124, avgSpeed: 28, congestion: 'high', timestamp: new Date().toISOString() },
    negombo: { id: 'LOOP-004', location: 'Negombo', vehicleCount: 98, avgSpeed: 38, congestion: 'medium', timestamp: new Date().toISOString() },
    jaffna: { id: 'LOOP-005', location: 'Jaffna', vehicleCount: 67, avgSpeed: 45, congestion: 'low', timestamp: new Date().toISOString() },
    kurunegala_1: { id: 'LOOP-006', location: 'Kurunegala - Main', vehicleCount: 112, avgSpeed: 32, congestion: 'medium', timestamp: new Date().toISOString() },
    kurunegala_2: { id: 'LOOP-007', location: 'Kurunegala - Town Hall', vehicleCount: 78, avgSpeed: 40, congestion: 'low', timestamp: new Date().toISOString() },
    kurunegala_3: { id: 'LOOP-008', location: 'Kurunegala - Railway', vehicleCount: 95, avgSpeed: 30, congestion: 'medium', timestamp: new Date().toISOString() },
    kurunegala_4: { id: 'LOOP-009', location: 'Kurunegala - Hospital', vehicleCount: 65, avgSpeed: 44, congestion: 'low', timestamp: new Date().toISOString() },
    kurunegala_5: { id: 'LOOP-010', location: 'Kurunegala - Bus Stand', vehicleCount: 145, avgSpeed: 25, congestion: 'high', timestamp: new Date().toISOString() }
  },
  airQuality: {
    colombo: { id: 'AQ-001', location: 'Colombo', aqi: 85, pm25: 35, pm10: 55, co2: 420, no2: 15, status: 'moderate', timestamp: new Date().toISOString() },
    kandy: { id: 'AQ-002', location: 'Kandy', aqi: 62, pm25: 22, pm10: 38, co2: 380, no2: 10, status: 'good', timestamp: new Date().toISOString() },
    galle: { id: 'AQ-003', location: 'Galle', aqi: 45, pm25: 15, pm10: 28, co2: 350, no2: 8, status: 'good', timestamp: new Date().toISOString() },
    negombo: { id: 'AQ-004', location: 'Negombo', aqi: 78, pm25: 30, pm10: 48, co2: 400, no2: 12, status: 'moderate', timestamp: new Date().toISOString() },
    jaffna: { id: 'AQ-005', location: 'Jaffna', aqi: 55, pm25: 20, pm10: 32, co2: 370, no2: 9, status: 'good', timestamp: new Date().toISOString() },
    kurunegala_1: { id: 'AQ-006', location: 'Kurunegala - Main', aqi: 72, pm25: 28, pm10: 45, co2: 390, no2: 11, status: 'moderate', timestamp: new Date().toISOString() },
    kurunegala_2: { id: 'AQ-007', location: 'Kurunegala - Town Hall', aqi: 58, pm25: 20, pm10: 35, co2: 365, no2: 9, status: 'good', timestamp: new Date().toISOString() },
    kurunegala_3: { id: 'AQ-008', location: 'Kurunegala - Railway', aqi: 68, pm25: 25, pm10: 40, co2: 385, no2: 10, status: 'moderate', timestamp: new Date().toISOString() },
    kurunegala_4: { id: 'AQ-009', location: 'Kurunegala - Hospital', aqi: 52, pm25: 18, pm10: 30, co2: 360, no2: 8, status: 'good', timestamp: new Date().toISOString() },
    kurunegala_5: { id: 'AQ-010', location: 'Kurunegala - Bus Stand', aqi: 92, pm25: 38, pm10: 58, co2: 430, no2: 16, status: 'moderate', timestamp: new Date().toISOString() }
  },
  fleet: {
    bus1: { id: 'BUS-001', type: 'Bus', route: 'Colombo-Kandy', status: 'moving', speed: 45, lat: 7.2906, lng: 80.6337, passengers: 32, driver: 'Mr. Perera', timestamp: new Date().toISOString() },
    bus2: { id: 'BUS-002', type: 'Bus', route: 'Colombo-Galle', status: 'stopped', speed: 0, lat: 6.0322, lng: 80.2168, passengers: 28, driver: 'Mr. Silva', timestamp: new Date().toISOString() },
    bus3: { id: 'BUS-003', type: 'Bus', route: 'Kandy-Jaffna', status: 'moving', speed: 38, lat: 8.3114, lng: 80.4037, passengers: 25, driver: 'Mr. Kumar', timestamp: new Date().toISOString() },
    bus4: { id: 'BUS-004', type: 'Bus', route: 'Colombo-Negombo', status: 'moving', speed: 52, lat: 7.2086, lng: 79.8357, passengers: 18, driver: 'Ms. Fernando', timestamp: new Date().toISOString() },
    bus5: { id: 'BUS-005', type: 'Bus', route: 'Kurunegala-Colombo', status: 'moving', speed: 42, lat: 7.4863, lng: 80.3647, passengers: 30, driver: 'Mr. Bandara', timestamp: new Date().toISOString() },
    bus6: { id: 'BUS-006', type: 'Bus', route: 'Kurunegala-Kandy', status: 'moving', speed: 35, lat: 7.4670, lng: 80.6234, passengers: 22, driver: 'Mr. Weerasinghe', timestamp: new Date().toISOString() },
    truck1: { id: 'TRK-001', type: 'Truck', route: 'Colombo-Kandy', status: 'moving', speed: 30, lat: 7.0877, lng: 79.9925, passengers: 0, driver: 'Mr. Jayasuriya', timestamp: new Date().toISOString() },
    truck2: { id: 'TRK-002', type: 'Truck', route: 'Kurunegala-Colombo', status: 'moving', speed: 28, lat: 7.5755, lng: 79.7951, passengers: 0, driver: 'Mr. Fernando', timestamp: new Date().toISOString() },
    van1: { id: 'VAN-001', type: 'Van', route: 'Colombo-Galle', status: 'idle', speed: 0, lat: 6.8409, lng: 79.8750, passengers: 12, driver: 'Mr. Rathnayake', timestamp: new Date().toISOString() },
    van2: { id: 'VAN-002', type: 'Van', route: 'Kurunegala-Anuradhapura', status: 'moving', speed: 48, lat: 8.0362, lng: 79.8352, passengers: 8, driver: 'Ms. Kumari', timestamp: new Date().toISOString() }
  }
};

let previousStates = JSON.parse(JSON.stringify(trafficLights));
let previousIotData = JSON.parse(JSON.stringify(iotData));
const clients = new Set();

// ============================================
// සහායක ශ්‍රිත (ආරක්ෂිත පාලනය)
// ============================================

function getCityDirections(location) {
  if (!trafficLights[location]) return null;
  return trafficLights[location].directions;
}

function getDirectionStatus(location, direction) {
  if (!trafficLights[location]) return null;
  if (!trafficLights[location].directions[direction]) return null;
  return trafficLights[location].directions[direction];
}

// ============================================
// දිශා පාලන ශ්‍රිත - ගැටීම් සම්පූර්ණයෙන් වැළැක්වීම
// ============================================
function setDirectionStatus(location, direction, status, timer) {
  if (!trafficLights[location]) return false;
  if (!trafficLights[location].directions[direction]) return false;
  
  // ආරක්ෂිත පාලනය - එකම දිශාවකට පමණක් Green ලබා දීම
  if (status === 'green') {
    // වෙනත් සියලුම දිශා Red කිරීම
    const allDirections = ['up', 'down', 'left', 'right'];
    allDirections.forEach(dir => {
      if (dir !== direction && trafficLights[location].directions[dir]) {
        trafficLights[location].directions[dir].status = 'red';
        if (timer !== undefined) {
          trafficLights[location].directions[dir].timer = timer;
        }
      }
    });
  }
  
  trafficLights[location].directions[direction].status = status;
  if (timer !== undefined) {
    trafficLights[location].directions[direction].timer = timer;
  }
  return true;
}

// ============================================
// විශේෂිත දිශා රටා පාලනය
// ============================================

// රටාව 1: Up Green, අනෙකුත් සියල්ල Red
function setPatternUpGreen(location, timer) {
  if (!trafficLights[location]) return false;
  const dirs = trafficLights[location].directions;
  dirs.up.status = 'green';
  dirs.up.timer = timer || 60;
  dirs.down.status = 'red';
  dirs.down.timer = timer || 60;
  dirs.left.status = 'red';
  dirs.left.timer = timer || 60;
  dirs.right.status = 'red';
  dirs.right.timer = timer || 60;
  return true;
}

// රටාව 2: Down Green, අනෙකුත් සියල්ල Red
function setPatternDownGreen(location, timer) {
  if (!trafficLights[location]) return false;
  const dirs = trafficLights[location].directions;
  dirs.up.status = 'red';
  dirs.up.timer = timer || 60;
  dirs.down.status = 'green';
  dirs.down.timer = timer || 60;
  dirs.left.status = 'red';
  dirs.left.timer = timer || 60;
  dirs.right.status = 'red';
  dirs.right.timer = timer || 60;
  return true;
}

// රටාව 3: Left Green, අනෙකුත් සියල්ල Red
function setPatternLeftGreen(location, timer) {
  if (!trafficLights[location]) return false;
  const dirs = trafficLights[location].directions;
  dirs.up.status = 'red';
  dirs.up.timer = timer || 60;
  dirs.down.status = 'red';
  dirs.down.timer = timer || 60;
  dirs.left.status = 'green';
  dirs.left.timer = timer || 60;
  dirs.right.status = 'red';
  dirs.right.timer = timer || 60;
  return true;
}

// රටාව 4: Right Green, අනෙකුත් සියල්ල Red
function setPatternRightGreen(location, timer) {
  if (!trafficLights[location]) return false;
  const dirs = trafficLights[location].directions;
  dirs.up.status = 'red';
  dirs.up.timer = timer || 60;
  dirs.down.status = 'red';
  dirs.down.timer = timer || 60;
  dirs.left.status = 'red';
  dirs.left.timer = timer || 60;
  dirs.right.status = 'green';
  dirs.right.timer = timer || 60;
  return true;
}

// රටාව 5: Vertical Pair (Up & Down) Green, Horizontal Red
function setPatternVerticalGreen(location, timer) {
  if (!trafficLights[location]) return false;
  const dirs = trafficLights[location].directions;
  dirs.up.status = 'green';
  dirs.up.timer = timer || 60;
  dirs.down.status = 'green';
  dirs.down.timer = timer || 60;
  dirs.left.status = 'red';
  dirs.left.timer = timer || 60;
  dirs.right.status = 'red';
  dirs.right.timer = timer || 60;
  return true;
}

// රටාව 6: Horizontal Pair (Left & Right) Green, Vertical Red
function setPatternHorizontalGreen(location, timer) {
  if (!trafficLights[location]) return false;
  const dirs = trafficLights[location].directions;
  dirs.up.status = 'red';
  dirs.up.timer = timer || 60;
  dirs.down.status = 'red';
  dirs.down.timer = timer || 60;
  dirs.left.status = 'green';
  dirs.left.timer = timer || 60;
  dirs.right.status = 'green';
  dirs.right.timer = timer || 60;
  return true;
}

// රටාව 7: All Red (හදිසි නැවතුම)
function setPatternAllRed(location) {
  if (!trafficLights[location]) return false;
  const dirs = trafficLights[location].directions;
  ['up', 'down', 'left', 'right'].forEach(dir => {
    dirs[dir].status = 'red';
    dirs[dir].timer = 0;
  });
  return true;
}

// ============================================
// මුල් තත්වයට නැවත සැකසීම
// ============================================
function resetCityToOriginalState(location) {
  if (!trafficLights[location]) return false;
  if (!ORIGINAL_STATUSES[location]) return false;
  
  const directions = ['up', 'down', 'left', 'right'];
  directions.forEach(dir => {
    if (trafficLights[location].directions[dir]) {
      trafficLights[location].directions[dir].status = ORIGINAL_STATUSES[location][dir] || 'green';
      trafficLights[location].directions[dir].timer = ORIGINAL_TIMERS[location][dir] || 60;
    }
  });
  
  return true;
}

function broadcastUpdate(data) {
  const message = JSON.stringify(data);
  clients.forEach(client => {
    if (client.readyState === 1) {
      client.send(message);
    }
  });
}

// ============================================
// ට්‍රැෆික් ලයිට් යාවත්කාලීන කිරීම - උසස් දිශා පාලනය
// ============================================
function updateTrafficLights() {
  const locations = Object.keys(trafficLights);
  const changes = [];
  const now = Date.now();
  const expiredLocations = [];
  
  // හදිසි පාලන කල් ඉකුත් වීම පරීක්ෂා කිරීම
  Object.keys(emergencyOverrides).forEach(location => {
    const override = emergencyOverrides[location];
    if (new Date(override.expires).getTime() < now) {
      expiredLocations.push(location);
    }
  });
  
  expiredLocations.forEach(location => {
    delete emergencyOverrides[location];
    if (trafficLights[location]) {
      resetCityToOriginalState(location);
      broadcastUpdate({
        type: 'emergencyStopped',
        location: location,
        city: trafficLights[location].city,
        province: trafficLights[location].province,
        timestamp: new Date().toISOString()
      });
    }
  });
  
  locations.forEach(location => {
    if (emergencyOverrides[location]) return;
    
    const cityLights = trafficLights[location];
    const currentPhase = cityLights.phase;
    
    cityLights.phaseTimer -= 1;
    
    if (cityLights.phaseTimer <= 0) {
      let newPhase = '';
      let newTimer = 0;
      
      switch (currentPhase) {
        case 'vertical-green':
          // Up & Down Green -> Yellow
          newPhase = 'vertical-yellow';
          newTimer = 5;
          
          cityLights.directions.up.status = 'yellow';
          cityLights.directions.up.timer = 5;
          cityLights.directions.down.status = 'yellow';
          cityLights.directions.down.timer = 5;
          cityLights.directions.left.status = 'red';
          cityLights.directions.left.timer = 5;
          cityLights.directions.right.status = 'red';
          cityLights.directions.right.timer = 5;
          break;
          
        case 'vertical-yellow':
          // Yellow -> Horizontal Green
          newPhase = 'horizontal-green';
          newTimer = cityLights.phaseTimer < 0 ? 60 : cityLights.phaseTimer;
          
          // Up & Down -> Red, Left & Right -> Green
          cityLights.directions.up.status = 'red';
          cityLights.directions.up.timer = newTimer;
          cityLights.directions.down.status = 'red';
          cityLights.directions.down.timer = newTimer;
          cityLights.directions.left.status = 'green';
          cityLights.directions.left.timer = newTimer;
          cityLights.directions.right.status = 'green';
          cityLights.directions.right.timer = newTimer;
          break;
          
        case 'horizontal-green':
          // Left & Right Green -> Yellow
          newPhase = 'horizontal-yellow';
          newTimer = 5;
          
          cityLights.directions.left.status = 'yellow';
          cityLights.directions.left.timer = 5;
          cityLights.directions.right.status = 'yellow';
          cityLights.directions.right.timer = 5;
          cityLights.directions.up.status = 'red';
          cityLights.directions.up.timer = 5;
          cityLights.directions.down.status = 'red';
          cityLights.directions.down.timer = 5;
          break;
          
        case 'horizontal-yellow':
          // Yellow -> Vertical Green
          newPhase = 'vertical-green';
          newTimer = cityLights.phaseTimer < 0 ? 60 : cityLights.phaseTimer;
          
          // Left & Right -> Red, Up & Down -> Green
          cityLights.directions.left.status = 'red';
          cityLights.directions.left.timer = newTimer;
          cityLights.directions.right.status = 'red';
          cityLights.directions.right.timer = newTimer;
          cityLights.directions.up.status = 'green';
          cityLights.directions.up.timer = newTimer;
          cityLights.directions.down.status = 'green';
          cityLights.directions.down.timer = newTimer;
          break;
          
        default:
          newPhase = 'vertical-green';
          newTimer = 60;
          cityLights.directions.up.status = 'green';
          cityLights.directions.up.timer = 60;
          cityLights.directions.down.status = 'green';
          cityLights.directions.down.timer = 60;
          cityLights.directions.left.status = 'red';
          cityLights.directions.left.timer = 60;
          cityLights.directions.right.status = 'red';
          cityLights.directions.right.timer = 60;
          break;
      }
      
      cityLights.phase = newPhase;
      cityLights.phaseTimer = newTimer;
      
      changes.push({
        location: location,
        phase: newPhase,
        city: cityLights.city,
        province: cityLights.province,
        directions: {
          up: cityLights.directions.up.status,
          down: cityLights.directions.down.status,
          left: cityLights.directions.left.status,
          right: cityLights.directions.right.status
        }
      });
    } else {
      // සියලුම දිශා සඳහා ටයිමර් සමමුහුර්ත කිරීම
      const directions = ['up', 'down', 'left', 'right'];
      directions.forEach(dir => {
        if (cityLights.directions[dir]) {
          cityLights.directions[dir].timer = Math.max(0, cityLights.phaseTimer);
        }
      });
    }
  });
  
  if (changes.length > 0) {
    broadcastUpdate({
      type: 'statusChange',
      changes: changes,
      timestamp: new Date().toISOString()
    });
  }
  
  previousStates = JSON.parse(JSON.stringify(trafficLights));
}

// ============================================
// IoT දත්ත යාවත්කාලීන කිරීම
// ============================================
function updateIotData() {
  Object.keys(iotData.cameras).forEach(key => {
    const camera = iotData.cameras[key];
    camera.vehiclesDetected += Math.floor(Math.random() * 10) - 3;
    camera.pedestrians += Math.floor(Math.random() * 5) - 2;
    if (camera.vehiclesDetected < 0) camera.vehiclesDetected = 0;
    if (camera.pedestrians < 0) camera.pedestrians = 0;
    camera.timestamp = new Date().toISOString();
  });

  Object.keys(iotData.inductiveLoops).forEach(key => {
    const loop = iotData.inductiveLoops[key];
    loop.vehicleCount += Math.floor(Math.random() * 20) - 5;
    loop.avgSpeed += Math.floor(Math.random() * 6) - 3;
    if (loop.vehicleCount < 0) loop.vehicleCount = 0;
    if (loop.avgSpeed < 10) loop.avgSpeed = 10;
    if (loop.avgSpeed > 80) loop.avgSpeed = 80;
    
    if (loop.vehicleCount > 150) loop.congestion = 'high';
    else if (loop.vehicleCount > 80) loop.congestion = 'medium';
    else loop.congestion = 'low';
    
    loop.timestamp = new Date().toISOString();
  });

  Object.keys(iotData.airQuality).forEach(key => {
    const aq = iotData.airQuality[key];
    aq.aqi += Math.floor(Math.random() * 10) - 4;
    aq.pm25 += Math.floor(Math.random() * 8) - 3;
    aq.pm10 += Math.floor(Math.random() * 12) - 4;
    if (aq.aqi < 20) aq.aqi = 20;
    if (aq.aqi > 200) aq.aqi = 200;
    if (aq.pm25 < 5) aq.pm25 = 5;
    if (aq.pm10 < 10) aq.pm10 = 10;
    
    if (aq.aqi < 50) aq.status = 'good';
    else if (aq.aqi < 100) aq.status = 'moderate';
    else if (aq.aqi < 150) aq.status = 'unhealthy for sensitive groups';
    else if (aq.aqi < 200) aq.status = 'unhealthy';
    else aq.status = 'very unhealthy';
    
    aq.timestamp = new Date().toISOString();
  });

  Object.keys(iotData.fleet).forEach(key => {
    const vehicle = iotData.fleet[key];
    if (vehicle.status === 'moving') {
      vehicle.lat += (Math.random() - 0.5) * 0.01;
      vehicle.lng += (Math.random() - 0.5) * 0.01;
      vehicle.speed += Math.floor(Math.random() * 10) - 4;
      if (vehicle.speed < 0) { 
        vehicle.speed = 0;
        vehicle.status = 'stopped';
      }
      if (vehicle.speed > 80) vehicle.speed = 80;
      vehicle.passengers += Math.floor(Math.random() * 3) - 1;
      if (vehicle.passengers < 0) vehicle.passengers = 0;
    } else {
      if (Math.random() < 0.1) {
        vehicle.status = 'moving';
        vehicle.speed = 20 + Math.floor(Math.random() * 40);
      }
    }
    vehicle.timestamp = new Date().toISOString();
  });
}

// ============================================
= සංඛ්‍යාන ගණනය කිරීම
// ============================================
function calculateStats() {
  const total = Object.keys(trafficLights).length;
  const statusCounts = { red: 0, yellow: 0, green: 0 };
  const directionCounts = { 
    up: { red: 0, yellow: 0, green: 0 }, 
    down: { red: 0, yellow: 0, green: 0 }, 
    left: { red: 0, yellow: 0, green: 0 }, 
    right: { red: 0, yellow: 0, green: 0 } 
  };
  const provinceStats = {};
  
  Object.keys(trafficLights).forEach(key => {
    const light = trafficLights[key];
    const directions = ['up', 'down', 'left', 'right'];
    
    directions.forEach(dir => {
      const dirLight = light.directions[dir];
      if (dirLight) {
        statusCounts[dirLight.status]++;
        directionCounts[dir][dirLight.status]++;
      }
    });
    
    if (!provinceStats[light.province]) {
      provinceStats[light.province] = { 
        total: 0, 
        red: 0, 
        yellow: 0, 
        green: 0,
        cities: []
      };
    }
    provinceStats[light.province].total++;
    provinceStats[light.province].cities.push(light.city);
  });
  
  return {
    totalCities: total,
    totalDirections: total * 4,
    statusDistribution: statusCounts,
    directionCounts: directionCounts,
    provinceStats: provinceStats,
    activeEmergencyOverrides: Object.keys(emergencyOverrides).length,
    timestamp: new Date().toISOString()
  };
}

// ============================================
// පිටතට නිරාවරණය කිරීම
// ============================================
module.exports = {
  trafficLights,
  iotData,
  emergencyOverrides,
  clients,
  updateTrafficLights,
  updateIotData,
  broadcastUpdate,
  getCityDirections,
  getDirectionStatus,
  setDirectionStatus,
  resetCityToOriginalState,
  calculateStats,
  // උසස් දිශා රටා පාලන ශ්‍රිත
  setPatternUpGreen,
  setPatternDownGreen,
  setPatternLeftGreen,
  setPatternRightGreen,
  setPatternVerticalGreen,
  setPatternHorizontalGreen,
  setPatternAllRed
};
