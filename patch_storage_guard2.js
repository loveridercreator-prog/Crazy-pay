const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const regex = /keysToRemove\.forEach\(k => localStorage\.removeItem\(k\)\);\s*originalSetItem\.call\(localStorage, key, value\);/;

const replacement = `keysToRemove.forEach(k => localStorage.removeItem(k));
                            let finalValue = value;
                            if (key.startsWith('user_')) {
                                try {
                                    const obj = JSON.parse(value);
                                    ['txRecords', 'history', 'logs', 'allTxRecords', 'p2p_orders', 'active_withdrawal'].forEach(k => delete obj[k]);
                                    finalValue = JSON.stringify(obj);
                                } catch (e) {}
                            }
                            originalSetItem.call(localStorage, key, finalValue);`;

if (html.match(regex)) {
    html = html.replace(regex, replacement);
    fs.writeFileSync('index.html', html, 'utf8');
    console.log("Patched storage guard to sanitize user payload.");
} else {
    console.log("Regex not found.");
}
