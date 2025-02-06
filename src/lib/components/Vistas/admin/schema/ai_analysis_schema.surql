-- Define conversation node table
DEFINE TABLE conversation_node SCHEMAFULL;
DEFINE FIELD id ON conversation_node TYPE string;
DEFINE FIELD conversation_id ON conversation_node TYPE string;
DEFINE FIELD utterance ON conversation_node TYPE object {
    text: string,
    speaker: string,
    timestamp: datetime
};
DEFINE FIELD embedding ON conversation_node TYPE array;
DEFINE FIELD analysis ON conversation_node TYPE object {
    dialogue_act: string,
    sentiment: float,
    topics: array,
    semantic_features: array,
    contextual_relevance: float
};
DEFINE FIELD metadata ON conversation_node TYPE object;
DEFINE INDEX conversation_node_embedding ON conversation_node FIELDS embedding VECTOR 384 COSINE;

-- Define conversation edge table for relationships
DEFINE TABLE conversation_edge SCHEMAFULL;
DEFINE FIELD from ON conversation_edge TYPE record(conversation_node);
DEFINE FIELD to ON conversation_edge TYPE record(conversation_node);
DEFINE FIELD conversation_id ON conversation_edge TYPE string;
DEFINE FIELD edge_type ON conversation_edge TYPE string;
DEFINE FIELD weight ON conversation_edge TYPE float;
DEFINE FIELD features ON conversation_edge TYPE object;

-- Define conversation state table
DEFINE TABLE conversation_state SCHEMAFULL;
DEFINE FIELD conversation_id ON conversation_state TYPE string;
DEFINE FIELD current_topic ON conversation_state TYPE array;
DEFINE FIELD emotional_trajectory ON conversation_state TYPE array;
DEFINE FIELD script_progress ON conversation_state TYPE object {
    current_step: string,
    completed_steps: array,
    compliance_score: float
};
DEFINE FIELD interaction_metrics ON conversation_state TYPE object {
    turn_taking_rate: float,
    response_times: array,
    engagement_score: float
};
DEFINE FIELD context_window ON conversation_state TYPE array;

-- Define pattern table
DEFINE TABLE conversation_pattern SCHEMAFULL;
DEFINE FIELD pattern_type ON conversation_pattern TYPE string;
DEFINE FIELD sequence ON conversation_pattern TYPE array;
DEFINE FIELD frequency ON conversation_pattern TYPE int;
DEFINE FIELD significance ON conversation_pattern TYPE float;
DEFINE FIELD context ON conversation_pattern TYPE object;
DEFINE FIELD outcomes ON conversation_pattern TYPE array;

-- Define metrics table
DEFINE TABLE conversation_metrics SCHEMAFULL;
DEFINE FIELD conversation_id ON conversation_metrics TYPE string;
DEFINE FIELD timestamp ON conversation_metrics TYPE datetime;
DEFINE FIELD turn_taking ON conversation_metrics TYPE object {
    average_turn_length: float,
    turn_distribution: object,
    interruption_count: int,
    silence_durations: array,
    response_times: array
};
DEFINE FIELD engagement ON conversation_metrics TYPE object {
    topic_engagement_scores: object,
    emotional_engagement: float,
    question_response_rate: float,
    elaboration_rate: float
};
DEFINE FIELD semantic_coherence ON conversation_metrics TYPE object {
    topic_consistency: float,
    contextual_relevance: float,
    semantic_flow: array
};
DEFINE FIELD script_compliance ON conversation_metrics TYPE object {
    compliance_score: float,
    deviation_count: int,
    completed_requirements: array
};

-- Define analysis result table
DEFINE TABLE analysis_node SCHEMAFULL;
DEFINE FIELD timestamp ON analysis_node TYPE datetime;
DEFINE FIELD conversation_id ON analysis_node TYPE string;
DEFINE FIELD features ON analysis_node TYPE object;
DEFINE FIELD metrics ON analysis_node TYPE object;
DEFINE FIELD patterns ON analysis_node TYPE array;

-- Define event scopes
DEFINE SCOPE conversation_analysis SESSION 24h
    SIGNUP ( CREATE conversation_node )
    SIGNIN ( SELECT * FROM conversation_node );

-- Define functions for pattern analysis
DEFINE FUNCTION fn::find_similar_patterns($embedding: array) -> array {
    RETURN SELECT 
        *,
        vector::similarity(embedding, $embedding) as similarity
    FROM conversation_pattern
    WHERE vector::similarity(embedding, $embedding) > 0.7
    ORDER BY similarity DESC
    LIMIT 10;
};

-- Define functions for metric aggregation
DEFINE FUNCTION fn::aggregate_conversation_metrics($conversation_id: string, $window: duration) -> object {
    LET $end = time::now();
    LET $start = time::now() - $window;

    RETURN SELECT {
        turn_taking: {
            avg_turn_length: math::mean(turn_taking.average_turn_length),
            total_interruptions: math::sum(turn_taking.interruption_count)
        },
        engagement: {
            avg_engagement: math::mean(engagement.emotional_engagement),
            topic_coverage: array::len(engagement.topic_engagement_scores)
        },
        compliance: {
            avg_compliance: math::mean(script_compliance.compliance_score),
            total_deviations: math::sum(script_compliance.deviation_count)
        }
    } FROM conversation_metrics 
    WHERE conversation_id = $conversation_id 
    AND timestamp > $start 
    AND timestamp <= $end
    GROUP BY conversation_id;
};

-- Cross-Platform Analysis Tables
DEFINE TABLE platform_analysis_mapping SCHEMAFULL;
DEFINE FIELD platform_id ON platform_analysis_mapping TYPE record(communication_platform);
DEFINE FIELD analysis_rules ON platform_analysis_mapping TYPE array<object> {
    message_type: string,
    extraction_rules: array,
    feature_mapping: object,
    platform_specific_metrics: object
};
DEFINE FIELD analysis_weights ON platform_analysis_mapping TYPE object {
    sentiment_weight: float,
    engagement_weight: float,
    compliance_weight: float
};

-- Multi-Platform Analysis Coordination
DEFINE TABLE platform_analysis_coordinator SCHEMAFULL;
DEFINE FIELD coordinator_id ON platform_analysis_coordinator TYPE string;
DEFINE FIELD active_platforms ON platform_analysis_coordinator TYPE array<object> {
    platform: record(communication_platform),
    analysis_config: object,
    priority: int,
    weight: float
};
DEFINE FIELD correlation_rules ON platform_analysis_coordinator TYPE array<object> {
    source_platform: record(communication_platform),
    target_platform: record(communication_platform),
    correlation_type: string,
    mapping_rules: array
};
DEFINE FIELD unified_metrics ON platform_analysis_coordinator TYPE object {
    global_sentiment: float,
    cross_platform_coherence: float,
    interaction_effectiveness: float
};

-- Enhanced Analysis Functions
DEFINE FUNCTION fn::analyze_cross_platform_interaction(
    $message_id: string,
    $platform_context: object
) -> object {
    LET $message = (
        SELECT * FROM message_node
        WHERE id = $message_id
    );

    LET $platform_rules = (
        SELECT analysis_rules, analysis_weights
        FROM platform_analysis_mapping
        WHERE platform_id = $message.platform_id
    );

    RETURN {
        base_analysis: fn::perform_base_analysis($message),
        platform_specific: fn::apply_platform_rules($message, $platform_rules),
        cross_platform_context: fn::extract_cross_platform_context($message, $platform_context),
        unified_metrics: fn::compute_unified_metrics($message, $platform_rules.analysis_weights)
    };
};

DEFINE FUNCTION fn::analyze_cross_platform_conversation(
    $session_id: string
) -> object {
    LET $coordinator = (
        SELECT * FROM platform_analysis_coordinator
        WHERE session_id = $session_id
    );

    LET $platform_analyses = array::map(
        $coordinator.active_platforms,
        function($platform) {
            RETURN fn::analyze_platform_specific(
                $platform.platform,
                $platform.analysis_config
            );
        }
    );

    LET $correlated_analysis = fn::correlate_platform_analyses(
        $platform_analyses,
        $coordinator.correlation_rules
    );

    RETURN {
        unified_analysis: fn::compute_unified_analysis($correlated_analysis),
        platform_specific: $platform_analyses,
        cross_platform_patterns: fn::detect_cross_platform_patterns($correlated_analysis),
        recommendations: fn::generate_multi_platform_recommendations($correlated_analysis)
    };
};

-- Unified Pattern Detection
DEFINE FUNCTION fn::detect_cross_platform_patterns(
    $conversation_id: string,
    $platforms: array
) -> array {
    LET $interactions = (
        SELECT * FROM message_node
        WHERE conversation_id = $conversation_id
        AND platform_id IN $platforms
        ORDER BY timestamp
    );

    RETURN {
        platform_transitions: fn::analyze_platform_transitions($interactions),
        communication_flows: fn::identify_communication_flows($interactions),
        interaction_patterns: fn::detect_interaction_patterns($interactions),
        platform_preferences: fn::analyze_platform_preferences($interactions)
    };
};

-- Real-time Analysis Coordination
DEFINE TABLE realtime_analysis_coordinator SCHEMAFULL;
DEFINE FIELD coordinator_id ON realtime_analysis_coordinator TYPE string;
DEFINE FIELD active_streams ON realtime_analysis_coordinator TYPE array<record(communication_stream)>;
DEFINE FIELD analysis_config ON realtime_analysis_coordinator TYPE object {
    analysis_interval: duration,
    batch_size: int,
    priority_rules: array,
    feature_extraction: object
};
DEFINE FIELD stream_metrics ON realtime_analysis_coordinator TYPE object {
    processing_latency: float,
    analysis_throughput: float,
    pattern_detection_rate: float
};

-- Cross-Platform Pattern Analysis
DEFINE TABLE cross_platform_pattern SCHEMAFULL;
DEFINE FIELD pattern_id ON cross_platform_pattern TYPE string;
DEFINE FIELD platforms ON cross_platform_pattern TYPE array<record(communication_platform)>;
DEFINE FIELD pattern_signature ON cross_platform_pattern TYPE array;
DEFINE FIELD pattern_metrics ON cross_platform_pattern TYPE object {
    occurrence_frequency: float,
    success_rate: float,
    platform_effectiveness: object
};
DEFINE INDEX pattern_signature_idx ON cross_platform_pattern FIELDS pattern_signature VECTOR 384 COSINE;

-- Real-time Pattern Detection Function
DEFINE FUNCTION fn::detect_realtime_patterns(
    $stream_id: string,
    $analysis_window: duration
) -> array {
    LET $interactions = (
        SELECT * FROM unified_communication_node
        WHERE stream_id = $stream_id
        AND timestamp > time::now() - $analysis_window
        ORDER BY timestamp
    );

    RETURN {
        emerging_patterns: fn::identify_emerging_patterns($interactions),
        cross_platform_flows: fn::analyze_communication_flows($interactions),
        interaction_sequences: fn::extract_interaction_sequences($interactions),
        platform_transitions: fn::detect_platform_transitions($interactions)
    };
};

-- Core Analysis Data Structures
DEFINE TABLE utterance SCHEMAFULL;
DEFINE FIELD id ON utterance TYPE string;
DEFINE FIELD text ON utterance TYPE string;
DEFINE FIELD speaker ON utterance TYPE string;
DEFINE FIELD timestamp ON utterance TYPE datetime;
DEFINE FIELD metadata ON utterance TYPE object;

-- Analysis Results
DEFINE TABLE analysis_result SCHEMAFULL;
DEFINE FIELD embedding ON analysis_result TYPE array;
DEFINE FIELD semantic_features ON analysis_result TYPE array<string>;
DEFINE FIELD dialogue_act ON analysis_result TYPE string;
DEFINE FIELD sentiment ON analysis_result TYPE object {
    score: float,
    components: array
};
DEFINE FIELD topic_classification ON analysis_result TYPE array<string>;
DEFINE FIELD contextual_relevance ON analysis_result TYPE float;
DEFINE FIELD attention_weights ON analysis_result TYPE array;

-- Pattern Detection Structures
DEFINE TABLE dialogue_element SCHEMAFULL;
DEFINE FIELD dialogue_act ON dialogue_element TYPE string;
DEFINE FIELD semantic_features ON dialogue_element TYPE array;
DEFINE FIELD topic_context ON dialogue_element TYPE array;
DEFINE FIELD sentiment ON dialogue_element TYPE float;
DEFINE INDEX dialogue_features ON dialogue_element FIELDS semantic_features VECTOR 384 COSINE;

-- Compliance Monitoring
DEFINE TABLE compliance_state SCHEMAFULL;
DEFINE FIELD current_step ON compliance_state TYPE string;
DEFINE FIELD completed_steps ON compliance_state TYPE array;
DEFINE FIELD required_points ON compliance_state TYPE object;
DEFINE FIELD deviation_history ON compliance_state TYPE array<object> {
    timestamp: datetime,
    deviation_type: string,
    context: string,
    severity: string,
    resolution: option<object>
};
DEFINE FIELD satisfaction_scores ON compliance_state TYPE object;

-- Response Generation
DEFINE TABLE response_strategy SCHEMAFULL;
DEFINE FIELD context ON response_strategy TYPE record(conversation_context);
DEFINE FIELD detected_patterns ON response_strategy TYPE array<record(conversation_pattern)>;
DEFINE FIELD script_position ON response_strategy TYPE object;
DEFINE FIELD intervention_history ON response_strategy TYPE array;

DEFINE TABLE generated_response SCHEMAFULL;
DEFINE FIELD text ON generated_response TYPE string;
DEFINE FIELD confidence ON generated_response TYPE float;
DEFINE FIELD context_relevance ON generated_response TYPE float;
DEFINE FIELD script_alignment ON generated_response TYPE float;
DEFINE FIELD tone_attributes ON generated_response TYPE object;
DEFINE FIELD timing_suggestion ON generated_response TYPE object;

-- Real-time Metrics Processing
DEFINE TABLE real_time_metrics SCHEMAFULL;
DEFINE FIELD timestamp ON real_time_metrics TYPE datetime;
DEFINE FIELD conversation_id ON real_time_metrics TYPE string;
DEFINE FIELD turn_taking ON real_time_metrics TYPE object {
    average_turn_length: float,
    turn_distribution: object,
    interruption_count: int,
    silence_durations: array,
    response_times: array
};
DEFINE FIELD engagement ON real_time_metrics TYPE object {
    topic_engagement_scores: object,
    emotional_engagement: float,
    question_response_rate: float,
    elaboration_rate: float
};

-- Enhanced Pattern Analysis Functions
DEFINE FUNCTION fn::analyze_dialogue_sequence(
    $elements: array,
    $pattern_type: string
) -> object {
    LET $sequence = (
        SELECT * FROM dialogue_element
        WHERE id IN $elements
        ORDER BY timestamp
    );

    RETURN {
        pattern_type: $pattern_type,
        sequence: array::collect($sequence),
        frequency: fn::calculate_pattern_frequency($sequence),
        significance: fn::calculate_pattern_significance($sequence),
        context: fn::extract_pattern_context($sequence),
        outcomes: fn::analyze_pattern_outcomes($sequence)
    };
};

-- Real-time Metrics Processing Functions
DEFINE FUNCTION fn::process_realtime_metrics(
    $conversation_id: string,
    $window: duration
) -> object {
    LET $recent_metrics = (
        SELECT * FROM real_time_metrics
        WHERE conversation_id = $conversation_id
        AND timestamp > time::now() - $window
        ORDER BY timestamp DESC
    );

    RETURN {
        current_metrics: fn::calculate_current_metrics($recent_metrics),
        trends: fn::analyze_metric_trends($recent_metrics),
        anomalies: fn::detect_metric_anomalies($recent_metrics)
    };
};

// Core Analysis Data Structures (matching Rust structs)
DEFINE TABLE context_metadata SCHEMAFULL;
DEFINE FIELD session_id ON context_metadata TYPE string;
DEFINE FIELD environment ON context_metadata TYPE object;
DEFINE FIELD custom_attributes ON context_metadata TYPE object;

-- Conversation State Extensions
DEFINE TABLE conversation_context SCHEMAFULL;
DEFINE FIELD current_utterance ON conversation_context TYPE record(utterance);
DEFINE FIELD history ON conversation_context TYPE array<record(utterance)>;
DEFINE FIELD metadata ON conversation_context TYPE record(context_metadata);
DEFINE FIELD state ON conversation_context TYPE record(conversation_state);

-- Analysis Extensions
DEFINE TABLE detailed_analysis SCHEMAFULL;
DEFINE FIELD embedding ON detailed_analysis TYPE array;
DEFINE FIELD semantic_features ON detailed_analysis TYPE array<string>;
DEFINE FIELD dialogue_act ON detailed_analysis TYPE string;
DEFINE FIELD sentiment ON detailed_analysis TYPE object {
    score: float,
    metrics: object
};
DEFINE FIELD topic_classification ON detailed_analysis TYPE array<string>;
DEFINE FIELD contextual_relevance ON detailed_analysis TYPE float;
DEFINE FIELD attention_weights ON detailed_analysis TYPE array;

-- Pattern Detection Extensions
DEFINE TABLE pattern_context SCHEMAFULL;
DEFINE FIELD pattern_type ON pattern_context TYPE string;
DEFINE FIELD sequence ON pattern_context TYPE array<record(dialogue_element)>;
DEFINE FIELD frequency ON pattern_context TYPE int;
DEFINE FIELD significance ON pattern_context TYPE float;
DEFINE FIELD context ON pattern_context TYPE object;
DEFINE FIELD outcomes ON pattern_context TYPE array;

-- Enhanced Metrics
DEFINE TABLE temporal_dynamics SCHEMAFULL;
DEFINE FIELD sequence_patterns ON temporal_dynamics TYPE array;
DEFINE FIELD time_series_metrics ON temporal_dynamics TYPE object;
DEFINE FIELD seasonality ON temporal_dynamics TYPE object;

-- Script Compliance Extensions
DEFINE TABLE script_deviation SCHEMAFULL;
DEFINE FIELD timestamp ON script_deviation TYPE datetime;
DEFINE FIELD deviation_type ON script_deviation TYPE string;
DEFINE FIELD context ON script_deviation TYPE string;
DEFINE FIELD severity ON script_deviation TYPE string;
DEFINE FIELD resolution ON script_deviation TYPE option<object>;

-- Response Generation
DEFINE TABLE response_memory SCHEMAFULL;
DEFINE FIELD patterns ON response_memory TYPE array<record(conversation_pattern)>;
DEFINE FIELD interventions ON response_memory TYPE array;
DEFINE FIELD effectiveness ON response_memory TYPE object;

-- Real-time Processing
DEFINE TABLE real_time_state SCHEMAFULL;
DEFINE FIELD metrics ON real_time_state TYPE object {
    current_metrics: object,
    historic_metrics: array,
    predictions: object
};
DEFINE FIELD active_patterns ON real_time_state TYPE array<record(pattern_context)>;
DEFINE FIELD interventions ON real_time_state TYPE array;

-- Enhanced Functions for Pattern Analysis
DEFINE FUNCTION fn::analyze_pattern_sequence(
    $pattern: object,
    $context: object
) -> object {
    // ...existing code...
};

-- Real-time Metrics Processing
DEFINE FUNCTION fn::process_metrics_stream(
    $conversation_id: string,
    $window: duration
) -> object {
    // ...existing code...
};

-- Compliance Monitoring
DEFINE FUNCTION fn::monitor_script_compliance(
    $conversation_id: string
) -> object {
    // ...existing code...
};

-- Define additional security scopes
DEFINE SCOPE metrics_processing SESSION 1h
    SIGNUP ( CREATE real_time_metrics )
    SIGNIN ( 
        SELECT * FROM real_time_metrics 
        WHERE timestamp > time::now() - 1h
    );

DEFINE SCOPE pattern_analysis SESSION 24h
    SIGNUP ( CREATE pattern_context )
    SIGNIN ( 
        SELECT * FROM pattern_context, conversation_pattern
    );

// Add missing type definitions for dialogue elements
DEFINE TABLE dialogue_act SCHEMAFULL;
DEFINE FIELD act_type ON dialogue_act TYPE string;
DEFINE FIELD features ON dialogue_act TYPE array;

// Add sentiment metrics structure
DEFINE TABLE sentiment_metrics SCHEMAFULL;
DEFINE FIELD score ON sentiment_metrics TYPE float;
DEFINE FIELD components ON sentiment_metrics TYPE array;
DEFINE FIELD confidence ON sentiment_metrics TYPE float;

// Add pattern outcome structure
DEFINE TABLE pattern_outcome SCHEMAFULL;
DEFINE FIELD outcome_type ON pattern_outcome TYPE string;
DEFINE FIELD metrics ON pattern_outcome TYPE object;
DEFINE FIELD confidence ON pattern_outcome TYPE float;

// Add tone attributes
DEFINE TABLE tone_attributes SCHEMAFULL;
DEFINE FIELD emotions ON tone_attributes TYPE array;
DEFINE FIELD formality ON tone_attributes TYPE float;
DEFINE FIELD urgency ON tone_attributes TYPE float;

// Add timing suggestion
DEFINE TABLE timing_suggestion SCHEMAFULL;
DEFINE FIELD optimal_delay ON timing_suggestion TYPE float;
DEFINE FIELD confidence ON timing_suggestion TYPE float;
DEFINE FIELD context_factors ON timing_suggestion TYPE array;

// Add pattern memory structure
DEFINE TABLE pattern_memory SCHEMAFULL;
DEFINE FIELD patterns ON pattern_memory TYPE array<record(conversation_pattern)>;
DEFINE FIELD frequency_map ON pattern_memory TYPE object;
DEFINE FIELD recent_matches ON pattern_memory TYPE array;

// Add intervention structure
DEFINE TABLE intervention SCHEMAFULL;
DEFINE FIELD type ON intervention TYPE string;
DEFINE FIELD trigger ON intervention TYPE object;
DEFINE FIELD action ON intervention TYPE object;
DEFINE FIELD timestamp ON intervention TYPE datetime;

// Add semantic coherence metrics
DEFINE TABLE semantic_coherence_metrics SCHEMAFULL;
DEFINE FIELD topic_consistency ON semantic_coherence_metrics TYPE float;
DEFINE FIELD contextual_relevance ON semantic_coherence_metrics TYPE float;
DEFINE FIELD semantic_flow ON semantic_coherence_metrics TYPE array;

// Add temporal dynamics
DEFINE TABLE temporal_dynamics SCHEMAFULL;
DEFINE FIELD sequence_patterns ON temporal_dynamics TYPE array;
DEFINE FIELD time_series_metrics ON temporal_dynamics TYPE object;
DEFINE FIELD seasonality ON temporal_dynamics TYPE object;

// Add enhanced analysis functions
DEFINE FUNCTION fn::process_conversation_turn(
    $conversation_id: string,
    $utterance: object,
    $context: object
) -> object {
    // Create graph node
    LET $node = (
        CREATE conversation_node CONTENT {
            conversation_id: $conversation_id,
            utterance: $utterance,
            timestamp: time::now()
        }
    );

    // Update conversation state
    UPDATE conversation_state 
    SET 
        current_utterance = $utterance,
        history = array::append(history, $utterance)
    WHERE conversation_id = $conversation_id;

    // Analyze patterns
    LET $patterns = fn::detect_patterns($node.id);

    RETURN {
        node: $node,
        patterns: $patterns,
        state: fn::get_current_state($conversation_id)
    };
};

// Add pattern analysis function
DEFINE FUNCTION fn::analyze_pattern_significance(
    $pattern: object,
    $conversation_id: string
) -> object {
    // Calculate pattern metrics
    LET $metrics = (
        SELECT 
            count() as frequency,
            math::mean(significance) as avg_significance,
            array::collect(outcomes) as historical_outcomes
        FROM conversation_pattern
        WHERE pattern_type = $pattern.type
        AND conversation_id = $conversation_id
    );

    RETURN {
        significance: $metrics.avg_significance,
        frequency: $metrics.frequency,
        outcomes: $metrics.historical_outcomes
    };
};

// Add real-time metrics processing
DEFINE FUNCTION fn::process_realtime_metrics_stream(
    $conversation_id: string
) -> object {
    LET $current_metrics = (
        SELECT * FROM real_time_metrics
        WHERE conversation_id = $conversation_id
        ORDER BY timestamp DESC
        LIMIT 1
    );

    RETURN {
        turn_taking: fn::calculate_turn_metrics($conversation_id),
        engagement: fn::calculate_engagement_metrics($conversation_id),
        semantic_coherence: fn::calculate_coherence_metrics($conversation_id),
        script_compliance: fn::calculate_compliance_metrics($conversation_id),
        temporal_dynamics: fn::calculate_temporal_metrics($conversation_id)
    };
};

// Add missing core data structures from Rust
DEFINE TABLE speaker SCHEMAFULL;
DEFINE FIELD id ON speaker TYPE string;
DEFINE FIELD type ON speaker TYPE string;
DEFINE FIELD metadata ON speaker TYPE object;

DEFINE TABLE utterance_metadata SCHEMAFULL;
DEFINE FIELD channel_info ON utterance_metadata TYPE object;
DEFINE FIELD custom_attributes ON utterance_metadata TYPE object;
DEFINE FIELD processing_flags ON utterance_metadata TYPE array;

-- Add missing dialogue structures
DEFINE TABLE dialogue_act SCHEMAFULL;
DEFINE FIELD act_type ON dialogue_act TYPE string;
DEFINE FIELD confidence ON dialogue_act TYPE float;
DEFINE FIELD parameters ON dialogue_act TYPE object;

-- Add missing pattern types
DEFINE TABLE pattern_type SCHEMAFULL;
DEFINE FIELD name ON pattern_type TYPE string;
DEFINE FIELD description ON pattern_type TYPE string;
DEFINE FIELD detection_rules ON pattern_type TYPE array;

-- Add script position tracking
DEFINE TABLE script_position SCHEMAFULL;
DEFINE FIELD step_id ON script_position TYPE string;
DEFINE FIELD progress ON script_position TYPE float;
DEFINE FIELD next_steps ON script_position TYPE array;
DEFINE FIELD completion_criteria ON script_position TYPE object;

-- Add intervention tracking
DEFINE TABLE intervention SCHEMAFULL;
DEFINE FIELD type ON intervention TYPE string;
DEFINE FIELD timestamp ON intervention TYPE datetime;
DEFINE FIELD context ON intervention TYPE object;
DEFINE FIELD outcome ON intervention TYPE object;

-- Add real-time metrics structures
DEFINE TABLE real_time_metrics SCHEMAFULL;
DEFINE FIELD conversation_id ON real_time_metrics TYPE string;
DEFINE FIELD timestamp ON real_time_metrics TYPE datetime;
DEFINE FIELD current_sentiment ON real_time_metrics TYPE float;
DEFINE FIELD engagement_score ON real_time_metrics TYPE float;
DEFINE FIELD script_compliance ON real_time_metrics TYPE float;
DEFINE FIELD active_topics ON real_time_metrics TYPE array;
DEFINE FIELD recent_patterns ON real_time_metrics TYPE array;
DEFINE FIELD interventions ON real_time_metrics TYPE array;
DEFINE FIELD temporal_metrics ON real_time_metrics TYPE object;

-- Add pattern memory system
DEFINE TABLE pattern_memory SCHEMAFULL;
DEFINE FIELD patterns ON pattern_memory TYPE array<record(conversation_pattern)>;
DEFINE FIELD cache_key ON pattern_memory TYPE string ASSERT $value != NONE;
DEFINE FIELD last_accessed ON pattern_memory TYPE datetime;
DEFINE FIELD frequency_map ON pattern_memory TYPE object;

-- Add relationship definitions for graph traversal
DEFINE TABLE pattern_relationship SCHEMAFULL;
DEFINE FIELD from_pattern ON pattern_relationship TYPE record(conversation_pattern);
DEFINE FIELD to_pattern ON pattern_relationship TYPE record(conversation_pattern);
DEFINE FIELD relationship_type ON pattern_relationship TYPE string;
DEFINE FIELD strength ON pattern_relationship TYPE float;

-- Add indices for pattern detection
DEFINE INDEX pattern_sequence_idx ON conversation_pattern FIELDS sequence VECTOR 384 COSINE;
DEFINE INDEX pattern_cache_idx ON pattern_memory FIELDS cache_key UNIQUE;

-- Add functions for pattern analysis
DEFINE FUNCTION fn::detect_dialogue_patterns($messages: array) -> array {
    // ...existing code...
};

-- Add functions for real-time metrics processing
DEFINE FUNCTION fn::process_metrics_update(
    $conversation_id: string,
    $analysis: object
) -> object {
    // ...existing code...
};

-- Add security scopes for real-time processing
DEFINE SCOPE realtime_metrics SESSION 1h
    SIGNUP ( CREATE real_time_metrics )
    SIGNIN ( 
        SELECT * FROM real_time_metrics 
        WHERE timestamp > time::now() - 1h
    );

DEFINE SCOPE pattern_memory SESSION 24h
    SIGNUP ( CREATE pattern_memory )
    SIGNIN ( 
        SELECT * FROM pattern_memory, conversation_pattern
    );

// Add missing RealTimeMetrics structure
DEFINE TABLE real_time_metrics_processor SCHEMAFULL;
DEFINE FIELD processor_id ON real_time_metrics_processor TYPE string;
DEFINE FIELD state_manager ON real_time_metrics_processor TYPE record(conversation_state);
DEFINE FIELD current_metrics ON real_time_metrics_processor TYPE object {
    timestamp: datetime,
    metrics: object,
    state: object
};
DEFINE FIELD processing_config ON real_time_metrics_processor TYPE object {
    batch_size: int,
    window_duration: duration,
    update_interval: duration
};

// Add ProcessScript structure
DEFINE TABLE process_script SCHEMAFULL;
DEFINE FIELD script_id ON process_script TYPE string;
DEFINE FIELD steps ON process_script TYPE array<object> {
    step_id: string,
    requirements: array,
    validation_rules: array,
    next_steps: array
};
DEFINE FIELD compliance_rules ON process_script TYPE object;

// Add ComplianceStatus and DeviationType enums
DEFINE TABLE compliance_status_type SCHEMAFULL;
DEFINE FIELD status_type ON compliance_status_type TYPE string 
    ASSERT $value IN ['compliant', 'non_compliant', 'partial', 'pending'];

DEFINE TABLE deviation_type SCHEMAFULL;
DEFINE FIELD type_name ON deviation_type TYPE string 
    ASSERT $value IN ['minor', 'major', 'critical', 'policy_violation'];

// Add DeviationSeverity and Resolution
DEFINE TABLE deviation_severity SCHEMAFULL;
DEFINE FIELD level ON deviation_severity TYPE string 
    ASSERT $value IN ['low', 'medium', 'high', 'critical'];

DEFINE TABLE deviation_resolution SCHEMAFULL;
DEFINE FIELD resolution_type ON deviation_resolution TYPE string;
DEFINE FIELD action_taken ON deviation_resolution TYPE string;
DEFINE FIELD resolved_at ON deviation_resolution TYPE datetime;
DEFINE FIELD resolution_metrics ON deviation_resolution TYPE object;

// Add PatternMemory with LRU cache functionality
DEFINE TABLE pattern_memory_cache SCHEMAFULL;
DEFINE FIELD cache_key ON pattern_memory_cache TYPE string;
DEFINE FIELD pattern ON pattern_memory_cache TYPE record(conversation_pattern);
DEFINE FIELD last_accessed ON pattern_memory_cache TYPE datetime;
DEFINE FIELD access_count ON pattern_memory_cache TYPE int;
DEFINE INDEX pattern_cache_lru ON pattern_memory_cache 
    FIELDS cache_key UNIQUE;

// Add functions for pattern cache management
DEFINE FUNCTION fn::update_pattern_cache(
    $key: string,
    $pattern: object
) -> object {
    LET $cache_size = (
        SELECT count() FROM pattern_memory_cache
    );

    IF $cache_size >= 50 THEN
        DELETE FROM pattern_memory_cache
        ORDER BY last_accessed ASC
        LIMIT 1;
    END;

    RETURN CREATE pattern_memory_cache CONTENT {
        cache_key: $key,
        pattern: $pattern,
        last_accessed: time::now(),
        access_count: 1
    };
};

// Add broadcast channel simulation for real-time metrics
DEFINE TABLE metrics_broadcast_channel SCHEMAFULL;
DEFINE FIELD channel_id ON metrics_broadcast_channel TYPE string;
DEFINE FIELD metrics ON metrics_broadcast_channel TYPE array;
DEFINE FIELD subscribers ON metrics_broadcast_channel TYPE array;
DEFINE FIELD last_broadcast ON metrics_broadcast_channel TYPE datetime;

// Add real-time processing functions
DEFINE FUNCTION fn::process_metrics_broadcast(
    $metrics: object,
    $channel_id: string
) -> object {
    LET $channel = (
        SELECT * FROM metrics_broadcast_channel
        WHERE channel_id = $channel_id
    );

    UPDATE metrics_broadcast_channel
    SET 
        metrics = array::append(metrics, $metrics),
        last_broadcast = time::now()
    WHERE channel_id = $channel_id;

    RETURN {
        broadcast_time: time::now(),
        metrics: $metrics,
        subscribers: $channel.subscribers
    };
};

// Add proper graph traversal index
DEFINE INDEX pattern_sequence_traversal ON conversation_pattern 
    FIELDS pattern_type, significance;

// Define security scope for pattern cache
DEFINE SCOPE pattern_cache_management SESSION 1h
    SIGNUP ( CREATE pattern_memory_cache )
    SIGNIN ( 
        SELECT * FROM pattern_memory_cache 
        WHERE last_accessed > time::now() - 1h
    );

// Add Graph Storage Structure
DEFINE TABLE graph_node SCHEMAFULL;
DEFINE FIELD node_id ON graph_node TYPE string;
DEFINE FIELD node_type ON graph_node TYPE string;
DEFINE FIELD data ON graph_node TYPE object;
DEFINE FIELD metadata ON graph_node TYPE object;
DEFINE INDEX node_vector ON graph_node FIELDS data.embedding VECTOR 384 COSINE;

DEFINE TABLE graph_edge SCHEMAFULL;
DEFINE FIELD from_node ON graph_edge TYPE record(graph_node);
DEFINE FIELD to_node ON graph_edge TYPE record(graph_node);
DEFINE FIELD edge_type ON graph_edge TYPE string;
DEFINE FIELD weight ON graph_edge TYPE float;
DEFINE FIELD properties ON graph_edge TYPE object;

-- Add Pattern Types and Config
DEFINE TABLE pattern_config SCHEMAFULL;
DEFINE FIELD detection_thresholds ON pattern_config TYPE object {
    similarity: float,
    frequency: int,
    significance: float
};
DEFINE FIELD cache_settings ON pattern_config TYPE object {
    max_size: int,
    ttl: duration
};
DEFINE FIELD analysis_rules ON pattern_config TYPE array;

-- Add Modern BERT Integration Settings
DEFINE TABLE bert_integration_config SCHEMAFULL;
DEFINE FIELD model_config ON bert_integration_config TYPE object {
    embedding_dim: int,
    hidden_size: int,
    num_attention_heads: int
};
DEFINE FIELD tokenizer_config ON bert_integration_config TYPE object;
DEFINE FIELD device_settings ON bert_integration_config TYPE object;

-- Add Real-time Processing Components
DEFINE TABLE real_time_processor SCHEMAFULL;
DEFINE FIELD processor_id ON real_time_processor TYPE string;
DEFINE FIELD metrics_channel ON real_time_processor TYPE object {
    channel_id: string,
    buffer_size: int,
    broadcast_interval: duration
};
DEFINE FIELD state_manager ON real_time_processor TYPE record(conversation_state);
DEFINE FIELD bert_integration ON real_time_processor TYPE record(bert_integration_config);

-- Add Functions for Graph Operations
DEFINE FUNCTION fn::store_graph_node(
    $node: object
) -> record {
    RETURN (CREATE graph_node CONTENT {
        node_id: $node.id,
        node_type: $node.type,
        data: $node.data,
        metadata: {
            created_at: time::now(),
            version: 1
        }
    });
};

DEFINE FUNCTION fn::create_graph_edge(
    $from: string,
    $to: string,
    $type: string,
    $properties: object
) -> record {
    RETURN (CREATE graph_edge CONTENT {
        from_node: $from,
        to_node: $to,
        edge_type: $type,
        properties: $properties,
        created_at: time::now()
    });
};

-- Add Enhanced Pattern Detection
DEFINE FUNCTION fn::detect_complex_patterns(
    $conversation_id: string,
    $window: duration
) -> array {
    LET $recent_nodes = (
        SELECT * FROM graph_node
        WHERE data.conversation_id = $conversation_id
        AND data.timestamp > time::now() - $window
        ORDER BY data.timestamp
    );

    LET $patterns = (
        SELECT * FROM conversation_pattern
        WHERE fn::matches_pattern($recent_nodes, sequence)
        ORDER BY significance DESC
    );

    RETURN array::map($patterns, function($pattern) {
        RETURN {
            pattern: $pattern,
            context_match: fn::evaluate_pattern_context($pattern, $recent_nodes),
            confidence: fn::calculate_pattern_confidence($pattern, $recent_nodes)
        };
    });
};

-- Add Security Scope for Graph Operations
DEFINE SCOPE graph_operations SESSION 1h
    SIGNUP ( CREATE graph_node )
    SIGNIN ( 
        SELECT * FROM graph_node, graph_edge 
        WHERE created_at > time::now() - 1h
    );

-- Add unified analyzer configuration
DEFINE TABLE unified_analyzer_config SCHEMAFULL;
DEFINE FIELD bert_config ON unified_analyzer_config TYPE record(bert_integration_config);
DEFINE FIELD graph_config ON unified_analyzer_config TYPE object {
    storage_settings: object,
    cache_settings: object,
    traversal_settings: object
};
DEFINE FIELD pattern_config ON unified_analyzer_config TYPE record(pattern_config);
DEFINE FIELD state_config ON unified_analyzer_config TYPE object;

-- Add modern BERT specific tables
DEFINE TABLE bert_model_state SCHEMAFULL;
DEFINE FIELD model_id ON bert_model_state TYPE string;
DEFINE FIELD embedding_dim ON bert_model_state TYPE int;
DEFINE FIELD tokenizer_config ON bert_model_state TYPE object;
DEFINE FIELD model_config ON bert_model_state TYPE object;
DEFINE FIELD device_settings ON bert_model_state TYPE object {
    device_type: string,
    memory_settings: object,
    compute_settings: object
};

-- Add pattern cache with LRU functionality
DEFINE TABLE pattern_cache SCHEMAFULL;
DEFINE FIELD pattern_id ON pattern_cache TYPE string;
DEFINE FIELD pattern_data ON pattern_cache TYPE record(conversation_pattern);
DEFINE FIELD access_count ON pattern_cache TYPE int;
DEFINE FIELD last_accessed ON pattern_cache TYPE datetime;
DEFINE FIELD expiry ON pattern_cache TYPE datetime;
DEFINE INDEX pattern_cache_lru ON pattern_cache FIELDS last_accessed;

-- Add conversation state manager
DEFINE TABLE conversation_state_manager SCHEMAFULL;
DEFINE FIELD manager_id ON conversation_state_manager TYPE string;
DEFINE FIELD active_states ON conversation_state_manager TYPE array<record(conversation_state)>;
DEFINE FIELD state_transitions ON conversation_state_manager TYPE array<object> {
    from_state: string,
    to_state: string,
    trigger: string,
    timestamp: datetime
};
DEFINE FIELD state_metrics ON conversation_state_manager TYPE object {
    state_changes: int,
    avg_state_duration: duration,
    transition_patterns: array
};

-- Add enhanced script monitoring
DEFINE TABLE script_monitor SCHEMAFULL;
DEFINE FIELD script ON script_monitor TYPE record(process_script);
DEFINE FIELD state ON script_monitor TYPE record(compliance_state);
DEFINE FIELD bert_analysis ON script_monitor TYPE record(bert_model_state);
DEFINE FIELD monitoring_metrics ON script_monitor TYPE object {
    compliance_rate: float,
    deviation_frequency: float,
    recovery_metrics: object
};

-- Add functions for real-time state management
DEFINE FUNCTION fn::update_conversation_state(
    $state_id: string,
    $updates: object
) -> object {
    LET $current_state = (
        SELECT * FROM conversation_state 
        WHERE id = $state_id
    );

    LET $new_state = {
        ...$current_state,
        ...$updates,
        updated_at: time::now()
    };

    UPDATE conversation_state 
    SET * = $new_state
    WHERE id = $state_id
    RETURN AFTER;
};

-- Add pattern detection optimization
DEFINE FUNCTION fn::optimize_pattern_detection(
    $conversation_id: string,
    $lookback: duration
) -> object {
    // ...existing code...
};

-- Add security scope for BERT operations
DEFINE SCOPE bert_operations SESSION 1h
    SIGNUP ( CREATE bert_model_state )
    SIGNIN ( 
        SELECT * FROM bert_model_state, bert_integration_config 
        WHERE created_at > time::now() - 1h
    );

-- Add index for pattern detection optimization
DEFINE INDEX pattern_detection_idx ON conversation_pattern 
    FIELDS pattern_type, frequency, significance;
