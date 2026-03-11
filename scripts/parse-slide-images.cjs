// Parse all slide .rels files to map images to slides
// Cross-references with slide headers for lesson names
// Identifies shared template images, reused session images, and unique images

const fs = require('fs');
const path = require('path');

const relsDir = path.join(__dirname, '..', 'slides', '_rels');
const files = fs.readdirSync(relsDir).filter(f => f.endsWith('.xml.rels'));

const getSlideNum = (f) => parseInt(f.match(/slide(\d+)/)[1]);

const parseRels = (filename) => {
  const content = fs.readFileSync(path.join(relsDir, filename), 'utf8');
  const images = [];
  const regex = /Target="\.\.\/media\/(image\d+\.png)"/g;
  let match;
  while ((match = regex.exec(content)) !== null) {
    images.push(match[1]);
  }
  return images;
};

// Slide headers from our analysis (slide number -> lesson name)
const slideHeaders = {
  1: 'Shielding',
  2: '2 v 2s / Games',
  3: '1 v 1 – Defending',
  4: 'Pass & Control / Games',
  5: '1 v 1 – 50/50 Contest',
  6: 'Pass & Control',
  7: 'Shooting Technique – Laces',
  8: 'Pass & Control',
  9: '2 v 1 / 3 v 2 – Defending',
  10: 'Pass & Control',
  11: 'Ways to Break the Line',
  12: '1 v 1 – Turns',
  13: '1 v 1 – Shielding (U9/U10)',
  14: '1 v 1 – Shielding (U11/U12)',
  15: 'Pass & Control',
  16: '1 v 1 – Beating the Defender (U9/U10)',
  17: 'Pass & Control – Building Up',
  18: '1 v 1 – Dribbling',
  19: 'Kicking Techniques / Game Training (U11/U12)',
  20: 'Pass & Control – Receiving Under Pressure',
  21: 'Pass & Control',
  22: '1 v 1 – Attacking',
  23: '1 v 1 – Defending (U9/U10)',
  24: '1 v 1 – Travelling with the Ball',
  25: 'Shooting Technique – Laces',
  26: '1 v 1 Competitiveness',
  27: '2 v 1 / 3 v 2 – Defending',
  28: 'Pass & Control',
  29: '1 v 1 – Dribbling (Escaping Pressure)',
  30: 'Pass & Control – Escaping Pressure',
  31: '1 v 1 – Finishing',
  32: 'Pass & Control',
  33: 'Pass & Control – Building Up',
  34: '1 v 1 – Attacking (U9/U10)',
  35: 'Ways to Break the Line',
  36: 'Ways to Break the Line (DUPLICATE)',
  37: 'Pass & Control – Crossing & Finishing',
  38: '1 v 1 – Defending',
  39: 'Defending Transition (U9/U10)',
  40: 'Pass & Control – Defending Process (U11/U12)',
  41: '1 v 1 – 50/50 Contest',
  42: '1 v 1 Finishing',
  43: 'Shooting Technique',
  44: 'Attacking Transition',
  45: 'Shielding (Junior Summer Academy)',
  46: '1 v 1 Competitiveness (Youth Summer)',
  47: 'Defending 1 v 1 + Underload (Youth Summer)',
  48: '1 v 1 – Turns (DUP of 12)',
  49: 'Shooting Technique – Laces (DUP of 25)',
  50: '1 v 1 Competitiveness (DUP of 26)',
  51: '2 v 1 / 3 v 2 – Defending (DUP of 27)',
  52: 'Pass & Control (DUP of 28)',
  53: '1 v 1 – Dribbling Escaping (DUP of 29)',
  54: 'Pass & Control – Escaping Pressure (DUP of 30)',
  55: '1 v 1 – Finishing (DUP of 31)',
  56: 'Pass & Control (DUP of 32)',
  57: 'Pass & Control – Building Up (DUP of 33)',
  58: '1 v 1 – Attacking (DUP of 34)',
  59: 'Ways to Break the Line (DUP of 35)',
  60: 'Ways to Break the Line (DUP of 36)',
  61: 'Pass & Control – Crossing & Finishing (DUP of 37)'
};

// Build slide -> images map
const slideImages = {};
files.forEach(f => {
  const num = getSlideNum(f);
  slideImages[num] = parseRels(f);
});

// Count how many slides each image appears on
const imageCounts = {};
Object.values(slideImages).forEach(images => {
  images.forEach(img => {
    imageCounts[img] = (imageCounts[img] || 0) + 1;
  });
});

// Template images: on ALL or nearly all slides
const totalSlides = files.length;
const templateImages = Object.entries(imageCounts)
  .filter(([_, count]) => count > totalSlides * 0.8)
  .map(([img]) => img);

console.log('=== BAILEY SLIDES IMAGE MAPPING ===\n');
console.log(`Total slides: ${totalSlides}`);
console.log(`Total unique image files: ${Object.keys(imageCounts).length}`);
console.log(`\nTemplate images (on >${Math.round(totalSlides * 0.8)} slides — logo/background):`);
templateImages.forEach(img => console.log(`  ${img} — on ${imageCounts[img]} slides (SKIP)`));

console.log('\n=== PER-SLIDE MAPPING ===\n');

const sortedSlides = Object.keys(slideImages).map(Number).sort((a, b) => a - b);

// Output per-slide mapping with lesson names
const output = [];
sortedSlides.forEach(num => {
  const allImgs = slideImages[num];
  const contentImgs = allImgs.filter(img => !templateImages.includes(img));
  const lessonName = slideHeaders[num] || 'UNKNOWN';
  const isDup = lessonName.includes('DUP');
  
  console.log(`Slide ${num}: ${lessonName}`);
  console.log(`  Content images (${contentImgs.length}): ${contentImgs.join(', ')}`);
  
  // Check how many of these images are reused from other slides
  const reused = contentImgs.filter(img => imageCounts[img] > 3);
  const unique = contentImgs.filter(img => imageCounts[img] <= 3);
  if (reused.length > 0) {
    console.log(`  Reused across slides: ${reused.map(img => `${img}(${imageCounts[img]}x)`).join(', ')}`);
  }
  if (unique.length > 0) {
    console.log(`  Unique/rare: ${unique.map(img => `${img}(${imageCounts[img]}x)`).join(', ')}`);
  }
  console.log('');
  
  output.push({
    slide: num,
    lesson: lessonName,
    isDuplicate: isDup,
    contentImages: contentImgs,
    reusedImages: reused,
    uniqueImages: unique
  });
});

// Summary stats
const totalContentImages = new Set();
sortedSlides.forEach(num => {
  slideImages[num]
    .filter(img => !templateImages.includes(img))
    .forEach(img => totalContentImages.add(img));
});

console.log('\n=== SUMMARY ===');
console.log(`Total content images (excluding template): ${totalContentImages.size}`);
console.log(`Images reused across 4+ slides: ${[...totalContentImages].filter(img => imageCounts[img] >= 4).length}`);
console.log(`Images on 1-3 slides only: ${[...totalContentImages].filter(img => imageCounts[img] <= 3).length}`);

// Show most reused images
console.log('\n=== MOST REUSED IMAGES ===');
const sorted = Object.entries(imageCounts)
  .filter(([img]) => !templateImages.includes(img))
  .sort((a, b) => b[1] - a[1])
  .slice(0, 20);
sorted.forEach(([img, count]) => {
  const onSlides = sortedSlides.filter(n => slideImages[n].includes(img));
  console.log(`  ${img}: ${count} slides — [${onSlides.join(', ')}]`);
});
