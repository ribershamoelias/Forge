
import inquirer from 'inquirer';
import fs from 'fs/promises';
import fsSync from 'fs';
import path from 'path';
import ora from 'ora';
import chalk from 'chalk';
import { Logger } from '../lib/logger.js';
import { copyTemplate } from './copyTemplate.js';
import { resolveTemplateDir } from './resolveTemplateDir.js';
import { runCommand } from '../lib/exec.js';

// (removed duplicate/broken detectPackageManager)

function detectPackageManager(projectPath: string): 'npm' | 'yarn' | 'pnpm' {
  if (fsSync.existsSync(path.join(projectPath, 'pnpm-lock.yaml'))) return 'pnpm';
  if (fsSync.existsSync(path.join(projectPath, 'yarn.lock'))) return 'yarn';
  return 'npm';
}

function isGitRepo(dir: string): boolean {
  return fsSync.existsSync(path.join(dir, '.git'));
}

async function modifyPackageJson(dest: string, projectName: string) {
  const pkgPath = path.join(dest, 'package.json');
  try {
    const pkgRaw = await fs.readFile(pkgPath, 'utf8');
    const pkg = JSON.parse(pkgRaw);
    pkg.name = projectName.toLowerCase().replace(/\s+/g, '-');
    await fs.writeFile(pkgPath, JSON.stringify(pkg, null, 2) + '\n', 'utf8');
  } catch {
    // ignore if no package.json
  }
}

async function promptOverwrite(dir: string): Promise<boolean> {
  const { action } = await inquirer.prompt([
    {
      type: 'list',
      name: 'action',
      message: `Directory ${chalk.yellow(dir)} already exists. Overwrite?`,
      choices: [
        { name: 'Overwrite', value: 'overwrite' },
        { name: 'Cancel', value: 'cancel' },
      ],
    },
  ]);
  return action === 'overwrite';
}

export async function runInit(rawArgs?: string[]) {
  // Parse args: [projectName] [--template <name>] [--no-install] [--no-git]
  const argv = rawArgs || process.argv.slice(2);
  let projectName = '';
  let template = 'minimal';
  let install = true;
  let git = true;

  for (let i = 0; i < argv.length; i++) {
    const arg = argv[i];
    if (arg === 'init') continue;
    if (arg.startsWith('--template')) {
      template = argv[i + 1] || template;
      i++;
    } else if (arg === '--no-install') {
      install = false;
    } else if (arg === '--no-git') {
      git = false;
    } else if (!arg.startsWith('--') && !projectName) {
      projectName = arg;
    }
  }

  // Prompt for project name if not provided
  if (!projectName) {
    const { name } = await inquirer.prompt([
      {
        type: 'input',
        name: 'name',
        message: 'Project name:',
        validate: (input: string) => input ? true : 'Project name is required',
      },
    ]);
    projectName = name;
  }

  const projectPath = path.resolve(process.cwd(), projectName);
  if (fsSync.existsSync(projectPath)) {
    const ok = await promptOverwrite(projectName);
    if (!ok) {
      Logger.info('✖ Cancelled');
      process.exit(1);
    }
    await fs.rm(projectPath, { recursive: true, force: true });
  }

  // Template resolution
  let templateDir: string;
  if (template.startsWith('github:')) {
    Logger.error('Remote GitHub templates not yet supported.');
    process.exit(1);
  } else {
    templateDir = resolveTemplateDir(template);
    if (!fsSync.existsSync(templateDir)) {
      Logger.error(`Template "${template}" not found`);
      process.exit(1);
    }
  }

  // CLI UX
  const spinner = ora();
  try {
    spinner.start('Creating project directory...');
    await fs.mkdir(projectPath, { recursive: true });
    spinner.succeed(chalk.green('✔ Created project directory'));

    spinner.start('Copying template files...');
    await copyTemplate(templateDir, projectPath);
    await modifyPackageJson(projectPath, projectName);
    spinner.succeed(chalk.green('✔ Copied template'));

    if (git) {
      spinner.start('Initializing git...');
      if (!isGitRepo(projectPath)) {
        runCommand('git init', { cwd: projectPath });
        runCommand('git add .', { cwd: projectPath });
        runCommand('git commit -m "Initial commit"', { cwd: projectPath });
      }
      spinner.succeed(chalk.green('✔ Initialized git'));
    }

    if (install) {
      spinner.start('Installing dependencies...');
      const pkgManager = detectPackageManager(projectPath);
      let installCmd = pkgManager;
      if (pkgManager === 'npm') installCmd += ' install';
      else if (pkgManager === 'yarn') installCmd += '';
      else if (pkgManager === 'pnpm') installCmd += ' install';
      runCommand(installCmd, { cwd: projectPath, stdio: 'inherit' });
      spinner.succeed(chalk.green('✔ Installed dependencies'));
    }

    // Next-level UX
    spinner.succeed(chalk.green('✨ Forge Project Ready!'));
    Logger.info(`\n${chalk.bold('Next steps:')}\n  ${chalk.cyan(`cd ${projectName}`)}\n  ${chalk.cyan('npm run dev')}\n`);
  } catch (err: any) {
    spinner.fail(chalk.red('✖ Failed to scaffold project'));
    Logger.error(err.message || String(err), [
      'Check permissions or reinstall Forge',
    ]);
    process.exit(1);
  }
}
