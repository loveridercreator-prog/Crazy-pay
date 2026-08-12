const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const regex = /<script>function renderHomeActiveOrderWidget\(\) \{ \/\* placeholder \*\/ \}\n        const originalSetItem = localStorage\.setItem;\n        localStorage\.setItem = function\(key, value\) \{[\s\S]*?            \}\n        \};\n<\/script>/;

const replacement = '<script>function renderHomeActiveOrderWidget() { /* placeholder */ }</script>';

if (html.match(regex)) {
    html = html.replace(regex, replacement);
    fs.writeFileSync('index.html', html, 'utf8');
    console.log("Removed first injection.");
} else {
    console.log("Regex not found.");
}
