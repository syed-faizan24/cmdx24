# Cmdx24

Cmdx24 is a cross-platform, offline-first command reference and cheat sheet tool built for penetration testers, security engineers, and developers. It organizes complex commands, tools, and scripts into searchable, scenario-driven modules.

![Screenshot Placeholder](https://via.placeholder.com/800x450?text=Cmdx24+Screenshot)

## Features
- **Offline-First:** All content is bundled directly with the application. No internet connection is required to search for commands.
- **Scenario-Driven:** Commands are tagged with scenarios (e.g. "port-scanning", "privesc") allowing you to filter by the task at hand, not just the tool name.
- **High-Contrast Terminal Aesthetic:** Designed for long-form technical sessions with a dark-mode first interface and precise typography.
- **OTA Content Updates:** You can optionally pull the latest command reference updates directly from GitHub without needing to reinstall the app.

## Installation

### Windows
1. Go to the [Releases](https://github.com/YOUR_GITHUB_USERNAME/cmdx24/releases) page.
2. Download the `.msi` or `.exe` installer for the latest version.
3. **SmartScreen Warning:** Because v1 is an unsigned binary, Windows SmartScreen may block the execution. To bypass:
   - Click **More info** on the SmartScreen popup.
   - Click **Run anyway**.
4. Follow the installation wizard.

### Linux (Debian / Kali-based)
1. Go to the [Releases](https://github.com/YOUR_GITHUB_USERNAME/cmdx24/releases) page.
2. Download the `.deb` package.
3. Install via apt:
   ```bash
   sudo apt install ./cmdx24_1.0.0_amd64.deb
   ```

### Linux (AppImage)
1. Download the `.AppImage` file.
2. Make it executable:
   ```bash
   chmod +x Cmdx24-1.0.0.AppImage
   ```
3. Run the application:
   ```bash
   ./Cmdx24-1.0.0.AppImage
   ```

## Disclaimer
> **Educational & Authorized Use Only**  
> The command syntax and techniques provided in this application are strictly for educational purposes and authorized security testing. You must ensure you have explicit, documented permission to test any networks or systems. The authors are not responsible for any misuse or damage caused by the use of this tool.

## Contributing
Cmdx24 is open to community contributions! To add a new command:
1. Review the JSON schema in `/content/schema`.
2. Add your original content to the appropriate JSON file in `/content/commands`.
3. Submit a Pull Request.

Please note: All contributed content must be your own original writing and not directly copied from copyrighted sources (e.g. avoid direct copy-pasting from commercial documentation).

## License
MIT License. See `LICENSE` for details. Both the application code and the bundled content entries are provided under this license.
