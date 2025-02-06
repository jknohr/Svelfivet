import { parse } from 'yaml';
import type { SpatialUnitConfig } from '$lib/components/Utility/Grid/spatialUnitCalculator';

export interface LensConfig {
  lensDistortion: {
    k1: number;
    k2: number;
    centerOffset: {
      x: number;
      y: number;
    };
  };
  displayParams: {
    pixelDensity: number;
    panelResolution: {
      width: number;
      height: number;
    };
    physicalDimensions: {
      width: number;
      height: number;
    };
  };
}

export interface DeviceConfig {
  name: string;
  defaultConfig: LensConfig;
  [key: string]: any; // For additional configs like 'gaming', 'productivity'
}

export interface DevicesConfig {
  devices: {
    [key: string]: DeviceConfig;
  };
  defaultConfig: LensConfig;
}

let configCache: DevicesConfig | null = null;

/**
 * Load lens configuration for a specific device and mode
 */
export async function loadLensConfig(
  deviceId: string,
  mode: string = 'defaultConfig'
): Promise<LensConfig> {
  if (!configCache) {
    try {
      const response = await fetch('/src/lib/configs/devices/lens-configs.yaml');
      const yamlText = await response.text();
      configCache = parse(yamlText) as DevicesConfig;
    } catch (error) {
      console.error('Failed to load lens configurations:', error);
      return configCache?.defaultConfig ?? getDefaultConfig();
    }
  }

  const deviceConfig = configCache.devices[deviceId];
  if (!deviceConfig) {
    console.warn(`No configuration found for device: ${deviceId}, using default`);
    return configCache.defaultConfig;
  }

  const modeConfig = deviceConfig[mode];
  if (!modeConfig && mode !== 'defaultConfig') {
    console.warn(`No configuration found for mode: ${mode}, using device default`);
    return deviceConfig.defaultConfig;
  }

  return modeConfig ?? deviceConfig.defaultConfig;
}

/**
 * Get default lens configuration
 */
function getDefaultConfig(): LensConfig {
  return {
    lensDistortion: {
      k1: 0.1,
      k2: 0.035,
      centerOffset: { x: 0.003, y: 0.002 }
    },
    displayParams: {
      pixelDensity: 1000,
      panelResolution: { width: 2000, height: 2000 },
      physicalDimensions: { width: 0.0762, height: 0.0762 }
    }
  };
}

/**
 * Convert lens config to spatial unit config
 */
export function convertToSpatialConfig(
  lensConfig: LensConfig,
  baseConfig: Partial<SpatialUnitConfig>
): SpatialUnitConfig {
  return {
    ...baseConfig,
    lensDistortion: lensConfig.lensDistortion,
    displayParams: lensConfig.displayParams
  } as SpatialUnitConfig;
}
