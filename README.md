<div align="center">

<!-- Logo -->
<pre>
███████╗ ██████╗ ██████╗  ██████╗ ███████╗
██╔════╝██╔═══██╗██╔══██╗██╔════╝ ██╔════╝
█████╗  ██║   ██║██████╔╝██║  ███╗█████╗  
██╔══╝  ██║   ██║██╔══██╗██║   ██║██╔══╝  
██║     ╚██████╔╝██║  ██║╚██████╔╝███████╗
╚═╝      ╚═════╝ ╚═╝  ╚═╝ ╚═════╝ ╚══════╝
</pre>

<h3>Recreate your entire development environment in seconds.</h3>

<!-- Typing Animation -->
<p>
  <img src="https://readme-typing-svg.demolab.com?font=JetBrains+Mono&weight=500&size=18&duration=2500&pause=1000&color=22C55E&center=true&vCenter=true&width=500&lines=forge+profile+apply+web-dev;Setup+your+machine+instantly;Safe.+Fast.+Unix-native." />
</p>

<!-- Badges -->
<p>
  <img src="https://img.shields.io/badge/License-LOEL-22c55e?style=flat-square" />
  <img src="https://img.shields.io/badge/Platform-macOS%20%7C%20Linux-6366f1?style=flat-square" />
  <img src="https://img.shields.io/badge/TypeScript-5.x-3178c6?style=flat-square" />
  <img src="https://img.shields.io/badge/Node.js-18%2B-339933?style=flat-square" />
  <img src="https://img.shields.io/badge/Status-Active-22c55e?style=flat-square" />
    <a href="https://www.npmjs.com/package/@ribershamoelias/forge"><img src="https://img.shields.io/npm/v/@ribershamoelias/forge?color=cb3837&label=npm&style=flat-square" /></a>
</p>

<!-- Command Box -->
<pre>
<code>npx forge setup</code>
</pre>

  <!-- NPM Package -->
  <p>
    <a href="https://www.npmjs.com/package/@ribershamoelias/forge">@ribershamoelias/forge on npm</a>
  </p>

</div>

---


---

## What is Forge?

**Forge** is a Unix-native, production-grade CLI tool that automates and standardizes your entire developer environment — from tool installation and editor setup to shell configuration and reproducible profiles.

No more hours lost on fresh machines. No more "works on my machine". Forge makes onboarding, recovery, and environment sharing instant, safe, and reliable.

---


---

## Why Forge?

Setting up a dev environment is tedious, fragile, and slow:

- Chasing down the right versions of Git, Node, Python, Docker, ...
- Manually configuring your shell and aliases
- Reinstalling VS Code extensions from memory
- Debugging PATH issues and broken configs
- Repeating everything for every new machine or teammate

**Forge solves all of it.**

---


---

## 🚀 Features

- **One-command environment cloning:** Instantly recreate your full dev setup on any machine.
- **Profiles:** Save, list, and apply named environment profiles (`forge profile save/apply/list`).
- **Doctor diagnostics:** Check for missing or outdated tools (`forge doctor`).
- **Safe system changes:** No overwrites, always backs up, idempotent.
- **Unix-native:** Built for macOS and Linux, detects your OS and package manager.
- **Presets:** Use and share reusable environment definitions (`forge setup --preset <name>`).
- **Editor & shell integration:** Sets up VS Code, shell, aliases, and PATH safely.
- **Extensible:** Add tools, editors, and presets via `forge.json` and `presets/`.

---

## 💻 Demo

```sh
$ forge profile apply web-dev
✔ Installing: git, node, docker, zsh...
✔ Setting up aliases and shell config...
✔ All done! Your environment matches the 'web-dev' profile.
```

---


## ⚡ Quick Start

### Install via npm (recommended)

```sh
npm install -g @ribershamoelias/forge
```

### Or use npx (no install required)

```sh
npx @ribershamoelias/forge setup
```

### Or use the legacy install script (macOS & Linux)

```sh
curl -fsSL https://forge.sh/install | sh
```

### Apply a profile

```sh
forge profile apply web-dev
```

---

## 🛡️ Safety First

- **No Overwrites:** Never destroys your existing configs.
- **Backups:** Always creates a backup before making changes.
- **Idempotent:** Running the same command twice is always safe.

---

## 📦 Commands Overview

- `forge setup` — Install all tools and configs from your config or preset.
- `forge doctor` — Diagnose missing or outdated tools.
- `forge list` — List installed tools and their status.
- `forge clean` — Remove unused tools (planned).
- `forge profile save <name>` — Save your current environment as a profile.
- `forge profile apply <name>` — Recreate your environment from a profile.
- `forge profile list` — List all saved profiles.

---

## 🧠 How it Works (Technical Deep Dive)

- **Modular CLI:** Each command is a separate module, registered via Commander.js.
- **Config-driven:** Loads `forge.json` and merges with presets for flexible, reusable setups.
- **Tool installation:** Supports `brew`, `apt`, and `pacman` — detected automatically.
- **Profile system:** Profiles are portable JSON files in `~/.forge/profiles` (tools, shell, aliases, creation date).
- **Shell & editor integration:** Safely detects and configures Zsh/Bash, merges aliases, sets up VS Code and extensions.
- **Logger & Timer:** Consistent, icon-rich, and time-tracked output for every step.
- **Safety:** All file and shell operations are idempotent and create backups before changes.
- **Extensibility:** Add new tools, editors, or presets by editing config files — no code changes needed.
- **Error handling:** All errors are caught and reported with actionable suggestions.

---

## 🖥️ Supported Systems

- macOS (Intel & Apple Silicon)
- Linux (Debian, Ubuntu, Arch, Fedora, etc.)

---

## 🤝 Contributing

PRs and issues welcome! See [CONTRIBUTING.md](CONTRIBUTING.md).

---

## ⭐ Support

If you find Forge useful, star the repo and share your feedback!

---

## Roadmap

- [ ] Advanced cleanup logic (`forge clean`)
- [ ] Interactive prompts for risky changes
- [ ] More robust preset/config validation
- [ ] Enhanced editor integration
- [ ] Community presets

---

## License

LOEL 1.0

Jump-start with opinionated, curated setups:

```bash
forge setup --preset web-dev      # React, Node, ESLint, Prettier
forge setup --preset backend      # Python, Docker, PostgreSQL tools
forge setup --preset fullstack    # Everything, batteries included
forge setup --preset minimal      # Bare essentials only
```

### 🗂️ Profile System

Capture and reproduce your exact environment — anywhere:

```bash
forge profile save my-setup       # Snapshot current tools, shell, aliases
forge profile list                 # List all saved profiles
forge profile apply my-setup      # Restore a full environment from profile
```

Profiles are stored as portable JSON in `~/.forge/profiles` — version-controllable, shareable, and human-readable.

---

## Commands

```
forge setup [options]          Run full environment setup
forge doctor                   Check for missing or outdated tools
forge list                     List installed tools and their versions
forge clean                    Remove unused tools
forge profile save <name>      Save the current environment as a profile
forge profile list             List all saved profiles
forge profile apply <name>     Apply a saved profile to this machine
```

### Options

| Flag | Description |
|------|-------------|
| `--preset <name>` | Apply a named preset from `presets/` |
| `--config <path>` | Use a custom config file |
| `--dry-run` | Preview all changes without applying them |
| `--silent` | Suppress all output |
| `--verbose` | Enable detailed logging |

---

## Configuration

Forge is driven by a single `forge.json` file at the root of your project or home directory:

```json
{
  "tools": ["git", "node", "python", "docker"],
  "editor": {
    "name": "vscode",
    "extensions": ["esbenp.prettier-vscode", "dbaeumer.vscode-eslint", "eamodio.gitlens"]
  },
  "terminal": {
    "shell": "zsh",
    "aliases": {
      "gs":  "git status",
      "gp":  "git push",
      "ll":  "ls -la",
      "dev": "npm run dev"
    }
  }
}
```

Presets live in `presets/` and are merged with the base config at runtime. You can create your own.

---

## Installation

**From source:**

```bash
git clone https://github.com/yourusername/forge
cd forge
npm install
npm run build
npm link          # Makes `forge` available globally
```

**Homebrew (coming soon):**

```bash
brew install forge
```

---

## Supported Platforms

| Platform | Status |
|----------|--------|
| macOS 12+ | ✅ Fully supported |
| Ubuntu / Debian | ✅ Fully supported |
| Arch Linux | ✅ Fully supported |
| Other Linux (apt/pacman) | ⚠️ Experimental |
| Windows | 🔜 Planned |

---

## Architecture

Forge is implemented in **TypeScript** with a clean, strictly modular layout:

```
src/
├── cli.ts                  # CLI entry point (Commander.js)
├── core/
│   ├── setup.ts            # Main setup orchestration
│   ├── doctor.ts           # Environment health checks
│   ├── clean.ts            # Tool cleanup
│   ├── list.ts             # Installed tool listing
│   └── profile.ts          # Profile save / list / apply
└── lib/
    ├── logger.ts            # Unified logging with icons, colors, timing
    ├── config.ts            # Config loading and preset merging
    ├── tools.ts             # Multi-package-manager installation logic
    ├── terminal.ts          # Shell detection and safe config editing
    ├── exec.ts              # Shell command execution + dry-run support
    ├── version.ts           # Tool version detection and comparison
    └── detect.ts            # OS and package manager detection
```

Key design principles:

- **Strict modularity** — every command is its own isolated module
- **Idempotent operations** — always safe to re-run
- **Backup-first writes** — shell configs are backed up before any modification
- **Dry-run support** — every operation can be previewed without side effects
- **Consistent UX** — all output runs through a central logger with step progress and timing

---

## Roadmap

- [x] Core CLI architecture
- [x] Multi-package-manager support (`brew`, `apt`, `pacman`)
- [x] Profile system (save, list, apply)
- [x] Dry-run mode
- [x] Doctor command
- [ ] Plugin system
- [ ] Interactive prompts for risky changes
- [ ] Windows support
- [ ] Homebrew tap
- [ ] Cloud sync for profiles
- [ ] GUI companion app

---

## Contributing

Contributions are welcome and appreciated.

1. Fork the repository
2. Create a feature branch: `git checkout -b feat/my-feature`
3. Make your changes and commit them
4. Open a pull request with a clear description

For larger changes, **open an issue first** to align on approach before writing code.

Please keep PRs focused. One feature or fix per pull request.

---

## Inspiration

Forge stands on the shoulders of excellent tools:

- [Homebrew](https://brew.sh) — the gold standard for package management on macOS
- [Oh My Zsh](https://ohmyz.sh) — shell configuration for humans
- [nvm](https://github.com/nvm-sh/nvm) / [pyenv](https://github.com/pyenv/pyenv) — version management done right

Built to go further than any of them individually.

---

## License

[LOEL](LICENSE) — free to use, modify, and distribute.

---

<div align="center">

**Forge aims to be the standard way developers set up their machines.**

From solo devs to entire engineering teams — environment setup should never be a bottleneck.  
Configure once. Reproduce anywhere.

---

If Forge saves you time, a ⭐ goes a long way — it helps more people find it.

</div>
