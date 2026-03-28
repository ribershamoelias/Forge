
import { Logger } from '../lib/logger.js';
import { TOOL_VERSION_CHECKS, getToolVersion, compareVersions } from '../lib/version.js';
import { installTool, ToolInstallContext } from '../lib/tools.js';
import { detectOS, detectPackageManager } from '../lib/detect.js';

export async function runDoctor(opts?: { fix?: boolean }) {
  Logger.info('System Status:');
  let missing: string[] = [];
  let outdated: string[] = [];
  let ok: string[] = [];
  let fixed: string[] = [];
  let upgraded: string[] = [];
  const os = detectOS();
  const pkg = detectPackageManager();
  const ctx: ToolInstallContext = { os, pkg, dryRun: false };
  for (const tool of TOOL_VERSION_CHECKS) {
    const { version, error } = getToolVersion(tool);
    if (error) {
      Logger.error(`${tool.name} (missing)`, [
        `Try manually: install ${tool.name}`
      ]);
      missing.push(tool.name);
      if (opts?.fix) {
        Logger.info(`→ Installing ${tool.name}...`);
        const result = await installTool(tool.name, ctx);
        if (result === true || result === 'already') {
          Logger.success(`${tool.name} installed`);
          fixed.push(tool.name);
        } else {
          Logger.error(`Failed to install ${tool.name}`);
        }
      }
      continue;
    }
    const cmp = compareVersions(version!, tool.recommended);
    if (cmp < 0) {
      Logger.warn(`${tool.name} (${version}, outdated)`);
      outdated.push(tool.name);
      if (opts?.fix) {
        Logger.info(`→ Updating ${tool.name}...`);
        const result = await installTool(tool.name, ctx);
        if (result === true) {
          Logger.success(`${tool.name} updated`);
          upgraded.push(tool.name);
        } else if (result === 'already') {
          Logger.success(`${tool.name} already up to date`);
        } else {
          Logger.error(`Failed to update ${tool.name}`);
        }
      }
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
    if (!opts?.fix) {
      Logger.info('To fix, run: forge doctor --fix');
    }
  } else {
    Logger.success('All essential tools are installed and up to date!');
  }
  if (opts?.fix) {
    Logger.success('✔ System is now fully healthy');
    Logger.success(`${ok.length + fixed.length + upgraded.length} tools verified`);
    Logger.success(`${fixed.length + upgraded.length} fixed/updated`);
    Logger.success('0 warnings');
  }
}
