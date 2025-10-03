# Nix Migration Guide for Robofy Full Stack Application

## Overview
This document covers the Nix migration for the Robofy full stack application, providing reproducible development environments for both backend and frontend.

## Nix Configuration
The [`flake.nix`](../flake.nix) file contains the complete Nix configuration for the full stack environment, including:

- **Python 3.12** as the base interpreter
- **FastAPI** and web server dependencies (uvicorn, gunicorn)
- **Database connectors** (psycopg2, asyncpg, SQLAlchemy, alembic)
- **AI service integrations** (OpenAI, Google Generative AI, Hugging Face)
- **Authentication & security** (JWT, bcrypt, cryptography)
- **SEO analysis tools** (SerpAPI, BeautifulSoup)
- **Utilities** (httpx, aiohttp, tenacity, backoff)
- **Frontend development** (Node.js 22, npm, TypeScript, ESLint, Prettier, Jest, Nx)
- **Build tooling** for reproducible frontend builds

## Usage

### Available Development Shells
The Nix configuration provides multiple development environments:

1. **Default shell** (full stack): `nix develop`
2. **Frontend-only shell**: `nix develop .#frontend`
3. **Backend-only shell**: `nix develop .#backend`

### Enter Development Environment
```bash
# Full stack development
NIXPKGS_ALLOW_BROKEN=1 nix develop --extra-experimental-features nix-command --extra-experimental-features flakes --impure

# Frontend only development
NIXPKGS_ALLOW_BROKEN=1 nix develop .#frontend --extra-experimental-features nix-command --extra-experimental-features flakes --impure

# Backend only development
NIXPKGS_ALLOW_BROKEN=1 nix develop .#backend --extra-experimental-features nix-command --extra-experimental-features flakes --impure
```

### Run Development Services

**Frontend development:**
```bash
npm run dev:frontend
```

**Backend development:**
```bash
npm run dev:backend
```

**Full stack development:**
```bash
npm run dev
```

### Build Packages

**Build backend package:**
```bash
NIXPKGS_ALLOW_BROKEN=1 nix build .#backend --extra-experimental-features nix-command --extra-experimental-features flakes --impure
```

**Build frontend package:**
```bash
NIXPKGS_ALLOW_BROKEN=1 nix build .#frontend --extra-experimental-features nix-command --extra-experimental-features flakes --impure
```

**Build both packages:**
```bash
NIXPKGS_ALLOW_BROKEN=1 nix build --extra-experimental-features nix-command --extra-experimental-features flakes --impure
```

## Benefits
- **Reproducible environments**: Consistent dependencies across all systems for both frontend and backend
- **Isolation**: No conflicts with system Python or Node.js packages
- **Version pinning**: Exact dependency versions are guaranteed
- **Easy onboarding**: New developers can get started with one command
- **Multiple environments**: Separate shells for frontend, backend, or full stack development

## Troubleshooting

### Nix Command Not Found
If `nix` command is not found, restart your shell session or terminal.

### Package Issues
If specific packages are missing or have version conflicts, update the [`flake.nix`](../flake.nix) file with custom derivations.

### Python Virtual Environments
The Nix environment replaces the need for virtual environments like `.venv`. You can deactivate any active virtual environments before using Nix.

### Node.js Dependencies
If node_modules issues occur, delete the node_modules directory and re-enter the Nix shell to reinstall dependencies.

### Build Issues
For frontend build issues, ensure all environment variables are set correctly in the Nix environment.