
import { Logger } from './logger.js';
import fs from 'fs-extra';
import os from 'os';
import path from 'path';

function detectUserShell(): 'zsh' | 'bash' {
  const shellEnv = process.env.SHELL || '';
  if (shellEnv.includes('zsh')) return 'zsh';
  if (shellEnv.includes('bash')) return 'bash';
  // Fallback: check for .zshrc, then .bashrc
  const home = os.homedir();
  if (fs.existsSync(path.join(home, '.zshrc'))) return 'zsh';
  if (fs.existsSync(path.join(home, '.bashrc'))) return 'bash';
  return 'zsh'; // Default to zsh
}

function ensureLineInFile(filePath: string, line: string) {
  const content = fs.existsSync(filePath) ? fs.readFileSync(filePath, 'utf8') : '';
  if (!content.includes(line)) {
    fs.appendFileSync(filePath, line + '\n');
  }
}

export async function setupTerminal(terminalConfig: any, dryRun: boolean) {
  const shell = terminalConfig.shell || detectUserShell();
  const home = os.homedir();
  const rcFile = shell === 'zsh' ? '.zshrc' : '.bashrc';
  const rcPath = path.join(home, rcFile);

  // Backup
  if (!dryRun && fs.existsSync(rcPath)) {
    fs.copySync(rcPath, rcPath + '.forge.bak');
    Logger.info(`Backed up ${rcFile} to ${rcFile}.forge.bak`);
  }

  // Add aliases (idempotent)
  const aliases = terminalConfig.aliases || {};
  for (const [k, v] of Object.entries(aliases)) {
    const aliasLine = `alias ${k}='${v}'`;
    if (dryRun) {
      Logger.info(`[dry-run] Would add alias to ${rcFile}: ${aliasLine}`);
    } else {
      ensureLineInFile(rcPath, aliasLine);
      Logger.success(`Alias added: ${aliasLine}`);
    }
  }

  // Add PATH handling if specified
  if (terminalConfig.PATH && typeof terminalConfig.PATH === 'string') {
    const exportLine = `export PATH="${terminalConfig.PATH}:$PATH"`;
    if (dryRun) {
      Logger.info(`[dry-run] Would add to PATH in ${rcFile}: ${exportLine}`);
    } else {
      ensureLineInFile(rcPath, exportLine);
      Logger.success(`PATH updated in ${rcFile}`);
    }
  }

  Logger.info(`Terminal configuration complete for ${rcFile}`);
}
