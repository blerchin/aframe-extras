module.exports = {
  schema: {
    enabled: {
      default: true
    },
    rotationSensitivity: {
      default: 0.35
    }
  },

  init: function() {
    this.dVelocity = new THREE.Vector3();
    this.lookVector = new THREE.Vector2();
    this.rotationCur = new THREE.Vector3();
    this.rotationDest = new THREE.Vector3();
    this.rotationSpeed = 1;
    this.bindMethods();
    console.log(this.data.rotationSensitivity);
  },

  play: function() {
    this.addEventListeners();
  },

  pause: function() {
    this.removeEventListeners();
    this.dVelocity.set(0, 0, 0);
    this.lookVector.set(0, 0);
  },

  remove: function() {
    this.pause();
  },

  bindMethods: function() {
    this.rotate = this.rotate.bind(this);
    this.rotateTo = this.rotateTo.bind(this);
  },

  addEventListeners: function() {
    if (!window.g) {
      window.g = {};
    }
    var self = this;
    window.g.aframeControls = {
      rotate: function(x, y, speed) {
        self.rotate(x, y, speed);
      },
      rotateTo: function(x, y, speed){
        console.warn("This is experimental!!! Don't assume it works.")
        self.rotateTo(x, y, speed);
      }
    }
  },

  removeEventListeners: function() {
    window.g.aframeControls = null;
  },

  isVelocityActive: function() {
    return this.data.enabled && this.isMoving;
  },

  isRotationActive: function() {
    return this.data.enabled && this.isMoving;
  },

  getVelocityDelta: function() {
    this.dVelocity.z = this.isMoving ? -1 : 0;
    return this.dVelocity.clone();
  },

  getRotationDelta: function(dt) {
    this.lookVector.set(0, 0);
    if (Math.abs(this.rotationCur.x - this.rotationDest.x) > this.rotationSpeed) {
      var direction = this.rotationCur.x < this.rotationDest.x ? 1 : -
        1;
      var inc = direction * this.rotationSpeed
      this.rotationCur.x += inc;
      this.lookVector.x = inc;
    }

    if (Math.abs( this.rotationCur.y - this.rotationDest.y ) > this.rotationSpeed) {
      var direction = this.rotationCur.y < this.rotationDest.y ? 1 : -1;
      var inc = direction * this.rotationSpeed
      this.rotationCur.y += inc;
      this.lookVector.y = inc;
    }
    if (this.lookVector.x === 0 && this.lookVector.y === 0) {
      this.isMoving = false;
      this.rotationCur.set(0,0);
      this.rotationDest.set(0,0);
    }
    this.dVelocity = this.lookVector.clone().multiplyScalar(this.data.rotationSensitivity);

    return this.dVelocity;
  },

  setRotationDest: function(x, y, speed) {
    this.isMoving = true;
    this.rotationCur.set(0, 0);
    this.rotationDest.set(x, y);
    this.rotationSpeed = speed || this.rotationSpeed;
  },

  rotate: function(x, y, speed) {
    this.setRotationDest(x, y, speed);
  },
  rotateTo: function(x, y, speed) {
    var cur = this.el.getAttribute('rotation') || {x: 0, y:0, z: 0};
    //dom rotation uses y=yaw x=pitch
    this.setRotationDest(x - cur.y, y - cur.x, speed);
  }

};
