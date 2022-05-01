import { Texture, TextureLoader } from 'three';

export type LoadTextureResult = {
    key: string;
    path: string;
    texture?: Texture;
};

type IProps = {
    tasks: { key: string, path: string }[];
    onLoad: (result: LoadTextureResult) => void;
};

const useTextureLoader = ({ tasks, onLoad }: IProps) => {
    const loader = new TextureLoader();

    const load = () => {
        tasks.forEach(({ key, path }) => {
            loader.load(
                path,
                (texture) => {
                    onLoad({ key, path, texture });
                },
                undefined,
                () => {
                    console.error(`Error while loading texture of ${key} (${path}).`);
                    onLoad({ key, path });
                }
            );
        })
    }

    return { load };
}

export { useTextureLoader };