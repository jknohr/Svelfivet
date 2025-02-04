// Simple namespace management for SurrealDB
let userNamespaces = $state(new Set<string>());

// Register a user's namespace in SurrealDB
export function registerSurrealNamespace(userId: string): void {
    if (!userNamespaces.has(userId)) {
        userNamespaces.add(userId);
    }
}

// Check if a user's namespace exists in SurrealDB
export function hasSurrealNamespace(userId: string): boolean {
    return userNamespaces.has(userId);
}

// Remove a user's namespace from SurrealDB
export function removeSurrealNamespace(userId: string): void {
    userNamespaces.delete(userId);
}

// Get all registered user namespaces
export function getAllSurrealNamespaces(): string[] {
    return Array.from(userNamespaces);
}
