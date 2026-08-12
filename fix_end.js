const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const targetStr = `        function selectAndLaunchRace(provider) {`;
const startIdx = html.indexOf(targetStr);

if (startIdx !== -1) {
    const replacement = `        function selectAndLaunchRace(provider) {
            closeModal('dialog-buy-provider-selection');
            selectedTerminalAppVal = provider;
            startBuyLatencyRace(currentSelectBuyOrderId, currentSelectBuyAmount, provider);
        }

        async function startBuyLatencyRace(orderId, amount, provider) {
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
                    
                    currentSelectBuyOrderId = orderId;
                    currentSelectBuyAmount = amount;
                    selectedTerminalAppVal = provider;

                    const successDlg = document.getElementById('dialog-match-success');
                    if (successDlg) successDlg.classList.remove('hidden');
                    if(typeof showOrderResultBanner === 'function') showOrderResultBanner(true, "Trade Match Secured", "Successfully secured trade contract with dealer. Please verify payment details.");
                    
                    setTimeout(() => {
                        if (successDlg && !successDlg.classList.contains('hidden') && typeof proceedToLockedDetails === 'function') {
                            proceedToLockedDetails();
                        }
                    }, 100);
                } else {
                    alert(\`Order Claim Failed: \${data.error || 'Please try again.'}\`);
                    if(typeof renderP2pSellers === 'function') renderP2pSellers();
                }
            } catch (err) {
                console.error("Error claiming order:", err);
                alert("Network error while claiming order. Please try again.");
            }
        }
    </script>
</body>
</html>`;
    
    html = html.substring(0, startIdx) + replacement;
    fs.writeFileSync('index.html', html, 'utf8');
    console.log("Successfully fixed end of file.");
} else {
    console.log("Failed to find start");
}
