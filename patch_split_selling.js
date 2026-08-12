const fs = require('fs');
let code = fs.readFileSync('server.js', 'utf8');

const regex = /\/\/ MODULE 2: Flexible chunking\. One order for the full balance\.\s*if \(balance < 50\) \{\s*return \{ success: false, reason: "Insufficient balance \(Min 50\)" \};\s*\}\s*let createdOrders = \[\];\s*const orderResult = await createOrder\(cleanPhone, balance, user\.upiId \|\| 'crazy@upi', user\);\s*if \(orderResult && orderResult\.activeWithdrawal\) \{\s*createdOrders\.push\(orderResult\.activeWithdrawal\);\s*\}/m;

const replacement = `// MODULE 2: Flexible chunking.
    if (balance < 50) {
        return { success: false, reason: "Insufficient balance (Min 50)" };
    }
    
    let createdOrders = [];
    
    // Use split logic to break down large balances
    const blocks = splitBalanceIntoSmartBlocks(balance);
    if (blocks.length > 0) {
        for (const amt of blocks) {
            const orderResult = await createOrder(cleanPhone, amt, user.upiId || 'crazy@upi', user);
            if (orderResult && orderResult.activeWithdrawal) {
                createdOrders.push(orderResult.activeWithdrawal);
            }
        }
    } else {
        const orderResult = await createOrder(cleanPhone, balance, user.upiId || 'crazy@upi', user);
        if (orderResult && orderResult.activeWithdrawal) {
            createdOrders.push(orderResult.activeWithdrawal);
        }
    }`;

if (code.match(regex)) {
    code = code.replace(regex, replacement);
    fs.writeFileSync('server.js', code, 'utf8');
    console.log("Patched processUserWithdrawalBatch to use splitBalanceIntoSmartBlocks.");
} else {
    console.log("Could not find regex target.");
}
