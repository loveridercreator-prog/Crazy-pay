const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const missingFunctions = `
        function confirmAndPayNow(orderId, amount, provider) {
            currentTerminalTradeId = orderId;
            currentTerminalAmount = amount;
            selectedTerminalAppVal = provider;
            
            const term = document.getElementById('buy-terminal-overlay');
            if (term) term.classList.remove('hidden');
            
            const amtEl = document.getElementById('terminal-amount-display');
            if (amtEl) amtEl.innerText = "₹" + parseFloat(amount).toLocaleString('en-IN', {minimumFractionDigits: 2});
        }

        function proceedToLockedDetails() {
            const successDlg = document.getElementById('dialog-match-success');
            if (successDlg) successDlg.classList.add('hidden');
            
            confirmAndPayNow(currentSelectBuyOrderId, currentSelectBuyAmount, selectedTerminalAppVal);
        }

        function confirmTerminalSettle(utrVal) {
            const successDlg = document.getElementById('dialog-match-success');
            if (successDlg) successDlg.classList.remove('hidden');
            
            const term = document.getElementById('buy-terminal-overlay');
            if (term) term.classList.add('hidden');

            if (typeof showOrderResultBanner === 'function') {
                showOrderResultBanner(true, "Payment Verified", "Payment verified successfully.");
            }
            
            // Note: Server already updated balance, so just trigger a re-fetch
            if (typeof fetchUserData === 'function') fetchUserData();
            if (typeof renderHistoryLedgerItems === 'function') renderHistoryLedgerItems();
        }
`;

if (!html.includes('function confirmAndPayNow(')) {
    html = html.replace('</script>', missingFunctions + '\n</script>');
    fs.writeFileSync('index.html', html, 'utf8');
    console.log("Injected missing UI flow functions into index.html.");
} else {
    console.log("Already present.");
}
