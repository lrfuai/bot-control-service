module.exports = {
  name: 'servo-headless',
  type: 'actuator',
  can: [
    'forward',
    'backward',
    'stop'
  ],
  status: [
    'fordwarding',
    'backwarding',
    'stopped'
  ]
};