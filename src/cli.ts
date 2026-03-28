
import { Command } from 'commander';
// ...existing imports...
import { runSetup } from './core/setup.js';
import { runDoctor } from './core/doctor.js';
import { runClean } from './core/clean.js';
import { runList } from './core/list.js';
import { runInit } from './core/init.js';
import { Logger, setLogLevel } from './lib/logger.js';
import { saveProfile, applyProfile, listProfiles } from './core/profile.js';

const { version } = require('../package.json');
const program = new Command();

const profile = program.command('profile').description('Manage Forge profiles');

profile
  .command('save <name>')
  .description('Save current environment as a profile')
  .action(async (name, opts, cmd) => {
    const parent = cmd.parent?.parent || program;
    if (parent.opts().silent) setLogLevel('silent');
    if (parent.opts().verbose) setLogLevel('verbose');
    await saveProfile(name);
  });

program
  .command('init')
  .description('Initialize Forge in this project')
  .action(async () => {
    try {
      await runInit();
    } catch (err) {
      const msg = (err && typeof err === 'object' && 'message' in err) ? (err as any).message : String(err);
      Logger.error('✖ Failed to initialize Forge', [msg]);
    }
  });

profile
  .command('apply <name>')
  .description('Apply a saved profile')
  .action(async (name, opts, cmd) => {
    const parent = cmd.parent?.parent || program;
    if (parent.opts().silent) setLogLevel('silent');
    if (parent.opts().verbose) setLogLevel('verbose');
    await applyProfile(name);
  });

profile
  .command('list')
  .description('List available profiles')
  .action((opts, cmd) => {
    const parent = cmd.parent?.parent || program;
    if (parent.opts().silent) setLogLevel('silent');
    if (parent.opts().verbose) setLogLevel('verbose');
    listProfiles();
  });



program
  .name('forge')
  .description('The standard way developers set up their machines.')
  .version(version)
  .option('--silent', 'Suppress all output except errors')
  .option('--verbose', 'Show verbose/debug output');


program
  .command('setup')
  .description('Set up your developer environment')
  .option('--preset <name>', 'Use a preset')
  .option('--dry-run', 'Show what would be done, but don\'t make changes')
  .action(async (opts, cmd) => {
    const parent = cmd.parent || program;
    if (parent.opts().silent) setLogLevel('silent');
    if (parent.opts().verbose) setLogLevel('verbose');
    await runSetup({ ...opts, silent: parent.opts().silent, verbose: parent.opts().verbose });
  });


program
  .command('doctor')
  .description('Check your system for issues')
  .option('--fix', 'Automatically fix issues')
  .action(async (opts, cmd) => {
    const parent = cmd.parent || program;
    if (parent.opts().silent) setLogLevel('silent');
    if (parent.opts().verbose) setLogLevel('verbose');
    await runDoctor({ fix: opts.fix });
  });


program
  .command('clean')
  .description('Remove unused tools')
  .action((opts, cmd) => {
    const parent = cmd.parent || program;
    if (parent.opts().silent) setLogLevel('silent');
    if (parent.opts().verbose) setLogLevel('verbose');
    runClean();
  });


program
  .command('list')
  .description('List installed tools')
  .action((opts, cmd) => {
    const parent = cmd.parent || program;
    if (parent.opts().silent) setLogLevel('silent');
    if (parent.opts().verbose) setLogLevel('verbose');
    runList();
  });

program.parseAsync(process.argv).catch((err) => {
  Logger.error(err.message);
  process.exit(1);
});
