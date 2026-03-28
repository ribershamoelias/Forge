

import { execSync } from 'child_process';

export function detectOS(): 'macos' | 'linux' {
  const platform = process.platform;
  if (platform === 'darwin') return 'macos';
  if (platform === 'linux') return 'linux';
  console.error('Forge only supports macOS and Linux.');
  process.exit(1);
}

export function detectPackageManager(): 'brew' | 'apt' | 'pacman' {
  // Only support brew (macOS), apt/pacman (Linux)
  try {
    execSync('which brew', { stdio: 'ignore' });
    return 'brew';
  } catch {}
  try {
    execSync('which apt', { stdio: 'ignore' });
    return 'apt';
  } catch {}
  try {
    execSync('which pacman', { stdio: 'ignore' });
    return 'pacman';
  } catch {}
  console.error('No supported package manager found (brew, apt, pacman).');
  process.exit(1);
}
