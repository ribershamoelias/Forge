import fs from 'fs-extra';
import os from 'os';
import path from 'path';
import { Logger } from '../lib/logger.js';
import { TOOL_VERSION_CHECKS, getToolVersion, compareVersions } from '../lib/version.js';
import { installTool } from '../lib/tools.js';
import { setupTerminal } from '../lib/terminal.js';

const PROFILE_DIR = path.join(os.homedir(), '.forge', 'profiles');











function ensureProfileDir() {
  if (!fs.existsSync(PROFILE_DIR)) fs.mkdirpSync(PROFILE_DIR);
}

export async function saveProfile(name: string) {
  ensureProfileDir();
  Logger.info(`Saving profile: ${name}`);
  // Detect installed tools and versions
  const tools = TOOL_VERSION_CHECKS.map(tool => {
    const { version } = getToolVersion(tool);
    return { name: tool.name, version: version || null };
  });
  // Detect shell and aliases
  const shell = process.env.SHELL?.split('/').pop() || 'zsh';
  const rcFile = shell === 'zsh' ? '.zshrc' : '.bashrc';
  const rcPath = path.join(os.homedir(), rcFile);
  let aliases: Record<string, string> = {};
  if (fs.existsSync(rcPath)) {
    const content = fs.readFileSync(rcPath, 'utf8');
    const aliasLines = content.split('\n').filter(l => l.trim().startsWith('alias '));
    for (const line of aliasLines) {
      const match = line.match(/^alias (\w+)='(.+)'$/);
      if (match) aliases[match[1]] = match[2];
    }
  }
  const profile = {
    tools,
    terminal: {
      shell,
      aliases
    },
    created: new Date().toISOString()
  };
  const filePath = path.join(PROFILE_DIR, `${name}.json`);
  fs.writeJsonSync(filePath, profile, { spaces: 2 });
  Logger.success(`Profile saved: ${filePath}`);
}

export function listProfiles() {
  ensureProfileDir();
  const files = fs.readdirSync(PROFILE_DIR).filter(f => f.endsWith('.json'));
  if (!files.length) {
    Logger.info('No profiles found');
    Logger.info('→ Run `forge profile save <name>` to create one');
    return;
  }
  Logger.info('Available profiles:');
  for (const file of files) {
    const full = path.join(PROFILE_DIR, file);
    const data = fs.readJsonSync(full);
    Logger.info(`- ${file.replace('.json', '')} (created: ${data.created})`);
  }
}


export async function applyProfile(name: string) {
  ensureProfileDir();
  const filePath = path.join(PROFILE_DIR, `${name}.json`);
  if (!fs.existsSync(filePath)) {
    Logger.error(`Profile not found: ${name}`);
    return;
  }
  Logger.info(`Applying profile: ${name}`);
  const profile = fs.readJsonSync(filePath);

  // Step 1: Install missing tools
  Logger.step('Installing missing tools...', 1, 3);
  let allToolsOk = true;
  for (const tool of profile.tools) {
    // Find tool check definition
    const check = TOOL_VERSION_CHECKS.find(t => t.name === tool.name);
    if (!check) {
      Logger.warn(`Unknown tool in profile: ${tool.name}`);
      continue;
    }
    const { version: currentVersion, error } = getToolVersion(check);
    if (error) {
      // Not installed, install
      const ok = await installTool(tool.name, { os: os.platform(), pkg: detectPkgMgr(), dryRun: false });
      if (ok) {
        Logger.success(`${tool.name} installed`);
      } else {
        Logger.error(`Failed to install ${tool.name}`, [
          `Try manually: brew install ${tool.name}`
        ]);
        allToolsOk = false;
      }
    } else {
      // Already installed, check version
      Logger.success(`${tool.name} already installed`);
      if (tool.version && currentVersion && compareVersions(currentVersion, tool.version) !== 0) {
        Logger.warn(`${tool.name} version differs (profile: ${tool.version}, current: ${currentVersion})`);
      }
    }
  }

  // Step 2: Apply terminal config
  Logger.step('Configuring terminal...', 2, 3);
  try {
    await setupTerminal(profile.terminal, false);
    Logger.success('Aliases and terminal config applied');
  } catch (e: any) {
    Logger.error('Failed to apply terminal config', [e.message]);
    allToolsOk = false;
  }

  // Step 3: Finalizing
  Logger.step('Finalizing...', 3, 3);
  if (allToolsOk) {
    Logger.success('Profile applied successfully');
  } else {
    Logger.warn('Profile applied with some issues. See above.');
  }
}

// Helper to detect package manager (reuse from setup if possible)
function detectPkgMgr(): string {
  // Simple detection for demo; in real code, reuse detectPackageManager from setup
  if (fs.existsSync('/opt/homebrew/bin/brew') || fs.existsSync('/usr/local/bin/brew')) return 'brew';
  if (fs.existsSync('/usr/bin/apt')) return 'apt';
  if (fs.existsSync('/usr/bin/pacman')) return 'pacman';
  return 'brew';
}
