import { Texture, TextureLoader } from 'three';

export const useTextureLoader = () => {
    const loader = new TextureLoader();

    const loadTexture = (path: string) => new Promise<Texture | undefined>((resolve) => {
        loader.load(
            path,
            (texture) => resolve(texture),
            undefined,
            () => resolve(undefined)
        );
    })

    return { loadTexture };
}