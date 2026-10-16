const fs = require('fs');
const path = require('path');

const dirs = [
    'd:\\Projects\\Nuvexa\\Classroom-Design-Carousel',
    'd:\\Projects\\Nuvexa\\School-Fire-Safety-Carousel'
];

dirs.forEach(dir => {
    if (!fs.existsSync(dir)) return;
    
    for (let i = 1; i <= 8; i++) {
        const file = path.join(dir, 'slide-' + i + '.svg');
        if (!fs.existsSync(file)) continue;
        
        let content = fs.readFileSync(file, 'utf-8');
        
        // 1. Remove the white shade ground line (y1="405")
        content = content.replace(/<line x1="0" y1="405" x2="800" y2="405" stroke="rgba\(255,255,255,0\.2\)" stroke-width="1"\/>\n?/g, '');
        
        // 2. Fix the overlapping horizontal dashed grid line in slide-1
        content = content.replace(
            /<line x1="150" y1="225" x2="650" y2="225" stroke="rgba\(255,255,255,0\.2\)" stroke-width="1\.5" stroke-dasharray="4 4"\/>/g,
            '<line x1="260" y1="225" x2="540" y2="225" stroke="rgba(255,255,255,0.2)" stroke-width="1.5" stroke-dasharray="4 4"/>'
        );
        
        // 3. Improve visual hierarchy of Blueprint Annotations
        content = content.replace(
            /<g font-family="'Courier New', 'SF Mono', monospace" font-size="11" fill="#FFFFFF" letter-spacing="1">/g,
            '<g font-family="\'Courier New\', \'SF Mono\', monospace" font-size="12" fill="#C9A84C" font-weight="600" letter-spacing="2">'
        );
        
        // 4. In slide-1, push the text spacing slightly further away from the lines
        if (i === 1 && dir.includes('School-Fire-Safety-Carousel')) {
             content = content.replace(/<text x="200" y="15" text-anchor="middle">ACTIVE SUPPRESSION<\/text>/g, '<text x="200" y="10" text-anchor="middle">ACTIVE SUPPRESSION</text>');
             content = content.replace(/<text x="400" y="15" text-anchor="middle">FIRE-RATED EGRESS CORE<\/text>/g, '<text x="400" y="10" text-anchor="middle">FIRE-RATED EGRESS CORE</text>');
             content = content.replace(/<text x="150" y="234" text-anchor="end">EARLY DETECTION<\/text>/g, '<text x="145" y="234" text-anchor="end">EARLY DETECTION</text>');
        }
        
        fs.writeFileSync(file, content);
    }
});
console.log('Fixed styling across all slides!');
