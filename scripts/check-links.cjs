const fs = require('fs');
const path = require('path');

const commandsDir = path.join(__dirname, '../content/commands');
const files = fs.readdirSync(commandsDir);

let allCommandIds = new Set();
let commandEntries = [];

// Load all commands and track their IDs
for (const file of files) {
  if (file.endsWith('.json')) {
    const data = JSON.parse(fs.readFileSync(path.join(commandsDir, file), 'utf8'));
    if (Array.isArray(data)) {
      data.forEach(cmd => {
        allCommandIds.add(cmd.id);
        commandEntries.push(cmd);
      });
    } else {
      allCommandIds.add(data.id);
      commandEntries.push(data);
    }
  }
}

// Check for broken related_ids
let brokenLinks = 0;
for (const cmd of commandEntries) {
  if (cmd.related_ids) {
    for (const refId of cmd.related_ids) {
      if (!allCommandIds.has(refId)) {
        console.error(`Broken link in command '${cmd.id}': related_id '${refId}' does not exist.`);
        brokenLinks++;
      }
    }
  }
}

if (brokenLinks === 0) {
  console.log('All related_ids links are valid!');
} else {
  console.error(`Found ${brokenLinks} broken related_ids.`);
}
