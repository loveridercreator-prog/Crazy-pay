const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

// Undo the previous bad injection
html = html.replace('<script src="https://cdn.tailwindcss.com">function renderHomeActiveOrderWidget() { /* placeholder */ }</script>', '<script src="https://cdn.tailwindcss.com"></script>');

// Inject properly before </head>
if (!html.includes('function renderHomeActiveOrderWidget() {')) {
    html = html.replace('</head>', '<script>function renderHomeActiveOrderWidget() { /* placeholder */ }</script>\n</head>');
}
fs.writeFileSync('index.html', html, 'utf8');
console.log("Fixed widget placeholder.");
