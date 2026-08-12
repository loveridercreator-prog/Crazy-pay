const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

html = html.replace('<script src="https://cdn.tailwindcss.com">function renderHomeActiveOrderWidget() { /* placeholder */ }</script>', '<script src="https://cdn.tailwindcss.com"></script>\n    <script>function renderHomeActiveOrderWidget() { /* placeholder */ }</script>');

fs.writeFileSync('index.html', html, 'utf8');
console.log("Fixed widget placeholder.");
