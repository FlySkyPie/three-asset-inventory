import PromisePool from '@supercharge/promise-pool';

import { useTextureLoader } from './loader';
import { TextureInventory } from './inventory/TextureInventory';

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

    private texture: TextureInventory = new TextureInventory();
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
        if (this.isLoading) {
            console.error('The inventory is busy.');
            return;
        }
        return {
            texture: this.texture.addTask,
        }
    }

    public get resource() {
        return {
            getTexture: this.texture.getAsset,
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

    private startLoad = async () => {
        if (this.isLoading) {
            return;
        }

        this.isLoading = true;

        const textureTasks = this.texture.getTasks();

        const tasks = [...textureTasks];
        const total = tasks.length;

        const { loadTexture } = useTextureLoader();

        await PromisePool
            .for(tasks)
            .onTaskFinished((item, pool) => {
                this.onProgressHanders.forEach((callback) => callback({
                    key: item.key, path: item.path, total, progress: pool.processedCount(),
                }))

                if (pool.processedPercentage() === 100) {
                    this.isLoading = false;
                    this.onCompelteHanders.forEach(callback => callback());
                }
            })
            .process(async (task) => {
                if (task.type === 'texture') {
                    const result = await loadTexture(task.path);
                    if (result !== undefined) {
                        this.texture.addAsset(task.key, result);
                    } else {
                        console.error(`Error while loading texture of ${task.key} (${task.path}).`);
                    }
                }
            })
    }
}

export { AssetInventory };