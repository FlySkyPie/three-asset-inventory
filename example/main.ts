import {
    Scene, PerspectiveCamera, WebGLRenderer,
    BoxGeometry, MeshBasicMaterial, Mesh
} from 'three';

import { AssetInventory, LoadEvent } from '../src';

const progressElement = document.querySelector<HTMLDivElement>('.progress')!;
const h2 = document.querySelector('h2')!;

const inventory = new AssetInventory();

Array.from({ length: 100 }, (_, i) => i).forEach((i) => {
    inventory.add.texture(`cube-texture-${i}`, `https://loremflickr.com/320/240/${i}`);
})

inventory.load.on('progress', ({ progress, total }: LoadEvent) => {
    const persentage = (progress / total * 100).toFixed(2);
    h2.innerHTML = persentage + '%';
    progressElement.style.width = persentage + '%';
})

inventory.load.start();


inventory.load.on('complete', () => {
    const app = document.querySelector<HTMLDivElement>('#app')!
    const resource = inventory.resource;
    const scene = new Scene();
    const camera = new PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new WebGLRenderer();
    
    renderer.setSize(window.innerWidth, window.innerHeight);
    app.appendChild(renderer.domElement);

    camera.position.z = 5;

    const geometry = new BoxGeometry();
    const material = new MeshBasicMaterial({ map: resource.getTexture('cube-texture-1') });
    const cube = new Mesh(geometry, material);
    cube.translateX(1);

    const material2 = new MeshBasicMaterial({ map: resource.getTexture('not exist') });
    const cube2 = new Mesh(geometry, material2);
    cube2.translateX(-1);

    scene.add(cube);
    scene.add(cube2);

    const animate = () => {
        requestAnimationFrame(animate);

        cube.rotation.x += 0.01;
        cube.rotation.y += 0.01;
        
        cube2.rotation.x += 0.01;
        cube2.rotation.y += 0.01;

        renderer.render(scene, camera);
    };

    animate();
})



