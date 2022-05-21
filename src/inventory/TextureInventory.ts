import { Texture } from 'three';

import { getDefaultTexture } from './untils';
import { BaseInventory } from './BaseInventory';


class TextureInventory extends BaseInventory<Texture> {

    constructor() {
        super(getDefaultTexture);
    }

    override  getTasks() {
        return super.getTasks().map(item => ({ ...item, type: 'texture' as 'texture' }));
    }

}

export { TextureInventory };