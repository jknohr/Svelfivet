-- Define the node table with temporal support
DEFINE TABLE node SCHEMAFULL
  PERMISSIONS 
    FOR select, create, update, delete FULL;

-- ALL Node fields from the Node interface
DEFINE FIELD id ON node TYPE string;
DEFINE FIELD rotation ON node TYPE float DEFAULT 0;
DEFINE FIELD position ON node TYPE object {
    x: float,
    y: float
};
DEFINE FIELD moving ON node TYPE bool DEFAULT false;
DEFINE FIELD label ON node TYPE string;
DEFINE FIELD dimensions ON node TYPE object {
    width: float,
    height: float
};
DEFINE FIELD inputs ON node TYPE int DEFAULT 0;
DEFINE FIELD outputs ON node TYPE int DEFAULT 0;
DEFINE FIELD group ON node TYPE option<string>;
DEFINE FIELD collapsed ON node TYPE bool DEFAULT false;
DEFINE FIELD resizingWidth ON node TYPE bool DEFAULT false;
DEFINE FIELD resizingHeight ON node TYPE bool DEFAULT false;
DEFINE FIELD rotating ON node TYPE bool DEFAULT false;
DEFINE FIELD editable ON node TYPE bool DEFAULT true;
DEFINE FIELD locked ON node TYPE bool DEFAULT false;
DEFINE FIELD resizable ON node TYPE bool DEFAULT true;
DEFINE FIELD zIndex ON node TYPE int DEFAULT 1;
DEFINE FIELD edge ON node TYPE option<string>;  -- Store component name as string
DEFINE FIELD direction ON node TYPE string DEFAULT 'TD' ASSERT $value INSIDE ['TD', 'LR'];
DEFINE FIELD borderRadius ON node TYPE float DEFAULT 0;
DEFINE FIELD borderWidth ON node TYPE float DEFAULT 1;
DEFINE FIELD connections ON node TYPE array;  -- Store array of connection IDs
DEFINE FIELD bgColor ON node TYPE option<string>;
DEFINE FIELD borderColor ON node TYPE option<string>;
DEFINE FIELD selectionColor ON node TYPE option<string>;
DEFINE FIELD textColor ON node TYPE option<string>;

-- Tree-specific properties
DEFINE FIELD expanded ON node TYPE bool DEFAULT false;
DEFINE FIELD children ON node TYPE array<string>;  -- Store array of node IDs
DEFINE FIELD internalTree ON node TYPE array<string>;  -- Store array of node IDs
DEFINE FIELD level ON node TYPE option<int>;
DEFINE FIELD order ON node TYPE option<int>;
DEFINE FIELD parent ON node TYPE option<string>;

-- Database metadata
DEFINE FIELD created_at ON node TYPE datetime DEFAULT time::now();
DEFINE FIELD updated_at ON node TYPE datetime DEFAULT time::now();
DEFINE FIELD version ON node TYPE int DEFAULT 1;

-- Define the anchor table
DEFINE TABLE anchor SCHEMAFULL
  PERMISSIONS 
    FOR select, create, update, delete FULL;

DEFINE FIELD id ON anchor TYPE string;
DEFINE FIELD node_id ON anchor TYPE record(node);
DEFINE FIELD type ON anchor TYPE string ASSERT $value INSIDE ['input', 'output'];
DEFINE FIELD index ON anchor TYPE int;
DEFINE FIELD position ON anchor TYPE object {
    x: float,
    y: float
};
DEFINE FIELD direction ON anchor TYPE string ASSERT $value INSIDE ['north', 'south', 'east', 'west'];
DEFINE FIELD connections ON anchor TYPE array;  -- Store array of edge IDs
DEFINE FIELD created_at ON anchor TYPE datetime DEFAULT time::now();
DEFINE FIELD updated_at ON anchor TYPE datetime DEFAULT time::now();

-- Define the edge table with ALL connection data
DEFINE TABLE edge SCHEMAFULL
  PERMISSIONS 
    FOR select, create, update, delete FULL;

DEFINE FIELD id ON edge TYPE string;
DEFINE FIELD from_node ON edge TYPE record(node);
DEFINE FIELD to_node ON edge TYPE record(node);
DEFINE FIELD from_anchor ON edge TYPE record(anchor);
DEFINE FIELD to_anchor ON edge TYPE record(anchor);
DEFINE FIELD label ON edge TYPE option<string>;
DEFINE FIELD style ON edge TYPE string DEFAULT 'solid' ASSERT $value INSIDE ['solid', 'dashed', 'dotted'];
DEFINE FIELD color ON edge TYPE option<string>;
DEFINE FIELD width ON edge TYPE float DEFAULT 1;
DEFINE FIELD type ON edge TYPE string;  -- Store edge type
DEFINE FIELD data ON edge TYPE object;  -- Store additional edge data
DEFINE FIELD created_at ON edge TYPE datetime DEFAULT time::now();
DEFINE FIELD updated_at ON edge TYPE datetime DEFAULT time::now();

-- Graph relationships for tree structure
DEFINE TABLE node_relationship SCHEMAFULL
  PERMISSIONS 
    FOR select, create, update, delete FULL;

DEFINE FIELD id ON node_relationship TYPE string;
DEFINE FIELD from_node ON node_relationship TYPE record(node);
DEFINE FIELD to_node ON node_relationship TYPE record(node);
DEFINE FIELD type ON node_relationship TYPE string DEFAULT 'parent' ASSERT $value INSIDE ['parent', 'reference'];
DEFINE FIELD created_at ON node_relationship TYPE datetime DEFAULT time::now();

-- Graph queries
DEFINE ANALYZER get_complete_graph {
    SELECT *,
           ->edge->node as connected_nodes,
           ->node_relationship->node as related_nodes,
           ->anchor as anchors
    FROM node
    FETCH parent, children, internalTree;
}

-- Get node with all its relationships
DEFINE ANALYZER get_node_complete {
    SELECT *,
           ->edge as out_edges,
           <-edge as in_edges,
           ->anchor as anchors,
           ->node_relationship as relationships
    FROM node
    WHERE id = $node_id
    FETCH parent, children, internalTree;
}

-- Temporal queries
DEFINE ANALYZER node_history {
    SELECT * FROM node VERSION SINCE $start UNTIL $end;
}

DEFINE ANALYZER node_at_time {
    SELECT * FROM node VERSION AT $timestamp;
}

-- Indexes for faster lookups
DEFINE INDEX node_parent ON node FIELDS parent;
DEFINE INDEX node_children ON node FIELDS children;
DEFINE INDEX node_internal_tree ON node FIELDS internalTree;
DEFINE INDEX edge_nodes ON edge FIELDS from_node, to_node;
DEFINE INDEX anchor_node ON anchor FIELDS node_id; 