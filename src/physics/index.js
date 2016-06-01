var CANNON = require('cannon'),
    math = require('../math');

module.exports = {
  'physics':        require('./physics'),
  'dynamic-body':   require('./dynamic-body'),
  'kinematic-body': require('./kinematic-body'),
  'static-body':    require('./static-body'),
  'system': {
    'physics': require('./system/physics')
  },

  registerAll: function (AFRAME) {
    if (this._registered) return;

    AFRAME = AFRAME || window.AFRAME;
    AFRAME = AFRAME.aframeCore || AFRAME;

    math.registerAll();
    if (!AFRAME.systems.physics)              AFRAME.registerSystem('physics', this.system.physics);
    if (!AFRAME.components['physics'])        AFRAME.registerComponent('physics',        this['physics']);
    if (!AFRAME.components['dynamic-body'])   AFRAME.registerComponent('dynamic-body',   this['dynamic-body']);
    if (!AFRAME.components['kinematic-body']) AFRAME.registerComponent('kinematic-body', this['kinematic-body']);
    if (!AFRAME.components['static-body'])    AFRAME.registerComponent('static-body',    this['static-body']);

    this._registered = true;
  }
};

// Export CANNON.js.
window.CANNON = window.CANNON || CANNON;
