import { PCDLoader } from 'three/addons/loaders/PCDLoader.js';
import { pcdGroup } from './Resources.js';

const loader = new PCDLoader();

function load_pcd_from_file(file) {
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
        const url = URL.createObjectURL(file);
        load_pcd_from_url(url);
    };
    reader.readAsArrayBuffer(file);
}

function load_pcd_from_url(url) {
    loader.load(url, (points) => {
        pcdGroup.clear();
        points.material.size = 0.05;
        pcdGroup.add(points);
        URL.revokeObjectURL(url);
    }, 
    (xhr) => {
        console.log((xhr.loaded / xhr.total * 100) + '% loaded');
    }, 
    (error) => {
        console.error('An error happened', error);
    });
}

const pcd_input_element = document.querySelector('#pcd_input');
if (pcd_input_element) {
    pcd_input_element.addEventListener('change', (event) => {
        const file = event.target.files[0];
        load_pcd_from_file(file);
    });
}

export { load_pcd_from_file, load_pcd_from_url };