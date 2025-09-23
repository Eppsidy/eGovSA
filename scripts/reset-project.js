#!/usr/bin/env node

/**
 * This script is used to reset the project to a blank state.
 * It deletes or moves the /app, /components, /hooks, /scripts, and /constants directories to /app-example based on user input and creates a new /app directory with an index.tsx and _layout.tsx file.
 * You can remove the `reset-project` script from package.json and safely delete this file after running it.
 */

const fs = require("fs");
const path = require("path");
const readline = require("readline");

const root = process.cwd();
const oldDirs = ["app", "components", "hooks", "constants", "scripts"];
const exampleDir = "app-example";
const newAppDir = "app";
const exampleDirPath = path.join(root, exampleDir);

const indexContent = `import { Text, View } from "react-native";

export default function Index() {
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <Text>Edit app/index.tsx to edit this screen.</Text>
    </View>
  );
}
`;

const layoutContent = `import { Stack } from "expo-router";

export default function RootLayout() {
  return <Stack />;
}
`;

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const copyDirectory = async (src, dest) => {
  await fs.promises.mkdir(dest, { recursive: true });
  const entries = await fs.promises.readdir(src, { withFileTypes: true });
  
  for (let entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    
    if (entry.isDirectory()) {
      await copyDirectory(srcPath, destPath);
    } else {
      await fs.promises.copyFile(srcPath, destPath);
    }
  }
};

const deleteDirectoryWithRetry = async (dirPath, maxRetries = 3) => {
  for (let i = 0; i < maxRetries; i++) {
    try {
      await fs.promises.rm(dirPath, { recursive: true, force: true });
      return true;
    } catch (error) {
      if (i === maxRetries - 1) {
        console.log(`⚠️ Could not delete ${dirPath}: ${error.message}`);
        console.log(`Please manually delete this directory when possible.`);
        return false;
      }
      // Wait a bit before retrying
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
};

const moveDirectoryWithFallback = async (oldDirPath, newDirPath, dirName) => {
  try {
    // Try the fast rename first
    await fs.promises.rename(oldDirPath, newDirPath);
    console.log(`➡️ /${dirName} moved to /${exampleDir}/${dirName}.`);
    return true;
  } catch (error) {
    if (error.code === 'EPERM' || error.code === 'EBUSY' || error.code === 'ENOTEMPTY') {
      console.log(`⚠️ Direct move failed for /${dirName}, trying copy and delete method...`);
      try {
        // Fallback: copy then delete
        await copyDirectory(oldDirPath, newDirPath);
        console.log(`📁 /${dirName} copied to /${exampleDir}/${dirName}.`);
        
        const deleted = await deleteDirectoryWithRetry(oldDirPath);
        if (deleted) {
          console.log(`➡️ /${dirName} successfully moved to /${exampleDir}/${dirName}.`);
        } else {
          console.log(`📁 /${dirName} copied to /${exampleDir}/${dirName} (original may need manual deletion).`);
        }
        return true;
      } catch (copyError) {
        console.log(`❌ Failed to copy /${dirName}: ${copyError.message}`);
        return false;
      }
    } else {
      console.log(`❌ Failed to move /${dirName}: ${error.message}`);
      return false;
    }
  }
};

const moveDirectories = async (userInput) => {
  try {
    if (userInput === "y") {
      // Create the app-example directory
      await fs.promises.mkdir(exampleDirPath, { recursive: true });
      console.log(`📁 /${exampleDir} directory created.`);
    }

    // Move old directories to new app-example directory or delete them
    for (const dir of oldDirs) {
      const oldDirPath = path.join(root, dir);
      if (fs.existsSync(oldDirPath)) {
        if (userInput === "y") {
          const newDirPath = path.join(root, exampleDir, dir);
          await moveDirectoryWithFallback(oldDirPath, newDirPath, dir);
        } else {
          const deleted = await deleteDirectoryWithRetry(oldDirPath);
          if (deleted) {
            console.log(`❌ /${dir} deleted.`);
          }
        }
      } else {
        console.log(`➡️ /${dir} does not exist, skipping.`);
      }
    }

    // Create new /app directory
    const newAppDirPath = path.join(root, newAppDir);
    await fs.promises.mkdir(newAppDirPath, { recursive: true });
    console.log("\n📁 New /app directory created.");

    // Create index.tsx
    const indexPath = path.join(newAppDirPath, "index.tsx");
    await fs.promises.writeFile(indexPath, indexContent);
    console.log("📄 app/index.tsx created.");

    // Create _layout.tsx
    const layoutPath = path.join(newAppDirPath, "_layout.tsx");
    await fs.promises.writeFile(layoutPath, layoutContent);
    console.log("📄 app/_layout.tsx created.");

    console.log("\n✅ Project reset complete. Next steps:");
    console.log(
      `1. Run \`npx expo start\` to start a development server.\n2. Edit app/index.tsx to edit the main screen.${
        userInput === "y"
          ? `\n3. Delete the /${exampleDir} directory when you're done referencing it.`
          : ""
      }`
    );
  } catch (error) {
    console.error(`❌ Error during script execution: ${error.message}`);
  }
};

rl.question(
  "Do you want to move existing files to /app-example instead of deleting them? (Y/n): ",
  (answer) => {
    const userInput = answer.trim().toLowerCase() || "y";
    if (userInput === "y" || userInput === "n") {
      moveDirectories(userInput).finally(() => rl.close());
    } else {
      console.log("❌ Invalid input. Please enter 'Y' or 'N'.");
      rl.close();
    }
  }
);
