const { trafficLights, iotData, emergencyOverrides, broadcastUpdate } = require('./trafficSystem');

function handleApiRequest(req, res, url) {
  const pathname = url.pathname;

  // ============================================
  // CORS HANDLING - OPTIONS Preflight
  // ============================================
  if (req.method === 'OPTIONS') {
    res.writeHead(204, {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization, X-Requested-With, Accept',
      'Access-Control-Max-Age': '86400'
    });
    res.end();
    return;
  }

  // Helper function to set CORS headers
  function setCorsHeaders(res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept');
    res.setHeader('Access-Control-Expose-Headers', 'Content-Type');
  }

  // ============================================
  // HEALTH CHECK
  // ============================================
  if (pathname === '/api/health') {
    setCorsHeaders(res);
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ 
      status: 'ok', 
      message: 'Road Lanka IoT Traffic Management System API',
      version: '2.0.0',
      totalCities: Object.keys(trafficLights).length,
      iotDevices: {
        cameras: Object.keys(iotData.cameras).length,
        inductiveLoops: Object.keys(iotData.inductiveLoops).length,
        airQuality: Object.keys(iotData.airQuality).length,
        fleet: Object.keys(iotData.fleet).length
      },
      timestamp: new Date().toISOString()
    }));
    return;
  }

  // ==================== TRAFFIC LIGHT CONTROL ====================
  
  // Set traffic light by city name
  if (pathname === '/api/trafficlight' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });

    req.on('end', () => {
      setCorsHeaders(res);
      try {
        const data = JSON.parse(body);
        const { city, status } = data;

        if (!city) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({
            error: 'City name is required',
            example: {
              city: 'colombo',
              status: 'green'
            }
          }));
          return;
        }

        // Find city in traffic lights (case insensitive)
        const cityKey = Object.keys(trafficLights).find(
          key => trafficLights[key].city.toLowerCase() === city.toLowerCase()
        );

        if (!cityKey) {
          res.writeHead(404, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({
            error: 'City not found',
            availableCities: Object.values(trafficLights).map(t => t.city),
            timestamp: new Date().toISOString()
          }));
          return;
        }

        // Validate status
        if (!status || !['red', 'yellow', 'green'].includes(status.toLowerCase())) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({
            error: 'Invalid status',
            validStatuses: ['red', 'yellow', 'green'],
            timestamp: new Date().toISOString()
          }));
          return;
        }

        // Update traffic light
        const newStatus = status.toLowerCase();
        trafficLights[cityKey].status = newStatus;
        trafficLights[cityKey].timer = newStatus === 'green' ? 60 : newStatus === 'yellow' ? 5 : 30;

        // Remove any emergency override for this location
        if (emergencyOverrides[cityKey]) {
          delete emergencyOverrides[cityKey];
        }

        // Broadcast update via WebSocket
        broadcastUpdate({
          type: 'manualUpdate',
          location: cityKey,
          data: trafficLights[cityKey],
          city: trafficLights[cityKey].city,
          province: trafficLights[cityKey].province,
          timestamp: new Date().toISOString()
        });

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          success: true,
          message: `Traffic light for ${trafficLights[cityKey].city} set to ${newStatus}`,
          location: cityKey,
          city: trafficLights[cityKey].city,
          province: trafficLights[cityKey].province,
          status: newStatus,
          timer: trafficLights[cityKey].timer,
          timestamp: new Date().toISOString()
        }));

      } catch (error) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          error: 'Invalid request',
          message: error.message,
          example: {
            city: 'colombo',
            status: 'green'
          }
        }));
      }
    });
    return;
  }

  // Get traffic light status by city name
  if (pathname === '/api/trafficlight' && req.method === 'GET') {
    setCorsHeaders(res);
    const city = url.searchParams.get('city');
    
    if (city) {
      const cityKey = Object.keys(trafficLights).find(
        key => trafficLights[key].city.toLowerCase() === city.toLowerCase()
      );

      if (!cityKey) {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          error: 'City not found',
          availableCities: Object.values(trafficLights).map(t => t.city),
          timestamp: new Date().toISOString()
        }));
        return;
      }

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        location: cityKey,
        city: trafficLights[cityKey].city,
        province: trafficLights[cityKey].province,
        status: trafficLights[cityKey].status,
        timer: trafficLights[cityKey].timer,
        timestamp: new Date().toISOString()
      }));
      return;
    }

    // Get all traffic lights with city names
    const allLights = {};
    Object.keys(trafficLights).forEach(key => {
      allLights[key] = {
        city: trafficLights[key].city,
        province: trafficLights[key].province,
        status: trafficLights[key].status,
        timer: trafficLights[key].timer
      };
    });

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      total: Object.keys(allLights).length,
      data: allLights,
      timestamp: new Date().toISOString()
    }));
    return;
  }

  // ==================== BULK TRAFFIC LIGHT CONTROL ====================
  
  // Set multiple traffic lights by city name
  if (pathname === '/api/trafficlight/bulk' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });

    req.on('end', () => {
      setCorsHeaders(res);
      try {
        const data = JSON.parse(body);
        const { updates } = data;

        if (!updates || !Array.isArray(updates) || updates.length === 0) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({
            error: 'Updates array is required',
            example: {
              updates: [
                { city: 'colombo', status: 'red' },
                { city: 'kandy', status: 'green' }
              ]
            }
          }));
          return;
        }

        const results = [];
        const errors = [];

        updates.forEach(update => {
          const { city, status } = update;
          
          if (!city || !status) {
            errors.push({
              city: city || 'unknown',
              error: 'City and status are required'
            });
            return;
          }

          const cityKey = Object.keys(trafficLights).find(
            key => trafficLights[key].city.toLowerCase() === city.toLowerCase()
          );

          if (!cityKey) {
            errors.push({
              city: city,
              error: 'City not found'
            });
            return;
          }

          if (!['red', 'yellow', 'green'].includes(status.toLowerCase())) {
            errors.push({
              city: city,
              error: 'Invalid status. Use: red, yellow, or green'
            });
            return;
          }

          const newStatus = status.toLowerCase();
          trafficLights[cityKey].status = newStatus;
          trafficLights[cityKey].timer = newStatus === 'green' ? 60 : newStatus === 'yellow' ? 5 : 30;

          if (emergencyOverrides[cityKey]) {
            delete emergencyOverrides[cityKey];
          }

          results.push({
            location: cityKey,
            city: trafficLights[cityKey].city,
            province: trafficLights[cityKey].province,
            status: newStatus,
            timer: trafficLights[cityKey].timer
          });
        });

        // Broadcast bulk update
        if (results.length > 0) {
          broadcastUpdate({
            type: 'bulkManualUpdate',
            updates: results,
            timestamp: new Date().toISOString()
          });
        }

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          success: true,
          totalProcessed: results.length,
          totalErrors: errors.length,
          results: results,
          errors: errors,
          timestamp: new Date().toISOString()
        }));

      } catch (error) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          error: 'Invalid request',
          message: error.message,
          example: {
            updates: [
              { city: 'colombo', status: 'red' },
              { city: 'kandy', status: 'green' }
            ]
          }
        }));
      }
    });
    return;
  }

  // ==================== GET CITY LIST ====================
  
  // Get all city names and their status
  if (pathname === '/api/cities' && req.method === 'GET') {
    setCorsHeaders(res);
    const cities = Object.keys(trafficLights).map(key => ({
      id: key,
      city: trafficLights[key].city,
      province: trafficLights[key].province,
      status: trafficLights[key].status,
      timer: trafficLights[key].timer
    }));

    // Group by province
    const grouped = {};
    cities.forEach(city => {
      if (!grouped[city.province]) {
        grouped[city.province] = [];
      }
      grouped[city.province].push(city);
    });

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      total: cities.length,
      cities: cities,
      grouped: grouped,
      timestamp: new Date().toISOString()
    }));
    return;
  }

  // ==================== IOT ENDPOINTS ====================

  // Get IoT data
  if (pathname === '/api/iot' && req.method === 'GET') {
    setCorsHeaders(res);
    const category = url.searchParams.get('category');
    let data = iotData;
    
    if (category && iotData[category]) {
      data = { [category]: iotData[category] };
    }
    
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      data: data,
      timestamp: new Date().toISOString()
    }));
    return;
  }

  // Get cameras
  if (pathname === '/api/iot/cameras' && req.method === 'GET') {
    setCorsHeaders(res);
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      cameras: iotData.cameras,
      total: Object.keys(iotData.cameras).length,
      timestamp: new Date().toISOString()
    }));
    return;
  }

  // Get inductive loops
  if (pathname === '/api/iot/loops' && req.method === 'GET') {
    setCorsHeaders(res);
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      loops: iotData.inductiveLoops,
      total: Object.keys(iotData.inductiveLoops).length,
      timestamp: new Date().toISOString()
    }));
    return;
  }

  // Get air quality
  if (pathname === '/api/iot/airquality' && req.method === 'GET') {
    setCorsHeaders(res);
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      airQuality: iotData.airQuality,
      total: Object.keys(iotData.airQuality).length,
      timestamp: new Date().toISOString()
    }));
    return;
  }

  // Get fleet
  if (pathname === '/api/iot/fleet' && req.method === 'GET') {
    setCorsHeaders(res);
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      fleet: iotData.fleet,
      total: Object.keys(iotData.fleet).length,
      timestamp: new Date().toISOString()
    }));
    return;
  }

  // ==================== EMERGENCY ENDPOINTS ====================

  // Get emergency overrides
  if (pathname === '/api/emergency/overrides' && req.method === 'GET') {
    setCorsHeaders(res);
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      overrides: emergencyOverrides,
      total: Object.keys(emergencyOverrides).length,
      timestamp: new Date().toISOString()
    }));
    return;
  }

  // Emergency override - Set green
  if (pathname === '/api/emergency/green' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });

    req.on('end', () => {
      setCorsHeaders(res);
      try {
        const data = JSON.parse(body);
        const { location, duration } = data;

        if (!location || !trafficLights[location]) {
          res.writeHead(404, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ 
            error: 'Location not found',
            availableLocations: Object.keys(trafficLights)
          }));
          return;
        }

        trafficLights[location].status = 'green';
        trafficLights[location].timer = 60;

        emergencyOverrides[location] = {
          action: 'green',
          duration: duration || 60,
          timestamp: new Date().toISOString(),
          expires: new Date(Date.now() + (duration || 60) * 1000).toISOString()
        };

        broadcastUpdate({
          type: 'emergencyOverride',
          location: location,
          action: 'green',
          data: trafficLights[location],
          timestamp: new Date().toISOString()
        });

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          success: true,
          message: `Emergency override set for ${trafficLights[location].city}`,
          location: location,
          city: trafficLights[location].city,
          action: 'green',
          duration: duration || 60,
          timestamp: new Date().toISOString()
        }));
      } catch (error) {
        console.error('Emergency green error:', error);
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ 
          error: 'Invalid request',
          message: error.message
        }));
      }
    });
    return;
  }

  // Emergency override - Set red
  if (pathname === '/api/emergency/red' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });

    req.on('end', () => {
      setCorsHeaders(res);
      try {
        const data = JSON.parse(body);
        const { location, duration } = data;

        if (!location || !trafficLights[location]) {
          res.writeHead(404, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ 
            error: 'Location not found',
            availableLocations: Object.keys(trafficLights)
          }));
          return;
        }

        trafficLights[location].status = 'red';
        trafficLights[location].timer = 60;

        emergencyOverrides[location] = {
          action: 'red',
          duration: duration || 60,
          timestamp: new Date().toISOString(),
          expires: new Date(Date.now() + (duration || 60) * 1000).toISOString()
        };

        broadcastUpdate({
          type: 'emergencyOverride',
          location: location,
          action: 'red',
          data: trafficLights[location],
          timestamp: new Date().toISOString()
        });

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          success: true,
          message: `Emergency stop set for ${trafficLights[location].city}`,
          location: location,
          city: trafficLights[location].city,
          action: 'red',
          duration: duration || 60,
          timestamp: new Date().toISOString()
        }));
      } catch (error) {
        console.error('Emergency red error:', error);
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ 
          error: 'Invalid request',
          message: error.message
        }));
      }
    });
    return;
  }

  // ==================== TRAFFIC LIGHTS ENDPOINTS ====================

  // Get all traffic lights
  if (pathname === '/api/traffic-lights' && req.method === 'GET') {
    setCorsHeaders(res);
    const province = url.searchParams.get('province');
    const status = url.searchParams.get('status');
    let data = trafficLights;
    
    if (province) {
      const filtered = {};
      Object.keys(trafficLights).forEach(key => {
        if (trafficLights[key].province.toLowerCase() === province.toLowerCase()) {
          filtered[key] = trafficLights[key];
        }
      });
      data = filtered;
    }
    
    if (status) {
      const filtered = {};
      Object.keys(data).forEach(key => {
        if (data[key].status === status) {
          filtered[key] = data[key];
        }
      });
      data = filtered;
    }
    
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      total: Object.keys(data).length,
      province: province || 'all',
      status: status || 'all',
      data: data,
      timestamp: new Date().toISOString()
    }));
    return;
  }

  // Get provinces
  if (pathname === '/api/provinces' && req.method === 'GET') {
    setCorsHeaders(res);
    const provinces = {};
    Object.keys(trafficLights).forEach(key => {
      const province = trafficLights[key].province;
      if (!provinces[province]) {
        provinces[province] = [];
      }
      provinces[province].push({
        id: key,
        city: trafficLights[key].city,
        status: trafficLights[key].status,
        timer: trafficLights[key].timer
      });
    });
    
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      provinces: provinces,
      timestamp: new Date().toISOString()
    }));
    return;
  }

  // Get specific traffic light
  if (pathname.startsWith('/api/traffic-lights/') && req.method === 'GET') {
    setCorsHeaders(res);
    const location = pathname.split('/')[3];
    if (trafficLights[location]) {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        location: location,
        data: trafficLights[location],
        timestamp: new Date().toISOString()
      }));
    } else {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ 
        error: 'Location not found',
        availableLocations: Object.keys(trafficLights)
      }));
    }
    return;
  }

  // Get cities by status
  if (pathname === '/api/traffic-lights/status' && req.method === 'GET') {
    setCorsHeaders(res);
    const status = url.searchParams.get('status');
    if (status && ['red', 'yellow', 'green'].includes(status)) {
      const filtered = {};
      Object.keys(trafficLights).forEach(key => {
        if (trafficLights[key].status === status) {
          filtered[key] = trafficLights[key];
        }
      });
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        status: status,
        count: Object.keys(filtered).length,
        data: filtered,
        timestamp: new Date().toISOString()
      }));
    } else {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ 
        error: 'Invalid status parameter',
        validStatuses: ['red', 'yellow', 'green']
      }));
    }
    return;
  }

  // Get statistics
  if (pathname === '/api/stats' && req.method === 'GET') {
    setCorsHeaders(res);
    const stats = calculateStats();
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      traffic: stats,
      emergencyOverrides: Object.keys(emergencyOverrides).length,
      iot: {
        cameras: Object.keys(iotData.cameras).length,
        inductiveLoops: Object.keys(iotData.inductiveLoops).length,
        airQuality: Object.keys(iotData.airQuality).length,
        fleet: Object.keys(iotData.fleet).length
      },
      timestamp: new Date().toISOString()
    }));
    return;
  }

  // Update traffic light by location ID
  if (pathname.startsWith('/api/traffic-lights/') && req.method === 'PUT') {
    const location = pathname.split('/')[3];
    let body = '';
    
    req.on('data', chunk => {
      body += chunk.toString();
    });
    
    req.on('end', () => {
      setCorsHeaders(res);
      try {
        const updates = JSON.parse(body);
        if (trafficLights[location]) {
          if (updates.status && ['red', 'yellow', 'green'].includes(updates.status)) {
            trafficLights[location].status = updates.status;
          }
          if (updates.timer && typeof updates.timer === 'number' && updates.timer > 0) {
            trafficLights[location].timer = updates.timer;
          }
          
          broadcastUpdate({
            type: 'manualUpdate',
            location: location,
            data: trafficLights[location],
            timestamp: new Date().toISOString()
          });
          
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ 
            message: 'Traffic light updated successfully',
            location: location,
            data: trafficLights[location],
            timestamp: new Date().toISOString()
          }));
        } else {
          res.writeHead(404, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ 
            error: 'Location not found',
            availableLocations: Object.keys(trafficLights)
          }));
        }
      } catch (error) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ 
          error: 'Invalid JSON payload',
          message: error.message
        }));
      }
    });
    return;
  }

  // Batch update
  if (pathname === '/api/traffic-lights/batch' && req.method === 'POST') {
    let body = '';
    
    req.on('data', chunk => {
      body += chunk.toString();
    });
    
    req.on('end', () => {
      setCorsHeaders(res);
      try {
        const updates = JSON.parse(body);
        const results = {};
        const errors = {};
        
        Object.keys(updates).forEach(location => {
          if (trafficLights[location]) {
            if (updates[location].status && ['red', 'yellow', 'green'].includes(updates[location].status)) {
              trafficLights[location].status = updates[location].status;
            }
            if (updates[location].timer && typeof updates[location].timer === 'number' && updates[location].timer > 0) {
              trafficLights[location].timer = updates[location].timer;
            }
            results[location] = trafficLights[location];
          } else {
            errors[location] = 'Location not found';
          }
        });
        
        broadcastUpdate({
          type: 'batchUpdate',
          updated: results,
          errors: errors,
          timestamp: new Date().toISOString()
        });
        
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          message: 'Batch update completed',
          updated: results,
          errors: errors,
          timestamp: new Date().toISOString()
        }));
      } catch (error) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ 
          error: 'Invalid JSON payload',
          message: error.message
        }));
      }
    });
    return;
  }

  // ==================== 404 ====================
  setCorsHeaders(res);
  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({
    error: 'API endpoint not found',
    availableEndpoints: [
      '/api/health',
      '/api/trafficlight (POST/GET)',
      '/api/trafficlight/bulk (POST)',
      '/api/cities (GET)',
      '/api/iot',
      '/api/iot/cameras',
      '/api/iot/loops',
      '/api/iot/airquality',
      '/api/iot/fleet',
      '/api/emergency/overrides',
      '/api/emergency/green',
      '/api/emergency/red',
      '/api/traffic-lights',
      '/api/traffic-lights/:location',
      '/api/traffic-lights/status?status=red|yellow|green',
      '/api/provinces',
      '/api/stats',
      '/api/traffic-lights/:location (PUT)',
      '/api/traffic-lights/batch (POST)'
    ],
    example: {
      'POST /api/trafficlight': {
        body: { city: 'colombo', status: 'green' }
      },
      'POST /api/trafficlight/bulk': {
        body: {
          updates: [
            { city: 'colombo', status: 'red' },
            { city: 'kandy', status: 'green' }
          ]
        }
      }
    }
  }));
}

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

module.exports = { handleApiRequest };
