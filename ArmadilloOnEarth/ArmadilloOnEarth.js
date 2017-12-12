// Modes.. one per part of question 1
var Part = {
  EYES: 0,
  LASERS: 1,
  DEFORM: 2,
  EXERCISE: 3,
  COUNT: 4
}
var mode = Part.EXERCISE; // current mode

var mesh;

// Setup renderer
var canvas = document.getElementById('canvas');
var renderer = new THREE.WebGLRenderer();
renderer.setClearColor(0x000000); // black background colour
canvas.appendChild(renderer.domElement);

// Adapt backbuffer to window size
function resize() {
  renderer.setSize(window.innerWidth, window.innerHeight);
  for (let i = 0; i < Part.COUNT; ++i) {
    cameras[i].aspect = window.innerWidth / window.innerHeight;
    cameras[i].updateProjectionMatrix();
  }
}

// Hook up to event listener
window.addEventListener('resize', resize);

// Disable scrollbar function
window.onscroll = function () {
  window.scrollTo(0, 0);
}

// Setup scenes
var scenes = [
  new THREE.Scene(),
  new THREE.Scene(),
  new THREE.Scene(),
  new THREE.Scene(),
]

// Setting up all shared objects
var cameras = [];
var controls = [];
var worldFrames = [];
var floorTextures = [];
var floorMaterials = [];
var floorGeometries = [];
var floors = [];

// do not add floors for EXERCISE ARMADILLO
for (let i = 0; i < Part.COUNT; ++i) {
  cameras[i] = new THREE.PerspectiveCamera(30, 1, 0.1, 1000); // view angle, aspect ratio, near, far
  cameras[i].position.set(-5, 5, -15);
  cameras[i].lookAt(scenes[i].position);
  scenes[i].add(cameras[i]);

  // orbit controls
  controls[i] = new THREE.OrbitControls(cameras[i]);
  controls[i].damping = 0.2;
  controls[i].autoRotate = false;

  worldFrames[i] = new THREE.AxisHelper(3);

  scenes[i].add(worldFrames[i]);
}

var light = new THREE.PointLight(0xffffff);
light.position.set(0.1, 1.5, 0.32);
scenes[Part.EXERCISE].add(light);

resize();


emitterSettings = {
  type: 'sphere',
  positionSpread: new THREE.Vector3(0.5, 0.5, 0.5),
  acceleration: new THREE.Vector3(20, -30, 50),
  radius: 3.0,
  speed: 40,
  speedSpread: 0.5,
  sizeStart: 0.5,
  sizeEnd: 3,
  opacityStart: 1,
  opacityMiddle: 1,
  opacityEnd: 0,
  colorStart: new THREE.Color('white'),
  colorStartSpread: new THREE.Vector3(0.5, 0.5, 0.5),
  colorMiddle: new THREE.Color('red'),
  colorEnd: new THREE.Color('red'),
  particlesPerSecond: 5000,
  alive: 0, // initially disabled, will be triggered later
  emitterDuration: 0.1
};

// Create a particle group to add the emitter
this.particleGroup = new ShaderParticleGroup({
  texture: THREE.ImageUtils.loadTexture('images/spark.png'),
  maxAge: 2,
  colorize: 1,
  blending: THREE.AdditiveBlending,
});

var colors = ["red", "orange", "yellow", "green", "blue", "violet", "pink", "magenta", "cyan", "steelblue", "seagreen"];
for (var i = 0; i < colors.length; i++) {
  emitterSettings.colorMiddle = new THREE.Color(colors[i]);
  emitterSettings.colorEnd = new THREE.Color(colors[i]);
  particleGroup.addPool(1, emitterSettings, false);
}

// Add the particle group to the scene so it can be drawn.
scenes[Part.EXERCISE].add(particleGroup.mesh);

// LOAD OBJ ROUTINE
// mode is the scene where the model will be inserted
function loadOBJ(mode, file, material, scale, xOff, yOff, zOff, xRot, yRot, zRot) {
  var onProgress = function (query) {
    if (query.lengthComputable) {
      var percentComplete = query.loaded / query.total * 100;
      console.log(Math.round(percentComplete, 2) + '% downloaded');
    }
  };

  var onError = function () {
    console.log('Failed to load ' + file);
  };

  var loader = new THREE.OBJLoader();
  loader.load(file, function (object) {
    object.traverse(function (child) {
      if (child instanceof THREE.Mesh) {
        child.material = material;
      }
    });

    object.position.set(xOff, yOff, zOff);
    object.rotation.x = xRot;
    object.rotation.y = yRot;
    object.rotation.z = zRot;
    object.scale.set(scale, scale, scale);
    object.parent = worldFrames[mode];
    scenes[mode].add(object);
  }, onProgress, onError);
}

function randomVector3(xMin, xMax, yMin, yMax, zMin, zMax) {
  return new THREE.Vector3(xMin + (xMax - xMin) * Math.random(),
    yMin + (yMax - yMin) * Math.random(), zMin + (zMax - zMin) * Math.random());
}

// SHARED MATERIALS
// Lightbulb has same position in both shaders
var lightPosition = {
  type: 'v3',
  value: new THREE.Vector3(0, 0, 0)
}

var armadilloMaterial = new THREE.ShaderMaterial({
  uniforms: {
    lightPosition: lightPosition,
  }
});
var armadilloShaderFiles = [
  'glsl//armadillo.vs.glsl',
  'glsl//armadillo.fs.glsl'
]
var headPosition = {
  type: 'f',
  value: 0.0,
}
var noddingArmadilloMaterial = new THREE.ShaderMaterial({
  uniforms: {
    headPosition: headPosition,
  }
})
var noddingArmadilloShaderFiles = [
  'glsl//nodding_armadillo.vs.glsl',
  'glsl//nodding_armadillo.fs.glsl'
]

new THREE.SourceLoader().load(armadilloShaderFiles, function (shaders) {
  armadilloMaterial.vertexShader = shaders['glsl//armadillo.vs.glsl'];
  armadilloMaterial.fragmentShader = shaders['glsl//armadillo.fs.glsl'];
})
new THREE.SourceLoader().load(noddingArmadilloShaderFiles, function (shaders) {
  noddingArmadilloMaterial.vertexShader = shaders['glsl//nodding_armadillo.vs.glsl'];
  noddingArmadilloMaterial.fragmentShader = shaders['glsl//nodding_armadillo.fs.glsl'];
})

var originalArmPosition = {
  type: 'f',
  value: 0.0,
};

var LeftLegPosition = {
  type: 'f',
  value: 0.0,
};

var LeftUpperLegPosition = {
  type: 'f',
  value: 0.0,
};

var RightLegPosition = {
  type: 'f',
  value: 0.0,
};

var RightUpperLegPosition = {
  type: 'f',
  value: 0.0,
};

var exercisingArmadilloMaterial = new THREE.ShaderMaterial({
  uniforms: {
    originalArmPosition: originalArmPosition,
    LeftLegPosition: LeftLegPosition,
    LeftUpperLegPosition: LeftUpperLegPosition,
    RightLegPosition: RightLegPosition,
    RightUpperLegPosition: RightUpperLegPosition,
  }
});

var exercisingArmadilloShaderFiles = [
  'glsl//exercising_armadillo.vs.glsl',
  'glsl//exercising_armadillo.fs.glsl'
]
new THREE.SourceLoader().load(exercisingArmadilloShaderFiles, function (shaders) {
  exercisingArmadilloMaterial.vertexShader = shaders['glsl//exercising_armadillo.vs.glsl'];
  exercisingArmadilloMaterial.fragmentShader = shaders['glsl//exercising_armadillo.fs.glsl'];
})

// EYES
var leftEyePosition = {
  type: 'v3',
  value: new THREE.Vector3(0.07, 1.23, -0.32)
}

var rightEyePosition = {
  type: 'v3',
  value: new THREE.Vector3(-0.07, 1.23, -0.32)
}

var leftEyeMaterial = new THREE.ShaderMaterial({
  uniforms: {
    lightPosition: lightPosition,
    eyePosition: leftEyePosition,
  }
});

var rightEyeMaterial = new THREE.ShaderMaterial({
  uniforms: {
    lightPosition: lightPosition,
    eyePosition: rightEyePosition,
  }
});

eyeShaderFiles = [
  'glsl//eye.vs.glsl',
  'glsl//eye.fs.glsl'
]

new THREE.SourceLoader().load(eyeShaderFiles, function (shaders) {
  leftEyeMaterial.vertexShader = shaders['glsl//eye.vs.glsl'];
  leftEyeMaterial.fragmentShader = shaders['glsl//eye.fs.glsl'];

  rightEyeMaterial.vertexShader = shaders['glsl//eye.vs.glsl'];
  rightEyeMaterial.fragmentShader = shaders['glsl//eye.fs.glsl'];
})

// LASERS
var leftLaserMaterial = new THREE.ShaderMaterial({
  uniforms: {
    lightPosition: lightPosition,
    eyePosition: leftEyePosition,
  }
});

var rightLaserMaterial = new THREE.ShaderMaterial({
  uniforms: {
    lightPosition: lightPosition,
    eyePosition: rightEyePosition,
  }
});

laserShaderFiles = [
  'glsl//laser.vs.glsl',
  'glsl//laser.fs.glsl'
]
new THREE.SourceLoader().load(laserShaderFiles, function (shaders) {
  leftLaserMaterial.vertexShader = shaders['glsl//laser.vs.glsl'];
  leftLaserMaterial.fragmentShader = shaders['glsl//laser.fs.glsl'];

  rightLaserMaterial.vertexShader = shaders['glsl//laser.vs.glsl'];
  rightLaserMaterial.fragmentShader = shaders['glsl//laser.fs.glsl'];
})

loadOBJ(Part.EYES, 'obj/armadillo.obj', armadilloMaterial, 1, 0, 0, 0, 0, 0, 0); // Armadillo

eyes = {};

// Lightbulb
eyes.lightbulbMaterial = new THREE.MeshBasicMaterial();
eyes.lightbulbMaterial.color = new THREE.Color(1, 1, 0);
eyes.lightbulbGeometry = new THREE.SphereGeometry(1, 32, 32);

eyes.lightbulb = new THREE.Mesh(eyes.lightbulbGeometry, eyes.lightbulbMaterial);
eyes.lightbulb.position.set(0, 15, -3.0);
eyes.lightbulb.scale.set(0.15, 0.15, 0.15);
scenes[Part.EYES].add(eyes.lightbulb);

loadOBJ(Part.EYES, 'obj/eye.obj', leftEyeMaterial, 0.5, 0, 0, 0, 0, 0, 0);
loadOBJ(Part.EYES, 'obj/eye.obj', rightEyeMaterial, 0.5, 0, 0, 0, 0, 0, 0);
loadOBJ(Part.LASERS, 'obj/armadillo.obj', armadilloMaterial, 1, 0, 0, 0, 0, 0, 0); // Armadillo

lasers = {};

// Lightulb
lasers.lightbulbMaterial = new THREE.MeshBasicMaterial();
lasers.lightbulbMaterial.color = new THREE.Color(1, 1, 0);
lasers.lightbulbGeometry = new THREE.SphereGeometry(1, 32, 32);

lasers.lightbulb = new THREE.Mesh(lasers.lightbulbGeometry, lasers.lightbulbMaterial);
lasers.lightbulb.position.set(0, 2.43, -2.0);
lasers.lightbulb.scale.set(0.15, 0.15, 0.15);
scenes[Part.LASERS].add(lasers.lightbulb);

// Laser geometry
var laserGeometry = new THREE.CylinderGeometry(0.02, 0.02, 2, 16);
for (let i = 0; i < laserGeometry.vertices.length; ++i)
  laserGeometry.vertices[i].y += 1;

var leftLaser = new THREE.Mesh(laserGeometry, leftLaserMaterial);
var rightLaser = new THREE.Mesh(laserGeometry, rightLaserMaterial);

loadOBJ(Part.LASERS, 'obj/eye.obj', leftEyeMaterial, 0.5, 0, 0, 0, 0, 0, 0);
loadOBJ(Part.LASERS, 'obj/eye.obj', rightEyeMaterial, 0.5, 0, 0, 0, 0, 0, 0);
scenes[Part.LASERS].add(leftLaser, rightLaser);

loadOBJ(Part.DEFORM, 'obj/armadillo.obj', noddingArmadilloMaterial, 1, 0, 0, 0, 0, 0, 0); // Armadillo
loadOBJ(Part.EXERCISE, 'obj/armadillo.obj', exercisingArmadilloMaterial, 1, 0, 0, 0, 0, 0, 0); // exercising Armadillo here

// Earth
var earthPosition = {
  type: 'v3',
  value: new THREE.Vector3(0, 0, 0)
}

var earthTexture = new THREE.ImageUtils.loadTexture('images/earth.jpg');
var earthMaterial = new THREE.MeshBasicMaterial({
  map: earthTexture,
  overdraw: 0.5,
  side: THREE.DoubleSide,
});
earthGeometry = new THREE.SphereGeometry(1, 50, 50);

earth = new THREE.Mesh(earthGeometry, earthMaterial);
earth.position.set(0, -5.0, 0.0);
earth.scale.set(5, 5, 5);
scenes[Part.EXERCISE].add(earth);

var clock = new THREE.Clock();
var delta = clock.getDelta();

function setUpTime() {
  time = clock.getElapsedTime();
}

function exerciseArmadillo() {
  setUpTime();
  if (mode == Part.EXERCISE) {
    originalArmPosition.value = 0.2 * Math.sin(6 * time);
    LeftLegPosition.value = 0.4 * Math.sin(4 * time);
    LeftUpperLegPosition.value = 0.4 * Math.sin(4 * time);
    RightLegPosition.value = 0.4 * Math.cos(4 * time);
    RightUpperLegPosition.value = 0.4 * Math.cos(4 * time);

    particleGroup.triggerPoolEmitter( 1, randomVector3(-0.5, 0.5, 0.25, 0.5, -0.5, -0.25));
    particleGroup.tick(delta);
    earth.rotation.x += 0.01;
	}
  exercisingArmadilloMaterial.needsUpdate = true;
  earthMaterial.needsUpdate = true;
}

// LISTEN TO KEYBOARD
var keyboard = new THREEx.KeyboardState();

var minHeadPosition = {
  type: 'f',
  value: -0.3,
}

var maxHeadPosition = {
  type: 'f',
  value: 0.3,
}

function checkKeyboard() {
  if (keyboard.pressed("1"))
    mode = Part.EYES;
  else if (keyboard.pressed("2"))
    mode = Part.LASERS;
  else if (keyboard.pressed("3"))
    mode = Part.DEFORM;
  else if (keyboard.pressed("4"))
    mode = Part.EXERCISE;

  if (mode == Part.EYES) {
    if (keyboard.pressed("W"))
      lightPosition.value.z -= 0.1;
    else if (keyboard.pressed("S"))
      lightPosition.value.z += 0.1;

    if (keyboard.pressed("A"))
      lightPosition.value.x -= 0.1;
    else if (keyboard.pressed("D"))
      lightPosition.value.x += 0.1;

    lightPosition.value = eyes.lightbulb.position;
  } else if (mode == Part.LASERS) {
    if (keyboard.pressed("W"))
      lightPosition.value.z -= 0.1;
    else if (keyboard.pressed("S"))
      lightPosition.value.z += 0.1;

    if (keyboard.pressed("A"))
      lightPosition.value.x -= 0.1;
    else if (keyboard.pressed("D"))
      lightPosition.value.x += 0.1;

    lightPosition.value = lasers.lightbulb.position;
  } else if (mode == Part.DEFORM) {
    if (keyboard.pressed("P") && headPosition.value <= maxHeadPosition.value) {
      headPosition.value += 0.05;
    } else if (keyboard.pressed("O") && headPosition.value >= minHeadPosition.value) {
      headPosition.value -= 0.05;
    }
  }
  rightEyeMaterial.needsUpdate = true;
  leftEyeMaterial.needsUpdate = true;
  leftLaserMaterial.needsUpdate = true;
  rightLaserMaterial.needsUpdate = true;
  armadilloMaterial.needsUpdate = true;
  noddingArmadilloMaterial.needsUpdate = true;
}

// SETUP UPDATE CALL-BACK
function update() {
  checkKeyboard();
  requestAnimationFrame(update);
  renderer.render(scenes[mode], cameras[mode]);
  exerciseArmadillo();
}

update();
