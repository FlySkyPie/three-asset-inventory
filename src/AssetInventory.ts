import { Texture } from 'three';

import { useTextureLoader, LoadTextureResult } from './loader';
import { getDefaultTexture } from './untils';

export type LoadEvent = {
    key: string;
    path: string;
    total: number;
    progress: number;
}

type OnProgressHandler = (e: LoadEvent) => void;
type OnCompleteedHandler = () => void;

type EventName = 'progress' | 'complete';

class AssetInventory {
    isLoading: boolean = false;
    private textures: Map<string, Texture> = new Map();
    private textureTasks: Map<string, string> = new Map();
    private onProgressHanders: OnProgressHandler[] = [];
    private onCompelteHanders: OnCompleteedHandler[] = [];

    private addEventListener = (name: EventName, callback: (arg?: any) => void) => {
        if (name === 'progress') {
            this.onProgressHanders.push(callback);
            return;
        }
        if (name === 'complete') {
            this.onCompelteHanders.push(callback);
            return
        }
        throw new Error(`Unexpected event type: ${name}.`);
    }

    /**
     * Add asstes.
     */
    public get add() {
        return {
            texture: this.addTexture,
        }
    }

    private addTexture = (key: string, path: string) => {
        if (this.isLoading) {
            console.error('The inventory is busy.');
            return;
        }
        if (this.textureTasks.has(key)) {
            console.warn('The key of resource already in the queue.');
            return;
        }
        if (this.textures.has(key)) {
            console.warn('The key of resource already been load.');
            return;
        }
        this.textureTasks.set(key, path);
    }

    private getTexture = (key: string) => {
        const texture = this.textures.get(key);
        if (texture !== undefined) {
            return texture;
        }
        return getDefaultTexture();
    }

    public get resource() {
        return {
            getTexture: this.getTexture,
        }
    }

    /**
    * Load asstes.
    */
    public get load() {
        return {
            on: this.addEventListener,
            start: this.startLoad,
        }
    }

    private startLoad = () => {
        this.isLoading = true;
        const countRef = { value: 0 };

        const textureTasks =
            Array.from(this.textureTasks.entries())
                .map(([key, path]) => ({ key, path }));

        const total = textureTasks.length;

        const handlecomplete = () => {
            if (countRef.value === total) {
                this.isLoading = false;
                this.onCompelteHanders.forEach(callback => callback());
            }
        }

        const handleLoadTexture = (result: LoadTextureResult) => {
            this.textureTasks.delete(result.key);
            countRef.value++;

            if (result.texture === undefined) {
                handlecomplete();
                return;
            }
            const { key, path, texture } = result;
            this.textures.set(key, texture);

            this.onProgressHanders.forEach((callback) => callback({
                key, path, total, progress: countRef.value,
            }))

            handlecomplete();
        }

        const { load: loadTexutres } = useTextureLoader({
            tasks: textureTasks,
            onLoad: handleLoadTexture,
        });


        loadTexutres();
    }
}

export { AssetInventory };