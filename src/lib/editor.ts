import { Logger } from './logger.js';
import { execSync } from 'child_process';

export async function setupEditor(editorConfig: any, dryRun: boolean) {
  if (editorConfig.name !== 'vscode') {
    Logger.warn('Only VS Code is supported for now.');
    return;
  }
  // Install VS Code
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
      execSync(cmd, { stdio: 'inherit' });
      Logger.success('VS Code installed.');
    } catch (e) {
      Logger.error(`Failed to install VS Code: ${e}`);
    }
  }
  // Install extensions
  for (const ext of editorConfig.extensions || []) {
    const extCmd = `code --install-extension ${ext}`;
    if (dryRun) {
      Logger.info(`[dry-run] Would run: ${extCmd}`);
    } else {
      try {
        execSync(extCmd, { stdio: 'inherit' });
        Logger.success(`Extension ${ext} installed.`);
      } catch (e) {
        Logger.error(`Failed to install extension ${ext}: ${e}`);
      }
    }
  }
}
