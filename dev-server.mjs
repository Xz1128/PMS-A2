/**
 * dev-server.mjs — Development Proxy Server with Request Logging
 *
 * Starts ng serve in the background, then proxies all requests through
 * a logging layer that prints coloured request info to the terminal:
 *
 *   18:30:05  [GET]    /home                   => 200 success  3ms
 *   18:30:06  [POST]   /api/items              => 404 error   12ms
 */

import http from 'node:http';
import { spawn } from 'node:child_process';

// ─── Config ───────────────────────────────────────────────
const PROXY_PORT = 4200;    // Port this logger proxy runs on
const NG_PORT    = 4201;    // Port ng serve runs on (internal)

// ─── ANSI Colour Codes ───────────────────────────────────
const C = {
  reset:   '\x1b[0m',
  bold:    '\x1b[1m',
  dim:     '\x1b[2m',
  green:   '\x1b[32m',
  yellow:  '\x1b[33m',
  red:     '\x1b[31m',
  cyan:    '\x1b[36m',
  magenta: '\x1b[35m',
  blue:    '\x1b[34m',
  white:   '\x1b[37m',
  grey:    '\x1b[90m',
  bgGreen: '\x1b[42m',
  bgCyan:  '\x1b[46m',
  bgYellow:'\x1b[43m',
  bgRed:   '\x1b[41m',
  bgBlue:  '\x1b[44m',
  bgWhite: '\x1b[47m',
  bgMagenta:'\x1b[45m',
};

// ─── Formatting Helpers ──────────────────────────────────
function methodTag(m) {
  switch (m) {
    case 'GET':    return `${C.bgGreen}${C.bold}${C.white}  GET    ${C.reset}`;
    case 'POST':   return `${C.bgCyan}${C.bold}${C.white}  POST   ${C.reset}`;
    case 'PUT':    return `${C.bgYellow}${C.bold}${C.white}  PUT    ${C.reset}`;
    case 'DELETE': return `${C.bgRed}${C.bold}${C.white}  DELETE ${C.reset}`;
    case 'PATCH':  return `${C.bgMagenta}${C.bold}${C.white}  PATCH  ${C.reset}`;
    case 'OPTIONS':return `${C.bgBlue}${C.bold}${C.white}  OPTS   ${C.reset}`;
    default:       return `${C.bgWhite}${C.bold}  ${m.padEnd(6)}${C.reset}`;
  }
}

function statusText(code) {
  if (code >= 200 && code < 300) return `${C.green}${code} success${C.reset}`;
  if (code >= 300 && code < 400) return `${C.cyan}${code} redirect${C.reset}`;
  if (code >= 400 && code < 500) return `${C.red}${code} error${C.reset}`;
  if (code >= 500)               return `${C.bgRed}${C.white} ${code} error ${C.reset}`;
  return `${code}`;
}

function durationText(ms) {
  const str = `${ms}ms`;
  if (ms < 10)  return `${C.green}${str}${C.reset}`;
  if (ms < 100) return `${C.yellow}${str}${C.reset}`;
  return `${C.red}${str}${C.reset}`;
}

function timeStamp() {
  const d = new Date();
  return `${C.dim}${d.toLocaleTimeString('en-GB')}${C.reset}`;
}

// decide if a request should be logged (skip noisy Vite internals)
function shouldLog(url) {
  if (url.includes('__vite'))       return false;
  if (url.includes('/@'))           return false;
  if (url.includes('.hot-update'))  return false;
  if (url.includes('sockjs-node'))  return false;
  if (url.includes('ng-cli-ws'))    return false;
  return true;
}

// ─── Banner ──────────────────────────────────────────────
function printBanner() {
  console.log('');
  console.log(`  ${C.bgBlue}${C.bold}${C.white}                                                 ${C.reset}`);
  console.log(`  ${C.bgBlue}${C.bold}${C.white}    📦 Inventory Manager — Dev Server             ${C.reset}`);
  console.log(`  ${C.bgBlue}${C.bold}${C.white}                                                 ${C.reset}`);
  console.log('');
  console.log(`  ${C.green}➜${C.reset}  ${C.bold}Proxy:${C.reset}   ${C.cyan}http://localhost:${PROXY_PORT}/${C.reset}`);
  console.log(`  ${C.dim}➜  Angular: http://localhost:${NG_PORT}/ (internal)${C.reset}`);
  console.log('');
  console.log(`  ${C.dim}──────────────────────────────────────────────────${C.reset}`);
  console.log(`  ${C.dim}  TIME       METHOD   URL${' '.repeat(26)}STATUS        SPEED${C.reset}`);
  console.log(`  ${C.dim}──────────────────────────────────────────────────${C.reset}`);
}

// ─── 1. Start ng serve on internal port ──────────────────
const ngProcess = spawn('npx', ['ng', 'serve', '--port', String(NG_PORT)], {
  cwd: process.cwd(),
  shell: true,
  stdio: ['pipe', 'pipe', 'pipe'],
});

/** Strip ANSI escape codes for reliable text matching */
function stripAnsi(str) {
  return str.replace(/\x1b\[[0-9;]*[a-zA-Z]/g, '').replace(/[\x00-\x1f]/g, ' ');
}

/** Check output text for readiness signals */
function checkReady(rawText) {
  if (ngReady) return;
  const text = stripAnsi(rawText);
  if (text.includes('Local:') || text.includes('localhost:') || text.includes('Application bundle generation complete')) {
    ngReady = true;
    // Small delay to let Vite fully initialize
    setTimeout(() => startProxy(), 800);
  }
}

// Forward ng stderr — useful for compilation errors
ngProcess.stderr.on('data', (data) => {
  const text = data.toString().trim();
  if (text) console.error(`  ${C.dim}[ng]${C.reset} ${text}`);
  checkReady(data.toString());
});

// Wait for ng to be ready, then start proxy
let ngReady = false;
ngProcess.stdout.on('data', (data) => {
  const text = data.toString();
  const clean = stripAnsi(text);
  // Print Angular build messages
  if (clean.includes('Building') || clean.includes('bundle generation') || clean.includes('chunk files')) {
    const lines = clean.trim().split('\n');
    for (const line of lines) {
      const l = line.trim();
      if (l && l.length > 2) console.log(`  ${C.dim}[ng]${C.reset} ${l}`);
    }
  }
  checkReady(text);
});

// Fallback: if Angular ready signal is missed, start proxy after 15s
setTimeout(() => {
  if (!ngReady) {
    console.log(`  ${C.yellow}[timeout] Starting proxy (Angular detection timeout)${C.reset}`);
    ngReady = true;
    startProxy();
  }
}, 15000);

ngProcess.on('close', (code) => {
  console.log(`\n  ${C.yellow}Angular process exited (code ${code})${C.reset}`);
  process.exit(code);
});

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log(`\n  ${C.dim}Shutting down...${C.reset}`);
  ngProcess.kill();
  process.exit(0);
});
process.on('SIGTERM', () => {
  ngProcess.kill();
  process.exit(0);
});

// ─── 2. Proxy Server with Logging ────────────────────────
function startProxy() {
  const server = http.createServer((clientReq, clientRes) => {
    const start  = Date.now();
    const method = clientReq.method || 'GET';
    const url    = clientReq.url || '/';

    // Proxy request to Angular dev server
    const proxyReq = http.request(
      {
        hostname: 'localhost',
        port: NG_PORT,
        path: url,
        method,
        headers: clientReq.headers,
      },
      (proxyRes) => {
        const duration = Date.now() - start;
        const status   = proxyRes.statusCode || 200;

        // Log the request
        if (shouldLog(url)) {
          const urlDisplay = url.length > 36 ? url.substring(0, 33) + '...' : url.padEnd(36);
          console.log(`  ${timeStamp()}  ${methodTag(method)} ${C.white}${urlDisplay}${C.reset} => ${statusText(status)}  ${durationText(duration)}`);
        }

        // Forward response
        clientRes.writeHead(proxyRes.statusCode, proxyRes.headers);
        proxyRes.pipe(clientRes, { end: true });
      }
    );

    proxyReq.on('error', (err) => {
      const duration = Date.now() - start;
      if (shouldLog(url)) {
        const urlDisplay = url.length > 36 ? url.substring(0, 33) + '...' : url.padEnd(36);
        console.log(`  ${timeStamp()}  ${methodTag(method)} ${C.white}${urlDisplay}${C.reset} => ${C.bgRed}${C.white} 502 error ${C.reset}  ${durationText(duration)}`);
      }
      clientRes.writeHead(502);
      clientRes.end('Bad Gateway');
    });

    clientReq.pipe(proxyReq, { end: true });
  });

  // Handle WebSocket upgrade (needed for HMR / live reload)
  server.on('upgrade', (clientReq, clientSocket, head) => {
    const proxyReq = http.request({
      hostname: 'localhost',
      port: NG_PORT,
      path: clientReq.url,
      method: 'GET',
      headers: clientReq.headers,
    });

    proxyReq.on('upgrade', (proxyRes, proxySocket, proxyHead) => {
      clientSocket.write(
        `HTTP/1.1 101 Switching Protocols\r\n` +
        Object.entries(proxyRes.headers).map(([k, v]) => `${k}: ${v}`).join('\r\n') +
        '\r\n\r\n'
      );
      if (proxyHead.length > 0) clientSocket.write(proxyHead);
      proxySocket.pipe(clientSocket);
      clientSocket.pipe(proxySocket);
    });

    proxyReq.on('error', () => {
      clientSocket.end();
    });

    proxyReq.end();
  });

  server.listen(PROXY_PORT, () => {
    printBanner();
  });
}
