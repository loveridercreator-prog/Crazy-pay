const fs = require('fs');
let code = fs.readFileSync('index.html', 'utf8');

const regex1 = /currentUser\.balance \+\= accumulated;\s*if \(database\) \{\s*database\.ref\('users\/' \+ phone \+ '\/balance'\)\.set\(currentUser\.balance\);\s*\} else \{\s*updateBalanceUi\(\);\s*\}/g;

const replacement1 = `
                if (database) {
                    database.ref('users/' + phone + '/balance').transaction((currentBalance) => {
                        return (parseFloat(currentBalance) || 0) + accumulated;
                    }, (error, committed, snapshot) => {
                        if (committed && snapshot) {
                            currentUser.balance = snapshot.val();
                            updateBalanceUi();
                        }
                    });
                } else {
                    currentUser.balance += accumulated;
                    updateBalanceUi();
                }`;

const regex2 = /currentUser\.balance \+\= bonusAmount;\s*localStorage\.setItem\(\`mining_daily_bonus_time_\$\{phone\}\`, now\);\s*if \(database\) \{\s*database\.ref\('users\/' \+ phone \+ '\/balance'\)\.set\(currentUser\.balance\);\s*\} else \{\s*updateBalanceUi\(\);\s*\}/g;

const replacement2 = `
                localStorage.setItem(\`mining_daily_bonus_time_\${phone}\`, now);
                if (database) {
                    database.ref('users/' + phone + '/balance').transaction((currentBalance) => {
                        return (parseFloat(currentBalance) || 0) + bonusAmount;
                    }, (error, committed, snapshot) => {
                        if (committed && snapshot) {
                            currentUser.balance = snapshot.val();
                            updateBalanceUi();
                        }
                    });
                } else {
                    currentUser.balance += bonusAmount;
                    updateBalanceUi();
                }`;

let patched = false;
if (code.match(regex1)) {
    code = code.replace(regex1, replacement1);
    patched = true;
} else {
    console.log("Could not find regex1");
}

if (code.match(regex2)) {
    code = code.replace(regex2, replacement2);
    patched = true;
} else {
    console.log("Could not find regex2");
}

if (patched) {
    fs.writeFileSync('index.html', code, 'utf8');
    console.log("Patched index.html for auto-increasing balance bug.");
}
