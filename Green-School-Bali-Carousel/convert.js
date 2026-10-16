const sharp = require('sharp');
const fs = require('fs');

(async () => {
  try {
    for (let i = 1; i <= 8; i++) {
      const input = `slide-${i}.svg`;
      const output = `slide-${i}.png`;
      if (fs.existsSync(input)) {
        console.log(`Converting ${input} to ${output}...`);
        await sharp(input)
          .png()
          .toFile(output);
        console.log(`Successfully generated ${output}`);
      } else {
        console.log(`File ${input} not found, skipping.`);
      }
    }
    console.log('All slides converted to PNG!');
  } catch (err) {
    console.error('Error during conversion:', err);
  }
})();
