// Emergency overrides storage
let emergencyOverrides = {};

// Store original timers and statuses for emergency recovery
const ORIGINAL_TIMERS = {};
const ORIGINAL_STATUSES = {};

// Traffic light state management for all Sri Lankan cities with directional controls
// Each city has independent traffic lights for each direction
const trafficLights = {
  // ============ COLOMBO ============
  colombo: {
    city: 'Colombo',
    province: 'Western',
    directions: {
      up: { status: 'green', timer: 60 },
      down: { status: 'green', timer: 60 },
      left: { status: 'red', timer: 30 },
      right: { status: 'red', timer: 30 }
    }
  },
  
  // ============ KANDY ============
  kandy: {
    city: 'Kandy',
    province: 'Central',
    directions: {
      up: { status: 'red', timer: 30 },
      down: { status: 'red', timer: 30 },
      left: { status: 'green', timer: 50 },
      right: { status: 'green', timer: 50 }
    }
  },
  
  // ============ GALLE ============
  galle: {
    city: 'Galle',
    province: 'Southern',
    directions: {
      up: { status: 'yellow', timer: 5 },
      down: { status: 'yellow', timer: 5 },
      left: { status: 'green', timer: 55 },
      right: { status: 'green', timer: 55 }
    }
  },
  
  // ============ NEGOMBO ============
  negombo: {
    city: 'Negombo',
    province: 'Western',
    directions: {
      up: { status: 'green', timer: 45 },
      down: { status: 'green', timer: 45 },
      left: { status: 'red', timer: 32 },
      right: { status: 'red', timer: 32 }
    }
  },
  
  // ============ JAFFNA ============
  jaffna: {
    city: 'Jaffna',
    province: 'Northern',
    directions: {
      up: { status: 'red', timer: 35 },
      down: { status: 'red', timer: 35 },
      left: { status: 'green', timer: 48 },
      right: { status: 'green', timer: 48 }
    }
  },
  
  // ============ ANURADHAPURA ============
  anuradhapura: {
    city: 'Anuradhapura',
    province: 'North Central',
    directions: {
      up: { status: 'green', timer: 50 },
      down: { status: 'green', timer: 50 },
      left: { status: 'red', timer: 30 },
      right: { status: 'red', timer: 30 }
    }
  },
  
  // ============ POLONNARUWA ============
  polonnaruwa: {
    city: 'Polonnaruwa',
    province: 'North Central',
    directions: {
      up: { status: 'yellow', timer: 8 },
      down: { status: 'yellow', timer: 8 },
      left: { status: 'green', timer: 45 },
      right: { status: 'green', timer: 45 }
    }
  },
  
  // ============ BADULLA ============
  badulla: {
    city: 'Badulla',
    province: 'Uva',
    directions: {
      up: { status: 'red', timer: 25 },
      down: { status: 'red', timer: 25 },
      left: { status: 'green', timer: 52 },
      right: { status: 'green', timer: 52 }
    }
  },
  
  // ============ RATNAPURA ============
  ratnapura: {
    city: 'Ratnapura',
    province: 'Sabaragamuwa',
    directions: {
      up: { status: 'green', timer: 55 },
      down: { status: 'green', timer: 55 },
      left: { status: 'red', timer: 32 },
      right: { status: 'red', timer: 32 }
    }
  },
  
  // ============ KURUNEGALA - 5 INTERSECTIONS ============
  kurunegala_1: {
    city: 'Kurunegala - Main',
    province: 'North Western',
    directions: {
      up: { status: 'green', timer: 45 },
      down: { status: 'green', timer: 45 },
      left: { status: 'red', timer: 30 },
      right: { status: 'red', timer: 30 }
    }
  },
  kurunegala_2: {
    city: 'Kurunegala - Town Hall',
    province: 'North Western',
    directions: {
      up: { status: 'red', timer: 30 },
      down: { status: 'red', timer: 30 },
      left: { status: 'green', timer: 50 },
      right: { status: 'green', timer: 50 }
    }
  },
  kurunegala_3: {
    city: 'Kurunegala - Railway',
    province: 'North Western',
    directions: {
      up: { status: 'yellow', timer: 8 },
      down: { status: 'yellow', timer: 8 },
      left: { status: 'green', timer: 48 },
      right: { status: 'green', timer: 48 }
    }
  },
  kurunegala_4: {
    city: 'Kurunegala - Hospital',
    province: 'North Western',
    directions: {
      up: { status: 'green', timer: 50 },
      down: { status: 'green', timer: 50 },
      left: { status: 'red', timer: 32 },
      right: { status: 'red', timer: 32 }
    }
  },
  kurunegala_5: {
    city: 'Kurunegala - Bus Stand',
    province: 'North Western',
    directions: {
      up: { status: 'red', timer: 35 },
      down: { status: 'red', timer: 35 },
      left: { status: 'green', timer: 45 },
      right: { status: 'green', timer: 45 }
    }
  },
  
  // ============ MATARA ============
  matara: {
    city: 'Matara',
    province: 'Southern',
    directions: {
      up: { status: 'red', timer: 40 },
      down: { status: 'red', timer: 40 },
      left: { status: 'green', timer: 55 },
      right: { status: 'green', timer: 55 }
    }
  },
  
  // ============ BATTICALOA ============
  batticaloa: {
    city: 'Batticaloa',
    province: 'Eastern',
    directions: {
      up: { status: 'green', timer: 48 },
      down: { status: 'green', timer: 48 },
      left: { status: 'red', timer: 30 },
      right: { status: 'red', timer: 30 }
    }
  },
  
  // ============ TRINCOMALEE ============
  trincomalee: {
    city: 'Trincomalee',
    province: 'Eastern',
    directions: {
      up: { status: 'yellow', timer: 7 },
      down: { status: 'yellow', timer: 7 },
      left: { status: 'green', timer: 50 },
      right: { status: 'green', timer: 50 }
    }
  },
  
  // ============ KALUTARA ============
  kalutara: {
    city: 'Kalutara',
    province: 'Western',
    directions: {
      up: { status: 'red', timer: 32 },
      down: { status: 'red', timer: 32 },
      left: { status: 'green', timer: 52 },
      right: { status: 'green', timer: 52 }
    }
  },
  
  // ============ AVISSAWELLA ============
  avissawella: {
    city: 'Avissawella',
    province: 'Western',
    directions: {
      up: { status: 'green', timer: 42 },
      down: { status: 'green', timer: 42 },
      left: { status: 'red', timer: 35 },
      right: { status: 'red', timer: 35 }
    }
  },
  
  // ============ GAMPAHA ============
  gampaha: {
    city: 'Gampaha',
    province: 'Western',
    directions: {
      up: { status: 'yellow', timer: 9 },
      down: { status: 'yellow', timer: 9 },
      left: { status: 'green', timer: 48 },
      right: { status: 'green', timer: 48 }
    }
  },
  
  // ============ MATALE ============
  matale: {
    city: 'Matale',
    province: 'Central',
    directions: {
      up: { status: 'green', timer: 38 },
      down: { status: 'green', timer: 38 },
      left: { status: 'red', timer: 32 },
      right: { status: 'red', timer: 32 }
    }
  },
  
  // ============ NUGEGODA ============
  nugegoda: {
    city: 'Nugegoda',
    province: 'Western',
    directions: {
      up: { status: 'red', timer: 28 },
      down: { status: 'red', timer: 28 },
      left: { status: 'green', timer: 52 },
      right: { status: 'green', timer: 52 }
    }
  },
  
  // ============ MORATUWA ============
  moratuwa: {
    city: 'Moratuwa',
    province: 'Western',
    directions: {
      up: { status: 'green', timer: 52 },
      down: { status: 'green', timer: 52 },
      left: { status: 'red', timer: 30 },
      right: { status: 'red', timer: 30 }
    }
  },
  
  // ============ DEHIWALA ============
  dehiwala: {
    city: 'Dehiwala',
    province: 'Western',
    directions: {
      up: { status: 'yellow', timer: 10 },
      down: { status: 'yellow', timer: 10 },
      left: { status: 'green', timer: 45 },
      right: { status: 'green', timer: 45 }
    }
  },
  
  // ============ MOUNT LAVINIA ============
  mountlavinia: {
    city: 'Mount Lavinia',
    province: 'Western',
    directions: {
      up: { status: 'red', timer: 33 },
      down: { status: 'red', timer: 33 },
      left: { status: 'green', timer: 48 },
      right: { status: 'green', timer: 48 }
    }
  },
  
  // ============ CHILAW ============
  chilaw: {
    city: 'Chilaw',
    province: 'North Western',
    directions: {
      up: { status: 'green', timer: 44 },
      down: { status: 'green', timer: 44 },
      left: { status: 'red', timer: 30 },
      right: { status: 'red', timer: 30 }
    }
  },
  
  // ============ PUTTALAM ============
  puttalam: {
    city: 'Puttalam',
    province: 'North Western',
    directions: {
      up: { status: 'yellow', timer: 7 },
      down: { status: 'yellow', timer: 7 },
      left: { status: 'green', timer: 50 },
      right: { status: 'green', timer: 50 }
    }
  },
  
  // ============ HOMAGAMA ============
  homagama: {
    city: 'Homagama',
    province: 'Western',
    directions: {
      up: { status: 'red', timer: 36 },
      down: { status: 'red', timer: 36 },
      left: { status: 'green', timer: 48 },
      right: { status: 'green', timer: 48 }
    }
  },
  
  // ============ MAHARAGAMA ============
  maharagama: {
    city: 'Maharagama',
    province: 'Western',
    directions: {
      up: { status: 'green', timer: 49 },
      down: { status: 'green', timer: 49 },
      left: { status: 'red', timer: 30 },
      right: { status: 'red', timer: 30 }
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

// Call initialization
initializeOriginalStates();

// Helper function to get all direction statuses for a city
function getCityDirections(location) {
  if (!trafficLights[location]) return null;
  return trafficLights[location].directions;
}

// Helper function to get a specific direction status
function getDirectionStatus(location, direction) {
  if (!trafficLights[location]) return null;
  if (!trafficLights[location].directions[direction]) return null;
  return trafficLights[location].directions[direction];
}

// Helper function to set direction status
function setDirectionStatus(location, direction, status, timer) {
  if (!trafficLights[location]) return false;
  if (!trafficLights[location].directions[direction]) return false;
  
  trafficLights[location].directions[direction].status = status;
  if (timer !== undefined) {
    trafficLights[location].directions[direction].timer = timer;
  }
  return true;
}

// Helper function to set paired directions (Up + Down or Left + Right)
function setPairedDirections(location, pair, status, timer) {
  if (!trafficLights[location]) return false;
  
  let dirs = [];
  if (pair === 'vertical') {
    dirs = ['up', 'down'];
  } else if (pair === 'horizontal') {
    dirs = ['left', 'right'];
  } else {
    return false;
  }
  
  dirs.forEach(dir => {
    if (trafficLights[location].directions[dir]) {
      trafficLights[location].directions[dir].status = status;
      if (timer !== undefined) {
        trafficLights[location].directions[dir].timer = timer;
      }
    }
  });
  
  return true;
}

// Helper function to reset a city's directions to original state (for emergency recovery)
function resetCityToOriginalState(location) {
  if (!trafficLights[location]) return false;
  if (!ORIGINAL_STATUSES[location]) return false;
  
  const directions = ['up', 'down', 'left', 'right'];
  directions.forEach(dir => {
    if (trafficLights[location].directions[dir]) {
      // Restore original status
      const originalStatus = ORIGINAL_STATUSES[location][dir] || 'green';
      trafficLights[location].directions[dir].status = originalStatus;
      
      // Restore original timer
      const originalTimer = ORIGINAL_TIMERS[location][dir] || 30;
      trafficLights[location].directions[dir].timer = originalTimer;
    }
  });
  
  return true;
}

// Get the current state of a pair (vertical or horizontal)
function getPairStatus(location, pair) {
  if (!trafficLights[location]) return null;
  
  let dirs = [];
  if (pair === 'vertical') {
    dirs = ['up', 'down'];
  } else if (pair === 'horizontal') {
    dirs = ['left', 'right'];
  } else {
    return null;
  }
  
  const statuses = [];
  dirs.forEach(dir => {
    if (trafficLights[location].directions[dir]) {
      statuses.push(trafficLights[location].directions[dir].status);
    }
  });
  
  // Return the first status if all are the same, otherwise return 'mixed'
  if (statuses.length === 0) return null;
  const allSame = statuses.every(s => s === statuses[0]);
  return allSame ? statuses[0] : 'mixed';
}

// IoT Sensors Data
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

// Store previous states
let previousStates = JSON.parse(JSON.stringify(trafficLights));
let previousIotData = JSON.parse(JSON.stringify(iotData));

// WebSocket clients
const clients = new Set();

// Broadcast update to all clients
function broadcastUpdate(data) {
  const message = JSON.stringify(data);
  clients.forEach(client => {
    if (client.readyState === 1) { // WebSocket.OPEN
      client.send(message);
    }
  });
}

// Update traffic lights with proper paired directional control - FIXED VERSION
function updateTrafficLights() {
  const locations = Object.keys(trafficLights);
  const changes = [];
  
  // Check for expired emergency overrides
  const now = Date.now();
  const expiredLocations = [];
  
  Object.keys(emergencyOverrides).forEach(location => {
    const override = emergencyOverrides[location];
    if (new Date(override.expires).getTime() < now) {
      expiredLocations.push(location);
    }
  });
  
  // Process expired emergency overrides
  expiredLocations.forEach(location => {
    delete emergencyOverrides[location];
    
    // Reset to original state
    if (trafficLights[location]) {
      resetCityToOriginalState(location);
      
      // Broadcast that emergency has ended
      broadcastUpdate({
        type: 'emergencyStopped',
        location: location,
        city: trafficLights[location].city,
        province: trafficLights[location].province,
        timestamp: new Date().toISOString()
      });
      
      // Record change for all directions
      const directions = ['up', 'down', 'left', 'right'];
      directions.forEach(dir => {
        const light = trafficLights[location].directions[dir];
        if (light) {
          changes.push({
            location: location,
            direction: dir,
            oldStatus: 'emergency',
            newStatus: light.status,
            timer: light.timer,
            city: trafficLights[location].city,
            province: trafficLights[location].province,
            isEmergencyEnd: true
          });
        }
      });
    }
  });
  
  // Update each location's paired directions
  locations.forEach(location => {
    // Skip if emergency override is active
    if (emergencyOverrides[location]) return;
    
    const cityLights = trafficLights[location];
    
    // Get the current status of vertical pair (up + down)
    const verticalStatus = cityLights.directions.up ? cityLights.directions.up.status : 'green';
    const verticalTimer = cityLights.directions.up ? cityLights.directions.up.timer : 60;
    
    // Get the current status of horizontal pair (left + right)
    const horizontalStatus = cityLights.directions.left ? cityLights.directions.left.status : 'red';
    const horizontalTimer = cityLights.directions.left ? cityLights.directions.left.timer : 30;
    
    // Determine which pair is active (green) and which is inactive
    // Vertical pair (up + down) controls North/South traffic
    // Horizontal pair (left + right) controls East/West traffic
    
    // Check if vertical pair timer has expired (using up direction timer)
    if (cityLights.directions.up) {
      cityLights.directions.up.timer -= 1;
      cityLights.directions.down.timer -= 1;
      
      if (cityLights.directions.up.timer <= 0) {
        // Vertical pair timer expired - switch
        const oldVerticalStatus = cityLights.directions.up.status;
        
        if (cityLights.directions.up.status === 'green') {
          // Green -> Yellow for vertical
          cityLights.directions.up.status = 'yellow';
          cityLights.directions.up.timer = 5;
          cityLights.directions.down.status = 'yellow';
          cityLights.directions.down.timer = 5;
          
          // Horizontal stays red
          if (cityLights.directions.left && cityLights.directions.left.status !== 'red') {
            cityLights.directions.left.status = 'red';
            cityLights.directions.left.timer = 30;
            cityLights.directions.right.status = 'red';
            cityLights.directions.right.timer = 30;
          }
          
          changes.push({
            location: location,
            direction: 'vertical',
            oldStatus: 'green',
            newStatus: 'yellow',
            timer: 5,
            city: cityLights.city,
            province: cityLights.province
          });
          
        } else if (cityLights.directions.up.status === 'yellow') {
          // Yellow -> Red for vertical, Green for horizontal
          cityLights.directions.up.status = 'red';
          cityLights.directions.up.timer = 30;
          cityLights.directions.down.status = 'red';
          cityLights.directions.down.timer = 30;
          
          cityLights.directions.left.status = 'green';
          cityLights.directions.left.timer = 60;
          cityLights.directions.right.status = 'green';
          cityLights.directions.right.timer = 60;
          
          changes.push({
            location: location,
            direction: 'vertical',
            oldStatus: 'yellow',
            newStatus: 'red',
            timer: 30,
            city: cityLights.city,
            province: cityLights.province
          });
          changes.push({
            location: location,
            direction: 'horizontal',
            oldStatus: 'red',
            newStatus: 'green',
            timer: 60,
            city: cityLights.city,
            province: cityLights.province
          });
          
        } else if (cityLights.directions.up.status === 'red') {
          // Red -> Green for vertical (should not happen here, handled by horizontal)
          // This is a safety fallback
          cityLights.directions.up.status = 'green';
          cityLights.directions.up.timer = 60;
          cityLights.directions.down.status = 'green';
          cityLights.directions.down.timer = 60;
          
          cityLights.directions.left.status = 'red';
          cityLights.directions.left.timer = 30;
          cityLights.directions.right.status = 'red';
          cityLights.directions.right.timer = 30;
          
          changes.push({
            location: location,
            direction: 'vertical',
            oldStatus: 'red',
            newStatus: 'green',
            timer: 60,
            city: cityLights.city,
            province: cityLights.province
          });
        }
      }
    }
    
    // Check if horizontal pair timer has expired (using left direction timer)
    if (cityLights.directions.left && cityLights.directions.left.status === 'green') {
      cityLights.directions.left.timer -= 1;
      cityLights.directions.right.timer -= 1;
      
      if (cityLights.directions.left.timer <= 0) {
        // Horizontal pair timer expired - switch
        const oldHorizontalStatus = cityLights.directions.left.status;
        
        if (cityLights.directions.left.status === 'green') {
          // Green -> Yellow for horizontal
          cityLights.directions.left.status = 'yellow';
          cityLights.directions.left.timer = 5;
          cityLights.directions.right.status = 'yellow';
          cityLights.directions.right.timer = 5;
          
          // Vertical stays red
          if (cityLights.directions.up && cityLights.directions.up.status !== 'red') {
            cityLights.directions.up.status = 'red';
            cityLights.directions.up.timer = 30;
            cityLights.directions.down.status = 'red';
            cityLights.directions.down.timer = 30;
          }
          
          changes.push({
            location: location,
            direction: 'horizontal',
            oldStatus: 'green',
            newStatus: 'yellow',
            timer: 5,
            city: cityLights.city,
            province: cityLights.province
          });
          
        } else if (cityLights.directions.left.status === 'yellow') {
          // Yellow -> Red for horizontal, Green for vertical
          cityLights.directions.left.status = 'red';
          cityLights.directions.left.timer = 30;
          cityLights.directions.right.status = 'red';
          cityLights.directions.right.timer = 30;
          
          cityLights.directions.up.status = 'green';
          cityLights.directions.up.timer = 60;
          cityLights.directions.down.status = 'green';
          cityLights.directions.down.timer = 60;
          
          changes.push({
            location: location,
            direction: 'horizontal',
            oldStatus: 'yellow',
            newStatus: 'red',
            timer: 30,
            city: cityLights.city,
            province: cityLights.province
          });
          changes.push({
            location: location,
            direction: 'vertical',
            oldStatus: 'red',
            newStatus: 'green',
            timer: 60,
            city: cityLights.city,
            province: cityLights.province
          });
        }
      }
    }
  });
  
  // Broadcast changes if any
  if (changes.length > 0) {
    broadcastUpdate({
      type: 'statusChange',
      changes: changes,
      timestamp: new Date().toISOString()
    });
  }
  
  previousStates = JSON.parse(JSON.stringify(trafficLights));
}

// Update IoT data
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

// Calculate statistics with directional data
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
  setPairedDirections,
  getPairStatus,
  resetCityToOriginalState,
  calculateStats
};
