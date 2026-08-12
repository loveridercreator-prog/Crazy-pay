const cp = require('child_process');
const child = cp.spawn('node', ['server.js'], {stdio: 'pipe'});
child.stdout.on('data', d => console.log('OUT:', d.toString()));
child.stderr.on('data', d => console.log('ERR:', d.toString()));
setTimeout(() => child.kill(), 3000);
