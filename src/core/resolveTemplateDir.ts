
import path from 'path';

/**
 * Resolve the absolute path to a template directory by name.
 * Always uses __dirname for compatibility with CommonJS builds.
 */
export function resolveTemplateDir(templateName: string): string {
  return path.resolve(__dirname, '../../templates', templateName);
}
