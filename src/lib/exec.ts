import { Logger } from './logger.js';
import { execSync } from 'child_process';

export interface RunCommandOptions {
  dryRun?: boolean;
  stdio?: 'inherit' | 'pipe' | 'ignore';
  cwd?: string;
}

export function runCommand(command: string, options: RunCommandOptions = {}): boolean {
  Logger.info(`${options.dryRun ? '[dry-run] ' : ''}Running: ${command}`);
  if (options.dryRun) return true;
  try {
    execSync(command, { stdio: options.stdio || 'inherit', cwd: options.cwd });
    return true;
  } catch (e) {
    Logger.error(`✖ Command failed: ${command}\n${e}`);
    return false;
  }
}
