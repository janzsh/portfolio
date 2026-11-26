---
name: "dotfiles"
year: "2026"
type: "personal"
kind: "script"
role: "Author"
summary: "My whole machine as code: NixOS with flakes and home-manager, two interchangeable Wayland compositors and a hand-written desktop shell in QML."
skills: ["Nix", "NixOS", "QML", "Lua", "Bash", "Python"]
picture: "../../../assets/pictures/projects/dotfiles.png"
repo: "https://github.com/janzsh/dotfiles"
score: 60
---
**Problem.** Setting up a development machine by hand is slow and never comes out the same twice, and a desktop assembled from a dozen third-party tools is hard to keep consistent.

**Approach.** A Nix flake reproduces the system and the user setup with a single `nixos-rebuild switch`. Packages and services stay in Nix; the editable config is linked straight to the repository, so changes show up instantly without a rebuild. About 5,800 lines of QML (Quickshell) replace the launcher, lock screen, dock, clipboard history, on-screen displays and system widgets. A small bridge translates sway and Hyprland events into one state file, so the shell does not care which compositor is running, and one `theme set` command recolors every program live. Neovim is modular, one file per plugin and per language, with LSP servers, debuggers and test adapters provided by Nix.

**Result.** A machine I can rebuild from a clone, and a desktop I understand down to the last widget.
