<script lang="ts">
    interface Props {
        value: string;
        mask: string;
        placeholder?: string;
        type?: 'text' | 'tel' | 'number';
        class?: string;
        disabled?: boolean;
    }

    let props = $props();
    let { value = '', mask = '', placeholder = '', type = 'text', disabled = false } = props;
    
    let inputValue = $state(value);
    let maskedValue = $state(value);
    
    function applyMask(val: string): string {
        let result = '';
        let maskIndex = 0;
        let valueIndex = 0;
        
        while (maskIndex < mask.length && valueIndex < val.length) {
            if (mask[maskIndex] === '#') {
                if (/\d/.test(val[valueIndex])) {
                    result += val[valueIndex];
                    valueIndex++;
                }
                maskIndex++;
            } else if (mask[maskIndex] === 'A') {
                if (/[a-zA-Z]/.test(val[valueIndex])) {
                    result += val[valueIndex];
                    valueIndex++;
                }
                maskIndex++;
            } else if (mask[maskIndex] === '*') {
                result += val[valueIndex];
                valueIndex++;
                maskIndex++;
            } else {
                result += mask[maskIndex];
                if (val[valueIndex] === mask[maskIndex]) {
                    valueIndex++;
                }
                maskIndex++;
            }
        }
        
        return result;
    }
    
    function handleInput(event: Event) {
        const input = event.target as HTMLInputElement;
        const newValue = input.value;
        inputValue = newValue;
        maskedValue = applyMask(newValue);
        
        const detail = {
            masked: maskedValue,
            raw: inputValue
        };
        
        const customEvent = new CustomEvent('input', { detail });
        event.target?.dispatchEvent(customEvent);
    }

    $effect(() => {
        maskedValue = applyMask(inputValue);
    });
</script>

<input
    {type}
    {placeholder}
    {disabled}
    class={props.class}
    value={maskedValue}
    oninput={handleInput}
/>

<style>
    input {
        font: inherit;
        padding: var(--spacing-1);
        border: 1px solid var(--border);
        border-radius: var(--radius-1);
        background: var(--surface-1);
        color: var(--text-1);
    }
    
    input:disabled {
        opacity: 0.6;
        cursor: not-allowed;
    }
    
    input:focus {
        outline: none;
        border-color: var(--brand);
        box-shadow: 0 0 0 2px var(--brand-alpha);
    }
</style> 