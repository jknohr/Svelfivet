<script lang="ts">
    import DOMPurify from 'dompurify';

    interface Props {
        content: string;
        allowedTags?: string[];
        allowedAttributes?: string[];
        children?: any;
    }

    let props = $props();
    let { content, allowedTags = [], allowedAttributes = [] } = props;

    let sanitizedContent = $derived(() => {
        const config = {
            ALLOWED_TAGS: allowedTags,
            ALLOWED_ATTR: allowedAttributes,
            RETURN_DOM_FRAGMENT: false,
            RETURN_DOM: false,
            RETURN_TRUSTED_TYPE: true
        };
        
        return DOMPurify.sanitize(content, config);
    });
</script>

{#if props.children}
    {@render props.children(sanitizedContent)}
{:else}
    {@html sanitizedContent}
{/if} 