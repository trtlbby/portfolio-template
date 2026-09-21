const sharp = require("sharp");
const fs = require("fs");
const path = require("path");

const SOURCE_DIR = path.join(process.cwd(), "public", "images");
const OUTPUT_DIR = path.join(SOURCE_DIR, "optimized");

// Add your project screenshot filenames here
const IMAGE_JOBS = [
  // { name: "your-project.png", widths: [640, 960, 1280] },
];

async function optimizeOne(job) {
  const sourcePath = path.join(SOURCE_DIR, job.name);
  const base = job.name.replace(/\.[^.]+$/, "");

  if (!fs.existsSync(sourcePath)) {
    throw new Error(`Source image not found: ${sourcePath}`);
  }

  for (const width of job.widths) {
    const outputPath = path.join(OUTPUT_DIR, `${base}-${width}.webp`);
    await sharp(sourcePath)
      .resize({ width, withoutEnlargement: true })
      .webp({ quality: 76, effort: 5 })
      .toFile(outputPath);
  }
}

async function run() {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });

  for (const job of IMAGE_JOBS) {
    await optimizeOne(job);
  }

  console.log("Optimized images generated in public/images/optimized");
}

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
