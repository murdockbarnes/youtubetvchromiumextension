const fs = require('fs');
const repo = 'C:/youtubetvchromiumextension';

// 1. Revert rules.json
const rulesFile = `${repo}/rules.json`;
let rulesCode = fs.readFileSync(rulesFile, 'utf8');
rulesCode = rulesCode.replace(/Cobalt\/22\.2\.3-gold \(PS5\)/g, "Cobalt/22.2.3-gold (PS4)");
fs.writeFileSync(rulesFile, rulesCode, 'utf8');

// 2. Revert inject-ua.js
const uaFile = `${repo}/inject-ua.js`;
let uaCode = fs.readFileSync(uaFile, 'utf8');
uaCode = uaCode.replace(/Cobalt\/22\.2\.3-gold \(PS5\)/g, "Cobalt/22.2.3-gold (PS4)");
uaCode = uaCode.replace(/PlayStation 5/g, "PlayStation 4");
fs.writeFileSync(uaFile, uaCode, 'utf8');

// 3. Revert inject-4k.js
const k4File = `${repo}/inject-4k.js`;
let k4Code = fs.readFileSync(k4File, 'utf8');
// Remove the tvAppInfo injection
k4Code = k4Code.replace(/\s*if \(!body\.context\.client\.tvAppInfo\) body\.context\.client\.tvAppInfo = \{\};\s*body\.context\.client\.tvAppInfo\.supportedResolutions = \["1080p", "1440p", "2160p", "4K"\];/g, "");
fs.writeFileSync(k4File, k4Code, 'utf8');

console.log("Successfully reverted PS5 changes in main directory.");
