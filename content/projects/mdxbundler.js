import { bundleMDX } from 'mdx-bundler';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Convert import.meta.url to a file path
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function bundleMdxFile() {
  try {
    // Since the script is in the same folder as access.mdx, use a relative path
    const filePath = path.join(__dirname, 'access.mdx');
    console.log('Reading MDX file from:', filePath);

    const mdxSource = fs.readFileSync(filePath, 'utf8');
    console.log('MDX content:', mdxSource.slice(0, 100) + '...'); // Log first 100 chars

    const result = await bundleMDX({
      source: mdxSource,
      cwd: __dirname, // Use the current directory as the working directory
    });

    if (!result.code) {
      throw new Error('No bundled code returned from mdx-bundler.');
    }

    // Save the bundled output to a file in the same folder
    const outputPath = path.join(__dirname, 'access.bundle.js');
    fs.writeFileSync(outputPath, result.code);

    console.log('MDX file bundled successfully! Output saved to:', outputPath);
  } catch (error) {
    console.error('Error bundling MDX file:', error);
  }
}

bundleMdxFile();