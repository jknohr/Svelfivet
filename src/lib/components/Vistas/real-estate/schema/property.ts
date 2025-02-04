import type { BaseUser } from '../common/user';

export interface Property {
  id: string;
  title: string;
  description: string;
  type: 'house' | 'apartment' | 'land' | 'commercial';
  status: 'available' | 'pending' | 'sold' | 'rented';
  price: {
    amount: number;
    currency: string;
    type: 'sale' | 'rent';
    period?: 'monthly' | 'yearly';
  };
  location: {
    address: string;
    city: string;
    state: string;
    country: string;
    coordinates: {
      lat: number;
      lng: number;
    };
  };
  features: {
    bedrooms?: number;
    bathrooms?: number;
    area: {
      size: number;
      unit: 'sqft' | 'sqm';
    };
    amenities: string[];
  };
  media: {
    images: string[];
    videos?: string[];
    virtualTour?: string;
  };
  agent: {
    id: string;
    ref: BaseUser;
  };
  created: string;
  updated: string;
}

export const PROPERTY_SCHEMA = `
  DEFINE TABLE property SCHEMAFULL;
  
  DEFINE FIELD title ON property TYPE string;
  DEFINE FIELD description ON property TYPE string;
  DEFINE FIELD type ON property TYPE string ASSERT $value IN ['house', 'apartment', 'land', 'commercial'];
  DEFINE FIELD status ON property TYPE string ASSERT $value IN ['available', 'pending', 'sold', 'rented'];
  
  DEFINE FIELD price ON property TYPE object {
    amount: number,
    currency: string,
    type: string ASSERT $value IN ['sale', 'rent'],
    period: string | null ASSERT $value == NULL OR $value IN ['monthly', 'yearly']
  };
  
  DEFINE FIELD location ON property TYPE object {
    address: string,
    city: string,
    state: string,
    country: string,
    coordinates: object {
      lat: float,
      lng: float
    }
  };
  
  DEFINE FIELD features ON property TYPE object {
    bedrooms: int | null,
    bathrooms: int | null,
    area: object {
      size: float,
      unit: string ASSERT $value IN ['sqft', 'sqm']
    },
    amenities: array
  };
  
  DEFINE FIELD media ON property TYPE object {
    images: array,
    videos: array | null,
    virtualTour: string | null
  };
  
  DEFINE FIELD agent ON property TYPE object {
    id: string,
    ref: record(user)
  };
  
  DEFINE FIELD created ON property TYPE datetime DEFAULT time::now();
  DEFINE FIELD updated ON property TYPE datetime DEFAULT time::now();

  DEFINE INDEX propertyLocationIndex ON property FIELDS location.city, location.state;
  DEFINE INDEX propertyTypeIndex ON property FIELDS type;
  DEFINE INDEX propertyStatusIndex ON property FIELDS status;
  DEFINE INDEX propertyPriceIndex ON property FIELDS price.amount, price.type;
`; 