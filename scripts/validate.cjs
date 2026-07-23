const fs = require('fs');
const path = require('path');
const Ajv = require('ajv');
const addFormats = require('ajv-formats');

const ajv = new Ajv({ allErrors: true });
addFormats(ajv);

const contentDir = path.join(__dirname, '..', 'content');
const commandsDir = path.join(contentDir, 'commands');

const commandSchema = JSON.parse(fs.readFileSync(path.join(contentDir, 'schema', 'command.schema.json'), 'utf-8'));
const moduleSchema = JSON.parse(fs.readFileSync(path.join(contentDir, 'schema', 'module.schema.json'), 'utf-8'));

const validateCommand = ajv.compile(commandSchema);
const validateModule = ajv.compile(moduleSchema);

let hasErrors = false;
const allIds = new Set();
const allRelatedIds = new Set();

function logError(file, message) {
  console.error(`\x1b[31m[ERROR]\x1b[0m ${file}: ${message}`);
  hasErrors = true;
}

function processId(id, file) {
  if (allIds.has(id)) {
    logError(file, `Duplicate ID found: "${id}"`);
  } else {
    allIds.add(id);
  }
}

// 1. Validate Modules
const modulesPath = path.join(contentDir, 'modules.json');
if (fs.existsSync(modulesPath)) {
  const modules = JSON.parse(fs.readFileSync(modulesPath, 'utf-8'));
  if (!Array.isArray(modules)) {
    logError('modules.json', 'Expected an array of modules');
  } else {
    modules.forEach((mod, index) => {
      const valid = validateModule(mod);
      if (!valid) {
        logError(`modules.json[${index}]`, ajv.errorsText(validateModule.errors));
      } else {
        processId(mod.id, `modules.json[${index}]`);
      }
    });
  }
}

// 2. Validate Commands
if (fs.existsSync(commandsDir)) {
  const commandFiles = fs.readdirSync(commandsDir).filter(f => f.endsWith('.json'));
  commandFiles.forEach(file => {
    const filePath = path.join(commandsDir, file);
    try {
      const commands = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
      
      // Handle both array and single object for backwards compatibility during transition
      const commandArray = Array.isArray(commands) ? commands : [commands];
      
      commandArray.forEach((command, idx) => {
        const valid = validateCommand(command);
        if (!valid) {
          logError(`${file}[${idx}]`, ajv.errorsText(validateCommand.errors));
        } else {
          processId(command.id, `${file}[${idx}]`);
          if (command.related_ids) {
            command.related_ids.forEach(rid => allRelatedIds.add({ id: rid, source: `${file}[${idx}]` }));
          }
        }
      });
    } catch (e) {
      logError(file, `Failed to parse JSON: ${e.message}`);
    }
  });
}

// 3. Check broken related_ids
allRelatedIds.forEach(({ id, source }) => {
  if (!allIds.has(id)) {
    logError(source, `Broken related_id reference: "${id}" does not exist.`);
  }
});

if (hasErrors) {
  console.error('\x1b[31mValidation failed!\x1b[0m');
  process.exit(1);
} else {
  console.log('\x1b[32mValidation passed! All content files are valid.\x1b[0m');
}
