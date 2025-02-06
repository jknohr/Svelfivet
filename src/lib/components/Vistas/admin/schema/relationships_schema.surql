-- Core User Relationships
DEFINE RELATION has_profile ON TABLE user 
    FROM user
    TO user_profile
    CONTENT {
        created_at: datetime,
        version: string,
        is_primary: bool,
        order_index: int
    };

DEFINE RELATION has_metadata ON TABLE user
    FROM user
    TO user_metadata
    CONTENT {
        created_at: datetime,
        version: string
    };

DEFINE RELATION has_settings ON TABLE user
    FROM user
    TO user_settings
    CONTENT {
        created_at: datetime,
        is_primary: bool,
        version: string
    };

-- Property and Listing Relationships
DEFINE RELATION owns_listing ON TABLE user
    FROM user
    TO listing
    CONTENT {
        created_at: datetime,
        is_active: bool,
        version: string
    };

DEFINE RELATION manages_listing ON TABLE user
    FROM user
    TO listing
    CONTENT {
        created_at: datetime,
        permission_level: string,
        version: string
    };

DEFINE RELATION has_location ON TABLE listing
    FROM listing
    TO location
    CONTENT {
        created_at: datetime,
        is_primary: bool,
        version: string
    };

-- Image and Media Relationships
DEFINE RELATION has_images ON TABLE listing
    FROM listing
    TO image
    CONTENT {
        created_at: datetime,
        sequence: int,
        status: string,
        version: string
    };

DEFINE RELATION belongs_to_batch ON TABLE image
    FROM image
    TO batch
    CONTENT {
        created_at: datetime,
        batch_order: int,
        version: string
    };

-- AI Analysis Relationships
DEFINE RELATION has_analysis ON TABLE listing
    FROM listing
    TO ai_analysis
    CONTENT {
        created_at: datetime,
        analysis_type: string,
        confidence: float,