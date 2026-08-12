const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');
if (!html.includes('function renderHomeActiveOrderWidget()')) {
    html = html.replace('</script>', 'function renderHomeActiveOrderWidget() { /* placeholder */ }\n</script>');
    fs.writeFileSync('index.html', html, 'utf8');
    console.log("Injected renderHomeActiveOrderWidget placeholder.");
} else {
    console.log("Function already defined.");
}
