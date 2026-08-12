const fs = require('fs');
let code = fs.readFileSync('orderController.js', 'utf8');

const target = `            const requestedAmt = parseFloat(payload.amount || payload.order_amount || payload.requestedAmount || 0);`;

const replacement = `            const requestedAmt = parseFloat(payload.amount || payload.order_amount || payload.requestedAmount || 0);
            
            // Server-Side Anti-Spam / Rate Limiting
            if (!global.orderRateLimitMap) global.orderRateLimitMap = {};
            const cleanPhoneLimit = (phone || "").toString().replace(/[^0-9]/g, '');
            const nowTime = Date.now();
            if (global.orderRateLimitMap[cleanPhoneLimit] && (nowTime - global.orderRateLimitMap[cleanPhoneLimit]) < 5000) {
                res.writeHead(429, { 'Content-Type': 'application/json' });
                return res.end(JSON.stringify({
                    success: false,
                    error: "Too many requests. Please wait before creating another order."
                }));
            }
            global.orderRateLimitMap[cleanPhoneLimit] = nowTime;
`;

if (code.includes(target)) {
    code = code.replace(target, replacement);
    fs.writeFileSync('orderController.js', code, 'utf8');
    console.log("Patched orderController.js with Rate Limiting.");
} else {
    console.log("Target not found.");
}
