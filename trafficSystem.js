// Emergency overrides storage
let emergencyOverrides = {};

// Traffic light state management for all Sri Lankan cities
const trafficLights = {
  colombo: { status: 'green', timer: 60, city: 'Colombo', province: 'Western' },
  kandy: { status: 'red', timer: 30, city: 'Kandy', province: 'Central' },
  galle: { status: 'yellow', timer: 5, city: 'Galle', province: 'Southern' },
  negombo: { status: 'green', timer: 45, city: 'Negombo', province: 'Western' },
  jaffna: { status: 'red', timer: 35, city: 'Jaffna', province: 'Northern' },
  anuradhapura: { status: 'green', timer: 50, city: 'Anuradhapura', province: 'North Central' },
  polonnaruwa: { status: 'yellow', timer: 8, city: 'Polonnaruwa', province: 'North Central' },
  badulla: { status: 'red', timer: 25, city: 'Badulla', province: 'Uva' },
  ratnapura: { status: 'green', timer: 55, city: 'Ratnapura', province: 'Sabaragamuwa' },
  kurunegala_1: { status: 'green', timer: 45, city: 'Kurunegala - Main', province: 'North Western' },
  kurunegala_2: { status: 'red', timer: 30, city: 'Kurunegala - Town Hall', province: 'North Western' },
  kurunegala_3: { status: 'yellow', timer: 8, city: 'Kurunegala - Railway', province: 'North Western' },
  kurunegala_4: { status: 'green', timer: 50, city: 'Kurunegala - Hospital', province: 'North Western' },
  kurunegala_5: { status: 'red', timer: 35, city: 'Kurunegala - Bus Stand', province: 'North Western' },
  matara: { status: 'red', timer: 40, city: 'Matara', province: 'Southern' },
  batticaloa: { status: 'green', timer: 48, city: 'Batticaloa', province: 'Eastern' },
  trincomalee: { status: 'yellow', timer: 7, city: 'Trincomalee', province: 'Eastern' },
  kalutara: { status: 'red', timer: 32, city: 'Kalutara', province: 'Western' },
  avissawella: { status: 'green', timer: 42, city: 'Avissawella', province: 'Western' },
  gampaha: { status: 'yellow', timer: 9, city: 'Gampaha', province: 'Western' },
  matale: { status: 'green', timer: 38, city: 'Matale', province: 'Central' },
  nugegoda: { status: 'red', timer: 28, city: 'Nugegoda', province: 'Western' },
  moratuwa: { status: 'green', timer: 52, city: 'Moratuwa', province: 'Western' },
  dehiwala: { status: 'yellow', timer: 10, city: 'Dehiwala', province: 'Western' },
  mountlavinia: { status: 'red', timer: 33, city: 'Mount Lavinia', province: 'Western' },
  chilaw: { status: 'green', timer: 44, city: 'Chilaw', province: 'North Western' },
  puttalam: { status: 'yellow', timer: 7, city: 'Puttalam', province: 'North Western' },
  homagama: { status: 'red', timer: 36, city: 'Homagama', province: 'Western' },
  maharagama: { status: 'green', timer: 49, city: 'Maharagama', province: 'Western' }
};

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

// Update traffic lights
function updateTrafficLights() {
  const locations = Object.keys(trafficLights);
  const changes = [];
  
  // Check for expired emergency overrides
  const now = Date.now();
  Object.keys(emergencyOverrides).forEach(location => {
    const override = emergencyOverrides[location];
    if (new Date(override.expires).getTime() < now) {
      delete emergencyOverrides[location];
      if (trafficLights[location]) {
        trafficLights[location].status = 'green';
        trafficLights[location].timer = 60;
      }
    }
  });
  
  locations.forEach(location => {
    if (emergencyOverrides[location]) return;
    
    const light = trafficLights[location];
    light.timer -= 1;
    
    if (light.timer <= 0) {
      const oldStatus = light.status;
      if (light.status === 'green') {
        light.status = 'yellow';
        light.timer = 5;
      } else if (light.status === 'yellow') {
        light.status = 'red';
        light.timer = 30;
      } else if (light.status === 'red') {
        light.status = 'green';
        light.timer = 60;
      }
      
      changes.push({
        location: location,
        oldStatus: oldStatus,
        newStatus: light.status,
        timer: light.timer,
        city: light.city,
        province: light.province
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

module.exports = {
  trafficLights,
  iotData,
  emergencyOverrides,
  clients,
  updateTrafficLights,
  updateIotData,
  broadcastUpdate
};