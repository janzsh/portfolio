{
  description = "janzsh portfolio (Astro + Solid/Preact islands)";

  inputs.nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";

  outputs = { self, nixpkgs }:
    let
      systems = [ "x86_64-linux" "aarch64-linux" ];
      forAll = f: nixpkgs.lib.genAttrs systems (s: f nixpkgs.legacyPackages.${s});
    in {
      devShells = forAll (pkgs: {
        default = pkgs.mkShell {
          packages = [
            pkgs.pnpm
            pkgs.nodejs
            pkgs.agent-browser
            pkgs.chromium
          ];

          # El Chrome descargado por agent-browser no corre en NixOS: usar el de nixpkgs.
          AGENT_BROWSER_EXECUTABLE_PATH = "${pkgs.chromium}/bin/chromium";

          # chrome-launcher (the CI audit) reads this to find a browser.
          CHROME_PATH = "${pkgs.chromium}/bin/chromium";
        };
      });
    };
}
