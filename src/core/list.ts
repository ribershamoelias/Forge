
import { Logger } from '../lib/logger.js';
import { TOOL_VERSION_CHECKS, getToolVersion, compareVersions } from '../lib/version.js';

export function runList() {
  Logger.info('Listing installed tools:');
  for (const tool of TOOL_VERSION_CHECKS) {
    const { version, error } = getToolVersion(tool);
    if (error) {
      Logger.error(`${tool.name}: Not installed`);
      continue;
    }
    const cmp = compareVersions(version!, tool.recommended);
    if (cmp < 0) {
      Logger.warn(`${tool.name}: ${version} (outdated, recommended: ${tool.recommended})`);
    } else {
      Logger.success(`${tool.name}: ${version} (OK)`);
    }
  }
}
