<script lang="ts">
    import { onMount } from 'svelte';
    import { state, updateState } from './callsidehelper';
    import Surreal from 'surrealdb.js';
    
    let surrealDBClient: Surreal;
    let currentState = $state;

    onMount(() => {
        initializeSurrealDB();
        return cleanup;
    });

    function cleanup() {
        surrealDBClient?.close();
    }

    async function initializeSurrealDB() {
        try {
            surrealDBClient = new Surreal();
            await surrealDBClient.signin({
                username: currentState.settings.surrealDbUser,
                password: currentState.settings.surrealDbPass,
                namespace: 'test',
                database: 'test',
                scope: 'user_scope'
            });
            console.log('SurrealDB initialized.');
        } catch (error) {
            updateState({ error: error instanceof Error ? error.message : 'Failed to initialize SurrealDB' });
        }
    }

    async function fetchSurrealDBData() {
        try {
            const result = await surrealDBClient.query('SELECT * FROM your_table');
            console.log('Fetched data from SurrealDB:', result);
        } catch (error) {
            updateState({ error: error instanceof Error ? error.message : 'Failed to fetch data from SurrealDB' });
        }
    }

    async function insertSurrealDBData(data: Record<string, unknown>) {
        try {
            const result = await surrealDBClient.query('INSERT INTO your_table SET ?', data);
            console.log('Inserted data into SurrealDB:', result);
        } catch (error) {
            updateState({ error: error instanceof Error ? error.message : 'Failed to insert data into SurrealDB' });
        }
    }

    async function saveStateToSurrealDB() {
        try {
            const snapshot = structuredClone(currentState);
            const result = await surrealDBClient.query(
                'CREATE state:latest CONTENT $data', 
                { data: snapshot }
            );
            console.log('State snapshot saved:', result);
        } catch (error) {
            updateState({ error: error instanceof Error ? error.message : 'Failed to save state to SurrealDB' });
        }
    }

    async function loadStateFromSurrealDB() {
        try {
            const [result] = await surrealDBClient.query('SELECT * FROM state:latest');
            if (result && typeof result === 'object' && 'data' in result) {
                Object.assign(currentState, result.data);
                console.log('State restored from snapshot');
            }
        } catch (error) {
            updateState({ error: error instanceof Error ? error.message : 'Failed to load state from SurrealDB' });
        }
    }

    function handleInput(event: Event & { currentTarget: HTMLInputElement }, key: keyof typeof currentState.settings) {
        const value = event.currentTarget.value;
        updateState({ 
            settings: { 
                ...currentState.settings, 
                [key]: value 
            } 
        });
    }
</script>

<div class="tab-content">
    <h2>Database Integration</h2>
    <p>Manage your database integration with SurrealDB.</p>
    
    <div class="database-controls">
        <button onclick={fetchSurrealDBData}>Fetch Data</button>
        <button onclick={() => insertSurrealDBData({ key: 'value' })}>Insert Data</button>
        <button onclick={saveStateToSurrealDB}>Save State</button>
        <button onclick={loadStateFromSurrealDB}>Load State</button>
    </div>

    <div class="database-settings">
        <h3>Database Settings</h3>
        <div>
            <label for="surrealdb-url">SurrealDB URL:</label>
            <input
                id="surrealdb-url"
                type="text"
                value={currentState.settings.surrealDbUrl}
                oninput={(e) => handleInput(e, 'surrealDbUrl')}
            />
        </div>
        <div>
            <label for="surrealdb-user">SurrealDB User:</label>
            <input
                id="surrealdb-user"
                type="text"
                value={currentState.settings.surrealDbUser}
                oninput={(e) => handleInput(e, 'surrealDbUser')}
            />
        </div>
        <div>
            <label for="surrealdb-pass">SurrealDB Password:</label>
            <input
                id="surrealdb-pass"
                type="password"
                value={currentState.settings.surrealDbPass}
                oninput={(e) => handleInput(e, 'surrealDbPass')}
            />
        </div>
        <button onclick={initializeSurrealDB}>Reconnect to Database</button>
    </div>
</div>

<style>
    .database-controls,
    .database-settings {
        margin: 1rem 0;
        padding: 1rem;
        border: 1px solid #ccc;
        border-radius: 4px;
    }

    .database-settings div {
        margin: 0.5rem 0;
    }

    label {
        display: block;
        margin-bottom: 0.25rem;
    }

    input {
        width: 100%;
        padding: 0.5rem;
        border: 1px solid #ccc;
        border-radius: 4px;
    }

    button {
        margin: 0.5rem 0.5rem 0.5rem 0;
        padding: 0.5rem 1rem;
        background: #f0f0f0;
        border: 1px solid #ccc;
        border-radius: 4px;
        cursor: pointer;
    }

    button:hover {
        background: #e0e0e0;
    }
</style>
