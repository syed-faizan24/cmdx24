const fs = require('fs');
const path = require('path');

const commandsDir = path.join(__dirname, '..', 'content', 'commands');

const dictionaries = {
  nmap: {
    "-sS": "TCP SYN scan (stealth)",
    "-sV": "Probe open ports to determine service/version info",
    "-sC": "Run default nmap scripts",
    "-p-": "Scan all 65535 ports",
    "-A": "Enable OS detection, version detection, script scanning, and traceroute",
    "-T4": "Aggressive timing template (faster scan)",
    "-p": "Specify ports to scan",
    "-oN": "Output scan in normal format",
    "-Pn": "Treat all hosts as online (skip host discovery)"
  },
  gobuster: {
    "dir": "Use directory/file enumeration mode",
    "-u": "The target URL",
    "-w": "Path to the wordlist",
    "-x": "File extensions to search for",
    "-t": "Number of concurrent threads"
  },
  ffuf: {
    "-u": "Target URL",
    "-w": "Wordlist file path and optional keyword",
    "-H": "Header data",
    "-X": "HTTP method to use",
    "-d": "POST data",
    "-mc": "Match HTTP status codes"
  },
  hydra: {
    "-l": "Login name",
    "-L": "Login wordlist",
    "-p": "Password",
    "-P": "Password wordlist",
    "-s": "Port number",
    "ssh": "Target service",
    "ftp": "Target service",
    "smb": "Target service"
  },
  smbclient: {
    "-L": "List available shares on the target",
    "-N": "No pass (use empty password)",
    "-U": "Username to connect as"
  },
  sqlmap: {
    "-u": "Target URL",
    "--dbs": "Enumerate DBMS databases",
    "--tables": "Enumerate DBMS database tables",
    "--dump": "Dump DBMS database table entries",
    "--batch": "Never ask for user input, use the default behavior"
  }
};

const optionalFlags = {
  nmap: [
    { flag: "-v", description: "Increase verbosity level (use -vv or more for greater effect)" },
    { flag: "-Pn", description: "Treat all hosts as online -- skip host discovery" },
    { flag: "-A", description: "Enable OS detection, version detection, script scanning, and traceroute" }
  ],
  gobuster: [
    { flag: "-k", description: "Skip TLS certificate verification" },
    { flag: "-t 50", description: "Run with 50 concurrent threads (default is 10)" }
  ],
  ffuf: [
    { flag: "-c", description: "Colorize output" },
    { flag: "-v", description: "Verbose output, printing full URLs and redirects" }
  ],
  hydra: [
    { flag: "-V", description: "Show login:pass for each attempt (Verbose)" },
    { flag: "-t 4", description: "Number of parallel connects per target" }
  ],
  sqlmap: [
    { flag: "--batch", description: "Never ask for user input, use the default behavior" },
    { flag: "--random-agent", description: "Use randomly selected HTTP User-Agent header value" }
  ]
};

function processCommands() {
  const files = fs.readdirSync(commandsDir).filter(f => f.endsWith('.json'));
  let updatedCount = 0;

  files.forEach(file => {
    const filePath = path.join(commandsDir, file);
    const data = JSON.parse(fs.readFileSync(filePath, 'utf8'));

    const updatedData = data.map(cmd => {
      const tool = cmd.tool ? cmd.tool.toLowerCase() : '';
      
      // Inject flag descriptions based on the command string
      if (dictionaries[tool]) {
        const flagDescs = {};
        Object.keys(dictionaries[tool]).forEach(flag => {
          if (cmd.command.includes(flag)) {
            flagDescs[flag] = dictionaries[tool][flag];
          }
        });
        
        if (Object.keys(flagDescs).length > 0) {
          cmd.flag_descriptions = flagDescs;
        }
      }

      // Inject optional flags based on the tool
      if (optionalFlags[tool]) {
        cmd.optional_flags = optionalFlags[tool];
        // Add [FLAGS] placeholder if not present, to ensure the UI inserts them nicely
        if (!cmd.command.includes('[FLAGS]')) {
           // Insert after tool name if simple, otherwise just append
           const parts = cmd.command.split(' ');
           if (parts[0].toLowerCase() === tool) {
               parts.splice(1, 0, '[FLAGS]');
               cmd.command = parts.join(' ');
           }
        }
      }

      return cmd;
    });

    fs.writeFileSync(filePath, JSON.stringify(updatedData, null, 2));
    updatedCount += updatedData.length;
  });

  console.log(`Successfully migrated and injected flags for ${updatedCount} commands!`);
}

processCommands();
