{
  description = "Robofy Backend Development Environment";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-23.11";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs = { self, nixpkgs, flake-utils }:
    flake-utils.lib.eachDefaultSystem (system:
      let
        pkgs = nixpkgs.legacyPackages.${system};
        python = pkgs.python312;

        pythonPackages = python.pkgs;

        backendDependencies = with pythonPackages; [
          fastapi
          uvicorn
          python-dotenv
          pydantic
          pydantic-settings
          psycopg2
          asyncpg
          sqlalchemy
          alembic
          pytest
          httpx
          openai
          google-generativeai
          huggingface-hub
          requests
          aiohttp
          tenacity
          backoff
          python-multipart
          google-auth
          google-auth-httplib2
          google-auth-oauthlib
          google-api-python-client
          python-jose
          passlib
          bcrypt
          cryptography
          serpapi
          beautifulsoup4
          assemblyai
          twilio
          dependency-injector
          aiosqlite
          redis
          dash
          plotly
          pandas
          gunicorn
        ];

      in {
        devShells.default = pkgs.mkShell {
          buildInputs = [
            python
          ] ++ backendDependencies;

          shellHook = ''
            echo "Robofy Backend Development Environment"
            echo "Python version: $(python --version)"
            echo "Installed packages:"
            pip list
          '';
        };

        packages.default = pythonPackages.buildPythonPackage {
          pname = "robofy-backend";
          version = "0.1.0";
          src = ./backend;
          propagatedBuildInputs = backendDependencies;
        };
      }
    );
}