const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const target = '<script src="https://cdn.tailwindcss.com">function renderHomeActiveOrderWidget() { /* placeholder */ }</script>';
const replacement = '<script src="https://cdn.tailwindcss.com"></script>\n    <script>function renderHomeActiveOrderWidget() { /* placeholder */ }</script>';

if (html.includes(target)) {
    html = html.replace(target, replacement);
    fs.writeFileSync('index.html', html, 'utf8');
    console.log("Fixed widget placeholder.");
} else {
    console.log("Could not find the target exact string. Let's try regex.");
    html = html.replace(/<script src="https:\/\/cdn\.tailwindcss\.com">function renderHomeActiveOrderWidget\(\) \{ \/\* placeholder \*\/ \}<\/script>/, replacement);
    fs.writeFileSync('index.html', html, 'utf8');
    console.log("Regex replaced.");
}
