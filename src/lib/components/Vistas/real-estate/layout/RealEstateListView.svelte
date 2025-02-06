<script lang="ts">
import { onMount } from 'svelte';
import { BaseCard } from '$lib/components/common/molecules/cards/base';
import type { Card } from '$lib/components/common/molecules/cards/cards';
import { PropertyListingCard } from '../cards';
import type { Property } from '$lib/schema/real-estate/property';

let property = $state<Property>({
  id: '',
  title: '',
  description: '',
  type: 'house',
  status: 'available',
  price: {
    amount: 0,
    currency: 'USD',
    type: 'sale'
  },
  location: {
    address: '',
    city: '',
    state: '',
    country: '',
    coordinates: {
      lat: 0,
      lng: 0
    }
  },
  features: {
    bedrooms: undefined,
    bathrooms: undefined,
    area: {
      size: 0,
      unit: 'sqft'
    },
    amenities: []
  },
  media: {
    images: [],
    videos: [],
    virtualTour: undefined
  },
  agent: {
    id: '',
    ref: {
      id: '',
      name: '',
      email: '',
      role: 'user' as const,
      created: new Date().toISOString(),
      updated: new Date().toISOString(),
      status: 'active',
      preferences: {
        mainTheme: 'light',
        notifications: true
      }
    }
  },
  created: new Date().toISOString(),
  updated: new Date().toISOString()
});

let card: Card = $state({
  id: 'property-card',
  title: 'Property Card',
  size: {
    width: '100%',
    height: 'auto'
  },
  content: {
    type: 'property',
    title: property.title,
    description: '',
    images: property.media.images,
    location: {
      address: property.location.address
    },
    features: property.features,
    contact: {
      name: property.agent.ref.name
    }
  }
});

let step = $state(1);
const totalSteps = 4;

function handleNext() {
  if (step < totalSteps) {
    step++;
  }
}

function handleBack() {
  if (step > 1) {
    step--;
  }
}

async function handleSubmit() {
  // Submit property listing
  // This would typically involve a database call
}
</script>

<div class="max-w-4xl mx-auto p-8">
  <div class="mb-8">
    <h1 class="text-3xl font-bold mb-2">List Your Property</h1>
    <p class="text-gray-600">Complete the form below to list your property</p>
  </div>

  <div class="bg-white rounded-lg shadow-lg p-6">
    <!-- Progress Bar -->
    <div class="mb-8">
      <div class="flex justify-between mb-2">
        {#each Array(totalSteps) as _, i}
          <div class="flex items-center">
            <div class={`w-8 h-8 rounded-full flex items-center justify-center ${i + 1 <= step ? 'bg-blue-500 text-white' : 'bg-gray-200'}`}>
              {i + 1}
            </div>
            {#if i < totalSteps - 1}
              <div class={`h-1 w-16 ${i + 1 < step ? 'bg-blue-500' : 'bg-gray-200'}`}></div>
            {/if}
          </div>
        {/each}
      </div>
    </div>

    <!-- Form Steps -->
    {#if step === 1}
      <!-- Basic Information -->
      <div class="space-y-4">
        <div>
          <label for="property-title" class="block text-sm font-medium text-gray-700">Title</label>
          <input
            id="property-title"
            type="text"
            bind:value={property.title}
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
        <div>
          <label for="property-description" class="block text-sm font-medium text-gray-700">Description</label>
          <textarea
            id="property-description"
            bind:value={card.content.description}
            rows="4"
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          ></textarea>
        </div>
      </div>
    {:else if step === 2}
      <!-- Location -->
      <div class="space-y-4">
        <div>
          <label for="property-address" class="block text-sm font-medium text-gray-700">Address</label>
          <input
            id="property-address"
            type="text"
            bind:value={property.location.address}
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label for="property-city" class="block text-sm font-medium text-gray-700">City</label>
            <input
              id="property-city"
              type="text"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
          <div>
            <label for="property-state" class="block text-sm font-medium text-gray-700">State</label>
            <input
              id="property-state"
              type="text"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>
    {:else if step === 3}
      <!-- Features -->
      <div class="space-y-4">
        <div>
          <label for="property-bedrooms" class="block text-sm font-medium text-gray-700">Bedrooms</label>
          <input
            id="property-bedrooms"
            type="number"
            bind:value={property.features.bedrooms}
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
        <div>
          <label for="property-bathrooms" class="block text-sm font-medium text-gray-700">Bathrooms</label>
          <input
            id="property-bathrooms"
            type="number"
            bind:value={property.features.bathrooms}
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
        <div>
          <label for="property-area" class="block text-sm font-medium text-gray-700">Area (sqft)</label>
          <input
            id="property-area"
            type="number"
            bind:value={property.features.area.size}
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
      </div>
    {:else if step === 4}
      <!-- Price and Status -->
      <div class="space-y-4">
        <div>
          <label for="property-price" class="block text-sm font-medium text-gray-700">Price</label>
          <input
            id="property-price"
            type="number"
            bind:value={property.price.amount}
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
        <div>
          <label for="property-status" class="block text-sm font-medium text-gray-700">Status</label>
          <select
            id="property-status"
            bind:value={property.status}
            class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="available">Available</option>
            <option value="pending">Pending</option>
            <option value="sold">Sold</option>
            <option value="rented">Rented</option>
          </select>
        </div>
        <div>
          <label for="property-images" class="block text-sm font-medium text-gray-700">Images</label>
          <input
            id="property-images"
            type="file"
            multiple
            accept="image/*"
            class="mt-1 block w-full"
          />
        </div>
      </div>
    {/if}

    <!-- Navigation Buttons -->
    <div class="mt-8 flex justify-between">
      <button
        class="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
        onclick={handleBack}
        disabled={step === 1}
      >
        Back
      </button>
      
      <button
        class="px-4 py-2 bg-blue-500 text-white rounded-md text-sm font-medium hover:bg-blue-600"
        onclick={step === totalSteps ? handleSubmit : handleNext}
      >
        {step === totalSteps ? 'Submit' : 'Next'}
      </button>
    </div>
  </div>

  <!-- Preview -->
  <div class="mt-8">
    <h2 class="text-xl font-bold mb-4">Preview</h2>
    <PropertyListingCard {card} {property} />
  </div>
</div> 
