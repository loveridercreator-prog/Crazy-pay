const fs = require('fs');
let html = fs.readFileSync('/index.html', 'utf8');

const targetStr = `        function startBuyLatencyRace(orderId, amount, provider) {
            // Lock order in Firebase immediately so no other user can click or see it!`;

const endStr = `                const errDlg = document.getElementById('dialog-match-error');
                if (errDlg) errDlg.classList.remove('hidden');
            }
        }`;

const startIdx = html.indexOf(targetStr);
const endIdx = html.indexOf(endStr, startIdx) + endStr.length;

if (startIdx !== -1 && endIdx !== -1) {
    const replacement = `        async function startBuyLatencyRace(orderId, amount, provider) {
            const cleanPhone = currentUser.phone ? currentUser.phone.replace(/[^0-9]/g, '') : "guest";
            
            try {
                const response = await fetch('/api/claim_order', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        orderId: orderId,
                        buyerPhone: cleanPhone,
                        amount: parseFloat(amount),
                        provider: provider || "MobiKwik"
                    })
                });
                
                const data = await response.json();
                
                if (data.success) {
                    if (data.txRecord && window.allTxRecords) {
                        window.allTxRecords.push(data.txRecord);
                        renderHistoryLedgerItems();
                    }
                    
                    // Set active states
                    currentSelectBuyOrderId = orderId;
                    currentSelectBuyAmount = amount;
                    selectedTerminalAppVal = provider;

                    // User successfully claims order
                    const successDlg = document.getElementById('dialog-match-success');
                    if (successDlg) successDlg.classList.remove('hidden');
                    showOrderResultBanner(true, "Trade Match Secured", "Successfully secured trade contract with dealer. Please verify payment details.");
                    
                    // Auto-proceed to locked payment details in 0.1s
                    setTimeout(() => {
                        if (successDlg && !successDlg.classList.contains('hidden')) {
                            proceedToLockedDetails();
                        }
                    }, 100);
                } else {
                    alert(\`Order Claim Failed: \${data.error || 'Please try again.'}\`);
                    renderP2pSellers(); // Refresh order book
                }
            } catch (err) {
                console.error("Error claiming order:", err);
                alert("Network error while claiming order. Please try again.");
            }
        }`;
    
    html = html.substring(0, startIdx) + replacement + html.substring(endIdx);
    fs.writeFileSync('/index.html', html, 'utf8');
    console.log("Successfully patched startBuyLatencyRace in index.html");
} else {
    console.log("Failed to find boundaries");
}
