const components = [
  // Actuators
  require('./actuators/server-headless'),
  
  // Sensors
  require('./sensors/ultrasonic'),
  require('./sensors/bumper'),
  
];

module.exports = {
  TYPES: {
    ACTUATOR: 'actuator',
    SENSOR: 'sensor'
  },
  get: name => components.filter(component => component.name === name),
  all: type => components
};