import fs from 'fs/promises';
import fsSync from 'fs';
import path from 'path';

/**
 * Recursively copy a directory or file from src to dest.
 * Overwrites files if they exist.
 */
export async function copyTemplate(src: string, dest: string) {
  const stat = await fs.lstat(src);
  if (stat.isDirectory()) {
    await fs.mkdir(dest, { recursive: true });
    const entries = await fs.readdir(src);
    for (const entry of entries) {
      const srcPath = path.join(src, entry);
      const destPath = path.join(dest, entry);
      await copyTemplate(srcPath, destPath);
    }
  } else {
    await fs.copyFile(src, dest);
  }
}
