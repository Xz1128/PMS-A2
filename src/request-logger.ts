/**
 * request-logger.ts — Dev Server Request Logger Middleware
 *
 * Logs every HTTP request to the terminal in a coloured, readable format:
 *   [GET]  /home              => 200 success  3ms
 *   [POST] /api/items         => 404 error   12ms
 */

/** ANSI colour codes for terminal output */
const colours = {
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  dim: '\x1b[2m',

  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  cyan: '\x1b[36m',
  magenta: '\x1b[35m',
  blue: '\x1b[34m',
  white: '\x1b[37m',

  bgGreen: '\x1b[42m',
  bgYellow: '\x1b[43m',
  bgRed: '\x1b[41m',
  bgCyan: '\x1b[46m',
};

/** Colour the HTTP method tag */
function methodColour(method: string): string {
  const m = method.toUpperCase();
  switch (m) {
    case 'GET':    return `${colours.bgGreen}${colours.bold} ${m}    ${colours.reset}`;
    case 'POST':   return `${colours.bgCyan}${colours.bold} ${m}   ${colours.reset}`;
    case 'PUT':    return `${colours.bgYellow}${colours.bold} ${m}    ${colours.reset}`;
    case 'DELETE': return `${colours.bgRed}${colours.bold} ${m} ${colours.reset}`;
    case 'PATCH':  return `${colours.bgYellow}${colours.bold} ${m}  ${colours.reset}`;
    default:       return `${colours.bold} ${m} ${colours.reset}`;
  }
}

/** Colour the status code */
function statusColour(status: number): string {
  if (status >= 200 && status < 300) return `${colours.green}${status} success${colours.reset}`;
  if (status >= 300 && status < 400) return `${colours.yellow}${status} redirect${colours.reset}`;
  if (status >= 400 && status < 500) return `${colours.red}${status} error${colours.reset}`;
  if (status >= 500)                 return `${colours.red}${colours.bold}${status} error${colours.reset}`;
  return `${status}`;
}

/** Format duration */
function durationColour(ms: number): string {
  if (ms < 10)  return `${colours.green}${ms}ms${colours.reset}`;
  if (ms < 100) return `${colours.yellow}${ms}ms${colours.reset}`;
  return `${colours.red}${ms}ms${colours.reset}`;
}

/** Get timestamp string */
function timestamp(): string {
  const now = new Date();
  const h = String(now.getHours()).padStart(2, '0');
  const m = String(now.getMinutes()).padStart(2, '0');
  const s = String(now.getSeconds()).padStart(2, '0');
  return `${colours.dim}${h}:${m}:${s}${colours.reset}`;
}

/**
 * Connect-compatible middleware function.
 * Angular's @angular/build:dev-server passes (req, res, next).
 */
export default function requestLogger(req: any, res: any, next: () => void): void {
  const start = Date.now();
  const method = req.method || 'GET';
  const url = req.originalUrl || req.url || '/';

  // Skip noisy internal Vite/HMR requests
  if (url.includes('__vite') || url.includes('/@') || url.includes('hot-update') || url.includes('sockjs-node')) {
    return next();
  }

  // Hook into response finish event to log after response is sent
  const originalEnd = res.end;
  res.end = function (...args: any[]) {
    const duration = Date.now() - start;
    const status = res.statusCode || 200;

    const line = `  ${timestamp()}  ${methodColour(method)} ${colours.white}${url.padEnd(40)}${colours.reset} => ${statusColour(status)}  ${durationColour(duration)}`;
    console.log(line);

    return originalEnd.apply(res, args);
  };

  next();
}
