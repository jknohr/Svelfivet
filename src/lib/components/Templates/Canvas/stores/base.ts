import type { ReactiveState, ReactiveMapState } from '../types/stores';

// Base reactive state using runes
export class ReactiveStateImpl<T> implements ReactiveState<T> {
    protected _value = $state<T | null>(null);
    
    constructor(initialValue: T) {
        this._value = initialValue;
    }

    get value(): T {
        if (this._value === null) {
            throw new Error('Store value is not initialized');
        }
        return this._value;
    }

    set(newValue: T) {
        this._value = newValue;
    }

    update(fn: (value: T) => T) {
        this.set(fn(this.value));
    }
}

// Map-based reactive state using runes
export class ReactiveMapStateImpl<K, V> implements ReactiveMapState<K, V> {
    items = $state(new Map<K, V>());
    
    constructor(initialItems?: Map<K, V>) {
        if (initialItems) {
            this.items = initialItems;
        }
    }

    get size() {
        return $derived(this.items.size);
    }

    setItem(key: K, value: V) {
        this.items.set(key, value);
    }

    deleteItem(key: K) {
        this.items.delete(key);
    }

    getItem(key: K) {
        return this.items.get(key);
    }

    getAllItems() {
        return Array.from(this.items.values());
    }

    clearItems() {
        this.items.clear();
    }
} 