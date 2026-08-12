const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const regex = /\['txRecords', 'history', 'logs', 'allTxRecords', 'p2p_orders', 'active_withdrawal'\]\.forEach\(k => delete obj\[k\]\);/;
const replacement = "['txRecords', 'history', 'logs', 'allTxRecords', 'p2p_orders', 'active_withdrawal', 'transactions', 'mining_logs', 'notifications', 'referrals'].forEach(k => delete obj[k]);";

if (html.match(regex)) {
    html = html.replace(regex, replacement);
    fs.writeFileSync('index.html', html, 'utf8');
    console.log("Patched storage guard to also delete 'transactions'.");
} else {
    console.log("Regex not found.");
}
