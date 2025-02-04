<script>
  export let imageUrl;
</script>

<div class="relative w-full h-screen">
  <img src={imageUrl} alt="Hero Background" class="w-full h-full object-cover" />
  <div class="absolute inset-0 bg-black bg-opacity-30"></div> <!-- For slight dark overlay -->
</div>