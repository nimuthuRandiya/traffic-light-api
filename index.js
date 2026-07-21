const http = require('http');
const WebSocket = require('ws');
const { trafficLights, iotData, emergencyOverrides, updateTrafficLights, updateIotData, broadcastUpdate, clients } = require('./trafficSystem');
const { handleApiRequest } = require('./apiHandler');

const port = process.env.PORT || 3000;

const server = http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  const url = new URL(req.url, `http://localhost:${port}`);
  const pathname = url.pathname;

  // API Gateway
  if (pathname.startsWith('/api/')) {
    handleApiRequest(req, res, url);
    return;
  }

  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ 
    error: 'API endpoint not found',
    message: 'This is a pure API server. All endpoints start with /api/'
  }));
});

// Create WebSocket server
const wss = new WebSocket.Server({ server });

wss.on('connection', (ws) => {
  clients.add(ws);
  console.log(`WebSocket client connected. Total clients: ${clients.size}`);
  
  ws.send(JSON.stringify({
    type: 'initialState',
    data: trafficLights,
    stats: calculateStats(),
    iot: iotData,
    emergencyOverrides: emergencyOverrides,
    timestamp: new Date().toISOString()
  }));
  
  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message);
      if (data.type === 'ping') {
        ws.send(JSON.stringify({ type: 'pong', timestamp: new Date().toISOString() }));
      }
    } catch (error) {
      console.error('Error processing WebSocket message:', error);
    }
  });
  
  ws.on('close', () => {
    clients.delete(ws);
    console.log(`WebSocket client disconnected. Total clients: ${clients.size}`);
  });
});

// Start traffic light updates
setInterval(updateTrafficLights, 1000);
setInterval(() => {
  updateIotData();
  broadcastIotUpdates();
}, 3000);

server.listen(port, () => {
  console.log('========================================');
  console.log('Road Lanka IoT Traffic Management System API');
  console.log('========================================');
  console.log(`Server running at http://localhost:${port}`);
  console.log(`Total cities monitored: ${Object.keys(trafficLights).length}`);
  console.log('\nIoT Devices Connected:');
  console.log(`   📷 Computer Vision Cameras: ${Object.keys(iotData.cameras).length}`);
  console.log(`   🔄 Inductive Loop Sensors: ${Object.keys(iotData.inductiveLoops).length}`);
  console.log(`   🌫️ Air Quality Sensors: ${Object.keys(iotData.airQuality).length}`);
  console.log(`   🚌 Fleet GPS Trackers: ${Object.keys(iotData.fleet).length}`);
  console.log('\nAvailable API Endpoints:');
  console.log(`   GET  /api/health`);
  console.log(`   GET  /api/traffic-lights`);
  console.log(`   GET  /api/traffic-lights/:location`);
  console.log(`   GET  /api/traffic-lights/status?status=red|yellow|green`);
  console.log(`   GET  /api/provinces`);
  console.log(`   GET  /api/stats`);
  console.log(`   GET  /api/iot`);
  console.log(`   GET  /api/iot/cameras`);
  console.log(`   GET  /api/iot/loops`);
  console.log(`   GET  /api/iot/airquality`);
  console.log(`   GET  /api/iot/fleet`);
  console.log(`   GET  /api/emergency/overrides`);
  console.log(`   POST /api/emergency/green`);
  console.log(`   POST /api/emergency/red`);
  console.log(`   PUT  /api/traffic-lights/:location`);
  console.log(`   POST /api/traffic-lights/batch`);
  console.log('\nWebSocket:');
  console.log(`   ws://localhost:${port} (Real-time updates)`);
  console.log('========================================');
  console.log('Press Ctrl+C to stop the server');
});

function calculateStats() {
  const total = Object.keys(trafficLights).length;
  const statusCounts = { red: 0, yellow: 0, green: 0 };
  const provinceStats = {};
  
  Object.keys(trafficLights).forEach(key => {
    const light = trafficLights[key];
    statusCounts[light.status]++;
    
    if (!provinceStats[light.province]) {
      provinceStats[light.province] = { total: 0, red: 0, yellow: 0, green: 0 };
    }
    provinceStats[light.province].total++;
    provinceStats[light.province][light.status]++;
  });
  
  return {
    totalCities: total,
    statusDistribution: statusCounts,
    provinceStats: provinceStats,
    timestamp: new Date().toISOString()
  };
}

function broadcastIotUpdates() {
  const changes = {};
  const previousIotData = { cameras: {}, inductiveLoops: {}, airQuality: {}, fleet: {} };
  
  Object.keys(iotData).forEach(category => {
    const current = iotData[category];
    const previous = previousIotData[category];
    
    if (JSON.stringify(current) !== JSON.stringify(previous)) {
      changes[category] = current;
    }
  });
  
  if (Object.keys(changes).length > 0 && clients.size > 0) {
    broadcastUpdate({
      type: 'iotUpdate',
      data: changes,
      timestamp: new Date().toISOString()
    });
  }
}
