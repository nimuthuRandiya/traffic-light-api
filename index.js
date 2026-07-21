const http = require('http');
const WebSocket = require('ws');
const { 
  trafficLights, 
  iotData, 
  emergencyOverrides, 
  updateTrafficLights, 
  updateIotData, 
  broadcastUpdate, 
  clients, 
  calculateStats 
} = require('./trafficSystem');
const { handleApiRequest } = require('./apiHandler');

const port = process.env.PORT || 3000;

const server = http.createServer((req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  const url = new URL(req.url, `http://localhost:${port}`);
  const pathname = url.pathname;

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
    directions: ['up', 'down', 'left', 'right'],
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
  console.log('with Directional Control (⬆️⬇️⬅️➡️)');
  console.log('========================================');
  console.log(`Server running at http://localhost:${port}`);
  console.log(`Total cities monitored: ${Object.keys(trafficLights).length}`);
  console.log(`Total traffic directions: ${Object.keys(trafficLights).length * 4}`);
  console.log(`Directions available: Up, Down, Left, Right`);
  console.log('\nKurunegala Intersections:');
  console.log(`   1. Kurunegala - Main (${Object.keys(trafficLights.kurunegala_1.directions).length} directions)`);
  console.log(`   2. Kurunegala - Town Hall (${Object.keys(trafficLights.kurunegala_2.directions).length} directions)`);
  console.log(`   3. Kurunegala - Railway (${Object.keys(trafficLights.kurunegala_3.directions).length} directions)`);
  console.log(`   4. Kurunegala - Hospital (${Object.keys(trafficLights.kurunegala_4.directions).length} directions)`);
  console.log(`   5. Kurunegala - Bus Stand (${Object.keys(trafficLights.kurunegala_5.directions).length} directions)`);
  console.log('\nIoT Devices Connected:');
  console.log(`   📷 Computer Vision Cameras: ${Object.keys(iotData.cameras).length}`);
  console.log(`   🔄 Inductive Loop Sensors: ${Object.keys(iotData.inductiveLoops).length}`);
  console.log(`   🌫️ Air Quality Sensors: ${Object.keys(iotData.airQuality).length}`);
  console.log(`   🚌 Fleet GPS Trackers: ${Object.keys(iotData.fleet).length}`);
  console.log('\nAvailable API Endpoints:');
  console.log('   GET  /api/health');
  console.log('   GET  /api/traffic-lights');
  console.log('   GET  /api/traffic-lights/:location');
  console.log('   GET  /api/trafficlight/direction?city=&direction=');
  console.log('   POST /api/trafficlight/direction');
  console.log('   POST /api/trafficlight/bulk/direction');
  console.log('   GET  /api/cities');
  console.log('   GET  /api/provinces');
  console.log('   GET  /api/stats');
  console.log('   GET  /api/iot');
  console.log('   GET  /api/iot/cameras');
  console.log('   GET  /api/iot/loops');
  console.log('   GET  /api/iot/airquality');
  console.log('   GET  /api/iot/fleet');
  console.log('   GET  /api/emergency/overrides');
  console.log('   POST /api/emergency/green');
  console.log('   POST /api/emergency/red');
  console.log('   POST /api/emergency/stop');
  console.log('\nWebSocket:');
  console.log(`   ws://localhost:${port} (Real-time updates)`);
  console.log('========================================');
  console.log('Press Ctrl+C to stop the server');
});

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
