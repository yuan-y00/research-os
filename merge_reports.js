const fs = require('fs');
const reports = JSON.parse(fs.readFileSync('D:/Yuan/research-os/public/data/reports.json', 'utf8'));
const hyrox = JSON.parse(fs.readFileSync('D:/Yuan/research-os/tmp_hyrox.json', 'utf8'));
reports.unshift(hyrox);
fs.writeFileSync('D:/Yuan/research-os/public/data/reports.json', JSON.stringify(reports, null, 2) + '\n');
console.log('Done - merged successfully. Reports count:', reports.length);
