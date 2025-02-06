-- Core User Record Table
DEFINE TABLE user SCHEMAFULL;
DEFINE FIELD id ON user TYPE record(user);
DEFINE FIELD firstname ON user TYPE string ASSERT $value != NONE;
DEFINE FIELD lastname ON user TYPE string ASSERT $value != NONE;
DEFINE FIELD email ON user TYPE string ASSERT $value != NONE AND is::email($value);
DEFINE FIELD secondary_email ON user TYPE string ASSERT is::email($value) OR $value = NONE;
DEFINE FIELD main_phone_number ON user TYPE string ASSERT $value != NONE;
DEFINE FIELD secondary_phone_number ON user TYPE string;
DEFINE FIELD status ON user TYPE string 
    ASSERT $value INSIDE ['Active', 'Inactive', 'Suspended', 'Pending', 'Archived'];
DEFINE FIELD role ON user TYPE string 
    ASSERT $value INSIDE ['Admin', 'Agent', 'Client', 'Support'];
DEFINE FIELD created_at ON user TYPE datetime DEFAULT time::now();
DEFINE FIELD last_login_at ON user TYPE datetime;
DEFINE FIELD listing_ids ON user TYPE array;
DEFINE FIELD verification_status ON user TYPE string 
    ASSERT $value INSIDE ['Unverified', 'Pending', 'Verified', 'Failed'];

-- Global User Index
DEFINE INDEX idx_user_global ON user FIELDS email, main_phone_number, id UNIQUE;

-- User API Key Table
DEFINE TABLE user_api_key SCHEMAFULL;
DEFINE FIELD id ON user_api_key TYPE record(api_key);
DEFINE FIELD api_key ON user_api_key TYPE string ASSERT $value != NONE;
DEFINE FIELD name ON user_api_key TYPE string ASSERT $value != NONE;
DEFINE FIELD scopes ON user_api_key TYPE array 
    ASSERT array::all($value, v => v INSIDE ['ReadOnly', 'WriteOnly', 'ReadWrite', 'Admin'] 
    OR string::starts_with(v, 'Custom_'));
DEFINE FIELD created_at ON user_api_key TYPE datetime DEFAULT time::now();
DEFINE FIELD expires_at ON user_api_key TYPE datetime;
DEFINE FIELD last_used_at ON user_api_key TYPE datetime;
DEFINE FIELD is_active ON user_api_key TYPE bool DEFAULT true;
DEFINE FIELD created_by ON user_api_key TYPE record(user);

-- User Settings Table
DEFINE TABLE user_settings SCHEMAFULL;
DEFINE FIELD notification_preferences ON user_settings TYPE object;
DEFINE FIELD display_preferences ON user_settings TYPE object;
DEFINE FIELD privacy_settings ON user_settings TYPE object;

-- User Metadata Table
DEFINE TABLE user_metadata SCHEMAFULL;
DEFINE FIELD last_active ON user_metadata TYPE datetime;
DEFINE FIELD login_count ON user_metadata TYPE number;
DEFINE FIELD failed_login_attempts ON user_metadata TYPE number;
DEFINE FIELD password_updated_at ON user_metadata TYPE datetime;
DEFINE FIELD security_events ON user_metadata TYPE array<object>;
DEFINE FIELD custom_fields ON user_metadata TYPE object;

-- Security Event Table for detailed tracking
DEFINE TABLE security_event SCHEMAFULL;
DEFINE FIELD event_type ON security_event TYPE string;
DEFINE FIELD timestamp ON security_event TYPE datetime;
DEFINE FIELD ip_address ON security_event TYPE string;
DEFINE FIELD user_agent ON security_event TYPE string;
DEFINE FIELD location ON security_event TYPE string?;
DEFINE FIELD details ON security_event TYPE object;
DEFINE FIELD severity ON security_event TYPE string 
    ASSERT $value INSIDE ['Low', 'Medium', 'High', 'Critical'];
DEFINE FIELD resolution_status ON security_event TYPE string 
    ASSERT $value INSIDE ['Open', 'InProgress', 'Resolved', 'Ignored'];

-- Define Core Graph Relationships
DEFINE RELATION has_api_key ON TABLE user
    FROM user
    TO user_api_key
    CONTENT {
        created_at: datetime,
        is_active: bool,
        scope: string
    };

DEFINE RELATION has_settings ON TABLE user
    FROM user
    TO user_settings
    CONTENT {
        created_at: datetime,
        is_primary: bool,
        last_updated: datetime
    };

DEFINE RELATION has_metadata ON TABLE user
    FROM user
    TO user_metadata
    CONTENT {
        created_at: datetime,
        last_updated: datetime
    };

DEFINE RELATION manages_user ON TABLE user
    FROM user
    TO user
    CONTENT {
        role: string,
        granted_at: datetime,
        permissions: array<string>
    };

-- Additional Graph Relationships
DEFINE RELATION has_profile_model ON TABLE user
    FROM user
    TO user_profile_model
    CONTENT {
        created_at: datetime,
        version: string,
        is_primary: bool
    };

DEFINE RELATION manages_api_keys ON TABLE user
    FROM user
    TO user_api_key
    CONTENT {
        created_at: datetime,
        role: string,
        can_revoke: bool
    };

DEFINE RELATION modifies_settings ON TABLE user
    FROM user
    TO user_settings
    CONTENT {
        modified_at: datetime,
        change_type: string,
        previous_value: object?
    };

DEFINE RELATION generates_security_event ON TABLE user
    FROM user
    TO security_event
    CONTENT {
        event_time: datetime,
        event_severity: string,
        requires_action: bool
    };

-- Additional Graph Relationships from user_id_types.rs
DEFINE RELATION has_login_history ON TABLE user
    FROM user
    TO login_record
    CONTENT {
        device_info: string?,
        ip_address: string,
        success: bool,
        timestamp: datetime
    };

DEFINE RELATION manages_settings_version ON TABLE user
    FROM user
    TO settings_version
    CONTENT {
        created_at: datetime,
        version_number: int,
        change_summary: string,
        is_current: bool
    };

DEFINE RELATION triggers_security_event ON TABLE user
    FROM user
    TO security_event
    CONTENT {
        created_at: datetime,
        severity_level: string,
        requires_action: bool,
        resolution_deadline: datetime?
    };

DEFINE RELATION modifies_metadata ON TABLE user
    FROM user
    TO user_metadata
    CONTENT {
        modified_at: datetime,
        modification_type: string,
        previous_state: object?,
        change_reason: string?
    };

-- Additional User Relationships from user_id_types.rs
DEFINE RELATION has_preferences_history ON TABLE user
    FROM user
    TO preference_history
    CONTENT {
        created_at: datetime,
        tracking_enabled: bool,
        data_retention: duration
    };

DEFINE RELATION manages_roles ON TABLE user
    FROM user
    TO role_assignment
    CONTENT {
        assigned_at: datetime,
        assigned_by: record(user),
        expiration: datetime?,
        scope: array<string>
    };

DEFINE RELATION has_device_registration ON TABLE user
    FROM user
    TO device_registration
    CONTENT {
        registered_at: datetime,
        device_type: string,
        push_enabled: bool,
        last_active: datetime
    };

-- Additional Tables Required by user_id_types.rs Relationships
DEFINE TABLE login_record SCHEMAFULL;
DEFINE FIELD timestamp ON login_record TYPE datetime;
DEFINE FIELD ip_address ON login_record TYPE string;
DEFINE FIELD user_agent ON login_record TYPE string;
DEFINE FIELD success ON login_record TYPE bool;
DEFINE FIELD failure_reason ON login_record TYPE string?;
DEFINE FIELD location_data ON login_record TYPE object?;

DEFINE TABLE settings_version SCHEMAFULL;
DEFINE FIELD version_number ON settings_version TYPE int;
DEFINE FIELD settings_data ON settings_version TYPE object;
DEFINE FIELD created_at ON settings_version TYPE datetime;
DEFINE FIELD created_by ON settings_version TYPE record(user);
DEFINE FIELD change_summary ON settings_version TYPE string;
DEFINE FIELD is_current ON settings_version TYPE bool;

-- Additional Tables Required for Complete User Model
DEFINE TABLE preference_history SCHEMAFULL;
DEFINE FIELD preference_type ON preference_history TYPE string;
DEFINE FIELD old_value ON preference_history TYPE string;
DEFINE FIELD new_value ON preference_history TYPE string;
DEFINE FIELD changed_at ON preference_history TYPE datetime;
DEFINE FIELD change_reason ON preference_history TYPE string?;

DEFINE TABLE role_assignment SCHEMAFULL;
DEFINE FIELD role ON role_assignment TYPE string 
    ASSERT $value INSIDE ['Admin', 'Agent', 'Client', 'Support'];
DEFINE FIELD permissions ON role_assignment TYPE array;
DEFINE FIELD valid_from ON role_assignment TYPE datetime;
DEFINE FIELD valid_until ON role_assignment TYPE datetime?;

DEFINE TABLE device_registration SCHEMAFULL;
DEFINE FIELD device_id ON device_registration TYPE string;
DEFINE FIELD platform ON device_registration TYPE string;
DEFINE FIELD push_token ON device_registration TYPE string?;
DEFINE FIELD app_version ON device_registration TYPE string;
DEFINE FIELD os_version ON device_registration TYPE string;

-- Define Indexes for Efficient Querying
DEFINE INDEX idx_user_email ON user FIELDS email UNIQUE;
DEFINE INDEX idx_user_phone ON user FIELDS main_phone_number;
DEFINE INDEX idx_user_status ON user FIELDS status;
DEFINE INDEX idx_user_role ON user FIELDS role;
DEFINE INDEX idx_api_key ON user_api_key FIELDS api_key UNIQUE;
DEFINE INDEX idx_metadata_active ON user_metadata FIELDS last_active;

-- Additional Indexes for Security and Performance
DEFINE INDEX idx_security_event ON security_event 
    FIELDS event_type, timestamp, severity;

DEFINE INDEX idx_user_verification ON user 
    FIELDS verification_status, last_login_at;

DEFINE INDEX idx_settings_visibility ON user_settings 
    FIELDS privacy_settings.profile_visibility;

-- Additional Indexes for Relationship Queries
DEFINE INDEX idx_login_record ON login_record 
    FIELDS timestamp, success;

DEFINE INDEX idx_settings_version ON settings_version 
    FIELDS version_number, is_current;

DEFINE INDEX idx_user_relationships ON TABLE user 
    FIELDS created_at, role;

-- Additional Indexes for New Components
DEFINE INDEX idx_preference_history ON preference_history 
    FIELDS preference_type, changed_at;

DEFINE INDEX idx_role_assignment ON role_assignment 
    FIELDS role, valid_from;

DEFINE INDEX idx_device_registration ON device_registration 
    FIELDS device_id, platform;

-- Add Timestamps to All Tables
DEFINE FIELD created_at ON TABLE user, user_api_key, user_settings, user_metadata 
    TYPE datetime DEFAULT time::now();
DEFINE FIELD updated_at ON TABLE user, user_api_key, user_settings, user_metadata 
    TYPE datetime;

-- Add Timestamps to New Tables
DEFINE FIELD created_at ON TABLE preference_history, role_assignment, device_registration 
    TYPE datetime DEFAULT time::now();
DEFINE FIELD updated_at ON TABLE preference_history, role_assignment, device_registration 
    TYPE datetime;

-- Validation rules for settings objects
DEFINE FIELD notification_types ON user_settings.notification_preferences 
    TYPE object ASSERT array::len(object::keys($value)) > 0;

DEFINE FIELD preferred_contact_method ON user_settings.privacy_settings.contact_permissions 
    TYPE string ASSERT $value INSIDE ['Email', 'Phone', 'Message', 'None'];

-- Additional Validation Rules for Enums
DEFINE FIELD api_key_scope ON user_api_key TYPE string 
    ASSERT $value INSIDE [
        'ReadOnly', 
        'WriteOnly', 
        'ReadWrite', 
        'Admin'
    ] OR string::starts_with($value, 'Custom_');

-- Type-Level Relationships
DEFINE RELATION has_type_definition ON TABLE user
    FROM user
    TO type_definition
    CONTENT {
        created_at: datetime,
        schema_version: string,
        validation_rules: object
    };

DEFINE RELATION validates_user_data ON TABLE user
    FROM user
    TO data_validator
    CONTENT {
        validator_type: string,
        rules: array,
        priority: int,
        is_active: bool
    };

-- Security and Authentication Relationships
DEFINE RELATION has_auth_config ON TABLE user
    FROM user
    TO auth_configuration
    CONTENT {
        auth_method: string,
        created_at: datetime,
        last_updated: datetime,
        security_level: string
    };

DEFINE RELATION maintains_session ON TABLE user
    FROM user
    TO user_session
    CONTENT {
        session_type: string,
        started_at: datetime,
        expires_at: datetime,
        is_active: bool
    };

-- Data Model Support Tables
DEFINE TABLE type_definition SCHEMAFULL;
DEFINE FIELD model_type ON type_definition TYPE string;
DEFINE FIELD schema_version ON type_definition TYPE string;
DEFINE FIELD type_structure ON type_definition TYPE object;
DEFINE FIELD validation_rules ON type_definition TYPE array;

DEFINE TABLE data_validator SCHEMAFULL;
DEFINE FIELD validator_name ON data_validator TYPE string;
DEFINE FIELD validation_rules ON data_validator TYPE array;
DEFINE FIELD error_messages ON data_validator TYPE object;

DEFINE TABLE auth_configuration SCHEMAFULL;
DEFINE FIELD auth_method ON auth_configuration TYPE string 
    ASSERT $value INSIDE ['Password', 'OAuth', 'TwoFactor', 'Biometric'];
DEFINE FIELD config_data ON auth_configuration TYPE object;
DEFINE FIELD security_level ON auth_configuration TYPE string;

DEFINE TABLE user_session SCHEMAFULL;
DEFINE FIELD session_id ON user_session TYPE string;
DEFINE FIELD session_data ON user_session TYPE object;
DEFINE FIELD device_info ON user_session TYPE object;
DEFINE FIELD ip_address ON user_session TYPE string;

-- Add Indexes for New Tables
DEFINE INDEX idx_type_definition ON type_definition 
    FIELDS model_type, schema_version;

DEFINE INDEX idx_data_validator ON data_validator 
    FIELDS validator_name;

DEFINE INDEX idx_auth_config ON auth_configuration 
    FIELDS auth_method, security_level;

DEFINE INDEX idx_user_session ON user_session 
    FIELDS session_id, ip_address;

-- Add Timestamps to New Tables
DEFINE FIELD created_at ON TABLE type_definition, data_validator, 
    auth_configuration, user_session
    TYPE datetime DEFAULT time::now();
DEFINE FIELD updated_at ON TABLE type_definition, data_validator, 
    auth_configuration, user_session
    TYPE datetime;

-- Cross-Reference Relationships
DEFINE RELATION validates_session ON TABLE auth_configuration
    FROM auth_configuration
    TO user_session
    CONTENT {
        validation_type: string,
        validated_at: datetime
    };

DEFINE RELATION enforces_rules ON TABLE data_validator
    FROM data_validator
    TO type_definition
    CONTENT {
        priority: int,
        enforcement_level: string
    };

-- Type Validation Tables
DEFINE TABLE type_validator SCHEMAFULL;
DEFINE FIELD validator_type ON type_validator TYPE string;
DEFINE FIELD validation_rules ON type_validator TYPE array;
DEFINE FIELD error_codes ON type_validator TYPE object;
DEFINE FIELD is_active ON type_validator TYPE bool DEFAULT true;

-- Version Control Tables
DEFINE TABLE schema_version SCHEMAFULL;
DEFINE FIELD version_number ON schema_version TYPE string;
DEFINE FIELD changes ON schema_version TYPE array;
DEFINE FIELD deployed_at ON schema_version TYPE datetime;
DEFINE FIELD is_current ON schema_version TYPE bool;

-- Additional Relationships
DEFINE RELATION validates_type ON TABLE user
    FROM user
    TO type_validator
    CONTENT {
        applied_at: datetime,
        validator_version: string,
        is_active: bool
    };

DEFINE RELATION has_schema_version ON TABLE user
    FROM user
    TO schema_version
    CONTENT {
        applied_at: datetime,
        migration_status: string,
        validation_result: object
    };

-- Indexes for New Tables
DEFINE INDEX idx_type_validator ON type_validator 
    FIELDS validator_type, is_active;
DEFINE INDEX idx_schema_version ON schema_version 
    FIELDS version_number, is_current;

-- Relationship Validations
DEFINE FIELD migration_status ON has_schema_version 
    TYPE string ASSERT $value INSIDE ['Pending', 'Complete', 'Failed', 'Rollback'];

DEFINE FIELD validator_version ON validates_type 
    TYPE string ASSERT $value != NONE;

-- Extended Nationality and Language Tables
DEFINE TABLE nationality_info SCHEMAFULL;
DEFINE FIELD country_code ON nationality_info TYPE string 
    ASSERT string::len($value) = 2 OR string::len($value) = 3;
DEFINE FIELD country_name ON nationality_info TYPE string;
DEFINE FIELD region ON nationality_info TYPE string;
DEFINE FIELD subregion ON nationality_info TYPE string;
DEFINE FIELD citizenship_type ON nationality_info TYPE string 
    ASSERT $value INSIDE ['Single', 'Dual', 'Multiple'];
DEFINE FIELD documents ON nationality_info TYPE array;

DEFINE TABLE language_proficiency SCHEMAFULL;
DEFINE FIELD language_code ON language_proficiency TYPE string 
    ASSERT string::len($value) = 2 OR string::len($value) = 3;
DEFINE FIELD language_name ON language_proficiency TYPE string;
DEFINE FIELD proficiency_level ON language_proficiency TYPE string 
    ASSERT $value INSIDE ['Native', 'Fluent', 'Advanced', 'Intermediate', 'Basic'];
DEFINE FIELD certified ON language_proficiency TYPE bool;
DEFINE FIELD certification_details ON language_proficiency TYPE object?;

-- Regional Preferences Table
DEFINE TABLE regional_preferences SCHEMAFULL;
DEFINE FIELD preferred_regions ON regional_preferences TYPE array;
DEFINE FIELD preferred_currencies ON regional_preferences TYPE array;
DEFINE FIELD date_format ON regional_preferences TYPE string;
DEFINE FIELD time_format ON regional_preferences TYPE string;
DEFINE FIELD measurement_system ON regional_preferences TYPE string 
    ASSERT $value INSIDE ['Metric', 'Imperial', 'Mixed'];

-- Additional User Relations
DEFINE RELATION has_nationality ON TABLE user
    FROM user
    TO nationality_info
    CONTENT {
        verified: bool,
        verification_date: datetime?,
        primary: bool
    };

DEFINE RELATION speaks_language ON TABLE user
    FROM user
    TO language_proficiency
    CONTENT {
        active: bool,
        last_used: datetime,
        preferred_for_communication: bool
    };

DEFINE RELATION has_regional_prefs ON TABLE user
    FROM user
    TO regional_preferences
    CONTENT {
        created_at: datetime,
        last_updated: datetime,
        auto_detected: bool
    };

-- Indexes for New Tables
DEFINE INDEX idx_nationality ON nationality_info 
    FIELDS country_code UNIQUE;

DEFINE INDEX idx_language ON language_proficiency 
    FIELDS language_code, proficiency_level;

DEFINE INDEX idx_regional_prefs ON regional_preferences 
    FIELDS preferred_regions, preferred_currencies;

-- Add Migration Helper Index
DEFINE INDEX idx_legacy_migration ON user 
    FIELDS created_at, status;

-- Add Data Migration Tracking
DEFINE TABLE migration_tracking SCHEMAFULL;
DEFINE FIELD migration_type ON migration_tracking TYPE string;
DEFINE FIELD status ON migration_tracking TYPE string 
    ASSERT $value INSIDE ['Pending', 'InProgress', 'Completed', 'Failed'];
DEFINE FIELD started_at ON migration_tracking TYPE datetime;
DEFINE FIELD completed_at ON migration_tracking TYPE datetime?;
DEFINE FIELD affected_records ON migration_tracking TYPE array;

-- Add Migration Tracking Relationship
DEFINE RELATION tracks_migration ON TABLE user
    FROM user
    TO migration_tracking
    CONTENT {
        migrated_at: datetime,
        old_data: object?,
        new_data: object?,
        status: string
    };

-- Auth Token and API Key Management Tables
DEFINE TABLE auth_token SCHEMAFULL;
DEFINE FIELD token ON auth_token TYPE string;
DEFINE FIELD user_id ON auth_token TYPE record(user);
DEFINE FIELD created_at ON auth_token TYPE datetime DEFAULT time::now();
DEFINE FIELD expires_at ON auth_token TYPE datetime;
DEFINE FIELD is_revoked ON auth_token TYPE bool DEFAULT false;
DEFINE FIELD revoked_at ON auth_token TYPE datetime?;
DEFINE FIELD device_info ON auth_token TYPE object?;

DEFINE TABLE auth_api_key SCHEMAFULL;
DEFINE FIELD key ON auth_api_key TYPE string;
DEFINE FIELD user_id ON auth_api_key TYPE record(user);
DEFINE FIELD name ON auth_api_key TYPE string;
DEFINE FIELD created_at ON auth_api_key TYPE datetime DEFAULT time::now();
DEFINE FIELD expires_at ON auth_api_key TYPE datetime?;
DEFINE FIELD last_used_at ON auth_api_key TYPE datetime?;
DEFINE FIELD is_revoked ON auth_api_key TYPE bool DEFAULT false;
DEFINE FIELD revoked_at ON auth_api_key TYPE datetime?;
DEFINE FIELD revoked_by ON auth_api_key TYPE record(user)?;

-- Auth-Related Relationships
DEFINE RELATION has_auth_token ON TABLE user
    FROM user
    TO auth_token
    CONTENT {
        created_at: datetime,
        is_active: bool,
        device_fingerprint: string?
    };

DEFINE RELATION has_auth_api_key ON TABLE user
    FROM user
    TO auth_api_key
    CONTENT {
        created_at: datetime,
        is_active: bool,
        device_fingerprint: string?
    };