import { AssetInventory, LoadEvent } from '../src';

//const app = document.querySelector<HTMLDivElement>('#app')!
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