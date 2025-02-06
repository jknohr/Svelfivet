<script lang="ts">
    interface ValidationRule {
        test: (value: any) => boolean;
        message: string;
    }

    interface Props {
        value: any;
        rules?: ValidationRule[];
        validateOnChange?: boolean;
        validateOnBlur?: boolean;
        children?: any;
    }

    let props = $props();
    let {
        value,
        rules = [],
        validateOnChange = true,
        validateOnBlur = true
    } = props;

    let errors = $state<string[]>([]);
    let isDirty = $state(false);
    let isTouched = $state(false);

    function validate(): boolean {
        errors = rules
            .filter(rule => !rule.test(value))
            .map(rule => rule.message);
        
        return errors.length === 0;
    }

    function handleInput() {
        isDirty = true;
        if (validateOnChange) {
            validate();
        }
    }

    function handleBlur() {
        isTouched = true;
        if (validateOnBlur) {
            validate();
        }
    }

    let validationState = $derived(() => ({
        isValid: errors.length === 0,
        isDirty,
        isTouched,
        errors
    }));

    $effect(() => {
        // Initial validation
        validate();
    });
</script>

{@render props.children?.(validationState)}

{#if errors.length > 0}
    <ul class="validation-errors" role="alert">
        {#each errors as error}
            <li class="error-message">{error}</li>
        {/each}
    </ul>
{/if}

<style>
    .validation-errors {
        margin: var(--spacing-1) 0 0;
        padding: 0;
        list-style: none;
    }

    .error-message {
        color: var(--error);
        font-size: 0.875em;
        margin-top: var(--spacing-1);
    }

    .error-message:first-child {
        margin-top: 0;
    }
</style> 
