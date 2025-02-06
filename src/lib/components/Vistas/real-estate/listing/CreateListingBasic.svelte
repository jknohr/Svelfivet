<script lang="ts">
  import type { Card, ListingCardContent } from '$lib/components/common/molecules/cards/cards';
  import { BaseCard } from '$lib/components/common/molecules/cards/base';
  import { Button } from '$lib/components/common';

  let { card } = $props<{ card: Card & { content: ListingCardContent } }>();
  let element: HTMLElement;

  function handleAnalyze() {
    element?.dispatchEvent(
      new CustomEvent('analyze', { 
        detail: { data: card.content.basicInfo },
        bubbles: true
      })
    );
  }

  function handleNext() {
    element?.dispatchEvent(
      new CustomEvent('step', { 
        detail: { step: 2, data: card.content.basicInfo },
        bubbles: true
      })
    );
  }
</script>

<BaseCard {card} bind:this={element}>
  {#snippet front()}
    <div class="listing-basic">
      <header>
        <h3>Basic Property Information</h3>
        <Button 
          variant="secondary"
          ariaLabel="Analyze with AI"
          ariaDescribedby="analyze-desc"
          ariaExpanded={false}
          ariaHaspopup={false}
          ariaControls="analyze-result"
          tabindex={0}
          onclick={handleAnalyze}
        >
          Analyze with AI
        </Button>
      </header>

      <div class="form-grid">
        <div class="form-group">
          <label for="title">Title</label>
          <input 
            type="text" 
            id="title"
            bind:value={card.content.basicInfo.title}
            placeholder="Enter property title"
          />
        </div>

        <div class="form-group">
          <label for="description">Description</label>
          <textarea 
            id="description"
            bind:value={card.content.basicInfo.description}
            placeholder="Enter property description"
          ></textarea>
        </div>

        <div class="form-group">
          <label for="propertyType">Property Type</label>
          <select 
            id="propertyType"
            bind:value={card.content.basicInfo.propertyType}
          >
            <option value="house">House</option>
            <option value="apartment">Apartment</option>
            <option value="condo">Condo</option>
            <option value="land">Land</option>
            <option value="commercial">Commercial</option>
          </select>
        </div>

        <div class="form-group">
          <label for="price">Price</label>
          <input 
            type="number" 
            id="price"
            bind:value={card.content.basicInfo.price}
            placeholder="Enter price"
          />
        </div>
      </div>

      <footer>
        <Button 
          variant="primary"
          ariaLabel="Next step"
          ariaDescribedby="next-desc"
          ariaExpanded={false}
          ariaHaspopup={false}
          ariaControls="next-step"
          tabindex={0}
          onclick={handleNext}
        >
          Next: Location & Documents
        </Button>
      </footer>
    </div>
  {/snippet}
</BaseCard>

<style>
  .listing-basic {
    padding: var(--spacing-lg);
  }

  header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: var(--spacing-lg);
  }

  h3 {
    margin: 0;
    font-size: 1.25rem;
  }

  .form-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: var(--spacing-lg);
    margin-bottom: var(--spacing-xl);
  }

  .form-group {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-xs);
  }

  label {
    font-weight: 500;
    color: var(--text-2);
  }

  input, select, textarea {
    padding: var(--spacing-sm);
    border: 1px solid var(--border);
    border-radius: var(--radius-sm);
    background: var(--surface-1);
    color: var(--text-1);
  }

  textarea {
    height: 120px;
    resize: vertical;
  }

  footer {
    display: flex;
    justify-content: flex-end;
  }
</style> 
