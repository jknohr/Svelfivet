<svelte:options runes={true} />

<script lang="ts">
    import LoginModal from './LoginModal.svelte';
    import RegisterModal from './RegisterModal.svelte';
    import { auth } from '$lib/stores/auth';

    let showLogin = $state(false);
    let showRegister = $state(false);

    function openLogin() {
        showLogin = true;
        showRegister = false;
    }

    function openRegister() {
        showRegister = true;
        showLogin = false;
    }

    function closeModals() {
        showLogin = false;
        showRegister = false;
    }

    // Export functions for other components to use
    function handleAuthAction(action: 'login' | 'register') {
        if (action === 'login') openLogin();
        else openRegister();
    }

    // Make auth functions available to child components
    setContext('auth', {
        openLogin,
        openRegister,
        closeModals,
        handleAuthAction
    });
</script>

<slot />

<LoginModal 
    show={showLogin}
    onClose={closeModals}
    onRegister={openRegister}
/>

<RegisterModal
    show={showRegister}
    onClose={closeModals}
    onLogin={openLogin}
/>
