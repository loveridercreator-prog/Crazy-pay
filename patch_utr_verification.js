const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const missingFunc = `
        async function startTerminalVerification() {
            const utrVal = document.getElementById('terminal-utr-input').value.trim();
            const errorEl = document.getElementById('terminal-error-message');
            
            if (errorEl) {
                errorEl.classList.add('hidden');
                errorEl.innerText = "";
            }

            const screenshotPreview = document.getElementById('terminal-screenshot-preview');
            const hasScreenshot = screenshotPreview && !screenshotPreview.classList.contains('hidden');
            
            if (!hasScreenshot || utrVal.length !== 12) {
                if (errorEl) {
                    errorEl.innerText = "Screenshot image and valid 12-digit UTR are both mandatory for verification.";
                    errorEl.classList.remove('hidden');
                } else {
                    alert("Screenshot image and valid 12-digit UTR are both mandatory for verification.");
                }
                return;
            }

            const progressContainer = document.getElementById('terminal-progress-container');
            const progressText = document.getElementById('terminal-progress-text');
            const progressBar = document.getElementById('terminal-progress-bar');
            const actionBox = document.getElementById('utr-confirmation-box');

            if (actionBox) actionBox.classList.add('hidden');
            if (progressContainer) progressContainer.classList.remove('hidden');
            if (progressBar) progressBar.style.width = "50%";
            if (progressText) progressText.innerText = "🔍 Executing Strict Server-Side Match (Amount, UTR & Assigned UPI)...";

            setTimeout(async () => {
                const targetUpi = document.getElementById('terminal-upi-id') ? document.getElementById('terminal-upi-id').innerText.trim() : "";
                try {
                    const tripleResponse = await fetch('/api/verify_utr_triple_match', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            utr: utrVal,
                            payableAmount: currentTerminalAmount,
                            assignedUpi: targetUpi,
                            orderId: currentTerminalTradeId,
                            buyerPhone: currentUser ? currentUser.phone : "guest"
                        })
                    });
                    const tripleRes = await tripleResponse.json();

                    if (progressContainer) progressContainer.classList.add('hidden');
                    if (actionBox) actionBox.classList.remove('hidden');

                    if (tripleRes.success) {
                        if (countdownTimerId) {
                            clearInterval(countdownTimerId);
                            countdownTimerId = null;
                        }
                        // Handle success
                        if (typeof confirmTerminalSettle === 'function') {
                            confirmTerminalSettle(utrVal);
                        } else {
                            // Manual UI settle
                            const successDlg = document.getElementById('dialog-match-success');
                            if (successDlg) successDlg.classList.remove('hidden');
                            
                            // Close terminal
                            const term = document.getElementById('buy-terminal-overlay');
                            if (term) term.classList.add('hidden');

                            if (typeof showOrderResultBanner === 'function') {
                                showOrderResultBanner(true, "Trade Match Secured", "Successfully secured trade contract with dealer. Please verify payment details.");
                            }
                            
                            if (window.allTxRecords && tripleRes.txRecord) {
                                window.allTxRecords.push(tripleRes.txRecord);
                                if(typeof renderHistoryLedgerItems === 'function') renderHistoryLedgerItems();
                            }
                        }
                    } else {
                        if (errorEl) {
                            errorEl.innerText = tripleRes.message || tripleRes.error || "⚠️ Triple-match verification failed.";
                            errorEl.classList.remove('hidden');
                        }
                        if (typeof showNotificationBroadcast === 'function') {
                            showNotificationBroadcast(tripleRes.message || tripleRes.error || "⚠️ Mismatch detected.");
                        }
                    }
                } catch (err) {
                    console.error("Triple Match API error:", err);
                    if (progressContainer) progressContainer.classList.add('hidden');
                    if (actionBox) actionBox.classList.remove('hidden');
                    if (errorEl) {
                        errorEl.innerText = "Server Error: Could not verify UTR.";
                        errorEl.classList.remove('hidden');
                    }
                }
            }, 1000);
        }
`;

if (!html.includes('async function startTerminalVerification()')) {
    html = html.replace('</script>', missingFunc + '\n</script>');
    fs.writeFileSync('index.html', html, 'utf8');
    console.log("Injected startTerminalVerification into index.html.");
} else {
    console.log("Already present.");
}
