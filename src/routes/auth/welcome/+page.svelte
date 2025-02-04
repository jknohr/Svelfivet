<svelte:options runes={true} />

<script lang="ts">
    import { goto } from '$app/navigation';
    
    function goToHome() {
        goto('/');
    }
</script>

<div class="welcome-container">
    <h1>Welcome to Svelfivet!</h1>
    <p>Your account has been created successfully.</p>
    <button onclick={goToHome}>Go to Home</button>
</div>

<style>
    .welcome-container {
        max-width: 600px;
        margin: 4rem auto;
        text-align: center;
    }

    button {
        margin-top: 2rem;
        padding: 0.5rem 1rem;
        background-color: var(--primary-color, #4a90e2);
        color: white;
        border: none;
        border-radius: 4px;
        cursor: pointer;
    }

    button:hover {
        opacity: 0.9;
    }
</style>
