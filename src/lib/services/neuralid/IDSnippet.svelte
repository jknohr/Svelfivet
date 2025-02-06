<script lang="ts">
    import { useIDContext } from './id-context';
    import { generateElementID } from './neuralID';
    import type { SnippetConfig } from './types';

    interface $Props {
        config: SnippetConfig;
        class?: string;
    }

    let { config, class: className = '' } = $props();
    
    const idContext = useIDContext();
    let idContextValue = $idContext;
    
    let elementId = generateElementID({
        ...idContextValue,
        elementType: config.type
    });
    
    let isValid = !config.allowedTypes || config.allowedTypes.includes(config.type);
</script>

<div 
    class="neural-snippet {className}"
    data-element-id={elementId}
    data-element-type={config.type}
    data-valid={isValid}
>
    {config.content || config.defaultContent || ''}
</div>

<style>
    .neural-snippet {
        position: relative;
        width: 100%;
        height: 100%;
    }
</style>
