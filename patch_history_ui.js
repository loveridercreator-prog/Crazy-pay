const fs = require('fs');
let code = fs.readFileSync('index.html', 'utf8');

const target = `                    itemDiv.className = \`flex justify-between items-center text-xs bg-gray-50 dark:bg-[#121829] p-3 rounded-xl border border-gray-100 dark:border-slate-800/60 border-l-4 \${colorClass}\`;
                    itemDiv.innerHTML = \`
                        <div class="text-left">
                            <span class="font-extrabold text-gray-900 dark:text-white block">\${tx.type || (isBuy ? 'USDT PURCHASE' : 'USDT SALE')}</span>
                            <span class="text-[10px] text-gray-500 dark:text-gray-400">Qty: \${qty} | \${time}</span>
                        </div>
                        <span class="font-mono font-bold \${amountColor}">\${sign}₹\${Math.abs(tx.amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                    \`;`;

const replacement = `                    itemDiv.className = \`flex justify-between items-center text-xs bg-gray-50 dark:bg-[#121829] p-3 rounded-xl border border-gray-100 dark:border-slate-800/60 border-l-4 \${colorClass}\`;
                    
                    let statusBadge = "";
                    const statusLower = (tx.status || "").toLowerCase();
                    if (statusLower.includes("paying") || statusLower.includes("transaction") || statusLower.includes("pending")) {
                        statusBadge = \`<span class="ml-2 px-1.5 py-0.5 rounded text-[9px] font-bold bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-500 uppercase tracking-widest">\${isBuy ? 'PAYING' : 'SELLING - PAYING'}</span>\`;
                    } else if (statusLower.includes("success") || statusLower.includes("completed")) {
                        statusBadge = \`<span class="ml-2 px-1.5 py-0.5 rounded text-[9px] font-bold bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-500 uppercase tracking-widest">SUCCESS</span>\`;
                    } else if (statusLower.includes("cancel") || statusLower.includes("failed")) {
                        statusBadge = \`<span class="ml-2 px-1.5 py-0.5 rounded text-[9px] font-bold bg-rose-100 text-rose-700 dark:bg-rose-900/30 dark:text-rose-500 uppercase tracking-widest">CANCELLED</span>\`;
                    }

                    itemDiv.innerHTML = \`
                        <div class="text-left">
                            <div class="flex items-center">
                                <span class="font-extrabold text-gray-900 dark:text-white block">\${tx.type || (isBuy ? 'USDT PURCHASE' : 'USDT SALE')}</span>
                                \${statusBadge}
                            </div>
                            <span class="text-[10px] text-gray-500 dark:text-gray-400">Qty: \${qty} | \${time}</span>
                        </div>
                        <span class="font-mono font-bold \${amountColor}">\${sign}₹\${Math.abs(tx.amount).toLocaleString('en-IN', { minimumFractionDigits: 2 })}</span>
                    \`;`;

if (code.includes(target)) {
    code = code.replace(target, replacement);
    fs.writeFileSync('index.html', code, 'utf8');
    console.log("Patched History UI in index.html");
} else {
    console.log("Could not find UI target.");
}
