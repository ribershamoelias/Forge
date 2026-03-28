import * as inquirer from 'inquirer';
import fs from 'fs/promises';
import path from 'path';
import { Logger } from '../lib/logger.js';

interface PresetMap {
  backend: string;
  frontend: string;
  fullstack: string;
  minimal: string;
  [key: string]: string;
}

const PRESETS: PresetMap = {
  backend: 'presets/backend.json',
  frontend: 'presets/web-dev.json',
  fullstack: 'presets/minimal.json', // Placeholder, update if you have a fullstack preset
  minimal: 'presets/minimal.json',
};

async function loadPreset(presetKey: keyof PresetMap) {
  const presetPath = path.resolve(process.cwd(), PRESETS[presetKey]);
  const data = await fs.readFile(presetPath, 'utf8');
  return JSON.parse(data);
}

async function writeForgeJson(config: any) {
  const outPath = path.resolve(process.cwd(), 'forge.json');
  await fs.writeFile(outPath, JSON.stringify(config, null, 2) + '\n', 'utf8');
}

export async function runInit() {
  Logger.info('Welcome to Forge Init!');
  const { projectType, useDocker, installExtensions } = await (inquirer as any).prompt([
    {
      type: 'list',
      name: 'projectType',
      message: 'Select project type:',
      choices: [
        { name: 'Backend (Node)', value: 'backend' },
        { name: 'Frontend (React)', value: 'frontend' },
        { name: 'Fullstack', value: 'fullstack' },
        { name: 'Minimal', value: 'minimal' },
      ],
    },
    {
      type: 'confirm',
      name: 'useDocker',
      message: 'Use Docker?',
      default: false,
    },
    {
      type: 'confirm',
      name: 'installExtensions',
      message: 'Install VS Code extensions?',
      default: true,
    },
  ]);

  const preset = await loadPreset(projectType);
  const config = {
    ...preset,
    docker: useDocker,
    extensions: installExtensions,
  };
  await writeForgeJson(config);
  Logger.success('✔ Forge initialized successfully');
  Logger.info('ℹ Created forge.json');
  Logger.info('→ Run `forge setup` to install your environment');
}
