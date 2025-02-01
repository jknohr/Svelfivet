import type { Node, GroupKey, GroupBox, NodeKey } from '../types/logic';
import type { GroupStore } from '../types/stores';
import { ReactiveMapStateImpl } from './base';

export class GroupStoreImpl extends ReactiveMapStateImpl<GroupKey, GroupBox> implements GroupStore {
    private nodeGroups = $state(new Map<GroupKey, Set<NodeKey>>());

    add(key: GroupKey, value: GroupBox) {
        this.setItem(key, value);
        this.nodeGroups.set(key, new Set());
    }

    remove(key: GroupKey) {
        this.deleteItem(key);
        this.nodeGroups.delete(key);
    }

    get(key: GroupKey) {
        return this.getItem(key);
    }

    getAll() {
        return this.getAllItems();
    }

    clear() {
        this.clearItems();
        this.nodeGroups.clear();
    }

    addNode(groupKey: GroupKey, node: Node) {
        const nodes = this.nodeGroups.get(groupKey) ?? new Set();
        if (node.id) {
            nodes.add(node.id);
            this.nodeGroups.set(groupKey, nodes);
        }
    }

    removeNode(groupKey: GroupKey, node: Node) {
        const nodes = this.nodeGroups.get(groupKey);
        if (nodes && node.id) {
            nodes.delete(node.id);
            this.nodeGroups.set(groupKey, nodes);
        }
    }
} 