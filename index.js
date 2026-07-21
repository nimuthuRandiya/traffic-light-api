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
const { balanceManager } = require('./file-balance');

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
    balanceStatus: balanceManager.getGlobalStatus(),
    directions: ['up', 'down', 'left', 'right'],
    timestamp: new Date().toISOString()
  }));
  
  ws.on('message', (message) => {
    try {
      const data = JSON.parse(message);
      if (data.type === 'ping') {
        ws.send(JSON.stringify({ type: 'pong', timestamp: new Date().toISOString() }));
      }
      // Handle balance manager commands via WebSocket
      else if (data.type === 'getBalanceReport') {
        const report = balanceManager.getBalanceReport(data.location);
        ws.send(JSON.stringify({
          type: 'balanceReport',
          data: report,
          timestamp: new Date().toISOString()
        }));
      }
      else if (data.type === 'getGlobalStatus') {
        ws.send(JSON.stringify({
          type: 'globalBalanceStatus',
          data: balanceManager.getGlobalStatus(),
          timestamp: new Date().toISOString()
        }));
      }
      else if (data.type === 'resetBalanceStats') {
        const result = balanceManager.resetBalanceStats(data.location);
        ws.send(JSON.stringify({
          type: 'balanceReset',
          location: data.location,
          success: result,
          timestamp: new Date().toISOString()
        }));
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

// DISABLE original traffic light update - use balance manager instead
// setInterval(updateTrafficLights, 1000);
// The balance manager now handles traffic light timing

// Keep IoT updates
setInterval(() => {
  updateIotData();
  broadcastIotUpdates();
}, 3000);

// Broadcast balance status periodically
setInterval(() => {
  if (clients.size > 0) {
    broadcastUpdate({
      type: 'balanceStatus',
      data: balanceManager.getGlobalStatus(),
      timestamp: new Date().toISOString()
    });
  }
}, 30000);

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
  console.log('\n⚖️ Time Balance System Status:');
  console.log(`   ✅ Balance Manager: Active`);
  console.log(`   🔄 Balance Interval: ${balanceManager.balanceInterval ? 'Running' : 'Stopped'}`);
  console.log(`   📊 Total Locations: ${Object.keys(balanceManager.balanceState).length}`);
  console.log(`   ⚖️ Global Fairness: ${(balanceManager.globalMetrics?.avgFairness * 100 || 0).toFixed(1)}%`);
  console.log(`   📈 Emergency Mode: ${balanceManager.emergencyMode ? 'ACTIVE' : 'Inactive'}`);
  console.log('\n✅ COLLISION PREVENTION:');
  console.log('   ❌ Left and Right can NEVER be green with Up and Down');
  console.log('   ❌ Only one direction pair green at a time');
  console.log('   ⚖️ Dynamic time balancing based on traffic');
  console.log('   📊 Fair distribution across all 4 directions');
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
  console.log('\nBalance API Endpoints (New):');
  console.log('   GET  /api/balance/status');
  console.log('   GET  /api/balance/report/:location');
  console.log('   GET  /api/balance/reports');
  console.log('   GET  /api/balance/fairness');
  console.log('   POST /api/balance/emergency');
  console.log('   POST /api/balance/reset');
  console.log('   POST /api/balance/run');
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
