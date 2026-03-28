


import chalk from 'chalk';
import { Timer } from './timer.js';

type LogLevel = 'silent' | 'normal' | 'verbose';
let logLevel: LogLevel = 'normal';

export function setLogLevel(level: LogLevel) {
  logLevel = level;
}

function shouldLog(type: 'info' | 'step' | 'success' | 'warn' | 'error') {
  if (logLevel === 'silent') return type === 'error';
  if (logLevel === 'normal') return type !== 'info' || type === 'info';
  return true;
}

function icon(type: 'success' | 'error' | 'warn' | 'info') {
  switch (type) {
    case 'success': return chalk.green('✔');
    case 'error': return chalk.red('✖');
    case 'warn': return chalk.yellow('⚠');
    case 'info': return chalk.blue('ℹ');
  }
}

export class Logger {
  static info(msg: string) {
    if (!shouldLog('info')) return;
    console.log(`${icon('info')} ${msg}`);
  }
  static step(msg: string, current?: number, total?: number, timing?: string) {
    if (!shouldLog('step')) return;
    if (typeof current === 'number' && typeof total === 'number') {
      // Align step numbers for up to 99 steps
      const pad = (n: number) => n.toString().padStart(2, ' ');
      const time = timing ? chalk.gray(`(${timing})`) : '';
      console.log(chalk.cyan(`[${pad(current)}/${pad(total)}]`), msg, time);
    } else {
      console.log(chalk.cyan('→'), msg);
    }
  }
  static success(msg: string, timing?: string) {
    if (!shouldLog('success')) return;
    const time = timing ? chalk.gray(`(${timing})`) : '';
    console.log(`${icon('success')} ${msg} ${time}`.trim());
  }
  static warn(msg: string) {
    if (!shouldLog('warn')) return;
    console.log(`${icon('warn')} ${msg}`);
  }
  static error(msg: string, suggestions?: string[]) {
    if (!shouldLog('error')) return;
    // Only log the main error message, never stack traces or raw error objects
    console.error(`${icon('error')} ${msg}`);
    if (suggestions && suggestions.length) {
      for (const s of suggestions) {
        console.error(chalk.gray('→'), s);
      }
    }
  }
  static verbose(msg: string) {
    if (logLevel === 'verbose') {
      console.log(chalk.gray(msg));
    }
  }
  static Timer = Timer;
}
