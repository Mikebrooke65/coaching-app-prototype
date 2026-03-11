// Parse slide XML to map images to session positions (1-4)
// Uses x-coordinate of image placement to determine which session column it belongs to
// Column layout: Session 1 (~93k), Session 2 (~2.7M), Session 3 (~5.3M), Session 4 (~7.9M)

const fs = require('fs');
const path = require('path');

const slidesDir = path.join(__dirname, '..', 'slides');
const relsDir = path.join(slidesDir, '_rels');

// Slide headers mapping
const slideHeaders = {
  1: 'Shielding', 2: '2 v 2s / Games', 3: '1 v 1 – Defending',
  4: 'Pass & Control / Games', 5: '1 v 1 – 50/50 Contest', 6: 'Pass & Control',
  7: 'Shooting Technique – Laces', 8: 'Pass & Control', 9: '2 v 1 / 3 v 2 – Defending',
  10: 'Pass & Control', 11: 'Ways to Break the Line', 12: '1 v 1 – Turns',
  13: '1 v 1 – Shielding (U9/U10)', 14: '1 v 1 – Shielding (U11/U12)',
  15: 'Pass & Control', 16: '1 v 1 – Beating the Defender (U9/U10)',
  17: 'Pass & Control – Building Up', 18: '1 v 1 – Dribbling',
  19: 'Kicking Techniques (U11/U12)', 20: 'Pass & Control – Receiving Under Pressure',
  21: 'Pass & Control', 22: '1 v 1 – Attacking',
  23: '1 v 1 – Defending (U9/U10)', 24: '1 v 1 – Travelling with the Ball',
  25: 'Shooting Technique – Laces', 26: '1 v 1 Competitiveness',
  27: '2 v 1 / 3 v 2 – Defending', 28: 'Pass & Control',
  29: '1 v 1 – Dribbling (Escaping Pressure)', 30: 'Pass & Control – Escaping Pressure',
  31: '1 v 1 – Finishing', 32: 'Pass & Control',
  33: 'Pass & Control – Building Up', 34: '1 v 1 – Attacking (U9/U10)',
  35: 'Ways to Break the Line', 36: 'Ways to Break the Line (DUP)',
  37: 'Pass & Control – Crossing & Finishing', 38: '1 v 1 – Defending',
  39: 'Defending Transition (U9/U10)', 40: 'Pass & Control – Defending Process (U11/U12)',
  41: '1 v 1 – 50/50 Contest', 42: '1 v 1 Finishing',
  43: 'Shooting Technique', 44: 'Attacking Transition',
  45: 'Shielding (Junior Summer)', 46: '1 v 1 Competitiveness (Youth Summer)',
  47: 'Defending 1 v 1 + Underload (Youth Summer)'
};

// Parse rels file to get rId -> image mapping
function parseRels(slideNum) {
  const relsFile = path.join(relsDir, `slide${slideNum}.xml.rels`);
  if (!fs.existsSync(relsFile)) return {};
  const content = fs.readFileSync(relsFile, 'utf8');
  const map = {};
  const regex = /Id="(rId\d+)"[^>]*Type="[^"]*image"[^>]*Target="\.\.\/media\/(image\d+\.png)"/g;
  let match;
  while ((match = regex.exec(content)) !== null) {
    map[match[1]] = match[2];
  }
  return map;
}

// Parse slide XML to get image positions
function parseSlide(slideNum) {
  const slideFile = path.join(slidesDir, `slide${slideNum}.xml`);
  if (!fs.existsSync(slideFile)) return [];
  const content = fs.readFileSync(slideFile, 'utf8');
  
  // Find all p:pic elements with their embed rId and x position
  const pics = [];
  // Match p:pic blocks
  const picRegex = /<p:pic>.*?<\/p:pic>/gs;
  let picMatch;
  while ((picMatch = picRegex.exec(content)) !== null) {
    const picXml = picMatch[0];
    // Get rId from blip
    const rIdMatch = picXml.match(/r:embed="(rId\d+)"/);
    // Get x position from xfrm
    const xMatch = picXml.match(/<a:off x="(\d+)"/);
    // Get width
    const wMatch = picXml.match(/<a:ext cx="(\d+)"/);
    
    if (rIdMatch && xMatch) {
      pics.push({
        rId: rIdMatch[1],
        x: parseInt(xMatch[1]),
        width: wMatch ? parseInt(wMatch[1]) : 0
      });
    }
  }
  return pics;
}

// Session column boundaries (from slide XML analysis)
// Column 1: x ~93k (Session 1 / Technical Work)
// Column 2: x ~2.7M (Session 2 / Focus Drill #1)  
// Column 3: x ~5.3M (Session 3 / Focus Drill #2)
// Column 4: x ~7.9M (Session 4 / Game)
// Logo: x ~9.7M (top right corner, small)
function getSessionFromX(x, width) {
  // Skip very small images (logos) or images at top-right
  if (x > 9000000) return 'logo';
  if (width < 1000000 && x > 9000000) return 'logo';
  
  if (x < 1500000) return 1;
  if (x < 4000000) return 2;
  if (x < 6500000) return 3;
  if (x < 9000000) return 4;
  return 'other';
}

// Process all slides (1-47, skip duplicates 48-61)
console.log('=== BAILEY SLIDE IMAGE → SESSION MAPPING ===\n');
console.log('Format: Slide # | Lesson Name | Session 1 Image | Session 2 Image | Session 3 Image | Session 4 Image\n');

const fullMapping = [];

for (let i = 1; i <= 47; i++) {
  const relsMap = parseRels(i);
  const pics = parseSlide(i);
  const lessonName = slideHeaders[i] || `Slide ${i}`;
  
  const sessionImages = { 1: null, 2: null, 3: null, 4: null };
  
  pics.forEach(pic => {
    const session = getSessionFromX(pic.x, pic.width);
    const imageName = relsMap[pic.rId];
    if (session >= 1 && session <= 4 && imageName) {
      sessionImages[session] = imageName;
    }
  });
  
  console.log(`Slide ${i}: ${lessonName}`);
  console.log(`  S1: ${sessionImages[1] || '—'}  |  S2: ${sessionImages[2] || '—'}  |  S3: ${sessionImages[3] || '—'}  |  S4: ${sessionImages[4] || '—'}`);
  
  fullMapping.push({
    slide: i,
    lesson: lessonName,
    session1: sessionImages[1],
    session2: sessionImages[2],
    session3: sessionImages[3],
    session4: sessionImages[4]
  });
}

// Output as JSON for further processing
const outputPath = path.join(__dirname, '..', 'bailey-image-mapping.json');
fs.writeFileSync(outputPath, JSON.stringify(fullMapping, null, 2));
console.log(`\nJSON mapping saved to bailey-image-mapping.json`);
