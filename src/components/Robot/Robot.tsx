import * as THREE from "three";
import { FBXLoader } from "three/examples/jsm/loaders/FBXLoader.js";
// @ts-ignore
import { GUI } from "three/examples/jsm/libs/dat.gui.module.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import { Group, SkinnedMesh } from "three";
import { useEffect } from "react";

//@ts-ignore
let container: any,
  clock: any,
  mixer: any,
  actions: any,
  activeAction: any,
  previousAction: any;
//@ts-ignore
let camera: any, scene: any, renderer: any, controls: any;
//@ts-ignore
let animations: any = [];
//@ts-ignore
let gui: any = null;
//Changer avec lecture dossier ou nombre
let models = ["modelopti"];
let forward = true;

export const api = {
  state: "Armature|HipHop",
  speed: 1,
  color: 0x444444,
  color2: 0x444444,
  skyColor: 0x444444,
  groundColor: 0x444444,
  dirColor: 0x444444,
  position: {
    x: 150,
    y: 50,
    z: 400,
  },
  dirPosition: {
    x: -51,
    y: 247,
    z: 800,
  },
  camPosition: {
    x: 0,
    y: 100,
    z: 1050,
  },
  intensity: 0.3,
  dirIntensity: 0.3,
  background: "transparent",
  fov: 45,
  aspect: window.innerWidth / window.innerHeight,
  near: 1,
  far: 2000,
  autorotate: false,
};

function init(setLoading: any) {
  container = document.createElement("div");
  container.className =
    "fixed top-0 left-0 right-0 bottom-0 z-10 h-screen w-full overflow-hidden flex justify-center items-center pointer-events-none transform translate-x-32 translate-y-32";
  document.body.appendChild(container);

  camera = new THREE.PerspectiveCamera(
    api.fov,
    window.innerWidth / window.innerHeight,
    api.near,
    api.far
  );
  camera.position.set(api.camPosition.x, api.camPosition.y, api.camPosition.z);

  scene = new THREE.Scene();
  //   scene.background = new THREE.Color(api.background);

  clock = new THREE.Clock();

  // lights

  const hemiLight = new THREE.HemisphereLight(api.skyColor, api.groundColor);
  hemiLight.position.set(api.position.x, api.position.y, api.position.z);
  hemiLight.intensity = api.intensity;
  hemiLight.name = "Hemi_Light_01";
  scene.add(hemiLight);

  const dirLight = new THREE.SpotLight(api.dirColor);
  dirLight.position.set(
    api.dirPosition.x,
    api.dirPosition.y,
    api.dirPosition.z
  );
  dirLight.castShadow = true;
  dirLight.shadow.mapSize.width = 2048;
  dirLight.shadow.mapSize.height = 2048;
  dirLight.shadow.camera.fov = 30;
  dirLight.shadow.camera.near = 0.5; // default
  dirLight.shadow.camera.far = 2000; // default
  dirLight.name = "Spot_Light_01";
  scene.add(dirLight);

  let material = new THREE.ShadowMaterial();
  material.opacity = 0.5;

  // ground
  const mesh = new THREE.Mesh(
    new THREE.PlaneGeometry(200000, 200000),
    // new THREE.MeshPhongMaterial({
    //   color: 0xffffff,
    //   depthWrite: false,
    //   transparent: true,
    //   opacity: 0,
    // })
    material
  );
  mesh.rotation.x = -Math.PI / 2;
  mesh.receiveShadow = true;
  mesh.position.set(0, -1, 0);
  scene.add(mesh);
  //
  // const grid = new THREE.GridHelper(200000, 4000, 0x000000, 0x000000);
  // grid.material.opacity = 0.2;
  // grid.material.transparent = true;
  // scene.add(grid);

  // model

  const loader = new FBXLoader();
  let count = 0;
  for (let model of models) {
    loader.load(
      `../models/${model}.fbx`,
      function (obj) {
        count++;

        animations.push(...obj.animations);

        if (count === models.length) {
          obj.castShadow = true;
          obj.receiveShadow = true;

          obj.children.forEach((child) => {
            child.castShadow = true;
            child.receiveShadow = true;
          });

          obj.name = "model";

          dirLight.target = obj;
          //@ts-ignore
          scene.add(obj);
          //@ts-ignore
          createGUI(obj, animations);
        }
        if (count === 1) {
          setLoading(false);
        }
      },
      (xhr) => {
        // console.log(xhr);
      },
      function (e) {
        console.error(e);
      }
    );
  }

  renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.setClearColor(0xffffff, 0);
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth * 0.75, window.innerHeight * 0.75);
  renderer.outputEncoding = THREE.sRGBEncoding;
  renderer.shadowMap.enabled = true;
  container.appendChild(renderer.domElement);

  controls = new OrbitControls(camera, renderer.domElement);
  controls.autoRotate = api.autorotate;

  window.addEventListener("resize", onWindowResize);
}
//@ts-ignore
function createGUI(model, animations) {
  const states = [
    "Armature|Stop",
    "Armature|HipHop",
    "Armature|Rumba",
    "Armature|Flair",
    "Armature|Shuffle",
    "Armature|Run",
    "TurnBack",
    "Armature|Brooklyn",
    "Armature|Wave",
    "Armature|Swing",
    "Armature|Samba",
    "Armature|BreakDance",
    "Armature|Salsa",
    "Armature|Twist",
    "Armature|Maraschino",
    "Armature|Jazz",
    "Armature|Macarena",
    "Armature|Belly",
    "Armature|YMCA",
    "Armature|RunningMan",
  ];
  const speeds = [0.25, 0.5, 1, 1.25, 1.5, 2];

  mixer = new THREE.AnimationMixer(model);

  actions = {};
  for (let i = 0; i < animations.length; i++) {
    const clip = animations[i];
    //@ts-ignore
    actions[clip.name] = mixer.clipAction(clip);
  } //@ts-ignore

  if (!gui) {
    gui = new GUI();

    const statesFolder = gui.addFolder("States");
    const colorsFolder = gui.addFolder("Colors");
    const lightsFolder = gui.addFolder("Lights");
    const cameraFolder = gui.addFolder("Camera");
    const otherFolder = gui.addFolder("Other");

    const hemiLightFolder = lightsFolder.addFolder("hemisphere");
    const directionalLightFolder = lightsFolder.addFolder("directional");

    const clipCtrl = statesFolder.add(api, "state").options(states);
    // const backgroundCtrl = statesFolder.addColor(api, "background");

    const colorsCtrl = colorsFolder.addColor(api, "color");
    const colors2Ctrl = colorsFolder.addColor(api, "color2");

    const lightSkyColorCtrl = hemiLightFolder.addColor(api, "skyColor");
    const lightGroundColorCtrl = hemiLightFolder.addColor(api, "groundColor");
    const lightPositionsXCtrl = hemiLightFolder.add(
      api.position,
      "x",
      -2000,
      2000
    );
    const lightPositionsYCtrl = hemiLightFolder.add(
      api.position,
      "y",
      -2000,
      2000
    );
    const lightPositionsZCtrl = hemiLightFolder.add(
      api.position,
      "z",
      -2000,
      2000
    );
    const lightIntensityCtrl = hemiLightFolder.add(
      api,
      "intensity",
      -1,
      1,
      0.5
    );

    const dirLightColor = directionalLightFolder.addColor(api, "dirColor");
    const dirLightPositionsXCtrl = directionalLightFolder.add(
      api.dirPosition,
      "x",
      -500,
      500
    );
    const dirLightPositionsYCtrl = directionalLightFolder.add(
      api.dirPosition,
      "y",
      0,
      2000
    );
    const dirLightPositionsZCtrl = directionalLightFolder.add(
      api.dirPosition,
      "z",
      -400,
      800
    );
    const dirLightIntensity = directionalLightFolder.add(
      api,
      "intensity",
      -1,
      1,
      0.5
    );

    const cameraPositionXCtrl = cameraFolder.add(
      api.camPosition,
      "x",
      -2000,
      2000
    );
    const cameraPositionYCtrl = cameraFolder.add(
      api.camPosition,
      "y",
      -2000,
      2000
    );
    const cameraPositionZCtrl = cameraFolder.add(
      api.camPosition,
      "z",
      -2000,
      2000
    );
    const cameraFovCtrl = cameraFolder.add(api, "fov", 0, 100);
    const cameraNearCtrl = cameraFolder.add(api, "near", 1, 2);
    const cameraFarCtrl = cameraFolder.add(api, "far", 500, 2000);
    const cameraAutoRotate = cameraFolder
      .add(api, "autorotate")
      .options("false", "true");

    otherFolder.add(api, "speed").options(speeds);

    clipCtrl.onChange(function () {
      fadeToAction(api.state, 1.5);
    });

    colorsCtrl.onChange(function () {
      changeColor(api.color);
    });

    dirLightColor.onChange(function () {
      changeDirLightColor(api.dirColor);
    });

    colors2Ctrl.onChange(function () {
      changeColor2(api.color2);
    });

    lightSkyColorCtrl.onChange(function () {
      changeSkyColor(api.skyColor);
    });

    lightGroundColorCtrl.onChange(function () {
      changeGroundColor(api.groundColor);
    });

    lightPositionsXCtrl.onChange(function () {
      changeLightPosition(api.position);
    });

    lightPositionsYCtrl.onChange(function () {
      changeLightPosition(api.position);
    });

    lightPositionsYCtrl.onChange(function () {
      changeLightPosition(api.position);
    });

    lightPositionsZCtrl.onChange(function () {
      changeLightPosition(api.position);
    });

    lightIntensityCtrl.onChange(function () {
      changeLightIntensity(api.intensity);
    });

    dirLightPositionsXCtrl.onChange(function () {
      changeDirLightPosition(api.dirPosition);
    });

    dirLightPositionsYCtrl.onChange(function () {
      changeDirLightPosition(api.dirPosition);
    });

    dirLightPositionsZCtrl.onChange(function () {
      changeDirLightPosition(api.dirPosition);
    });

    dirLightIntensity.onChange(function () {
      changeDirLightIntensity(api.intensity);
    });

    // backgroundCtrl.onChange(function () {
    //   changeBackgroundColor(api.background);
    // });

    cameraPositionXCtrl.onChange(function () {
      changeCameraPosition(api.camPosition);
    });

    cameraPositionYCtrl.onChange(function () {
      changeCameraPosition(api.camPosition);
    });

    cameraPositionZCtrl.onChange(function () {
      changeCameraPosition(api.camPosition);
    });

    cameraFovCtrl.onChange(function () {
      changeCameraFov(api.fov);
    });

    cameraNearCtrl.onChange(function () {
      changeCameraNear(api.near);
    });

    cameraFarCtrl.onChange(function () {
      changeCameraFar(api.far);
    });

    cameraAutoRotate.onChange(function () {
      changeCameraAutoRotate(api.autorotate);
    });

    statesFolder.open();
    colorsFolder.open();
    directionalLightFolder.open();
    //@ts-ignore
    activeAction = actions["Armature|Stop"];
    //@ts-ignore
    activeAction.play();
  }
}

//Changer la couleur des "joints" du personnage
export function changeColor(color: any) {
  //@ts-ignore
  scene.getObjectByName("Beta_Joints").material.color.setHex(color);
}

//Changer la couleur de la surface du personnage
export function changeColor2(color: any) {
  //@ts-ignore
  scene.getObjectByName("Beta_Surface").material.color.setHex(color);
}

function changeSkyColor(color: any) {
  //@ts-ignore
  scene.getObjectByName("Hemi_Light_01").color.setHex(color);
}

function changeGroundColor(color: any) {
  //@ts-ignore
  scene.getObjectByName("Hemi_Light_01").groundColor.setHex(color);
}

function changeLightPosition(position: any) {
  scene
    .getObjectByName("Hemi_Light_01")
    .position.set(position.x, position.y, position.z);
}

function changeCameraPosition(position: any) {
  camera.position.set(position.x, position.y, position.z);
}

function changeLightIntensity(intensity: any) {
  scene.getObjectByName("Hemi_Light_01").intensity = intensity;
}

function changeDirLightColor(color: any) {
  scene.getObjectByName("Spot_Light_01").color.setHex(color);
}

function changeDirLightPosition(position: any) {
  scene
    .getObjectByName("Spot_Light_01")
    .position.set(position.x, position.y, position.z);
}

function changeDirLightIntensity(intensity: any) {
  scene.getObjectByName("Spot_Light_01").intensity = intensity;
}

function changeBackgroundColor(color: any) {
  scene.background = new THREE.Color(color);
}

function changeCameraFov(fov: any) {
  camera.fov = fov;
  camera.updateProjectionMatrix();
}

function changeCameraNear(near: any) {
  camera.near = near;
  camera.updateProjectionMatrix();
}

function changeCameraFar(far: any) {
  camera.far = far;
  camera.updateProjectionMatrix();
}

function changeCameraAutoRotate(auto: any) {
  controls.autoRotate = auto === "true";
}

export function fadeToAction(name: any, duration: any) {
  previousAction = activeAction;
  activeAction = actions[name];
  // console.log(activeAction)

  if (previousAction === activeAction) return;

  if(name === "Armature|BreakDance") {
    activeAction.setLoop(THREE.LoopPingPong, 4)
  }

  if (previousAction !== activeAction) {
    previousAction.fadeOut(duration);
  }

  if (activeAction) {
    activeAction
      .reset()
      .setEffectiveTimeScale(1)
      .setEffectiveWeight(1)
      .fadeIn(duration)
      .play();
  }

  if (name === "Armature|Run") {
    if (!forward) {
      forward = true;
      scene.getObjectByName("model").rotateY(110);
    }
    run();
  }

  if (name === "TurnBack") {
    activeAction = actions["Armature|Run"];
    activeAction
      .reset()
      .setEffectiveTimeScale(1)
      .setEffectiveWeight(1)
      .fadeIn(duration)
      .play();

    scene.getObjectByName("model").rotateY(110);
    forward = false;
    run();
  }
}

//KAPPA
function run() {
  let increaseZ = (forward ? 30 : -30) * api.speed;
  let stop = false;

  var interval = setInterval(function () {
    let z = scene.getObjectByName("model").position.z;

    if ((forward && z >= 600) || (!forward && z <= 0)) {
      clearInterval(interval);
      fadeToAction("Armature|Stop", 1.5);
      stop = true;
    }

    if (!stop) {
      scene.getObjectByName("model").position.set(0, 0, z + increaseZ);
    }
  }, 100);
}

function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();

  renderer.setSize(window.innerWidth, window.innerHeight);
}

function animate() {
  const dt = clock.getDelta();

  if (mixer) mixer.update(dt * api.speed);

  requestAnimationFrame(animate);

  controls.update();

  renderer.render(scene, camera);
}

function Robot({ load }: any) {
  useEffect(() => {
    init(load.setLoading);
    animate();
  }, []);
  return <></>;
}

export default Robot;
