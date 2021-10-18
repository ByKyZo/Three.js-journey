import './style.css';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import * as dat from 'dat.gui';
import tst from 'three/examples/fonts/helvetiker_regular.typeface.json';

/**
 * Base
 */
// Debug
const gui = new dat.GUI();

// Canvas
const canvas = document.querySelector('canvas.webgl');

// Scene
const scene = new THREE.Scene();

// Fog
const fog = new THREE.Fog('#262837', 1, 15);
scene.fog = fog;

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader().setPath('/textures/');

// Brick texture
const brickColorTexture = textureLoader.load('bricks/color.jpg');
const brickAoTexture = textureLoader.load('bricks/ambientOcclusion.jpg');
const brickNormalTexture = textureLoader.load('bricks/normal.jpg');
const brickRoughnessTexture = textureLoader.load('bricks/roughness.jpg');

// Door texture
const doorColorTexture = textureLoader.load('/door/color.jpg');
const doorAlphaTexture = textureLoader.load('/door/alpha.jpg');
const doorAmbientOcclusionTexture = textureLoader.load('/door/ambientOcclusion.jpg');
const doorHeightTexture = textureLoader.load('/door/height.jpg');
const doorNormalTexture = textureLoader.load('/door/normal.jpg');
const doorMetalnessTexture = textureLoader.load('/door/metalness.jpg');
const doorRoughnessTexture = textureLoader.load('/door/roughness.jpg');

// Grass texture
const grassColorTexture = textureLoader.load('grass/color.jpg');
const grassAmbientOcclusionTexture = textureLoader.load('grass/ambientOcclusion.jpg');
const grassNormalTexture = textureLoader.load('grass/normal.jpg');
const grassRoughnessTexture = textureLoader.load('grass/roughness.jpg');

const textureRepeat = 16;

grassColorTexture.repeat.set(textureRepeat, textureRepeat);
grassAmbientOcclusionTexture.repeat.set(textureRepeat, textureRepeat);
grassNormalTexture.repeat.set(textureRepeat, textureRepeat);
grassRoughnessTexture.repeat.set(textureRepeat, textureRepeat);

grassColorTexture.wrapS = THREE.RepeatWrapping;
grassAmbientOcclusionTexture.wrapS = THREE.RepeatWrapping;
grassNormalTexture.wrapS = THREE.RepeatWrapping;
grassRoughnessTexture.wrapS = THREE.RepeatWrapping;

grassColorTexture.wrapT = THREE.RepeatWrapping;
grassAmbientOcclusionTexture.wrapT = THREE.RepeatWrapping;
grassNormalTexture.wrapT = THREE.RepeatWrapping;
grassRoughnessTexture.wrapT = THREE.RepeatWrapping;

/**
 * House
 */

const house = new THREE.Group();

// Walls
const wall = new THREE.Mesh(
    new THREE.BoxGeometry(4, 3, 4),
    new THREE.MeshStandardMaterial({
        map: brickColorTexture,
        aoMap: brickAoTexture,
        aoMapIntensity: 3,
        normalMap: brickNormalTexture,
        roughnessMap: brickRoughnessTexture,
    })
);

wall.geometry.setAttribute('uv2', wall.geometry.attributes.uv);

wall.position.y = wall.geometry.parameters.height / 2;

// Roof
const roof = new THREE.Mesh(
    new THREE.ConeGeometry(3.5, 1, 4),
    new THREE.MeshStandardMaterial({ map: brickColorTexture, aoMap: brickAoTexture })
);
roof.position.y = wall.geometry.parameters.height + roof.geometry.parameters.height / 2;
roof.rotation.y = Math.PI * 0.25;

// Door
const door = new THREE.Mesh(
    new THREE.PlaneGeometry(2, 2, 64, 64),
    new THREE.MeshStandardMaterial({
        map: doorColorTexture,
        transparent: true,
        alphaMap: doorAlphaTexture,
        aoMap: doorAmbientOcclusionTexture,
        aoMapIntensity: 5,
        metalnessMap: doorMetalnessTexture,
        roughnessMap: doorRoughnessTexture,
        normalMap: doorNormalTexture,
        displacementMap: doorHeightTexture,
        displacementScale: 0.1,
        // wireframe: true,
    })
);

// door.geometry.setAttribute(
//     'uv2',
//     new THREE.Float16BufferAttribute(door.geometry.attributes.uv.array, 2)
// );
door.geometry.setAttribute('uv2', door.geometry.attributes.uv);

wall.geometry.computeBoundingBox();
const wallBounds = wall.geometry.boundingBox;
door.position.y = house.position.y + door.geometry.parameters.height / 2 - 0.1;
door.position.z = wallBounds.max.z + 0.01;

// Bushes
const bushGeometry = new THREE.SphereGeometry(1, 16, 16);
const bushMaterial = new THREE.MeshStandardMaterial({ color: '#89c854' });

const bush1 = new THREE.Mesh(bushGeometry, bushMaterial);
bush1.scale.set(0.5, 0.5, 0.5);
bush1.position.set(0.8, 0.2, 2.2);

const bush2 = new THREE.Mesh(bushGeometry, bushMaterial);
bush2.scale.set(0.25, 0.25, 0.25);
bush2.position.set(1.4, 0.1, 2.1);

const bush3 = new THREE.Mesh(bushGeometry, bushMaterial);
bush3.scale.set(0.4, 0.4, 0.4);
bush3.position.set(-0.8, 0.1, 2.2);

const bush4 = new THREE.Mesh(bushGeometry, bushMaterial);
bush4.scale.set(0.15, 0.15, 0.15);
bush4.position.set(-1, 0.05, 2.6);

house.add(bush1, bush2, bush3, bush4);

// Graves
const graves = new THREE.Group();

const graveGeometry = new THREE.BoxGeometry(0.6, 0.8, 0.2);
const graveMaterial = new THREE.MeshStandardMaterial({ color: '#b2b6b1' });

const loader = new THREE.FontLoader();

loader.load('fonts/helvetiker_regular.typeface.json', function (font) {
    const textGeometry = new THREE.TextGeometry('R.I.P', {
        font: font,
        size: 0.1,
        height: 0.04,
    });
    const textMaterial = new THREE.MeshStandardMaterial();

    for (let i = 0; i < 50; i++) {
        const grave = new THREE.Mesh(graveGeometry, graveMaterial);
        grave.castShadow = true;

        const textName = new THREE.Mesh(textGeometry, textMaterial);
        textName.castShadow = true;

        const radius = 4 + Math.random() * 6;
        const angle = Math.random() * Math.PI * 2;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;
        const y = (grave.geometry.parameters.height / 2) * 0.8;
        const rotateY = (Math.random() - 0.5) * 0.4;
        const rotateX = (Math.random() - 0.5) * 0.4;
        // textName.set(x)
        textGeometry.computeBoundingBox();
        const textGeometryBounds = textGeometry.boundingBox;

        textName.position.set(x - textGeometryBounds.max.x / 2, y + 0.1, z + 0.09);
        textName.rotation.y = rotateY;
        textName.rotation.z = rotateX;

        grave.position.set(x, y, z);
        grave.rotation.y = rotateY;
        grave.rotation.z = rotateX;
        graves.add(grave);
        scene.add(textName);
    }
});

scene.add(graves);

// Add to scene
house.add(wall, roof, door);
scene.add(house);

// Floor
const floor = new THREE.Mesh(
    new THREE.PlaneGeometry(20, 20),
    new THREE.MeshStandardMaterial({
        map: grassColorTexture,
        aoMap: grassAmbientOcclusionTexture,
        normalMap: grassNormalTexture,
        roughnessMap: grassRoughnessTexture,
    })
);

floor.receiveShadow = true;
floor.geometry.setAttribute('uv2', floor.geometry.attributes.uv);

floor.rotation.x = -Math.PI * 0.5;
floor.position.y = 0;
scene.add(floor);

/**
 * Lights
 */
// Ambient light
const ambientLight = new THREE.AmbientLight('#b9d5ff', 0.12);
gui.add(ambientLight, 'intensity').min(0).max(1).step(0.001);
scene.add(ambientLight);

// Directional light
const moonLight = new THREE.DirectionalLight('#b9d5ff', 0.12);
moonLight.position.set(4, 5, -2);
gui.add(moonLight, 'intensity').min(0).max(1).step(0.001);
gui.add(moonLight.position, 'x').min(-5).max(5).step(0.001);
gui.add(moonLight.position, 'y').min(-5).max(5).step(0.001);
gui.add(moonLight.position, 'z').min(-5).max(5).step(0.001);
scene.add(moonLight);

// Door light
const doorLight = new THREE.PointLight('#ff7d46', 1, 7);
doorLight.position.z = door.position.y + 2;
doorLight.position.y = door.geometry.parameters.height + 0.2;
doorLight.position.set(0, 2.2, 2.7);
house.add(doorLight);

/**
 * Ghosts
 */
const ghost1 = new THREE.PointLight('#ff00ff', 2, 3);
scene.add(ghost1);

const ghost2 = new THREE.PointLight('#00ffff', 2, 3);
ghost2.position.z = 6;

scene.add(ghost2);

const ghost3 = new THREE.PointLight('#ffff00', 2, 3);
ghost3.position.z = 8;

scene.add(ghost3);

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
camera.position.x = 4;
camera.position.y = 2;
camera.position.z = 5;
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
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.setClearColor('#262837');

/**
 * Shadows
 */
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

moonLight.castShadow = true;
moonLight.shadow.mapSize.set(256, 256);
moonLight.shadow.camera.far = 15;

doorLight.castShadow = true;
doorLight.shadow.mapSize.set(256, 256);
doorLight.shadow.camera.far = 7;

ghost1.castShadow = true;
ghost1.shadow.mapSize.set(256, 256);

ghost1.shadow.camera.far = 7;

ghost2.castShadow = true;
ghost2.shadow.mapSize.set(256, 256);
ghost2.shadow.camera.far = 7;

ghost3.castShadow = true;
ghost3.shadow.mapSize.set(256, 256);
ghost3.shadow.camera.far = 7;

wall.castShadow = true;
bush1.castShadow = true;
bush2.castShadow = true;
bush3.castShadow = true;
bush4.castShadow = true;

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
    const elapsedTime = clock.getElapsedTime();

    const angle = Math.PI * 2;

    const ghost1Angle = elapsedTime * 0.5;

    ghost1.position.x = Math.cos(ghost1Angle) * 4;
    ghost1.position.z = Math.sin(ghost1Angle) * 4;
    ghost1.position.y = Math.sin(elapsedTime * 3);

    const ghost2Angle = -elapsedTime * 0.3;

    ghost2.position.x = Math.cos(ghost2Angle) * 6;
    ghost2.position.z = Math.sin(ghost2Angle) * 6;
    ghost2.position.y = Math.sin(elapsedTime * 4) + Math.sin(elapsedTime * 2.5);

    const ghost3Angle = -elapsedTime * 0.15;

    ghost3.position.x = Math.cos(ghost3Angle) * (7 + Math.sin(ghost3Angle) * 0.32);
    ghost3.position.z = Math.sin(ghost3Angle) * (7 + Math.cos(ghost3Angle) * 0.5);
    ghost3.position.y = Math.sin(elapsedTime * 4) + Math.sin(elapsedTime * 2.5);

    // Update controls
    controls.update();

    // Render
    renderer.render(scene, camera);

    // Call tick again on the next frame
    window.requestAnimationFrame(tick);
};

tick();
