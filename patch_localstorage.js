const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');

const regex = /localStorage\.setItem\('user_' \+ (cleanPhone|cleanSelfPhone), JSON\.stringify\(([^)]+)\)\);/g;

// Wait, I can just override localStorage.setItem globally to handle quota exceeded?
// No, let's just create a safe wrapper for user saving.
