const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(80, window.innerWidth / window.innerHeight, 1, 1000 );

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth,window.innerHeight);
document.body.appendChild(renderer.domElement);

const geometry = new THREE.BoxGeometry(1,1,1);
const material = new THREE.MeshBasicMaterial({
    color : 'red'
});

const mesh = new THREE.Mesh(geometry , material);

camera.position.z = 4
camera.position.x = 2

scene.add(camera,mesh)

renderer.render(scene , camera)
