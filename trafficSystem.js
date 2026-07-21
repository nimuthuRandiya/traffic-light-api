// Emergency overrides storage
let emergencyOverrides = {};

// Store original timers and statuses for emergency recovery
const ORIGINAL_TIMERS = {};
const ORIGINAL_STATUSES = {};

// Traffic light state management for all Sri Lankan cities with directional controls
// Each city has a single phase that controls both pairs simultaneously
const trafficLights = {
  // ============ COLOMBO ============
  colombo: {
    city: 'Colombo',
    province: 'Western',
    phase: 'vertical-green', // vertical-green, vertical-yellow, horizontal-green, horizontal-yellow
    phaseTimer: 60,
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
    phase: 'horizontal-green',
    phaseTimer: 50,
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
    phase: 'horizontal-green',
    phaseTimer: 55,
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
    phase: 'vertical-green',
    phaseTimer: 45,
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
    phase: 'horizontal-green',
    phaseTimer: 48,
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
    phase: 'vertical-green',
    phaseTimer: 50,
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
    phase: 'horizontal-green',
    phaseTimer: 45,
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
    phase: 'horizontal-green',
    phaseTimer: 52,
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
    phase: 'vertical-green',
    phaseTimer: 55,
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
    phase: 'vertical-green',
    phaseTimer: 45,
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
    phase: 'horizontal-green',
    phaseTimer: 50,
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
    phase: 'horizontal-green',
    phaseTimer: 48,
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
    phase: 'vertical-green',
    phaseTimer: 50,
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
    phase: 'horizontal-green',
    phaseTimer: 45,
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
    phase: 'horizontal-green',
    phaseTimer: 55,
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
    phase: 'vertical-green',
    phaseTimer: 48,
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
    phase: 'horizontal-green',
    phaseTimer: 50,
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
    phase: 'horizontal-green',
    phaseTimer: 52,
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
    phase: 'vertical-green',
    phaseTimer: 42,
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
    phase: 'horizontal-green',
    phaseTimer: 48,
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
    phase: 'vertical-green',
    phaseTimer: 38,
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
    phase: 'horizontal-green',
    phaseTimer: 52,
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
    phase: 'vertical-green',
    phaseTimer: 52,
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
    phase: 'horizontal-green',
    phaseTimer: 45,
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
    phase: 'horizontal-green',
    phaseTimer: 48,
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
    phase: 'vertical-green',
    phaseTimer: 44,
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
    phase: 'horizontal-green',
    phaseTimer: 50,
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
    phase: 'horizontal-green',
    phaseTimer: 48,
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
    phase: 'vertical-green',
    phaseTimer: 49,
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

// Helper function to set direction status (with phase validation)
function setDirectionStatus(location, direction, status, timer) {
  if (!trafficLights[location]) return false;
  if (!trafficLights[location].directions[direction]) return false;
  
  // Validate: If setting a direction to green, ensure the opposite pair is red
  if (status === 'green') {
    const isVertical = (direction === 'up' || direction === 'down');
    const oppositePair = isVertical ? ['left', 'right'] : ['up', 'down'];
    const oppositeStatuses = oppositePair.map(dir => trafficLights[location].directions[dir]?.status);
    
    // If any opposite direction is green, prevent this change
    if (oppositeStatuses.some(s => s === 'green')) {
      console.warn(`Cannot set ${direction} to green because opposite pair is green at ${location}`);
      return false;
    }
  }
  
  trafficLights[location].directions[direction].status = status;
  if (timer !== undefined) {
    trafficLights[location].directions[direction].timer = timer;
  }
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
  
  // Also restore phase based on original statuses
  const upStatus = trafficLights[location].directions.up?.status || 'green';
  if (upStatus === 'green' || upStatus === 'yellow') {
    trafficLights[location].phase = upStatus === 'green' ? 'vertical-green' : 'vertical-yellow';
  } else {
    const leftStatus = trafficLights[location].directions.left?.status || 'green';
    trafficLights[location].phase = leftStatus === 'green' ? 'horizontal-green' : 'horizontal-yellow';
  }
  
  return true;
}

// Update traffic lights with SINGLE PHASE state machine - FIXED
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
  
  // Update each location using SINGLE PHASE state machine
  locations.forEach(location => {
    // Skip if emergency override is active
    if (emergencyOverrides[location]) return;
    
    const cityLights = trafficLights[location];
    const currentPhase = cityLights.phase;
    const phaseTimer = cityLights.phaseTimer || 0;
    
    // Decrement phase timer
    cityLights.phaseTimer -= 1;
    
    // Check if phase timer expired
    if (cityLights.phaseTimer <= 0) {
      let oldStatus = '';
      let newPhase = '';
      let newTimer = 0;
      
      // Phase transitions - SINGLE STATE MACHINE
      switch (currentPhase) {
        case 'vertical-green':
          // Vertical Green -> Vertical Yellow
          oldStatus = 'green';
          newPhase = 'vertical-yellow';
          newTimer = 5;
          
          // Update directions
          cityLights.directions.up.status = 'yellow';
          cityLights.directions.up.timer = 5;
          cityLights.directions.down.status = 'yellow';
          cityLights.directions.down.timer = 5;
          // Horizontal stays red
          cityLights.directions.left.status = 'red';
          cityLights.directions.left.timer = 30;
          cityLights.directions.right.status = 'red';
          cityLights.directions.right.timer = 30;
          
          changes.push({
            location: location,
            direction: 'vertical',
            oldStatus: 'green',
            newStatus: 'yellow',
            timer: 5,
            city: cityLights.city,
            province: cityLights.province,
            phase: 'vertical-yellow'
          });
          break;
          
        case 'vertical-yellow':
          // Vertical Yellow -> Horizontal Green
          oldStatus = 'yellow';
          newPhase = 'horizontal-green';
          newTimer = 60;
          
          // Vertical to red
          cityLights.directions.up.status = 'red';
          cityLights.directions.up.timer = 30;
          cityLights.directions.down.status = 'red';
          cityLights.directions.down.timer = 30;
          // Horizontal to green
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
            province: cityLights.province,
            phase: 'horizontal-green'
          });
          changes.push({
            location: location,
            direction: 'horizontal',
            oldStatus: 'red',
            newStatus: 'green',
            timer: 60,
            city: cityLights.city,
            province: cityLights.province,
            phase: 'horizontal-green'
          });
          break;
          
        case 'horizontal-green':
          // Horizontal Green -> Horizontal Yellow
          oldStatus = 'green';
          newPhase = 'horizontal-yellow';
          newTimer = 5;
          
          // Horizontal to yellow
          cityLights.directions.left.status = 'yellow';
          cityLights.directions.left.timer = 5;
          cityLights.directions.right.status = 'yellow';
          cityLights.directions.right.timer = 5;
          // Vertical stays red
          cityLights.directions.up.status = 'red';
          cityLights.directions.up.timer = 30;
          cityLights.directions.down.status = 'red';
          cityLights.directions.down.timer = 30;
          
          changes.push({
            location: location,
            direction: 'horizontal',
            oldStatus: 'green',
            newStatus: 'yellow',
            timer: 5,
            city: cityLights.city,
            province: cityLights.province,
            phase: 'horizontal-yellow'
          });
          break;
          
        case 'horizontal-yellow':
          // Horizontal Yellow -> Vertical Green
          oldStatus = 'yellow';
          newPhase = 'vertical-green';
          newTimer = 60;
          
          // Horizontal to red
          cityLights.directions.left.status = 'red';
          cityLights.directions.left.timer = 30;
          cityLights.directions.right.status = 'red';
          cityLights.directions.right.timer = 30;
          // Vertical to green
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
            province: cityLights.province,
            phase: 'vertical-green'
          });
          changes.push({
            location: location,
            direction: 'vertical',
            oldStatus: 'red',
            newStatus: 'green',
            timer: 60,
            city: cityLights.city,
            province: cityLights.province,
            phase: 'vertical-green'
          });
          break;
          
        default:
          // Fallback - default to vertical green
          newPhase = 'vertical-green';
          newTimer = 60;
          cityLights.directions.up.status = 'green';
          cityLights.directions.up.timer = 60;
          cityLights.directions.down.status = 'green';
          cityLights.directions.down.timer = 60;
          cityLights.directions.left.status = 'red';
          cityLights.directions.left.timer = 30;
          cityLights.directions.right.status = 'red';
          cityLights.directions.right.timer = 30;
          break;
      }
      
      // Update phase
      cityLights.phase = newPhase;
      cityLights.phaseTimer = newTimer;
      
    } else {
      // Timer not expired - just update the timer display in directions
      // (The actual statuses remain the same, only timers decrease)
      const directions = ['up', 'down', 'left', 'right'];
      directions.forEach(dir => {
        if (cityLights.directions[dir]) {
          // Decrement timer for display purposes
          cityLights.directions[dir].timer = Math.max(0, cityLights.directions[dir].timer - 1);
        }
      });
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
  resetCityToOriginalState,
  calculateStats
};
