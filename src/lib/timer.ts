export class Timer {
  private startTime: number;
  constructor() {
    this.startTime = Date.now();
  }
  elapsed(): string {
    const ms = Date.now() - this.startTime;
    if (ms < 1000) return `${ms}ms`;
    return `${(ms / 1000).toFixed(1)}s`;
  }
}
