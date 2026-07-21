const { trafficLights, iotData, emergencyOverrides, broadcastUpdate, getCityDirections, getDirectionStatus, setDirectionStatus, calculateStats } = require('./trafficSystem');

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
      message: 'Road Lanka IoT Traffic Management System API with Directional Control',
      version: '3.0.0',
      totalCities: Object.keys(trafficLights).length,
      totalDirections: Object.keys(trafficLights).length * 4,
      iotDevices: {
        cameras: Object.keys(iotData.cameras).length,
        inductiveLoops: Object.keys(iotData.inductiveLoops).length,
        airQuality: Object.keys(iotData.airQuality).length,
        fleet: Object.keys(iotData.fleet).length
      },
      directions: ['up', 'down', 'left', 'right'],
      timestamp: new Date().toISOString()
    }));
    return;
  }

  // ==================== DIRECTIONAL TRAFFIC LIGHT CONTROL ====================
  
  // Set traffic light by city and direction
  if (pathname === '/api/trafficlight/direction' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });

    req.on('end', () => {
      setCorsHeaders(res);
      try {
        const data = JSON.parse(body);
        const { city, direction, status, timer } = data;

        if (!city) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({
            error: 'City name is required',
            example: {
              city: 'colombo',
              direction: 'up',
              status: 'green',
              timer: 60
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

        // Validate direction
        const validDirections = ['up', 'down', 'left', 'right'];
        if (!direction || !validDirections.includes(direction.toLowerCase())) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({
            error: 'Invalid direction',
            validDirections: validDirections,
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

        const dir = direction.toLowerCase();
        const newStatus = status.toLowerCase();
        
        // Update traffic light direction
        const success = setDirectionStatus(cityKey, dir, newStatus, timer || undefined);
        
        if (!success) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({
            error: 'Failed to update direction',
            direction: dir,
            city: cityKey
          }));
          return;
        }

        // Remove any emergency override for this location
        if (emergencyOverrides[cityKey]) {
          delete emergencyOverrides[cityKey];
        }

        // Broadcast update via WebSocket
        broadcastUpdate({
          type: 'directionManualUpdate',
          location: cityKey,
          direction: dir,
          data: trafficLights[cityKey].directions[dir],
          city: trafficLights[cityKey].city,
          province: trafficLights[cityKey].province,
          timestamp: new Date().toISOString()
        });

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          success: true,
          message: `Direction ${dir} traffic light for ${trafficLights[cityKey].city} set to ${newStatus}`,
          location: cityKey,
          city: trafficLights[cityKey].city,
          province: trafficLights[cityKey].province,
          direction: dir,
          status: newStatus,
          timer: trafficLights[cityKey].directions[dir].timer,
          timestamp: new Date().toISOString()
        }));

      } catch (error) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          error: 'Invalid request',
          message: error.message,
          example: {
            city: 'colombo',
            direction: 'up',
            status: 'green',
            timer: 60
          }
        }));
      }
    });
    return;
  }

  // Get traffic light status by city name with all directions
  if (pathname === '/api/trafficlight/direction' && req.method === 'GET') {
    setCorsHeaders(res);
    const city = url.searchParams.get('city');
    const direction = url.searchParams.get('direction');
    
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

      // If direction is specified, return only that direction
      if (direction) {
        const dirData = getDirectionStatus(cityKey, direction.toLowerCase());
        if (!dirData) {
          res.writeHead(404, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({
            error: 'Direction not found',
            validDirections: ['up', 'down', 'left', 'right'],
            timestamp: new Date().toISOString()
          }));
          return;
        }
        
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          location: cityKey,
          city: trafficLights[cityKey].city,
          province: trafficLights[cityKey].province,
          direction: direction.toLowerCase(),
          status: dirData.status,
          timer: dirData.timer,
          timestamp: new Date().toISOString()
        }));
        return;
      }

      // Return all directions
      const directions = getCityDirections(cityKey);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        location: cityKey,
        city: trafficLights[cityKey].city,
        province: trafficLights[cityKey].province,
        directions: directions,
        timestamp: new Date().toISOString()
      }));
      return;
    }

    // Get all cities with their directions
    const allLights = {};
    Object.keys(trafficLights).forEach(key => {
      allLights[key] = {
        city: trafficLights[key].city,
        province: trafficLights[key].province,
        directions: trafficLights[key].directions
      };
    });

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      total: Object.keys(allLights).length,
      totalDirections: Object.keys(allLights).length * 4,
      data: allLights,
      directions: ['up', 'down', 'left', 'right'],
      timestamp: new Date().toISOString()
    }));
    return;
  }

  // ==================== BULK DIRECTIONAL CONTROL ====================
  
  // Set multiple directions for a city
  if (pathname === '/api/trafficlight/bulk/direction' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });

    req.on('end', () => {
      setCorsHeaders(res);
      try {
        const data = JSON.parse(body);
        const { city, updates } = data;

        if (!city) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({
            error: 'City name is required',
            example: {
              city: 'colombo',
              updates: {
                up: { status: 'green', timer: 60 },
                down: { status: 'red', timer: 30 }
              }
            }
          }));
          return;
        }

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

        if (!updates || typeof updates !== 'object') {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({
            error: 'Updates object is required',
            example: {
              city: 'colombo',
              updates: {
                up: { status: 'green', timer: 60 },
                down: { status: 'red', timer: 30 }
              }
            }
          }));
          return;
        }

        const results = [];
        const errors = [];
        const validDirections = ['up', 'down', 'left', 'right'];

        Object.keys(updates).forEach(dir => {
          if (!validDirections.includes(dir)) {
            errors.push({
              direction: dir,
              error: 'Invalid direction. Use: up, down, left, right'
            });
            return;
          }

          const update = updates[dir];
          if (!update.status || !['red', 'yellow', 'green'].includes(update.status.toLowerCase())) {
            errors.push({
              direction: dir,
              error: 'Invalid status. Use: red, yellow, or green'
            });
            return;
          }

          const newStatus = update.status.toLowerCase();
          const timer = update.timer || undefined;
          
          const success = setDirectionStatus(cityKey, dir, newStatus, timer);
          
          if (success) {
            results.push({
              direction: dir,
              status: newStatus,
              timer: trafficLights[cityKey].directions[dir].timer
            });
          } else {
            errors.push({
              direction: dir,
              error: 'Failed to update direction'
            });
          }
        });

        if (emergencyOverrides[cityKey]) {
          delete emergencyOverrides[cityKey];
        }

        // Broadcast bulk update
        if (results.length > 0) {
          broadcastUpdate({
            type: 'bulkDirectionUpdate',
            location: cityKey,
            city: trafficLights[cityKey].city,
            province: trafficLights[cityKey].province,
            updates: results,
            timestamp: new Date().toISOString()
          });
        }

        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          success: true,
          totalProcessed: results.length,
          totalErrors: errors.length,
          city: trafficLights[cityKey].city,
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
            city: 'colombo',
            updates: {
              up: { status: 'green', timer: 60 },
              down: { status: 'red', timer: 30 }
            }
          }
        }));
      }
    });
    return;
  }

  // ==================== TRAFFIC LIGHT CONTROL (Legacy - Single status for backward compatibility) ====================
  
  // Set traffic light by city name (Sets all directions to same status)
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

        if (!status || !['red', 'yellow', 'green'].includes(status.toLowerCase())) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({
            error: 'Invalid status',
            validStatuses: ['red', 'yellow', 'green'],
            timestamp: new Date().toISOString()
          }));
          return;
        }

        const newStatus = status.toLowerCase();
        const directions = ['up', 'down', 'left', 'right'];
        
        directions.forEach(dir => {
          setDirectionStatus(cityKey, dir, newStatus);
        });

        if (emergencyOverrides[cityKey]) {
          delete emergencyOverrides[cityKey];
        }

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
          message: `All directions for ${trafficLights[cityKey].city} set to ${newStatus}`,
          location: cityKey,
          city: trafficLights[cityKey].city,
          province: trafficLights[cityKey].province,
          status: newStatus,
          directions: trafficLights[cityKey].directions,
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

  // Get traffic light status by city name (Legacy - returns all directions)
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
        directions: trafficLights[cityKey].directions,
        timestamp: new Date().toISOString()
      }));
      return;
    }

    const allLights = {};
    Object.keys(trafficLights).forEach(key => {
      allLights[key] = {
        city: trafficLights[key].city,
        province: trafficLights[key].province,
        directions: trafficLights[key].directions
      };
    });

    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      total: Object.keys(allLights).length,
      totalDirections: Object.keys(allLights).length * 4,
      data: allLights,
      directions: ['up', 'down', 'left', 'right'],
      timestamp: new Date().toISOString()
    }));
    return;
  }

  // ==================== GET CITY LIST ====================
  
  if (pathname === '/api/cities' && req.method === 'GET') {
    setCorsHeaders(res);
    const cities = Object.keys(trafficLights).map(key => ({
      id: key,
      city: trafficLights[key].city,
      province: trafficLights[key].province,
      directions: trafficLights[key].directions
    }));

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
      totalDirections: cities.length * 4,
      cities: cities,
      grouped: grouped,
      directions: ['up', 'down', 'left', 'right'],
      timestamp: new Date().toISOString()
    }));
    return;
  }

  // ==================== IOT ENDPOINTS ====================

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

  // Emergency override - Set all directions to green
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

        const directions = ['up', 'down', 'left', 'right'];
        directions.forEach(dir => {
          setDirectionStatus(location, dir, 'green', 60);
        });

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
          message: `Emergency override (all green) set for ${trafficLights[location].city}`,
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

  // Emergency override - Set all directions to red
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

        const directions = ['up', 'down', 'left', 'right'];
        directions.forEach(dir => {
          setDirectionStatus(location, dir, 'red', 60);
        });

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
          message: `Emergency stop (all red) set for ${trafficLights[location].city}`,
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

  // Get all traffic lights with directions
  if (pathname === '/api/traffic-lights' && req.method === 'GET') {
    setCorsHeaders(res);
    const province = url.searchParams.get('province');
    const status = url.searchParams.get('status');
    const direction = url.searchParams.get('direction');
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
    
    if (status && direction) {
      const filtered = {};
      Object.keys(data).forEach(key => {
        const dirData = data[key].directions[direction.toLowerCase()];
        if (dirData && dirData.status === status) {
          filtered[key] = data[key];
        }
      });
      data = filtered;
    } else if (status) {
      const filtered = {};
      Object.keys(data).forEach(key => {
        const directions = ['up', 'down', 'left', 'right'];
        let hasStatus = false;
        directions.forEach(dir => {
          if (data[key].directions[dir] && data[key].directions[dir].status === status) {
            hasStatus = true;
          }
        });
        if (hasStatus) {
          filtered[key] = data[key];
        }
      });
      data = filtered;
    }
    
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      total: Object.keys(data).length,
      totalDirections: Object.keys(data).length * 4,
      province: province || 'all',
      status: status || 'all',
      direction: direction || 'all',
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
        directions: trafficLights[key].directions
      });
    });
    
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      provinces: provinces,
      timestamp: new Date().toISOString()
    }));
    return;
  }

  // Get specific traffic light with directions
  if (pathname.startsWith('/api/traffic-lights/') && req.method === 'GET') {
    setCorsHeaders(res);
    const location = pathname.split('/')[3];
    if (trafficLights[location]) {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        location: location,
        data: trafficLights[location],
        directions: ['up', 'down', 'left', 'right'],
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

  // Get cities by status for a specific direction
  if (pathname === '/api/traffic-lights/status' && req.method === 'GET') {
    setCorsHeaders(res);
    const status = url.searchParams.get('status');
    const direction = url.searchParams.get('direction') || 'up';
    
    if (status && ['red', 'yellow', 'green'].includes(status)) {
      const filtered = {};
      Object.keys(trafficLights).forEach(key => {
        const dirData = trafficLights[key].directions[direction.toLowerCase()];
        if (dirData && dirData.status === status) {
          filtered[key] = {
            city: trafficLights[key].city,
            province: trafficLights[key].province,
            direction: direction.toLowerCase(),
            status: dirData.status,
            timer: dirData.timer
          };
        }
      });
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        status: status,
        direction: direction.toLowerCase(),
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

  // Update specific direction of a traffic light
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
          const { direction, status, timer } = updates;
          
          if (direction && ['up', 'down', 'left', 'right'].includes(direction)) {
            if (status && ['red', 'yellow', 'green'].includes(status)) {
              setDirectionStatus(location, direction, status, timer || undefined);
            }
            if (timer && typeof timer === 'number' && timer > 0) {
              trafficLights[location].directions[direction].timer = timer;
            }
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
            const locationUpdates = updates[location];
            if (locationUpdates.direction && locationUpdates.status) {
              setDirectionStatus(location, locationUpdates.direction, locationUpdates.status, locationUpdates.timer || undefined);
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

  // Emergency stop - Clear all emergency overrides
  if (pathname === '/api/emergency/stop' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => {
      body += chunk.toString();
    });

    req.on('end', () => {
      setCorsHeaders(res);
      try {
        const data = JSON.parse(body);
        const { location } = data;

        if (location) {
          if (!trafficLights[location]) {
            res.writeHead(404, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({ 
              error: 'Location not found',
              availableLocations: Object.keys(trafficLights)
            }));
            return;
          }

          if (emergencyOverrides[location]) {
            delete emergencyOverrides[location];
            const directions = ['up', 'down', 'left', 'right'];
            directions.forEach(dir => {
              setDirectionStatus(location, dir, 'green', 60);
            });

            broadcastUpdate({
              type: 'emergencyStopped',
              location: location,
              data: trafficLights[location],
              timestamp: new Date().toISOString()
            });

            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({
              success: true,
              message: `Emergency override cleared for ${trafficLights[location].city}`,
              location: location,
              city: trafficLights[location].city,
              timestamp: new Date().toISOString()
            }));
          } else {
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify({
              success: true,
              message: `No active emergency override for ${trafficLights[location].city}`,
              location: location,
              timestamp: new Date().toISOString()
            }));
          }
        } else {
          const clearedLocations = [];
          Object.keys(emergencyOverrides).forEach(key => {
            if (trafficLights[key]) {
              const directions = ['up', 'down', 'left', 'right'];
              directions.forEach(dir => {
                setDirectionStatus(key, dir, 'green', 60);
              });
              clearedLocations.push({
                location: key,
                city: trafficLights[key].city
              });
            }
          });
          
          Object.keys(emergencyOverrides).forEach(key => {
            delete emergencyOverrides[key];
          });

          if (clearedLocations.length > 0) {
            broadcastUpdate({
              type: 'emergencyStopped',
              locations: clearedLocations,
              timestamp: new Date().toISOString()
            });
          }

          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({
            success: true,
            message: `Cleared ${clearedLocations.length} emergency overrides`,
            cleared: clearedLocations,
            timestamp: new Date().toISOString()
          }));
        }
      } catch (error) {
        console.error('Emergency stop error:', error);
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ 
          error: 'Invalid request',
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
      '/api/trafficlight (POST/GET) - Set all directions',
      '/api/trafficlight/direction (POST/GET) - Set specific direction',
      '/api/trafficlight/bulk (POST) - Bulk update all directions',
      '/api/trafficlight/bulk/direction (POST) - Bulk update specific directions',
      '/api/cities (GET)',
      '/api/iot',
      '/api/iot/cameras',
      '/api/iot/loops',
      '/api/iot/airquality',
      '/api/iot/fleet',
      '/api/emergency/overrides',
      '/api/emergency/green',
      '/api/emergency/red',
      '/api/emergency/stop (POST)',
      '/api/traffic-lights',
      '/api/traffic-lights/:location',
      '/api/traffic-lights/status?status=red|yellow|green&direction=up|down|left|right',
      '/api/provinces',
      '/api/stats',
      '/api/traffic-lights/:location (PUT)',
      '/api/traffic-lights/batch (POST)'
    ],
    directions: ['up', 'down', 'left', 'right'],
    example: {
      'POST /api/trafficlight/direction': {
        body: { city: 'colombo', direction: 'up', status: 'green', timer: 60 }
      },
      'POST /api/trafficlight/bulk/direction': {
        body: { city: 'colombo', updates: { up: { status: 'green', timer: 60 }, down: { status: 'red', timer: 30 } } }
      },
      'POST /api/emergency/stop': {
        body: { location: 'colombo' }
      }
    }
  }));
}

module.exports = { handleApiRequest };
