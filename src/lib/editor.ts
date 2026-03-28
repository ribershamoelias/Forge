import { Logger } from './logger.js';
import { execSync } from 'child_process';

export async function setupEditor(editorConfig: any, dryRun: boolean) {
  if (editorConfig.name !== 'vscode') {
    Logger.warn('Only VS Code is supported for now.');
    return;
  }
  // Check if VS Code is already installed
  let vsCodeInstalled = false;
  if (process.platform === 'darwin') {
    // Check for app bundle
    try {
      execSync('test -d "/Applications/Visual Studio Code.app"');
      vsCodeInstalled = true;
    } catch {}
  } else if (process.platform === 'linux') {
    try {
      execSync('command -v code');
      vsCodeInstalled = true;
    } catch {}
  }
  if (vsCodeInstalled) {
    Logger.success('VS Code already installed');
  } else {
    let cmd = '';
    if (process.platform === 'darwin') {
      cmd = 'brew install --cask visual-studio-code';
    } else if (process.platform === 'linux') {
      cmd = 'sudo snap install --classic code || sudo apt-get install -y code';
    }
    if (dryRun) {
      Logger.info(`[dry-run] Would run: ${cmd}`);
    } else {
      try {
        // Suppress brew warnings by capturing output
        execSync(cmd, { stdio: 'pipe' });
        Logger.success('VS Code installed');
      } catch (e: any) {
        // If already installed, treat as success
        const msg = e?.stdout?.toString() || e?.message || '';
        if (/already installed|already exists|is already installed/i.test(msg)) {
          Logger.success('VS Code already installed');
        } else {
          Logger.error('Failed to install VS Code', [
            'Check your internet connection',
            'Try manually: brew install --cask visual-studio-code'
          ]);
        }
      }
    }
  }
  // Install extensions
  for (const ext of editorConfig.extensions || []) {
    let extInstalled = false;
    if (!dryRun) {
      try {
        // Check if extension is already installed
        const list = execSync('code --list-extensions', { encoding: 'utf8' });
        if (list.split('\n').includes(ext)) {
          extInstalled = true;
        }
      } catch {}
    }
    if (dryRun) {
      Logger.info(`[dry-run] Would run: code --install-extension ${ext}`);
    } else if (extInstalled) {
      Logger.success(`Extension ${ext} already installed`);
    } else {
      try {
        // Suppress warnings by capturing output
        execSync(`code --install-extension ${ext}`, { stdio: 'pipe' });
        Logger.success(`Extension ${ext} installed`);
      } catch (e: any) {
        const msg = e?.stdout?.toString() || e?.message || '';
        if (/already installed|already exists|is already installed/i.test(msg)) {
          Logger.success(`Extension ${ext} already installed`);
        } else {
          Logger.error(`Failed to install extension ${ext}`, [
            'Check your internet connection',
            `Try manually: code --install-extension ${ext}`
          ]);
        }
      }
    }
  }
}
