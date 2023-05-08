import "./style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import ThreeGlobe from "three-globe";
import countries from "./assets/custom.geo.json";
import map from "./assets/map.json";
import lines from "./assets/lines.json";
import * as dat from 'dat.gui'

const colors = {
  skyblue: "#0054ad",
  green: "#038510",
  blue: "#09d9c4",
  yellow: "#fff700",
  parrotcolor: "#9cff00",
  red: "#ff0000",
  white: "#ffffff",
  black: "#000000",
  pink: "#a10078",
}

// adding a scene
const scene = new THREE.Scene();

// globe
const globe = new ThreeGlobe({
  waitForGlobeReady: true,
  animateIn: true,
})
  .hexPolygonsData(countries.features)
  .hexPolygonResolution(3)
  .hexPolygonMargin(0.6)
  .showAtmosphere(true)
  .atmosphereColor(colors.blue)
  .atmosphereAltitude(0.1)
  .onGlobeReady(() => {
    setTimeout(() => {
      document.querySelector("#loading").classList.replace('display', 'hidden')
      document.querySelector("#container").classList.replace('hidden', 'display')
      addgui()
    }, 100);
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
        return e.status ? colors.green : colors.red;
      })
      .arcAltitudeAutoScale(true)
      .arcAltitude(0.2)
      .arcStroke(() => {
        return 0.7;
      })
      .arcDashLength(0.5)
      .arcDashGap(4)
      .arcDashAnimateTime(1000)
      .arcsTransitionDuration(500)
      .arcDashInitialGap((e) => e.order * 1);
  });

const globematerial = globe.globeMaterial();
globematerial.color = new THREE.Color(0x002330);
globematerial.emissive = new THREE.Color(0x000d12);
globematerial.emissiveIntensity = 1;
globematerial.shininess = 0.5;
scene.add(globe);

// adding a camera
const sizes = {
  w: window.innerWidth,
  h: window.innerHeight,
};
const camera = new THREE.PerspectiveCamera(45, sizes.w / sizes.h);
camera.position.z = 20;
camera.position.x = 60;
camera.position.y = 10;
scene.add(camera);

/*   light   */
const dlight = new THREE.DirectionalLight(0xffffff, 1);
dlight.position.set(-900, 10, 400);
// const dlightHelper1 = new THREE.DirectionalLightHelper(dlight, 5);
// scene.add(dlightHelper1);
camera.add(dlight);


// finally rendering everything into the canvas
const canvas = document.querySelector(".webgl");
const renderer = new THREE.WebGLRenderer({
  canvas: canvas,
  alpha: true,
});

renderer.setSize(sizes.w, sizes.h);
renderer.render(scene, camera);
renderer.setPixelRatio(window.devicePixelRatio);

// adding orbit controls

const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;
controls.enableZoom = true;
controls.enablePan = false;
controls.maxDistance = 500;
controls.minDistance = 200;
controls.saveState(controls.minDistance = 300)
window.addEventListener('wheel', () => { controls.minDistance = 150 })

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
  controls.update();
  renderer.render(scene, camera);
  window.requestAnimationFrame(loop);
};
loop();

// GUI

const addgui = () => {

  const gui = new dat.GUI()

  // light settings
  const light = gui.addFolder('light')
  light.addColor(dlight, 'color').name('Light Color')
  light.add(dlight, 'intensity', 0, 10).name('Light intensity')
  const lightpostion = light.addFolder('position')
  lightpostion.add(dlight.position, "x")
  lightpostion.add(dlight.position, "y")
  lightpostion.add(dlight.position, "z")

  // Globe material 
  const materialSetting = gui.addFolder('Material Setting')
  materialSetting.addColor(globematerial, 'color')
  materialSetting.addColor(globematerial, 'emissive')
  materialSetting.add(globematerial, 'emissiveIntensity', 0, 10)
  materialSetting.add(globematerial, 'shininess', 0, 100)


}
