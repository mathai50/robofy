{
  description = "Robofy Full Stack Development Environment";

  inputs = {
    nixpkgs.url = "github:NixOS/nixpkgs/nixos-24.11";
    flake-utils.url = "github:numtide/flake-utils";
  };

  outputs = { self, nixpkgs, flake-utils }:
    flake-utils.lib.eachDefaultSystem (system:
      let
        pkgs = nixpkgs.legacyPackages.${system};
        python = pkgs.python312;

        pythonPackages = python.pkgs;

        # Override dependency-injector to include Cython as nativeBuildInput and six as propagated build input
        dependency_injector_with_cython = pythonPackages.dependency-injector.overridePythonAttrs (old: {
          nativeBuildInputs = (old.nativeBuildInputs or []) ++ [ pythonPackages.cython ];
          propagatedBuildInputs = (old.propagatedBuildInputs or []) ++ [ pythonPackages.six ];
          doCheck = false;  # Disable tests to avoid missing module errors
        });

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
          dependency_injector_with_cython  # Use the overridden version (includes six)
          aiosqlite
          redis
          dash
          plotly
          pandas
          gunicorn
        ];

       # Common build inputs for both shells
       commonBuildInputs = [
         python
         pythonPackages.pip
         pythonPackages.virtualenv
         pkgs.nodejs_20  # Use Node.js 20 for better stability on macOS
         pkgs.nodePackages.npm  # npm package manager
         pkgs.yarn  # yarn package manager
       ];

       # Frontend-specific build tools
       frontendTools = with pkgs; [
         nodePackages.typescript
         nodePackages.typescript-language-server
         nodePackages.prettier
         nodePackages.eslint
         # jest is installed via npm, so not needed here
       ];

      in {

        devShells = {
          default = pkgs.mkShell {
            buildInputs = commonBuildInputs ++ backendDependencies ++ frontendTools;

            shellHook = ''
              echo "Robofy Full Stack Development Environment"
              echo "Python version: $(python --version)"
              echo "Node.js version: $(node --version)"
              echo "npm version: $(npm --version)"
              echo "TypeScript version: $(npx tsc --version || echo 'Not available')"
              
              # Create virtual environment for pip packages
              if [ ! -d ".venv" ]; then
                python -m venv .venv
                source .venv/bin/activate
                pip install pydantic-settings ${builtins.toString unavailablePackages}
              else
                source .venv/bin/activate
              fi
              
              # Install frontend dependencies if node_modules doesn't exist or package.json changed
              if [ ! -d "node_modules" ] || [ package.json -nt node_modules/.package-lock.json ]; then
                echo "Installing/updating frontend dependencies..."
                npm install --no-audit --no-fund
              else
                echo "Frontend dependencies are up to date"
              fi
              
              echo "Available commands:"
              echo "  npm run dev     - Start development server (frontend + backend)"
              echo "  npm run build   - Build production bundle"
              echo "  npm run test    - Run tests"
              echo "  python main.py  - Run backend server"
            '';
          };

          # Frontend-only shell for frontend development
          frontend = pkgs.mkShell {
            buildInputs = commonBuildInputs ++ frontendTools;

            shellHook = ''
              echo "Robofy Frontend Development Environment"
              echo "Node.js version: $(node --version)"
              echo "npm version: $(npm --version)"
              echo "TypeScript version: $(npx tsc --version || echo 'Not available')"
              
              # Install frontend dependencies if needed
              if [ ! -d "node_modules" ] || [ package.json -nt node_modules/.package-lock.json ]; then
                echo "Installing/updating frontend dependencies..."
                npm install --no-audit --no-fund
              else
                echo "Frontend dependencies are up to date"
              fi
              
              echo "Available commands:"
              echo "  npm run dev:frontend - Start frontend development server"
              echo "  npm run build       - Build production bundle"
              echo "  npm run test:frontend - Run frontend tests"
            '';
          };

          # Backend-only shell for backend development
          backend = pkgs.mkShell {
            buildInputs = commonBuildInputs ++ backendDependencies;

            shellHook = ''
              echo "Robofy Backend Development Environment"
              echo "Python version: $(python --version)"
              echo "Node.js version: $(node --version)"
              
              # Create virtual environment for pip packages
              if [ ! -d ".venv" ]; then
                python -m venv .venv
                source .venv/bin/activate
                pip install pydantic-settings ${builtins.toString unavailablePackages}
              else
                source .venv/bin/activate
              fi
              
              echo "Available commands:"
              echo "  npm run dev:backend - Start backend development server"
              echo "  python main.py      - Run backend server"
              echo "  npm run test:backend - Run backend tests"
            '';
          };
        };

        packages.default = pythonPackages.buildPythonPackage {
          pname = "robofy-backend";
          version = "0.1.0";
          src = ./backend;
          pyproject = true;
          build-system = with pythonPackages; [ setuptools ];
          propagatedBuildInputs = backendDependencies;
        };
      }
    );
}