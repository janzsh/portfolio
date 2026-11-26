---
name: "dotfiles"
year: "2026"
type: "personal"
kind: "script"
role: "Autor"
summary: "Mi máquina entera como código: NixOS con flakes y home-manager, dos compositores Wayland intercambiables y un shell de escritorio escrito a mano en QML."
skills: ["Nix", "NixOS", "QML", "Lua", "Bash", "Python"]
picture: "../../../assets/pictures/projects/dotfiles.png"
repo: "https://github.com/janzsh/dotfiles"
score: 60
---
**Problema.** Configurar a mano una máquina de desarrollo es lento y nunca queda igual dos veces, y un escritorio armado con una docena de herramientas de terceros es difícil de mantener coherente.

**Enfoque.** Un flake de Nix reproduce el sistema y la configuración de usuario con un solo `nixos-rebuild switch`. Paquetes y servicios quedan en Nix; la configuración editable se enlaza directo al repositorio, así los cambios se ven al instante sin reconstruir. Unas 5.800 líneas de QML (Quickshell) reemplazan el lanzador, la pantalla de bloqueo, el dock, el historial del portapapeles, los avisos en pantalla y los widgets del sistema. Un pequeño puente traduce los eventos de sway y de Hyprland a un mismo archivo de estado, así el shell no depende del compositor, y un solo comando `theme set` recolorea todos los programas en caliente. Neovim es modular, un archivo por plugin y por lenguaje, con servidores LSP, depuradores y adaptadores de tests que vienen de Nix.

**Resultado.** Una máquina que puedo reconstruir desde un clon y un escritorio que entiendo hasta el último widget.
