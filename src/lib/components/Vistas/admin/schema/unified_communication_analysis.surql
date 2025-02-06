-- Core Identity and Context System
DEFINE TABLE identity SCHEMAFULL;
DEFINE FIELD global_id ON identity TYPE string;
DEFINE FIELD identity_type ON identity TYPE string 
    ASSERT $value IN ['person', 'organization', 'system', 'location', 'asset'];
DEFINE FIELD profiles ON identity TYPE array<object> {
    platform_id: record(platform),
    local_id: string,
    metadata: object
};
DEFINE FIELD embedding ON identity TYPE array;
DEFINE INDEX identity_vector ON identity FIELDS embedding VECTOR 384 COSINE;

// ...existing code...

-- Enhanced Context System
DEFINE TABLE context SCHEMAFULL;
DEFINE FIELD id ON context TYPE string;
DEFINE FIELD type ON context TYPE array<string>;  // Multiple types possible
DEFINE FIELD temporal ON context TYPE object {
    start: datetime,
    end: option<datetime>,
    duration: option<duration>,
    recurring: option<object>,
    related_times: array<datetime>  // Other relevant timestamps
};
DEFINE FIELD entities ON context TYPE array<object> {
    entity: record(identity),
    role: string,
    relevance: float,
    relationship: string,
    temporal_span: object {
        involvement_start: datetime,
        involvement_end: option<datetime>
    }
};
DEFINE FIELD locations ON context TYPE array<record(location)>;
DEFINE FIELD assets ON context TYPE array<record(asset)>;
DEFINE FIELD topics ON context TYPE array<object> {
    name: string,
    relevance: float,
    context: object,
    related_entities: array<record(identity)>
};
DEFINE FIELD semantic ON context TYPE object {
    embeddings: array<array>,  // Multiple embeddings possible
    features: array,
    classifications: array<string>,
    relevance_scores: object
};
DEFINE FIELD relationships ON context TYPE array<object> {
    related_context: record(context),
    type: array<string>,  // Multiple relationship types
    strength: object {
        temporal: float,
        semantic: float,
        entity: float,
        combined: float
    },
    evidence: array<object>,
    metadata: object
};
DEFINE FIELD metadata ON context TYPE object {
    sources: array<string>,
    confidence: float,
    status: string,
    tags: array<string>,
    custom_attributes: object
};

-- Define multiple indices for flexible querying
DEFINE INDEX ctx_temporal ON context FIELDS temporal.start, temporal.end;
DEFINE INDEX ctx_semantic_vector ON context FIELDS semantic.embeddings VECTOR 384 COSINE;
DEFINE INDEX ctx_entity_graph ON context FIELDS entities.entity;
DEFINE INDEX ctx_topic_search ON context FIELDS topics.name TYPE SEARCH;

// Context Relationships
DEFINE TABLE context_relationship SCHEMAFULL;
DEFINE FIELD from_context ON context_relationship TYPE record(context);
DEFINE FIELD to_context ON context_relationship TYPE record(context);
DEFINE FIELD relationship_type ON context_relationship TYPE string 
    ASSERT $value IN ['temporal', 'semantic', 'causal', 'involves_same_entity', 'references'];
DEFINE FIELD strength ON context_relationship TYPE object {
    temporal: float,
    semantic: float,
    entity: float,
    combined: float
};
DEFINE FIELD evidence ON context_relationship TYPE array<object> {
    type: string,
    confidence: float,
    timestamp: datetime,
    metadata: object
};
DEFINE FIELD communication_channels ON context_relationship TYPE array<object> {
    platform: record(communication_platform),
    thread_ids: array<string>,
    message_refs: array<string>
};

// Add AI Analysis Integration
DEFINE TABLE analysis_node SCHEMAFULL;
DEFINE FIELD timestamp ON analysis_node TYPE datetime;
DEFINE FIELD conversation_context ON analysis_node TYPE record(context);
DEFINE FIELD bert_analysis ON analysis_node TYPE object {
    embedding: array,
    semantic_features: array<string>,
    dialogue_act: string,
    sentiment: object {
        score: float,
        components: array
    },
    topic_classification: array<string>,
    contextual_relevance: float,
    attention_weights: array
};
DEFINE FIELD metrics ON analysis_node TYPE object;
DEFINE FIELD patterns ON analysis_node TYPE array;

// Add Enhanced BERT Integration
DEFINE TABLE bert_analyzer SCHEMAFULL;
DEFINE FIELD model_config ON bert_analyzer TYPE object {
    embedding_dim: int,
    num_attention_heads: int,
    hidden_size: int,
    max_sequence_length: int
};
DEFINE FIELD analysis_state ON bert_analyzer TYPE object {
    current_context: record(context),
    temporal_window: duration,
    active_analyses: array<record(analysis_node)>
};
DEFINE FIELD optimization_settings ON bert_analyzer TYPE object {
    batch_size: int,
    learning_rate: float,
    attention_prune_threshold: float
};

// Add Cross-Platform Context Linker
DEFINE TABLE context_linker SCHEMAFULL;
DEFINE FIELD source_context ON context_linker TYPE record(context);
DEFINE FIELD target_contexts ON context_linker TYPE array<record(context)>;
DEFINE FIELD relationship_strength ON context_linker TYPE object {
    temporal_similarity: float,
    semantic_similarity: float,
    entity_overlap: float,
    context_relevance: float
};
DEFINE FIELD linking_evidence ON context_linker TYPE array<object> {
    type: string,
    confidence: float,
    supporting_data: object
};

// Add Pattern Detection System
DEFINE TABLE conversation_pattern SCHEMAFULL;
DEFINE FIELD pattern_type ON conversation_pattern TYPE string;
DEFINE FIELD sequence ON conversation_pattern TYPE array;
DEFINE FIELD frequency ON conversation_pattern TYPE int;
DEFINE FIELD significance ON conversation_pattern TYPE float;
DEFINE FIELD context ON conversation_pattern TYPE object;
DEFINE FIELD outcomes ON conversation_pattern TYPE array;
DEFINE INDEX pattern_vector ON conversation_pattern FIELDS sequence VECTOR 384 COSINE;

// Add Real-time Metrics 
DEFINE TABLE real_time_metrics SCHEMAFULL;
DEFINE FIELD context_id ON real_time_metrics TYPE record(context);
DEFINE FIELD timestamp ON real_time_metrics TYPE datetime;
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

// Add Cross-Platform Analysis Functions
DEFINE FUNCTION fn::analyze_cross_platform_interaction(
    $context_id: string,
    $params: object
) -> object {
    LET $context = (SELECT * FROM context WHERE id = $context_id);
    
    RETURN {
        base_analysis: fn::perform_base_analysis($context),
        temporal_links: fn::find_temporal_links($context),
        semantic_links: fn::analyze_semantic_relationships($context),
        entity_connections: fn::find_entity_connections($context)
    };
};

// Add Pattern Detection Functions
DEFINE FUNCTION fn::detect_interaction_patterns(
    $context_id: string,
    $window: duration
) -> array {
    LET $recent_contexts = (
        SELECT * FROM context
        WHERE temporal.start > time::now() - $window
    );

    RETURN {
        emerging_patterns: fn::identify_patterns($recent_contexts),
        entity_patterns: fn::analyze_entity_patterns($recent_contexts),
        semantic_patterns: fn::detect_semantic_patterns($recent_contexts)
    };
};

// Add Enhanced Context Functions
DEFINE FUNCTION fn::merge_related_contexts(
    $source_context: string,
    $target_context: string
) -> object {
    LET $contexts = (
        SELECT * FROM context 
        WHERE id IN [$source_context, $target_context]
    );

    LET $relationship = {
        temporal: fn::analyze_temporal_proximity($contexts),
        semantic: fn::analyze_semantic_similarity($contexts),
        entity_overlap: fn::calculate_entity_overlap($contexts),
        context_similarity: fn::analyze_context_similarity($contexts)
    };

    RETURN fn::create_context_relationship($contexts, $relationship);
};

// Add Enhanced Analysis Functions
DEFINE FUNCTION fn::analyze_cross_context_relationship(
    $context_id: string,
    $window: duration
) -> object {
    LET $context = (SELECT * FROM context WHERE id = $context_id);
    
    // Find temporally related contexts
    LET $temporal_contexts = (
        SELECT * FROM context
        WHERE temporal.start > $context.temporal.start - $window
        AND temporal.start < $context.temporal.start + $window
    );

    // Analyze relationships
    RETURN {
        temporal_links: fn::analyze_temporal_relationships($context, $temporal_contexts),
        semantic_links: fn::analyze_semantic_relationships($context, $temporal_contexts),
        entity_links: fn::analyze_entity_relationships($context, $temporal_contexts),
        context_graph: fn::build_context_graph($context, $temporal_contexts)
    };
};

// Add Context Graph Builder
DEFINE FUNCTION fn::build_context_graph(
    $root_context: object,
    $related_contexts: array
) -> object {
    LET $nodes = array::union(
        [$root_context],
        $related_contexts
    );

    LET $edges = array::map($related_contexts, function($ctx) {
        RETURN {
            from: $root_context.id,
            to: $ctx.id,
            strength: fn::calculate_relationship_strength($root_context, $ctx),
            type: fn::determine_relationship_type($root_context, $ctx)
        };
    });

    RETURN {
        nodes: $nodes,
        edges: $edges,
        metrics: fn::calculate_graph_metrics($nodes, $edges)
    };
};

// Add Context Analysis Pipeline
DEFINE TABLE analysis_pipeline SCHEMAFULL;
DEFINE FIELD pipeline_id ON analysis_pipeline TYPE string;
DEFINE FIELD stages ON analysis_pipeline TYPE array<object> {
    stage_type: string,
    bert_config: record(bert_analyzer),
    analysis_params: object,
    output_transforms: array
};
DEFINE FIELD context_state ON analysis_pipeline TYPE object {
    current_stage: int,
    results: array,
    metrics: object
};

// Add Real-time Analysis Coordinator
DEFINE FUNCTION fn::coordinate_realtime_analysis(
    $context_id: string
) -> object {
    LET $context = (SELECT * FROM context WHERE id = $context_id);
    
    RETURN {
        bert_analysis: fn::perform_bert_analysis($context),
        temporal_analysis: fn::analyze_temporal_patterns($context),
        entity_analysis: fn::analyze_entity_relationships($context),
        recommendations: fn::generate_context_recommendations($context)
    };
};

// ...rest of tables and functions from both schemas...

-- Context Analysis Functions
DEFINE FUNCTION fn::analyze_context_relationships(
    $context_id: string,
    $params: object
) -> object {
    // Context analysis implementation
};

-- Add security scopes
DEFINE SCOPE unified_access SESSION 24h
    SIGNUP ( CREATE context )
    SIGNIN ( 
        SELECT * FROM context, context_relationship 
        WHERE temporal_span.start > time::now() - 24h
    );

// ...existing code...

-- Add Entity Context Linking
DEFINE TABLE entity_context_link SCHEMAFULL;
DEFINE FIELD entity_id ON entity_context_link TYPE record(identity);
DEFINE FIELD context_id ON entity_context_link TYPE record(context);
DEFINE FIELD link_type ON entity_context_link TYPE array<string>;
DEFINE FIELD temporal_span ON entity_context_link TYPE object {
    start: datetime,
    end: option<datetime>,
    interaction_points: array<datetime>
};
DEFINE FIELD relevance ON entity_context_link TYPE object {
    score: float,
    factors: array<string>,
    confidence: float
};

-- Add Context Chain Tracking
DEFINE TABLE context_chain SCHEMAFULL;
DEFINE FIELD chain_id ON context_chain TYPE string;
DEFINE FIELD root_context ON context_chain TYPE record(context);
DEFINE FIELD related_contexts ON context_chain TYPE array<object> {
    context: record(context),
    relationship_strength: float,
    connection_type: array<string>,
    temporal_distance: duration
};
DEFINE FIELD entities_involved ON context_chain TYPE array<record(identity)>;
DEFINE FIELD chain_metrics ON context_chain TYPE object {
    coherence_score: float,
    temporal_span: duration,
    interaction_count: int,
    topic_consistency: float
};

-- Add Enhanced Context Querying Functions
DEFINE FUNCTION fn::find_related_context_chains(
    $context_id: string,
    $params: object
) -> array {
    LET $base_context = (SELECT * FROM context WHERE id = $context_id);
    
    // Find chains through entity relationships
    LET $entity_chains = (
        SELECT ->entity_context_link->context as linked_contexts
        FROM $base_context.entities.entity
        WHERE array::overlap(
            linked_contexts.entities.entity,
            $base_context.entities.entity
        )
    );

    // Find chains through temporal proximity
    LET $temporal_chains = (
        SELECT id, temporal, entities
        FROM context
        WHERE temporal.start >= $base_context.temporal.start - $params.time_window
        AND temporal.start <= $base_context.temporal.end + $params.time_window
    );

    // Find chains through semantic similarity
    LET $semantic_chains = (
        SELECT *,
        vector::similarity(semantic.embeddings, $base_context.semantic.embeddings) as similarity
        FROM context
        WHERE vector::similarity(semantic.embeddings, $base_context.semantic.embeddings) 
            > $params.semantic_threshold
    );

    RETURN fn::merge_and_rank_chains($entity_chains, $temporal_chains, $semantic_chains);
};

-- Add Cross-Context Analysis Functions
DEFINE FUNCTION fn::analyze_context_flow(
    $chain_id: string
) -> object {
    LET $chain = (SELECT * FROM context_chain WHERE id = $chain_id);
    
    RETURN {
        flow_analysis: {
            topic_evolution: fn::analyze_topic_flow($chain.related_contexts),
            entity_interactions: fn::analyze_entity_interactions($chain.entities_involved),
            temporal_patterns: fn::analyze_temporal_patterns($chain.related_contexts)
        },
        context_metrics: {
            coherence: fn::calculate_chain_coherence($chain),
            relevance: fn::calculate_chain_relevance($chain),
            completeness: fn::assess_chain_completeness($chain)
        },
        recommendations: fn::generate_chain_recommendations($chain)
    };
};

-- Add indices for enhanced querying
DEFINE INDEX chain_temporal ON context_chain FIELDS root_context.temporal.start, root_context.temporal.end;
DEFINE INDEX entity_context_temporal ON entity_context_link FIELDS temporal_span.start;

// Merge Platform and Communication Definitions
DEFINE TABLE communication_platform SCHEMAFULL;
// ...existing communication_platform fields...
DEFINE FIELD analysis_config ON communication_platform TYPE object {
    bert_config: record(bert_integration_config),
    pattern_rules: array,
    context_mapping: object
};

// Add Property Context Linking
DEFINE TABLE property_context SCHEMAFULL;
DEFINE FIELD property_id ON property_context TYPE string;
DEFINE FIELD context_chain ON property_context TYPE record(context_chain);
DEFINE FIELD related_contexts ON property_context TYPE array<record(context)>;
DEFINE FIELD stakeholders ON property_context TYPE array<record(identity)>;
DEFINE FIELD interaction_history ON property_context TYPE array<object> {
    stakeholder: record(identity),
    context: record(context),
    role: string,
    temporal_span: object {
        first_interaction: datetime,
        last_interaction: datetime,
        scheduled_interactions: array<datetime>
    }
};

// Add Context Flow Functions
DEFINE FUNCTION fn::track_property_interaction_flow(
    $property_id: string,
    $context_id: string
) -> object {
    // Implementation for tracking property-related conversation flows
};

// Add Cross-Platform Message Functions
DEFINE FUNCTION fn::link_related_communications(
    $source_context: string,
    $target_context: string,
    $relationship_type: string
) -> object {
    // Implementation for linking related communications
};

// Add Temporal Context Functions
DEFINE FUNCTION fn::find_temporally_related_contexts(
    $context_id: string,
    $window: duration
) -> array {
    // Implementation for finding temporally related contexts
};

// Add Property Context System
DEFINE TABLE property_interaction_context SCHEMAFULL;
DEFINE FIELD property_id ON property_interaction_context TYPE string;
DEFINE FIELD contexts ON property_interaction_context TYPE array<record(context)>;
DEFINE FIELD participants ON property_interaction_context TYPE array<object> {
    identity: record(identity),
    roles: array<string>,  // Can be ['buyer', 'seller', 'agent', etc]
    interaction_history: array<object> {
        context_id: record(context),
        role: string,
        temporal: object {
            first_contact: datetime,
            last_contact: datetime,
            scheduled_events: array<datetime>
        },
        interaction_metrics: object {
            engagement_score: float,
            response_times: array<float>,
            sentiment_trajectory: array<float>
        }
    }
};
DEFINE FIELD timeline ON property_interaction_context TYPE array<object> {
    context_id: record(context),
    event_type: string,
    participants: array<record(identity)>,
    timestamp: datetime,
    next_actions: array<string>
};
DEFINE FIELD status ON property_interaction_context TYPE object {
    current_stage: string,
    stage_history: array<object>,
    pending_actions: array<string>,
    blockers: array<object>
};

-- Add Context Linking Functions
DEFINE FUNCTION fn::link_property_contexts(
    $property_id: string,
    $context_ids: array
) -> object {
    // Implementation
};

-- Add Cross-Platform Context Functions
DEFINE FUNCTION fn::merge_platform_contexts(
    $context_ids: array,
    $link_type: string
) -> object {
    // Implementation
};

-- Add Enhanced Context Analysis
DEFINE FUNCTION fn::analyze_property_interaction_flow(
    $property_id: string
) -> object {
    // Implementation
};

// ...existing identity and context definitions...

-- Add Property Interaction Context
DEFINE TABLE property_interaction_flow SCHEMAFULL;
DEFINE FIELD property_id ON property_interaction_flow TYPE string;
DEFINE FIELD root_context ON property_interaction_flow TYPE record(context);
DEFINE FIELD interaction_chain ON property_interaction_flow TYPE array<object> {
    context: record(context),
    participants: array<object> {
        identity: record(identity),
        role: array<string>,  // ['buyer', 'owner', 'agent']
        platform: record(communication_platform)
    },
    communication_type: string,  // ['inquiry', 'viewing_request', 'scheduling']
    temporal_info: object {
        occurred_at: datetime,
        scheduled_for: option<datetime>,
        related_times: array<datetime>
    },
    status: string  // ['pending', 'scheduled', 'completed', 'cancelled']
};

-- Add Context Connection Rules
DEFINE TABLE context_connection_rules SCHEMAFULL;
DEFINE FIELD rule_type ON context_connection_rules TYPE string;
DEFINE FIELD conditions ON context_connection_rules TYPE array<object> {
    temporal_window: duration,
    semantic_threshold: float,
    required_participants: array<string>,
    entity_overlap: float
};
DEFINE FIELD connection_strength ON context_connection_rules TYPE object {
    temporal_weight: float,
    semantic_weight: float,
    entity_weight: float,
    context_weight: float
};

-- Add Property Context Functions
DEFINE FUNCTION fn::link_property_interactions(
    $source_context: string,
    $target_context: string
) -> object {
    LET $source = (SELECT * FROM context WHERE id = $source_context);
    LET $target = (SELECT * FROM context WHERE id = $target_context);
    
    // Calculate relationship strengths
    LET $relationship = {
        temporal: fn::calculate_temporal_proximity($source.temporal, $target.temporal),
        semantic: vector::similarity($source.semantic.embeddings, $target.semantic.embeddings),
        entity: fn::calculate_entity_overlap($source.entities, $target.entities),
        contextual: fn::analyze_context_similarity($source, $target)
    };

    // Create relationship if strong enough
    IF fn::should_create_relationship($relationship) {
        CREATE context_relationship SET
            from_context = $source,
            to_context = $target,
            strength = $relationship,
            metadata = {
                property_related: true,
                interaction_type: fn::determine_interaction_type($source, $target)
            }
    };

    RETURN $relationship;
};

-- Add Property Flow Analysis Function
DEFINE FUNCTION fn::analyze_property_interaction_chain(
    $property_id: string
) -> object {
    LET $chain = (
        SELECT ->context_relationship->context as related_contexts
        FROM context
        WHERE entities CONTAINS (
            SELECT id FROM identity 
            WHERE attributes.property_id = $property_id
        )
        ORDER BY temporal.start
    );

    RETURN {
        interaction_flow: fn::reconstruct_interaction_flow($chain),
        participant_engagement: fn::analyze_participant_engagement($chain),
        scheduling_status: fn::analyze_scheduling_status($chain),
        next_actions: fn::determine_next_actions($chain)
    };
};

// ...rest of existing code...

-- Property Viewing Context System
DEFINE TABLE property_viewing_context SCHEMAFULL;
DEFINE FIELD property_id ON property_viewing_context TYPE string;
DEFINE FIELD viewing_request ON property_viewing_context TYPE object {
    client: record(identity),
    owner: record(identity),
    agent: record(identity),
    requested_times: array<datetime>,
    property_details: record(asset),
    status: string
};
DEFINE FIELD communication_threads ON property_viewing_context TYPE array<object> {
    context: record(context),
    platform: record(communication_platform),
    participants: array<record(identity)>,
    purpose: string,  // ['inquiry', 'scheduling', 'confirmation', 'feedback']
    temporal_link: object {
        related_to: array<record(context)>,
        sequence_position: int,
        time_relationship: string  // ['before', 'after', 'concurrent']
    }
};

-- Enhanced Context Connection
DEFINE TABLE context_connection SCHEMAFULL;
DEFINE FIELD source_context ON context_connection TYPE record(context);
DEFINE FIELD target_context ON context_connection TYPE record(context);
DEFINE FIELD connection_type ON context_connection TYPE array<string>;
DEFINE FIELD shared_entities ON context_connection TYPE array<record(identity)>;
DEFINE FIELD temporal_relationship ON context_connection TYPE object {
    time_gap: duration,
    sequence_order: string,
    causality_score: float
};
DEFINE FIELD semantic_relationship ON context_connection TYPE object {
    topic_overlap: float,
    intent_similarity: float,
    context_similarity: float
};
DEFINE INDEX context_connection_temporal ON context_connection 
    FIELDS temporal_relationship.time_gap;

-- Property Viewing Analysis Functions
DEFINE FUNCTION fn::link_viewing_contexts(
    $client_context_id: string,
    $owner_context_id: string
) -> object {
    LET $client_context = (SELECT * FROM context WHERE id = $client_context_id);
    LET $owner_context = (SELECT * FROM context WHERE id = $owner_context_id);
    
    // Calculate relationship strengths
    LET $relationship = {
        temporal: fn::analyze_temporal_proximity(
            $client_context.temporal,
            $owner_context.temporal
        ),
        semantic: fn::analyze_semantic_relationship(
            $client_context.semantic,
            $owner_context.semantic
        ),
        property_relevance: fn::calculate_property_relevance(
            $client_context,
            $owner_context
        )
    };

    IF fn::should_link_contexts($relationship) {
        CREATE context_connection SET
            source_context = $client_context_id,
            target_context = $owner_context_id,
            connection_type = ['property_viewing', 'scheduling'],
            shared_entities = fn::extract_shared_entities($client_context, $owner_context),
            temporal_relationship = {
                time_gap: datetime::diff($owner_context.temporal.start, $client_context.temporal.end),
                sequence_order: 'sequential',
                causality_score: fn::calculate_causality($relationship)
            },
            semantic_relationship = {
                topic_overlap: fn::calculate_topic_overlap($client_context, $owner_context),
                intent_similarity: fn::calculate_intent_similarity($client_context, $owner_context),
                context_similarity: fn::calculate_context_similarity($client_context, $owner_context)
            }
    };

    RETURN $relationship;
};

-- Property Viewing State Management
DEFINE FUNCTION fn::track_viewing_progression(
    $viewing_context_id: string
) -> object {
    LET $viewing_context = (
        SELECT * FROM property_viewing_context
        WHERE id = $viewing_context_id
    );

    // Track state transitions and communications
    LET $timeline = (
        SELECT ->context_connection->context as connected_contexts
        FROM context
        WHERE id IN $viewing_context.communication_threads[*].context.id
        ORDER BY temporal.start
    );

    RETURN {
        current_state: fn::determine_viewing_state($timeline),
        next_actions: fn::suggest_next_actions($timeline),
        participant_status: fn::analyze_participant_status($timeline),
        scheduling_progress: fn::analyze_scheduling_progress($timeline)
    };
};

// ...rest of existing code...

-- Add Advanced Property Context Relations
DEFINE TABLE property_interaction_thread SCHEMAFULL;
DEFINE FIELD thread_id ON property_interaction_thread TYPE string;
DEFINE FIELD property ON property_interaction_thread TYPE record(asset);
DEFINE FIELD conversation_contexts ON property_interaction_thread TYPE array<object> {
    context: record(context),
    role: string,  // ['client_inquiry', 'owner_contact', 'viewing_arrangement']
    participants: array<record(identity)>,
    platform: record(communication_platform),
    temporal_info: object {
        occurred_at: datetime,
        related_events: array<datetime>,
        dependencies: array<string>  // IDs of dependent contexts
    }
};
DEFINE FIELD thread_state ON property_interaction_thread TYPE object {
    current_phase: string,  // ['inquiry', 'owner_contact', 'scheduling', 'viewing']
    completion_status: object {
        client_confirmed: bool,
        owner_confirmed: bool,
        viewing_scheduled: bool
    },
    next_actions: array<string>
};

-- Add Context Merging Functions
DEFINE FUNCTION fn::merge_property_conversations(
    $client_context_id: string,
    $owner_context_id: string
) -> object {
    LET $contexts = (
        SELECT * FROM context 
        WHERE id IN [$client_context_id, $owner_context_id]
    );
    
    LET $relationship = {
        temporal: fn::analyze_temporal_proximity($contexts),
        semantic: fn::analyze_semantic_similarity($contexts),
        property_context: fn::extract_property_context($contexts),
        participant_roles: fn::determine_participant_roles($contexts)
    };

    IF fn::should_merge_contexts($relationship) {
        CREATE property_interaction_thread CONTENT {
            property: fn::extract_property($contexts),
            conversation_contexts: array::sort($contexts, {
                key: 'temporal_info.occurred_at'
            }),
            thread_state: {
                current_phase: fn::determine_current_phase($contexts),
                completion_status: fn::check_completion_status($contexts),
                next_actions: fn::suggest_next_actions($relationship)
            }
        };
    };

    RETURN $relationship;
};

-- Add Cross-Platform Context Analysis
DEFINE FUNCTION fn::analyze_property_interaction_sequence(
    $property_id: string
) -> object {
    LET $contexts = (
        SELECT ->related_context->context.* as contexts
        FROM property_interaction_thread
        WHERE property.id = $property_id
        ORDER BY temporal_info.occurred_at
    );

    RETURN {
        interaction_flow: {
            sequence: fn::reconstruct_interaction_sequence($contexts),
            dependencies: fn::analyze_context_dependencies($contexts),
            gaps: fn::identify_communication_gaps($contexts)
        },
        participant_analysis: {
            roles: fn::analyze_participant_roles($contexts),
            engagement: fn::measure_participant_engagement($contexts),
            communication_preferences: fn::detect_platform_preferences($contexts)
        },
        scheduling_analysis: {
            proposed_times: fn::extract_proposed_times($contexts),
            constraints: fn::identify_scheduling_constraints($contexts),
            optimal_slots: fn::suggest_viewing_times($contexts)
        }
    };
};

// ...rest of existing code...

-- Add Enhanced Security Scopes
DEFINE SCOPE property_interaction SESSION 24h
    SIGNUP ( CREATE property_interaction_thread )
    SIGNIN ( 
        SELECT * FROM property_interaction_thread, context 
        WHERE temporal_info.occurred_at > time::now() - 24h
    );

// Add Property Interaction Graph
DEFINE TABLE property_interaction_graph SCHEMAFULL;
DEFINE FIELD root_context_id ON property_interaction_graph TYPE record(context);
DEFINE FIELD property_id ON property_interaction_graph TYPE record(asset);
DEFINE FIELD interaction_sequence ON property_interaction_graph TYPE array<object> {
    context_id: record(context),
    interaction_type: array<string>,  // ['inquiry', 'scheduling', 'viewing', 'followup']
    participants: array<record(identity)>,
    roles: array<object> {
        identity_id: record(identity),
        role: string,  // ['client', 'owner', 'agent']
        interaction_context: string
    }
};
DEFINE FIELD temporal_links ON property_interaction_graph TYPE array<object> {
    source_event: record(context),
    target_event: record(context),
    time_gap: duration,
    causality_score: float,
    context_similarity: float
};
DEFINE FIELD state ON property_interaction_graph TYPE object {
    current_phase: string,
    scheduled_viewing: option<datetime>,
    stakeholder_status: object {
        client_confirmed: bool,
        owner_confirmed: bool,
        agent_confirmed: bool
    },
    completion_metrics: object {
        intent_fulfilled: bool,
        scheduling_complete: bool,
        followup_required: bool
    }
};

// Add Contextual Connection Engine
DEFINE FUNCTION fn::discover_property_context_connections(
    $context_id: string,
    $params: object
) -> object {
    LET $base_context = (SELECT * FROM context WHERE id = $context_id);
    
    // Find property-related contexts through various dimensions
    LET $property_contexts = (
        SELECT ->involves_property->context as related_contexts
        FROM context
        WHERE array::overlap(
            related_contexts.entities.*.property_id,
            $base_context.entities.*.property_id
        )
    );

    // Find conversation flow patterns
    LET $conversation_flow = fn::analyze_conversation_sequence(
        $base_context,
        $property_contexts,
        $params.time_window
    );

    // Link contexts based on temporal and semantic proximity
    RETURN fn::build_context_graph(
        $base_context,
        $property_contexts,
        $conversation_flow
    );
};

// Add Multi-Party Conversation Tracking
DEFINE FUNCTION fn::track_stakeholder_interactions(
    $property_id: string
) -> object {
    // Function implementation for tracking interactions between client, owner, agent
};

// Add indices for property context analysis
DEFINE INDEX property_context_temporal ON context 
    FIELDS temporal.start, temporal.end;
DEFINE INDEX property_context_semantic ON context 
    FIELDS semantic.embeddings VECTOR 384 COSINE;

// Add BERT Configuration
DEFINE TABLE bert_integration_config SCHEMAFULL;
DEFINE FIELD model_config ON bert_integration_config TYPE object {
    embedding_dim: int,
    hidden_size: int,
    num_attention_heads: int
};
DEFINE FIELD tokenizer_config ON bert_integration_config TYPE object;
DEFINE FIELD device_settings ON bert_integration_config TYPE object;

// Add Pattern Cache
DEFINE TABLE pattern_cache SCHEMAFULL;
DEFINE FIELD pattern_id ON pattern_cache TYPE string;
DEFINE FIELD pattern_data ON pattern_cache TYPE record(conversation_pattern);
DEFINE FIELD access_count ON pattern_cache TYPE int;
DEFINE FIELD last_accessed ON pattern_cache TYPE datetime;
DEFINE INDEX pattern_cache_lru ON pattern_cache FIELDS last_accessed;

// Add Enhanced Security Scopes
DEFINE SCOPE analysis_operations SESSION 1h
    SIGNUP ( CREATE analysis_node )
    SIGNIN ( 
        SELECT * FROM analysis_node, real_time_metrics 
        WHERE timestamp > time::now() - 1h
    );

// ...existing code until last table...

-- Add Global Identity Linking System
DEFINE TABLE global_identity SCHEMAFULL;
DEFINE FIELD identity_id ON global_identity TYPE string;
DEFINE FIELD platform_identities ON global_identity TYPE array<object> {
    platform: record(communication_platform),
    local_id: string,
    verification_status: string,
    link_confidence: float
};
DEFINE FIELD identity_graph ON global_identity TYPE array<object> {
    related_identity: record(global_identity),
    relationship_type: string,
    strength: float,
    evidence: array<object>
};

-- Add Cross-Platform Context Graph
DEFINE TABLE context_graph SCHEMAFULL;
DEFINE FIELD root_context ON context_graph TYPE record(context);
DEFINE FIELD related_contexts ON context_graph TYPE array<object> {
    context: record(context),
    relationship_type: array<string>,
    temporal_distance: duration,
    semantic_similarity: float,
    entity_overlap: object
};
DEFINE FIELD context_chain ON context_graph TYPE array<object> {
    sequence: array<record(context)>,
    chain_type: string,
    coherence_score: float,
    participants: array<record(global_identity)>
};

-- Add Enhanced Analysis Functions
DEFINE FUNCTION fn::analyze_cross_platform_context(
    $context_id: string,
    $params: object
) -> object {
    LET $context = (SELECT * FROM context WHERE id = $context_id);
    LET $window = $params.time_window || 24h;
    
    // Find temporally related contexts
    LET $temporal_contexts = (
        SELECT * FROM context
        WHERE temporal.start BETWEEN ($context.temporal.start - $window)
        AND ($context.temporal.start + $window)
    );

    // Analyze semantic relationships
    LET $semantic_matches = (
        SELECT *,
        vector::similarity(semantic.embeddings, $context.semantic.embeddings) as similarity
        FROM $temporal_contexts
        WHERE similarity > $params.semantic_threshold
    );

    RETURN {
        temporal_links: fn::analyze_temporal_connections($context, $temporal_contexts),
        semantic_links: fn::analyze_semantic_relationships($context, $semantic_matches),
        participant_flow: fn::analyze_participant_interactions($context),
        context_chain: fn::build_context_chain($context, $temporal_contexts)
    };
};

-- Add Context Chain Builder
DEFINE FUNCTION fn::build_context_chain(
    $root_context: object,
    $related_contexts: array
) -> object {
    // Build chain of related contexts
    LET $chain = array::sort(
        array::filter($related_contexts, function($ctx) {
            RETURN fn::is_contextually_related($root_context, $ctx);
        }),
        'temporal.start'
    );

    RETURN {
        sequence: $chain,
        metrics: fn::calculate_chain_metrics($chain),
        participants: fn::extract_chain_participants($chain),
        relationships: fn::analyze_chain_relationships($chain)
    };
};

-- Add Enhanced Security Scopes
DEFINE SCOPE global_identity_management SESSION 24h
    SIGNUP ( CREATE global_identity )
    SIGNIN ( 
        SELECT * FROM global_identity, context_graph 
        WHERE created_at > time::now() - 24h
    );

-- Add Cross-Platform Analysis Indices
DEFINE INDEX global_identity_graph ON global_identity 
    FIELDS identity_graph.related_identity;
DEFINE INDEX context_chain_temporal ON context_graph 
    FIELDS root_context.temporal.start;
DEFINE INDEX context_semantic ON context_graph 
    FIELDS root_context.semantic.embeddings VECTOR 384 COSINE;

// ...rest of existing code...

-- Add Conversation Flow Management
DEFINE TABLE conversation_flow SCHEMAFULL;
DEFINE FIELD flow_id ON conversation_flow TYPE string;
DEFINE FIELD root_context ON conversation_flow TYPE record(context);
DEFINE FIELD participants ON conversation_flow TYPE array<record(global_identity)>;
DEFINE FIELD flow_stages ON conversation_flow TYPE array<object> {
    stage_type: string,  // ['initial_contact', 'property_discussion', 'viewing_arrangement']
    context_ids: array<record(context)>,
    participants: array<record(global_identity)>,
    temporal_info: object {
        start_time: datetime,
        end_time: option<datetime>,
        expected_duration: duration
    },
    stage_metrics: object {
        completion_rate: float,
        engagement_scores: object,
        next_actions: array<string>
    }
};

-- Add Enhanced BERT Analysis Configuration
DEFINE TABLE bert_analysis_config SCHEMAFULL;
DEFINE FIELD model_settings ON bert_analysis_config TYPE object {
    model_type: string,
    embedding_dim: int,
    attention_heads: int,
    context_window: int
};
DEFINE FIELD analysis_rules ON bert_analysis_config TYPE array<object> {
    context_type: string,
    extraction_patterns: array,
    relevance_thresholds: object,
    custom_processors: array
};
DEFINE FIELD optimization_config ON bert_analysis_config TYPE object {
    batch_size: int,
    learning_rate: float,
    pruning_threshold: float
};

-- Add Cross-Platform Context Coordinator
DEFINE TABLE context_coordinator SCHEMAFULL;
DEFINE FIELD coordinator_id ON context_coordinator TYPE string;
DEFINE FIELD active_contexts ON context_coordinator TYPE array<record(context)>;
DEFINE FIELD context_rules ON context_coordinator TYPE array<object> {
    source_type: string,
    target_type: string,
    linking_conditions: object {
        temporal_window: duration,
        semantic_threshold: float,
        participant_overlap: float
    },
    priority: int
};
DEFINE FIELD active_flows ON context_coordinator TYPE array<record(conversation_flow)>;

-- Add Enhanced Analysis Functions
DEFINE FUNCTION fn::analyze_conversation_flow(
    $flow_id: string
) -> object {
    LET $flow = (SELECT * FROM conversation_flow WHERE id = $flow_id);
    
    RETURN {
        flow_analysis: {
            participant_journey: fn::analyze_participant_journey($flow),
            stage_transitions: fn::analyze_stage_transitions($flow),
            engagement_metrics: fn::calculate_engagement_metrics($flow)
        },
        context_connections: fn::analyze_context_connections($flow),
        next_stage_predictions: fn::predict_next_stages($flow)
    };
};

-- Add Cross-Platform Context Linking
DEFINE FUNCTION fn::link_cross_platform_contexts(
    $source_context: string,
    $target_context: string,
    $coordinator_id: string
) -> object {
    LET $coordinator = (SELECT * FROM context_coordinator WHERE id = $coordinator_id);
    LET $contexts = (
        SELECT * FROM context 
        WHERE id IN [$source_context, $target_context]
    );
    
    RETURN {
        linked_contexts: fn::create_context_link($contexts, $coordinator.context_rules),
        flow_update: fn::update_conversation_flow($contexts),
        participant_updates: fn::update_participant_states($contexts)
    };
};

-- Add Real-time Analysis Functions
DEFINE FUNCTION fn::coordinate_realtime_analysis(
    $coordinator_id: string
) -> object {
    LET $coordinator = (
        SELECT * FROM context_coordinator 
        WHERE id = $coordinator_id
    );

    RETURN {
        active_flows: fn::analyze_active_flows($coordinator.active_flows),
        context_updates: fn::process_context_updates($coordinator.active_contexts),
        recommendations: fn::generate_coordinator_recommendations($coordinator)
    };
};

-- Add Enhanced Security Scopes
DEFINE SCOPE conversation_flow SESSION 1h
    SIGNUP ( CREATE conversation_flow )
    SIGNIN ( 
        SELECT * FROM conversation_flow, context_coordinator 
        WHERE temporal_info.start_time > time::now() - 1h
    );

-- Add Indices for Enhanced Performance
DEFINE INDEX flow_temporal ON conversation_flow 
    FIELDS flow_stages[*].temporal_info.start_time;
DEFINE INDEX coordinator_contexts ON context_coordinator 
    FIELDS active_contexts;

// ...rest of existing code...

// ...existing code...

-- Add Helper Functions for Context Analysis
DEFINE FUNCTION fn::calculate_temporal_proximity(
    $context1: object,
    $context2: object
) -> float {
    LET $time_diff = datetime::diff(
        $context1.temporal.start,
        $context2.temporal.start
    );
    LET $max_window = 24h;
    RETURN math::max(0, 1 - duration::hours($time_diff) / duration::hours($max_window));
};

DEFINE FUNCTION fn::calculate_semantic_similarity(
    $embedding1: array,
    $embedding2: array
) -> float {
    RETURN vector::similarity($embedding1, $embedding2);
};

DEFINE FUNCTION fn::calculate_entity_overlap(
    $entities1: array,
    $entities2: array
) -> float {
    LET $common = array::intersection(
        array::map($entities1, function($e) { RETURN $e.entity.id; }),
        array::map($entities2, function($e) { RETURN $e.entity.id; })
    );
    RETURN array::len($common) / math::max(
        array::len($entities1),
        array::len($entities2)
    );
};

-- Add Context Processing Helpers
DEFINE FUNCTION fn::extract_context_features(
    $context: object
) -> object {
    RETURN {
        temporal: {
            start: $context.temporal.start,
            duration: $context.temporal.duration,
            time_of_day: time::hour($context.temporal.start)
        },
        semantic: {
            embedding: $context.semantic.embeddings[0],
            topics: array::map($context.topics, function($t) {
                RETURN { topic: $t.name, relevance: $t.relevance };
            })
        },
        entities: array::map($context.entities, function($e) {
            RETURN {
                id: $e.entity.id,
                role: $e.role,
                relevance: $e.relevance
            };
        })
    };
};

-- Add Pattern Detection Helpers
DEFINE FUNCTION fn::identify_conversation_patterns(
    $contexts: array,
    $window: duration
) -> array {
    LET $sequence = array::sort($contexts, 'temporal.start');
    LET $patterns = [];

    // Detect topic patterns
    LET $topic_patterns = fn::detect_topic_patterns($sequence);
    
    // Detect interaction patterns
    LET $interaction_patterns = fn::detect_interaction_patterns($sequence);
    
    // Detect temporal patterns
    LET $temporal_patterns = fn::detect_temporal_patterns($sequence);

    RETURN array::concat(
        $topic_patterns,
        $interaction_patterns,
        $temporal_patterns
    );
};

-- Add Relationship Analysis Helpers
DEFINE FUNCTION fn::analyze_relationship_strength(
    $context1: object,
    $context2: object
) -> object {
    LET $temporal = fn::calculate_temporal_proximity($context1, $context2);
    LET $semantic = fn::calculate_semantic_similarity(
        $context1.semantic.embeddings[0],
        $context2.semantic.embeddings[0]
    );
    LET $entity = fn::calculate_entity_overlap(
        $context1.entities,
        $context2.entities
    );

    RETURN {
        temporal: $temporal,
        semantic: $semantic,
        entity: $entity,
        combined: ($temporal * 0.3 + $semantic * 0.4 + $entity * 0.3)
    };
};

-- Add Context Chain Analysis Helpers
DEFINE FUNCTION fn::analyze_context_chain(
    $chain: array
) -> object {
    RETURN {
        coherence: fn::calculate_chain_coherence($chain),
        flow: fn::analyze_conversation_flow($chain),
        transitions: fn::analyze_chain_transitions($chain),
        completion: fn::assess_chain_completion($chain)
    };
};

-- Add Entity Resolution Helpers
DEFINE FUNCTION fn::resolve_cross_platform_identity(
    $identities: array
) -> record(global_identity) {
    LET $matches = (
        SELECT *
        FROM global_identity
        WHERE platform_identities[*].local_id IN $identities[*].local_id
    );

    IF array::len($matches) = 0 {
        RETURN fn::create_global_identity($identities);
    };

    RETURN fn::merge_identity_profiles($matches[0], $identities);
};

-- Add Real-time Analysis Helpers
DEFINE FUNCTION fn::process_realtime_context(
    $context: object,
    $analysis_config: object
) -> object {
    // Extract features
    LET $features = fn::extract_context_features($context);
    
    // Analyze with BERT
    LET $bert_analysis = fn::perform_bert_analysis(
        $features,
        $analysis_config.bert_config
    );

    // Detect patterns
    LET $patterns = fn::detect_realtime_patterns(
        $context,
        $analysis_config.pattern_config
    );

    RETURN {
        features: $features,
        bert_analysis: $bert_analysis,
        patterns: $patterns,
        recommendations: fn::generate_realtime_recommendations($context, $patterns)
    };
};

-- Add Graph Traversal Helpers
DEFINE FUNCTION fn::traverse_context_graph(
    $start_context: string,
    $params: object
) -> array {
    LET $visited = [];
    LET $queue = [$start_context];
    
    WHILE array::len($queue) > 0 {
        LET $current = array::pop($queue);
        IF !array::contains($visited, $current) {
            LET $related = fn::find_related_contexts($current, $params);
            SET $queue = array::concat($queue, $related);
            SET $visited = array::append($visited, $current);
        };
    };
    
    RETURN $visited;
};

// ...rest of existing code...

// ...existing code...

-- Add Helper Functions for Cross-Platform Analysis
DEFINE FUNCTION fn::analyze_cross_context_similarity(
    $context1: record(context),
    $context2: record(context)
) -> object {
    RETURN {
        temporal_similarity: fn::calculate_temporal_proximity(
            $context1.temporal,
            $context2.temporal
        ),
        semantic_similarity: fn::calculate_semantic_similarity(
            $context1.semantic.embeddings,
            $context2.semantic.embeddings
        ),
        entity_overlap: fn::calculate_entity_overlap(
            $context1.entities,
            $context2.entities
        ),
        contextual_relevance: fn::analyze_contextual_relevance(
            $context1,
            $context2
        )
    };
};

DEFINE FUNCTION fn::find_related_conversations_by_context(
    $context_id: string,
    $window: duration,
    $similarity_threshold: float
) -> array {
    LET $base_context = (SELECT * FROM context WHERE id = $context_id);
    
    RETURN (
        SELECT id,
        fn::analyze_cross_context_similarity(
            $base_context,
            context
        ) as similarity_scores
        FROM context
        WHERE temporal.start > $base_context.temporal.start - $window
        AND temporal.start < $base_context.temporal.start + $window
        AND id != $context_id
        HAVING similarity_scores.semantic_similarity > $similarity_threshold
        ORDER BY similarity_scores.combined DESC
        LIMIT 10
    );
};

DEFINE FUNCTION fn::build_context_chain_graph(
    $root_context_id: string,
    $depth: int
) -> object {
    LET $visited = [];
    LET $edges = [];
    LET $queue = [[$root_context_id, 0]];
    
    WHILE array::len($queue) > 0 {
        LET $current = array::pop($queue);
        LET $current_id = $current[0];
        LET $current_depth = $current[1];
        
        IF !array::contains($visited, $current_id) 
        AND $current_depth <= $depth {
            LET $related = fn::find_related_conversations_by_context(
                $current_id,
                24h,
                0.7
            );
            
            FOREACH $rel IN $related {
                SET $edges = array::append($edges, {
                    from: $current_id,
                    to: $rel.id,
                    strength: $rel.similarity_scores
                });
                SET $queue = array::append(
                    $queue,
                    [$rel.id, $current_depth + 1]
                );
            };
            
            SET $visited = array::append($visited, $current_id);
        };
    };
    
    RETURN {
        nodes: $visited,
        edges: $edges,
        metrics: fn::calculate_graph_metrics($visited, $edges)
    };
};

// Add more helper functions...
// ...existing code...

-- Add Enhanced Helper Functions

-- Identity Resolution Helpers
DEFINE FUNCTION fn::resolve_global_identity(
    $platform_identities: array
) -> record(global_identity) {
    LET $matches = (
        SELECT * FROM global_identity
        WHERE platform_identities[*].local_id IN $platform_identities[*].local_id
    );

    IF array::len($matches) = 0 {
        RETURN CREATE global_identity CONTENT {
            platform_identities: $platform_identities,
            created_at: time::now()
        };
    };

    RETURN fn::merge_identity_profiles($matches[0], $platform_identities);
};

DEFINE FUNCTION fn::analyze_identity_relationships(
    $identity1: record(global_identity),
    $identity2: record(global_identity)
) -> object {
    LET $shared_contexts = (
        SELECT * FROM context
        WHERE array::contains(entities.*.entity, $identity1.id)
        AND array::contains(entities.*.entity, $identity2.id)
    );

    RETURN {
        relationship_strength: fn::calculate_relationship_strength($shared_contexts),
        interaction_history: fn::analyze_interaction_history($shared_contexts),
        communication_patterns: fn::detect_communication_patterns($shared_contexts),
        temporal_proximity: fn::analyze_temporal_proximity($shared_contexts)
    };
};

-- Enhanced Context Analysis Helpers
DEFINE FUNCTION fn::analyze_context_relationships_enhanced(
    $context_id: string,
    $window: duration
) -> object {
    LET $context = (SELECT * FROM context WHERE id = $context_id);
    LET $related_contexts = (
        SELECT * FROM context
        WHERE temporal.start > $context.temporal.start - $window
        AND temporal.start < $context.temporal.start + $window
        AND id != $context_id
    );

    RETURN {
        temporal_relationships: fn::analyze_temporal_relationships($context, $related_contexts),
        semantic_relationships: fn::analyze_semantic_relationships($context, $related_contexts),
        entity_relationships: fn::analyze_entity_relationships($context, $related_contexts),
        context_chain: fn::build_context_chain($context, $related_contexts)
    };
};

-- Advanced Pattern Detection Helpers
DEFINE FUNCTION fn::detect_complex_patterns(
    $contexts: array,
    $config: object
) -> array {
    LET $sequence = array::sort($contexts, 'temporal.start');
    
    RETURN {
        conversation_patterns: fn::analyze_conversation_patterns($sequence),
        interaction_patterns: fn::analyze_interaction_patterns($sequence),
        temporal_patterns: fn::analyze_temporal_patterns($sequence),
        identity_patterns: fn::analyze_identity_patterns($sequence),
        meta_patterns: fn::combine_pattern_analysis($sequence)
    };
};

-- Real-time Analysis Coordination Helpers
DEFINE FUNCTION fn::coordinate_realtime_analysis_enhanced(
    $context_id: string,
    $config: object
) -> object {
    LET $context = (SELECT * FROM context WHERE id = $context_id);
    
    RETURN {
        current_analysis: {
            bert: fn::perform_bert_analysis($context),
            patterns: fn::detect_realtime_patterns($context),
            metrics: fn::calculate_realtime_metrics($context)
        },
        historical_context: fn::analyze_historical_context($context),
        predictions: fn::generate_context_predictions($context),
        recommendations: fn::generate_action_recommendations($context)
    };
};

-- Relationship Strength Calculation Helpers
DEFINE FUNCTION fn::calculate_relationship_strength_enhanced(
    $context1: object,
    $context2: object
) -> object {
    RETURN {
        temporal_strength: fn::calculate_temporal_proximity(
            $context1.temporal,
            $context2.temporal
        ),
        semantic_strength: fn::calculate_semantic_similarity(
            $context1.semantic.embeddings,
            $context2.semantic.embeddings
        ),
        entity_strength: fn::calculate_entity_overlap(
            $context1.entities,
            $context2.entities
        ),
        context_strength: fn::calculate_context_similarity(
            $context1,
            $context2
        ),
        combined_strength: fn::combine_relationship_strengths([
            temporal_strength,
            semantic_strength,
            entity_strength,
            context_strength
        ])
    };
};

-- Graph Traversal and Analysis Helpers
DEFINE FUNCTION fn::traverse_context_graph_enhanced(
    $root_context: string,
    $params: object
) -> object {
    LET $visited_contexts = [];
    LET $relationships = [];
    LET $queue = [$root_context];
    
    WHILE array::len($queue) > 0 {
        LET $current = array::pop($queue);
        IF !array::contains($visited_contexts, $current) {
            LET $related = fn::find_related_contexts_enhanced($current, $params);
            FOREACH $rel IN $related {
                SET $relationships = array::append(
                    $relationships,
                    fn::analyze_context_relationship($current, $rel)
                );
                SET $queue = array::append($queue, $rel.id);
            };
            SET $visited_contexts = array::append($visited_contexts, $current);
        };
    };
    
    RETURN {
        visited: $visited_contexts,
        relationships: $relationships,
        metrics: fn::calculate_graph_metrics($visited_contexts, $relationships),
        patterns: fn::analyze_graph_patterns($visited_contexts, $relationships)
    };
};

// ...rest of existing code...

-- Add Property Context Helper Functions
DEFINE FUNCTION fn::analyze_viewing_request_chain(
    $client_context: string,
    $owner_context: string
) -> object {
    LET $contexts = (
        SELECT * FROM context 
        WHERE id IN [$client_context, $owner_context]
    );
    
    RETURN {
        request_similarity: fn::calculate_viewing_request_similarity($contexts),
        property_context: fn::extract_property_details($contexts),
        scheduling_alignment: fn::analyze_scheduling_alignment($contexts),
        participant_availability: fn::analyze_participant_availability($contexts)
    };
};

-- Add Time Window Analysis Helpers
DEFINE FUNCTION fn::find_related_property_contexts(
    $context_id: string,
    $window: duration
) -> array {
    LET $base_context = (SELECT * FROM context WHERE id = $context_id);
    LET $property_id = fn::extract_property_id($base_context);
    
    RETURN (
        SELECT *,
        fn::calculate_context_relevance(
            $base_context,
            context
        ) as relevance
        FROM context
        WHERE temporal.start > $base_context.temporal.start - $window
        AND temporal.start < $base_context.temporal.start + $window
        AND fn::extract_property_id(context) = $property_id
        ORDER BY relevance DESC
    );
};

-- Add Multi-Party Coordination Helpers
DEFINE FUNCTION fn::coordinate_viewing_arrangement(
    $viewing_context_id: string
) -> object {
    LET $viewing_context = (
        SELECT * FROM property_viewing_context
        WHERE id = $viewing_context_id
    );
    
    RETURN {
        stakeholders: fn::analyze_stakeholder_states($viewing_context),
        availability: fn::find_common_availability($viewing_context),
        communication_plan: fn::generate_communication_plan($viewing_context),
        next_steps: fn::determine_coordination_steps($viewing_context)
    };
};

-- Add Context Linking Score Helpers
DEFINE FUNCTION fn::calculate_property_context_score(
    $context1: object,
    $context2: object
) -> object {
    RETURN {
        property_match: fn::check_property_match($context1, $context2),
        temporal_score: fn::calculate_temporal_proximity($context1, $context2),
        intent_alignment: fn::analyze_intent_alignment($context1, $context2),
        stakeholder_overlap: fn::calculate_stakeholder_overlap($context1, $context2),
        combined_score: fn::combine_context_scores([
            property_match,
            temporal_score,
            intent_alignment,
            stakeholder_overlap
        ])
    };
};

-- Add Communication Flow Prediction Helpers
DEFINE FUNCTION fn::predict_next_interactions(
    $context_id: string
) -> array {
    LET $context = (SELECT * FROM context WHERE id = $context_id);
    LET $property_id = fn::extract_property_id($context);
    
    RETURN {
        expected_participants: fn::predict_next_participants($context),
        likely_timeframes: fn::predict_interaction_timeframes($context),
        suggested_platforms: fn::suggest_communication_platforms($context),
        required_actions: fn::determine_required_actions($context)
    };
};

// ...rest of existing code...

// ...existing code...

-- Add Intent Matching Helpers
DEFINE FUNCTION fn::analyze_conversation_intent(
    $context_id: string
) -> object {
    LET $context = (SELECT * FROM context WHERE id = $context_id);
    
    RETURN {
        primary_intent: fn::extract_primary_intent($context),
        sub_intents: fn::identify_sub_intents($context),
        intent_confidence: fn::calculate_intent_confidence($context),
        related_intents: fn::find_related_intents($context)
    };
};

-- Add Context Transition Analysis
DEFINE FUNCTION fn::analyze_context_transitions(
    $context_chain: array
) -> object {
    LET $transitions = array::windows($context_chain, 2);
    
    RETURN {
        transition_points: array::map($transitions, function($pair) {
            RETURN {
                from_context: $pair[0],
                to_context: $pair[1],
                transition_type: fn::determine_transition_type($pair),
                coherence_score: fn::calculate_transition_coherence($pair)
            };
        }),
        chain_coherence: fn::calculate_chain_coherence($transitions),
        breakpoints: fn::identify_context_breakpoints($transitions)
    };
};

-- Add Stakeholder State Tracking
DEFINE FUNCTION fn::track_stakeholder_state(
    $context_id: string,
    $stakeholder_id: string
) -> object {
    LET $context = (SELECT * FROM context WHERE id = $context_id);
    LET $stakeholder = (SELECT * FROM global_identity WHERE id = $stakeholder_id);
    
    RETURN {
        current_state: fn::determine_stakeholder_state($context, $stakeholder),
        pending_actions: fn::identify_pending_actions($context, $stakeholder),
        interaction_history: fn::get_stakeholder_history($context, $stakeholder),
        state_predictions: fn::predict_next_states($context, $stakeholder)
    };
};

-- Add Enhanced Contextual Matching
DEFINE FUNCTION fn::match_related_contexts(
    $source_context: string,
    $matching_criteria: object
) -> array {
    LET $context = (SELECT * FROM context WHERE id = $source_context);
    
    RETURN (
        SELECT *,
        fn::calculate_matching_score(context, $matching_criteria) as match_score
        FROM context
        WHERE fn::meets_matching_criteria(context, $matching_criteria)
        ORDER BY match_score DESC
        LIMIT 10
    );
};

-- Add Context Flow Prediction
DEFINE FUNCTION fn::predict_context_flow(
    $current_context: string
) -> object {
    LET $context = (SELECT * FROM context WHERE id = $current_context);
    
    RETURN {
        likely_next_contexts: fn::predict_next_contexts($context),
        participant_predictions: fn::predict_participant_involvement($context),
        timing_predictions: fn::predict_timing_windows($context),
        action_recommendations: fn::generate_next_actions($context)
    };
};

-- Add Context Merging Helpers
DEFINE FUNCTION fn::merge_context_threads(
    $context_ids: array,
    $merge_config: object
) -> object {
    LET $contexts = (
        SELECT * FROM context 
        WHERE id IN $context_ids
    );
    
    RETURN {
        merged_context: fn::create_merged_context($contexts),
        relationship_map: fn::create_relationship_map($contexts),
        entity_resolution: fn::resolve_merged_entities($contexts),
        temporal_alignment: fn::align_temporal_spans($contexts)
    };
};

// ...rest of existing code...

// ...existing code...

-- Add Real Estate Process Workflow System
DEFINE TABLE real_estate_workflow SCHEMAFULL;
DEFINE FIELD workflow_id ON real_estate_workflow TYPE string;
DEFINE FIELD workflow_type ON real_estate_workflow TYPE string 
    ASSERT $value IN ['listing', 'viewing', 'offer', 'sale', 'rental', 'property_search'];
DEFINE FIELD stages ON real_estate_workflow TYPE array<object> {
    stage_id: string,
    stage_name: string,
    key_objectives: array<string>,
    client_focus_points: array<string>,
    flexibility_level: float,  // Flexibility in script following (0-1)
    adaptation_rules: array<object> {
        trigger: string,
        condition: object,
        adjustments: array<string>
    }
};
DEFINE FIELD client_journey ON real_estate_workflow TYPE object {
    trust_metrics: object {
        key_signals: array<string>,
        trust_building_points: array<string>,
        concern_handling: array<object>
    },
    engagement_tracking: object {
        satisfaction_indicators: array<string>,
        stress_points: array<string>,
        resolution_strategies: array<string>
    }
};

-- Add Client Relationship Management
DEFINE TABLE client_relationship SCHEMAFULL;
DEFINE FIELD client_id ON client_relationship TYPE record(global_identity);
DEFINE FIELD agent_id ON client_relationship TYPE record(global_identity);
DEFINE FIELD relationship_metrics ON client_relationship TYPE object {
    trust_level: float,
    engagement_score: float,
    communication_preference: array<string>,
    interaction_history: array<object> {
        context_id: record(context),
        sentiment: float,
        key_points: array<string>,
        outcomes: array<string>
    }
};
DEFINE FIELD adaptation_strategy ON client_relationship TYPE object {
    communication_style: string,
    preferred_platforms: array<record(communication_platform)>,
    key_topics: array<string>,
    sensitive_areas: array<string>
};

-- Add Enhanced Process Stage Tracking
DEFINE TABLE workflow_stage_tracking SCHEMAFULL;
DEFINE FIELD workflow_id ON workflow_stage_tracking TYPE record(real_estate_workflow);
DEFINE FIELD current_stage ON workflow_stage_tracking TYPE object {
    stage_id: string,
    progress: float,
    client_state: object {
        engagement_level: float,
        trust_level: float,
        concerns: array<string>
    },
    adaptations_applied: array<object>
};
DEFINE FIELD stage_history ON workflow_stage_tracking TYPE array<object> {
    stage_id: string,
    start_time: datetime,
    end_time: option<datetime>,
    outcomes: array<string>,
    client_feedback: object
};

-- Add Client Experience Functions
DEFINE FUNCTION fn::track_client_experience(
    $context_id: string,
    $client_id: string
) -> object {
    LET $context = (SELECT * FROM context WHERE id = $context_id);
    LET $client = (SELECT * FROM client_relationship WHERE client_id = $client_id);
    
    RETURN {
        trust_analysis: fn::analyze_trust_signals($context),
        engagement_metrics: fn::calculate_engagement_metrics($context),
        concern_tracking: fn::identify_and_track_concerns($context),
        relationship_status: fn::assess_relationship_health($client),
        recommended_actions: fn::generate_relationship_recommendations($context, $client)
    };
};

-- Add Workflow Adaptation Functions
DEFINE FUNCTION fn::adapt_workflow_stage(
    $workflow_id: string,
    $stage_id: string,
    $client_state: object
) -> object {
    LET $workflow = (SELECT * FROM real_estate_workflow WHERE id = $workflow_id);
    LET $stage = array::find($workflow.stages, function($s) {
        RETURN $s.stage_id == $stage_id;
    });
    
    RETURN {
        adapted_guidance: fn::generate_adapted_guidance($stage, $client_state),
        trust_building_focus: fn::identify_trust_building_opportunities($stage, $client_state),
        communication_strategy: fn::adapt_communication_approach($stage, $client_state),
        flexibility_points: fn::identify_flexible_elements($stage, $client_state)
    };
};

-- Add Workflow Progress Analysis
DEFINE FUNCTION fn::analyze_workflow_progress(
    $workflow_id: string
) -> object {
    LET $tracking = (SELECT * FROM workflow_stage_tracking WHERE workflow_id = $workflow_id);
    
    RETURN {
        stage_progress: fn::analyze_stage_completion($tracking),
        client_journey: fn::analyze_client_journey($tracking),
        trust_development: fn::analyze_trust_building_progress($tracking),
        effectiveness: fn::evaluate_workflow_effectiveness($tracking),
        optimization_suggestions: fn::generate_workflow_improvements($tracking)
    };
};

// Add indices for workflow analysis
DEFINE INDEX workflow_stage_temporal ON workflow_stage_tracking 
    FIELDS stage_history[*].start_time;
DEFINE INDEX client_relationship_metrics ON client_relationship 
    FIELDS relationship_metrics.trust_level, relationship_metrics.engagement_score;

// ...rest of existing code...

// ...existing code...

-- Add Trust Building Analytics
DEFINE TABLE trust_metrics SCHEMAFULL;
DEFINE FIELD interaction_id ON trust_metrics TYPE record(context);
DEFINE FIELD trust_signals ON trust_metrics TYPE array<object> {
    signal_type: string,  // ['open_communication', 'concern_addressed', 'follow_through', 'proactive_support']
    strength: float,
    context: string,
    evidence: array<string>
};
DEFINE FIELD trust_trajectory ON trust_metrics TYPE array<object> {
    timestamp: datetime,
    score: float,
    contributing_factors: array<string>
};

-- Add Engagement Quality Tracking
DEFINE TABLE engagement_quality SCHEMAFULL;
DEFINE FIELD context_id ON engagement_quality TYPE record(context);
DEFINE FIELD quality_metrics ON engagement_quality TYPE object {
    depth_of_interaction: float,
    information_exchange: float,
    emotional_resonance: float,
    follow_up_commitment: float
};
DEFINE FIELD stakeholder_engagement ON engagement_quality TYPE array<object> {
    stakeholder: record(global_identity),
    participation_level: float,
    understanding_level: float,
    satisfaction_indicators: array<string>
};

-- Add Client Journey Mapping
DEFINE FUNCTION fn::map_client_journey(
    $client_id: string,
    $workflow_id: string
) -> object {
    LET $interactions = (
        SELECT * FROM context
        WHERE entities CONTAINS { entity: $client_id }
        ORDER BY temporal.start
    );
    
    RETURN {
        journey_stages: fn::analyze_journey_stages($interactions),
        trust_development: fn::analyze_trust_progression($interactions),
        engagement_quality: fn::assess_engagement_quality($interactions),
        critical_moments: fn::identify_critical_moments($interactions),
        improvement_opportunities: fn::identify_improvement_areas($interactions)
    };
};

-- Add Process Adaptation Analytics
DEFINE FUNCTION fn::analyze_process_adaptations(
    $workflow_id: string
) -> object {
    LET $workflow = (SELECT * FROM real_estate_workflow WHERE id = $workflow_id);
    
    RETURN {
        adaptation_points: fn::identify_adaptation_points($workflow),
        effectiveness: fn::assess_adaptation_effectiveness($workflow),
        client_response: fn::analyze_client_response_to_adaptations($workflow),
        recommendations: fn::generate_adaptation_recommendations($workflow)
    };
};

// Add indices for journey analysis
DEFINE INDEX trust_trajectory_temporal ON trust_metrics 
    FIELDS trust_trajectory[*].timestamp;
DEFINE INDEX engagement_quality_context ON engagement_quality 
    FIELDS context_id, quality_metrics.depth_of_interaction;

// ...rest of existing code...

// ...existing code...

-- Add Dynamic Script Adaptation
DEFINE TABLE script_adaptation_rules SCHEMAFULL;
DEFINE FIELD workflow_type ON script_adaptation_rules TYPE string;
DEFINE FIELD adaptation_triggers ON script_adaptation_rules TYPE array<object> {
    trigger_type: string,  // ['client_state', 'market_condition', 'timing_constraint', 'preference_change']
    conditions: object,
    priority: int,
    adaptation_actions: array<object> {
        action_type: string,
        parameters: object,
        fallback_options: array
    }
};
DEFINE FIELD contextual_overrides ON script_adaptation_rules TYPE object {
    market_conditions: array<string>,
    client_segments: array<string>,
    property_types: array<string>,
    urgency_levels: array<string>
};

-- Add Enhanced Chain Context Tracking
DEFINE FIELD chain_context ON context_chain TYPE object {
    business_context: object {
        deal_stage: string,
        market_conditions: object,
        stakeholder_requirements: array
    },
    temporal_context: object {
        market_timing: object,
        seasonal_factors: array,
        urgency_indicators: object
    },
    relationship_context: object {
        trust_trajectory: array,
        stakeholder_dynamics: object,
        communication_preferences: object
    }
};

-- Add Comprehensive Step Progress Tracking
DEFINE FIELD progress_metrics ON workflow_stage_tracking TYPE object {
    quantitative_metrics: object {
        completion_percentage: float,
        time_efficiency: float,
        quality_indicators: array<float>
    },
    qualitative_metrics: object {
        client_satisfaction: float,
        process_smoothness: float,
        adaptation_effectiveness: float
    },
    risk_metrics: object {
        identified_risks: array,
        mitigation_status: object,
        contingency_triggers: array
    }
};

-- Add Flow Optimization
DEFINE FIELD flow_optimization ON conversation_flow TYPE object {
    bottleneck_analysis: array<object>,
    efficiency_metrics: object,
    adaptation_suggestions: array<object>,
    resource_allocation: object {
        current_allocation: object,
        suggested_changes: array,
        optimization_metrics: object
    }
};

-- Add Context Integration Enhancement
DEFINE FUNCTION fn::enhance_context_integration(
    $context_id: string,
    $integration_params: object
) -> object {
    // Implementation for enhanced context integration
    // This function strengthens the connections between different context types
};

// ...rest of existing code...

-- Add Workflow State Machine
DEFINE TABLE workflow_state_machine SCHEMAFULL;
DEFINE FIELD workflow_id ON workflow_state_machine TYPE record(real_estate_workflow);
DEFINE FIELD state_transitions ON workflow_state_machine TYPE array<object> {
    from_state: string,
    to_state: string,
    transition_rules: array<object> {
        conditions: object,
        validation_rules: array<string>,
        required_actions: array<string>,
        fallback_states: array<string>
    },
    metrics: object {
        transition_success_rate: float,
        average_duration: duration,
        failure_points: array<string>
    }
};

-- Add Context Persistence Layer
DEFINE TABLE context_persistence SCHEMAFULL;
DEFINE FIELD context_id ON context_persistence TYPE record(context);
DEFINE FIELD version_history ON context_persistence TYPE array<object> {
    timestamp: datetime,
    changes: object,
    metadata: object {
        change_type: string,
        triggered_by: record(identity),
        related_contexts: array<record(context)>
    }
};
DEFINE FIELD durability_metrics ON context_persistence TYPE object {
    persistence_score: float,
    reliability_index: float,
    recovery_points: array<object>
};

-- Add Chain Coherence Tracking
DEFINE TABLE chain_coherence SCHEMAFULL;
DEFINE FIELD chain_id ON chain_coherence TYPE record(context_chain);
DEFINE FIELD coherence_metrics ON chain_coherence TYPE object {
    semantic_coherence: float,
    temporal_consistency: float,
    entity_continuity: float,
    process_alignment: float
};
DEFINE FIELD gap_analysis ON chain_coherence TYPE array<object> {
    gap_type: string,
    severity: float,
    detection_method: string,
    resolution_strategy: object
};

-- Add Flow Synchronization
DEFINE FUNCTION fn::synchronize_workflow_components(
    $workflow_id: string
) -> object {
    LET $workflow = (SELECT * FROM real_estate_workflow WHERE id = $workflow_id);
    
    RETURN {
        script_flow_alignment: fn::align_script_with_flow($workflow),
        chain_step_synchronization: fn::synchronize_chain_steps($workflow),
        state_consistency: fn::ensure_state_consistency($workflow),
        component_health: fn::check_component_health($workflow)
    };
};

-- Add Comprehensive Error Recovery
DEFINE FUNCTION fn::handle_workflow_recovery(
    $context_id: string,
    $error_type: string
) -> object {
    LET $context = (SELECT * FROM context WHERE id = $context_id);
    
    RETURN {
        recovery_plan: fn::generate_recovery_plan($context, $error_type),
        state_restoration: fn::restore_consistent_state($context),
        chain_repair: fn::repair_broken_chains($context),
        notification_dispatch: fn::notify_stakeholders($context, $error_type)
    };
};

-- Add Component Health Monitoring
DEFINE TABLE component_health SCHEMAFULL;
DEFINE FIELD component_type ON component_health TYPE string 
    ASSERT $value IN ['script', 'chain', 'step', 'flow'];
DEFINE FIELD health_metrics ON component_health TYPE object {
    reliability_score: float,
    performance_metrics: object,
    error_rates: object,
    recovery_success_rate: float
};
DEFINE FIELD monitoring_config ON component_health TYPE object {
    check_frequency: duration,
    alert_thresholds: object,
    recovery_procedures: array<object>
};

// ...rest of existing code...

-- Add Enhanced Script-Flow Integration
DEFINE TABLE script_flow_integration SCHEMAFULL;
DEFINE FIELD script_id ON script_flow_integration TYPE record(real_estate_workflow);
DEFINE FIELD active_flows ON script_flow_integration TYPE array<record(conversation_flow)>;
DEFINE FIELD integration_state ON script_flow_integration TYPE object {
    alignment_score: float,
    deviation_tracking: array<object> {
        deviation_point: string,
        reason: string,
        severity: float,
        adaptation_applied: object
    },
    recovery_points: array<object> {
        stage_id: string,
        recovery_options: array<string>,
        fallback_states: array<string>
    }
};

-- Add Chain-Step Synchronization
DEFINE TABLE chain_step_sync SCHEMAFULL;
DEFINE FIELD chain_id ON chain_step_sync TYPE record(context_chain);
DEFINE FIELD current_step ON chain_step_sync TYPE record(workflow_stage_tracking);
DEFINE FIELD sync_metrics ON chain_step_sync TYPE object {
    temporal_alignment: float,
    context_relevance: float,
    step_appropriateness: float,
    chain_continuity: float
};
DEFINE FIELD sync_status ON chain_step_sync TYPE object {
    is_synchronized: bool,
    sync_issues: array<object> {
        issue_type: string,
        severity: float,
        resolution_status: string,
        action_required: string
    }
};

-- Add Comprehensive Context Durability
DEFINE TABLE context_durability SCHEMAFULL;
DEFINE FIELD context_id ON context_durability TYPE record(context);
DEFINE FIELD durability_metrics ON context_durability TYPE object {
    semantic_stability: float,
    temporal_persistence: float,
    entity_consistency: float,
    chain_strength: float
};
DEFINE FIELD recovery_points ON context_durability TYPE array<object> {
    timestamp: datetime,
    state_snapshot: object,
    recovery_procedure: object {
        steps: array<string>,
        dependencies: array<record(context)>,
        validation_rules: array<string>
    }
};

-- Add Enhanced Flow State Management
DEFINE TABLE flow_state_management SCHEMAFULL;
DEFINE FIELD flow_id ON flow_state_management TYPE record(conversation_flow);
DEFINE FIELD state_transitions ON flow_state_management TYPE array<object> {
    from_state: string,
    to_state: string,
    transition_rules: array<object> {
        conditions: object,
        validation_checks: array<string>,
        rollback_procedure: object
    }
};
DEFINE FIELD flow_integrity ON flow_state_management TYPE object {
    consistency_score: float,
    transition_validity: float,
    state_durability: float,
    recovery_readiness: float
};

-- Add Cross-Component Synchronization Function
DEFINE FUNCTION fn::synchronize_components(
    $workflow_id: string,
    $context_id: string
) -> object {
    LET $workflow = (SELECT * FROM real_estate_workflow WHERE id = $workflow_id);
    LET $context = (SELECT * FROM context WHERE id = $context_id);
    
    RETURN {
        script_alignment: fn::align_with_script($workflow, $context),
        chain_continuity: fn::ensure_chain_continuity($context),
        step_progression: fn::validate_step_progression($workflow, $context),
        flow_coordination: fn::coordinate_active_flows($workflow, $context),
        integrity_checks: fn::verify_system_integrity($workflow, $context),
        recovery_points: fn::establish_recovery_points($workflow, $context)
    };
};

-- Add Component Health Check Function
DEFINE FUNCTION fn::check_component_health(
    $component_id: string,
    $component_type: string
) -> object {
    RETURN {
        durability_score: fn::assess_durability($component_id, $component_type),
        consistency_metrics: fn::verify_consistency($component_id, $component_type),
        recovery_readiness: fn::evaluate_recovery_readiness($component_id, $component_type),
        integrity_status: fn::check_integrity($component_id, $component_type)
    };
};

// ...rest of existing code...

-- Add System-wide Integrity Indices
DEFINE INDEX script_flow_alignment ON script_flow_integration 
    FIELDS integration_state.alignment_score;
DEFINE INDEX chain_step_consistency ON chain_step_sync 
    FIELDS sync_metrics.temporal_alignment, sync_metrics.context_relevance;
DEFINE INDEX context_durability_score ON context_durability 
    FIELDS durability_metrics.semantic_stability, durability_metrics.chain_strength;
DEFINE INDEX flow_state_integrity ON flow_state_management 
    FIELDS flow_integrity.consistency_score, flow_integrity.state_durability;

// ...rest of existing code...

// ...existing code...

-- Add System Resilience Layer
DEFINE TABLE system_resilience SCHEMAFULL;
DEFINE FIELD component_id ON system_resilience TYPE string;
DEFINE FIELD resilience_metrics ON system_resilience TYPE object {
    fault_tolerance: float,
    recovery_capability: float,
    data_consistency: float,
    system_stability: float
};
DEFINE FIELD protection_mechanisms ON system_resilience TYPE array<object> {
    mechanism_type: string,
    coverage_area: array<string>,
    activation_rules: object,
    fallback_procedures: array<object>
};

-- Add Enhanced State Recovery
DEFINE TABLE state_recovery SCHEMAFULL;
DEFINE FIELD workflow_id ON state_recovery TYPE record(real_estate_workflow);
DEFINE FIELD recovery_points ON state_recovery TYPE array<object> {
    timestamp: datetime,
    component_states: object {
        script_state: object,
        chain_state: object,
        flow_state: object
    },
    verification_checksums: object,
    recovery_procedures: array<string>
};

-- Add Cross-Component Verification
DEFINE FUNCTION fn::verify_system_state(
    $workflow_id: string
) -> object {
    LET $workflow = (SELECT * FROM real_estate_workflow WHERE id = $workflow_id);
    
    RETURN {
        component_health: fn::verify_all_components($workflow),
        state_consistency: fn::check_state_consistency($workflow),
        data_integrity: fn::verify_data_integrity($workflow),
        system_stability: fn::assess_system_stability($workflow),
        recovery_readiness: fn::check_recovery_readiness($workflow)
    };
};

-- Add System Health Monitoring
DEFINE FUNCTION fn::monitor_system_health() -> object {
    RETURN {
        component_status: fn::check_all_components(),
        data_consistency: fn::verify_data_consistency(),
        system_performance: fn::measure_system_performance(),
        error_rates: fn::analyze_error_rates(),
        recovery_metrics: fn::assess_recovery_metrics()
    };
};

-- Add Comprehensive Component Recovery
DEFINE FUNCTION fn::perform_component_recovery(
    $component_id: string,
    $error_type: string
) -> object {
    LET $component = (SELECT * FROM component_health WHERE id = $component_id);
    
    RETURN {
        recovery_plan: fn::generate_recovery_strategy($component, $error_type),
        execution_result: fn::execute_recovery_procedure($component),
        verification: fn::verify_recovery_success($component),
        state_restoration: fn::restore_component_state($component)
    };
};

-- Add indices for system resilience
DEFINE INDEX resilience_metrics ON system_resilience 
    FIELDS resilience_metrics.fault_tolerance, resilience_metrics.system_stability;
DEFINE INDEX recovery_points_temporal ON state_recovery 
    FIELDS recovery_points[*].timestamp;

// ...rest of existing code...

-- Enhanced Flow State Management with Human-Centric Recovery
DEFINE TABLE conversation_recovery SCHEMAFULL;
DEFINE FIELD recovery_scenario ON conversation_recovery TYPE object {
    trigger_event: string,  // What caused the need for recovery
    context_state: object {
        last_stable_point: record(context),
        interrupted_flow: record(conversation_flow),
        participant_states: array<object>
    },
    recovery_actions: array<object> {
        human_message: string,  // What to communicate to the human
        system_action: string,  // What the system should do
        fallback_options: array<string>  // Alternative approaches
    }
};

-- Example Recovery Scenarios:
DEFINE FIELD common_scenarios ON conversation_recovery TYPE array<object> {
    misunderstanding: {
        human_message: "I want to make sure I understood you correctly. You mentioned [previous_topic]. Could you clarify...?",
        system_action: "restore_last_clear_context",
        fallback_options: ["ask_for_confirmation", "suggest_alternative_topic"]
    },
    topic_deviation: {
        human_message: "Let's return to discussing [core_topic]. We were talking about...",
        system_action: "merge_relevant_context",
        fallback_options: ["summarize_discussion", "highlight_key_points"]
    },
    communication_gap: {
        human_message: "I noticed we haven't addressed [pending_point]. Should we cover that first?",
        system_action: "prioritize_pending_topics",
        fallback_options: ["reschedule_discussion", "modify_approach"]
    }
};

-- Add Graceful Recovery Function
DEFINE FUNCTION fn::handle_conversation_recovery(
    $context_id: string,
    $issue_type: string
) -> object {
    LET $context = (SELECT * FROM context WHERE id = $context_id);
    LET $flow = (SELECT * FROM conversation_flow WHERE context_ids CONTAINS $context_id);
    
    // Determine recovery approach
    LET $recovery_plan = {
        immediate_response: fn::generate_human_friendly_response($context, $issue_type),
        background_actions: fn::prepare_system_recovery($context, $flow),
        transition_strategy: fn::create_smooth_transition($context)
    };
    
    RETURN fn::execute_graceful_recovery($recovery_plan);
};
-- Layer 1: Active Flow Recovery (Real-time Corrections)
DEFINE TABLE active_flow_recovery SCHEMAFULL;
DEFINE FIELD flow_state ON active_flow_recovery TYPE object {
    current_point: record(context),
    active_participants: array<record(identity)>,
    understanding_metrics: object {
        client_clarity: float,
        agent_confidence: float,
        mutual_understanding: float
    },
    quick_recovery_options: array<object> {
        clarification_prompt: string,
        confirmation_check: string,
        gentle_redirect: string
    }
};

-- Layer 2: Context Chain Recovery (Recent History)
DEFINE TABLE chain_recovery_points SCHEMAFULL;
DEFINE FIELD chain_state ON chain_recovery_points TYPE object {
    last_stable_points: array<object> {
        context: record(context),
        confidence: float,
        agreed_facts: array<string>,
        timestamp: datetime
    },
    recovery_paths: array<object> {
        entry_point: string,
        transition_script: string,
        required_confirmations: array<string>
    }
};

-- Layer 3: Workflow Stage Recovery (Process Level)
DEFINE TABLE stage_recovery_system SCHEMAFULL;
DEFINE FIELD stage_checkpoints ON stage_recovery_system TYPE array<object> {
    stage_id: string,
    completion_state: object {
        verified_progress: float,
        confirmed_milestones: array<string>,
        stable_agreements: array<string>
    },
    rollback_options: array<object> {
        safe_point: record(context),
        recovery_script: string,
        required_validations: array<string>
    }
};

-- Layer 4: Montecristo System (Complete Reset)
DEFINE TABLE montecristo_recovery SCHEMAFULL;
DEFINE FIELD foundation_points ON montecristo_recovery TYPE array<object> {
    root_context: record(context),
    core_understanding: object {
        fundamental_needs: array<string>,
        verified_preferences: array<string>,
        key_constraints: array<string>
    },
    reset_strategy: object {
        reentry_script: string,
        trust_preservation: array<string>,
        relationship_maintenance: array<string>
    }
};

-- Recovery Coordinator Function
DEFINE FUNCTION fn::coordinate_recovery(
    $context_id: string,
    $issue_severity: float  // 0.0 to 1.0
) -> object {
    LET $context = (SELECT * FROM context WHERE id = $context_id);
    
    // Try each layer in sequence based on severity
    RETURN CASE
        WHEN $issue_severity < 0.25 THEN 
            fn::attempt_active_flow_recovery($context)
        WHEN $issue_severity < 0.5 THEN 
            fn::attempt_chain_recovery($context)
        WHEN $issue_severity < 0.75 THEN 
            fn::attempt_stage_recovery($context)
        ELSE 
            fn::execute_montecristo_recovery($context)
    END;
};

-- Layer-Specific Recovery Functions
DEFINE FUNCTION fn::attempt_active_flow_recovery(
    $context: object
) -> object {
    // Quick, real-time recovery attempt
    RETURN {
        recovery_type: 'active_flow',
        actions: [
            fn::generate_clarification($context),
            fn::check_understanding($context),
            fn::suggest_minor_redirect($context)
        ]
    };
};

DEFINE FUNCTION fn::attempt_chain_recovery(
    $context: object
) -> object {
    // Recent history-based recovery
    LET $chain = fn::get_relevant_chain($context);
    RETURN {
        recovery_type: 'chain',
        last_stable_point: fn::find_last_stable_point($chain),
        recovery_path: fn::generate_recovery_path($chain)
    };
};

DEFINE FUNCTION fn::attempt_stage_recovery(
    $context: object
) -> object {
    // Process-level recovery
    LET $stage = fn::get_current_stage($context);
    RETURN {
        recovery_type: 'stage',
        checkpoint: fn::find_last_checkpoint($stage),
        reset_plan: fn::generate_stage_reset($stage)
    };
};

DEFINE FUNCTION fn::execute_montecristo_recovery(
    $context: object
) -> object {
    // Complete reset to fundamental understanding
    RETURN {
        recovery_type: 'montecristo',
        foundation_point: fn::find_foundation_point($context),
        reset_strategy: fn::generate_complete_reset($context),
        trust_preservation: fn::generate_trust_maintenance_plan($context)
    };
};

-- Add Recovery Monitoring
DEFINE TABLE recovery_monitoring SCHEMAFULL;
DEFINE FIELD recovery_metrics ON recovery_monitoring TYPE object {
    success_rate: float,
    average_recovery_time: duration,
    client_satisfaction_post_recovery: float,
    trust_impact: float
};

-- Add Recovery Analytics
DEFINE FUNCTION fn::analyze_recovery_effectiveness(
    $context_id: string
) -> object {
    // Analyze recovery success and impact
    RETURN {
        recovery_success: fn::measure_recovery_success($context_id),
        trust_maintenance: fn::assess_trust_preservation($context_id),
        relationship_impact: fn::analyze_relationship_impact($context_id),
        learning_points: fn::extract_recovery_lessons($context_id)
    };
};
-- Conversation Version Control System
DEFINE TABLE conversation_version SCHEMAFULL;
DEFINE FIELD conversation_id ON conversation_version TYPE string;
DEFINE FIELD version_points ON conversation_version TYPE array<object> {
    version_id: string,
    timestamp: datetime,
    conversation_state: object {
        last_clear_understanding: object {
            context: record(context),
            confirmed_facts: array<string>,
            agreed_points: array<string>
        },
        participant_states: object {
            client_understanding: float,
            agent_understanding: float,
            mutual_agreement: float
        }
    },
    revert_options: array<object> {
        revert_point: string,
        clear_context: string,
        confirmation_needed: bool
    }
};

-- Live Rollback Function
DEFINE FUNCTION fn::rollback_to_clear_point(
    $conversation_id: string,
    $issue_point: datetime
) -> object {
    LET $conversation = (
        SELECT * FROM conversation_version 
        WHERE conversation_id = $conversation_id
    );
    
    // Find last clear understanding point before issue
    LET $rollback_point = (
        SELECT * FROM $conversation.version_points
        WHERE version_points.timestamp < $issue_point
        AND version_points.conversation_state.participant_states.mutual_agreement > 0.8
        ORDER BY version_points.timestamp DESC
        LIMIT 1
    );

    // Example usage:
    // Agent: "Let's go back to when we agreed on the viewing time..."
    // System: *rolls back to last clear understanding*
    // Agent: "You wanted to view the property on Tuesday, correct?"
    
    RETURN {
        rollback_state: $rollback_point.conversation_state,
        clear_context: $rollback_point.last_clear_understanding,
        reentry_point: fn::generate_reentry_point($rollback_point),
        transition_message: fn::generate_rollback_transition($rollback_point)
    };
};
