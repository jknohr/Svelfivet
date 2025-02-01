import type { Anchor, AnchorKey } from '../types/logic';
import type { AnchorStore } from '../types/stores';
import { ReactiveMapStateImpl } from './base';

export class AnchorStoreImpl extends ReactiveMapStateImpl<AnchorKey, Anchor> implements AnchorStore {
    add(key: AnchorKey, value: Anchor) {
        this.setItem(key, value);
    }

    remove(key: AnchorKey) {
        this.deleteItem(key);
    }

    get(key: AnchorKey) {
        return this.getItem(key);
    }

    getAll() {
        return this.getAllItems();
    }

    clear() {
        this.clearItems();
    }
} 