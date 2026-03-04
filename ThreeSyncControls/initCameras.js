import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { scene } from './Resources.js';

const frustum = 20;
const fov = 120;
const renderers = [], cameras = [], controls = [];
const views = ['v1', 'v2', 'v3', 'v4'];

views.forEach((view, i) => {
    let camera, control;
    const container = document.querySelector(`#${view}`);
    const w = container.clientWidth;
    const h = container.clientHeight;
    const aspect = w / h;
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    
    renderer.setSize(w, h);
    container.appendChild(renderer.domElement);
    renderers.push(renderer);

    if (i === 0) { 
        camera = new THREE.PerspectiveCamera(fov, aspect, 0.1, 10000);
        camera.position.set(0, 10, 0);
        control = new OrbitControls(camera, renderer.domElement);
        control.enablePan = false;
    } else {
        camera = new THREE.OrthographicCamera(
            -frustum * aspect / 2, frustum * aspect / 2,
            frustum / 2, -frustum / 2, 
            0.1, 10000
        );
        if (i === 1) camera.position.set(0, 10, 0);
        if (i === 2) camera.position.set(0, 0, 10);
        if (i === 3) camera.position.set(10, 0, 0);
        
        control = new OrbitControls(camera, renderer.domElement);
        control.enableRotate = false;
        control.screenSpacePanning = true;
    }
    camera.lookAt(0, 0, 0);
    cameras.push(camera);
    controls.push(control);
});

export function updateResize() {
    views.forEach((view, i) => {
        const container = document.querySelector(`#${view}`);
        const w = container.clientWidth;
        const h = container.clientHeight;
        const aspect = w / h;
        renderers[i].setSize(w, h);
        const camera = cameras[i];
        if (camera.isPerspectiveCamera) {
            camera.aspect = aspect;
        } else {
            camera.left = -frustum * aspect / 2;
            camera.right = frustum * aspect / 2;
            camera.top = frustum / 2;
            camera.bottom = -frustum / 2;
        }
        camera.updateProjectionMatrix();
    });
}

export function renderCamera() {
    renderers.forEach((renderer, i) => {
        renderer.render(scene, cameras[i]);
    });
}

export { views, renderers, cameras, controls };