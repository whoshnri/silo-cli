export class Spinner {
  private message: string;
  private intervalId: any = null;
  private frames = ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"];
  private frameIndex = 0;

  constructor(options: { message: string }) {
    this.message = options.message;
  }

  start() {
    if (this.intervalId !== null) return;
    try {
      Deno.stdout.writeSync(new TextEncoder().encode("\x1b[?25l"));
    } catch (_) {}
    
    this.intervalId = setInterval(() => {
      const frame = this.frames[this.frameIndex];
      this.frameIndex = (this.frameIndex + 1) % this.frames.length;
      try {
        Deno.stdout.writeSync(new TextEncoder().encode(`\r  ${frame} ${this.message}`));
      } catch (_) {}
    }, 80);
  }

  stop() {
    if (this.intervalId === null) return;
    clearInterval(this.intervalId);
    this.intervalId = null;
    try {
      Deno.stdout.writeSync(new TextEncoder().encode("\r\x1b[K\x1b[?25h"));
    } catch (_) {}
  }
}

export const useDynamicSpinner = (message: string) => {
  return new Spinner({
    message: message,
  });
};
