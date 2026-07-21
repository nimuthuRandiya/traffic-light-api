/**
 * Traffic Light Time Balancing System
 * Ensures fair distribution of green time across all 4 directions
 * Prevents any single direction from dominating
 * Uses dynamic timing based on traffic density and fairness metrics
 */

const { trafficLights, setDirectionStatus, getDirectionStatus, iotData, broadcastUpdate } = require('./trafficSystem');

// ============================================
// BALANCE CONFIGURATION
// ============================================
const BALANCE_CONFIG = {
  // Minimum and maximum green times (seconds)
  MIN_GREEN_TIME: 15,
  MAX_GREEN_TIME: 120,
  
  // Default green time when no traffic data
  DEFAULT_GREEN_TIME: 45,
  
  // Yellow light duration (seconds)
  YELLOW_DURATION: 5,
  
  // Balance check interval (seconds)
  CHECK_INTERVAL: 5,
  
  // Traffic thresholds for dynamic adjustment
  TRAFFIC_THRESHOLDS: {
    VERY_LOW: 10,
    LOW: 25,
    MEDIUM: 50,
    HIGH: 80,
    VERY_HIGH: 120
  },
  
  // Fairness tolerance (0-1)
  FAIRNESS_TOLERANCE: 0.85,
  
  // Maximum wait time before forced green (seconds)
  MAX_WAIT_TIME: 180
};

// ============================================
// STATE MANAGEMENT
// ============================================
class TimeBalanceManager {
  constructor() {
    this.balanceState = {};
    this.trafficHistory = {};
    this.adjustmentLog = [];
    this.isBalancing = false;
    this.balanceInterval = null;
    this.emergencyMode = false;
    this.lastUpdateTime = Date.now();
    this.globalMetrics = {
      totalFairness: 0,
      avgFairness: 0,
      locationsWithImbalance: 0
    };
    
    // Initialize state for all cities
    this.initializeBalanceState();
  }

  initializeBalanceState() {
    Object.keys(trafficLights).forEach(location => {
      this.balanceState[location] = {
        // Track green time per direction
        greenTimeUsed: { up: 0, down: 0, left: 0, right: 0 },
        // Track number of green cycles
        greenCycles: { up: 0, down: 0, left: 0, right: 0 },
        // Track wait time per direction
        waitTime: { up: 0, down: 0, left: 0, right: 0 },
        // Current balance weight
        balanceWeights: { up: 1, down: 1, left: 1, right: 1 },
        // Last adjustment timestamp
        lastAdjustment: Date.now(),
        // Current phase and time tracking
        currentPhase: trafficLights[location].phase || 'vertical-green',
        phaseTime: 0,
        activeDirection: null,
        // Balance metrics
        balanceMetrics: {
          fairness: 1,
          totalWeight: 4,
          averageWaitTime: 0,
          maxWaitTime: 0
        },
        // Traffic density cache
        trafficDensity: { up: 0, down: 0, left: 0, right: 0 },
        // Emergency override flag
        isEmergencyOverride: false
      };
    });
  }

  // ============================================
  // CORE BALANCE ALGORITHM
  // ============================================

  /**
   * Calculate green time based on traffic density and fairness
   */
  calculateGreenTime(location, direction, trafficDensity = 0) {
    const state = this.balanceState[location];
    if (!state) return BALANCE_CONFIG.DEFAULT_GREEN_TIME;

    // If emergency mode, give max time to emergency direction
    if (this.emergencyMode || state.isEmergencyOverride) {
      return BALANCE_CONFIG.MAX_GREEN_TIME;
    }

    // Get traffic density for this direction
    const density = trafficDensity || this.getTrafficDensity(location, direction);
    state.trafficDensity[direction] = density;

    // Base time from configuration
    let baseTime = BALANCE_CONFIG.DEFAULT_GREEN_TIME;

    // Adjust based on traffic density
    if (density > 0) {
      let trafficMultiplier = 1;
      if (density < BALANCE_CONFIG.TRAFFIC_THRESHOLDS.LOW) {
        trafficMultiplier = 0.6;
      } else if (density < BALANCE_CONFIG.TRAFFIC_THRESHOLDS.MEDIUM) {
        trafficMultiplier = 0.8 + (density - BALANCE_CONFIG.TRAFFIC_THRESHOLDS.LOW) / 
          (BALANCE_CONFIG.TRAFFIC_THRESHOLDS.MEDIUM - BALANCE_CONFIG.TRAFFIC_THRESHOLDS.LOW) * 0.4;
      } else if (density < BALANCE_CONFIG.TRAFFIC_THRESHOLDS.HIGH) {
        trafficMultiplier = 1.2 + (density - BALANCE_CONFIG.TRAFFIC_THRESHOLDS.MEDIUM) / 
          (BALANCE_CONFIG.TRAFFIC_THRESHOLDS.HIGH - BALANCE_CONFIG.TRAFFIC_THRESHOLDS.MEDIUM) * 0.8;
      } else {
        trafficMultiplier = 2.0;
      }
      baseTime = Math.min(BALANCE_CONFIG.MAX_GREEN_TIME, baseTime * trafficMultiplier);
    }

    // Apply balance weight (directions with lower weight get more time)
    const weight = state.balanceWeights[direction] || 1;
    let adjustedTime = baseTime * (1 / Math.max(0.3, weight));

    // Apply fairness multiplier
    const fairnessMultiplier = this.calculateFairnessMultiplier(location, direction);
    let finalTime = Math.round(adjustedTime * fairnessMultiplier);

    // Apply wait time priority
    const waitTime = state.waitTime[direction] || 0;
    if (waitTime > BALANCE_CONFIG.MAX_WAIT_TIME) {
      finalTime = Math.min(BALANCE_CONFIG.MAX_GREEN_TIME, finalTime * 1.5);
    }

    // Clamp to min/max
    finalTime = Math.max(
      BALANCE_CONFIG.MIN_GREEN_TIME,
      Math.min(BALANCE_CONFIG.MAX_GREEN_TIME, finalTime)
    );

    return finalTime;
  }

  /**
   * Calculate fairness multiplier for a direction
   * Higher values for directions that have been waiting longer
   */
  calculateFairnessMultiplier(location, direction) {
    const state = this.balanceState[location];
    if (!state) return 1;

    const totalGreenTime = Object.values(state.greenTimeUsed).reduce((a, b) => a + b, 0);
    if (totalGreenTime === 0) return 1;

    const avgTime = totalGreenTime / 4;
    const thisTime = state.greenTimeUsed[direction] || 0;

    // If this direction has had less than average time, give it priority
    const ratio = thisTime / Math.max(1, avgTime);
    
    if (ratio < 0.3) return 2.5;
    if (ratio < 0.5) return 2.0;
    if (ratio < 0.7) return 1.5;
    if (ratio < 0.9) return 1.2;
    if (ratio > 1.8) return 0.6;
    if (ratio > 1.5) return 0.7;
    if (ratio > 1.2) return 0.85;

    return 1.0;
  }

  /**
   * Update balance weights based on recent usage
   */
  updateBalanceWeights(location) {
    const state = this.balanceState[location];
    if (!state) return;

    const directions = ['up', 'down', 'left', 'right'];
    const totalCycles = directions.reduce((sum, dir) => sum + (state.greenCycles[dir] || 0), 0);
    
    if (totalCycles === 0) {
      // Reset weights if no cycles
      directions.forEach(dir => {
        state.balanceWeights[dir] = 1;
      });
      return;
    }

    // Calculate desired weights (inverse proportion to cycles)
    let totalWeight = 0;
    directions.forEach(dir => {
      const cycles = state.greenCycles[dir] || 1;
      const proportion = cycles / totalCycles;
      
      // Directions with fewer cycles get higher weight
      // Weight range: 0.5 to 2.5
      let weight = 1 / (proportion * 4);
      weight = Math.max(0.5, Math.min(2.5, weight));
      
      // Adjust based on wait time
      const waitTime = state.waitTime[dir] || 0;
      if (waitTime > BALANCE_CONFIG.MAX_WAIT_TIME * 0.7) {
        weight *= 1.3;
      }
      
      state.balanceWeights[dir] = weight;
      totalWeight += weight;
    });

    // Normalize weights
    directions.forEach(dir => {
      state.balanceWeights[dir] = (state.balanceWeights[dir] / totalWeight) * 4;
    });

    // Update balance metrics
    this.updateBalanceMetrics(location);
  }

  /**
   * Update balance metrics for a location
   */
  updateBalanceMetrics(location) {
    const state = this.balanceState[location];
    if (!state) return;

    const directions = ['up', 'down', 'left', 'right'];
    const times = directions.map(dir => state.greenTimeUsed[dir] || 0);
    const avgTime = times.reduce((a, b) => a + b, 0) / Math.max(1, times.length);
    
    // Calculate fairness (1 = perfectly fair, <1 = unfair)
    const maxDeviation = Math.max(...times.map(t => Math.abs(t - avgTime)));
    const fairness = Math.max(0.1, 1 - (maxDeviation / (Math.max(1, avgTime) * 2)));
    state.balanceMetrics.fairness = Math.min(1, fairness);
    
    // Calculate total weight
    state.balanceMetrics.totalWeight = Object.values(state.balanceWeights).reduce((a, b) => a + b, 0);
    
    // Calculate average wait time
    const totalGreenTime = times.reduce((a, b) => a + b, 0);
    state.balanceMetrics.averageWaitTime = totalGreenTime > 0 ? 
      (totalGreenTime / directions.length) : 0;
    
    // Calculate max wait time
    state.balanceMetrics.maxWaitTime = Math.max(...state.waitTime);
  }

  // ============================================
  // TRAFFIC DENSITY CALCULATION
  // ============================================

  /**
   * Get traffic density for a direction
   */
  getTrafficDensity(location, direction) {
    try {
      // Get from IoT inductive loops
      const loops = iotData.inductiveLoops;
      
      // Find matching loop data
      const loopKeys = Object.keys(loops);
      for (const key of loopKeys) {
        if (key.includes(location) || location.includes(key)) {
          const loop = loops[key];
          const vehicleCount = loop.vehicleCount || 0;
          
          // Map vehicle count to density
          if (vehicleCount < 20) return 10;
          if (vehicleCount < 40) return 25;
          if (vehicleCount < 70) return 50;
          if (vehicleCount < 100) return 80;
          return 120;
        }
      }
      
      // Try camera data
      const cameras = iotData.cameras;
      for (const key of Object.keys(cameras)) {
        if (key.includes(location) || location.includes(key)) {
          const camera = cameras[key];
          const vehicles = camera.vehiclesDetected || 0;
          
          if (vehicles < 15) return 10;
          if (vehicles < 30) return 25;
          if (vehicles < 50) return 50;
          if (vehicles < 70) return 80;
          return 120;
        }
      }
    } catch (e) {
      // If no IoT data, use time-based estimation
    }
    
    // Time-based estimation
    const hour = new Date().getHours();
    const day = new Date().getDay();
    
    // Weekend vs weekday
    const isWeekend = (day === 0 || day === 6);
    
    if (isWeekend) {
      // Weekend traffic pattern
      if (hour >= 10 && hour <= 20) return 60;
      if (hour >= 8 && hour <= 22) return 40;
      return 20;
    }
    
    // Weekday traffic pattern
    if (hour >= 7 && hour <= 9) return 80;   // Morning rush
    if (hour >= 16 && hour <= 18) return 90; // Evening rush
    if (hour >= 12 && hour <= 14) return 60; // Lunch
    if (hour >= 22 || hour <= 5) return 15;  // Night
    return 40; // Normal
  }

  // ============================================
  // PRIORITY CALCULATION
  // ============================================

  /**
   * Calculate priority for a direction
   */
  calculatePriority(location, direction) {
    const state = this.balanceState[location];
    if (!state) return 1;

    // Factors for priority calculation
    const factors = {
      // 1. Time since last green (higher = higher priority)
      timeSinceGreen: this.getTimeSinceGreen(location, direction),
      
      // 2. Balance weight (higher = higher priority)
      balanceWeight: state.balanceWeights[direction] || 1,
      
      // 3. Traffic density (higher = higher priority)
      trafficDensity: state.trafficDensity[direction] || 0,
      
      // 4. Fairness factor
      fairness: 1 / ((state.greenTimeUsed[direction] || 1) + 1),
      
      // 5. Wait time factor
      waitTime: (state.waitTime[direction] || 0) / 10
    };

    // Calculate weighted priority
    const priority = (
      factors.timeSinceGreen * 1.0 +
      factors.balanceWeight * 1.5 +
      (factors.trafficDensity / 100) * 0.5 +
      factors.fairness * 0.3 +
      factors.waitTime * 0.2
    );

    return priority;
  }

  /**
   * Get time since direction was last green
   */
  getTimeSinceGreen(location, direction) {
    const state = this.balanceState[location];
    if (!state) return 0;

    // Check if this direction is currently green
    const light = trafficLights[location];
    if (light && light.directions[direction].status === 'green') {
      return 0;
    }

    // Estimate from cycle count
    const cycles = state.greenCycles[direction] || 0;
    const totalCycles = Object.values(state.greenCycles).reduce((a, b) => a + b, 0);
    
    if (totalCycles === 0) return 0;
    
    // Average time per cycle
    const avgCycleTime = 50; // seconds
    const cycleDifference = (totalCycles / 4) - cycles;
    
    return Math.max(0, cycleDifference * avgCycleTime);
  }

  // ============================================
  // PHASE MANAGEMENT WITH BALANCE
  // ============================================

  /**
   * Determine next phase with balance considerations
   */
  getNextPhase(location, currentPhase) {
    const state = this.balanceState[location];
    if (!state) return 'vertical-green';

    // If emergency mode, maintain current phase
    if (this.emergencyMode || state.isEmergencyOverride) {
      return currentPhase;
    }

    // Update balance weights
    this.updateBalanceWeights(location);

    // Determine which directions need priority
    const directions = ['up', 'down', 'left', 'right'];
    const priorities = directions.map(dir => ({
      direction: dir,
      priority: this.calculatePriority(location, dir)
    }));

    // Sort by priority (highest first)
    priorities.sort((a, b) => b.priority - a.priority);

    // Get the direction with highest priority
    const highestPriority = priorities[0];

    // Determine if we need to switch to vertical or horizontal
    const isVertical = (highestPriority.direction === 'up' || highestPriority.direction === 'down');
    
    // Check if current phase is already in the right orientation
    const currentIsVertical = currentPhase.startsWith('vertical');
    
    // If we're already in the right orientation, stay
    if (isVertical && currentIsVertical) {
      return 'vertical-green';
    } else if (!isVertical && !currentIsVertical) {
      return 'horizontal-green';
    }

    // Otherwise switch
    return isVertical ? 'vertical-green' : 'horizontal-green';
  }

  /**
   * Get which directions are green for a phase
   */
  getGreenDirections(phase) {
    if (phase === 'vertical-green' || phase === 'vertical-yellow') {
      return ['up', 'down'];
    } else if (phase === 'horizontal-green' || phase === 'horizontal-yellow') {
      return ['left', 'right'];
    }
    return [];
  }

  /**
   * Check if a phase is green (not yellow)
   */
  isGreenPhase(phase) {
    return phase === 'vertical-green' || phase === 'horizontal-green';
  }

  /**
   * Check if a phase is yellow
   */
  isYellowPhase(phase) {
    return phase === 'vertical-yellow' || phase === 'horizontal-yellow';
  }

  // ============================================
  // BALANCE CYCLE - MAIN UPDATE FUNCTION
  // ============================================

  /**
   * Run a balance cycle for all cities
   * This is the main function that should be called every second
   */
  runBalanceCycle() {
    if (this.isBalancing) return;
    this.isBalancing = true;

    try {
      const locations = Object.keys(trafficLights);
      const changes = [];
      const now = Date.now();
      
      locations.forEach(location => {
        const light = trafficLights[location];
        const state = this.balanceState[location];
        
        if (!light || !state) return;

        // Skip if emergency override is active
        const emergencyOverrides = require('./trafficSystem').emergencyOverrides;
        if (emergencyOverrides[location]) {
          state.isEmergencyOverride = true;
          return;
        } else {
          state.isEmergencyOverride = false;
        }

        // Update phase time
        state.phaseTime += 1;

        // Get current phase
        const currentPhase = light.phase;
        const isGreen = this.isGreenPhase(currentPhase);
        const isYellow = this.isYellowPhase(currentPhase);

        // Update wait times for all directions
        const directions = ['up', 'down', 'left', 'right'];
        const greenDirs = this.getGreenDirections(currentPhase);
        
        directions.forEach(dir => {
          if (greenDirs.includes(dir) && isGreen) {
            // Reset wait time for green directions
            state.waitTime[dir] = 0;
          } else {
            // Increment wait time for non-green directions
            state.waitTime[dir] = (state.waitTime[dir] || 0) + 1;
          }
        });

        // If we're in green phase, check if time is up
        if (isGreen) {
          const greenDirs = this.getGreenDirections(currentPhase);
          const sampleDir = greenDirs[0] || 'up';
          const greenTime = this.calculateGreenTime(
            location,
            sampleDir,
            this.getTrafficDensity(location, sampleDir)
          );
          
          // Check if phase time exceeds green time
          if (state.phaseTime >= greenTime) {
            // Determine next phase with balance
            const nextPhase = this.getNextPhase(location, currentPhase);
            
            // Switch to yellow
            const yellowPhase = currentPhase === 'vertical-green' ? 'vertical-yellow' : 'horizontal-yellow';
            light.phase = yellowPhase;
            light.phaseTimer = BALANCE_CONFIG.YELLOW_DURATION;
            state.phaseTime = 0;
            
            // Update direction timers for yellow
            const dirs = ['up', 'down', 'left', 'right'];
            dirs.forEach(dir => {
              if (light.directions[dir]) {
                if (greenDirs.includes(dir)) {
                  light.directions[dir].status = 'yellow';
                  light.directions[dir].timer = BALANCE_CONFIG.YELLOW_DURATION;
                }
              }
            });
            
            // Log adjustment
            this.logAdjustment(location, {
              from: currentPhase,
              to: yellowPhase,
              greenTime: greenTime,
              reason: 'time_expired',
              direction: sampleDir
            });
            
            changes.push({
              location: location,
              phase: yellowPhase,
              city: light.city,
              province: light.province,
              type: 'yellow'
            });
          }
        }
        // If we're in yellow phase, check if timer is done
        else if (isYellow) {
          if (light.phaseTimer <= 0) {
            // Determine next green phase
            const nextPhase = this.getNextPhase(location, currentPhase);
            
            // Calculate green time
            const greenDirs = this.getGreenDirections(nextPhase);
            const sampleDir = greenDirs[0] || 'up';
            const greenTime = this.calculateGreenTime(
              location,
              sampleDir,
              this.getTrafficDensity(location, sampleDir)
            );
            
            // Switch to green
            light.phase = nextPhase;
            light.phaseTimer = greenTime;
            state.phaseTime = 0;
            
            // Update direction statuses for green
            const dirs = ['up', 'down', 'left', 'right'];
            let activeCount = 0;
            
            dirs.forEach(dir => {
              if (light.directions[dir]) {
                if (greenDirs.includes(dir)) {
                  light.directions[dir].status = 'green';
                  light.directions[dir].timer = greenTime;
                  // Update green time tracking
                  state.greenTimeUsed[dir] = (state.greenTimeUsed[dir] || 0) + greenTime;
                  state.greenCycles[dir] = (state.greenCycles[dir] || 0) + 1;
                  state.activeDirection = dir;
                  activeCount++;
                } else {
                  light.directions[dir].status = 'red';
                  light.directions[dir].timer = greenTime;
                }
              }
            });
            
            // Update active direction
            state.activeDirection = greenDirs[0] || null;
            
            // Log adjustment
            this.logAdjustment(location, {
              from: currentPhase,
              to: nextPhase,
              greenTime: greenTime,
              reason: 'yellow_complete',
              direction: sampleDir
            });
            
            // Update balance weights
            this.updateBalanceWeights(location);
            
            changes.push({
              location: location,
              phase: nextPhase,
              city: light.city,
              province: light.province,
              type: 'green',
              greenTime: greenTime,
              greenDirections: greenDirs,
              activeCount: activeCount
            });
          }
        } else {
          // Fallback - ensure we're in a valid phase
          const fallbackPhase = 'vertical-green';
          light.phase = fallbackPhase;
          light.phaseTimer = BALANCE_CONFIG.DEFAULT_GREEN_TIME;
          state.phaseTime = 0;
          
          const dirs = ['up', 'down', 'left', 'right'];
          const greenDirs = ['up', 'down'];
          dirs.forEach(dir => {
            if (light.directions[dir]) {
              if (greenDirs.includes(dir)) {
                light.directions[dir].status = 'green';
                light.directions[dir].timer = BALANCE_CONFIG.DEFAULT_GREEN_TIME;
              } else {
                light.directions[dir].status = 'red';
                light.directions[dir].timer = BALANCE_CONFIG.DEFAULT_GREEN_TIME;
              }
            }
          });
          
          this.logAdjustment(location, {
            from: currentPhase,
            to: fallbackPhase,
            reason: 'fallback_reset'
          });
          
          changes.push({
            location: location,
            phase: fallbackPhase,
            city: light.city,
            province: light.province,
            type: 'fallback'
          });
        }
      });

      // Broadcast changes
      if (changes.length > 0) {
        broadcastUpdate({
          type: 'balanceUpdate',
          changes: changes,
          timestamp: new Date().toISOString(),
          totalCities: changes.length
        });
      }

      // Update global metrics
      this.updateGlobalMetrics();
      
    } catch (error) {
      console.error('Error in balance cycle:', error);
    } finally {
      this.isBalancing = false;
    }
  }

  // ============================================
  // METRICS AND LOGGING
  // ============================================

  /**
   * Log an adjustment
   */
  logAdjustment(location, data) {
    this.adjustmentLog.push({
      timestamp: new Date().toISOString(),
      location: location,
      city: trafficLights[location]?.city || location,
      ...data
    });
    
    // Keep log manageable
    if (this.adjustmentLog.length > 1000) {
      this.adjustmentLog = this.adjustmentLog.slice(-500);
    }
  }

  /**
   * Update global metrics
   */
  updateGlobalMetrics() {
    const locations = Object.keys(this.balanceState);
    let totalFairness = 0;
    let locationsWithImbalance = 0;

    locations.forEach(location => {
      const state = this.balanceState[location];
      if (state && state.balanceMetrics) {
        const fairness = state.balanceMetrics.fairness || 1;
        totalFairness += fairness;
        if (fairness < BALANCE_CONFIG.FAIRNESS_TOLERANCE) {
          locationsWithImbalance++;
        }
      }
    });

    this.globalMetrics = {
      totalFairness: totalFairness,
      avgFairness: totalFairness / Math.max(1, locations.length),
      locationsWithImbalance: locationsWithImbalance,
      totalLocations: locations.length,
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Get balance report for a location
   */
  getBalanceReport(location) {
    const state = this.balanceState[location];
    if (!state) return null;

    const light = trafficLights[location];
    if (!light) return null;

    return {
      location: location,
      city: light.city || location,
      province: light.province || 'Unknown',
      currentPhase: light.phase,
      phaseTimer: light.phaseTimer,
      phaseTime: state.phaseTime,
      greenTimeUsed: state.greenTimeUsed,
      greenCycles: state.greenCycles,
      waitTime: state.waitTime,
      balanceWeights: state.balanceWeights,
      balanceMetrics: state.balanceMetrics,
      trafficDensity: state.trafficDensity,
      fairness: state.balanceMetrics.fairness || 1,
      emergencyMode: this.emergencyMode || false,
      isEmergencyOverride: state.isEmergencyOverride || false,
      activeDirection: state.activeDirection,
      lastAdjustment: state.lastAdjustment,
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Get all balance reports
   */
  getAllBalanceReports() {
    const reports = {};
    Object.keys(this.balanceState).forEach(location => {
      reports[location] = this.getBalanceReport(location);
    });
    return reports;
  }

  /**
   * Get global balance status
   */
  getGlobalStatus() {
    return {
      isBalancing: this.isBalancing,
      emergencyMode: this.emergencyMode,
      totalLocations: Object.keys(this.balanceState).length,
      globalMetrics: this.globalMetrics || {},
      recentAdjustments: this.adjustmentLog.slice(-20),
      config: BALANCE_CONFIG,
      timestamp: new Date().toISOString()
    };
  }

  /**
   * Get fairness summary
   */
  getFairnessSummary() {
    const locations = Object.keys(this.balanceState);
    const summary = {
      totalLocations: locations.length,
      fair: 0,
      imbalanced: 0,
      severelyImbalanced: 0,
      details: {}
    };

    locations.forEach(location => {
      const state = this.balanceState[location];
      if (state && state.balanceMetrics) {
        const fairness = state.balanceMetrics.fairness || 1;
        summary.details[location] = {
          city: trafficLights[location]?.city || location,
          fairness: fairness,
          maxWaitTime: state.balanceMetrics.maxWaitTime || 0,
          avgWaitTime: state.balanceMetrics.averageWaitTime || 0
        };
        
        if (fairness >= 0.9) {
          summary.fair++;
        } else if (fairness >= 0.7) {
          summary.imbalanced++;
        } else {
          summary.severelyImbalanced++;
        }
      }
    });

    return summary;
  }

  /**
   * Set emergency mode
   */
  setEmergencyMode(enabled, location = null) {
    if (location) {
      // Set emergency mode for specific location
      if (this.balanceState[location]) {
        this.balanceState[location].isEmergencyOverride = enabled;
        if (enabled) {
          // Give all directions max green time
          const light = trafficLights[location];
          if (light) {
            const directions = ['up', 'down', 'left', 'right'];
            directions.forEach(dir => {
              if (light.directions[dir]) {
                light.directions[dir].timer = BALANCE_CONFIG.MAX_GREEN_TIME;
              }
            });
            light.phaseTimer = BALANCE_CONFIG.MAX_GREEN_TIME;
          }
        }
        return true;
      }
      return false;
    } else {
      // Set global emergency mode
      this.emergencyMode = enabled;
      if (enabled) {
        // Give all directions max green time for all locations
        Object.keys(trafficLights).forEach(location => {
          const light = trafficLights[location];
          if (light) {
            const directions = ['up', 'down', 'left', 'right'];
            directions.forEach(dir => {
              if (light.directions[dir]) {
                light.directions[dir].timer = BALANCE_CONFIG.MAX_GREEN_TIME;
              }
            });
            light.phaseTimer = BALANCE_CONFIG.MAX_GREEN_TIME;
          }
        });
      }
      return true;
    }
  }

  /**
   * Reset balance stats for a location
   */
  resetBalanceStats(location) {
    if (this.balanceState[location]) {
      const state = this.balanceState[location];
      state.greenTimeUsed = { up: 0, down: 0, left: 0, right: 0 };
      state.greenCycles = { up: 0, down: 0, left: 0, right: 0 };
      state.waitTime = { up: 0, down: 0, left: 0, right: 0 };
      state.balanceWeights = { up: 1, down: 1, left: 1, right: 1 };
      state.phaseTime = 0;
      state.balanceMetrics = {
        fairness: 1,
        totalWeight: 4,
        averageWaitTime: 0,
        maxWaitTime: 0
      };
      return true;
    }
    return false;
  }

  /**
   * Reset all balance stats
   */
  resetAllBalanceStats() {
    Object.keys(this.balanceState).forEach(location => {
      this.resetBalanceStats(location);
    });
    this.adjustmentLog = [];
    return true;
  }

  /**
   * Start automatic balancing
   */
  startBalancing(interval = BALANCE_CONFIG.CHECK_INTERVAL) {
    if (this.balanceInterval) {
      clearInterval(this.balanceInterval);
    }
    
    this.balanceInterval = setInterval(() => {
      this.runBalanceCycle();
    }, interval * 1000);
    
    console.log(`Balance manager started with interval ${interval}s`);
    return true;
  }

  /**
   * Stop automatic balancing
   */
  stopBalancing() {
    if (this.balanceInterval) {
      clearInterval(this.balanceInterval);
      this.balanceInterval = null;
      console.log('Balance manager stopped');
    }
    return true;
  }

  /**
   * Run a single balance cycle (for manual triggering)
   */
  runOnce() {
    this.runBalanceCycle();
    return true;
  }
}

// ============================================
// EXPORTS
// ============================================

// Create singleton instance
const balanceManager = new TimeBalanceManager();

// Auto-start balancing
balanceManager.startBalancing();

module.exports = {
  TimeBalanceManager,
  balanceManager,
  BALANCE_CONFIG
};
