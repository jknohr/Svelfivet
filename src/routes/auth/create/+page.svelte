<svelte:options runes={true} />

<script lang="ts">
    import CreateUser from '$lib/services/neuralauth/CreateUser.svelte';
    import Modal from '$lib/components/Utility/Modal/Modal.svelte';
    import { goto } from '$app/navigation';
    
    let showModal = $state(true);

    function handleComplete(formData) {
        showModal = false;
        goto('/auth/welcome');
    }

    function handleClose() {
        showModal = false;
        goto('/');
    }
</script>

<Modal 
    show={showModal}
    onClose={handleClose}
    title="Create User Account"
    width="600px"
>
    <CreateUser onComplete={handleComplete} />
</Modal>
