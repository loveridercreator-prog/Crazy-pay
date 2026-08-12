const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const targetStr = `                const resp = await fetch('/api/usdt/create_order', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        userId: userPhone,
                        amount: amt,
                        network: netInp
                    })
                });
                const data = await resp.json();`;

const replaceStr = `                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), 8000);
                const resp = await fetch('/api/usdt/create_order', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        userId: userPhone,
                        amount: amt,
                        network: netInp
                    }),
                    signal: controller.signal
                });
                clearTimeout(timeoutId);
                const data = await resp.json();`;

if (html.includes(targetStr)) {
    html = html.replace(targetStr, replaceStr);
    fs.writeFileSync('index.html', html, 'utf8');
    console.log("Patched getUsdtDepositAddress fetch with timeout.");
} else {
    console.log("Target not found for getUsdtDepositAddress.");
}
