<svelte:options runes={true} />

<script lang="ts">
    import type { Snippet } from 'svelte';

    // Props
    type Props = {
        currentSection: string;
        currentSubsection?: string;
        sections: Array<{
            id: string;
            label: string;
            icon?: string;
            subsections?: Array<{
                id: string;
                label: string;
                icon?: string;
            }>;
        }>;
        sectionclick?: (sectionId: string) => void;
        subsectionclick?: (sectionId: string, subsectionId: string) => void;
    };

    let props = $props();
    let { currentSection, currentSubsection, sections, sectionclick, subsectionclick }: Props = props;

    // Derived current section data
    type Section = Props['sections'][number];
    type Subsection = NonNullable<Section['subsections']>[number];

    let currentSectionData = $derived(props.sections.find((s: Section) => s.id === props.currentSection));
</script>

<div class="navigation-divider">
    <div class="section-path">
        {#if currentSectionData}
            <button 
                type="button"
                class="section-item" 
                onclick={() => props.onSectionClick?.(props.currentSection)}
                onkeydown={(e) => e.key === 'Enter' && props.onSectionClick?.(props.currentSection)}
                role="menuitem"
            >
                {#if currentSectionData.icon}
                    <i class="material-icons">{currentSectionData.icon}</i>
                {/if}
                <span>{currentSectionData.label}</span>
            </button>

            {#if props.currentSubsection && currentSectionData.subsections}
                <div class="divider">
                    <i class="material-icons">chevron_right</i>
                </div>
                {@const subsection = currentSectionData.subsections.find((s: Subsection) => s.id === props.currentSubsection)}
                {#if subsection}
                    <button 
                        type="button"
                        class="section-item"
                        onclick={() => props.subsectionclick?.(currentSectionData.id, subsection.id)}
                        onkeydown={(e) => e.key === 'Enter' && props.subsectionclick?.(currentSectionData.id, subsection.id)}
                        role="menuitem"
                    >
                        {#if subsection.icon}
                            <i class="material-icons">{subsection.icon}</i>
                        {/if}
                        <span>{subsection.label}</span>
                    </button>
                {/if}
            {/if}
        {/if}
    </div>

    {#if currentSectionData?.subsections}
        <div class="subsections">
            {#each currentSectionData.subsections as subsection}
                <button 
                    type="button"
                    class="subsection-item"
                    class:active={subsection.id === props.currentSubsection}
                    onclick={() => props.onSubsectionClick?.(currentSectionData.id, subsection.id)}
                    onkeydown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                            e.preventDefault();
                            props.onSubsectionClick?.(currentSectionData.id, subsection.id);
                        }
                    }}
                    role="menuitem"
                    aria-current={subsection.id === props.currentSubsection ? 'page' : undefined}
                >
                    {#if subsection.icon}
                        <i class="material-icons" aria-hidden="true">{subsection.icon}</i>
                    {/if}
                    <span>{subsection.label}</span>
                </button>
            {/each}
        </div>
    {/if}
</div>

<style>
    .navigation-divider {
        display: flex;
        align-items: center;
        justify-content: space-between;
        padding: var(--spacing-sm) var(--spacing-md);
        background: var(--surface-variant);
        border-bottom: 1px solid var(--outline-variant);
        min-height: 48px;
    }

    .section-path {
        display: flex;
        align-items: center;
        gap: var(--spacing-xs);
    }

    .section-item {
        display: flex;
        align-items: center;
        gap: var(--spacing-xs);
        padding: var(--spacing-xs) var(--spacing-sm);
        border-radius: var(--radius-sm);
        cursor: pointer;
        transition: background-color 0.2s ease;
    }

    .section-item:hover {
        background: var(--surface-hover);
    }

    .divider {
        display: flex;
        align-items: center;
        color: var(--outline);
    }

    .subsections {
        display: flex;
        align-items: center;
        gap: var(--spacing-xs);
    }

    .subsection-item {
        display: flex;
        align-items: center;
        gap: var(--spacing-xs);
        padding: var(--spacing-xs) var(--spacing-sm);
        border-radius: var(--radius-sm);
        cursor: pointer;
        transition: all 0.2s ease;
        border: 1px solid transparent;
    }

    .subsection-item:hover {
        background: var(--surface-hover);
    }

    .subsection-item.active {
        background: var(--primary-container);
        color: var(--on-primary-container);
        border-color: var(--outline);
    }

    .material-icons {
        font-size: 1.25rem;
    }
</style>
