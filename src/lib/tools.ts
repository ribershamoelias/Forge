
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
  let cmd = '';
  if (ctx.pkg === 'brew') cmd = `brew install ${tool}`;
  else if (ctx.pkg === 'apt') cmd = `sudo apt-get update && sudo apt-get install -y ${tool}`;
  else if (ctx.pkg === 'pacman') cmd = `sudo pacman -Sy --noconfirm ${tool}`;
  else throw new Error('Unsupported package manager');
  Logger.info(`Installing ${tool} using ${ctx.pkg}...`);
  return runCommand(cmd, { dryRun: ctx.dryRun });
}

export async function installTool(tool: string, ctx: ToolInstallContext): Promise<boolean> {
  if (toolInstallers[tool]) {
    return toolInstallers[tool](ctx);
  } else {
    Logger.warn(`No installer for tool: ${tool}`);
    return false;
  }
}
