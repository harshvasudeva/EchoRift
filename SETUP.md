# Development Environment Setup

## What's Already Installed ✅
- **Node.js**: v22.15.0
- **npm**: v10.9.2

## What You Need to Install Manually ❌

### 1. Go (Required for Backend)
Download from: https://go.dev/dl/
```powershell
# Or use winget:
winget install -e --id GoLang.Go
```
After installation, restart your terminal and verify:
```powershell
go version
```

### 2. Docker Desktop (Required for PostgreSQL, Redis, LiveKit)
Download from: https://www.docker.com/products/docker-desktop/
- Enable WSL 2 backend during installation
- Restart computer after installation

Verify:
```powershell
docker --version
docker compose version
```

### 3. Rust & Cargo (Required for Tauri Desktop App)
Download from: https://rustup.rs/
```powershell
# Or use winget:
winget install -e --id Rustlang.Rustup
```
After installation, restart your terminal and verify:
```powershell
rustc --version
cargo --version
```

### 4. Git (Required for Version Control)
Download from: https://git-scm.com/download/win
```powershell
# Or use winget:
winget install -e --id Git.Git
```

---

## Optional Tools

### pnpm (Faster Package Manager)
```powershell
npm install -g pnpm
```

### Protocol Buffers (For API Definitions)
```powershell
winget install -e --id Google.Protobuf
```

---

## Quick Install Script

Run the following in an **Administrator PowerShell** to install everything:

```powershell
# Install Go
winget install -e --id GoLang.Go

# Install Docker Desktop
winget install -e --id Docker.DockerDesktop

# Install Rust
winget install -e --id Rustlang.Rustup

# Install Git
winget install -e --id Git.Git

# Restart required after Docker installation
Write-Host "Please restart your computer after installation completes."
```

---

## After Installation

Once all tools are installed, run:
```powershell
# Verify all installations
node --version
npm --version  
go version
docker --version
rustc --version
cargo --version
git --version
```

Then notify me and I'll proceed with project setup!
