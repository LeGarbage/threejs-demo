import * as THREE from 'three';

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);

const renderer = new THREE.WebGLRenderer();
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setAnimationLoop(animate);
document.body.appendChild(renderer.domElement);

const geometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00, map: createTextTexture("fish") });
const cube = new THREE.Mesh(geometry, material);
scene.add(cube);

camera.position.z = 5;

const maxZoom = 50;
const minZoom = 2;
let zoomAcceleration = 1;
let zoomVelocity = 0;

window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();

    renderer.setSize(window.innerWidth, window.innerHeight);
})

renderer.domElement.addEventListener("wheel", (event) => {
    zoomVelocity -= event.wheelDelta / 20;
});

let dragging = false;
renderer.domElement.addEventListener("mousedown", (_) => {
    dragging = true;
});
renderer.domElement.addEventListener("mouseup", (_) => {
    dragging = false;
});
renderer.domElement.addEventListener("mousemove", (event) => {
    if (dragging) {
        camera.position.x -= event.movementX / 20;
        camera.position.y -= event.movementY / 20;
        console.log(camera.position);
    }
});


function animate() {
    cube.rotation.x += 0.01;
    cube.rotation.y += 0.01;

    zoomVelocity += Math.min(Math.abs(zoomVelocity), zoomAcceleration) * -Math.sign(zoomVelocity);

    camera.position.z += (zoomVelocity / maxZoom) * camera.position.z;
    camera.position.z = Math.min(maxZoom, Math.max(minZoom, camera.position.z));

    renderer.render(scene, camera);
}

function createTextTexture(text) {
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    canvas.width = 256;
    canvas.height = 256;

    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "black";
    ctx.font = '100px "Comic Sans MS"';
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(text, canvas.width / 2, canvas.height / 2);

    return new THREE.CanvasTexture(canvas);
}
