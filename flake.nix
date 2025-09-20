{
  description = "Robofy Backend Development Environment";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-unstable";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs = { self, nixpkgs, flake-utils }:
    flake-utils.lib.eachDefaultSystem (system:
      let
        pkgs = nixpkgs.legacyPackages.${system};
        python = pkgs.python312;

        pythonPackages = python.pkgs;

        # Packages that are not available in nixpkgs will be installed via pip
        unavailablePackages = [
          "serpapi"
          "assemblyai"
        ];

        backendDependencies = with pythonPackages; [
          fastapi
          uvicorn
          python-dotenv
          pydantic
          # pydantic-settings is broken in nixpkgs, will install via pip
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
          beautifulsoup4
          # assemblyai is not available in nixpkgs, will install via pip
          twilio
          dependency-injector
          aiosqlite
          redis
          dash
          plotly
          pandas
          gunicorn
          cython  # Add cython for building dependency-injector
        ];

      in {
        devShells.default = pkgs.mkShell {
          buildInputs = [
            python
          ] ++ backendDependencies;

          shellHook = ''
            echo "Robofy Backend Development Environment"
            echo "Python version: $(python --version)"
            # Install packages not available in nixpkgs via pip
            pip install pydantic-settings ${builtins.toString unavailablePackages}
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