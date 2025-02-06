<script lang="ts">
import { MapView, MapNavigation, AreaHighlight, Geocoder } from '$lib/components/map';
import { PropertyCard } from '../cards';
import type { Property } from '$lib/schema/real-estate/property';
import type { Feature, Polygon, MultiPolygon } from 'geojson';
import type { Map } from 'mapbox-gl';
import RealEstateLayout from './RealEstateLayout.svelte';
import RealEstateFilters from '../filters/RealEstateFilters.svelte';
import RealEstateResults from '../results/RealEstateResults.svelte';

let { 
  map = $bindable<Map | null>(null)
} = $props<{
  map?: Map | null;
}>();

let properties = $state<Property[]>([]);
let selectedArea = $state<Feature<Polygon | MultiPolygon> | null>(null);
let searchFilters = $state({
  propertyType: [] as string[],
  priceRange: { min: 0, max: 1000000 },
  bedrooms: [] as number[],
  bathrooms: [] as number[],
  amenities: [] as string[]
});
let loading = $state(false);
let error = $state<string | null>(null);

// Handle property selection
function handlePropertySelect(property: Property) {
  if (!map) return;
  
  map.flyTo({
    center: [property.location.coordinates.lng, property.location.coordinates.lat],
    zoom: 16,
    pitch: 45,
    bearing: 30,
    duration: 2000
  });
}

// Handle area selection
function handleAreaSelect(feature: Feature<Polygon | MultiPolygon>) {
  selectedArea = feature;
  // Update property list based on selected area
  // This would typically involve a database query
}

// Handle filter changes
function handleFilterChange(event: CustomEvent) {
  searchFilters = event.detail.filters;
  // Update property list based on filters
  // This would typically involve a database query
}
</script>

<RealEstateLayout
  mode="split"
  showMap={true}
  showFilters={true}
  expandContent={true}
>
  <div class="flex h-full">
    <!-- Left Panel: Results -->
    <div class="w-1/3 h-full flex flex-col overflow-hidden border-r border-gray-200">
      <div class="flex-1 overflow-y-auto p-4">
        <RealEstateResults {loading} {error}>
          {#each properties as property (property.id)}
            <PropertyCard 
              data={property}
              on:click={() => handlePropertySelect(property)}
            />
          {/each}
        </RealEstateResults>
      </div>
    </div>

    <!-- Right Panel: Map -->
    <div class="w-2/3 h-full relative">
      <MapView bind:instance={map}>
        <MapNavigation>
          <Geocoder 
            accessToken={import.meta.env.VITE_MAPBOX_TOKEN}
          />
          
          {#if selectedArea}
            <AreaHighlight
              areaId="selected-neighborhood"
              feature={selectedArea}
              options={{
                fillColor: '#4668F2',
                fillOpacity: 0.2,
                outlineColor: '#4668F2',
                outlineWidth: 2
              }}
            />
          {/if}
        </MapNavigation>
      </MapView>
    </div>
  </div>
</RealEstateLayout>

<style>
  :global(.mapboxgl-map) {
    width: 100%;
    height: 100%;
  }
</style> 
