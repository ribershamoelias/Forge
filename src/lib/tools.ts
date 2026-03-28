
import { Logger } from './logger.js';
import { runCommand } from './exec.js';
import { execSync } from 'child_process';

export interface ToolInstallContext {
  os: string;
  pkg: string;
  dryRun: boolean;
}

const toolInstallers: Record<string, (ctx: ToolInstallContext) => boolean> = {
  git: (ctx) => installViaPkg('git', ctx),
  node: (ctx) => installViaPkg('node', ctx),
  python: (ctx) => installViaPkg('python3', ctx),
  docker: (ctx) => installViaPkg('docker', ctx),
  zsh: (ctx) => installViaPkg('zsh', ctx),
};

function installViaPkg(tool: string, ctx: ToolInstallContext): boolean {
  // Check if tool is already installed
  let checkCmd = '';
  if (tool === 'python3' || tool === 'python') checkCmd = 'python3 --version';
  else checkCmd = `${tool} --version`;
  let alreadyInstalled = false;
  try {
    execSync(checkCmd, { stdio: 'ignore' });
    alreadyInstalled = true;
  } catch {}
  if (alreadyInstalled) {
    Logger.success(`${tool.replace('python3', 'python')} already installed`);
    return true;
  }
  let cmd = '';
  if (ctx.pkg === 'brew') cmd = `brew install ${tool}`;
  else if (ctx.pkg === 'apt') cmd = `sudo apt-get update && sudo apt-get install -y ${tool}`;
  else if (ctx.pkg === 'pacman') cmd = `sudo pacman -Sy --noconfirm ${tool}`;
  else throw new Error('Unsupported package manager');
  Logger.info(`Installing ${tool} using ${ctx.pkg}...`);
  try {
    // Suppress brew/apt/pacman warnings by capturing output
    execSync(cmd, { stdio: 'pipe' });
    Logger.success(`${tool.replace('python3', 'python')} installed`);
    return true;
  } catch (e: any) {
    const msg = e?.stdout?.toString() || e?.message || '';
    if (/already installed|already exists|is already installed/i.test(msg)) {
      Logger.success(`${tool.replace('python3', 'python')} already installed`);
      return true;
    }
    Logger.error(`Failed to install ${tool}: ${e}`);
    return false;
  }
}

export async function installTool(tool: string, ctx: ToolInstallContext): Promise<boolean> {
  if (toolInstallers[tool]) {
    return toolInstallers[tool](ctx);
  } else {
    Logger.warn(`No installer for tool: ${tool}`);
    return false;
  }
}
