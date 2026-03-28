import fs from 'fs-extra';
import path from 'path';

export function loadConfig() {
  const configPath = path.resolve(process.cwd(), 'forge.json');
  if (!fs.existsSync(configPath)) throw new Error('forge.json not found');
  return fs.readJsonSync(configPath);
}

export function mergePreset(config: any, presetName: string) {
  const presetPath = path.resolve(process.cwd(), 'presets', `${presetName}.json`);
  if (!fs.existsSync(presetPath)) throw new Error(`Preset ${presetName} not found`);
  const preset = fs.readJsonSync(presetPath);
  return { ...config, ...preset };
}
