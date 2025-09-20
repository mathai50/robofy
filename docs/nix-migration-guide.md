# Nix Migration Guide for Robofy Backend

## Overview
This document covers the Nix migration for the Robofy backend, providing reproducible development environments.

## Nix Configuration
The [`flake.nix`](../flake.nix) file contains the complete Nix configuration for the backend environment, including:

- **Python 3.12** as the base interpreter
- **FastAPI** and web server dependencies (uvicorn, gunicorn)
- **Database connectors** (psycopg2, asyncpg, SQLAlchemy, alembic)
- **AI service integrations** (OpenAI, Google Generative AI, Hugging Face)
- **Authentication & security** (JWT, bcrypt, cryptography)
- **SEO analysis tools** (SerpAPI, BeautifulSoup)
- **Utilities** (httpx, aiohttp, tenacity, backoff)

## Usage

### Enter Development Environment
```bash
nix develop
```

### Run Backend Services
Within the Nix environment, you can run:
```bash
cd backend
uvicorn main:app --reload
```

### Build Package
```bash
nix build
```

## Benefits
- **Reproducible environments**: Consistent dependencies across all systems
- **Isolation**: No conflicts with system Python packages
- **Version pinning**: Exact dependency versions are guaranteed
- **Easy onboarding**: New developers can get started with one command

## Troubleshooting

### Nix Command Not Found
If `nix` command is not found, restart your shell session or terminal.

### Package Issues
If specific packages are missing or have version conflicts, update the [`flake.nix`](../flake.nix) file with custom derivations.

### Python Virtual Environments
The Nix environment replaces the need for virtual environments like `.venv`. You can deactivate any active virtual environments before using Nix.