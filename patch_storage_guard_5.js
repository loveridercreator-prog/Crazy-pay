const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const regex = /catch \(e2\) \{\s*console\.error\('\[Storage Guard\] Fatal storage quota limit reached\. Suppressing crash to maintain runtime stability\.', e2\);\s*\}/;

const replacement = `catch (e2) {
                                console.warn('[Storage Guard] Still exceeded quota! Performing aggressive wipe...');
                                localStorage.clear();
                                try {
                                    originalSetItem.call(localStorage, key, finalValue);
                                    console.log('[Storage Guard] Successfully recovered after aggressive wipe.');
                                } catch (e3) {
                                    console.error('[Storage Guard] Fatal storage quota limit reached. Suppressing crash to maintain runtime stability. Failed to execute \\'setItem\\' on \\'Storage\\': Setting the value of \\'' + key + '\\' exceeded the quota.', e3);
                                }
                            }`;

if (html.match(regex)) {
    html = html.replace(regex, replacement);
    fs.writeFileSync('index.html', html, 'utf8');
    console.log("Patched storage guard to be aggressive.");
} else {
    console.log("Regex not found.");
}
