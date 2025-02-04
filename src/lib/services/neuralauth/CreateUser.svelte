<svelte:options runes={true} />

<script lang="ts">
    import { Divider } from '$lib/components/Theme/Divider';
    
    // Props
    let { onComplete = () => {} } = $props();
    
    // Form data state
    let formData = $state({
        personal: {
            name: '',
            email: '',
            completed: false
        },
        preferences: {
            theme: 'light',
            notifications: true,
            completed: false
        },
        verification: {
            code: '',
            completed: false
        }
    });

    // Current section being edited
    let currentSection = $state('personal');

    // Save progress for current section
    function saveSection(section: string) {
        formData[section].completed = true;
        // Here you would typically save to backend
        console.log(`Saved section: ${section}`, formData[section]);
    }
</script>

<div class="create-user-section">
    <div class="section personal-info">
        <h3>Personal Information</h3>
        <div class="form-fields">
            <input 
                type="text" 
                bind:value={formData.personal.name} 
                placeholder="Name"
            />
            <input 
                type="email" 
                bind:value={formData.personal.email} 
                placeholder="Email"
            />
        </div>
        <button onclick={() => saveSection('personal')}>Save Progress</button>
    </div>

    <Divider 
        title="Personal Info Saved" 
        subtitle="Your personal information has been saved" 
        completed={formData.personal.completed} 
    />

    <div class="section preferences">
        <h3>User Preferences</h3>
        <div class="form-fields">
            <select bind:value={formData.preferences.theme}>
                <option value="light">Light Theme</option>
                <option value="dark">Dark Theme</option>
            </select>
            <label>
                <input 
                    type="checkbox" 
                    bind:checked={formData.preferences.notifications} 
                />
                Enable Notifications
            </label>
        </div>
        <button onclick={() => saveSection('preferences')}>Save Progress</button>
    </div>

    <Divider 
        title="Preferences Saved" 
        subtitle="Your preferences have been saved" 
        completed={formData.preferences.completed} 
    />

    <div class="section verification">
        <h3>Account Verification</h3>
        <div class="form-fields">
            <input 
                type="text" 
                bind:value={formData.verification.code} 
                placeholder="Enter verification code"
            />
        </div>
        <button onclick={() => {
            saveSection('verification');
            onComplete(formData);
        }}>Complete Registration</button>
    </div>

    <Divider 
        title="Registration Complete" 
        subtitle="Your account has been created" 
        completed={formData.verification.completed} 
    />
</div>

<style>
    .create-user-section {
        width: 100%;
        max-width: 600px;
        margin: 0 auto;
        padding: 2rem;
    }

    .section {
        margin: 2rem 0;
    }

    .form-fields {
        display: flex;
        flex-direction: column;
        gap: 1rem;
        margin: 1rem 0;
    }

    input, select {
        padding: 0.5rem;
        border: 1px solid #ccc;
        border-radius: 4px;
    }

    button {
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
