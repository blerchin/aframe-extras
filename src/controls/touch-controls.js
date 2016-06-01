module.exports = {
  schema: {
    enabled: { default: true },
    lockAxis: { default: 'none' },
    sensitivity: { default: 1 / 25 }
  },

  init: function () {
    this.dVelocity = new THREE.Vector3();
    this.lookVector = new THREE.Vector2();
    this.bindMethods();
  },

  play: function () {
    this.addEventListeners();
  },

  pause: function () {
    this.removeEventListeners();
    this.dVelocity.set(0, 0, 0);
    this.lookVector.set(0, 0);
  },

  remove: function () {
    this.pause();
  },

  addEventListeners: function () {
    var sceneEl = this.el.sceneEl;
    var canvasEl = sceneEl.canvas;

    if (!canvasEl) {
      sceneEl.addEventListener('render-target-loaded', this.addEventListeners.bind(this));
      return;
    }

    canvasEl.addEventListener('touchstart', this.onTouchStart);
    canvasEl.addEventListener('touchmove', this.onTouchMove);
    canvasEl.addEventListener('touchend', this.onTouchEnd);
  },

  removeEventListeners: function () {
    var canvasEl = this.el.sceneEl && this.sceneEl.canvas;
    if (!canvasEl) { return; }

    canvasEl.removeEventListener('touchstart', this.onTouchStart);
    canvasEl.removeEventListener('touchmove', this.onTouchStart)
    canvasEl.removeEventListener('touchend', this.onTouchEnd);
  },
  
  bindMethods: function () {
    this.onTouchStart = this.onTouchStart.bind(this);
    this.onTouchEnd = this.onTouchEnd.bind(this);
    this.onTouchMove = this.onTouchMove.bind(this);
  },
  
  isVelocityActive: function () {
    return this.data.enabled && this.isMoving;
  },
  
  isRotationActive: function () {
    return this.data.enabled && this.isMoving;
  },

  getVelocityDelta: function () {
    this.dVelocity.z = this.isMoving ? -1 : 0;
    return this.dVelocity.clone();
  },
  
  getRotationDelta: function() {
    var dRotation = this.lookVector.clone().multiplyScalar(this.data.sensitivity);
    if(this.data.lockAxis === 'x'){
      dRotation.setX(0);
    }
    if(this.data.lockAxis === 'y'){
      dRotation.setY(0);
    }
		if(this.data.lockAxis === 'xy' ||
			 this.data.lockAxis === 'yx'){
      dRotation.setX(0);
      dRotation.setY(0);
		}
    this.lookVector.set(0, 0);
    return dRotation;
  },
  
  onTouchMove: function(event) {

    if (!this.data.enabled || !this.isMoving) {
      return;
    }

    var e = event.touches[0];
    var pe = this.previousTouch;

    var movementY = e.screenY - pe.screenY;
    var movementX = e.screenX - pe.screenX;

    this.previousTouch = {
      screenX: event.touches[0].screenX,
      screenY: event.touches[0].screenY
    };

    this.lookVector.x += movementX;
    this.lookVector.y += movementY;
  },



  onTouchStart: function (e) {
    console.log('onTouchStart')
    this.isMoving = true;
    this.previousTouch = {
      screenX: e.touches[0].screenX,
      screenY: e.touches[0].screenY
    };

    e.preventDefault();
  },

  onTouchEnd: function (e) {
    this.isMoving = false;
    e.preventDefault();
  }
};
