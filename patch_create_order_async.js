const fs = require('fs');
let code = fs.readFileSync('server.js', 'utf8');

const target = `                await firebaseRequest(\`usdt_orders/\${orderId}\`, 'PUT', orderPayload);

                res.writeHead(200, { 'Content-Type': 'application/json' });`;

const replacement = `                // Fire and forget to prevent UI freeze
                firebaseRequest(\`usdt_orders/\${orderId}\`, 'PUT', orderPayload).catch(e => console.error("USDT Order Save Error", e));

                res.writeHead(200, { 'Content-Type': 'application/json' });`;

if (code.includes(target)) {
    code = code.replace(target, replacement);
    fs.writeFileSync('server.js', code, 'utf8');
    console.log('Patched /api/usdt/create_order successfully.');
} else {
    console.log('Target string not found.');
}
