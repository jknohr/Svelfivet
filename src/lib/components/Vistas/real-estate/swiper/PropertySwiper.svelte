<script lang="ts">
import Swiper from '$lib/components/common/swiper/Swiper.svelte';
import PropertyCard from '../cards/PropertyCard.svelte';
import type { Property } from '$lib/schema/real-estate/property';
import type { Card, PropertyCardContent } from '$lib/components/common/molecules/cards/cards';
import type { Snippet } from 'svelte';

let {
  properties = [],
  loading = false,
  error = null
} = $props<{
  properties: Property[];
  loading?: boolean;
  error?: string | null;
}>();

function renderItem(property: Property): Snippet {
  const card: Card & { content: PropertyCardContent } = {
    id: property.id,
    title: property.title,
    size: {
      width: '100%',
      height: 'auto'
    },
    content: {
      type: 'property',
      title: property.title,
      images: property.media.images,
      price: property.price.amount,
      location: {
        address: property.location.address,
        coordinates: [property.location.coordinates.lng, property.location.coordinates.lat]
      },
      features: property.features.amenities,
      contact: {
        name: property.agent.ref.name
      }
    }
  };

  return () => ({
    component: PropertyCard,
    props: {
      card,
      isAdmin: false,
      showFullDetails: false,
      onContact: (data: { id: string; type: 'email' | 'phone' }) => console.log('Contact', data.id, data.type),
      onView: (data: { id: string }) => console.log('View', data.id),
      onSave: (data: { id: string; content: PropertyCardContent }) => console.log('Save', data.id, data.content),
      onDelete: (data: { id: string }) => console.log('Delete', data.id)
    }
  });
}

function handleLike(event: CustomEvent<Property>) {
  console.log('like', event.detail);
}

function handleDislike(event: CustomEvent<Property>) {
  console.log('dislike', event.detail);
}
</script>

<Swiper
  {loading}
  {error}
  items={properties}
  {renderItem}
  on:like={handleLike}
  on:dislike={handleDislike}
/> 
