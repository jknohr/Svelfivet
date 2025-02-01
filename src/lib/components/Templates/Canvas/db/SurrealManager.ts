import { Surreal } from 'surrealdb.js';
import type { DbConfig } from './types';
import { DEFAULT_CONFIG } from './types';

export class SurrealManager {
	private static instance: Surreal | undefined;

	static async connect(config: DbConfig = DEFAULT_CONFIG): Promise<Surreal> {
		if (!this.instance) {
			this.instance = new Surreal();
			await this.instance.connect(config.url);
			await this.instance.use({
				namespace: config.namespace,
				database: config.database
			});
		}
		return this.instance;
	}

	static async transaction<T>(callback: (db: Surreal) => Promise<T>): Promise<T> {
		const db = await this.connect();
		await db.query('BEGIN TRANSACTION');
		try {
			const result = await callback(db);
			await db.query('COMMIT TRANSACTION');
			return result;
		} catch (error) {
			await db.query('CANCEL TRANSACTION');
			throw error;
		}
	}

	static async query<T>(query: string, vars?: Record<string, unknown>): Promise<T[][]> {
		const db = await this.connect();
		return db.query<T[]>(query, vars);
	}
}
