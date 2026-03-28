
import { Logger } from '../lib/logger.js';

export function runDoctor() {
  Logger.info('System Status:');
  let missing: string[] = [];
  let outdated: string[] = [];
  let ok: string[] = [];
  for (const tool of TOOL_VERSION_CHECKS) {
    const { version, error } = getToolVersion(tool);
    if (error) {
      Logger.error(`${tool.name} (missing)`);
      missing.push(tool.name);
      continue;
    }
    const cmp = compareVersions(version!, tool.recommended);
    if (cmp < 0) {
      Logger.warn(`${tool.name} (${version}, outdated)`);
      outdated.push(tool.name);
    } else {
      Logger.success(`${tool.name} (${version})`);
      ok.push(tool.name);
    }
  }
  Logger.info('');
  if (missing.length || outdated.length) {
    Logger.warn('Some issues detected.');
    if (missing.length) Logger.error(`Missing: ${missing.join(', ')}`);
    if (outdated.length) Logger.warn(`Outdated: ${outdated.join(', ')}`);
    Logger.info('To fix, run: forge setup --preset web-dev');
  } else {
    Logger.success('All essential tools are installed and up to date!');
  }
}
