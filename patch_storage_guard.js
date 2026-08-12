const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const injection = `
        const originalSetItem = localStorage.setItem;
        localStorage.setItem = function(key, value) {
            try {
                originalSetItem.apply(this, arguments);
            } catch (e) {
                console.warn("[Storage Guard] Caught quota limit for key:", key);
                if (key.startsWith('user_')) {
                    try {
                        let obj = JSON.parse(value);
                        // Clean heavy arrays if they accidentally got attached
                        ['allTxRecords', 'txRecords', 'logs', 'history', 'p2p_orders', 'notifications'].forEach(k => delete obj[k]);
                        originalSetItem.call(this, key, JSON.stringify(obj));
                    } catch (e2) {
                        console.error("[Storage Guard] Fatal fail", e2);
                    }
                }
            }
        };
`;

html = html.replace('<script>function renderHomeActiveOrderWidget() { /* placeholder */ }</script>', '<script>function renderHomeActiveOrderWidget() { /* placeholder */ }\n' + injection + '</script>');

fs.writeFileSync('index.html', html, 'utf8');
console.log("Injected storage guard.");
