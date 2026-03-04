import * as THREE from 'three';

export const scene = new THREE.Scene();
export const pcdGroup = new THREE.Group();
export const polygonGroup = new THREE.Group();

scene.add(pcdGroup);
scene.add(new THREE.AxesHelper(5));
pcdGroup.rotation.x = -Math.PI / 2;
scene.add(polygonGroup);