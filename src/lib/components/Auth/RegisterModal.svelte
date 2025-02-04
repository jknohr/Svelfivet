<svelte:options runes={true} />

<script lang="ts">
    import Modal from '$lib/components/Utility/Modal/Modal.svelte';
    import { goto } from '$app/navigation';

    export let show = false;
    export let onClose: () => void;
    export let onLogin: () => void;

    let email = $state('');
    let password = $state('');
    let confirmPassword = $state('');
    let fullName = $state('');
    let isLoading = $state(false);
    let error = $state<string | null>(null);
    let acceptTerms = $state(false);

    let passwordStrength = $derived(() => {
        if (!password) return 0;
        let strength = 0;
        if (password.length >= 8) strength++;
        if (/[A-Z]/.test(password)) strength++;
        if (/[a-z]/.test(password)) strength++;
        if (/[0-9]/.test(password)) strength++;
        if (/[^A-Za-z0-9]/.test(password)) strength++;
        return strength;
    });

    let passwordStrengthText = $derived(() => {
        if (!password) return '';
        const texts = ['Very Weak', 'Weak', 'Fair', 'Good', 'Strong'];
        return texts[passwordStrength - 1] || '';
    });

    let passwordStrengthColor = $derived(() => {
        const colors = ['var(--error)', 'var(--error)', 'var(--warning)', 'var(--success)', 'var(--success)'];
        return colors[passwordStrength - 1] || 'var(--error)';
    });

    let canSubmit = $derived(() => {
        return email && 
               password && 
               confirmPassword && 
               fullName && 
               acceptTerms && 
               password === confirmPassword && 
               passwordStrength >= 3;
    });

    async function handleSubmit() {
        if (!canSubmit) return;
        
        error = null;
        isLoading = true;

        try {
            // TODO: Implement actual registration logic
            await new Promise(resolve => setTimeout(resolve, 1000)); // Simulated API call
            console.log('Register:', { email, password, fullName });
            
            // On success
            goto('/admin');
            onClose();
        } catch (e) {
            error = 'Registration failed. Please try again.';
        } finally {
            isLoading = false;
        }
    }
</script>

<Modal {show} {onClose} title="Create Account" width="450px">
    <form onsubmit|preventDefault={handleSubmit}>
        {#if error}
            <div class="error-message">
                <i class="material-icons">error</i>
                <span>{error}</span>
            </div>
        {/if}

        <div class="form-group">
            <label for="fullName">Full Name</label>
            <input
                type="text"
                id="fullName"
                bind:value={fullName}
                placeholder="Enter your full name"
                required
                disabled={isLoading}
            />
        </div>

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
                placeholder="Create a password"
                required
                disabled={isLoading}
            />
            {#if password}
                <div class="password-strength">
                    <div class="strength-bar">
                        {#each Array(5) as _, i}
                            <div 
                                class="strength-segment"
                                style="background-color: {i < passwordStrength ? passwordStrengthColor : 'var(--surface-variant)'}"
                            ></div>
                        {/each}
                    </div>
                    <span style="color: {passwordStrengthColor}">{passwordStrengthText}</span>
                </div>
                <ul class="password-requirements">
                    <li class:met={password.length >= 8}>At least 8 characters</li>
                    <li class:met={/[A-Z]/.test(password)}>One uppercase letter</li>
                    <li class:met={/[a-z]/.test(password)}>One lowercase letter</li>
                    <li class:met={/[0-9]/.test(password)}>One number</li>
                    <li class:met={/[^A-Za-z0-9]/.test(password)}>One special character</li>
                </ul>
            {/if}
        </div>

        <div class="form-group">
            <label for="confirmPassword">Confirm Password</label>
            <input
                type="password"
                id="confirmPassword"
                bind:value={confirmPassword}
                placeholder="Confirm your password"
                required
                disabled={isLoading}
            />
            {#if confirmPassword && password !== confirmPassword}
                <span class="validation-error">Passwords do not match</span>
            {/if}
        </div>

        <label class="checkbox-label">
            <input
                type="checkbox"
                bind:checked={acceptTerms}
                disabled={isLoading}
            />
            <span>I agree to the <a href="/terms" target="_blank">Terms of Service</a> and <a href="/privacy" target="_blank">Privacy Policy</a></span>
        </label>

        <button 
            type="submit" 
            class="submit-button" 
            disabled={!canSubmit || isLoading}
        >
            {#if isLoading}
                <i class="material-icons spinning">sync</i>
                Creating Account...
            {:else}
                Create Account
            {/if}
        </button>

        <div class="login-prompt">
            <span>Already have an account?</span>
            <button 
                type="button"
                class="text-button"
                onclick={onLogin}
                disabled={isLoading}
            >
                Login
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

    input[type="text"],
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

    input[type="text"]:focus,
    input[type="email"]:focus,
    input[type="password"]:focus {
        outline: none;
        border-color: var(--primary);
        background: var(--surface-background);
    }

    .password-strength {
        display: flex;
        align-items: center;
        gap: var(--spacing-sm);
        margin-top: var(--spacing-xs);
    }

    .strength-bar {
        flex: 1;
        display: flex;
        gap: 4px;
    }

    .strength-segment {
        height: 4px;
        flex: 1;
        border-radius: 2px;
        transition: background-color 0.2s ease;
    }

    .password-requirements {
        list-style: none;
        padding: 0;
        margin: var(--spacing-xs) 0 0;
        font-size: 0.75rem;
        color: var(--on-surface-variant);
    }

    .password-requirements li {
        display: flex;
        align-items: center;
        gap: var(--spacing-xs);
    }

    .password-requirements li::before {
        content: '•';
        color: var(--error);
    }

    .password-requirements li.met::before {
        content: '✓';
        color: var(--success);
    }

    .checkbox-label {
        display: flex;
        align-items: center;
        gap: var(--spacing-xs);
        cursor: pointer;
    }

    .checkbox-label a {
        color: var(--primary);
        text-decoration: none;
    }

    .checkbox-label a:hover {
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

    .login-prompt {
        text-align: center;
        font-size: 0.875rem;
        color: var(--on-surface-variant);
        display: flex;
        align-items: center;
        justify-content: center;
        gap: var(--spacing-xs);
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

    .validation-error {
        color: var(--error);
        font-size: 0.75rem;
        margin-top: calc(var(--spacing-xs) * -1);
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
