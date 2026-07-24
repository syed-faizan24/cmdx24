const fs = require('fs');
const path = require('path');

const map = {
  'recon_scanning.json': 'module-recon',
  'web_enumeration.json': 'module-web',
  'password_attacks.json': 'module-passwords',
  'exploitation.json': 'module-exploitation',
  'windows_privesc.json': 'module-privesc-win',
  'linux_privesc.json': 'module-privesc-linux',
  'active_directory.json': 'module-ad',
  'post_exploitation.json': 'module-post-exploit',
  'cracking_encoding.json': 'module-cracking',
  'reverse_shells.json': 'module-revshells',
  'thm_cybersec_101.json': 'module-thm-101'
};

const dir = './content/commands';
const files = fs.readdirSync(dir);

files.forEach(f => {
  if (!map[f]) return;
  const filePath = path.join(dir, f);
  const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));
  
  data.forEach(cmd => {
    // For THM, maybe it belongs to its original module too?
    // Let's just set the primary module ID for now.
    // If the file is thm_cybersec_101, it only belongs there.
    if (!cmd.module_ids) {
      cmd.module_ids = [map[f]];
    }
  });

  fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
});
console.log('Done migrating module_ids');
