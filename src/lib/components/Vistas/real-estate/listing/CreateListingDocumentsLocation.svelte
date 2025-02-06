<script lang="ts">
  import type { Card, ListingCardContent } from '$lib/components/common/molecules/cards/cards';
  import { BaseCard } from '$lib/components/common/molecules/cards/base';
  import { Button } from '$lib/components/common';

  let card = $state<Card & { content: ListingCardContent }>();

  let uploadedDocuments = $state<File[]>([]);
  let uploadedImages = $state<File[]>([]);

  const analyzeData = () => ({ data: card.content });
  const stepData = (step: number) => ({ step, data: card.content });

  function handleDocumentUpload(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      uploadedDocuments = Array.from(input.files);
    }
  }

  function handleImageUpload(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files) {
      uploadedImages = Array.from(input.files);
    }
  }
</script>

<BaseCard {card}>
  {#snippet front(@render)}
    <div class="listing-location">
      <header>
        <h3>Location & Documents</h3>
        <Button 
          variant="secondary"
          ariaLabel="Analyze with AI"
          tabindex={0}
          ariaDescribedby="analyze-desc"
          ariaExpanded={false}
          ariaHaspopup={false}
          ariaControls="analyze-content"
          onclick={() => analyzeData()}
        >
          Analyze with AI
        </Button>
      </header>

      <div class="form-grid">
        <div class="form-section">
          <h4>Location Details</h4>
          
          <div class="form-group">
            <label for="address">Full Address</label>
            <input 
              type="text" 
              id="address"
              bind:value={card.content.location.formatted_address}
              placeholder="Enter full address"
            />
          </div>

          <div class="form-group">
            <label for="propertyType">Property Type</label>
            <select 
              id="propertyType"
              bind:value={card.content.location.place_type[0]}
            >
              <option value="residential">Residential</option>
              <option value="commercial">Commercial</option>
              <option value="industrial">Industrial</option>
              <option value="land">Land</option>
            </select>
          </div>

          <div class="form-group">
            <label for="coordinates">Coordinates</label>
            <div class="coordinates-group">
              <input 
                type="number" 
                id="latitude"
                bind:value={card.content.location.geometry.coordinates[1]}
                placeholder="Latitude"
                step="0.000001"
              />
              <input 
                type="number" 
                id="longitude"
                bind:value={card.content.location.geometry.coordinates[0]}
                placeholder="Longitude"
                step="0.000001"
              />
            </div>
          </div>
        </div>

        <div class="form-section">
          <h4>Documents & Images</h4>
          
          <div class="form-group">
            <label for="documents">Property Documents</label>
            <input 
              type="file"
              id="documents"
              multiple
              accept=".pdf,.doc,.docx"
              onchange={handleDocumentUpload}
            />
            {#if uploadedDocuments.length > 0}
              <ul class="file-list">
                {#each uploadedDocuments as doc}
                  <li>{doc.name}</li>
                {/each}
              </ul>
            {/if}
          </div>

          <div class="form-group">
            <label for="images">Property Images</label>
            <input 
              type="file"
              id="images"
              multiple
              accept="image/*"
              onchange={handleImageUpload}
            />
            {#if uploadedImages.length > 0}
              <ul class="file-list">
                {#each uploadedImages as img}
                  <li>{img.name}</li>
                {/each}
              </ul>
            {/if}
          </div>
        </div>
      </div>

      <footer>
        <Button 
          variant="secondary"
          ariaLabel="Previous step"
          tabindex={0}
          ariaDescribedby="prev-desc"
          ariaExpanded={false}
          ariaHaspopup={false}
          ariaControls="prev-content"
          onclick={() => stepData(1)}
        >
          Previous: Basic Info
        </Button>
        <Button 
          variant="primary"
          ariaLabel="Next step"
          tabindex={0}
          ariaDescribedby="next-desc"
          ariaExpanded={false}
          ariaHaspopup={false}
          ariaControls="next-content"
          onclick={() => stepData(3)}
        >
          Next: Review & Submit
        </Button>
      </footer>
    </div>
  {/snippet}

</BaseCard>


<style>
  .listing-location {
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

  h4 {
    margin: 0 0 var(--spacing-md);
    font-size: 1rem;
    color: var(--text-2);
  }

  .form-grid {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: var(--spacing-xl);
    margin-bottom: var(--spacing-xl);
  }

  .form-section {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-lg);
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

  input, select {
    padding: var(--spacing-sm);
    border: 1px solid var(--border);
    border-radius: var(--radius-sm);
    background: var(--surface-1);
    color: var(--text-1);
  }

  .coordinates-group {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: var(--spacing-sm);
  }

  .file-list {
    list-style: none;
    padding: 0;
    margin: var(--spacing-xs) 0 0;
    font-size: 0.875rem;
  }

  .file-list li {
    padding: var(--spacing-xs);
    background: var(--surface-2);
    border-radius: var(--radius-sm);
    margin-bottom: var(--spacing-xs);
  }

  footer {
    display: flex;
    justify-content: space-between;
  }
</style> 
