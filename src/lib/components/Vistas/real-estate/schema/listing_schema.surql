-- Define main tables
DEFINE TABLE listing SCHEMAFULL;
DEFINE FIELD listing_id ON listing TYPE string;
DEFINE FIELD user_id ON listing TYPE string;
DEFINE FIELD title ON listing TYPE string;
DEFINE FIELD status ON listing TYPE string;
DEFINE FIELD status ON listing ASSERT $value INSIDE ['OPEN', 'UPLOADING', 'PREPROCESSING', 'ENRICHMENT', 'POSTPROCESSING', 'STORING', 'COMPLETED', 'ERROR'];
DEFINE FIELD created_at ON listing TYPE datetime;
DEFINE FIELD updated_at ON listing TYPE datetime;
DEFINE FIELD images ON listing TYPE array;
DEFINE FIELD batch_id ON listing TYPE string;

DEFINE TABLE property_details SCHEMAFULL;
DEFINE FIELD property_type ON property_details TYPE string;
DEFINE FIELD property_type ON property_details ASSERT $value INSIDE ['APARTMENT', 'CONDOMINIUM', 'TOWNHOUSE', 'VILLA', 'LAND', 'COMMERCIAL'];
DEFINE FIELD furnishing ON property_details TYPE string;
DEFINE FIELD furnishing ON property_details ASSERT $value INSIDE ['FULLY_FURNISHED', 'PARTIALLY_FURNISHED', 'UNFURNISHED', 'NEGOTIABLE'];
DEFINE FIELD condition ON property_details TYPE string;
DEFINE FIELD condition ON property_details ASSERT $value INSIDE ['NEW', 'AS_NEW', 'GOOD', 'FAIR', 'POOR'];
DEFINE FIELD views ON property_details TYPE array;
DEFINE FIELD parking ON property_details TYPE object;
DEFINE FIELD created_at ON property_details TYPE datetime;

DEFINE TABLE price SCHEMAFULL;
DEFINE FIELD amount ON price TYPE number;
DEFINE FIELD currency ON price TYPE string;
DEFINE FIELD currency ON price ASSERT $value INSIDE ['USD', 'EUR', 'GBP'];
DEFINE FIELD price_type ON price TYPE string;
DEFINE FIELD price_type ON price ASSERT $value INSIDE ['ASKING_PRICE', 'LONG_TERM_RENTAL', 'SHORT_TERM_RENTAL'];
DEFINE FIELD created_at ON price TYPE datetime;

DEFINE TABLE property_dimensions SCHEMAFULL;
DEFINE FIELD bedrooms ON property_dimensions TYPE number;
DEFINE FIELD bathrooms ON property_dimensions TYPE number;
DEFINE FIELD indoor_area ON property_dimensions TYPE number;
DEFINE FIELD outdoor_area ON property_dimensions TYPE number;
DEFINE FIELD plot_size ON property_dimensions TYPE number;
DEFINE FIELD created_at ON property_dimensions TYPE datetime;

DEFINE TABLE listing_batch SCHEMAFULL;
DEFINE FIELD batch_id ON listing_batch TYPE string;
DEFINE FIELD status ON listing_batch TYPE string;
DEFINE FIELD total_images ON listing_batch TYPE number;
DEFINE FIELD processed_images ON listing_batch TYPE number;
DEFINE FIELD failed_images ON listing_batch TYPE number;
DEFINE FIELD created_at ON listing_batch TYPE datetime;
DEFINE FIELD updated_at ON listing_batch TYPE datetime;

DEFINE TABLE listing_api_key SCHEMAFULL;
DEFINE FIELD api_key ON listing_api_key TYPE string;
DEFINE FIELD created_at ON listing_api_key TYPE datetime;
DEFINE FIELD expires_at ON listing_api_key TYPE datetime;
DEFINE FIELD revoked ON listing_api_key TYPE bool;

-- Define relationships (edges)
DEFINE TABLE has_details SCHEMAFULL;
DEFINE FIELD in ON has_details TYPE record(listing);
DEFINE FIELD out ON has_details TYPE record(property_details);
DEFINE INDEX has_details_idx ON TABLE has_details COLUMNS in, out;

DEFINE TABLE has_price SCHEMAFULL;
DEFINE FIELD in ON has_price TYPE record(listing);
DEFINE FIELD out ON has_price TYPE record(price);
DEFINE INDEX has_price_idx ON TABLE has_price COLUMNS in, out;

DEFINE TABLE has_dimension SCHEMAFULL;
DEFINE FIELD in ON has_dimension TYPE record(listing);
DEFINE FIELD out ON has_dimension TYPE record(property_dimensions);
DEFINE INDEX has_dimension_idx ON TABLE has_dimension COLUMNS in, out;

DEFINE TABLE has_batch SCHEMAFULL;
DEFINE FIELD in ON has_batch TYPE record(listing);
DEFINE FIELD out ON has_batch TYPE record(listing_batch);
DEFINE INDEX has_batch_idx ON TABLE has_batch COLUMNS in, out;

DEFINE TABLE has_api_key SCHEMAFULL;
DEFINE FIELD in ON has_api_key TYPE record(listing);
DEFINE FIELD out ON has_api_key TYPE record(listing_api_key);
DEFINE INDEX has_api_key_idx ON TABLE has_api_key COLUMNS in, out;

-- Define relationship with image relationships
DEFINE TABLE has_image_relationship SCHEMAFULL;
DEFINE FIELD in ON has_image_relationship TYPE record(listing);
DEFINE FIELD out ON has_image_relationship TYPE record(listing_relationship);
DEFINE INDEX has_image_rel_idx ON TABLE has_image_relationship COLUMNS in, out;

-- Add metadata tracking
DEFINE TABLE entity_metadata SCHEMAFULL;
DEFINE FIELD created_by ON entity_metadata TYPE string;
DEFINE FIELD modified_by ON entity_metadata TYPE string;
DEFINE FIELD version ON entity_metadata TYPE number;
DEFINE FIELD is_active ON entity_metadata TYPE bool;
DEFINE FIELD created_at ON entity_metadata TYPE datetime;
DEFINE FIELD updated_at ON entity_metadata TYPE datetime;

DEFINE TABLE has_metadata SCHEMAFULL;
DEFINE FIELD in ON has_metadata TYPE record;
DEFINE FIELD out ON has_metadata TYPE record(entity_metadata);
DEFINE INDEX has_metadata_idx ON TABLE has_metadata COLUMNS in, out;

-- Add location table
DEFINE TABLE location SCHEMAFULL;
DEFINE FIELD coordinates ON location TYPE geometry;
DEFINE FIELD address ON location TYPE string;
DEFINE FIELD country ON location TYPE string;
DEFINE FIELD city ON location TYPE string;
DEFINE INDEX location_geo ON location FIELDS coordinates;

-- Modify owner information table
DEFINE TABLE owner_info SCHEMAFULL;
DEFINE FIELD user_id ON owner_info TYPE string;
DEFINE FIELD fullname ON owner_info TYPE string;
DEFINE FIELD email ON owner_info TYPE string;
DEFINE FIELD phone_number ON owner_info TYPE string;
DEFINE FIELD country ON owner_info TYPE string;
DEFINE FIELD created_at ON owner_info TYPE datetime;
DEFINE FIELD updated_at ON owner_info TYPE datetime;
DEFINE INDEX owner_user_idx ON owner_info FIELDS user_id;

-- Add user to owner relationship
DEFINE TABLE user_has_owner SCHEMAFULL;
DEFINE FIELD in ON user_has_owner TYPE string;  -- user_id
DEFINE FIELD out ON user_has_owner TYPE record(owner_info);
DEFINE INDEX user_owner_idx ON TABLE user_has_owner COLUMNS in, out;

-- Add batch relationship table
DEFINE TABLE batch_relationship SCHEMAFULL;
DEFINE FIELD batch_id ON batch_relationship TYPE string;
DEFINE FIELD batch_type ON batch_relationship ASSERT $value INSIDE ['INITIAL', 'UPDATE', 'REPLACEMENT', 'ADDITIONAL'];
DEFINE FIELD status ON batch_relationship ASSERT $value INSIDE ['ACTIVE', 'ARCHIVED', 'DELETED'];
DEFINE FIELD image_count ON batch_relationship TYPE number;
DEFINE FIELD created_at ON batch_relationship TYPE datetime;

-- Add image relationship table
DEFINE TABLE image_relationship SCHEMAFULL;
DEFINE FIELD image_id ON image_relationship TYPE string;
DEFINE FIELD batch_id ON image_relationship TYPE option<string>;
DEFINE FIELD content_type ON image_relationship ASSERT $value INSIDE ['INTERIOR', 'EXTERIOR', 'DOCUMENT'] OR type::is::string($value);
DEFINE FIELD is_primary ON image_relationship TYPE bool;
DEFINE FIELD order ON image_relationship TYPE number;
DEFINE FIELD created_at ON image_relationship TYPE datetime;

-- Additional relationships
DEFINE TABLE has_location SCHEMAFULL;
DEFINE FIELD in ON has_location TYPE record(listing);
DEFINE FIELD out ON has_location TYPE record(location);
DEFINE INDEX has_location_idx ON TABLE has_location COLUMNS in, out;

-- Modify has_owner to include user reference
DEFINE TABLE has_owner SCHEMAFULL;
DEFINE FIELD in ON has_owner TYPE record(listing);
DEFINE FIELD out ON has_owner TYPE record(owner_info);
DEFINE FIELD user_id ON has_owner TYPE string;
DEFINE INDEX has_owner_idx ON TABLE has_owner COLUMNS in, out, user_id;

DEFINE TABLE has_batch_relationship SCHEMAFULL;
DEFINE FIELD in ON has_batch_relationship TYPE record(listing);
DEFINE FIELD out ON has_batch_relationship TYPE record(batch_relationship);
DEFINE INDEX has_batch_rel_idx ON TABLE has_batch_relationship COLUMNS in, out;

-- Event tracking
DEFINE TABLE listing_event SCHEMAFULL;
DEFINE FIELD event_type ON listing_event TYPE string;
DEFINE FIELD timestamp ON listing_event TYPE datetime;
DEFINE FIELD data ON listing_event TYPE object;

DEFINE TABLE has_event SCHEMAFULL;
DEFINE FIELD in ON has_event TYPE record(listing);
DEFINE FIELD out ON has_event TYPE record(listing_event);
DEFINE INDEX has_event_idx ON TABLE has_event COLUMNS in, out;

-- Version tracking
DEFINE TABLE listing_version SCHEMAFULL;
DEFINE FIELD version ON listing_version TYPE number;
DEFINE FIELD changes ON listing_version TYPE object;
DEFINE FIELD created_at ON listing_version TYPE datetime;

DEFINE TABLE has_version SCHEMAFULL;
DEFINE FIELD in ON has_version TYPE record(listing);
DEFINE FIELD out ON has_version TYPE record(listing_version);
DEFINE INDEX has_version_idx ON TABLE has_version COLUMNS in, out;
