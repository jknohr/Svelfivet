<svelte:options runes={true} />

<script lang="ts">
    import Modal from '$lib/components/Utility/Modal/Modal.svelte';
    import { login } from '../api/auth';
    import { currentUser } from '../store/auth';
    import type { LoginCredentials } from '../types';
    import { validateLoginCredentials } from '../validation/schemas';
    import { AUTH_CONSTANTS, ERROR_MESSAGES } from '../constants/auth';

    let { show = false, onClose, onRegister, onLoginSuccess } = $props<{
        show?: boolean;
        onClose?: () => void;
        onRegister?: () => void;
        onLoginSuccess?: (user: any) => void;
    }>();

    let email = $state('');
    let password = $state('');
    let rememberMe = $state(false);
    let isLoading = $state(false);
    let error = $state<string | null>(null);

    function validateForm(): string | null {
        return validateLoginCredentials({ email, password, rememberMe });
    }

    async function handleSubmit() {
        error = null;
        isLoading = true;

        try {
            // Validate form before submission
            const validationError = validateForm();
            if (validationError) {
                error = validationError;
                return;
            }

            const credentials: LoginCredentials = { email, password, rememberMe };
            const user = await login(credentials);
            
            // Clear any previous errors
            error = null;
            
            // On success
            onClose();
            onLoginSuccess?.(user);
        } catch (e) {
            error = e instanceof Error ? e.message : ERROR_MESSAGES.INVALID_CREDENTIALS;
        } finally {
            isLoading = false;
        }
    }

    function handleForgotPassword() {
        // TODO: Implement forgot password flow
        console.log('Forgot password clicked');
    }
</script>

<Modal {show} {onClose} title="Login">
    <form onsubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
        {#if error}
            <div class="error-message">
                <i class="material-icons">error</i>
                <span>{error}</span>
            </div>
        {/if}

        <div class="form-group">
            <label for="email">Email</label>
            <input
                type="email"
                id="email"
                bind:value={email}
                placeholder="Enter your email"
                required
                disabled={isLoading}
            />
        </div>

        <div class="form-group">
            <label for="password">Password</label>
            <input
                type="password"
                id="password"
                bind:value={password}
                placeholder="Enter your password"
                required
                disabled={isLoading}
            />
        </div>

        <div class="form-options">
            <label class="checkbox-label">
                <input
                    type="checkbox"
                    bind:checked={rememberMe}
                    disabled={isLoading}
                />
                <span>Remember me</span>
            </label>
            <button 
                type="button" 
                class="text-button"
                onclick={handleForgotPassword}
                disabled={isLoading}
            >
                Forgot Password?
            </button>
        </div>

        <button 
            type="submit" 
            class="submit-button" 
            disabled={isLoading}
        >
            {#if isLoading}
                <i class="material-icons spinning">sync</i>
                Logging in...
            {:else}
                Login
            {/if}
        </button>

        <div class="register-prompt">
            <span>Don't have an account?</span>
            <button 
                type="button"
                class="text-button"
                onclick={onRegister}
                disabled={isLoading}
            >
                Register
            </button>
        </div>
    </form>
</Modal>

<style>
    form {
        display: flex;
        flex-direction: column;
        gap: var(--spacing-md);
    }

    .form-group {
        display: flex;
        flex-direction: column;
        gap: var(--spacing-xs);
    }

    label {
        font-size: 0.875rem;
        color: var(--on-surface-variant);
    }

    input[type="email"],
    input[type="password"] {
        padding: var(--spacing-sm);
        border: 1px solid var(--border-color);
        border-radius: var(--radius-sm);
        background: var(--surface-variant);
        color: var(--on-surface);
        font-size: 1rem;
        transition: all 0.2s ease;
    }

    input[type="email"]:focus,
    input[type="password"]:focus {
        outline: none;
        border-color: var(--primary);
        background: var(--surface-background);
    }

    .form-options {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }

    .checkbox-label {
        display: flex;
        align-items: center;
        gap: var(--spacing-xs);
        cursor: pointer;
    }

    .text-button {
        background: none;
        border: none;
        color: var(--primary);
        cursor: pointer;
        padding: 0;
        font-size: 0.875rem;
        transition: color 0.2s ease;
    }

    .text-button:hover {
        color: var(--primary-hover);
        text-decoration: underline;
    }

    .submit-button {
        background: var(--primary);
        color: var(--on-primary);
        border: none;
        padding: var(--spacing-sm) var(--spacing-md);
        border-radius: var(--radius-sm);
        font-size: 1rem;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: var(--spacing-sm);
        transition: background 0.2s ease;
    }

    .submit-button:hover:not(:disabled) {
        background: var(--primary-hover);
    }

    .submit-button:disabled {
        opacity: 0.7;
        cursor: not-allowed;
    }

    .register-prompt {
        text-align: center;
        font-size: 0.875rem;
        color: var(--on-surface-variant);
        display: flex;
        align-items: center;
        justify-content: center;
        gap: var(--spacing-xs);
    }

    .error-message {
        background: var(--error-container);
        color: var(--on-error-container);
        padding: var(--spacing-sm);
        border-radius: var(--radius-sm);
        display: flex;
        align-items: center;
        gap: var(--spacing-sm);
        font-size: 0.875rem;
    }

    @keyframes spin {
        from { transform: rotate(0deg); }
        to { transform: rotate(360deg); }
    }

    .spinning {
        animation: spin 1s linear infinite;
    }

    @media (prefers-reduced-motion: reduce) {
        .spinning {
            animation: none;
        }
    }
</style>
