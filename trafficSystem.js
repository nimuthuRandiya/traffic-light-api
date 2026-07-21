// Emergency overrides storage
let emergencyOverrides = {};

// Store original timers and statuses for emergency recovery
const ORIGINAL_TIMERS = {};
const ORIGINAL_STATUSES = {};

// Traffic light state management for all Sri Lankan cities with directional controls
const trafficLights = {
  colombo: {
    city: 'Colombo',
    province: 'Western',
    phase: 'vertical-green',
    phaseTimer: 45,
    directions: {
      up: { status: 'green', timer: 45 },
      down: { status: 'green', timer: 45 },
      left: { status: 'red', timer: 45 },
      right: { status: 'red', timer: 45 }
    }
  },
  kandy: {
    city: 'Kandy',
    province: 'Central',
    phase: 'horizontal-green',
    phaseTimer: 45,
    directions: {
      up: { status: 'red', timer: 45 },
      down: { status: 'red', timer: 45 },
      left: { status: 'green', timer: 45 },
      right: { status: 'green', timer: 45 }
    }
  },
  galle: {
    city: 'Galle',
    province: 'Southern',
    phase: 'horizontal-green',
    phaseTimer: 45,
    directions: {
      up: { status: 'red', timer: 45 },
      down: { status: 'red', timer: 45 },
      left: { status: 'green', timer: 45 },
      right: { status: 'green', timer: 45 }
    }
  },
  negombo: {
    city: 'Negombo',
    province: 'Western',
    phase: 'vertical-green',
    phaseTimer: 45,
    directions: {
      up: { status: 'green', timer: 45 },
      down: { status: 'green', timer: 45 },
      left: { status: 'red', timer: 45 },
      right: { status: 'red', timer: 45 }
    }
  },
  jaffna: {
    city: 'Jaffna',
    province: 'Northern',
    phase: 'horizontal-green',
    phaseTimer: 45,
    directions: {
      up: { status: 'red', timer: 45 },
      down: { status: 'red', timer: 45 },
      left: { status: 'green', timer: 45 },
      right: { status: 'green', timer: 45 }
    }
  },
  anuradhapura: {
    city: 'Anuradhapura',
    province: 'North Central',
    phase: 'vertical-green',
    phaseTimer: 45,
    directions: {
      up: { status: 'green', timer: 45 },
      down: { status: 'green', timer: 45 },
      left: { status: 'red', timer: 45 },
      right: { status: 'red', timer: 45 }
    }
  },
  polonnaruwa: {
    city: 'Polonnaruwa',
    province: 'North Central',
    phase: 'horizontal-green',
    phaseTimer: 45,
    directions: {
      up: { status: 'red', timer: 45 },
      down: { status: 'red', timer: 45 },
      left: { status: 'green', timer: 45 },
      right: { status: 'green', timer: 45 }
    }
  },
  badulla: {
    city: 'Badulla',
    province: 'Uva',
    phase: 'horizontal-green',
    phaseTimer: 45,
    directions: {
      up: { status: 'red', timer: 45 },
      down: { status: 'red', timer: 45 },
      left: { status: 'green', timer: 45 },
      right: { status: 'green', timer: 45 }
    }
  },
  ratnapura: {
    city: 'Ratnapura',
    province: 'Sabaragamuwa',
    phase: 'vertical-green',
    phaseTimer: 45,
    directions: {
      up: { status: 'green', timer: 45 },
      down: { status: 'green', timer: 45 },
      left: { status: 'red', timer: 45 },
      right: { status: 'red', timer: 45 }
    }
  },
  kurunegala_1: {
    city: 'Kurunegala - Main',
    province: 'North Western',
    phase: 'vertical-green',
    phaseTimer: 45,
    directions: {
      up: { status: 'green', timer: 45 },
      down: { status: 'green', timer: 45 },
      left: { status: 'red', timer: 45 },
      right: { status: 'red', timer: 45 }
    }
  },
  kurunegala_2: {
    city: 'Kurunegala - Town Hall',
    province: 'North Western',
    phase: 'horizontal-green',
    phaseTimer: 45,
    directions: {
      up: { status: 'red', timer: 45 },
      down: { status: 'red', timer: 45 },
      left: { status: 'green', timer: 45 },
      right: { status: 'green', timer: 45 }
    }
  },
  kurunegala_3: {
    city: 'Kurunegala - Railway',
    province: 'North Western',
    phase: 'horizontal-green',
    phaseTimer: 45,
    directions: {
      up: { status: 'red', timer: 45 },
      down: { status: 'red', timer: 45 },
      left: { status: 'green', timer: 45 },
      right: { status: 'green', timer: 45 }
    }
  },
  kurunegala_4: {
    city: 'Kurunegala - Hospital',
    province: 'North Western',
    phase: 'vertical-green',
    phaseTimer: 45,
    directions: {
      up: { status: 'green', timer: 45 },
      down: { status: 'green', timer: 45 },
      left: { status: 'red', timer: 45 },
      right: { status: 'red', timer: 45 }
    }
  },
  kurunegala_5: {
    city: 'Kurunegala - Bus Stand',
    province: 'North Western',
    phase: 'horizontal-green',
    phaseTimer: 45,
    directions: {
      up: { status: 'red', timer: 45 },
      down: { status: 'red', timer: 45 },
      left: { status: 'green', timer: 45 },
      right: { status: 'green', timer: 45 }
    }
  },
  matara: {
    city: 'Matara',
    province: 'Southern',
    phase: 'horizontal-green',
    phaseTimer: 45,
    directions: {
      up: { status: 'red', timer: 45 },
      down: { status: 'red', timer: 45 },
      left: { status: 'green', timer: 45 },
      right: { status: 'green', timer: 45 }
    }
  },
  batticaloa: {
    city: 'Batticaloa',
    province: 'Eastern',
    phase: 'vertical-green',
    phaseTimer: 45,
    directions: {
      up: { status: 'green', timer: 45 },
      down: { status: 'green', timer: 45 },
      left: { status: 'red', timer: 45 },
      right: { status: 'red', timer: 45 }
    }
  },
  trincomalee: {
    city: 'Trincomalee',
    province: 'Eastern',
    phase: 'horizontal-green',
    phaseTimer: 45,
    directions: {
      up: { status: 'red', timer: 45 },
      down: { status: 'red', timer: 45 },
      left: { status: 'green', timer: 45 },
      right: { status: 'green', timer: 45 }
    }
  },
  kalutara: {
    city: 'Kalutara',
    province: 'Western',
    phase: 'horizontal-green',
    phaseTimer: 45,
    directions: {
      up: { status: 'red', timer: 45 },
      down: { status: 'red', timer: 45 },
      left: { status: 'green', timer: 45 },
      right: { status: 'green', timer: 45 }
    }
  },
  avissawella: {
    city: 'Avissawella',
    province: 'Western',
    phase: 'vertical-green',
    phaseTimer: 45,
    directions: {
      up: { status: 'green', timer: 45 },
      down: { status: 'green', timer: 45 },
      left: { status: 'red', timer: 45 },
      right: { status: 'red', timer: 45 }
    }
  },
  gampaha: {
    city: 'Gampaha',
    province: 'Western',
    phase: 'horizontal-green',
    phaseTimer: 45,
    directions: {
      up: { status: 'red', timer: 45 },
      down: { status: 'red', timer: 45 },
      left: { status: 'green', timer: 45 },
      right: { status: 'green', timer: 45 }
    }
  },
  matale: {
    city: 'Matale',
    province: 'Central',
    phase: 'vertical-green',
    phaseTimer: 45,
    directions: {
      up: { status: 'green', timer: 45 },
      down: { status: 'green', timer: 45 },
      left: { status: 'red', timer: 45 },
      right: { status: 'red', timer: 45 }
    }
  },
  nugegoda: {
    city: 'Nugegoda',
    province: 'Western',
    phase: 'horizontal-green',
    phaseTimer: 45,
    directions: {
      up: { status: 'red', timer: 45 },
      down: { status: 'red', timer: 45 },
      left: { status: 'green', timer: 45 },
      right: { status: 'green', timer: 45 }
    }
  },
  moratuwa: {
    city: 'Moratuwa',
    province: 'Western',
    phase: 'vertical-green',
    phaseTimer: 45,
    directions: {
      up: { status: 'green', timer: 45 },
      down: { status: 'green', timer: 45 },
      left: { status: 'red', timer: 45 },
      right: { status: 'red', timer: 45 }
    }
  },
  dehiwala: {
    city: 'Dehiwala',
    province: 'Western',
    phase: 'horizontal-green',
    phaseTimer: 45,
    directions: {
      up: { status: 'red', timer: 45 },
      down: { status: 'red', timer: 45 },
      left: { status: 'green', timer: 45 },
      right: { status: 'green', timer: 45 }
    }
  },
  mountlavinia: {
    city: 'Mount Lavinia',
    province: 'Western',
    phase: 'horizontal-green',
    phaseTimer: 45,
    directions: {
      up: { status: 'red', timer: 45 },
      down: { status: 'red', timer: 45 },
      left: { status: 'green', timer: 45 },
      right: { status: 'green', timer: 45 }
    }
  },
  chilaw: {
    city: 'Chilaw',
    province: 'North Western',
    phase: 'vertical-green',
    phaseTimer: 45,
    directions: {
      up: { status: 'green', timer: 45 },
      down: { status: 'green', timer: 45 },
      left: { status: 'red', timer: 45 },
      right: { status: 'red', timer: 45 }
    }
  },
  puttalam: {
    city: 'Puttalam',
    province: 'North Western',
    phase: 'horizontal-green',
    phaseTimer: 45,
    directions: {
      up: { status: 'red', timer: 45 },
      down: { status: 'red', timer: 45 },
      left: { status: 'green', timer: 45 },
      right: { status: 'green', timer: 45 }
    }
  },
  homagama: {
    city: 'Homagama',
    province: 'Western',
    phase: 'horizontal-green',
    phaseTimer: 45,
    directions: {
      up: { status: 'red', timer: 45 },
      down: { status: 'red', timer: 45 },
      left: { status: 'green', timer: 45 },
      right: { status: 'green', timer: 45 }
    }
  },
  maharagama: {
    city: 'Maharagama',
    province: 'Western',
    phase: 'vertical-green',
    phaseTimer: 45,
    directions: {
      up: { status: 'green', timer: 45 },
      down: { status: 'green', timer: 45 },
      left: { status: 'red', timer: 45 },
      right: { status: 'red', timer: 45 }
    }
  }
};

// Initialize original timers and statuses for emergency recovery
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
// IOT SENSORS DATA
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
// HELPER FUNCTIONS (STRICT SAFETY ENFORCED)
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

// Strict validation to completely prevent collisions
function setDirectionStatus(location, direction, status, timer) {
  if (!trafficLights[location]) return false;
  if (!trafficLights[location].directions[direction]) return false;
  
  if (status === 'green') {
    const isVertical = (direction === 'up' || direction === 'down');
    const oppositePair = isVertical ? ['left', 'right'] : ['up', 'down'];
    
    // Force opposite pair to RED immediately if this is set to green
    oppositePair.forEach(dir => {
      if (trafficLights[location].directions[dir]) {
        trafficLights[location].directions[dir].status = 'red';
      }
    });
  }
  
  trafficLights[location].directions[direction].status = status;
  if (timer !== undefined) {
    trafficLights[location].directions[direction].timer = timer;
  }
  return true;
}

function resetCityToOriginalState(location) {
  if (!trafficLights[location]) return false;
  if (!ORIGINAL_STATUSES[location]) return false;
  
  const directions = ['up', 'down', 'left', 'right'];
  directions.forEach(dir => {
    if (trafficLights[location].directions[dir]) {
      trafficLights[location].directions[dir].status = ORIGINAL_STATUSES[location][dir] || 'green';
      trafficLights[location].directions[dir].timer = ORIGINAL_TIMERS[location][dir] || 45;
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
// TIME BALANCE SYSTEM INTEGRATION
// ============================================

// Balance configuration
const BALANCE_CONFIG = {
  MIN_GREEN_TIME: 15,
  MAX_GREEN_TIME: 90,
  DEFAULT_GREEN_TIME: 45,
  YELLOW_DURATION: 5,
  FAIRNESS_TOLERANCE: 0.85
};

// Balance state
const balanceState = {};

// Initialize balance state for all cities
function initializeBalanceState() {
  Object.keys(trafficLights).forEach(location => {
    balanceState[location] = {
      greenTimeUsed: { up: 0, down: 0, left: 0, right: 0 },
      greenCycles: { up: 0, down: 0, left: 0, right: 0 },
      waitTime: { up: 0, down: 0, left: 0, right: 0 },
      balanceWeights: { up: 1, down: 1, left: 1, right: 1 },
      phaseTime: 0,
      activeDirection: null,
      fairness: 1
    };
  });
}

initializeBalanceState();

// Get traffic density for a location and direction
function getTrafficDensity(location, direction) {
  try {
    // Check inductive loops
    const loopKeys = Object.keys(iotData.inductiveLoops);
    for (const key of loopKeys) {
      if (key.includes(location) || location.includes(key)) {
        const loop = iotData.inductiveLoops[key];
        const count = loop.vehicleCount || 0;
        if (count < 20) return 15;
        if (count < 40) return 30;
        if (count < 70) return 55;
        if (count < 100) return 80;
        return 110;
      }
    }
    
    // Check cameras
    const cameraKeys = Object.keys(iotData.cameras);
    for (const key of cameraKeys) {
      if (key.includes(location) || location.includes(key)) {
        const camera = iotData.cameras[key];
        const vehicles = camera.vehiclesDetected || 0;
        if (vehicles < 15) return 15;
        if (vehicles < 30) return 30;
        if (vehicles < 50) return 55;
        if (vehicles < 70) return 80;
        return 110;
      }
    }
  } catch (e) {
    // Fall back to time-based estimation
  }
  
  // Time-based estimation
  const hour = new Date().getHours();
  if (hour >= 7 && hour <= 9) return 80;
  if (hour >= 16 && hour <= 18) return 90;
  if (hour >= 12 && hour <= 14) return 60;
  if (hour >= 22 || hour <= 5) return 15;
  return 40;
}

// Calculate green time based on traffic and fairness
function calculateGreenTime(location, direction) {
  const state = balanceState[location];
  if (!state) return BALANCE_CONFIG.DEFAULT_GREEN_TIME;
  
  const density = getTrafficDensity(location, direction);
  let baseTime = BALANCE_CONFIG.DEFAULT_GREEN_TIME;
  
  // Adjust for traffic density
  if (density > 0) {
    if (density < 25) {
      baseTime = 30;
    } else if (density < 50) {
      baseTime = 40 + (density - 25) * 0.4;
    } else if (density < 80) {
      baseTime = 50 + (density - 50) * 0.6;
    } else {
      baseTime = 70 + (density - 80) * 0.3;
    }
  }
  
  // Apply balance weight
  const weight = state.balanceWeights[direction] || 1;
  let adjustedTime = baseTime * (1 / Math.max(0.3, weight));
  
  // Apply fairness multiplier
  const totalGreenTime = Object.values(state.greenTimeUsed).reduce((a, b) => a + b, 0);
  if (totalGreenTime > 0) {
    const avgTime = totalGreenTime / 4;
    const thisTime = state.greenTimeUsed[direction] || 0;
    const ratio = thisTime / Math.max(1, avgTime);
    
    if (ratio < 0.4) adjustedTime *= 1.8;
    else if (ratio < 0.6) adjustedTime *= 1.5;
    else if (ratio < 0.8) adjustedTime *= 1.2;
    else if (ratio > 1.5) adjustedTime *= 0.7;
    else if (ratio > 1.2) adjustedTime *= 0.85;
  }
  
  // Apply wait time priority
  const waitTime = state.waitTime[direction] || 0;
  if (waitTime > 120) adjustedTime *= 1.5;
  else if (waitTime > 80) adjustedTime *= 1.3;
  else if (waitTime > 50) adjustedTime *= 1.1;
  
  // Clamp
  return Math.max(BALANCE_CONFIG.MIN_GREEN_TIME, 
                  Math.min(BALANCE_CONFIG.MAX_GREEN_TIME, Math.round(adjustedTime)));
}

// Update balance weights
function updateBalanceWeights(location) {
  const state = balanceState[location];
  if (!state) return;
  
  const directions = ['up', 'down', 'left', 'right'];
  const totalCycles = directions.reduce((sum, dir) => sum + (state.greenCycles[dir] || 0), 0);
  
  if (totalCycles === 0) {
    directions.forEach(dir => { state.balanceWeights[dir] = 1; });
    return;
  }
  
  let totalWeight = 0;
  directions.forEach(dir => {
    const cycles = state.greenCycles[dir] || 1;
    const proportion = cycles / totalCycles;
    let weight = 1 / (proportion * 4);
    weight = Math.max(0.5, Math.min(2.5, weight));
    
    // Adjust for wait time
    const waitTime = state.waitTime[dir] || 0;
    if (waitTime > 100) weight *= 1.4;
    else if (waitTime > 60) weight *= 1.2;
    
    state.balanceWeights[dir] = weight;
    totalWeight += weight;
  });
  
  // Normalize
  directions.forEach(dir => {
    state.balanceWeights[dir] = (state.balanceWeights[dir] / totalWeight) * 4;
  });
  
  // Calculate fairness
  const times = directions.map(dir => state.greenTimeUsed[dir] || 0);
  const avgTime = times.reduce((a, b) => a + b, 0) / 4;
  if (avgTime > 0) {
    const maxDev = Math.max(...times.map(t => Math.abs(t - avgTime)));
    state.fairness = Math.max(0.1, 1 - (maxDev / (avgTime * 2)));
  }
}

// Calculate priority for directions
function calculatePriority(location) {
  const state = balanceState[location];
  if (!state) return null;
  
  const directions = ['up', 'down', 'left', 'right'];
  const priorities = directions.map(dir => {
    const weight = state.balanceWeights[dir] || 1;
    const cycles = state.greenCycles[dir] || 0;
    const waitTime = state.waitTime[dir] || 0;
    const usedTime = state.greenTimeUsed[dir] || 0;
    
    // Priority factors
    const weightFactor = weight * 1.5;
    const waitFactor = Math.min(2, waitTime / 60);
    const fairnessFactor = 1 / (usedTime + 1);
    
    return {
      direction: dir,
      priority: weightFactor + waitFactor + fairnessFactor
    };
  });
  
  priorities.sort((a, b) => b.priority - a.priority);
  return priorities[0];
}

// ============================================
// UPDATE FUNCTIONS WITH TIME BALANCE
// ============================================

function updateTrafficLights() {
  const locations = Object.keys(trafficLights);
  const changes = [];
  const now = Date.now();
  const expiredLocations = [];
  
  // Check expired emergency overrides
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
    const state = balanceState[location];
    
    if (!state) return;
    
    // Update phase time
    state.phaseTime += 1;
    
    // Update wait times
    const directions = ['up', 'down', 'left', 'right'];
    const greenDirections = (currentPhase === 'vertical-green' || currentPhase === 'vertical-yellow') 
      ? ['up', 'down'] 
      : ['left', 'right'];
    
    directions.forEach(dir => {
      if (greenDirections.includes(dir) && (currentPhase === 'vertical-green' || currentPhase === 'horizontal-green')) {
        state.waitTime[dir] = 0;
      } else {
        state.waitTime[dir] = (state.waitTime[dir] || 0) + 1;
      }
    });
    
    cityLights.phaseTimer -= 1;
    
    if (cityLights.phaseTimer <= 0) {
      let newPhase = '';
      let newTimer = 0;
      
      switch (currentPhase) {
        case 'vertical-green': {
          // Calculate green time for vertical
          const greenTime = calculateGreenTime(location, 'up');
          newPhase = 'vertical-yellow';
          newTimer = BALANCE_CONFIG.YELLOW_DURATION;
          
          cityLights.directions.up.status = 'yellow';
          cityLights.directions.up.timer = BALANCE_CONFIG.YELLOW_DURATION;
          cityLights.directions.down.status = 'yellow';
          cityLights.directions.down.timer = BALANCE_CONFIG.YELLOW_DURATION;
          cityLights.directions.left.status = 'red';
          cityLights.directions.left.timer = BALANCE_CONFIG.YELLOW_DURATION;
          cityLights.directions.right.status = 'red';
          cityLights.directions.right.timer = BALANCE_CONFIG.YELLOW_DURATION;
          
          // Track green time used
          state.greenTimeUsed.up += greenTime;
          state.greenTimeUsed.down += greenTime;
          state.greenCycles.up += 1;
          state.greenCycles.down += 1;
          break;
        }
          
        case 'vertical-yellow': {
          // Update balance weights before switching
          updateBalanceWeights(location);
          
          // Calculate priority to determine next phase
          const priority = calculatePriority(location);
          const isVertical = priority && (priority.direction === 'up' || priority.direction === 'down');
          
          newPhase = isVertical ? 'vertical-green' : 'horizontal-green';
          const greenTime = calculateGreenTime(location, isVertical ? 'up' : 'left');
          newTimer = greenTime;
          
          if (isVertical) {
            // STRICT: Vertical -> GREEN, Horizontal -> RED
            cityLights.directions.up.status = 'green';
            cityLights.directions.up.timer = greenTime;
            cityLights.directions.down.status = 'green';
            cityLights.directions.down.timer = greenTime;
            cityLights.directions.left.status = 'red';
            cityLights.directions.left.timer = greenTime;
            cityLights.directions.right.status = 'red';
            cityLights.directions.right.timer = greenTime;
          } else {
            // STRICT: Horizontal -> GREEN, Vertical -> RED
            cityLights.directions.up.status = 'red';
            cityLights.directions.up.timer = greenTime;
            cityLights.directions.down.status = 'red';
            cityLights.directions.down.timer = greenTime;
            cityLights.directions.left.status = 'green';
            cityLights.directions.left.timer = greenTime;
            cityLights.directions.right.status = 'green';
            cityLights.directions.right.timer = greenTime;
          }
          break;
        }
          
        case 'horizontal-green': {
          // Calculate green time for horizontal
          const greenTime = calculateGreenTime(location, 'left');
          newPhase = 'horizontal-yellow';
          newTimer = BALANCE_CONFIG.YELLOW_DURATION;
          
          cityLights.directions.left.status = 'yellow';
          cityLights.directions.left.timer = BALANCE_CONFIG.YELLOW_DURATION;
          cityLights.directions.right.status = 'yellow';
          cityLights.directions.right.timer = BALANCE_CONFIG.YELLOW_DURATION;
          cityLights.directions.up.status = 'red';
          cityLights.directions.up.timer = BALANCE_CONFIG.YELLOW_DURATION;
          cityLights.directions.down.status = 'red';
          cityLights.directions.down.timer = BALANCE_CONFIG.YELLOW_DURATION;
          
          // Track green time used
          state.greenTimeUsed.left += greenTime;
          state.greenTimeUsed.right += greenTime;
          state.greenCycles.left += 1;
          state.greenCycles.right += 1;
          break;
        }
          
        case 'horizontal-yellow': {
          // Update balance weights before switching
          updateBalanceWeights(location);
          
          // Calculate priority to determine next phase
          const priority = calculatePriority(location);
          const isVertical = priority && (priority.direction === 'up' || priority.direction === 'down');
          
          newPhase = isVertical ? 'vertical-green' : 'horizontal-green';
          const greenTime = calculateGreenTime(location, isVertical ? 'up' : 'left');
          newTimer = greenTime;
          
          if (isVertical) {
            // STRICT: Vertical -> GREEN, Horizontal -> RED
            cityLights.directions.up.status = 'green';
            cityLights.directions.up.timer = greenTime;
            cityLights.directions.down.status = 'green';
            cityLights.directions.down.timer = greenTime;
            cityLights.directions.left.status = 'red';
            cityLights.directions.left.timer = greenTime;
            cityLights.directions.right.status = 'red';
            cityLights.directions.right.timer = greenTime;
          } else {
            // STRICT: Horizontal -> GREEN, Vertical -> RED
            cityLights.directions.up.status = 'red';
            cityLights.directions.up.timer = greenTime;
            cityLights.directions.down.status = 'red';
            cityLights.directions.down.timer = greenTime;
            cityLights.directions.left.status = 'green';
            cityLights.directions.left.timer = greenTime;
            cityLights.directions.right.status = 'green';
            cityLights.directions.right.timer = greenTime;
          }
          break;
        }
          
        default: {
          newPhase = 'vertical-green';
          newTimer = BALANCE_CONFIG.DEFAULT_GREEN_TIME;
          cityLights.directions.up.status = 'green';
          cityLights.directions.up.timer = BALANCE_CONFIG.DEFAULT_GREEN_TIME;
          cityLights.directions.down.status = 'green';
          cityLights.directions.down.timer = BALANCE_CONFIG.DEFAULT_GREEN_TIME;
          cityLights.directions.left.status = 'red';
          cityLights.directions.left.timer = BALANCE_CONFIG.DEFAULT_GREEN_TIME;
          cityLights.directions.right.status = 'red';
          cityLights.directions.right.timer = BALANCE_CONFIG.DEFAULT_GREEN_TIME;
          break;
        }
      }
      
      cityLights.phase = newPhase;
      cityLights.phaseTimer = newTimer;
      state.phaseTime = 0;
      
      changes.push({
        location: location,
        phase: newPhase,
        city: cityLights.city,
        province: cityLights.province,
        timer: newTimer,
        fairness: Math.round(state.fairness * 100) / 100 || 1
      });
    } else {
      const directions = ['up', 'down', 'left', 'right'];
      directions.forEach(dir => {
        if (cityLights.directions[dir]) {
          cityLights.directions[dir].timer = Math.max(0, cityLights.directions[dir].timer - 1);
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
  let totalFairness = 0;
  let fairnessCount = 0;
  
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
    
    // Add balance fairness
    if (balanceState[key]) {
      totalFairness += balanceState[key].fairness || 1;
      fairnessCount++;
    }
  });
  
  return {
    totalCities: total,
    totalDirections: total * 4,
    statusDistribution: statusCounts,
    directionCounts: directionCounts,
    provinceStats: provinceStats,
    activeEmergencyOverrides: Object.keys(emergencyOverrides).length,
    balanceFairness: fairnessCount > 0 ? totalFairness / fairnessCount : 1,
    timestamp: new Date().toISOString()
  };
}

// Get balance report for a location
function getBalanceReport(location) {
  if (!balanceState[location]) return null;
  const state = balanceState[location];
  const light = trafficLights[location];
  if (!light) return null;
  
  return {
    location: location,
    city: light.city,
    province: light.province,
    phase: light.phase,
    phaseTimer: light.phaseTimer,
    greenTimeUsed: state.greenTimeUsed,
    greenCycles: state.greenCycles,
    waitTime: state.waitTime,
    balanceWeights: state.balanceWeights,
    fairness: state.fairness || 1,
    timestamp: new Date().toISOString()
  };
}

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
  getBalanceReport,
  balanceState,
  BALANCE_CONFIG
};
