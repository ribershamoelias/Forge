
import { Logger } from './logger.js';
import { runCommand } from './exec.js';
import { execSync } from 'child_process';

export interface ToolInstallContext {
  os: string;
  pkg: string;
  dryRun: boolean;
}

const toolInstallers: Record<string, (ctx: ToolInstallContext) => Promise<'already' | true | false>> = {
  git: (ctx) => installViaPkg('git', ctx),
  node: (ctx) => installViaPkg('node', ctx),
  python: (ctx) => installViaPkg('python3', ctx),
  docker: (ctx) => installViaPkg('docker', ctx),
  zsh: (ctx) => installViaPkg('zsh', ctx),
};

async function installViaPkg(tool: string, ctx: ToolInstallContext): Promise<'already' | true | false> {
  let checkCmd = '';
  if (tool === 'python3' || tool === 'python') checkCmd = 'python3 --version';
  else checkCmd = `${tool} --version`;
  let alreadyInstalled = false;
  try {
    execSync(checkCmd, { stdio: 'ignore' });
    alreadyInstalled = true;
  } catch {}
  if (alreadyInstalled) {
    return 'already';
  }
  let cmd = '';
  if (ctx.pkg === 'brew') cmd = `brew install ${tool}`;
  else if (ctx.pkg === 'apt') cmd = `sudo apt-get update && sudo apt-get install -y ${tool}`;
  else if (ctx.pkg === 'pacman') cmd = `sudo pacman -Sy --noconfirm ${tool}`;
  else throw new Error('Unsupported package manager');
  try {
    execSync(cmd, { stdio: 'pipe' });
    return true;
  } catch (e: any) {
    const msg = e?.stdout?.toString() || e?.message || '';
    if (/already installed|already exists|is already installed/i.test(msg)) {
      return 'already';
    }
    return false;
  }
}

export async function installTool(tool: string, ctx: ToolInstallContext): Promise<'already' | true | false> {
  if (toolInstallers[tool]) {
    return await toolInstallers[tool](ctx);
  } else {
    Logger.warn(`No installer for tool: ${tool}`);
    return false;
  }
}
