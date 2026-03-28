

import { detectOS, detectPackageManager } from '../lib/detect.js';
import { loadConfig, mergePreset } from '../lib/config.js';
import { Logger } from '../lib/logger.js';
import { installTool, ToolInstallContext } from '../lib/tools.js';
import { setupEditor } from '../lib/editor.js';
import { setupTerminal } from '../lib/terminal.js';
import fs from 'fs-extra';

export async function runSetup(opts: { preset?: string; dryRun?: boolean }) {
  Logger.info('Forge setup (Unix-only)');
  const totalTimer = new Logger.Timer();
  let config = loadConfig();
  if (opts.preset) {
    config = mergePreset(config, opts.preset);
    Logger.info(`Using preset: ${opts.preset}`);
  }

  const os = detectOS();
  const pkg = detectPackageManager();
  const ctx: ToolInstallContext = { os, pkg, dryRun: !!opts.dryRun };

  const steps = [
    ...config.tools.map((tool: string) => ({ type: 'tool', name: tool })),
    { type: 'editor', name: 'Configuring editor' },
    { type: 'terminal', name: 'Configuring terminal' },
  ];
  const totalSteps = steps.length;
  const installed: string[] = [];
  const warnings: string[] = [];
  for (let i = 0; i < steps.length; i++) {
    const step = steps[i];
    const stepTimer = new Logger.Timer();
    if (step.type === 'tool') {
      Logger.step(`Installing ${step.name}`, i + 1, totalSteps);
      const ok = await installTool(step.name, ctx);
      if (ok) {
        Logger.success(`Installed ${step.name}`, stepTimer.elapsed());
        installed.push(step.name);
      } else {
        Logger.error(`Failed to install ${step.name}`, [
          'Check your internet connection',
          `Try manually: ${pkg} install ${step.name}`
        ]);
        warnings.push(step.name);
      }
    } else if (step.type === 'editor') {
      Logger.step('Configuring editor', i + 1, totalSteps);
      await setupEditor(config.editor, ctx.dryRun);
      Logger.success('Editor configured', stepTimer.elapsed());
    } else if (step.type === 'terminal') {
      Logger.step('Configuring terminal', i + 1, totalSteps);
      await setupTerminal(config.terminal, ctx.dryRun);
      Logger.success('Terminal configured', stepTimer.elapsed());
    }
  }
  // Final summary
  Logger.success(`Setup complete in ${totalTimer.elapsed()}`);
  if (installed.length) Logger.info(`Installed: ${installed.join(', ')}`);
  if (warnings.length) Logger.warn(`Warnings: ${warnings.length}`);
  // Smart suggestions
  if (!installed.length) {
    Logger.info('Tip: Try `forge setup --preset web-dev`');
  }
}

