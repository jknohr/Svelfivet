import type { DbConfig, Surreal } from "./types";
import { DEFAULT_CONFIG } from "./types";
import { SurrealManager } from "./SurrealManager";

export async function getDb(
  config: DbConfig = DEFAULT_CONFIG
): Promise<Surreal> {
  return SurrealManager.connect(config);
}

export async function query<T>(
  query: string,
  vars?: Record<string, unknown>
): Promise<T[]> {
  const result = await SurrealManager.query<T>(query, vars);
  return result.flat();
}

export async function transaction<T>(
  callback: (db: Surreal) => Promise<T>
): Promise<T> {
  return SurrealManager.transaction(callback);
}
