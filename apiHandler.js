const { 
  trafficLights, 
  iotData, 
  emergencyOverrides, 
  broadcastUpdate, 
  getCityDirections, 
  getDirectionStatus, 
  setDirectionStatus,
  resetCityToOriginalState,
  calculateStats 
} = require('./trafficSystem');

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
      directions: ['up', 'down', 'left', 'right'],
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

  // ============================================
  // GET ALL TRAFFIC LIGHTS WITH DIRECTIONS
  // ============================================
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

  // ============================================
  // GET SPECIFIC TRAFFIC LIGHT
  // ============================================
  if (pathname.startsWith('/api/traffic-lights/') && req.method === 'GET') {
    setCorsHeaders(res);
    const location = pathname.split('/')[3];
    if (trafficLights[location]) {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        location: location,
        data: trafficLights[location],
        directions: ['up', 'down', 'left', 'right'],
        isEmergency: !!emergencyOverrides[location],
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

  // ============================================
  // GET SPECIFIC DIRECTION STATUS
  // ============================================
  if (pathname === '/api/trafficlight/direction' && req.method === 'GET') {
    setCorsHeaders(res);
    const city = url.searchParams.get('city');
    const direction = url.searchParams.get('direction');
    
    if (!city) {
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        error: 'City parameter is required',
        example: { city: 'colombo', direction: 'up' }
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
        availableCities: Object.values(trafficLights).map(t => t.city)
      }));
      return;
    }
    
    if (direction) {
      const dirData = getDirectionStatus(cityKey, direction.toLowerCase());
      if (!dirData) {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          error: 'Direction not found',
          validDirections: ['up', 'down', 'left', 'right']
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
        isEmergency: !!emergencyOverrides[cityKey],
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
      isEmergency: !!emergencyOverrides[cityKey],
      timestamp: new Date().toISOString()
    }));
    return;
  }

  // ============================================
  // SET SPECIFIC DIRECTION STATUS
  // ============================================
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

        const cityKey = Object.keys(trafficLights).find(
          key => trafficLights[key].city.toLowerCase() === city.toLowerCase()
        );

        if (!cityKey) {
          res.writeHead(404, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({
            error: 'City not found',
            availableCities: Object.values(trafficLights).map(t => t.city)
          }));
          return;
        }

        const validDirections = ['up', 'down', 'left', 'right'];
        if (!direction || !validDirections.includes(direction.toLowerCase())) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({
            error: 'Invalid direction',
            validDirections: validDirections
          }));
          return;
        }

        if (!status || !['red', 'yellow', 'green'].includes(status.toLowerCase())) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({
            error: 'Invalid status',
            validStatuses: ['red', 'yellow', 'green']
          }));
          return;
        }

        const dir = direction.toLowerCase();
        const newStatus = status.toLowerCase();
        
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

        // Remove emergency override if exists
        if (emergencyOverrides[cityKey]) {
          delete emergencyOverrides[cityKey];
        }

        // Broadcast update
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
          message: `Direction ${dir} for ${trafficLights[cityKey].city} set to ${newStatus}`,
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

  // ============================================
  // BULK DIRECTION UPDATE
  // ============================================
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
            availableCities: Object.values(trafficLights).map(t => t.city)
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

  // ============================================
  // EMERGENCY OVERRIDE - SET ALL GREEN
  // ============================================
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
          expires: emergencyOverrides[location].expires,
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

  // ============================================
  // EMERGENCY OVERRIDE - SET ALL RED
  // ============================================
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
          expires: emergencyOverrides[location].expires,
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

  // ============================================
  // EMERGENCY STOP - CLEAR OVERRIDES
  // ============================================
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
            // Reset to original state
            resetCityToOriginalState(location);

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
          // Clear ALL emergency overrides
          const clearedLocations = [];
          Object.keys(emergencyOverrides).forEach(key => {
            if (trafficLights[key]) {
              resetCityToOriginalState(key);
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

  // ============================================
  // GET EMERGENCY OVERRIDES
  // ============================================
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

  // ============================================
  // GET STATISTICS
  // ============================================
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

  // ============================================
  // GET ALL CITIES
  // ============================================
  if (pathname === '/api/cities' && req.method === 'GET') {
    setCorsHeaders(res);
    const cities = Object.keys(trafficLights).map(key => ({
      id: key,
      city: trafficLights[key].city,
      province: trafficLights[key].province,
      directions: trafficLights[key].directions,
      isEmergency: !!emergencyOverrides[key]
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

  // ============================================
  // GET PROVINCES
  // ============================================
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
        directions: trafficLights[key].directions,
        isEmergency: !!emergencyOverrides[key]
      });
    });
    
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      provinces: provinces,
      timestamp: new Date().toISOString()
    }));
    return;
  }

  // ============================================
  // IOT ENDPOINTS
  // ============================================
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

  // ============================================
  // LEGACY TRAFFIC LIGHT CONTROL (All Directions)
  // ============================================
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
            example: { city: 'colombo', status: 'green' }
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
            availableCities: Object.values(trafficLights).map(t => t.city)
          }));
          return;
        }

        if (!status || !['red', 'yellow', 'green'].includes(status.toLowerCase())) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({
            error: 'Invalid status',
            validStatuses: ['red', 'yellow', 'green']
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
          example: { city: 'colombo', status: 'green' }
        }));
      }
    });
    return;
  }

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
          availableCities: Object.values(trafficLights).map(t => t.city)
        }));
        return;
      }

      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({
        location: cityKey,
        city: trafficLights[cityKey].city,
        province: trafficLights[cityKey].province,
        directions: trafficLights[cityKey].directions,
        isEmergency: !!emergencyOverrides[cityKey],
        timestamp: new Date().toISOString()
      }));
      return;
    }

    const allLights = {};
    Object.keys(trafficLights).forEach(key => {
      allLights[key] = {
        city: trafficLights[key].city,
        province: trafficLights[key].province,
        directions: trafficLights[key].directions,
        isEmergency: !!emergencyOverrides[key]
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

  // ============================================
  // 404 - Not Found
  // ============================================
  setCorsHeaders(res);
  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({
    error: 'API endpoint not found',
    availableEndpoints: [
      '/api/health',
      '/api/traffic-lights',
      '/api/traffic-lights/:location',
      '/api/trafficlight (GET/POST) - Legacy',
      '/api/trafficlight/direction (GET/POST) - Directional',
      '/api/trafficlight/bulk/direction (POST) - Bulk directional',
      '/api/cities',
      '/api/provinces',
      '/api/stats',
      '/api/iot',
      '/api/iot/cameras',
      '/api/iot/loops',
      '/api/iot/airquality',
      '/api/iot/fleet',
      '/api/emergency/overrides',
      '/api/emergency/green (POST)',
      '/api/emergency/red (POST)',
      '/api/emergency/stop (POST)'
    ],
    directions: ['up', 'down', 'left', 'right'],
    timestamp: new Date().toISOString()
  }));
}

module.exports = { handleApiRequest };
