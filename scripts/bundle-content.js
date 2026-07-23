import fs from 'fs';
import path from 'path';

const contentDir = path.join(process.cwd(), 'content');
const modulesPath = path.join(contentDir, 'modules.json');
const commandsDir = path.join(contentDir, 'commands');
const outputPath = path.join(contentDir, 'bundle.json');

const bundle = {
  version: Date.now(), // Use timestamp as version
  modules: [],
  commands: []
};

if (fs.existsSync(modulesPath)) {
  bundle.modules = JSON.parse(fs.readFileSync(modulesPath, 'utf8'));
}

if (fs.existsSync(commandsDir)) {
  const files = fs.readdirSync(commandsDir);
  for (const file of files) {
    if (file.endsWith('.json')) {
      const data = JSON.parse(fs.readFileSync(path.join(commandsDir, file), 'utf8'));
      if (Array.isArray(data)) {
        bundle.commands.push(...data);
      } else {
        bundle.commands.push(data);
      }
    }
  }
}

fs.writeFileSync(outputPath, JSON.stringify(bundle, null, 2));
console.log(`Successfully bundled content into ${outputPath}`);
