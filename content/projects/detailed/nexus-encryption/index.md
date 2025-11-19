---
slug: 'nexus-encryption'
title: 'Nexus Encryption'
subtitle: 'Cross-Platform Desktop Encryption Tool'
date: '2024-06-01'
status: 'Production - Active Use'
timeline: '3 months development'
github: 'https://github.com/JasonTeixeira/NexusEncryption'
demo: ''
tech:
  - Next.js 15
  - Tauri
  - Rust
  - Web Crypto API
  - TypeScript
metrics:
  encryption: 'AES-256-GCM'
  platforms: 'macOS, Windows, Linux'
  size: '<10MB'
hero: './hero.png'
---

## Overview

Native desktop encryption application built with Next.js 15, Tauri, and Rust. Features AES-256-GCM encryption, password vault, file encryption, and OS keychain integration for secure credential storage. Cross-platform support for macOS, Windows, and Linux with native performance.

### Key Features

- **AES-256-GCM encryption** - Industry-standard encryption algorithm
- **Password vault** - Securely store and manage passwords
- **File encryption** - Encrypt/decrypt files of any size
- **OS keychain integration** - macOS Keychain, Windows Credential Manager
- **Cross-platform** - Single codebase for Mac, Windows, Linux
- **Native performance** - Rust backend for fast encryption operations
- **Secure by design** - Zero-knowledge architecture, local-only storage

## Architecture

### Technology Stack

**Frontend (Next.js 15):**
- Modern React UI with TypeScript
- Web Crypto API for browser-side encryption
- TailwindCSS for styling
- Zustand for state management

**Backend (Tauri + Rust):**
- Native system integration
- File system operations
- OS keychain access
- Cryptography operations (rust-crypto)
- Small binary size (<10MB)

**Security:**
- AES-256-GCM encryption
- PBKDF2 key derivation
- Salt generation for each operation
- Secure random number generation

## Why Tauri?

Traditional Electron apps are bloated (100-200MB). Tauri uses the OS's native webview and Rust backend, resulting in:

- **10x smaller binaries** (~8MB vs 100MB+)
- **Lower memory usage** (native webview vs bundled Chromium)
- **Better security** (Rust's memory safety)
- **Native performance** for cryptographic operations

## Key Features

### Password Vault

Securely store passwords with:
- Master password protection
- OS keychain integration for master password storage
- AES-256-GCM encryption for all stored data
- Auto-lock after inactivity
- Search and organize passwords by category

### File Encryption

Encrypt files of any size:
- Drag-and-drop interface
- Streaming encryption for large files
- Preserves original file metadata
- Encrypted files stored with `.nxe` extension
- Batch encryption support

### OS Keychain Integration

Store master password securely:
- **macOS:** Keychain Services API
- **Windows:** Credential Manager API
- **Linux:** Secret Service API (GNOME Keyring/KWallet)

Benefits:
- No need to remember master password on trusted devices
- Biometric authentication support (Touch ID, Windows Hello)
- Encrypted storage managed by OS

## Security Design

### Zero-Knowledge Architecture

- All encryption happens locally
- No cloud storage or server communication
- Encrypted data never leaves your device
- You control your encryption keys

### Encryption Process

```
User Password
    ↓
PBKDF2 (100,000 iterations)
    ↓
Master Key (256-bit)
    ↓
AES-256-GCM Encryption
    ↓
Encrypted Data + Authentication Tag
```

### Key Derivation

Uses PBKDF2 with high iteration count to prevent brute-force attacks:
- 100,000 iterations
- Random salt generated for each encryption
- SHA-256 hash function
- 256-bit output key

## What Was Hard

### Cross-Platform File System Access

Different OS file systems have different behaviors:
- Path separators (/ vs \)
- File permissions
- Hidden files handling
- Special characters in filenames

Solution: Tauri's fs API provides cross-platform abstraction.

### Streaming Large File Encryption

Encrypting 1GB+ files in memory would crash the app. Implemented streaming encryption:
- Read file in 4MB chunks
- Encrypt each chunk separately
- Write to output file immediately
- Progress tracking for UI feedback

### OS Keychain Integration

Each platform has different APIs:
- macOS: Security framework (Objective-C)
- Windows: Credential Manager (Win32 API)
- Linux: Secret Service D-Bus protocol

Solution: Tauri plugins provide unified interface.

## Performance

| Operation | Time | Notes |
|-----------|------|-------|
| **Password encryption** | <100ms | Instant for typical passwords |
| **File encryption (100MB)** | ~2s | Depends on disk speed |
| **File encryption (1GB)** | ~20s | Streaming, doesn't block UI |
| **App startup** | <1s | Native performance |
| **Memory usage** | <50MB | Significantly less than Electron |

## Future Enhancements

- [ ] Cloud sync (optional, encrypted)
- [ ] Password generator with strength meter
- [ ] Two-factor authentication support
- [ ] Secure notes feature
- [ ] Browser extension integration
- [ ] Mobile app (iOS, Android)

## Running the App

### Development

```bash
git clone https://github.com/JasonTeixeira/NexusEncryption.git
cd NexusEncryption

# Install dependencies
npm install

# Run in development mode
npm run tauri dev
```

### Building

```bash
# Build for your platform
npm run tauri build

# Outputs to src-tauri/target/release/bundle/
# macOS: .dmg and .app
# Windows: .msi and .exe
# Linux: .deb, .AppImage
```

### Installation

Download pre-built binaries from [GitHub Releases](https://github.com/JasonTeixeira/NexusEncryption/releases).

## Key Takeaways

- **Tauri is better than Electron** for desktop apps (10x smaller, faster)
- **Rust provides memory safety** and prevents common security vulnerabilities
- **OS keychain integration** provides better UX than manual password entry
- **Streaming encryption** is essential for handling large files
- **Zero-knowledge architecture** keeps user data private

---

## Documentation

- **User Guide:** [USER_GUIDE.md](https://github.com/JasonTeixeira/NexusEncryption/blob/main/USER_GUIDE.md)
- **API Reference:** [API.md](https://github.com/JasonTeixeira/NexusEncryption/blob/main/API.md)
- **Security Whitepaper:** [SECURITY.md](https://github.com/JasonTeixeira/NexusEncryption/blob/main/SECURITY.md)

## License

MIT - See LICENSE file for details
