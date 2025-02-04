-- Core image structure
DEFINE TABLE image SCHEMAFULL;
DEFINE FIELD image_id ON image TYPE string;
DEFINE FIELD listing_id ON image TYPE string;
DEFINE FIELD content_type ON image TYPE object;
DEFINE FIELD metadata.technical_info ON image TYPE object {
    size_bytes: number,
    width: number ASSERT $value > 0,
    height: number ASSERT $value > 0,
    format: string,
    color_space: string,
    has_alpha: bool,
    dpi: optional<number>
};
DEFINE FIELD urls ON image TYPE object {
    original: string,
    thumbnail: string,
    medium: string,
    large: string
};
DEFINE FIELD created_at ON image TYPE datetime;
DEFINE FIELD updated_at ON image TYPE datetime;
ALTER TABLE image ADD COLUMN upload_session_id optional<string>;
ALTER TABLE image ADD COLUMN semantic_analysis record(image_semantic_analysis);
ALTER TABLE image ADD COLUMN batch_info record(batch_processing_info);

-- Add missing constraints to existing tables
ALTER TABLE image ADD CONSTRAINT valid_storage 
    ASSERT EXISTS(SELECT * FROM storage_to_image WHERE image_id = $this.id);

-- Quality metrics table
DEFINE TABLE image_quality SCHEMAFULL;
DEFINE FIELD image_id ON image_quality TYPE record(image);
DEFINE FIELD metrics ON image_quality TYPE object {
    image_quality_score: number,
    composition_score: number,
    lighting_score: number,
    clarity_score: number,
    professional_appeal_score: number,
    technical_quality_score: number
};

-- Processing tracking
DEFINE TABLE image_processing SCHEMAFULL;
DEFINE FIELD image_id ON image_processing TYPE record(image);
DEFINE FIELD stage ON image_processing TYPE string 
    ASSERT $value IN ['upload', 'analysis', 'optimization', 'semantic', 'metadata', 'validation', 'complete'];
DEFINE FIELD metrics ON image_processing TYPE object {
    progress: number,
    started_at: datetime,
    completed_at: optional<datetime>,
    duration_ms: number
};

-- Validation tracking
DEFINE TABLE image_validation SCHEMAFULL;
DEFINE FIELD validation_id ON image_validation TYPE string;
DEFINE FIELD image_id ON image_validation TYPE record(image);
DEFINE FIELD checks ON image_validation TYPE array;
DEFINE FIELD overall_status ON image_validation TYPE string 
    ASSERT $value IN ['passed', 'warning', 'failed'];
DEFINE FIELD created_at ON image_validation TYPE datetime;

-- Event logging
DEFINE TABLE image_event SCHEMAFULL;
DEFINE FIELD event_id ON image_event TYPE string;
DEFINE FIELD image_id ON image_event TYPE record(image);
DEFINE FIELD event_type ON image_event TYPE string;
DEFINE FIELD details ON image_event TYPE object;
DEFINE FIELD created_at ON image_event TYPE datetime;

-- Add missing semantic object definitions
DEFINE TABLE semantic_object SCHEMAFULL;
DEFINE FIELD object_id ON semantic_object TYPE string;
DEFINE FIELD label ON semantic_object TYPE string;
DEFINE FIELD category ON semantic_object TYPE string;
DEFINE FIELD confidence ON semantic_object TYPE float;
DEFINE FIELD bounding_box ON semantic_object TYPE object {
    x: float,
    y: float,
    width: float,
    height: float
};
DEFINE FIELD attributes ON semantic_object TYPE array;

-- Add batch processing relationships
DEFINE TABLE batch_processing SCHEMAFULL;
DEFINE FIELD batch_id ON batch_processing TYPE string;
DEFINE FIELD listing_id ON batch_processing TYPE string;
DEFINE FIELD images ON batch_processing TYPE array<record(image)>;
DEFINE FIELD status ON batch_processing TYPE string 
    ASSERT $value IN ['pending', 'processing', 'completed', 'failed', 'cancelled'];
DEFINE FIELD created_at ON batch_processing TYPE datetime;
DEFINE FIELD updated_at ON batch_processing TYPE datetime;

-- Add missing constraints to existing tables
ALTER TABLE batch_processing ADD CONSTRAINT valid_metrics 
    ASSERT EXISTS(SELECT * FROM batch_operation_metrics WHERE batch_id = $this.batch_id);

-- Add upload session tracking
DEFINE TABLE upload_session SCHEMAFULL;
DEFINE FIELD session_id ON upload_session TYPE string;
DEFINE FIELD listing_id ON upload_session TYPE string;
DEFINE FIELD status ON upload_session TYPE string;
DEFINE FIELD chunks_received ON upload_session TYPE number;
DEFINE FIELD total_chunks ON upload_session TYPE number;
DEFINE FIELD created_at ON upload_session TYPE datetime;
DEFINE FIELD updated_at ON upload_session TYPE datetime;

-- Add room attribute definitions
DEFINE TABLE room_attribute SCHEMAFULL;
DEFINE FIELD attribute_type ON room_attribute TYPE string 
    ASSERT $value IN ['style', 'condition', 'lighting', 'space', 'maintenance', 'modernization'];
DEFINE FIELD value ON room_attribute TYPE string;
DEFINE FIELD confidence ON room_attribute TYPE float;

-- Add format configuration
DEFINE TABLE processing_config SCHEMAFULL;
DEFINE FIELD format ON processing_config TYPE object {
    type: string ASSERT $value IN ['jpeg', 'png', 'webp', 'avif'],
    quality: number ASSERT $value > 0 AND $value <= 100,
    compression: optional<number>
};
DEFINE FIELD optimize_images ON processing_config TYPE bool;
DEFINE FIELD max_dimension ON processing_config TYPE number;
DEFINE FIELD generate_thumbnails ON processing_config TYPE bool;
DEFINE FIELD run_analysis ON processing_config TYPE bool;

-- Add analysis results structure
DEFINE TABLE analysis_results SCHEMAFULL;
DEFINE FIELD image_id ON analysis_results TYPE record(image);
DEFINE FIELD quality_score ON analysis_results TYPE float;
DEFINE FIELD brightness ON analysis_results TYPE float;
DEFINE FIELD contrast ON analysis_results TYPE float;
DEFINE FIELD sharpness ON analysis_results TYPE float;
DEFINE FIELD scene_type ON analysis_results TYPE string;
DEFINE FIELD color_palette ON analysis_results TYPE array;

-- Add batch statistics tracking
DEFINE TABLE batch_stats SCHEMAFULL;
DEFINE FIELD batch_id ON batch_stats TYPE string;
DEFINE FIELD total_images ON batch_stats TYPE number;
DEFINE FIELD processed_images ON batch_stats TYPE number;
DEFINE FIELD failed_images ON batch_stats TYPE number;
DEFINE FIELD total_size_bytes ON batch_stats TYPE number;
DEFINE FIELD processing_time_ms ON batch_stats TYPE number;

-- Add batch image tracking
DEFINE TABLE batch_image SCHEMAFULL;
DEFINE FIELD image_id ON batch_image TYPE string;
DEFINE FIELD original_filename ON batch_image TYPE string;
DEFINE FIELD status ON batch_image TYPE string 
    ASSERT $value IN ['queued', 'uploading', 'processing', 'analyzing', 'optimizing', 'completed', 'failed'];
DEFINE FIELD metadata ON batch_image TYPE object;
DEFINE FIELD error ON batch_image TYPE string;

-- Add image processing status tracking
DEFINE TABLE image_processing_status SCHEMAFULL;
DEFINE FIELD image_id ON image_processing_status TYPE string;
DEFINE FIELD status ON image_processing_status TYPE string;
DEFINE FIELD error ON image_processing_status TYPE string;
DEFINE FIELD updated_at ON image_processing_status TYPE datetime;

-- Add object attribute definitions
DEFINE TABLE object_attribute SCHEMAFULL;
DEFINE FIELD name ON object_attribute TYPE string;
DEFINE FIELD value ON object_attribute TYPE string;
DEFINE FIELD confidence ON object_attribute TYPE float;

-- Add semantic quality metrics
DEFINE TABLE semantic_quality_metrics SCHEMAFULL;
DEFINE FIELD image_id ON semantic_quality_metrics TYPE record(image);
DEFINE FIELD semantic_quality_score ON semantic_quality_metrics TYPE float;
DEFINE FIELD semantic_lighting_vector ON semantic_quality_metrics TYPE array;
DEFINE FIELD semantic_composition_vector ON semantic_quality_metrics TYPE array;
DEFINE FIELD semantic_clarity_vector ON semantic_quality_metrics TYPE array;
DEFINE FIELD semantic_appeal_vector ON semantic_quality_metrics TYPE array;
DEFINE FIELD aggregate_quality_vector ON semantic_quality_metrics TYPE array;

-- Add image relationships table
DEFINE TABLE image_relation SCHEMAFULL;
DEFINE FIELD image_id ON image_relation TYPE record(image);
DEFINE FIELD related_image_id ON image_relation TYPE record(image);
DEFINE FIELD relation_type ON image_relation TYPE string 
    ASSERT $value IN ['similar', 'duplicate', 'before_after', 'same_room', 'same_view', 'custom'];
DEFINE FIELD confidence ON image_relation TYPE float;
DEFINE FIELD metadata ON image_relation TYPE object;

-- Add relationship constraints
DEFINE FIELD image_id ON image_relation TYPE record(image) ASSERT $value != NONE;
DEFINE FIELD related_image_id ON image_relation TYPE record(image) ASSERT $value != NONE;
DEFINE FIELD confidence ON image_relation TYPE float ASSERT $value >= 0 AND $value <= 1;

-- Add image sequence tracking
DEFINE TABLE image_sequence SCHEMAFULL;
DEFINE FIELD sequence_id ON image_sequence TYPE string;
DEFINE FIELD images ON image_sequence TYPE array<record(image)>;
DEFINE FIELD sequence_type ON image_sequence TYPE string 
    ASSERT $value IN ['time_series', 'panoramic_view', 'before_after', 'room_tour', 'custom'];
DEFINE FIELD metadata ON image_sequence TYPE object;
DEFINE FIELD created_at ON image_sequence TYPE datetime;

-- Add image grouping
DEFINE TABLE image_group SCHEMAFULL;
DEFINE FIELD group_id ON image_group TYPE string;
DEFINE FIELD name ON image_group TYPE string;
DEFINE FIELD description ON image_group TYPE string;
DEFINE FIELD images ON image_group TYPE array<record(image)>;
DEFINE FIELD group_type ON image_group TYPE string
    ASSERT $value IN ['room', 'view', 'feature', 'highlight', 'custom'];
DEFINE FIELD metadata ON image_group TYPE object;
DEFINE FIELD created_at ON image_group TYPE datetime;
DEFINE FIELD updated_at ON image_group TYPE datetime;

-- Core relationships
DEFINE TABLE image_metadata SCHEMAFULL;
DEFINE FIELD image_id ON image_metadata TYPE record(image);
DEFINE FIELD technical_info ON image_metadata TYPE object;
DEFINE FIELD analysis_results ON image_metadata TYPE object;

-- Add missing scene analysis fields
DEFINE TABLE scene_analysis SCHEMAFULL;
DEFINE FIELD image_id ON scene_analysis TYPE record(image);
DEFINE FIELD lighting_conditions ON scene_analysis TYPE object {
    lighting_type: string ASSERT $value IN ['natural', 'artificial', 'mixed', 'unknown'],
    brightness_level: float,
    color_temperature: optional<number>
};
DEFINE FIELD room_dimensions ON scene_analysis TYPE object;
DEFINE FIELD perspective_info ON scene_analysis TYPE object;

-- Add room dimension tracking
DEFINE TABLE room_dimensions SCHEMAFULL;
DEFINE FIELD image_id ON room_dimensions TYPE record(image);
DEFINE FIELD width ON room_dimensions TYPE float;
DEFINE FIELD length ON room_dimensions TYPE float;
DEFINE FIELD height ON room_dimensions TYPE float;
DEFINE FIELD unit ON room_dimensions TYPE string
    ASSERT $value IN ['meters', 'feet', 'pixels'];
DEFINE FIELD confidence ON room_dimensions TYPE float;

-- Add perspective tracking
DEFINE TABLE perspective_info SCHEMAFULL;
DEFINE FIELD image_id ON perspective_info TYPE record(image);
DEFINE FIELD camera_height ON perspective_info TYPE float;
DEFINE FIELD camera_angle ON perspective_info TYPE float;
DEFINE FIELD distortion_factor ON perspective_info TYPE optional<float>;
DEFINE FIELD confidence ON perspective_info TYPE float;

-- Add color analysis tracking
DEFINE TABLE color_analysis SCHEMAFULL;
DEFINE FIELD image_id ON color_analysis TYPE record(image);
DEFINE FIELD dominant_colors ON color_analysis TYPE array;
DEFINE FIELD color_scheme ON color_analysis TYPE string 
    ASSERT $value IN ['monochromatic', 'analogous', 'complementary', 'triadic', 'other'];
DEFINE FIELD created_at ON color_analysis TYPE datetime;

-- Add depth analysis tracking
DEFINE TABLE scene_depth SCHEMAFULL;
DEFINE FIELD image_id ON scene_depth TYPE record(image);
DEFINE FIELD depth_map ON scene_depth TYPE array;
DEFINE FIELD focal_points ON scene_depth TYPE array;
DEFINE FIELD depth_confidence ON scene_depth TYPE float;

-- Add color harmony tracking
DEFINE TABLE color_harmony SCHEMAFULL;
DEFINE FIELD image_id ON color_harmony TYPE record(image);
DEFINE FIELD harmony_type ON color_harmony TYPE string 
    ASSERT $value IN ['balanced', 'contrasting', 'disharmonious', 'neutral', 'custom'];
DEFINE FIELD custom_value ON color_harmony TYPE string;

-- Add point tracking for focal points
DEFINE TABLE point2d SCHEMAFULL;
DEFINE FIELD x ON point2d TYPE float;
DEFINE FIELD y ON point2d TYPE float;

-- Add detailed color analysis tracking
DEFINE TABLE color_distribution SCHEMAFULL;
DEFINE FIELD image_id ON color_distribution TYPE record(image);
DEFINE FIELD color ON color_distribution TYPE object {
    r: number ASSERT $value >= 0 AND $value <= 255,
    g: number ASSERT $value >= 0 AND $value <= 255,
    b: number ASSERT $value >= 0 AND $value <= 255
};
DEFINE FIELD percentage ON color_distribution TYPE float 
    ASSERT $value >= 0 AND $value <= 100;
DEFINE FIELD location ON color_distribution TYPE array;

-- Add dominant color tracking
DEFINE TABLE dominant_color SCHEMAFULL;
DEFINE FIELD image_id ON dominant_color TYPE record(image);
DEFINE FIELD rgb ON dominant_color TYPE object;
DEFINE FIELD hsv ON dominant_color TYPE object {
    hue: float ASSERT $value >= 0 AND $value <= 360,
    saturation: float ASSERT $value >= 0 AND $value <= 100,
    value: float ASSERT $value >= 0 AND $value <= 100
};

-- Add saturation metrics tracking
DEFINE TABLE saturation_metrics SCHEMAFULL;
DEFINE FIELD image_id ON saturation_metrics TYPE record(image);
DEFINE FIELD average_saturation ON saturation_metrics TYPE float;
DEFINE FIELD saturation_variance ON saturation_metrics TYPE float;
DEFINE FIELD saturation_histogram ON saturation_metrics TYPE array;
DEFINE FIELD dominant_saturation_range ON saturation_metrics TYPE string
    ASSERT $value IN ['very_low', 'low', 'medium', 'high', 'very_high'];

-- Add color palette analysis tracking
DEFINE TABLE color_palette_analysis SCHEMAFULL;
DEFINE FIELD image_id ON color_palette_analysis TYPE record(image);
DEFINE FIELD main_palette ON color_palette_analysis TYPE array;
DEFINE FIELD accent_palette ON color_palette_analysis TYPE array;
DEFINE FIELD color_scheme_type ON color_palette_analysis TYPE string
    ASSERT $value IN ['warm', 'cool', 'neutral', 'mixed', 'custom'];
DEFINE FIELD color_emotions ON color_palette_analysis TYPE array;

-- Add composition analysis tracking
DEFINE TABLE composition_analysis SCHEMAFULL;
DEFINE FIELD image_id ON composition_analysis TYPE record(image);
DEFINE FIELD golden_ratio_score ON composition_analysis TYPE float;
DEFINE FIELD rule_of_thirds_score ON composition_analysis TYPE float;
DEFINE FIELD symmetry_score ON composition_analysis TYPE float;
DEFINE FIELD focal_points ON composition_analysis TYPE array;
DEFINE FIELD composition_type ON composition_analysis TYPE string
    ASSERT $value IN ['centered', 'rule_of_thirds', 'golden_ratio', 'diagonal', 'symmetrical', 'other'];

-- Add lighting analysis tracking
DEFINE TABLE lighting_analysis SCHEMAFULL;
DEFINE FIELD image_id ON lighting_analysis TYPE record(image);
DEFINE FIELD lighting_distribution ON lighting_analysis TYPE array;
DEFINE FIELD dominant_lighting_type ON lighting_analysis TYPE string
    ASSERT $value IN ['natural', 'artificial', 'mixed', 'unknown'];
DEFINE FIELD overall_brightness ON lighting_analysis TYPE float;
DEFINE FIELD lighting_uniformity ON lighting_analysis TYPE float;

-- Add spatial analysis tracking
DEFINE TABLE spatial_analysis SCHEMAFULL;
DEFINE FIELD image_id ON spatial_analysis TYPE record(image);
DEFINE FIELD spatial_layout ON spatial_analysis TYPE array;
DEFINE FIELD room_connectivity ON spatial_analysis TYPE array;
DEFINE FIELD floor_level ON spatial_analysis TYPE number;
DEFINE FIELD area_metrics ON spatial_analysis TYPE object;

-- Add spatial region tracking
DEFINE TABLE spatial_region SCHEMAFULL;
DEFINE FIELD region_type ON spatial_region TYPE string
    ASSERT $value IN ['room', 'hallway', 'doorway', 'window', 'other'];
DEFINE FIELD area ON spatial_region TYPE float;
DEFINE FIELD bounds ON spatial_region TYPE object;
DEFINE FIELD connections ON spatial_region TYPE array;

-- Add area metrics tracking
DEFINE TABLE area_metrics SCHEMAFULL;
DEFINE FIELD image_id ON area_metrics TYPE record(image);
DEFINE FIELD total_area ON area_metrics TYPE float;
DEFINE FIELD usable_area ON area_metrics TYPE float;
DEFINE FIELD room_ratios ON area_metrics TYPE object {
    living_area_ratio: float,
    circulation_ratio: float,
    service_area_ratio: float
};
DEFINE FIELD space_efficiency ON area_metrics TYPE float;

-- Add batch progress tracking
DEFINE TABLE batch_progress SCHEMAFULL;
DEFINE FIELD batch_id ON batch_progress TYPE string;
DEFINE FIELD current_stage ON batch_progress TYPE string
    ASSERT $value IN ['preparing', 'uploading', 'processing', 'analyzing', 'finalizing'];
DEFINE FIELD stage_progress ON batch_progress TYPE float;
DEFINE FIELD overall_progress ON batch_progress TYPE float;
DEFINE FIELD estimated_time_remaining ON batch_progress TYPE number;

-- Add metadata extraction tracking
DEFINE TABLE image_metadata_extraction SCHEMAFULL;
DEFINE FIELD image_id ON image_metadata_extraction TYPE record(image);
DEFINE FIELD exif_data ON image_metadata_extraction TYPE object {
    camera_make: optional<string>,
    camera_model: optional<string>,
    exposure_time: optional<float>,
    focal_length: optional<float>,
    iso_speed: optional<number>,
    gps_coordinates: optional<object>
};
DEFINE FIELD iptc_data ON image_metadata_extraction TYPE object;
DEFINE FIELD xmp_data ON image_metadata_extraction TYPE object;

-- Add image versioning tracking
DEFINE TABLE image_version SCHEMAFULL;
DEFINE FIELD version_id ON image_version TYPE string;
DEFINE FIELD image_id ON image_version TYPE record(image);
DEFINE FIELD version_type ON image_version TYPE string
    ASSERT $value IN ['original', 'optimized', 'preview', 'thumbnail', 'custom'];
DEFINE FIELD processing_params ON image_version TYPE object;
DEFINE FIELD created_at ON image_version TYPE datetime;

-- Define edges for graph relationships
DEFINE TABLE image_to_image SCHEMAFULL;
DEFINE FIELD source_id ON image_to_image TYPE record(image);
DEFINE FIELD target_id ON image_to_image TYPE record(image);
DEFINE FIELD relation_type ON image_to_image TYPE string;
DEFINE FIELD confidence ON image_to_image TYPE float;
DEFINE FIELD metadata ON image_to_image TYPE object;

-- Core relationships
DEFINE TABLE image_to_listing SCHEMAFULL;
DEFINE FIELD image_id ON image_to_listing TYPE record(image);
DEFINE FIELD listing_id ON image_to_listing TYPE string;
DEFINE FIELD relation_type ON image_to_listing TYPE string;
DEFINE FIELD display_order ON image_to_listing TYPE number;

-- Sequence relationships
DEFINE TABLE image_to_sequence SCHEMAFULL;
DEFINE FIELD image_id ON image_to_sequence TYPE record(image);
DEFINE FIELD sequence_id ON image_to_sequence TYPE record(image_sequence);
DEFINE FIELD order_index ON image_to_sequence TYPE number;

-- Group relationships
DEFINE TABLE image_to_group SCHEMAFULL;
DEFINE FIELD image_id ON image_to_group TYPE record(image);
DEFINE FIELD group_id ON image_to_group TYPE record(image_group);
DEFINE FIELD relation_type ON image_to_group TYPE string;

-- Batch relationships
DEFINE TABLE image_to_batch SCHEMAFULL;
DEFINE FIELD image_id ON image_to_batch TYPE record(image);
DEFINE FIELD batch_id ON image_to_batch TYPE record(batch_processing);
DEFINE FIELD status ON image_to_batch TYPE string;

-- Add missing semantic analysis relationships
DEFINE TABLE semantic_analysis_to_image SCHEMAFULL;
DEFINE FIELD image_id ON semantic_analysis_to_image TYPE record(image);
DEFINE FIELD analysis_id ON semantic_analysis_to_image TYPE record(image_semantic_analysis);
DEFINE FIELD confidence ON semantic_analysis_to_image TYPE float;

-- Add missing color analysis relationships
DEFINE TABLE color_analysis_to_image SCHEMAFULL;
DEFINE FIELD image_id ON color_analysis_to_image TYPE record(image);
DEFINE FIELD analysis_id ON color_analysis_to_image TYPE record(color_analysis);

-- Add missing spatial analysis relationships
DEFINE TABLE spatial_analysis_to_image SCHEMAFULL;
DEFINE FIELD image_id ON spatial_analysis_to_image TYPE record(image);
DEFINE FIELD analysis_id ON spatial_analysis_to_image TYPE record(spatial_analysis);

-- Add graph traversal indices
DEFINE INDEX image_to_image_source_idx ON TABLE image_to_image FIELDS source_id;
DEFINE INDEX image_to_image_target_idx ON TABLE image_to_image FIELDS target_id;
DEFINE INDEX image_to_listing_idx ON TABLE image_to_listing FIELDS image_id, listing_id;
DEFINE INDEX image_to_sequence_idx ON TABLE image_to_sequence FIELDS image_id, sequence_id;
DEFINE INDEX image_to_group_idx ON TABLE image_to_group FIELDS image_id, group_id;
DEFINE INDEX image_to_batch_idx ON TABLE image_to_batch FIELDS image_id, batch_id;

-- Add relationship constraints
DEFINE FIELD source_id ON image_to_image TYPE record(image) ASSERT $value != NONE;
DEFINE FIELD target_id ON image_to_image TYPE record(image) ASSERT $value != NONE;
DEFINE FIELD confidence ON image_to_image TYPE float ASSERT $value >= 0 AND $value <= 1;

-- Add graph metadata
DEFINE TABLE graph_metadata SCHEMAFULL;
DEFINE FIELD version ON graph_metadata TYPE string;
DEFINE FIELD last_updated ON graph_metadata TYPE datetime;
DEFINE FIELD node_count ON graph_metadata TYPE object {
    images: number,
    sequences: number,
    groups: number,
    batches: number
};
DEFINE FIELD edge_count ON graph_metadata TYPE object {
    image_to_image: number,
    image_to_listing: number,
    image_to_sequence: number,
    image_to_group: number,
    image_to_batch: number
};

-- Add metadata extraction table with relationships
DEFINE TABLE metadata_extraction_to_image SCHEMAFULL;
DEFINE FIELD image_id ON metadata_extraction_to_image TYPE record(image);
DEFINE FIELD extraction_id ON metadata_extraction_to_image TYPE record(image_metadata_extraction);
DEFINE FIELD completed_at ON metadata_extraction_to_image TYPE datetime;

-- Add version tracking with relationships
DEFINE TABLE version_to_image SCHEMAFULL;
DEFINE FIELD image_id ON version_to_image TYPE record(image);
DEFINE FIELD version_id ON version_to_image TYPE record(image_version);
DEFINE FIELD created_at ON version_to_image TYPE datetime;

-- Add processing tracking relationships
DEFINE TABLE processing_to_image SCHEMAFULL;
DEFINE FIELD image_id ON processing_to_image TYPE record(image);
DEFINE FIELD processing_id ON processing_to_image TYPE record(image_processing);
DEFINE FIELD stage ON processing_to_image TYPE string;

-- Add validation tracking relationships
DEFINE TABLE validation_to_image SCHEMAFULL;
DEFINE FIELD image_id ON validation_to_image TYPE record(image);
DEFINE FIELD validation_id ON validation_to_image TYPE record(image_validation);
DEFINE FIELD status ON validation_to_image TYPE string;

-- Add event tracking relationships
DEFINE TABLE event_to_image SCHEMAFULL;
DEFINE FIELD image_id ON event_to_image TYPE record(image);
DEFINE FIELD event_id ON event_to_image TYPE record(image_event);
DEFINE FIELD event_type ON event_to_image TYPE string;

-- Define relationships and indices
DEFINE INDEX image_listing_idx ON image FIELDS listing_id;
DEFINE INDEX image_content_idx ON image FIELDS content_type;
DEFINE INDEX image_created_idx ON image FIELDS created_at;
DEFINE INDEX image_quality_idx ON image_quality FIELDS image_id;
DEFINE INDEX image_processing_idx ON image_processing FIELDS image_id, stage;
DEFINE INDEX image_validation_idx ON image_validation FIELDS image_id, overall_status;
DEFINE INDEX image_event_idx ON image_event FIELDS image_id, event_type, created_at;
DEFINE INDEX semantic_object_image_idx ON semantic_object FIELDS object_id, confidence;
DEFINE INDEX batch_processing_status_idx ON batch_processing FIELDS status, created_at;
DEFINE INDEX upload_session_status_idx ON upload_session FIELDS status, created_at;
DEFINE INDEX room_attribute_idx ON room_attribute FIELDS attribute_type;
DEFINE INDEX analysis_results_idx ON analysis_results FIELDS image_id;
DEFINE INDEX processing_config_idx ON processing_config FIELDS format.type;
DEFINE INDEX batch_stats_idx ON batch_stats FIELDS batch_id;
DEFINE INDEX batch_image_idx ON batch_image FIELDS image_id;
DEFINE INDEX image_processing_status_idx ON image_processing_status FIELDS image_id, status;
DEFINE INDEX object_attribute_idx ON object_attribute FIELDS name, confidence;
DEFINE INDEX semantic_quality_metrics_idx ON semantic_quality_metrics FIELDS image_id;
DEFINE INDEX image_relation_idx ON image_relation FIELDS image_id, relation_type;
DEFINE INDEX image_relation_confidence_idx ON image_relation FIELDS confidence;
DEFINE INDEX image_sequence_idx ON image_sequence FIELDS sequence_id, sequence_type;
DEFINE INDEX image_group_idx ON image_group FIELDS group_id, group_type;
DEFINE INDEX scene_analysis_idx ON scene_analysis FIELDS image_id;
DEFINE INDEX saturation_metrics_idx ON saturation_metrics FIELDS image_id;
DEFINE INDEX color_palette_analysis_idx ON color_palette_analysis FIELDS image_id;
DEFINE INDEX composition_analysis_idx ON composition_analysis FIELDS image_id;
DEFINE INDEX lighting_analysis_idx ON lighting_analysis FIELDS image_id;
DEFINE INDEX spatial_analysis_idx ON spatial_analysis FIELDS image_id;
DEFINE INDEX spatial_region_idx ON spatial_region FIELDS region_type;
DEFINE INDEX area_metrics_idx ON area_metrics FIELDS image_id;
DEFINE INDEX batch_progress_idx ON batch_progress FIELDS batch_id, current_stage;
-- Add missing website sections enum table
DEFINE INDEX metadata_extraction_idx ON image_metadata_extraction FIELDS image_id;
DEFINE INDEX image_version_idx ON image_version FIELDS image_id, version_type;
DEFINE INDEX image_upload_session_idx ON image FIELDS upload_session_id;
DEFINE INDEX image_semantic_idx ON image FIELDS semantic_analysis;
DEFINE INDEX image_batch_idx ON image FIELDS batch_info;

-- Add missing relationship indices
DEFINE INDEX metrics_to_batch_idx ON metrics_to_batch FIELDS metrics_id, batch_id;
DEFINE INDEX storage_to_image_idx ON storage_to_image FIELDS storage_id, image_id;

DEFINE TABLE website_section SCHEMAFULL;
DEFINE FIELD section_type ON website_section TYPE string
    ASSERT $value IN ['gallery', 'featured', 'overview', 'details', 'custom'];
DEFINE FIELD custom_value ON website_section TYPE string;

-- Add missing image search query table
DEFINE TABLE image_search SCHEMAFULL;
DEFINE FIELD listing_id ON image_search TYPE optional<string>;
DEFINE FIELD content_type ON image_search TYPE optional<object>;
DEFINE FIELD tags ON image_search TYPE array;
DEFINE FIELD created_after ON image_search TYPE optional<datetime>;
DEFINE FIELD created_before ON image_search TYPE optional<datetime>;
DEFINE FIELD limit ON image_search TYPE optional<number>;
DEFINE FIELD offset ON image_search TYPE optional<number>;

-- Add missing image context table
DEFINE TABLE image_context SCHEMAFULL;
DEFINE FIELD listing_id ON image_context TYPE string;
DEFINE FIELD content_settings ON image_context TYPE object;
DEFINE FIELD metadata ON image_context TYPE object;

-- Add missing RGB and HSV color tables
DEFINE TABLE rgb_color SCHEMAFULL;
DEFINE FIELD r ON rgb_color TYPE number ASSERT $value >= 0 AND $value <= 255;
DEFINE FIELD g ON rgb_color TYPE number ASSERT $value >= 0 AND $value <= 255;
DEFINE FIELD b ON rgb_color TYPE number ASSERT $value >= 0 AND $value <= 255;

DEFINE TABLE hsv_color SCHEMAFULL;
DEFINE FIELD hue ON hsv_color TYPE float ASSERT $value >= 0 AND $value <= 360;
DEFINE FIELD saturation ON hsv_color TYPE float ASSERT $value >= 0 AND $value <= 100;
DEFINE FIELD value ON hsv_color TYPE float ASSERT $value >= 0 AND $value <= 100;

-- Add missing size limits table
DEFINE TABLE size_limits SCHEMAFULL;
DEFINE FIELD min_width ON size_limits TYPE number;
DEFINE FIELD max_file_size ON size_limits TYPE number;

-- Add missing user preferences table
DEFINE TABLE user_preferences SCHEMAFULL;
DEFINE FIELD preferred_formats ON user_preferences TYPE array;
DEFINE FIELD quality_threshold ON user_preferences TYPE optional<float>;
DEFINE FIELD auto_enhance ON user_preferences TYPE bool;

DEFINE FIELD total_network_bytes ON image_operation_metrics TYPE number;
DEFINE FIELD cpu_utilization ON image_operation_metrics TYPE float;

-- Add missing relationships for new tables
DEFINE TABLE context_to_image SCHEMAFULL;
DEFINE FIELD context_id ON context_to_image TYPE record(image_context);
DEFINE FIELD image_id ON context_to_image TYPE record(image);

-- Add missing indices for new tables
DEFINE INDEX website_section_idx ON website_section FIELDS section_type;
DEFINE INDEX image_search_idx ON image_search FIELDS listing_id, created_after, created_before;

DEFINE INDEX image_context_idx ON image_context FIELDS listing_id;
DEFINE INDEX context_to_image_idx ON context_to_image FIELDS context_id, image_id;

-- Add relationship constraints for new edges
DEFINE FIELD context_id ON context_to_image TYPE record(image_context) ASSERT $value != NONE;
DEFINE FIELD image_id ON context_to_image TYPE record(image) ASSERT $value != NONE;

-- Add missing image operation metrics
DEFINE FIELD avg_processing_time_ms ON image_operation_metrics TYPE float;
DEFINE FIELD peak_memory_mb ON image_operation_metrics TYPE float;
DEFINE TABLE image_operation_metrics SCHEMAFULL;
DEFINE FIELD min_height ON size_limits TYPE number;
-- Add missing table for PerformanceMetrics
DEFINE TABLE performance_metrics SCHEMAFULL;
DEFINE FIELD avg_processing_time_ms ON performance_metrics TYPE float;
DEFINE FIELD peak_memory_mb ON performance_metrics TYPE float;
DEFINE FIELD total_network_bytes ON performance_metrics TYPE number;
DEFINE FIELD cpu_utilization ON performance_metrics TYPE float;

-- Add missing table for BatchOperationMetrics with relationship
DEFINE TABLE batch_operation_metrics SCHEMAFULL;
DEFINE FIELD batch_id ON batch_operation_metrics TYPE string;
DEFINE FIELD operation_type ON batch_operation_metrics TYPE string;
DEFINE FIELD started_at ON batch_operation_metrics TYPE datetime;
DEFINE FIELD completed_at ON batch_operation_metrics TYPE optional<datetime>;
DEFINE FIELD processed_count ON batch_operation_metrics TYPE number;
DEFINE FIELD success_count ON batch_operation_metrics TYPE number;
DEFINE FIELD error_count ON batch_operation_metrics TYPE number;
DEFINE FIELD performance_metrics ON batch_operation_metrics TYPE record(performance_metrics);

-- Add missing table for ImageStorageLocation
DEFINE TABLE image_storage_location SCHEMAFULL;
DEFINE FIELD image_id ON image_storage_location TYPE record(image);
DEFINE FIELD storage_type ON image_storage_location TYPE string 
    ASSERT $value IN ['local', 's3', 'gcs', 'azure', 'custom'];
DEFINE FIELD bucket ON image_storage_location TYPE string;
DEFINE FIELD path ON image_storage_location TYPE string;
DEFINE FIELD size_bytes ON image_storage_location TYPE number;
DEFINE FIELD created_at ON image_storage_location TYPE datetime;

-- Add missing connection indices
DEFINE INDEX batch_operation_metrics_idx ON batch_operation_metrics FIELDS batch_id;
DEFINE INDEX image_storage_location_idx ON image_storage_location FIELDS image_id;

-- Add missing relationship tables
DEFINE TABLE metrics_to_batch SCHEMAFULL;
DEFINE FIELD metrics_id ON metrics_to_batch TYPE record(batch_operation_metrics);
DEFINE FIELD batch_id ON metrics_to_batch TYPE record(batch_processing);

DEFINE TABLE storage_to_image SCHEMAFULL;
DEFINE FIELD storage_id ON storage_to_image TYPE record(image_storage_location);
DEFINE FIELD image_id ON storage_to_image TYPE record(image);

-- Add missing analysis chain relationships
DEFINE TABLE analysis_chain SCHEMAFULL;
DEFINE FIELD previous_analysis ON analysis_chain TYPE record(image_analysis);
DEFINE FIELD next_analysis ON analysis_chain TYPE record(image_analysis);
DEFINE FIELD chain_type ON analysis_chain TYPE string;

-- Add missing content type relationships
DEFINE TABLE content_type_relation SCHEMAFULL;
DEFINE FIELD content_id ON content_type_relation TYPE record(content_type);
DEFINE FIELD related_content_id ON content_type_relation TYPE record(content_type);
DEFINE FIELD relation_strength ON content_type_relation TYPE float;

-- Add missing validation chain
DEFINE TABLE validation_chain SCHEMAFULL;
DEFINE FIELD previous_validation ON validation_chain TYPE record(image_validation);
DEFINE FIELD next_validation ON validation_chain TYPE record(image_validation);
DEFINE FIELD status_change ON validation_chain TYPE string;

-- Add missing index for these new relationships
DEFINE INDEX analysis_chain_idx ON analysis_chain FIELDS previous_analysis, next_analysis;
DEFINE INDEX content_relation_idx ON content_type_relation FIELDS content_id;
DEFINE INDEX validation_chain_idx ON validation_chain FIELDS previous_validation;