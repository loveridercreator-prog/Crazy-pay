const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const regex = /originalSetItem\.call\(localStorage, key, finalValue\);\s*console\.log\('\[Storage Guard\] Successfully recovered storage slot after pruning\.'\);/g;
const replacement = `try {
                                originalSetItem.call(localStorage, key, finalValue);
                                console.log('[Storage Guard] Successfully recovered storage slot after pruning.');
                            } catch (e2) {
                                console.error('[Storage Guard] Fatal storage quota limit reached. Suppressing crash to maintain runtime stability.', e2);
                            }`;

if (html.match(regex)) {
    html = html.replace(regex, replacement);
    fs.writeFileSync('index.html', html, 'utf8');
    console.log("Patched storage guard 4.");
} else {
    console.log("Regex not found.");
}
