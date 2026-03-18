<div align="center">

<img src="src-tauri/icons/256x256.png" alt="Arabic Teleprompter" width="120" />

# التلقين العربي · Arabic Teleprompter

**Professional teleprompter built for Arabic content — RTL-native, broadcast-ready.**

[![Version](https://img.shields.io/badge/version-0.5.0-blue?style=flat-square)](https://github.com/HassanAlsheikh/ArabicTeleprompter/releases)
[![Tauri](https://img.shields.io/badge/Tauri-2.0-24C8D8?style=flat-square&logo=tauri&logoColor=white)](https://tauri.app)
[![SvelteKit](https://img.shields.io/badge/SvelteKit-2.x-FF3E00?style=flat-square&logo=svelte&logoColor=white)](https://kit.svelte.dev)
[![Platform](https://img.shields.io/badge/platform-macOS%20·%20Windows%20·%20Linux-555?style=flat-square)](#building-from-source)
[![License](https://img.shields.io/badge/license-MIT-green?style=flat-square)](LICENSE)

</div>

---

![Arabic Teleprompter — editor view](docs/screenshots/editor.png)

---

## What is this?

Arabic Teleprompter is a native desktop app for broadcasters, presenters, and content creators who work in Arabic. It treats RTL text, Arabic typography, and tashkeel (diacritics) as first-class concerns — not afterthoughts.

Write or import your script, configure your display settings, and roll. The text scrolls smoothly at exactly the pace you set. When you need a second screen for talent, open one with a single click.

---

## Features

| | Feature | Description |
|---|---|---|
| ✍️ | **Rich Arabic editor** | Full formatting — bold, italic, underline, text color, highlight |
| 🔤 | **4 Arabic typefaces** | Amiri · Cairo · Noto Naskh Arabic · Tajawal |
| 🎚️ | **Live controls** | Adjust font size and scroll speed without leaving the teleprompter |
| 🪞 | **Mirror mode** | Flip the display horizontally for reflective teleprompter glass setups |
| 📺 | **Dual-screen output** | Open a dedicated full-screen display on a second monitor |
| 📂 | **File import** | Drag and drop `.txt` or `.docx` files directly onto the window |
| حركات | **Tashkeel toggle** | Show or hide diacritics during broadcast with one tap |
| ↔️ | **Per-paragraph direction** | Mix RTL and LTR in the same script (for bilingual content) |
| 📍 | **Reading guide** | Subtle line at eye level keeps the presenter anchored |
| 💾 | **Session recovery** | Automatically restores scroll position if the app closes unexpectedly |
| ⌨️ | **Keyboard shortcuts** | Full keyboard control during broadcast |

---

## Screenshots

<table>
  <tr>
    <td align="center">
      <img src="docs/screenshots/editor.png" alt="Script Editor" width="460" />
      <br /><sub><b>Script Editor</b> — write and format your script before going live</sub>
    </td>
    <td align="center">
      <img src="docs/screenshots/teleprompter.png" alt="Teleprompter View" width="460" />
      <br /><sub><b>Teleprompter View</b> — full-screen, distraction-free scrolling</sub>
    </td>
  </tr>
  <tr>
    <td align="center">
      <img src="docs/screenshots/settings.png" alt="Settings Panel" width="460" />
      <br /><sub><b>Settings Panel</b> — font, speed, line height, margins</sub>
    </td>
    <td align="center">
      <img src="docs/screenshots/dual-screen.png" alt="Dual-Screen Talent Display" width="460" />
      <br /><sub><b>Dual-Screen Mode</b> — clean display for the talent on a second monitor</sub>
    </td>
  </tr>
</table>

---

## How to Use

### 1 · Write your script

Open the app and type directly in the editor — or drag a `.txt` or `.docx` file onto the window to import it instantly.

Use the formatting toolbar to mark up your script:

- **غ** Bold · **م** Italic · **خ** Underline
- Text color and highlight — useful for marking cues, questions, or transitions
- **فاصل** — insert a segment divider to mark scene or topic breaks
- Direction toggle (← →) — switch individual paragraphs between RTL and LTR

### 2 · Configure your display

Click the **⚙** icon in the toolbar to open Settings:

| Setting | Range | Default |
|---|---|---|
| Font size | 24 – 120 px | 56 px |
| Scroll speed | 0.5 – 10 | 2 |
| Font | Amiri / Cairo / Noto Naskh / Tajawal | Amiri |
| Line height | 1.2 – 3.5 | 2.0 |
| Margins | 2 – 25 % | 10 % |
| Mirror mode | on / off | off |
| Tashkeel | on / off | on |

Settings are saved automatically between sessions.

### 3 · Go live

Press the **بث** button in the toolbar. The editor disappears and your script fills the screen.

### 4 · Control during broadcast

| Key | Action |
|---|---|
| `Space` | Play / Pause |
| `↑` / `↓` | Scroll up / down |
| `Page Up` / `Page Down` | Jump by large step |
| `+` / `−` | Increase / decrease speed |
| `M` | Toggle mirror mode |
| `Mouse wheel` | Manual scroll |
| `Esc` | Return to editor |

The control bar auto-hides after 5 seconds. Tap the pencil icon (bottom-left) to bring it back.

### 5 · Dual-screen setup

Click the **monitor icon** in the control bar. A full-screen window opens on your secondary display — clean text with no UI chrome. The presenter sees only the script; you keep controls on your primary screen.

---

## Building from Source

Arabic Teleprompter is a [Tauri 2.0](https://tauri.app) app. You need Node.js and Rust.

### Prerequisites

| Tool | Version | Install |
|---|---|---|
| Node.js | 20 + | [nodejs.org](https://nodejs.org) |
| pnpm | 9 + | `npm install -g pnpm` |
| Rust | stable | [rustup.rs](https://rustup.rs) |
| Tauri system deps | — | [tauri.app/start/prerequisites](https://tauri.app/start/prerequisites/) |

On **macOS**, also install Xcode Command Line Tools:

```bash
xcode-select --install
```

### Clone and install

```bash
git clone https://github.com/HassanAlsheikh/ArabicTeleprompter.git
cd ArabicTeleprompter
pnpm install
```

### Run in development

```bash
pnpm tauri dev
```

This starts the Vite dev server on `localhost:1420` and opens the native desktop window with hot reload.

### Build for distribution

```bash
pnpm tauri build
```

Bundled outputs land in `src-tauri/target/release/bundle/`:

| Platform | Output formats |
|---|---|
| macOS | `.dmg`, `.app` |
| Windows | `.exe` (NSIS), `.msi` |
| Linux | `.deb`, `.AppImage`, `.rpm` |

The app is fully standalone. No server, no internet connection required at runtime.

---

## Tech Stack

- **[Tauri 2.0](https://tauri.app)** — Rust-powered native shell, tiny install footprint
- **[SvelteKit 2](https://kit.svelte.dev) + [Svelte 5](https://svelte.dev)** — reactive UI with runes
- **[TipTap 3](https://tiptap.dev)** — rich text editor with custom Arabic extensions
- **[Vite 7](https://vitejs.dev)** — fast dev and build tooling
- **Arabic fonts** via [@fontsource](https://fontsource.org): Amiri, Cairo, Noto Naskh Arabic, Tajawal

---

## Contributing

Pull requests are welcome. For significant changes, open an issue first to discuss your approach.

---

## License

MIT
