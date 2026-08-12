const fs = require('fs');
let code = fs.readFileSync('server.js', 'utf8');

const regex = /const hash = txHash\.trim\(\);[\s\S]*?const existingTx = await firebaseRequest\(\`usdt_claimed_txs\/\$\{hash\}\`, 'GET'\);/m;

const replacement = `const hash = txHash.trim();
                
                // Anti-Spam: Strict Payload Validation
                const isHex = /^(0x)?[0-9a-fA-F]{64}$/.test(hash);
                if (!isHex) {
                    res.writeHead(400, { 'Content-Type': 'application/json' });
                    return res.end(JSON.stringify({ success: false, error: "Invalid TxHash format. Must be a valid 64-character blockchain transaction hash." }));
                }

                const existingTx = await firebaseRequest(\`usdt_claimed_txs/\${hash}\`, 'GET');`;

if (code.match(regex)) {
    code = code.replace(regex, replacement);
    fs.writeFileSync('server.js', code, 'utf8');
    console.log("Patched /api/usdt/simulate_deposit with strict TxHash validation.");
} else {
    console.log("Could not find simulation target block.");
}
