<div align="center">

# 🌀 EchoRift

### Enterprise-Grade Real-Time Communication Platform

[![License](https://img.shields.io/badge/license-MIT-blue.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue.svg)](https://www.typescriptlang.org/)
[![React](https://img.shields.io/badge/React-18.3-61dafb.svg)](https://reactjs.org/)
[![LiveKit](https://img.shields.io/badge/LiveKit-WebRTC-green.svg)](https://livekit.io/)

*Self-hosted, scalable Discord alternative for enterprises with ultra-low latency voice, video, and screen sharing*

[Features](#-features) • [Quick Start](#-quick-start) • [Architecture](#-architecture) • [Roadmap](#-roadmap) • [Contributing](#-contributing)

</div>

---

## ✨ Features

### 🎙️ Voice Communication
- **Crystal-clear audio** with LiveKit WebRTC SFU
- **Real-time speaking indicators** with audio level visualization
- **Echo cancellation, noise suppression, auto gain control**
- **Device selection** - choose your preferred microphone and speakers

### 🖥️ Screen Sharing
- **One-click screen share** with native browser picker
- **High-quality video streaming** via VP8/VP9 codecs
- **Participant labels** showing whose screen you're viewing
- **Adaptive bitrate** for smooth streaming on any connection

### 💬 Messaging (Coming Soon)
- **Real-time text chat** with typing indicators
- **Rich message formatting** with markdown support
- **Message history** and search
- **File attachments** and image previews

### 🔐 Enterprise Security (Planned)
- **LDAP/Active Directory integration** for corporate SSO
- **End-to-end encryption** option for sensitive communications
- **Audit logging** for compliance requirements
- **Role-based access control**

### 🎨 Premium UI
- **Modern dark theme** with corporate blue accents
- **Light/dark mode toggle**
- **Glassmorphism effects** with smooth animations
- **Fully responsive** design

---

## 🚀 Quick Start

### Prerequisites

- [Node.js](https://nodejs.org/) 18+ 
- [Docker](https://www.docker.com/) & Docker Compose
- [Git](https://git-scm.com/)

### Installation

```bash
# Clone the repository
git clone https://github.com/harshvasudeva/EchoRift.git
cd EchoRift

# Start infrastructure services
cd infrastructure/docker
docker compose up -d

# Install dependencies and start the app
cd ../../apps/web
npm install
node server.js &     # Token server (port 3001)
npm run dev          # Web app (port 5173)
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

---

## 🏗️ Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         Client Layer                            │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────────────────┐  │
│  │   Web App   │  │ Desktop App │  │      Mobile App         │  │
│  │   (React)   │  │   (Tauri)   │  │  (React Native/Flutter) │  │
│  └──────┬──────┘  └──────┬──────┘  └───────────┬─────────────┘  │
└─────────┼────────────────┼─────────────────────┼────────────────┘
          │                │                     │
          ▼                ▼                     ▼
┌─────────────────────────────────────────────────────────────────┐
│                      API Gateway (Go/Fiber)                     │
│            JWT Auth • Rate Limiting • Load Balancing            │
└───────────────────────────────┬─────────────────────────────────┘
                                │
        ┌───────────────────────┼───────────────────────┐
        ▼                       ▼                       ▼
┌───────────────┐      ┌───────────────┐      ┌───────────────┐
│   LiveKit     │      │     NATS      │      │  PostgreSQL   │
│  (WebRTC SFU) │      │   (Pub/Sub)   │      │  (Database)   │
│   + coturn    │      │  + JetStream  │      │               │
└───────────────┘      └───────────────┘      └───────────────┘
        │                       │                       │
        └───────────────────────┼───────────────────────┘
                                ▼
                        ┌───────────────┐
                        │     Redis     │
                        │   (Cache)     │
                        └───────────────┘
```

### Tech Stack

| Layer | Technology |
|-------|------------|
| Frontend | React 18, TypeScript, Vite, Zustand |
| Real-time Voice/Video | LiveKit (WebRTC SFU) |
| Backend API | Go with Fiber (planned) |
| Messaging | NATS with JetStream |
| Database | PostgreSQL |
| Cache | Redis |
| NAT Traversal | coturn (TURN/STUN) |
| Desktop | Tauri (planned) |

---

## 🌐 Self-Hosting Guide

### Development Setup

```bash
# 1. Clone and navigate
git clone https://github.com/harshvasudeva/EchoRift.git
cd EchoRift

# 2. Copy environment template
cp .env.example .env

# 3. Start Docker services
cd infrastructure/docker
docker compose up -d

# 4. Verify services are running
docker ps
# Should show: echorift-livekit, echorift-redis, echorift-nats, echorift-coturn

# 5. Start web application
cd ../../apps/web
npm install
npm run dev
```

### Production Deployment

#### Using Docker Compose

```yaml
# docker-compose.prod.yml
services:
  web:
    build: ./apps/web
    ports:
      - "80:80"
    environment:
      - LIVEKIT_URL=wss://your-domain.com
      - API_URL=https://your-domain.com/api
      
  livekit:
    image: livekit/livekit-server:latest
    network_mode: host
    environment:
      - LIVEKIT_KEYS=your_api_key: your_secret_key
```

#### Using Kubernetes

```bash
# Apply Kubernetes manifests
kubectl apply -f infrastructure/k8s/
```

### Port Reference

| Service | Port | Protocol |
|---------|------|----------|
| Web App | 5173 | HTTP |
| Token Server | 3001 | HTTP |
| LiveKit | 7880 | WS/HTTP |
| LiveKit RTC | 7881 | TCP |
| LiveKit RTC | 7882 | UDP |
| Redis | 6379 | TCP |
| NATS | 4222 | TCP |
| NATS Monitor | 8222 | HTTP |
| TURN/STUN | 3478 | UDP/TCP |

---

## 🗺️ Roadmap

### ✅ Completed
- [x] Premium UI with dark/light mode
- [x] Voice channels with LiveKit integration
- [x] Audio level visualization & speaking indicators
- [x] Device selection (mic/speaker)
- [x] Screen sharing with video display
- [x] Mute, deafen, disconnect controls
- [x] Docker infrastructure setup

### 🚧 In Progress
- [ ] LDAP/Active Directory authentication
- [ ] Go backend API
- [ ] Text messaging with real-time sync

### 📋 Planned
- [ ] Video calls with camera support
- [ ] End-to-end encryption
- [ ] Tauri desktop application
- [ ] Mobile apps (React Native)
- [ ] File sharing & attachments
- [ ] Custom server/channel creation
- [ ] Role & permission management
- [ ] Webhook integrations
- [ ] Bot/automation API

---

## 🤝 Contributing

Contributions are welcome! Please read our contributing guidelines before submitting a pull request.

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

<div align="center">

**Built with ❤️ for enterprises who value privacy and performance**

[⬆ Back to top](#-echorift)

</div>
