const components = [
  require('./actuators/server-headless'),
  require('./sensors/ultra-sonic'),
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