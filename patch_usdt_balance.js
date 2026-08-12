const fs = require('fs');
let code = fs.readFileSync('index.html', 'utf8');

const regex = /currentUser\.balance \= \(currentUser\.balance \|\| 0\) \+ inrCredited;\s*currentUser\.usdtBalance \= \(currentUser\.usdtBalance \|\| 0\) \+ usdtActiveAmount;\s*if \(typeof database \!\=\= 'undefined' && database\) \{\s*const cleanPhone \= currentUser\.phone \? currentUser\.phone\.replace\(\/\[\^0\-9\]\/g\, ''\) \: "guest";\s*database\.ref\('users\/' \+ cleanPhone \+ '\/balance'\)\.set\(currentUser\.balance\);\s*database\.ref\('users\/' \+ cleanPhone \+ '\/usdtBalance'\)\.set\(currentUser\.usdtBalance\);\s*\}/g;

const replacement = `
                        if (typeof database !== 'undefined' && database) {
                            const cleanPhone = currentUser.phone ? currentUser.phone.replace(/[^0-9]/g, '') : "guest";
                            database.ref('users/' + cleanPhone + '/balance').transaction((b) => (parseFloat(b) || 0) + inrCredited, (err, comm, snap) => {
                                if (comm) currentUser.balance = snap.val();
                            });
                            database.ref('users/' + cleanPhone + '/usdtBalance').transaction((b) => (parseFloat(b) || 0) + usdtActiveAmount, (err, comm, snap) => {
                                if (comm) currentUser.usdtBalance = snap.val();
                            });
                        } else {
                            currentUser.balance = (currentUser.balance || 0) + inrCredited;
                            currentUser.usdtBalance = (currentUser.usdtBalance || 0) + usdtActiveAmount;
                        }
`;

if (code.match(regex)) {
    code = code.replace(regex, replacement);
    fs.writeFileSync('index.html', code, 'utf8');
    console.log("Patched USDT balance transaction updates.");
} else {
    console.log("Could not find regex target.");
}
