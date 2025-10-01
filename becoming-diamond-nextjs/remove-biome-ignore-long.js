#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

const componentsDir = path.join(__dirname, "src", "components", "ui");

// Get all .tsx files in the components/ui directory
const files = fs
  .readdirSync(componentsDir)
  .filter((file) => file.endsWith(".tsx"));

files.forEach((file) => {
  const filePath = path.join(componentsDir, file);
  const content = fs.readFileSync(filePath, "utf8");

  // Remove the biome ignore line
  const newContent = content.replace(/^\/\/ biome-ignore lint\/suspicious\/noExplicitAny lint\/correctness\/useExhaustiveDependencies: aceternity component\n/m, '');

  if (content !== newContent) {
    fs.writeFileSync(filePath, newContent, "utf8");
    console.log(`Removed biome-ignore from ${file}`);
  } else {
    console.log(`No biome-ignore found in ${file}`);
  }
});

console.log(`\nProcessed ${files.length} .tsx files in src/components/ui`);

