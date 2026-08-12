const fs = require('fs');
let code = fs.readFileSync('index.html', 'utf8');

const regex = /\/\/ Filter gateways based on user's dashboard configuration\s*if \(userUpiHandles && userUpiHandles\.length > 0\) \{\s*const userConfiguredProviders = userUpiHandles\s*\.filter\(u => u\.mode === "BUY" \|\| u\.mode === "BOTH"\)\s*\.map\(u => \(u\.provider \|\| u\.upiName \|\| "UPI"\)\.toLowerCase\(\)\);/m;

const replacement = `// Filter gateways based on user's dashboard configuration
                    if (userUpiHandles && userUpiHandles.length > 0) {
                        const userConfiguredProviders = userUpiHandles
                            .map(u => (u.provider || u.upiName || "UPI").toLowerCase());`;

if (code.match(regex)) {
    code = code.replace(regex, replacement);
    fs.writeFileSync('index.html', code, 'utf8');
    console.log("Patched Gateway Filtering Logic.");
} else {
    console.log("Could not find regex target.");
}
