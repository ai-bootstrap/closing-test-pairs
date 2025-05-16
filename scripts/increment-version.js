const fs = require('fs');
const path = require('path');
// const { execSync } = require('child_process'); // 引入 child_process 模块用于执行命令
// Get package.json path
const packageJsonPath = path.join(process.cwd(), 'package.json');
const configFilePath = path.join(process.cwd(), 'app.config.ts');

// Read package.json file
const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));

// 解析版本号
const [major, minor, patch] = packageJson.version.split('.').map(Number);

// 更新 patch 版本号
packageJson.version = `${major}.${minor}.${patch + 1}`;

// 写回 package.json 文件
fs.writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2), 'utf8');

console.log(`Version updated to ${packageJson.version}`);

// 将更新后的 package.json 添加到 Git
// try {
//   execSync(`git add ${packageJsonPath}`);
//   console.log('Updated package.json added to Git staging area.');
// } catch (error) {
//   console.error('Failed to add package.json to Git staging area:', error);
// }

// // 提交版本更新
// try {
//   execSync(`git commit -m "chore: update version to ${packageJson.version}"`);
//   console.log(`Version update committed: ${packageJson.version}`);
// } catch (error) {
//   console.error('Failed to commit version update:', error);
// }

// Read the file content
fs.readFile(configFilePath, 'utf8', (err, data) => {
  if (err) {
    console.error('Error reading file:', err);
    return;
  }

  // Find the current versionCode
  const versionCodeRegex = /versionCode:\s*(\d+)/;
  const match = data.match(versionCodeRegex);

  if (!match) {
    console.error('Could not find versionCode in the file');
    return;
  }

  const currentVersionCode = parseInt(match[1], 10);
  const newVersionCode = currentVersionCode + 1;

  // Replace the versionCode with the incremented value
  const updatedData = data.replace(
    versionCodeRegex,
    `versionCode: ${newVersionCode}`
  );

  // Write the updated content back to the file
  fs.writeFile(configFilePath, updatedData, 'utf8', (err) => {
    if (err) {
      console.error('Error writing file:', err);
      return;
    }
    console.log(
      `Successfully updated versionCode from ${currentVersionCode} to ${newVersionCode}`
    );
  });
});
