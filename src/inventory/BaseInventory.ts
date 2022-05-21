abstract class BaseInventory<T> {
    private items: Map<string, T> = new Map();
    private tasks: Map<string, string> = new Map();
    private getDefault: () => T;

    constructor(getDefault: () => T) {
        this.getDefault = getDefault;
    }

    public addTask = (key: string, path: string) => {
        if (this.tasks.has(key)) {
            console.warn('The key of resource already in the queue.');
            return;
        }
        if (this.items.has(key)) {
            console.warn('The key of resource already been load.');
            return;
        }
        this.tasks.set(key, path);
    }

    public getTasks() {
        return Array.from(this.tasks.entries())
            .map(([key, path]) => ({ key, path }));
    }


    public addAsset = (key: string, asset: T) => {
        this.tasks.delete(key);
        this.items.set(key, asset);
    }

    public getAsset = (key: string) => {
        const texture = this.items.get(key);
        if (texture !== undefined) {
            return texture;
        }
        return this.getDefault();
    }
}

export { BaseInventory };