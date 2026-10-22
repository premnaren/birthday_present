/**
 * Birthday Storybook - Universal Public Preview Tunnel
 * Launches local server and exposes a global HTTPS link via Cloudflare Tunnel
 */
const { spawn } = require('child_process');
const http = require('http');

console.log('🌸 Initializing Universal Birthday Storybook Preview...\n');

// Check if local server is already running on port 3000
function checkLocalServer(callback) {
  const req = http.get('http://localhost:3000', res => {
    callback(true);
  });
  req.on('error', () => {
    callback(false);
  });
  req.setTimeout(1000, () => {
    req.destroy();
    callback(false);
  });
}

function startTunnel() {
  console.log('✨ Connecting to Cloudflare global edge network...');
  const tunnel = spawn('npx', ['-y', 'cloudflared', 'tunnel', '--url', 'http://localhost:3000'], {
    shell: true,
    stdio: ['ignore', 'pipe', 'pipe']
  });

  let urlFound = false;

  const handleOutput = (data) => {
    const text = data.toString();
    const match = text.match(/https:\/\/[a-z0-9-]+\.trycloudflare\.com/i);
    if (match && !urlFound) {
      urlFound = true;
      const url = match[0];
      console.log('\n================================================================');
      console.log('🎉 YOUR UNIVERSAL PUBLIC PREVIEW LINK IS LIVE:');
      console.log(`👉 ${url}`);
      console.log(`👉 Direct Chapters Preview: ${url}?preview=all`);
      console.log('================================================================');
      console.log('📱 Works on any smartphone, tablet, iPhone, Android, or laptop anywhere!');
      console.log('🔒 No login, no password, and zero hosting setup required.');
      console.log('Press Ctrl + C anytime to stop sharing.\n');
    }
  };

  tunnel.stdout.on('data', handleOutput);
  tunnel.stderr.on('data', handleOutput);

  tunnel.on('close', code => {
    console.log(`Tunnel closed (code ${code})`);
  });
}

checkLocalServer(isRunning => {
  if (isRunning) {
    console.log('✓ Local server detected on http://localhost:3000');
    startTunnel();
  } else {
    console.log('Starting local server on http://localhost:3000...');
    const server = spawn('node', ['serve.js'], { shell: true, stdio: 'inherit' });
    setTimeout(startTunnel, 1500);
  }
});
