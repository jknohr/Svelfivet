-- Core User Profile Model
DEFINE TABLE user_profile SCHEMAFULL;
DEFINE FIELD id ON user_profile TYPE record(user_profile);
DEFINE FIELD first_name ON user_profile TYPE string;
DEFINE FIELD last_name ON user_profile TYPE string;
DEFINE FIELD gender ON user_profile TYPE string;
DEFINE FIELD client_type ON user_profile TYPE array<string>;
DEFINE FIELD date_of_birth ON user_profile TYPE datetime;
DEFINE FIELD social_profiles ON user_profile TYPE object {
    facebook: string?,
    instagram: string?,
    whatsapp: string?,
    tiktok: string?,
    signal: string?,
    telegram: string?,
    snapchat: string?,
    pinterest: string?,
    youtube: string?,
    reels: string?,
    bluesky: string?,
    twitter: string?,
    linkedin: string?,
    wechat: string?
};
DEFINE FIELD client_history ON user_profile TYPE object {
    interactions: array<object> {
        interaction_type: string,
        notes: string?,
        timestamp: datetime,
        location: string?,
        duration_minutes: int?
    },
    preferences: array<object> {
        preference_type: string,
        value: string,
        priority: int,
        added_at: datetime
    },
    created_at: datetime,
    updated_at: datetime
};

-- Client History Graph
DEFINE TABLE client_history_graph SCHEMAFULL;
DEFINE FIELD interactions ON client_history_graph TYPE array<object> {
    interaction_type: string ASSERT $value INSIDE ['Meeting', 'Call', 'Email', 'Message', 'Viewing', 'Offer', 'Contract', 'Other'],
    notes: string?,
    timestamp: datetime,
    location: object?,
    duration_minutes: int?,
    outcome: string ASSERT $value INSIDE ['Positive', 'Neutral', 'Negative', 'FollowUpRequired', 'Completed', 'Cancelled'],
    follow_up_required: bool,
    follow_up_date: datetime?,
    related_properties: array<record>,
    related_listings: array<record>,
    metadata: object {
        communication_channel: string ASSERT $value INSIDE ['InPerson', 'Phone', 'Email', 'WhatsApp', 'Telegram', 'WeChat', 'Other'],
        sentiment: string?,
        tags: array<string>,
        custom_fields: object
    }
};

DEFINE FIELD searches ON client_history_graph TYPE array<object> {
    search_parameters: object {
        location: object?,
        area: array?,
        price_range: object?,
        property_type: array<string>,
        filters: object
    },
    results_count: int,
    saved_properties: array<record>,
    search_location: object?,
    mapbox_context: object?,
    device_info: object {
        device_type: string,
        browser: string?,
        os: string?,
        screen_resolution: string?
    },
    session_id: string,
    timestamp: datetime
};

DEFINE FIELD viewings ON client_history_graph TYPE array<object> {
    property_id: record,
    viewing_date: datetime,
    duration_minutes: int,
    feedback: object {
        overall_impression: string,
        specific_comments: array<string>,
        rating: float?,
        interest_level: string
    },
    accompanied_by: array<string>,
    notes: string?,
    follow_up_actions: array<object> {
        action_type: string,
        due_date: datetime,
        status: string,
        notes: string?
    },
    status: string ASSERT $value INSIDE ['Scheduled', 'Completed', 'Cancelled', 'Rescheduled', 'NoShow']
};

-- Personality Profile Table (from PersonalityProfile struct)
DEFINE TABLE personality_profile SCHEMAFULL;
DEFINE FIELD traits ON personality_profile TYPE array<object> {
    trait_type: string,
    trait_name: string,
    strength: float ASSERT $value >= 0 AND $value <= 1,
    context: string,
    context_triggers: array<string>,
    observed_behaviors: array<string>
};
DEFINE FIELD communication_style ON personality_profile TYPE object {
    primary_style: string,
    formality_level: float,
    preferred_channels: array<string>,
    response_patterns: array<string>
};
DEFINE FIELD decision_making ON personality_profile TYPE object {
    style: string,
    speed: float,
    influencing_factors: array<string>
};
DEFINE FIELD adaptability ON personality_profile TYPE object {
    change_response: string,
    flexibility_score: float
};
DEFINE FIELD social_preferences ON personality_profile TYPE object {
    interaction_style: string,
    group_dynamics: string,
    social_energy: float
};
DEFINE FIELD created_at ON personality_profile TYPE datetime;
DEFINE FIELD updated_at ON personality_profile TYPE datetime;

-- Emotional Profile Table (from EmotionalProfile struct)
DEFINE TABLE emotional_profile SCHEMAFULL;
DEFINE FIELD trust_factors ON emotional_profile TYPE array<object> {
    factor: string,
    factor_type: string?,
    importance: float ASSERT $value >= 0 AND $value <= 1,
    development_stage: string,
    notes: array<string>
};
DEFINE FIELD emotional_triggers ON emotional_profile TYPE array<object> {
    trigger: string,
    trigger_type: string?,
    response_type: string?,
    intensity: float ASSERT $value >= 0 AND $value <= 1,
    context: string,
    response_pattern: string,
    handling_strategy: string,
    notes: array<string>
};
DEFINE FIELD stress_responses ON emotional_profile TYPE array<object> {
    trigger: string,
    response_type: string,
    coping_mechanisms: array<string>
};
DEFINE FIELD comfort_zones ON emotional_profile TYPE array<object> {
    context: string,
    confidence_level: float,
    expansion_potential: float
};
DEFINE FIELD emotional_intelligence ON emotional_profile TYPE object {
    self_awareness: float,
    empathy_level: float,
    emotional_regulation: float
};
DEFINE FIELD relationship_patterns ON emotional_profile TYPE object {
    trust_building: string,
    conflict_resolution: string,
    attachment_style: string
};
DEFINE FIELD created_at ON emotional_profile TYPE datetime;
DEFINE FIELD updated_at ON emotional_profile TYPE datetime;

-- Response Type Enum Definitions
DEFINE FIELD response_type ON emotional_profile TYPE string 
    ASSERT $value INSIDE [
        'Enthusiastic',
        'Cautious',
        'Skeptical',
        'Impulsive',
        'Analytical',
        'QuickReply',
        'DetailedAnalysis',
        'NeedsReassurance',
        'SeeksValidation',
        'FastDecider',
        'SlowMethodical',
        'EmotionalDecider',
        'LogicalDecider'
    ];

-- Factor Type Enum Definitions
DEFINE FIELD factor_type ON emotional_profile TYPE string 
    ASSERT $value INSIDE [
        'PastExperience',
        'SocialProof',
        'ExpertiseDemo',
        'Transparency',
        'Consistency',
        'Communication',
        'Reliability',
        'Competence',
        'Integrity',
        'RiskTolerance',
        'TimePreference',
        'ValueAlignment'
    ];

-- Trigger Type Enum Definitions
DEFINE FIELD trigger_type ON emotional_profile TYPE string 
    ASSERT $value INSIDE [
        'UncertaintyStress',
        'TimePressure',
        'FinancialConcern',
        'FamilyNeeds',
        'CompetitiveSituation',
        'MarketChange',
        'PersonalMilestone',
        'ExternalPressure',
        'InformationOverload',
        'LackOfInformation',
        'ConflictingAdvice'
    ];

-- Response Pattern Type Enum Definitions
DEFINE FIELD response_pattern_type ON emotional_profile TYPE string 
    ASSERT $value INSIDE [
        'DirectCommunicator',
        'DetailOriented',
        'BigPictureFocused',
        'NeedsReassurance',
        'QuickDecider',
        'CarefulAnalyzer',
        'EmotionalDecider',
        'ConsensusSeeker',
        'FrequentCommunicator',
        'MinimalCommunicator',
        'ProactiveUpdater'
    ];

-- Life Context Table (from LifeContext struct)
DEFINE TABLE life_context SCHEMAFULL;
DEFINE FIELD current_life_stage ON life_context TYPE object {
    stage: string,
    duration_in_stage: int,
    next_transition: string?,
    stability_index: float
};
DEFINE FIELD family_situation ON life_context TYPE object {
    family_type: string,
    household_size: int,
    family_members: array<object> {
        relationship: string,
        date_of_birth: datetime,
        age: int,
        occupation: string?,
        education_status: string?,
        special_needs: array<string>?,
        preferences: array<string>?,
        notes: string?,
        living_situation: object {
            type: string,
            schedule: string?,
            expected_date: datetime?
        }
    }
};

-- Continuing Life Context Table
DEFINE FIELD career_context ON life_context TYPE object {
    current_role: string,
    industry: string,
    career_stage: string,
    stability: float
};

DEFINE FIELD financial_context ON life_context TYPE object {
    income_bracket: string,
    financial_stability: float,
    investment_profile: string
};

DEFINE FIELD life_events ON life_context TYPE array<object> {
    event_type: string,
    date: datetime,
    impact: string
};

DEFINE FIELD future_plans ON life_context TYPE array<object> {
    plan_type: string,
    timeline: string,
    certainty: float
};

DEFINE FIELD lifestyle_preferences ON life_context TYPE object {
    activities: array<string>,
    values: array<string>,
    social_life: string
};

-- Living Situation Enum Validation
DEFINE FIELD living_situation_type ON user_profile TYPE string 
    ASSERT $value INSIDE [
        'PermanentResident',
        'PartTime',
        'Occasional',
        'Future',
        'Other'
    ];

-- Communication Patterns
DEFINE TABLE communication_patterns SCHEMAFULL;
DEFINE FIELD response_times ON communication_patterns TYPE object {
    email_response: int,
    call_response: int,
    message_response: int,
    preferred_contact_times: array<object> {
        start_time: string,
        end_time: string,
        days: array<string>
    }
};

DEFINE FIELD boundaries ON communication_patterns TYPE object {
    preferred_times: array<object> {
        start_time: string,
        end_time: string,
        days: array<string>
    },
    blocked_times: array<object> {
        start_time: string,
        end_time: string,
        days: array<string>
    },
    blackout_dates: array<datetime>
};

DEFINE FIELD meeting_preferences ON communication_patterns TYPE object {
    preferred_times: array<object> {
        start_time: string,
        end_time: string,
        days: array<string>
    },
    preferred_locations: array<string>,
    format_preferences: array<string>,
    duration_preference: int  -- Duration in minutes
};

DEFINE FIELD follow_up_preferences ON communication_patterns TYPE object {
    frequency: string,
    preferred_method: array<string>,
    response_window: int,  -- Duration in minutes
    customization_needs: array<string>
};

-- Decision Making Process
DEFINE TABLE decision_process SCHEMAFULL;
DEFINE FIELD decision_speed ON decision_process TYPE object {
    average_time: int,
    consistency: float,
    factors_affecting: array<string>,
    pressure_response: string
};

DEFINE FIELD negotiation_style ON decision_process TYPE object {
    approach: string,
    flexibility: float,
    key_priorities: array<string>,
    deal_breakers: array<string>
};

DEFINE FIELD feedback_patterns ON decision_process TYPE object {
    frequency: string,
    detail_level: float,
    preferred_channels: array<string>,
    response_consistency: float
};

-- Additional Decision Making Components
DEFINE FIELD adaptability ON decision_process TYPE object {
    change_response: string,
    flexibility_level: float ASSERT $value >= 0 AND $value <= 1,
    adjustment_period: duration,
    change_history: array<object> {
        scenario: string,
        response_quality: float,
        adaptation_time: duration,
        notes: array<string>
    }
};

DEFINE FIELD social_dynamics ON decision_process TYPE object {
    group_influence: float,
    social_proof_importance: float,
    peer_reference_weight: float,
    status_consciousness: float
};

DEFINE FIELD property_decision_factors ON decision_process TYPE object {
    rational_weight: float,
    emotional_weight: float,
    key_decision_points: array<object> {
        factor: string,
        importance: float,
        flexibility: float,
        validation_needs: array<string>
    }
};

-- Behavioral Insights Additional Components
DEFINE FIELD hesitation_points ON behavioral_insights TYPE array<object> {
    context: string,
    trigger: string,
    frequency: float,
    resolution_approach: array<string>
};

DEFINE FIELD confidence_builders ON behavioral_insights TYPE array<object> {
    approach: string,
    effectiveness: float,
    context: string,
    supporting_evidence: array<string>
};

DEFINE FIELD risk_assessment ON behavioral_insights TYPE object {
    risk_tolerance_level: float,
    risk_areas: array<string>,
    mitigation_strategies: array<string>,
    comfort_zones: array<string>
};

-- Pattern Type Enum Definitions
DEFINE FIELD pattern_type ON behavioral_insights TYPE string 
    ASSERT $value INSIDE [
        'ConsistentBehavior',
        'InconsistentBehavior',
        'PredictablePattern',
        'UnpredictablePattern',
        'FrequentInteraction',
        'RareInteraction',
        'PositiveEngagement',
        'NegativeEngagement',
        'QuickDecision',
        'SlowDecision',
        'RationalDecision',
        'EmotionalDecision',
        'FrequentPropertyViewings',
        'RarePropertyViewings',
        'QuickOffer',
        'DelayedOffer',
        'HighEngagementWithListings',
        'LowEngagementWithListings'
    ];

-- Additional Property Preferences Components
DEFINE TABLE property_preferences SCHEMAFULL;
DEFINE FIELD nice_to_haves ON property_preferences TYPE array<object> {
    feature: string,
    desirability: float
};

DEFINE FIELD budget_constraints ON property_preferences TYPE object {
    min_price: float,
    max_price: float,
    flexibility: float
};

DEFINE FIELD timeline_preferences ON property_preferences TYPE object {
    ideal_timeline: int,  -- Duration in days
    flexibility: int,     -- Duration in days
    urgency_level: float
};

-- Adding Duration field type support
DEFINE FIELD ideal_timeline ON timeline_preferences 
    TYPE duration VALUE duration::from::minutes($value);
DEFINE FIELD flexibility ON timeline_preferences 
    TYPE duration VALUE duration::from::minutes($value);

DEFINE FIELD size_requirements ON property_preferences TYPE object {
    min_sqft: float,
    max_sqft: float,
    min_rooms: int,
    min_bathrooms: float
};

-- Additional Behavioral Components
DEFINE TABLE behavioral_insights SCHEMAFULL;
DEFINE FIELD motivation_factors ON behavioral_insights TYPE object {
    primary_drivers: array<string>,
    intensity_levels: object,
    blockers: array<string>,
    enablers: array<string>
};

DEFINE FIELD behavioral_flags ON behavioral_insights TYPE object {
    flag_type: string,
    severity: float,
    frequency: float,
    context: string,
    handling_strategy: array<string>
};

DEFINE FIELD success_patterns ON behavioral_insights TYPE object {
    pattern_type: string,
    effectiveness: float,
    conditions: array<string>,
    outcomes: array<string>
};

-- Success Pattern Analysis
DEFINE TABLE success_pattern_analysis SCHEMAFULL;
DEFINE FIELD engagement_success ON success_pattern_analysis TYPE array<object> {
    pattern_name: string,
    effectiveness: float,
    context: string,
    replication_rate: float,
    key_elements: array<string>,
    failure_points: array<string>
};

DEFINE FIELD interaction_success ON success_pattern_analysis TYPE array<object> {
    scenario: string,
    approach: string,
    outcome_quality: float,
    repeatable_elements: array<string>,
    customization_needs: array<string>
};

DEFINE FIELD decision_catalysts ON success_pattern_analysis TYPE array<object> {
    trigger_type: string,
    effectiveness: float,
    timing_importance: float,
    supporting_conditions: array<string>
};

-- Add timestamps to all major components
DEFINE FIELD created_at ON TABLE property_preferences, communication_patterns, behavioral_insights 
    TYPE datetime DEFAULT time::now();
DEFINE FIELD updated_at ON TABLE property_preferences, communication_patterns, behavioral_insights 
    TYPE datetime;

-- Add timestamps to all new components
DEFINE FIELD created_at ON TABLE success_pattern_analysis, decision_process
    TYPE datetime DEFAULT time::now();
DEFINE FIELD updated_at ON TABLE success_pattern_analysis, decision_process
    TYPE datetime;

-- Property Features and Requirements
DEFINE TABLE property_features SCHEMAFULL;
DEFINE FIELD style_preferences ON property_features TYPE array<string>;
DEFINE FIELD specific_features ON property_features TYPE array<string>;

DEFINE TABLE time_window SCHEMAFULL;
DEFINE FIELD start_time ON time_window TYPE string;
DEFINE FIELD end_time ON time_window TYPE string;
DEFINE FIELD days ON time_window TYPE array<string>;

DEFINE TABLE engagement_event SCHEMAFULL;
DEFINE FIELD event_type ON engagement_event TYPE string;
DEFINE FIELD date ON engagement_event TYPE datetime;
DEFINE FIELD level ON engagement_event TYPE float;

DEFINE TABLE engagement_level SCHEMAFULL;
DEFINE FIELD current_level ON engagement_level TYPE string;
DEFINE FIELD consistency ON engagement_level TYPE float;
DEFINE FIELD engagement_history ON engagement_level TYPE array<record(engagement_event)>;

DEFINE TABLE relation_timeline SCHEMAFULL;
DEFINE FIELD events ON relation_timeline TYPE array<object> {
    event_type: string,
    timestamp: datetime,
    impact: float,
    notes: string
};

-- Time-based Metrics
DEFINE TABLE time_metrics SCHEMAFULL;
DEFINE FIELD duration_tracking ON time_metrics TYPE object {
    total_interaction_time: duration,
    average_session_length: duration,
    frequency_of_contact: string,
    response_latency: duration
};

-- Validation Assertions for all enum types
DEFINE FIELD price_type ON price_range TYPE string 
    ASSERT $value INSIDE ['Budget', 'PriceRange', 'OfferRange'] 
    OR string::starts_with($value, 'Custom_');

-- Add additional indexes
DEFINE INDEX idx_time_window ON time_window 
    FIELDS start_time, days;

DEFINE INDEX idx_engagement_event ON engagement_event 
    FIELDS date, event_type;

DEFINE INDEX idx_engagement_level ON engagement_level 
    FIELDS current_level, consistency;

-- Add timestamps to new components
DEFINE FIELD created_at ON TABLE property_features, time_window, engagement_event, 
    engagement_level, relation_timeline, time_metrics
    TYPE datetime DEFAULT time::now();
DEFINE FIELD updated_at ON TABLE property_features, time_window, engagement_event, 
    engagement_level, relation_timeline, time_metrics
    TYPE datetime;

-- Additional Property Match Analysis Table
DEFINE TABLE property_match_analysis SCHEMAFULL;
DEFINE FIELD emotional_fit ON property_match_analysis TYPE object {
    overall_score: float ASSERT $value >= 0 AND $value <= 1,
    key_matches: array<string>,
    potential_issues: array<string>
};

DEFINE FIELD practical_fit ON property_match_analysis TYPE object {
    score: float ASSERT $value >= 0 AND $value <= 1,
    meeting_needs: array<string>,
    compromises: array<string>
};

DEFINE FIELD future_potential ON property_match_analysis TYPE object {
    growth_alignment: float,
    adaptability: float,
    long_term_satisfaction: float
};

-- Relationship Timeline Table
DEFINE TABLE client_relationship_timeline SCHEMAFULL;
DEFINE FIELD engagement_milestones ON client_relationship_timeline TYPE array<object> {
    milestone_type: string,
    date: datetime,
    description: string,
    impact_score: float,
    follow_up_actions: array<string>
};

DEFINE FIELD trust_development ON client_relationship_timeline TYPE array<object> {
    stage: string,
    reached_at: datetime,
    key_factors: array<string>,
    validation_points: array<string>
};

DEFINE FIELD communication_evolution ON client_relationship_timeline TYPE array<object> {
    phase: string,
    start_date: datetime,
    end_date: datetime?,
    characteristics: array<string>,
    effectiveness: float
};

-- Add timestamps
DEFINE FIELD created_at ON TABLE property_match_analysis, client_relationship_timeline
    TYPE datetime DEFAULT time::now();
DEFINE FIELD updated_at ON TABLE property_match_analysis, client_relationship_timeline
    TYPE datetime;

-- Add relationship indices
DEFINE INDEX idx_match_analysis ON property_match_analysis 
    FIELDS emotional_fit.overall_score, practical_fit.score;

DEFINE INDEX idx_relationship_timeline ON client_relationship_timeline 
    FIELDS engagement_milestones[*].date, trust_development[*].stage;

-- Client Analytics and Metrics
DEFINE TABLE client_analytics SCHEMAFULL;
DEFINE FIELD search_behavior ON client_analytics TYPE object {
    search_frequency: float,
    search_patterns: array<object> {
        pattern_type: string,
        occurrence: float,
        effectiveness: float
    },
    preferred_filters: array<string>,
    saved_search_types: array<string>
};

DEFINE FIELD viewing_behavior ON client_analytics TYPE object {
    viewing_frequency: float,
    property_preferences: array<object> {
        feature: string,
        importance: float,
        consistency: float
    },
    time_spent_viewing: object {
        average_duration: duration,
        preferred_times: array<string>,
        attention_points: array<string>
    }
};

-- Client Journey Analysis
DEFINE TABLE journey_analysis SCHEMAFULL;
DEFINE FIELD journey_stages ON journey_analysis TYPE array<object> {
    stage: string,
    entered_at: datetime,
    duration: duration,
    key_actions: array<string>,
    sentiment: float,
    confidence_level: float
};

DEFINE FIELD decision_points ON journey_analysis TYPE array<object> {
    point_type: string,
    timestamp: datetime,
    context: string,
    outcome: string,
    influencing_factors: array<string>
};

-- Add indexes for analytics
DEFINE INDEX idx_search_behavior ON client_analytics 
    FIELDS search_behavior.search_frequency;

DEFINE INDEX idx_viewing_behavior ON client_analytics 
    FIELDS viewing_behavior.viewing_frequency;

DEFINE INDEX idx_journey_stages ON journey_analysis 
    FIELDS journey_stages[*].stage;

-- Add timestamps
DEFINE FIELD created_at ON TABLE client_analytics, journey_analysis
    TYPE datetime DEFAULT time::now();
DEFINE FIELD updated_at ON TABLE client_analytics, journey_analysis
    TYPE datetime;

-- Custom Data Analysis Types
DEFINE TABLE custom_analysis SCHEMAFULL;
DEFINE FIELD client_satisfaction ON custom_analysis TYPE object {
    overall_score: float ASSERT $value >= 0 AND $value <= 1,
    satisfaction_metrics: array<object> {
        metric_name: string,
        current_score: float,
        trend: string,
        improvement_areas: array<string>
    }
};

DEFINE FIELD engagement_velocity ON custom_analysis TYPE object {
    current_velocity: float,
    historical_trend: array<object> {
        period: string,
        velocity: float,
        key_drivers: array<string>
    },
    acceleration_factors: array<string>,
    deceleration_factors: array<string>
};

-- Social Network Analysis
DEFINE TABLE social_network_analysis SCHEMAFULL;
DEFINE FIELD influence_metrics ON social_network_analysis TYPE object {
    centrality_score: float,
    connection_strength: float,
    network_reach: int,
    key_connections: array<object> {
        connection_type: string,
        strength: float,
        influence_level: float
    }
};

DEFINE FIELD referral_potential ON social_network_analysis TYPE object {
    score: float,
    historical_referrals: int,
    potential_referrals: array<object> {
        source: string,
        likelihood: float,
        estimated_timeline: string
    }
};

-- Add timestamps to new components
DEFINE FIELD created_at ON TABLE custom_analysis, social_network_analysis
    TYPE datetime DEFAULT time::now();
DEFINE FIELD updated_at ON TABLE custom_analysis, social_network_analysis
    TYPE datetime;

-- Add indexes for new components
DEFINE INDEX idx_client_satisfaction ON custom_analysis 
    FIELDS client_satisfaction.overall_score;

DEFINE INDEX idx_engagement_velocity ON custom_analysis 
    FIELDS engagement_velocity.current_velocity;

DEFINE INDEX idx_influence_metrics ON social_network_analysis 
    FIELDS influence_metrics.centrality_score;

// ...existing code...

-- Property Relationship Analysis
DEFINE TABLE property_relationship SCHEMAFULL;
DEFINE FIELD emotional_connection ON property_relationship TYPE object {
    bond_strength: float ASSERT $value >= 0 AND $value <= 1,
    attachment_type: string,
    key_emotional_anchors: array<string>,
    concern_areas: array<string>
};

DEFINE FIELD investment_relationship ON property_relationship TYPE object {
    confidence_level: float,
    risk_assessment: object {
        risk_level: float,
        mitigation_strategies: array<string>
    },
    value_perception: object {
        perceived_value: float,
        value_drivers: array<string>
    }
};

DEFINE FIELD ownership_vision ON property_relationship TYPE object {
    timeline: object {
        short_term: array<string>,
        medium_term: array<string>,
        long_term: array<string>
    },
    intended_use: array<string>,
    modification_plans: array<object> {
        type: string,
        priority: float,
        timeline: string
    }
};

-- Add relationship indices
DEFINE INDEX idx_property_relationship ON property_relationship 
    FIELDS emotional_connection.bond_strength, investment_relationship.confidence_level;

-- Add timestamps
DEFINE FIELD created_at ON TABLE property_relationship
    TYPE datetime DEFAULT time::now();
DEFINE FIELD updated_at ON TABLE property_relationship
    TYPE datetime;

// ...existing code...

-- Core Graph Relationships for User Profile
DEFINE RELATION has_social_profile ON TABLE user_profile
    FROM user_profile 
    TO social_profile_record
    CONTENT {
        verified: bool,
        added_at: datetime,
        last_verified: datetime
    };

DEFINE RELATION has_client_history ON TABLE user_profile
    FROM user_profile
    TO client_history_model
    CONTENT {
        created_at: datetime,
        version: string,
        data_quality: float
    };

-- Social Profile Record Table
DEFINE TABLE social_profile_record SCHEMAFULL;
DEFINE FIELD platform ON social_profile_record TYPE string;
DEFINE FIELD username ON social_profile_record TYPE string;
DEFINE FIELD url ON social_profile_record TYPE string;
DEFINE FIELD last_verified ON social_profile_record TYPE datetime;
DEFINE FIELD verification_status ON social_profile_record TYPE string 
    ASSERT $value INSIDE ['Unverified', 'Pending', 'Verified', 'Failed'];

-- Additional Validation Rules
DEFINE FIELD url ON social_profile_record TYPE string 
    ASSERT string::len($value) >= 5;
DEFINE FIELD username ON social_profile_record TYPE string 
    ASSERT string::len($value) >= 2;

-- Additional Indexes for Social Profiles
DEFINE INDEX idx_social_platform ON social_profile_record 
    FIELDS platform, username;
DEFINE INDEX idx_social_verification ON social_profile_record 
    FIELDS verification_status, last_verified;

// ...existing code...

-- Core Graph Relationships
DEFINE RELATION has_personality_profile ON TABLE user_profile
    FROM user_profile
    TO personality_profile
    CONTENT {
        created_at: datetime,
        confidence_score: float,
        last_updated: datetime
    };

DEFINE RELATION has_emotional_profile ON TABLE user_profile
    TO emotional_profile
    CONTENT {
        created_at: datetime,
        confidence_score: float,
        last_updated: datetime
    };

DEFINE RELATION has_life_context ON TABLE user_profile
    TO life_context
    CONTENT {
        created_at: datetime,
        version: string,
        confidence_score: float
    };

DEFINE RELATION owns_property ON TABLE user_profile
    TO property_record
    CONTENT {
        ownership_type: string,
        acquired_date: datetime,
        ownership_percentage: float
    };

DEFINE RELATION affiliated_with ON TABLE user_profile
    TO agency_record
    CONTENT {
        role: string,
        start_date: datetime,
        end_date: datetime?,
        is_active: bool
    };

DEFINE RELATION had_interaction ON TABLE user_profile
    TO interaction_record
    CONTENT {
        location: string?,
        duration_minutes: int?
    };

DEFINE RELATION performed_search ON TABLE user_profile
    TO search_record
    CONTENT {
        device_info: string?,
        session_id: string
    };

DEFINE RELATION has_preference ON TABLE user_profile
    TO preference_record
    CONTENT {
        priority: int,
        added_at: datetime,
        updated_at: datetime
    };

-- Behavioral Analysis Relationships
DEFINE RELATION exhibits_pattern ON TABLE user_profile
    TO behavioral_insights
    CONTENT {
        confidence: float,
        first_observed: datetime,
        last_observed: datetime
    };

DEFINE RELATION has_decision_process ON TABLE user_profile
    TO decision_process
    CONTENT {
        confidence_score: float,
        last_analyzed: datetime
    };

DEFINE RELATION has_communication_style ON TABLE user_profile
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
    
    -- User API Key Table
    DEFINE TABLE user_api_key SCHEMAFULL;
    DEFINE FIELD id ON user_api_key TYPE record(api_key);
    DEFINE FIELD api_key ON user_api_key TYPE string ASSERT $value != NONE;
    DEFINE FIELD name ON user_api_key TYPE string ASSERT $value != NONE;
    DEFINE FIELD scopes ON user_api_key TYPE array 
        ASSERT array::all($value, {v | v INSIDE ['ReadOnly', 'WriteOnly', 'ReadWrite', 'Admin'] 
        OR string::starts_with(v, 'Custom_')});
    DEFINE FIELD created_at ON user_api_key TYPE datetime DEFAULT time::now();
    DEFINE FIELD expires_at ON user_api_key TYPE datetime;
    DEFINE FIELD last_used_at ON user_api_key TYPE datetime;
    DEFINE FIELD is_active ON user_api_key TYPE bool DEFAULT true;
    DEFINE FIELD created_by ON user_api_key TYPE record(user);
    
    -- User Settings Table
    DEFINE TABLE user_settings SCHEMAFULL;
    DEFINE FIELD notification_preferences ON user_settings TYPE object {
        email_notifications: bool,
        push_notifications: bool,
        sms_notifications: bool,
        notification_types: object
    };
    DEFINE FIELD display_preferences ON user_settings TYPE object {
        mainTheme: string,
        language: string,
        timezone: string,
        currency: string
    };
    DEFINE FIELD privacy_settings ON user_settings TYPE object {
        profile_visibility: string ASSERT $value INSIDE ['Public', 'Private', 'ContactsOnly', 'Custom'],
        contact_permissions: object {
            allow_email_contact: bool,
            allow_phone_contact: bool,
            allow_message_contact: bool,
            preferred_contact_method: string
        },
        data_sharing: object {
            share_profile: bool,
            share_activity: bool,
            share_statistics: bool,
            marketing_emails: bool
        }
    };
    
    -- User Metadata Table
    DEFINE TABLE user_metadata SCHEMAFULL;
    DEFINE FIELD last_active ON user_metadata TYPE datetime;
    DEFINE FIELD login_count ON user_metadata TYPE number;
    DEFINE FIELD failed_login_attempts ON user_metadata TYPE number;
    DEFINE FIELD password_updated_at ON user_metadata TYPE datetime;
    DEFINE FIELD security_events ON user_metadata TYPE array<object> {
        event_type: string,
        timestamp: datetime,
        ip_address: string,
        user_agent: string,
        location: string?,
        details: object
    };
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
    
    // ...existing code...
    
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
    
    // ...existing code...
    
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
    
    // ...existing code...
    
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
    
    // ...existing code...
    
    -- Auth Token and API Key Management Tables
    DEFINE TABLE auth_token SCHEMAFULL;
    DEFINE FIELD token ON auth_token TYPE string;
    DEFINE FIELD user_id ON auth_token TYPE record(user);
    DEFINE FIELD created_at ON auth_token TYPE datetime DEFAULT time::now();
    DEFINE FIELD expires_at ON auth_token TYPE datetime;
    DEFINE FIELD is_revoked ON auth_token TYPE bool DEFAULT false;
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
    
    -- User API Key Table
    DEFINE TABLE user_api_key SCHEMAFULL;
    DEFINE FIELD id ON user_api_key TYPE record(api_key);
    DEFINE FIELD api_key ON user_api_key TYPE string ASSERT $value != NONE;
    DEFINE FIELD name ON user_api_key TYPE string ASSERT $value != NONE;
    DEFINE FIELD scopes ON user_api_key TYPE array 
        ASSERT array::all($value, {v | v INSIDE ['ReadOnly', 'WriteOnly', 'ReadWrite', 'Admin'] 
        OR string::starts_with(v, 'Custom_')});
    DEFINE FIELD created_at ON user_api_key TYPE datetime DEFAULT time::now();
    DEFINE FIELD expires_at ON user_api_key TYPE datetime;
    DEFINE FIELD last_used_at ON user_api_key TYPE datetime;
    DEFINE FIELD is_active ON user_api_key TYPE bool DEFAULT true;
    DEFINE FIELD created_by ON user_api_key TYPE record(user);
    
    -- User Settings Table
    DEFINE TABLE user_settings SCHEMAFULL;
    DEFINE FIELD notification_preferences ON user_settings TYPE object {
        email_notifications: bool,
        push_notifications: bool,
        sms_notifications: bool,
        notification_types: object
    };
    DEFINE FIELD display_preferences ON user_settings TYPE object {
        mainTheme: string,
        language: string,
        timezone: string,
        currency: string
    };
    DEFINE FIELD privacy_settings ON user_settings TYPE object {
        profile_visibility: string ASSERT $value INSIDE ['Public', 'Private', 'ContactsOnly', 'Custom'],
        contact_permissions: object {
            allow_email_contact: bool,
            allow_phone_contact: bool,
            allow_message_contact: bool,
            preferred_contact_method: string
        },
        data_sharing: object {
            share_profile: bool,
            share_activity: bool,
            share_statistics: bool,
            marketing_emails: bool
        }
    };
    
    -- User Metadata Table
    DEFINE TABLE user_metadata SCHEMAFULL;
    DEFINE FIELD last_active ON user_metadata TYPE datetime;
    DEFINE FIELD login_count ON user_metadata TYPE number;
    DEFINE FIELD failed_login_attempts ON user_metadata TYPE number;
    DEFINE FIELD password_updated_at ON user_metadata TYPE datetime;
    DEFINE FIELD security_events ON user_metadata TYPE array<object> {
        event_type: string,
        timestamp: datetime,
        ip_address: string,
        user_agent: string,
        location: string?,
        details: object
    };
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
    
    // ...existing code...
    
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
    
    // ...existing code...
    
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
    
    // ...existing code...
    
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
    
    // ...existing code...
    
    -- Auth Token and API Key Management Tables
    DEFINE TABLE auth_token SCHEMAFULL;
    DEFINE FIELD token ON auth_token TYPE string;
    DEFINE FIELD user_id ON auth_token TYPE record(user);
    DEFINE FIELD created_at ON auth_token TYPE datetime DEFAULT time::now();
    DEFINE FIELD expires_at ON auth_token TYPE datetime;
    DEFINE FIELD is_revoked ON auth_token TYPE bool DEFAULT false;    TO communication_patterns
    CONTENT {
        created_at: datetime,
        effectiveness_score: float,
        style_match: float
    };

DEFINE RELATION tracks_journey ON TABLE user_profile
    TO journey_analysis
    CONTENT {
        created_at: datetime,
        current_stage: string,
        progress_score: float
    };

DEFINE RELATION tracks_analytics ON TABLE user_profile
    TO client_analytics
    CONTENT {
        created_at: datetime,
        data_quality: float,
        analysis_version: string
    };

DEFINE RELATION has_property_relationship ON TABLE user_profile
    TO property_relationship
    CONTENT {
        created_at: datetime,
        emotional_connection: float,
        practical_connection: float
    };

DEFINE RELATION manages_agency ON TABLE user_profile
    TO agency_record
    CONTENT {
        role: string,
        permissions: array<string>,        -- Core User Profile Model
        DEFINE TABLE user_profile SCHEMAFULL;
        DEFINE FIELD id ON user_profile TYPE record(user_profile);
        DEFINE FIELD first_name ON user_profile TYPE string;
        DEFINE FIELD last_name ON user_profile TYPE string;
        DEFINE FIELD gender ON user_profile TYPE string;
        DEFINE FIELD client_type ON user_profile TYPE array<string>;
        DEFINE FIELD date_of_birth ON user_profile TYPE datetime;
        DEFINE FIELD social_profiles ON user_profile TYPE object;
        DEFINE FIELD client_history ON user_profile TYPE object;
        
        -- Client History Graph
        DEFINE TABLE client_history_graph SCHEMAFULL;
        DEFINE FIELD interactions ON client_history_graph TYPE array<object>;
        DEFINE FIELD searches ON client_history_graph TYPE array<object>;
        DEFINE FIELD viewings ON client_history_graph TYPE array<object>;
        
        -- Personality Profile Table (from PersonalityProfile struct)
        DEFINE TABLE personality_profile SCHEMAFULL;
        DEFINE FIELD traits ON personality_profile TYPE array<object>;
        DEFINE FIELD communication_style ON personality_profile TYPE object;
        DEFINE FIELD decision_making ON personality_profile TYPE object;
        DEFINE FIELD adaptability ON personality_profile TYPE object;
        DEFINE FIELD social_preferences ON personality_profile TYPE object;
        DEFINE FIELD created_at ON personality_profile TYPE datetime;
        DEFINE FIELD updated_at ON personality_profile TYPE datetime;
        
        -- Emotional Profile Table (from EmotionalProfile struct)
        DEFINE TABLE emotional_profile SCHEMAFULL;
        DEFINE FIELD trust_factors ON emotional_profile TYPE array<object>;
        DEFINE FIELD emotional_triggers ON emotional_profile TYPE array<object>;
        DEFINE FIELD stress_responses ON emotional_profile TYPE array<object>;
        DEFINE FIELD comfort_zones ON emotional_profile TYPE array<object>;
        DEFINE FIELD emotional_intelligence ON emotional_profile TYPE object;
        DEFINE FIELD relationship_patterns ON emotional_profile TYPE object;
        DEFINE FIELD created_at ON emotional_profile TYPE datetime;
        DEFINE FIELD updated_at ON emotional_profile TYPE datetime;
        
        -- Life Context Table (from LifeContext struct)
        DEFINE TABLE life_context SCHEMAFULL;
        DEFINE FIELD current_life_stage ON life_context TYPE object;
        DEFINE FIELD family_situation ON life_context TYPE object;
        DEFINE FIELD career_context ON life_context TYPE object;
        DEFINE FIELD financial_context ON life_context TYPE object;
        DEFINE FIELD life_events ON life_context TYPE array<object>;
        DEFINE FIELD future_plans ON life_context TYPE array<object>;
        DEFINE FIELD lifestyle_preferences ON life_context TYPE object;
        
        -- Communication Patterns
        DEFINE TABLE communication_patterns SCHEMAFULL;
        DEFINE FIELD response_times ON communication_patterns TYPE object;
        DEFINE FIELD boundaries ON communication_patterns TYPE object;
        DEFINE FIELD meeting_preferences ON communication_patterns TYPE object;
        DEFINE FIELD follow_up_preferences ON communication_patterns TYPE object;
        
        -- Decision Making Process
        DEFINE TABLE decision_process SCHEMAFULL;
        DEFINE FIELD decision_speed ON decision_process TYPE object;
        DEFINE FIELD negotiation_style ON decision_process TYPE object;
        DEFINE FIELD feedback_patterns ON decision_process TYPE object;
        DEFINE FIELD adaptability ON decision_process TYPE object;
        DEFINE FIELD social_dynamics ON decision_process TYPE object;
        DEFINE FIELD property_decision_factors ON decision_process TYPE object;
        
        -- Behavioral Insights Additional Components
        DEFINE TABLE behavioral_insights SCHEMAFULL;
        DEFINE FIELD hesitation_points ON behavioral_insights TYPE array<object>;
        DEFINE FIELD confidence_builders ON behavioral_insights TYPE array<object>;
        DEFINE FIELD risk_assessment ON behavioral_insights TYPE object;
        DEFINE FIELD motivation_factors ON behavioral_insights TYPE object;
        DEFINE FIELD behavioral_flags ON behavioral_insights TYPE object;
        DEFINE FIELD success_patterns ON behavioral_insights TYPE object;
        
        -- Success Pattern Analysis
        DEFINE TABLE success_pattern_analysis SCHEMAFULL;
        DEFINE FIELD engagement_success ON success_pattern_analysis TYPE array<object>;
        DEFINE FIELD interaction_success ON success_pattern_analysis TYPE array<object>;
        DEFINE FIELD decision_catalysts ON success_pattern_analysis TYPE array<object>;
        
        -- Adding Duration field type support
        DEFINE FIELD ideal_timeline ON timeline_preferences TYPE duration VALUE duration::from::minutes($value);
        DEFINE FIELD flexibility ON timeline_preferences TYPE duration;
        
        -- Additional Property Preferences Components
        DEFINE TABLE property_preferences SCHEMAFULL;
        DEFINE FIELD nice_to_haves ON property_preferences TYPE array<object>;
        DEFINE FIELD budget_constraints ON property_preferences TYPE object;
        DEFINE FIELD timeline_preferences ON property_preferences TYPE object;
        DEFINE FIELD size_requirements ON property_preferences TYPE object;
        
        -- Add timestamps to all major components
        DEFINE FIELD created_at ON TABLE property_preferences, communication_patterns, behavioral_insights TYPE datetime DEFAULT time::now();
        
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

DEFINE RELATION tracks_success_patterns ON TABLE user_profile
    TO success_pattern_analysis
    CONTENT {
        identified_at: datetime,
        pattern_strength: float,
        validation_score: float
    };

DEFINE RELATION has_custom_analysis ON TABLE user_profile
    TO custom_analysis
    CONTENT {
        analysis_type: string,
        created_at: datetime,
        confidence_score: float
    };

DEFINE RELATION belongs_to_network ON TABLE user_profile
    TO social_network_analysis
    CONTENT {
        joined_at: datetime,
        connection_strength: float,
        network_role: string
    };

-- Add timestamps to all relations
DEFINE FIELD created_at ON TABLE has_communication_style, tracks_journey, 
    tracks_analytics, has_property_relationship, manages_agency, 
    tracks_success_patterns, has_custom_analysis, belongs_to_network
    TYPE datetime DEFAULT time::now();

DEFINE FIELD updated_at ON TABLE has_communication_style, tracks_journey, 
    tracks_analytics, has_property_relationship, manages_agency,
    tracks_success_patterns, has_custom_analysis, belongs_to_network
    TYPE datetime;
