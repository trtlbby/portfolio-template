// Add your project images here: "your-image.png": { width: W, height: H }
const PROJECT_IMAGE_DIMENSIONS: Record<string, { width: number; height: number }> = {};

// Add optimized WebP srcsets here after running: npm run images:optimize
const PROJECT_IMAGE_WEBP_SRCSET: Record<string, string> = {};

export function getProjectImageDimensions(imageUrl: string) {
  const fileName = imageUrl.split("/").pop() ?? "";
  return PROJECT_IMAGE_DIMENSIONS[fileName] ?? { width: 16, height: 9 };
}

export function getProjectImageWebpSrcset(imageUrl: string): string | undefined {
  const fileName = imageUrl.split("/").pop() ?? "";
  return PROJECT_IMAGE_WEBP_SRCSET[fileName];
}
