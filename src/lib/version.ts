import { execSync } from 'child_process';

export interface ToolVersionCheck {
  name: string;
  command: string;
  parse: (output: string) => string | null;
  recommended: string;
}

export const TOOL_VERSION_CHECKS: ToolVersionCheck[] = [
  {
    name: 'git',
    command: 'git --version',
    parse: (out) => /git version ([\d.]+)/.exec(out)?.[1] || null,
    recommended: '2.30.0',
  },
  {
    name: 'node',
    command: 'node --version',
    parse: (out) => /v([\d.]+)/.exec(out)?.[1] || null,
    recommended: '18.0.0',
  },
  {
    name: 'python',
    command: 'python3 --version',
    parse: (out) => /Python ([\d.]+)/.exec(out)?.[1] || null,
    recommended: '3.9.0',
  },
];

export function getToolVersion(tool: ToolVersionCheck): { version: string | null; error?: string } {
  try {
    const output = execSync(tool.command, { encoding: 'utf8' });
    const version = tool.parse(output);
    return { version };
  } catch (e: any) {
    return { version: null, error: e.message };
  }
}

export function compareVersions(a: string, b: string): number {
  // returns -1 if a < b, 0 if equal, 1 if a > b
  const pa = a.split('.').map(Number);
  const pb = b.split('.').map(Number);
  for (let i = 0; i < Math.max(pa.length, pb.length); i++) {
    const na = pa[i] || 0;
    const nb = pb[i] || 0;
    if (na < nb) return -1;
    if (na > nb) return 1;
  }
  return 0;
}
