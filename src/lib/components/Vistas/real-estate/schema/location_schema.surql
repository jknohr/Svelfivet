-- Define main location tables
DEFINE TABLE location SCHEMAFULL;
DEFINE FIELD geometry ON location TYPE object;
DEFINE FIELD formatted_address ON location TYPE string;
DEFINE FIELD place_type ON location TYPE array;
DEFINE FIELD original_id ON location TYPE string;
DEFINE FIELD created_at ON location TYPE datetime;
DEFINE FIELD updated_at ON location TYPE datetime;

-- Define ownership relationship tables
DEFINE TABLE location_ownership SCHEMAFULL;
DEFINE FIELD ownership_type ON location_ownership TYPE string;
DEFINE FIELD country_code ON location_ownership TYPE string;
DEFINE FIELD rights ON location_ownership TYPE object;
DEFINE FIELD created_at ON location_ownership TYPE datetime;

-- Define administrative levels
DEFINE TABLE administrative_level SCHEMAFULL;
DEFINE FIELD level_type ON administrative_level TYPE string;
DEFINE FIELD name ON administrative_level TYPE string;
DEFINE FIELD code ON administrative_level TYPE string;
DEFINE FIELD created_at ON administrative_level TYPE datetime;

-- Define property metadata
DEFINE TABLE property_metadata SCHEMAFULL;
DEFINE FIELD property_type ON property_metadata TYPE string;
DEFINE FIELD tax_info ON property_metadata TYPE object;
DEFINE FIELD restrictions ON property_metadata TYPE array;
DEFINE FIELD created_at ON property_metadata TYPE datetime;

-- Define relationships
DEFINE TABLE has_ownership SCHEMAFULL;
DEFINE FIELD in ON has_ownership TYPE record(location);
DEFINE FIELD out ON has_ownership TYPE record(location_ownership);
DEFINE INDEX has_ownership_idx ON TABLE has_ownership COLUMNS in, out;

DEFINE TABLE has_admin_level SCHEMAFULL;
DEFINE FIELD in ON has_admin_level TYPE record(location);
DEFINE FIELD out ON has_admin_level TYPE record(administrative_level);
DEFINE INDEX has_admin_level_idx ON TABLE has_admin_level COLUMNS in, out;

DEFINE TABLE has_property_metadata SCHEMAFULL;
DEFINE FIELD in ON has_property_metadata TYPE record(location);
DEFINE FIELD out ON has_property_metadata TYPE record(property_metadata);
DEFINE INDEX has_property_metadata_idx ON TABLE has_property_metadata COLUMNS in, out;

-- Define spatial indices
DEFINE INDEX location_geo ON location FIELDS geometry TYPE geospatial;

-- Add version tracking
DEFINE TABLE location_version SCHEMAFULL;
DEFINE FIELD version ON location_version TYPE number;
DEFINE FIELD changes ON location_version TYPE object;
DEFINE FIELD created_at ON location_version TYPE datetime;

-- Add event tracking
DEFINE TABLE location_event SCHEMAFULL;
DEFINE FIELD event_type ON location_event TYPE string;
DEFINE FIELD timestamp ON location_event TYPE datetime;
DEFINE FIELD data ON location_event TYPE object;

-- Add processing state tracking
DEFINE TABLE location_processing SCHEMAFULL;
DEFINE FIELD status ON location_processing TYPE string;
DEFINE FIELD status ON location_processing ASSERT $value INSIDE ['PENDING', 'PROCESSING', 'COMPLETED', 'ERROR'];
DEFINE FIELD metadata ON location_processing TYPE object;
DEFINE FIELD created_at ON location_processing TYPE datetime;
DEFINE FIELD updated_at ON location_processing TYPE datetime;

-- Add validation tracking
DEFINE TABLE location_validation SCHEMAFULL;
DEFINE FIELD is_valid ON location_validation TYPE bool;
DEFINE FIELD validation_type ON location_validation TYPE string;
DEFINE FIELD validation_result ON location_validation TYPE object;
DEFINE FIELD created_at ON location_validation TYPE datetime;

-- Add relationships to listing
DEFINE TABLE location_has_listing SCHEMAFULL;
DEFINE FIELD in ON location_has_listing TYPE record(location);
DEFINE FIELD out ON location_has_listing TYPE record(listing);
DEFINE INDEX location_listing_idx ON TABLE location_has_listing COLUMNS in, out;

-- Add version tracking relationship
DEFINE TABLE has_location_version SCHEMAFULL;
DEFINE FIELD in ON has_location_version TYPE record(location);
DEFINE FIELD out ON has_location_version TYPE record(location_version);
DEFINE INDEX location_version_idx ON TABLE has_location_version COLUMNS in, out;

-- Add event tracking relationship
DEFINE TABLE has_location_event SCHEMAFULL;
DEFINE FIELD in ON has_location_event TYPE record(location);
DEFINE FIELD out ON has_location_event TYPE record(location_event);
DEFINE INDEX location_event_idx ON TABLE has_location_event COLUMNS in, out;

-- Add processing tracking relationship
DEFINE TABLE has_location_processing SCHEMAFULL;
DEFINE FIELD in ON has_location_processing TYPE record(location);
DEFINE FIELD out ON has_location_processing TYPE record(location_processing);
DEFINE INDEX location_processing_idx ON TABLE has_location_processing COLUMNS in, out;

-- Add validation tracking relationship
DEFINE TABLE has_location_validation SCHEMAFULL;
DEFINE FIELD in ON has_location_validation TYPE record(location);
DEFINE FIELD out ON has_location_validation TYPE record(location_validation);
DEFINE INDEX location_validation_idx ON TABLE has_location_validation COLUMNS in, out;

-- Add geographical relationships
DEFINE TABLE location_hierarchy SCHEMAFULL;
DEFINE FIELD parent_id ON location_hierarchy TYPE record(location);
DEFINE FIELD child_id ON location_hierarchy TYPE record(location);
DEFINE FIELD relationship_type ON location_hierarchy TYPE string;
DEFINE INDEX location_hierarchy_idx ON TABLE location_hierarchy COLUMNS parent_id, child_id;

-- Add image relationships
DEFINE TABLE location_has_image SCHEMAFULL;
DEFINE FIELD in ON location_has_image TYPE record(location);
DEFINE FIELD out ON location_has_image TYPE record(image);
DEFINE FIELD image_type ON location_has_image TYPE string;
DEFINE INDEX location_image_idx ON TABLE location_has_image COLUMNS in, out;

-- Add analysis relationships
DEFINE TABLE location_has_analysis SCHEMAFULL;
DEFINE FIELD in ON location_has_analysis TYPE record(location);
DEFINE FIELD out ON location_has_analysis TYPE record(analysis);
DEFINE INDEX location_analysis_idx ON TABLE location_has_analysis COLUMNS in, out;

-- Add sequence tracking
DEFINE TABLE location_sequence SCHEMAFULL;
DEFINE FIELD sequence_type ON location_sequence TYPE string;
DEFINE FIELD order ON location_sequence TYPE number;
DEFINE FIELD created_at ON location_sequence TYPE datetime;

-- Add batch processing
DEFINE TABLE location_batch SCHEMAFULL;
DEFINE FIELD batch_id ON location_batch TYPE string;
DEFINE FIELD status ON location_batch TYPE string;
DEFINE FIELD created_at ON location_batch TYPE datetime;
