const hardware = {
  name: 'lrf-prototipe-01',
  endpoint: '',
  state: {
    actions: {
      endpoint: 'http://localhost:8090',
      type: 'http'
    },
    state: {
      endpoint: 'mqtt://localhost:8091',
      type: 'mqtt'
    }
  },
  components: [
    {
      name: 'Ultrasonic Sensor',
      type: 'ultra-sonic',
      code: 'USS:01'
    },
    {
      name: 'Front Left Weel',
      type: 'servo-headless',
      code: 'SH:FL'
    },
    {
      name: 'Front Right Weel',
      type: 'servo-headless',
      code: 'SH:FR'
    },
    {
      name: 'Back Left  Weel',
      type: 'servo-headless',
      code: 'SH:BL'
    },
    {
      name: 'Back Right Weel',
      type: 'servo-headless',
      code: 'SH:BR'
    }
  ]
};