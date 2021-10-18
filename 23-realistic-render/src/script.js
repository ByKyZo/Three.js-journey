import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import * as dat from 'dat.gui';

/**
 * Loaders
 */
const gltfLoader = new GLTFLoader();
const cubeTextureLoader = new THREE.CubeTextureLoader().setPath('/textures/environmentMaps/0/');

/**
 * Base
 */
// Debug
const gui = new dat.GUI();

// Canvas
const canvas = document.querySelector('canvas.webgl');

// Scene
const scene = new THREE.Scene();

/**
 * EnvMap
 */
const envMap = cubeTextureLoader.load(['px.jpg', 'nx.jpg', 'py.jpg', 'ny.jpg', 'pz.jpg', 'nz.jpg']);
envMap.encoding = THREE.sRGBEncoding;
scene.background = envMap;
scene.environment = envMap;

const debugParams = {
    envMapIntensity: 5,
};
gui.add(debugParams, 'envMapIntensity')
    .min(0)
    .max(10)
    .step(0.001)
    .onChange(() => updateAllMaterials());

/**
 * Update All Materials
 */
const updateAllMaterials = () => {
    scene.traverse((child) => {
        if (child instanceof THREE.Mesh && child.material instanceof THREE.MeshStandardMaterial) {
            child.material.envMapIntensity = debugParams.envMapIntensity;
            child.material.needsUpdate = true;
            child.castShadow = true;
            child.receiveShadow = true;
        }
    });
};

/**
 * Models
 */
// gltfLoader.load('./models/FlightHelmet/glTF/FlightHelmet.gltf', (model) => {
//     model.scene.scale.set(10, 10, 10);
//     model.scene.position.set(0, -4, 0);
//     model.scene.rotation.set(0, Math.PI * 0.5, 0);
//     scene.add(model.scene);

//     const modelFolder = gui.addFolder('Model');
//     modelFolder.add(model.scene.rotation, 'y').min(-Math.PI).max(Math.PI).step(0.001);

//     updateAllMaterials();
// });
gltfLoader.load('./models/hamburger_me.glb', (model) => {
    model.scene.position.set(0, -4, 0);
    model.scene.rotation.set(0, Math.PI * 0.5, 0);
    scene.add(model.scene);

    const modelFolder = gui.addFolder('Model');
    modelFolder.add(model.scene.rotation, 'y').min(-Math.PI).max(Math.PI).step(0.001);

    updateAllMaterials();
});

/**
 * Light
 */

const directionalLight = new THREE.DirectionalLight(0xffffff, 3);
directionalLight.castShadow = true;
directionalLight.position.set(0.25, 3, -2.25);
directionalLight.shadow.camera.far = 15;
directionalLight.shadow.mapSize.set(1024, 1024);
directionalLight.shadow.normalBias = 0.02;

// const directionalLightHelpher = new THREE.CameraHelper(directionalLight.shadow.camera);
// scene.add(directionalLightHelpher);

const directionalLightFolder = gui.addFolder('Directional light');
directionalLightFolder.add(directionalLight, 'intensity').min(0).max(10).step(0.001);
directionalLightFolder.add(directionalLight.position, 'x').min(-5).max(5).step(0.001);
directionalLightFolder.add(directionalLight.position, 'y').min(-5).max(5).step(0.001);
directionalLightFolder.add(directionalLight.position, 'z').min(-5).max(5).step(0.001);

scene.add(directionalLight);

/**
 * Sizes
 */
const sizes = {
    width: window.innerWidth,
    height: window.innerHeight,
};

window.addEventListener('resize', () => {
    // Update sizes
    sizes.width = window.innerWidth;
    sizes.height = window.innerHeight;

    // Update camera
    camera.aspect = sizes.width / sizes.height;
    camera.updateProjectionMatrix();

    // Update renderer
    renderer.setSize(sizes.width, sizes.height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, sizes.width / sizes.height, 0.1, 100);
camera.position.set(4, 1, -4);
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
    antialias: true,
});
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.physicallyCorrectLights = true;
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.toneMappingExposure = 3;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

const rendererFolder = gui.addFolder('Renderer');

rendererFolder
    .add(renderer, 'toneMapping', {
        No: THREE.NoToneMapping,
        Linear: THREE.LinearToneMapping,
        Reinhard: THREE.ReinhardToneMapping,
        Cineon: THREE.CineonToneMapping,
        ACESFilmic: THREE.ACESFilmicToneMapping,
    })
    .onFinishChange((value) => {
        renderer.toneMapping = parseInt(value);
        updateAllMaterials();
    });

rendererFolder.add(renderer, 'toneMappingExposure').min(0).max(10).step(0.001);

/**
 * Animate
 */
const tick = () => {
    // Update controls
    controls.update();

    // Render
    renderer.render(scene, camera);

    // Call tick again on the next frame
    window.requestAnimationFrame(tick);
};

tick();
