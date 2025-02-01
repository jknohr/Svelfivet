<!-- src/components/organisms/Map.svelte -->
<script>
  export let location = 'New York, NY';
</script>

<div class="map">
  <!-- Embed a map using an iframe or a mapping library like Leaflet.js -->
  <iframe
    title="Property location map"
    src={`https://www.google.com/maps?q=${encodeURIComponent(location)}&output=embed`}
    width="100%"
    height="400"
    style="border:0;"
    allowfullscreen={true}
    loading="lazy"
  ></iframe>
</div>

<style>
  .map {
    margin-top: 1rem;
    border-radius: var(--radius);
    overflow: hidden;
    background: linear-gradient(135deg, rgba(255, 255, 255, 0.1), rgba(255, 255, 255, 0.05));
    box-shadow: var(--shadow);
  }
</style>