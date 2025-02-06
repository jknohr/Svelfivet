<script>
  import TextField from '$lib/components/Atoms/TextField/TextField.svelte';
</script>

<div class="absolute top-1/4 left-1/2 transform -translate-x-1/2 text-white text-center">
  <h1 class="text-5xl font-bold leading-tight">Agents. Tours.<br />Loans. Homes.</h1>
  
  <!-- Define the TextField component here -->
  <TextField 
    id="search" 
    placeholder="Search..." 
    glass={true} 
    variant="transparent" 
    ariaLabel="Search field Text"
  />
</div>
