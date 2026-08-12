const cp = require('child_process');
const child = cp.spawn('npm', ['run', 'dev'], {stdio: 'pipe'});
child.stdout.on('data', d => console.log('OUT:', d.toString()));
child.stderr.on('data', d => console.log('ERR:', d.toString()));
setTimeout(() => child.kill(), 4000);
