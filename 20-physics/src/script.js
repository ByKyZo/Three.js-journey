import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import * as dat from 'dat.gui';
import CANNON from 'cannon';
import { Vector3 } from 'three';

/**
 * Sounds
 */
// prettier-ignore
const hitSound = new Audio('/sounds/hit.mp3');

// const normalize = (val, max, min) => {
//     return (val - min) / (max - min);
//     // var delta = max - min;
//     // return (val - min) / delta;
// };

const playHitSound = (e) => {
    const impactStrength = e.contact.getImpactVelocityAlongNormal();

    if (impactStrength > 1.5) {
        hitSound.volume = Math.min(impactStrength * 0.1, 1);
        hitSound.currentTime = 0;
        hitSound.play();
    }
};

/**
 * Debug
 */
const gui = new dat.GUI();
const debugObjects = {
    createSphere: () => {
        createSphere(Math.random(), {
            x: (Math.random() - 0.5) * 4,
            y: (Math.random() - 0.5) * 2 + 3,
            z: (Math.random() - 0.5) * 4,
        });
    },
    createBox: () => {
        createBox(Math.random(), Math.random(), Math.random(), {
            x: (Math.random() - 0.5) * 4,
            y: (Math.random() - 0.5) * 2 + 3,
            z: (Math.random() - 0.5) * 4,
        });
    },
    reset: () => {
        objectsToUpdate.forEach((object) => {
            scene.remove(object.mesh);
            object.body.removeEventListener('collide', playHitSound);
            world.remove(object.body);
        });
    },
};

gui.add(debugObjects, 'createSphere');
gui.add(debugObjects, 'createBox');
gui.add(debugObjects, 'reset');

/**
 * Base
 */
// Canvas
const canvas = document.querySelector('canvas.webgl');

// Scene
const scene = new THREE.Scene();

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader();
const cubeTextureLoader = new THREE.CubeTextureLoader();

const environmentMapTexture = cubeTextureLoader.load([
    '/textures/environmentMaps/0/px.png',
    '/textures/environmentMaps/0/nx.png',
    '/textures/environmentMaps/0/py.png',
    '/textures/environmentMaps/0/ny.png',
    '/textures/environmentMaps/0/pz.png',
    '/textures/environmentMaps/0/nz.png',
]);

/**
 * Physics
 */
// World
const world = new CANNON.World();
world.gravity.set(0, -9.82, 0);

// Material

const defaultMaterial = new CANNON.Material('default');
const defaultContactMaterial = new CANNON.ContactMaterial(defaultMaterial, defaultMaterial, {
    friction: 0.1,
    restitution: 0.7,
});
world.defaultContactMaterial = defaultContactMaterial;
world.broadphase = new CANNON.SAPBroadphase(world);
world.allowSleep = true;

// Floor
const floorShape = new CANNON.Plane();
const floorBody = new CANNON.Body({
    mass: 0,
    shape: floorShape,
});
floorBody.quaternion.setFromAxisAngle(new CANNON.Vec3(-1, 0, 0), Math.PI * 0.5);
world.addBody(floorBody);

// sphereBody.

/**
 * Floor
 */
const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(10, 10),
    new THREE.MeshStandardMaterial({
        color: '#777777',
        metalness: 0.3,
        roughness: 0.4,
        envMap: environmentMapTexture,
    })
);
floor.receiveShadow = true;
floor.rotation.x = -Math.PI * 0.5;
scene.add(floor);

/**
 * Lights
 */
const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0xffffff, 0.2);
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.set(1024, 1024);
directionalLight.shadow.camera.far = 15;
directionalLight.shadow.camera.left = -7;
directionalLight.shadow.camera.top = 7;
directionalLight.shadow.camera.right = 7;
directionalLight.shadow.camera.bottom = -7;
directionalLight.position.set(5, 5, 5);
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
camera.position.set(-3, 3, 3);
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
    canvas: canvas,
});
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Utils
 */
const objectsToUpdate = [];

const sphereGeo = new THREE.SphereGeometry(1, 20, 20);
const sphereMaterial = new THREE.MeshStandardMaterial({
    metalness: 0.3,
    roughness: 0.4,
    envMap: environmentMapTexture,
});

const createSphere = (radius, position) => {
    // Three.js Mesh
    const sphereMesh = new THREE.Mesh(sphereGeo, sphereMaterial);
    sphereMesh.scale.set(radius, radius, radius);
    sphereMesh.castShadow = true;
    sphereMesh.position.copy(position);
    scene.add(sphereMesh);

    // Cannon.js Body
    const sphereBody = new CANNON.Body({
        mass: 1,
        shape: new CANNON.Sphere(radius),
        material: defaultMaterial,
    });
    sphereBody.position.copy(position);
    world.addBody(sphereBody);
    sphereBody.addEventListener('collide', playHitSound);

    // Push objects
    objectsToUpdate.push({
        mesh: sphereMesh,
        body: sphereBody,
    });
};

// createSphere(1, { x: 0, y: 3, z: 0 });

const boxGeo = new THREE.BoxGeometry(1, 1, 1);
const boxMaterial = new THREE.MeshStandardMaterial({
    metalness: 0.3,
    roughness: 0.4,
    envMap: environmentMapTexture,
});

const createBox = (x, y, z, position) => {
    const boxMesh = new THREE.Mesh(boxGeo, boxMaterial);
    boxMesh.scale.set(x, y, z);
    boxMesh.castShadow = true;
    boxMesh.position.copy(position);
    scene.add(boxMesh);

    const boxBody = new CANNON.Body({
        mass: 10,
        shape: new CANNON.Box(new CANNON.Vec3(x / 2, y / 2, z / 2)),
    });
    boxBody.position.copy(position);
    world.addBody(boxBody);
    boxBody.addEventListener('collide', playHitSound);

    objectsToUpdate.push({
        mesh: boxMesh,
        body: boxBody,
    });
};

/**
 * Animate
 */
const clock = new THREE.Clock();
let oldElapsedTime = 0;

const tick = () => {
    const elapsedTime = clock.getElapsedTime();
    const deltaTime = elapsedTime - oldElapsedTime;
    oldElapsedTime = elapsedTime;

    // Update physics world
    world.step(1 / 144, deltaTime, 3);

    objectsToUpdate.forEach((object) => {
        object.mesh.position.copy(object.body.position);
        object.mesh.quaternion.copy(object.body.quaternion);
    });

    // Update controls
    controls.update();

    // Render
    renderer.render(scene, camera);

    // Call tick again on the next frame
    window.requestAnimationFrame(tick);
};

tick();
