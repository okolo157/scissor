const fs = require("fs");
const path = require("path");

// Function to copy directory recursively
function copyDir(src, dest) {
  // Create destination directory if it doesn't exist
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }

  // Read contents of source directory
  const entries = fs.readdirSync(src, { withFileTypes: true });

  // Copy each entry
  for (let entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      // Recursively copy subdirectories
      copyDir(srcPath, destPath);
    } else {
      // Copy files
      fs.copyFileSync(srcPath, destPath);
      console.log(`Copied ${srcPath} to ${destPath}`);
    }
  }
}

// Define source and destination paths
const frontendDistPath = path.join(__dirname, "..", "..", "client-app", "dist");
const serverDistPath = path.join(__dirname, "..", "dist");

// Check if frontend dist directory exists
if (!fs.existsSync(frontendDistPath)) {
  console.error(
    "Frontend dist directory not found. Please build the frontend first."
  );
  process.exit(1);
}

// Copy frontend build files to server dist directory
console.log("Copying frontend build files to server dist directory...");
copyDir(frontendDistPath, serverDistPath);
console.log("Frontend files copied successfully!");
