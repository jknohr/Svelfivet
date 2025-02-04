<!-- /src/lib/components/Image.svelte -->
<!--
@component Image
A responsive image component with lazy loading and theme integration.
Features:
- Responsive sizing
- Lazy loading
- Placeholder support
- Theme integration for styling
- Accessibility support with ARIA attributes
-->
<svelte:options runes={true} />
<script lang="ts">
  import { getContext } from 'svelte';
  import type { UnifiedThemeContext } from '$lib/components/Theme/Theme.types';
  import type { ImageProps } from './Image.types';
  import { GlassPane } from '$lib/components/Theme/GlassPane.svelte';
  import * as Lazy from 'svelte-lazy';
  import * as ExifReader from 'exifreader';

  // Props with default values
  export let labelText = 'Choose an image file from your computer:';
  export let accept = 'image/*';
  export let fileLabelText = 'Select a file:';
  export let fileAccept = 'image/*';
  let {
    src = '',
    alt = 'Image', // Default alt text
    role = 'img', // Default role
    ariaLabel = alt, // Default ARIA label
    width = '100%',
    height = 'auto',
    objectFit = 'cover',
    placeholder = '',
    lazy = true
  } = $props();

  // Theme context
  const themeContext = getContext<UnifiedThemeContext>('theme');

  // State
  let loaded = $state(false);
  let selectedFile = $state<File | null>(null);
  let exifTags = $state<Array<{key: string, value: string}>>([]);
  let scene = $state('');
  let optionalMetadata = $state({});

  // Derived styles
  const styles = $derived({
    '--image-width': width,
    '--image-height': height,
    '--image-object-fit': objectFit
  });

  // Handle image load
  function handleLoad() {
    loaded = true;
  }

  // Function to load EXIF data
  async function loadExif(file: File) {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const tags = ExifReader.load(arrayBuffer, { expanded: true });
      
      // Transform tags into our desired format
      exifTags = Object.entries(tags)
        .filter(([key, value]) => value !== undefined)
        .map(([key, value]) => ({
          key, 
          value: typeof value === 'object' && value !== null 
            ? JSON.stringify(value) 
            : String(value)
        }));

      // Update alt and scene if possible
      if (tags['AltTextAccessibility']) {
        alt = tags['AltTextAccessibility'].scene || alt;
      }
      if (tags['Scene']) {
        scene = tags['Scene'].scene || '';
      }

      // Load other optional metadata
      optionalMetadata = {};
      if (tags['CreatorCountry']) optionalMetadata.countryCode = tags['CountryCode'].value;
      if (tags['CreatorCity']) optionalMetadata.creatorCity = tags['CreatorCity'].value;
      if (tags['Location']) optionalMetadata.location = tags['Location'].value;
    } catch (error) {
      console.error('Error reading EXIF data:', error);
    }
  }

  // Handle file selection
  function handleFileChange(event: Event) {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files.length > 0) {
      const file = target.files[0];
      selectedFile = file;
      loadExif(file);
    }
  }

  function handleSubmit(event) {
    event.preventDefault();
    // Your form handling logic here
  }
</script>

<GlassPane>
  <div
    class="image-container"
    style:width={styles['--image-width']}
    style:height={styles['--image-height']}
    style:--image-object-fit={styles['--image-object-fit']}
  >
    {#if placeholder}
      <img
        class="image-placeholder theme-image-placeholder-class"
        src={placeholder}
        alt={alt}
        width={width}
        height={height}
        role={role}
      />
    {/if}
    <img
      class="image theme-image-class w-full h-full object-cover"
      src={src}
      alt={alt}
      aria-label={ariaLabel}
      width={width}
      height={height}
      style:opacity={loaded ? '1' : '0'}
      onload={handleLoad}
      'use:lazy'={lazy ? 'true' : 'false'}
      role={role}
    />
  </div>

 <form onsubmit={handleSubmit}>
    <label>
      {fileLabelText}<br>
      <input 
        type="file" 
        id="file" 
        name="file" 
        accept={fileAccept} 
        onchange={handleFileChange}
      >
    </label>
  </form>

  {#if exifTags.length > 0}
    <table class="tags">
      <thead>
        <tr>
          <th>Tag name</th>
          <th>Tag description</th>
        </tr>
      </thead>
      <tbody>
        {#each exifTags as { key, value }}
          <tr>
            <td>{key}</td>
            <td>{value}</td>
          </tr>
        {/each}
      </tbody>
    </table>
  {/if}

  {#if scene}
    <p>Scene: {scene}</p>
  {/if}

  {#if optionalMetadata}
    <table class="optional-metadata">
      <thead>
        <tr>
          <th>Metadata key</th>
          <th>Metadata value</th>
        </tr>
      </thead>
      <tbody>
        {#each Object.entries(optionalMetadata) as [key, value]}
          <tr>
            <td>{key}</td>
            <td>{value}</td>
          </tr>
        {/each}
      </tbody>
    </table>
  {/if}
</GlassPane>

<style>
  .image-container {
    position: relative;
    width: var(--image-width, 100%);
    height: var(--image-height, auto);
    overflow: hidden;
  }
  .image-placeholder {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: var(--image-object-fit, cover);
    transition: opacity 0.3s ease-in-out;
  }
  .image {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: var(--image-object-fit, cover);
    transition: opacity 0.3s ease-in-out;
  }
  .image-placeholder + .image {
    opacity: 0;
  }
  .image-placeholder + .image.loaded {
    opacity: 1;
  }
  .tags {
    margin-top: 20px;
  }
</style>