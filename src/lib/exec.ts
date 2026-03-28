import { Logger } from './logger.js';
import { execSync } from 'child_process';

export interface RunCommandOptions {
  dryRun?: boolean;
  stdio?: 'inherit' | 'pipe' | 'ignore';
  cwd?: string;
}

export function runCommand(command: string, options: RunCommandOptions = {}): boolean {
  // Only log command if verbose
  const verbose = process.env.FORGE_VERBOSE === '1' || options.stdio === 'inherit';
  if (verbose) {
    Logger.info(`${options.dryRun ? '[dry-run] ' : ''}Running: ${command}`);
  }
  if (options.dryRun) return true;
  try {
    execSync(command, { stdio: verbose ? 'inherit' : 'pipe', cwd: options.cwd });
    return true;
  } catch (e: any) {
    Logger.error(`Command failed: ${command}`, [
      'Check your internet connection',
      'Try running the command manually for more details.'
    ]);
    if (!verbose && e?.stdout) {
      Logger.info(e.stdout.toString());
    }
    if (!verbose && e?.stderr) {
      Logger.info(e.stderr.toString());
    }
    return false;
  }
}
