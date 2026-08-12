const fs = require('fs');
let code = fs.readFileSync('server.js', 'utf8');

const cronCode = `
// =========================================================================
// CRON: 10-Minute Order Expiry & Reset Engine
// Periodically checks for IN TRANSACTION orders that have exceeded their 10 min TTL
// =========================================================================
setInterval(async () => {
    try {
        const orders = await firebaseRequest('p2p_orders', 'GET');
        if (!orders) return;
        const now = Date.now();
        let expiredCount = 0;
        
        for (const orderId in orders) {
            const o = orders[orderId];
            if (o.status === "IN TRANSACTION" || o.status === "PAYING" || o.status === "PENDING_VERIFICATION") {
                const expiryTime = o.expiry || o.expiry_time || (o.claimedAt ? o.claimedAt + 600000 : 0);
                if (expiryTime && now > expiryTime) {
                    // Order has expired. Reset it to AVAILABLE.
                    o.status = "AVAILABLE";
                    o.buyerPhone = null;
                    o.buyerUserId = null;
                    o.claimedAt = null;
                    o.expiry = null;
                    o.expiry_time = null;
                    
                    await firebaseRequest(\`p2p_orders/\${orderId}\`, 'PUT', o);
                    expiredCount++;
                    
                    // Also clean up user's active_buy if it exists (best-effort)
                    if (o.buyerPhone) {
                        const cleanPhone = o.buyerPhone.replace(/[^0-9]/g, '');
                        await firebaseRequest(\`users/\${cleanPhone}/active_buy\`, 'DELETE');
                    }
                }
            }
        }
        if (expiredCount > 0) {
            console.log(\`[Order Expiry Engine] Successfully reset \${expiredCount} expired P2P orders to AVAILABLE.\`);
        }
    } catch (e) {
        console.error("[Order Expiry Engine] Error running cron:", e);
    }
}, 60000); // Check every 60 seconds
`;

if (!code.includes('Order Expiry Engine')) {
    code = code.replace('const server = http.createServer', cronCode + '\nconst server = http.createServer');
    fs.writeFileSync('server.js', code, 'utf8');
    console.log("Injected 10-Minute Order Expiry Engine into server.js");
} else {
    console.log("Cron already exists.");
}
