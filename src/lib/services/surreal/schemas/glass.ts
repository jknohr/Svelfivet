// Glass configuration schema for SurrealDB

export const GLASS_SCHEMA = `
  -- Glass Configuration Table
  DEFINE TABLE glass_configs SCHEMAFULL
    PERMISSIONS 
      FOR select, create, update, delete 
      WHERE user = $auth.id;

  -- Glass Config Fields
  DEFINE FIELD base.blur ON glass_configs TYPE string;
  DEFINE FIELD base.opacity ON glass_configs TYPE float;
  DEFINE FIELD base.borderOpacity ON glass_configs TYPE float;
  DEFINE FIELD base.lightEffect ON glass_configs TYPE bool;
  DEFINE FIELD base.lightIntensity ON glass_configs TYPE float;
  DEFINE FIELD base.lightColor ON glass_configs TYPE string;
  DEFINE FIELD base.tint ON glass_configs TYPE string;
  DEFINE FIELD base.glowRadius ON glass_configs TYPE string;

  -- Glass States
  DEFINE FIELD states ON glass_configs TYPE object {
    focus: {
      opacity: float,
      borderOpacity: float
    },
    attention: {
      opacity: float,
      borderOpacity: float
    },
    error: {
      opacity: float,
      borderOpacity: float
    },
    success: {
      opacity: float,
      borderOpacity: float
    }
  };

  -- Glass Variants
  DEFINE FIELD variants ON glass_configs TYPE object {
    light: {
      opacity: float,
      blur: string
    },
    medium: {
      opacity: float,
      blur: string
    },
    heavy: {
      opacity: float,
      blur: string
    }
  };

  -- Metadata
  DEFINE FIELD created_at ON glass_configs TYPE datetime DEFAULT time::now();
  DEFINE FIELD updated_at ON glass_configs TYPE datetime DEFAULT time::now();
  DEFINE FIELD user ON glass_configs TYPE record(user_auth_index);
  DEFINE FIELD vista_id ON glass_configs TYPE string;
  DEFINE FIELD is_default ON glass_configs TYPE bool DEFAULT false;
`;
