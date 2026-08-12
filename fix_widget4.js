const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const regex = /<script src="https:\/\/cdn\.tailwindcss\.com">function renderHomeActiveOrderWidget\(\) \{ \/\* placeholder \*\/ \}\n<\/script>/;
const replacement = '<script src="https://cdn.tailwindcss.com"></script>\n    <script>function renderHomeActiveOrderWidget() { /* placeholder */ }</script>';

html = html.replace(regex, replacement);
fs.writeFileSync('index.html', html, 'utf8');
console.log("Fixed widget placeholder.");
