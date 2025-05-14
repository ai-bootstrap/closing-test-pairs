#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const buildGradlePath = path.join('android', 'app', 'build.gradle');

if (fs.existsSync(buildGradlePath)) {
  try {
    let content = fs.readFileSync(buildGradlePath, 'utf8');

    // 移除现有的 configurations.all 块
    content = content.replace(/configurations\.all\s*\{[\s\S]*?\}/g, '');

    // 在 apply plugin: "com.facebook.react" 后添加新的配置
    const reactPluginRegex = /apply\s+plugin:\s*"com\.facebook\.react"/;
    if (reactPluginRegex.test(content)) {
      const newConfig = `
configurations.all {
    resolutionStrategy {
        force "androidx.browser:browser:1.6.0"
        force "androidx.core:core:1.13.1"
        force "androidx.versionedparcelable:versionedparcelable:1.1.1"
        exclude group: "com.android.support"
        exclude module: "support-v4"
        exclude module: "support-annotations"
        exclude module: "support-compat"
        exclude module: "customtabs"
    }
}`;

      content = content.replace(reactPluginRegex, `$&\n${newConfig}`);
      fs.writeFileSync(buildGradlePath, content);
      console.log('Successfully updated build.gradle');
    } else {
      console.log('Could not find React plugin in build.gradle');
    }
  } catch (err) {
    console.error('Error updating build.gradle:', err);
  }
} else {
  console.log('build.gradle not found at:', buildGradlePath);
}
