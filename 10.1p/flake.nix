{
  description = "Node.js development environment";

  inputs = {
    nixpkgs.url = "github:nixos/nixpkgs?ref=nixos-unstable";
  };

  outputs = { self, nixpkgs }:
  let
    system = "x86_64-linux";
    pkgs = import nixpkgs {
      inherit system;
    };
  in
  {
    devShells.${system}.default = pkgs.mkShell {
      LD_LIBRARY_PATH = "${pkgs.stdenv.cc.cc.lib}/lib";
      PORT="3000";
      DB_HOST="127.0.0.1";
      DB_PORT="3306";
      DB_USER="root";
      DB_PASSWORD="Possward123!";
      DB_NAME="sit774";
    };
  };
}
