import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import ThreeGlobe from "three-globe";
import countries from "./assets/custom.geo.json"
import map from "./assets/map.json"
import lines from "./assets/lines.json"


const colors = {
  skyblue: "#0054ad",
  green: "#038510",
  blue: "#09d9c4",
  yellow: "#fff700",
  parrotcolor: "#9cff00",
  red: "#ff0000",
  white: "#ffffff",
  black: "#000000",
  pink: "#a10078"
}

// adding a scene
const scene = new THREE.Scene();



// globe
const globe = new ThreeGlobe({
  waitForGlobeReady: true,
  animateIn: true
})
  .hexPolygonsData(countries.features)
  .hexPolygonResolution(3)
  .hexPolygonMargin(0.6)
  .showAtmosphere(true)
  .atmosphereColor(colors.blue)
  .atmosphereAltitude(0.1)
  .onGlobeReady(() => {
    globe
      .labelsData(map.maps)
      .labelColor(() => colors.yellow)
      .pointColor(() => colors.yellow)
      .labelDotRadius(0.5)
      .labelSize(1)
      .labelText("city")
      .labelResolution(6)
      .labelAltitude(0.01)
      .pointsData(map.maps)
      .pointsMerge(true)
      .pointAltitude(0.09)
      .pointRadius(0.09)
      .arcsData(lines.pulls)
      .arcColor((e) => {
        return e.status ? colors.green : colors.red
      })
      .arcAltitudeAutoScale(true)
      .arcAltitude(0.2)
      .arcStroke(() => {
        return 0.7
      })
      .arcDashLength(0.5)
      .arcDashGap(4)
      .arcDashAnimateTime(1000)
      .arcsTransitionDuration(500).arcDashInitialGap((e) => e.order * 1)
  })


const globematerial = globe.globeMaterial()
globematerial.color = new THREE.Color(0x002330)
globematerial.emissive = new THREE.Color(0x000d12)
globematerial.emissiveIntensity = 1;
globematerial.shininess = 0.5
scene.add(globe)



// adding a camera
const sizes = {
  w: window.innerWidth,
  h: window.innerHeight,
};
const camera = new THREE.PerspectiveCamera(45, sizes.w / sizes.h);
camera.position.z = 20
camera.position.x = 60
camera.position.y = 10
scene.add(camera);




// adding  lights
// const light = new THREE.AmbientLight(0xbbbbbb, 0.2);
// light.position.set(10, 10, 10);
// scene.add(light);
const dlight = new THREE.DirectionalLight(0xffffff, 2);
dlight.position.set(-900, 10, 400)
const dlightHelper1 = new THREE.DirectionalLightHelper(dlight, 5)
scene.add(dlightHelper1)
camera.add(dlight);
// const dlight1 = new THREE.DirectionalLight(0x7982f6, 1);
// dlight1.position.set(-500, 10, 200)
// scene.add(dlight1);
// const dlight2 = new THREE.DirectionalLight(0x8566cc, 0.5);
// dlight2.position.set(-500, 10, 200)
// scene.add(dlight2);





// finally rendering everything into the canvas
const canvas = document.querySelector(".webgl");
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  alpha: true,
});

renderer.setSize(sizes.w, sizes.h);
renderer.render(scene, camera);
renderer.setPixelRatio(window.devicePixelRatio)

// adding orbit controls

const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.enablePan = false;
controls.maxDistance = 200;
controls.minDistance = 300;

// update the window everytime it is resized

window.addEventListener("resize", () => {
  sizes.w = window.innerWidth;
  sizes.h = window.innerHeight;
  renderer.setSize(sizes.w, sizes.h);
  camera.aspect = sizes.w / sizes.h;
  camera.updateProjectionMatrix();
});

// the object is streching lets fix that
const loop = () => {
  globe.rotation.x = 0;
  globe.rotation.y += 0.0005;
  // globe.rotation.z += 0.001;
  controls.update();
  renderer.render(scene, camera);
  window.requestAnimationFrame(loop);
};
loop();
