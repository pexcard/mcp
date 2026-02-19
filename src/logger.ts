function log(level: string, message: string, data?: Record<string, unknown>): void {
  const entry = JSON.stringify({ ts: new Date().toISOString(), level, message, ...data });
  process.stderr.write(entry + "\n");
}

export const logger = {
  debug: (msg: string, data?: Record<string, unknown>) => log("DEBUG", msg, data),
  info: (msg: string, data?: Record<string, unknown>) => log("INFO", msg, data),
  warn: (msg: string, data?: Record<string, unknown>) => log("WARN", msg, data),
  error: (msg: string, data?: Record<string, unknown>) => log("ERROR", msg, data),
};
